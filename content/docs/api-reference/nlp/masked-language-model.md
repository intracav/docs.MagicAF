---
title: "Masked Language Model"
description: "Predict masked (hidden) words in context using BERT. Perfect for fill-in-the-blank tasks, vocabulary assessment, text augmentation, and probing language understanding."
weight: 10
keywords: [masked language model, MLM, BERT, fill-in-the-blank, cloze task, word prediction]
---

Masked language modelling predicts the most likely word for each `[MASK]` token in the input, using the surrounding context. This is the core pre-training task of BERT-family models and is useful for fill-in-the-blank tasks, text augmentation, vocabulary assessment, and probing what a language model has learned.

---

## Overview

**Module:** `magicaf_nlp::masked_lm`
**Default Model:** BERT base (uncased)
**Task:** Predict the most likely word(s) for each masked position

### When to Use

- ✅ You need fill-in-the-blank word prediction
- ✅ You're building vocabulary assessment or language learning tools
- ✅ You want data augmentation by generating word alternatives
- ✅ You're probing what a language model knows about word associations

### When Not to Use

- ❌ You need free-form text generation (use text generation or dialogue)
- ❌ You need to classify text into categories (use sentiment or zero-shot classification)
- ❌ You need to understand document meaning (use summarization or keyword extraction)

---

## Quick Example

```rust
use magicaf_nlp::masked_lm::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = MaskedLmPipeline::new(MaskedLmConfig::default()).await?;

    let results = pipeline.predict(&[
        "Hello I am a [MASK] student",
        "Paris is the [MASK] of France. It is [MASK] in Europe.",
    ]).await?;

    for (i, sentence_results) in results.iter().enumerate() {
        for token in sentence_results {
            println!("[{i}] {} (score: {:.4})", token.text, token.score);
        }
    }
    // → [0] college (score: 8.0910)
    //   [1] capital (score: 16.7249)
    //   [1] located (score: 9.0452)

    Ok(())
}
```

---

## API Reference

### Types

#### `MaskedToken`

```rust
pub struct MaskedToken {
    pub text: String,  // The predicted word
    pub id: i64,       // Vocabulary token ID
    pub score: f64,    // Raw logit score (not a probability; higher = more likely)
}
```

> **Note:** The `score` field contains raw logits, not probabilities. Higher values indicate more likely predictions, but scores are not bounded to 0.0–1.0.

#### `MaskedLmConfig`

```rust
pub struct MaskedLmConfig {
    pub source: ModelSource,  // Where to load the model
    pub device: Device,       // CPU or CUDA
}
```

### Mask Tokens

The mask token depends on the underlying model:

| Model Family | Mask Token | Example |
|-------------|-----------|---------|
| BERT (default) | `[MASK]` | `"The [MASK] is blue."` |
| RoBERTa | `<mask>` | `"The <mask> is blue."` |

### Methods

#### `new(config: MaskedLmConfig) -> Result<Self>`

Creates a new masked language model pipeline. Model loading happens asynchronously on a background thread.

```rust
let pipeline = MaskedLmPipeline::new(MaskedLmConfig {
    source: ModelSource::Default,
    device: Device::Cpu,
}).await?;
```

#### `predict(texts) -> Result<Vec<Vec<MaskedToken>>>`

Predicts the most likely token(s) for each masked position.

**Parameters:**
- `texts: &[&str]` — one or more texts containing mask tokens

**Returns:** One `Vec<MaskedToken>` per input text. Each inner vec contains one prediction per `[MASK]` token in that text.

```rust
let results = pipeline.predict(&[
    "The [MASK] jumped over the fence.",
    "She is a [MASK] [MASK].",
]).await?;

// results[0] → one MaskedToken (one mask in first text)
// results[1] → two MaskedTokens (two masks in second text)
```

---

## Configuration

### Default Model

```rust
let config = MaskedLmConfig::default();
// Uses BERT base (uncased)
// Downloads from HuggingFace Hub on first use
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = MaskedLmConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/bert-base".into(),
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
let config = MaskedLmConfig {
    source: ModelSource::Default,
    device: Device::Cuda(0),  // Use GPU 0
};
```

---

## Advanced Usage

### Multiple Masks in One Sentence

Each `[MASK]` token generates an independent prediction:

```rust
let results = pipeline.predict(&[
    "The [MASK] [MASK] ran across the [MASK].",
]).await?;

for (i, token) in results[0].iter().enumerate() {
    println!("Mask {}: {} (score: {:.4})", i + 1, token.text, token.score);
}
// → Mask 1: little (score: 7.23)
//   Mask 2: boy (score: 9.41)
//   Mask 3: street (score: 8.76)
```

### Batch Processing

```rust
let sentences = vec![
    "The weather today is [MASK].",
    "She works as a [MASK].",
    "Rust is a [MASK] programming language.",
    "The cat sat on the [MASK].",
];

let results = pipeline.predict(&sentences).await?;

for (sentence, predictions) in sentences.iter().zip(&results) {
    let filled: &str = &predictions[0].text;
    println!("{} → {}", sentence, filled);
}
```

### Word Association Probing

Use masked LM to probe what the model has learned about associations:

```rust
let results = pipeline.predict(&[
    "The capital of Germany is [MASK].",
    "Water freezes at [MASK] degrees.",
    "The opposite of hot is [MASK].",
]).await?;

for (i, tokens) in results.iter().enumerate() {
    println!("Q{}: {}", i + 1, tokens[0].text);
}
// → Q1: berlin
//   Q2: zero
//   Q3: cold
```

### Text Augmentation

Generate word alternatives for data augmentation:

```rust
let original = "The quick brown fox jumps over the lazy dog.";

// Mask one word at a time and collect alternatives
let masked_versions = vec![
    "The [MASK] brown fox jumps over the lazy dog.",
    "The quick [MASK] fox jumps over the lazy dog.",
    "The quick brown [MASK] jumps over the lazy dog.",
];

let results = pipeline.predict(&masked_versions).await?;

for (masked, predictions) in masked_versions.iter().zip(&results) {
    println!("{} → {}", masked, predictions[0].text);
}
```

### Comparing Token Scores

Since scores are raw logits, compare them relative to each other rather than in absolute terms:

```rust
let results = pipeline.predict(&[
    "She is a [MASK] engineer.",
]).await?;

// The top prediction has the highest logit
let top = &results[0][0];
println!("Top prediction: {} (score: {:.4})", top.text, top.score);

// To compare multiple options, run separate predictions and compare scores
```

---

## How It Works

1. The input text with `[MASK]` tokens is fed through the BERT encoder
2. For each masked position, the model outputs a logit score for every token in its vocabulary (~30,000 tokens for BERT base)
3. The token with the highest logit is returned as the prediction
4. Context from both **left and right** of the mask is used (bidirectional attention)

This bidirectional context is what makes masked LM different from left-to-right generation models like GPT — the model can "see" the full sentence when predicting.

---

## Performance

- **Model size:** ~440MB (BERT base)
- **Inference speed:** ~30–100ms per text on CPU
- **Memory:** ~1–2GB RAM
- **Batch processing:** Efficient for multiple texts

---

## Troubleshooting

### Unexpected Predictions

BERT base is an uncased model — all text is lowercased before processing. If you need case-sensitive predictions, load a cased BERT model via `ModelSource::Local`.

### Wrong Mask Token

If predictions are nonsensical, ensure you're using the correct mask token for your model:
- BERT: `[MASK]`
- RoBERTa: `<mask>`

Using the wrong mask token will produce unpredictable results.

### Scores Are Not Probabilities

The `score` field contains raw logits. If you need probabilities, apply softmax across all vocabulary logits. The scores returned are the **top-1** logits per mask position, so they are useful for comparison but not interpretable as probabilities.

### Multiple Masks Interact

When using multiple `[MASK]` tokens, each prediction is made independently. The model does not condition later masks on earlier predictions. For sequential generation, consider the text generation pipeline instead.

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/api-reference/nlp/use-cases/) for practical masked LM workflows
- **Explore Other Pipelines:** See [Pipelines](/docs/api-reference/nlp/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/api-reference/nlp/setup/)
