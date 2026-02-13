---
title: "Summarization"
description: "Condense long documents into concise abstractive summaries. Powered by BART-large-CNN with configurable length, beam search, and length penalty."
weight: 6
keywords: [summarization, abstractive summary, BART, CNN/DailyMail, text condensation]
---

Abstractive summarization condenses long documents into concise summaries while **preserving key information**. Unlike extractive methods that copy sentences, this pipeline generates new, fluent text that captures the essence of the input.

---

## Overview

**Module:** `magicaf_nlp::summarization`
**Default Model:** BART large fine-tuned on CNN/DailyMail
**Task:** Generate abstractive summaries from one or more documents

### When to Use

- ✅ You need to condense long articles, reports, or documents
- ✅ You want fluent, human-readable summaries (not extracted sentences)
- ✅ You need configurable summary length and quality trade-offs
- ✅ You want zero external service dependencies

### When Not to Use

- ❌ You need extractive summaries (exact sentences from the original text)
- ❌ You need summaries of very short text (< 50 words) — the text is already short
- ❌ You need multi-document summarization with cross-reference (summarize each document, then combine)

---

## Quick Example

```rust
use magicaf_nlp::summarization::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = SummarizationPipeline::new(SummaryConfig::default()).await?;

    let summaries = pipeline.summarize(&[
        "The tower is 324 metres (1,063 ft) tall, about the same height as an \
         81-storey building, and the tallest structure in Paris. Its base is square, \
         measuring 125 metres on each side. During its construction, the Eiffel Tower \
         surpassed the Washington Monument to become the tallest man-made structure in \
         the world, a title it held for 41 years until the Chrysler Building in New \
         York City was finished in 1930. It was the first structure to reach a height \
         of 300 metres.",
    ]).await?;

    println!("{}", summaries[0].text);
    // → "The tower is 324 metres tall, the tallest structure in Paris. It surpassed
    //    the Washington Monument to become the tallest man-made structure in the world."

    Ok(())
}
```

---

## API Reference

### Types

#### `Summary`

```rust
pub struct Summary {
    pub text: String,  // The generated summary text
}
```

#### `SummaryConfig`

```rust
pub struct SummaryConfig {
    pub source: ModelSource,         // Where to load the model
    pub min_length: Option<i64>,     // Minimum summary length in tokens
    pub max_length: Option<i64>,     // Maximum summary length in tokens
    pub num_beams: Option<i64>,      // Number of beams for beam search
    pub length_penalty: Option<f64>, // > 1.0 encourages longer summaries
    pub device: Device,              // CPU or CUDA
}
```

### Configuration Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `min_length` | Model default | Minimum number of tokens in the summary |
| `max_length` | Model default | Maximum number of tokens in the summary |
| `num_beams` | Model default | Beam search width (higher = better quality, slower) |
| `length_penalty` | Model default | Values > 1.0 encourage longer summaries, < 1.0 shorter |

### Methods

#### `new(config: SummaryConfig) -> Result<Self>`

Creates a new summarization pipeline. Model loading happens asynchronously on a background thread.

```rust
let pipeline = SummarizationPipeline::new(SummaryConfig {
    source: ModelSource::Default,
    device: Device::Cpu,
    ..Default::default()
}).await?;
```

#### `summarize(texts) -> Result<Vec<Summary>>`

Summarizes one or more documents.

**Parameters:**
- `texts: &[&str]` — one or more documents to summarize

**Returns:** One `Summary` per input document.

```rust
let summaries = pipeline.summarize(&[
    "Long document text here...",
    "Another long document...",
]).await?;

for s in &summaries {
    println!("{}", s.text);
}
```

---

## Configuration

### Default Model

```rust
let config = SummaryConfig::default();
// Uses BART large fine-tuned on CNN/DailyMail
// Downloads from HuggingFace Hub on first use
// All generation parameters use model defaults
```

### Custom Length

```rust
let config = SummaryConfig {
    min_length: Some(30),
    max_length: Some(100),
    ..Default::default()
};
```

### Higher Quality (More Beams)

```rust
let config = SummaryConfig {
    num_beams: Some(6),         // More beams = better quality, slower
    length_penalty: Some(1.2),  // Encourage slightly longer summaries
    ..Default::default()
};
```

### Fast, Short Summaries

```rust
let config = SummaryConfig {
    num_beams: Some(2),          // Fewer beams = faster
    max_length: Some(50),        // Short summaries
    length_penalty: Some(0.8),   // Encourage brevity
    ..Default::default()
};
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = SummaryConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/bart-summarization".into(),
    },
    device: Device::Cpu,
    ..Default::default()
};
```

**Required files:**
- `rust_model.ot` (PyTorch weights)
- `config.json` (model configuration)
- `vocab.json` and `merges.txt` (tokenizer files)

### GPU Acceleration

```rust
let config = SummaryConfig {
    source: ModelSource::Default,
    device: Device::Cuda(0),
    ..Default::default()
};
```

---

## Advanced Usage

### Batch Processing

```rust
let articles = vec![
    "First long article text...",
    "Second long article text...",
    "Third long article text...",
];

let summaries = pipeline.summarize(&articles).await?;

for (i, summary) in summaries.iter().enumerate() {
    println!("Article {}: {}", i + 1, summary.text);
}
```

### Controlling Summary Length

Adjust `min_length` and `max_length` to control output size:

```rust
// Very concise (headline-style)
let config = SummaryConfig {
    max_length: Some(30),
    length_penalty: Some(0.6),
    ..Default::default()
};

// Detailed summary
let config = SummaryConfig {
    min_length: Some(100),
    max_length: Some(300),
    length_penalty: Some(1.5),
    ..Default::default()
};
```

### Combining with Other Pipelines

Summarize, then extract entities or keywords:

```rust
use magicaf_nlp::summarization::*;
use magicaf_nlp::ner::*;

let summarizer = SummarizationPipeline::new(SummaryConfig::default()).await?;
let ner = NerPipeline::new(NerConfig::default()).await?;

let summaries = summarizer.summarize(&[long_document]).await?;
let entities = ner.predict(&[&summaries[0].text]).await?;

println!("Summary: {}", summaries[0].text);
println!("Key entities: {:?}", entities[0].iter().map(|e| &e.word).collect::<Vec<_>>());
```

---

## How It Works

BART (Bidirectional and Auto-Regressive Transformer) uses an encoder-decoder architecture:

1. **Encoder** reads the full input document and builds contextual representations
2. **Decoder** generates the summary token by token, attending to the encoder output
3. **Beam search** explores multiple candidate sequences to find the best summary
4. **Length penalty** biases the search toward summaries of the desired length

The CNN/DailyMail fine-tuning teaches the model to produce news-style summaries that capture the most important information.

---

## Performance

- **Model size:** ~1.6GB (BART large)
- **Inference speed:** ~500ms–2s per document on CPU (varies with input/output length)
- **Memory:** ~3–4GB RAM
- **Batch processing:** Efficient for multiple documents

---

## Troubleshooting

### Summary Too Short or Too Long

Adjust `min_length`, `max_length`, and `length_penalty`:

```rust
// If summaries are too short
let config = SummaryConfig {
    min_length: Some(80),
    length_penalty: Some(1.5),  // Encourage longer output
    ..Default::default()
};

// If summaries are too long
let config = SummaryConfig {
    max_length: Some(50),
    length_penalty: Some(0.6),  // Encourage brevity
    ..Default::default()
};
```

### Repetitive Output

If the summary contains repeated phrases, increase beam search and rely on built-in repetition handling:

```rust
let config = SummaryConfig {
    num_beams: Some(6),
    ..Default::default()
};
```

### Input Too Long

The BART model has a maximum input length (typically 1024 tokens). For very long documents:
- Truncate to the first ~1000 words (the model handles this internally)
- Split long documents into chunks, summarize each, then summarize the combined summaries
- Consider whether the most important information is at the beginning (news-style) or distributed throughout

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/nlp-tools/use-cases/) for document summarization workflows
- **Explore Other Pipelines:** See [Pipelines](/docs/nlp-tools/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/nlp-tools/setup/)
