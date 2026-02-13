---
title: "Zero-Shot Classification"
description: "Classify text into arbitrary categories without fine-tuning. Define your labels at inference time and the model predicts the best match."
weight: 4
keywords: [zero-shot classification, text classification, BART, MNLI, natural language inference]
---

Zero-shot classification lets you categorise text into **arbitrary labels** without any task-specific fine-tuning. Simply provide candidate labels at inference time and the model predicts which best describe each input — powered by natural language inference.

---

## Overview

**Module:** `magicaf_nlp::zero_shot`
**Default Model:** BART large fine-tuned on MNLI (Multi-Genre Natural Language Inference)
**Task:** Classify text into user-defined categories at inference time

### When to Use

- ✅ Your categories may change at runtime — no retraining needed
- ✅ You need multi-label classification (text can match multiple labels)
- ✅ You don't have labelled training data for your specific task
- ✅ You want flexible topic detection, intent classification, or content routing

### When Not to Use

- ❌ You only need binary positive/negative classification (use sentiment analysis — faster)
- ❌ You have a large labelled dataset and want maximum accuracy (fine-tune a dedicated model)
- ❌ You need token-level classification like NER (use the NER pipeline)

---

## Quick Example

```rust
use magicaf_nlp::zero_shot::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = ZeroShotPipeline::new(ZeroShotConfig::default()).await?;

    let results = pipeline.classify(
        &["Who are you voting for in 2024?"],
        &["politics", "sports", "technology", "science"],
        None,
        128,
    ).await?;

    for r in &results[0] {
        println!("{}: {:.4}", r.label, r.score);
    }
    // → politics: 0.9723
    //   technology: 0.0134
    //   science: 0.0087
    //   sports: 0.0056

    Ok(())
}
```

---

## API Reference

### Types

#### `ClassificationResult`

```rust
pub struct ClassificationResult {
    pub label: String,  // The candidate label
    pub score: f64,     // Predicted probability (0.0–1.0)
}
```

#### `ZeroShotConfig`

```rust
pub struct ZeroShotConfig {
    pub source: ModelSource,  // Where to load the model
    pub device: Device,       // CPU or CUDA
}
```

### Methods

#### `new(config: ZeroShotConfig) -> Result<Self>`

Creates a new zero-shot classification pipeline. Model loading happens asynchronously on a background thread.

```rust
let pipeline = ZeroShotPipeline::new(ZeroShotConfig {
    source: ModelSource::Default,
    device: Device::Cpu,
}).await?;
```

#### `classify(texts, labels, hypothesis_template, max_length) -> Result<Vec<Vec<ClassificationResult>>>`

Classifies texts against a set of candidate labels.

**Parameters:**
- `texts: &[&str]` — one or more text inputs
- `labels: &[&str]` — candidate labels to classify against
- `hypothesis_template: Option<Box<dyn Fn(&str) -> String + Send + 'static>>` — optional custom template for generating hypotheses (see [Custom Templates](#custom-hypothesis-templates) below)
- `max_length: usize` — maximum token length for the combined premise + hypothesis

**Returns:** One `Vec<ClassificationResult>` per input text. Each inner vec contains one result per label, sorted by descending score.

```rust
let results = pipeline.classify(
    &["Breaking: new species discovered in the Amazon"],
    &["science", "politics", "sports", "entertainment"],
    None,
    128,
).await?;

// results[0] → one ClassificationResult per label, highest score first
```

---

## Configuration

### Default Model

```rust
let config = ZeroShotConfig::default();
// Uses BART large fine-tuned on MNLI
// Downloads from HuggingFace Hub on first use
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = ZeroShotConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/bart-mnli".into(),
    },
    device: Device::Cpu,
};
```

**Required files:**
- `rust_model.ot` (PyTorch weights)
- `config.json` (model configuration)
- `vocab.json` and `merges.txt` (tokenizer files)

### GPU Acceleration

```rust
let config = ZeroShotConfig {
    source: ModelSource::Default,
    device: Device::Cuda(0),  // Use GPU 0
};
```

---

## Advanced Usage

### Custom Hypothesis Templates

The model works by converting each label into a hypothesis and checking entailment. The default template is `"This example is about {label}."` You can customise this for better accuracy on your domain:

```rust
let results = pipeline.classify(
    &["The patient reported chest pain and shortness of breath."],
    &["cardiology", "neurology", "orthopedics", "dermatology"],
    Some(Box::new(|label: &str| {
        format!("This clinical note is related to {label}.")
    })),
    128,
).await?;
```

### Multi-Label Classification

Zero-shot naturally supports multi-label scenarios where a text can match multiple labels:

```rust
let results = pipeline.classify(
    &["Tesla stock surges after AI breakthrough announcement"],
    &["technology", "finance", "automotive", "science"],
    None,
    128,
).await?;

// Multiple labels may score highly:
// technology: 0.82
// finance: 0.71
// automotive: 0.45
// science: 0.33

let relevant: Vec<&ClassificationResult> = results[0].iter()
    .filter(|r| r.score > 0.5)
    .collect();
println!("Relevant topics: {:?}", relevant.iter().map(|r| &r.label).collect::<Vec<_>>());
```

### Batch Processing

```rust
let texts = vec![
    "The goalkeeper made an incredible save in the final minute.",
    "New research suggests dark matter may interact with light.",
    "The central bank raised interest rates by 50 basis points.",
];

let labels = &["sports", "science", "finance", "politics", "technology"];

let results = pipeline.classify(&texts, labels, None, 128).await?;

for (i, text_results) in results.iter().enumerate() {
    let top = &text_results[0];  // Highest-scoring label
    println!("Text {}: {} ({:.4})", i + 1, top.label, top.score);
}
```

### Intent Detection

Zero-shot is well-suited for detecting user intent in chatbot or routing applications:

```rust
let results = pipeline.classify(
    &["I want to cancel my subscription"],
    &["cancellation", "billing inquiry", "technical support", "general question"],
    Some(Box::new(|label: &str| {
        format!("The user's intent is {label}.")
    })),
    128,
).await?;
```

---

## How It Works

Zero-shot classification uses **natural language inference (NLI)**:

1. For each input text and each candidate label, the model constructs a hypothesis (e.g. `"This example is about politics."`)
2. The NLI model predicts whether the input text **entails** the hypothesis
3. Entailment scores are normalised across all labels to produce probabilities

This approach works because the MNLI-trained model has learned general textual entailment, which transfers to arbitrary classification tasks.

---

## Performance

- **Model size:** ~1.6GB (BART large)
- **Inference speed:** ~200–500ms per text on CPU (scales with number of labels)
- **Memory:** ~3–4GB RAM
- **Scaling:** Cost is proportional to `num_texts × num_labels` (each pair requires one inference)

---

## Troubleshooting

### Low Scores Across All Labels

If all labels score low (< 0.3), the text may not match any of your candidate labels well. Try:
- Adding more relevant labels
- Customising the hypothesis template to better match your domain
- Increasing `max_length` if your texts are being truncated

### Similar Scores for Multiple Labels

If labels score very similarly, they may be too semantically close. Try using more distinct labels:

```rust
// Too similar — may produce close scores
&["technology", "tech", "computing"]

// Better — more distinct labels
&["technology", "healthcare", "finance"]
```

### Slow Inference

Each label requires a separate NLI pass. If you have many labels:
- Reduce the label set to only the most relevant candidates
- Use GPU acceleration (`Device::Cuda(0)`)
- Consider a two-stage approach: coarse labels first, then fine-grained

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/api-reference/nlp/use-cases/) for classification workflows
- **Explore Other Pipelines:** See [Pipelines](/docs/api-reference/nlp/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/api-reference/nlp/setup/)
