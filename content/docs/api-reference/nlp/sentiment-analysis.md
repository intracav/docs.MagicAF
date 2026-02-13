---
title: "Sentiment Analysis"
description: "Classify text into positive or negative sentiment with confidence scores. Ideal for feedback analysis, social media monitoring, and opinion mining."
weight: 3
keywords: [sentiment analysis, opinion mining, SST-2, DistilBERT, text classification]
---

Sentiment analysis classifies text into **positive** or **negative** polarity with a confidence score. It runs entirely in-process using a lightweight DistilBERT model — no external API calls required.

---

## Overview

**Module:** `magicaf_nlp::sentiment`
**Default Model:** DistilBERT fine-tuned on SST-2 (Stanford Sentiment Treebank)
**Task:** Binary sentiment classification (Positive / Negative)

### When to Use

- ✅ You need to gauge opinion or tone in text
- ✅ You're building feedback analysis or review processing pipelines
- ✅ You want fast, lightweight binary sentiment classification
- ✅ You need zero external service dependencies

### When Not to Use

- ❌ You need fine-grained sentiment (neutral, mixed, or multi-class) — consider zero-shot classification
- ❌ You need aspect-based sentiment (e.g. "food was great but service was poor")
- ❌ You need emotion detection beyond positive/negative (e.g. joy, anger, fear)

---

## Quick Example

```rust
use magicaf_nlp::sentiment::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = SentimentPipeline::new(SentimentConfig::default()).await?;

    let results = pipeline.predict(&[
        "This framework is amazing!",
        "Worst experience of my life.",
    ]).await?;

    for r in &results {
        println!("{:?}: {:.4}", r.polarity, r.score);
    }
    // → Positive: 0.9984
    //   Negative: 0.9967

    Ok(())
}
```

---

## API Reference

### Types

#### `SentimentPolarity`

```rust
pub enum SentimentPolarity {
    Positive,
    Negative,
}
```

#### `SentimentResult`

```rust
pub struct SentimentResult {
    pub polarity: SentimentPolarity,  // Positive or Negative
    pub score: f64,                   // Confidence score (0.0–1.0)
}
```

#### `SentimentConfig`

```rust
pub struct SentimentConfig {
    pub source: ModelSource,  // Where to load the model
    pub device: Device,       // CPU or CUDA
}
```

### Methods

#### `new(config: SentimentConfig) -> Result<Self>`

Creates a new sentiment analysis pipeline. Model loading happens asynchronously on a background thread.

```rust
let pipeline = SentimentPipeline::new(SentimentConfig {
    source: ModelSource::Default,
    device: Device::Cpu,
}).await?;
```

#### `predict(texts) -> Result<Vec<SentimentResult>>`

Classifies sentiment of one or more texts.

**Parameters:**
- `texts: &[&str]` — one or more text inputs

**Returns:** One `SentimentResult` per input text, each with polarity and confidence score.

```rust
let results = pipeline.predict(&[
    "I love this product!",
    "This is terrible.",
    "The meeting went well overall.",
]).await?;

for r in &results {
    println!("{:?} ({:.2}%)", r.polarity, r.score * 100.0);
}
```

---

## Configuration

### Default Model

```rust
let config = SentimentConfig::default();
// Uses DistilBERT fine-tuned on SST-2
// Downloads from HuggingFace Hub on first use
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = SentimentConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/distilbert-sentiment".into(),
    },
    device: Device::Cpu,
};
```

**Required files:**
- `rust_model.ot` (PyTorch weights)
- `config.json` (model configuration)
- `vocab.txt` (tokenizer vocabulary)

### GPU Acceleration

```rust
let config = SentimentConfig {
    source: ModelSource::Default,
    device: Device::Cuda(0),  // Use GPU 0
};
```

---

## Advanced Usage

### Batch Processing

```rust
let reviews = vec![
    "Absolutely fantastic, will buy again!",
    "Product arrived damaged, very disappointed.",
    "Works as expected, nothing special.",
    "Best purchase I've made this year!",
    "Terrible quality, broke after one day.",
];

let results = pipeline.predict(&reviews).await?;

let positive_count = results.iter().filter(|r| r.polarity == SentimentPolarity::Positive).count();
let negative_count = results.iter().filter(|r| r.polarity == SentimentPolarity::Negative).count();

println!("Positive: {positive_count}, Negative: {negative_count}");
```

### Confidence Thresholding

Filter out uncertain predictions by applying a confidence threshold:

```rust
let results = pipeline.predict(&[
    "This is great!",            // High confidence positive
    "It was okay I guess.",      // Ambiguous — lower confidence
    "Absolutely terrible.",      // High confidence negative
]).await?;

for (text, result) in texts.iter().zip(&results) {
    if result.score > 0.9 {
        println!("[CONFIDENT] {:?}: {}", result.polarity, text);
    } else {
        println!("[UNCERTAIN] {:?} ({:.2}): {}", result.polarity, result.score, text);
    }
}
```

### Aggregating Sentiment Over a Document

For long documents, split into sentences and aggregate:

```rust
let sentences = vec![
    "The hotel room was spacious and clean.",
    "However, the restaurant food was disappointing.",
    "Staff were friendly and helpful.",
    "The pool area was poorly maintained.",
];

let results = pipeline.predict(&sentences).await?;

let avg_score: f64 = results.iter()
    .map(|r| match r.polarity {
        SentimentPolarity::Positive => r.score,
        SentimentPolarity::Negative => -r.score,
    })
    .sum::<f64>() / results.len() as f64;

println!("Overall sentiment: {:.4} (positive > 0, negative < 0)", avg_score);
```

---

## Comparison with Zero-Shot Classification

| Aspect | Sentiment (this module) | Zero-Shot Classification |
|--------|------------------------|--------------------------|
| **Labels** | Fixed: Positive / Negative | Arbitrary labels at inference time |
| **Granularity** | Binary | Multi-class (unlimited labels) |
| **Model size** | ~250MB (DistilBERT) | ~1.6GB (BART-MNLI) |
| **Speed** | Very fast (~20–50ms per text) | Slower (~200–500ms per text) |
| **Use case** | Quick binary opinion detection | Flexible multi-class categorisation |

**When to use Sentiment Analysis:**
- You only need positive/negative classification
- Speed and memory efficiency matter
- You're processing high volumes of text

**When to use Zero-Shot:**
- You need neutral, mixed, or custom sentiment categories
- You need emotion detection (joy, anger, surprise, etc.)
- Labels may change at runtime

---

## Performance

- **Model size:** ~250MB (DistilBERT)
- **Inference speed:** ~20–50ms per text on CPU
- **Memory:** ~500MB–1GB RAM
- **Batch processing:** Highly efficient for multiple texts

---

## Troubleshooting

### Neutral Text Classified as Positive/Negative

The default SST-2 model is binary — there is no neutral class. Ambiguous or neutral text will still be assigned either Positive or Negative, often with a lower confidence score:

```rust
let results = pipeline.predict(&["The meeting is at 3pm."]).await?;
// May return Positive or Negative with a low score (~0.5–0.6)
```

Use the confidence score to identify uncertain predictions. For a neutral class, consider [Zero-Shot Classification](/docs/api-reference/nlp/zero-shot-classification/) with labels like `["positive", "negative", "neutral"]`.

### Sarcasm and Irony

Sentiment models may struggle with sarcastic text:

```rust
pipeline.predict(&["Oh great, another meeting."]).await?;
// May classify as Positive due to the word "great"
```

This is a known limitation of most sentiment models. For nuanced understanding, consider pairing with a larger LLM.

### Domain-Specific Language

The SST-2 model is trained on movie reviews. For domain-specific text (medical, legal, financial), consider fine-tuning a custom model and loading it via `ModelSource::Local`.

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/api-reference/nlp/use-cases/) for sentiment dashboards
- **Explore Other Pipelines:** See [Pipelines](/docs/api-reference/nlp/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/api-reference/nlp/setup/)
