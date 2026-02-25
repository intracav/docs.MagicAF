---
title: "Text Generation"
description: "Auto-regressive language generation using in-process GPT-2 / GPT-Neo models. Full control over decoding strategy with no external server required."
weight: 8
keywords: [text generation, GPT-2, GPT-Neo, language model, auto-regressive, beam search, top-k, top-p, nucleus sampling]
---

The text generation pipeline performs **auto-regressive language generation** entirely in-process using GPT-2 or GPT-Neo. Given a prompt, it generates a continuation — with full control over decoding parameters like temperature, beam search, top-k, and top-p sampling.

---

## Overview

**Module:** `magicaf_nlp::generation`
**Default Model:** GPT-2 (medium, 345M parameters)
**Task:** Generate text continuations from a prompt

### When to Use

- ✅ You need in-process text generation with no external server
- ✅ You want fine-grained control over decoding (beam search, top-k, top-p)
- ✅ You're deploying to air-gapped or edge environments
- ✅ You need lightweight, fast generation for short-form content

### When Not to Use

- ❌ You need long, high-quality, instruction-following text (use `LlmService::generate` with a 7B+ LLM)
- ❌ You need factual accuracy or knowledge beyond GPT-2's training data
- ❌ You need chat-style interaction with history (use the [Dialogue pipeline](/docs/api-reference/nlp/dialogue/))

### How This Differs from `LlmService::generate`

| | Text Generation (this module) | `LlmService::generate` |
|-|-------------------------------|------------------------|
| **Runtime** | In-process GPT-2 model | External API call to LLM server |
| **Model** | GPT-2 / GPT-Neo (124M–1.5B params) | Any LLM (Mistral-7B, Llama-70B, etc.) |
| **Decoding** | Full control (beam, top-k, top-p) | Server-side decoding |
| **Dependencies** | libtorch / ONNX Runtime | HTTP server running |

---

## Quick Example

```rust
use magicaf_nlp::generation::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = TextGenerationPipeline::new(GenerationNlpConfig::default()).await?;

    let texts = pipeline.generate(&["The future of AI is"]).await?;
    for text in &texts {
        println!("{text}");
    }

    Ok(())
}
```

---

## API Reference

### Types

#### `GenerationNlpConfig`

```rust
pub struct GenerationNlpConfig {
    pub source: ModelSource,            // Where to load the model
    pub max_length: Option<i64>,        // Maximum total output length in tokens (default: 100)
    pub temperature: Option<f64>,       // Sampling temperature (default: 1.0)
    pub top_k: Option<i64>,             // Top-k sampling (default: 50)
    pub top_p: Option<f64>,             // Nucleus sampling threshold (default: 0.9)
    pub num_beams: Option<i64>,         // Beam width for beam search (default: 1)
    pub repetition_penalty: Option<f64>,// Repetition penalty (default: 1.0)
    pub num_return_sequences: Option<i64>, // How many sequences to generate per prompt (default: 1)
    pub device: Device,                 // CPU or CUDA
}
```

### Configuration Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `max_length` | `100` | Maximum output length in tokens (includes prompt tokens) |
| `temperature` | `1.0` | Higher = more creative/random, lower = more deterministic |
| `top_k` | `50` | Limit sampling to top-k most likely tokens (0 = disabled) |
| `top_p` | `0.9` | Nucleus sampling — sample from tokens covering this probability mass |
| `num_beams` | `1` | Beam width (1 = greedy/sampling, >1 = beam search) |
| `repetition_penalty` | `1.0` | Values > 1.0 discourage repeating tokens from the prompt |
| `num_return_sequences` | `1` | Number of independent sequences generated per prompt |

### Methods

#### `new(config: GenerationNlpConfig) -> Result<Self>`

Creates a new text generation pipeline. Model loading happens asynchronously on a background thread.

```rust
let pipeline = TextGenerationPipeline::new(GenerationNlpConfig::default()).await?;
```

#### `generate(prompts) -> Result<Vec<String>>`

Generates text continuations for each prompt. Returns one string per prompt (or `num_return_sequences` strings per prompt if configured).

**Parameters:**
- `prompts: &[&str]` — one or more prompt strings

**Returns:** `Vec<String>` — generated text for each prompt (includes the prompt itself).

```rust
let texts = pipeline.generate(&[
    "Once upon a time,",
    "The quick brown fox",
]).await?;

for text in &texts {
    println!("{text}");
}
```

---

## Configuration

### Default Config

```rust
let config = GenerationNlpConfig::default();
// Uses GPT-2 medium
// max_length: 100, temperature: 1.0, top_k: 50, top_p: 0.9
// num_beams: 1 (sampling mode), repetition_penalty: 1.0
```

### Creative / Diverse Output

```rust
let config = GenerationNlpConfig {
    max_length: Some(200),
    temperature: Some(1.4),         // High temperature = more surprising outputs
    top_k: Some(0),                 // Disable top-k (use only top-p)
    top_p: Some(0.95),              // Wide nucleus
    repetition_penalty: Some(1.3),  // Discourage repetition
    ..Default::default()
};
```

### Deterministic / Focused Output

```rust
let config = GenerationNlpConfig {
    max_length: Some(80),
    temperature: Some(0.7),     // Lower temperature = more predictable
    top_k: Some(20),            // Narrow sampling pool
    top_p: Some(0.8),
    num_beams: Some(4),         // Beam search for higher quality
    ..Default::default()
};
```

### Multiple Sequences per Prompt

```rust
let config = GenerationNlpConfig {
    num_return_sequences: Some(3),  // Generate 3 alternatives per prompt
    temperature: Some(1.2),
    ..Default::default()
};

let texts = pipeline.generate(&["Draft an opening line:"]).await?;
// texts will contain 3 elements
for (i, text) in texts.iter().enumerate() {
    println!("Option {}: {text}", i + 1);
}
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = GenerationNlpConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/gpt2-medium".into(),
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
let config = GenerationNlpConfig {
    source: ModelSource::Default,
    device: Device::Cuda(0),
    ..Default::default()
};
```

---

## Advanced Usage

### Batch Generation

Generate for multiple prompts in a single call:

```rust
let prompts = vec![
    "Rust is a systems programming language that",
    "The key advantage of async/await in Rust is",
    "In an air-gapped deployment, the primary challenge is",
];

let texts = pipeline.generate(&prompts).await?;

for (prompt, text) in prompts.iter().zip(texts.iter()) {
    println!("Prompt: {prompt}");
    println!("Generated: {text}");
    println!("---");
}
```

### Stripping the Prompt from Output

The returned strings include the original prompt. To get only the newly generated tokens:

```rust
let prompt = "The future of AI is";
let texts = pipeline.generate(&[prompt]).await?;

let generated_only = texts[0].trim_start_matches(prompt).trim();
println!("New text: {generated_only}");
```

### Combining with Other Pipelines

Use text generation to draft content, then pass it to other pipelines:

```rust
// Generate a news-style snippet
let gen_config = GenerationNlpConfig {
    max_length: Some(120),
    ..Default::default()
};
let gen = TextGenerationPipeline::new(gen_config).await?;
let texts = gen.generate(&["Breaking news:"]).await?;

// Summarize the result
let summarizer = SummarizationPipeline::new(SummaryConfig::default()).await?;
let summaries = summarizer.summarize(&[&texts[0]]).await?;
println!("Summary: {}", summaries[0].text);
```

---

## Performance

- **Model size:** ~500MB (GPT-2 medium)
- **Inference speed:** ~200–800ms per sequence on CPU (depends on `max_length` and `num_beams`)
- **Memory:** ~1.5–2GB RAM
- **Throughput:** Batching multiple prompts is more efficient than sequential calls

---

## Troubleshooting

### Repetitive Output

If the model loops or repeats phrases, increase the repetition penalty:

```rust
let config = GenerationNlpConfig {
    repetition_penalty: Some(1.5),  // Default is 1.0
    ..Default::default()
};
```

### Output Too Short

Increase `max_length`. Note that `max_length` counts the **total** tokens including the prompt:

```rust
let config = GenerationNlpConfig {
    max_length: Some(300),  // Allow longer output
    ..Default::default()
};
```

### Generic or Off-Topic Output

Try a lower temperature and/or beam search for more focused output:

```rust
let config = GenerationNlpConfig {
    temperature: Some(0.8),
    num_beams: Some(5),
    ..Default::default()
};
```

For outputs that require factual accuracy or domain knowledge, use `LlmService::generate` with a larger instruction-tuned model.

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/api-reference/nlp/use-cases/) for generation patterns
- **Explore Other Pipelines:** See [Pipelines](/docs/api-reference/nlp/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/api-reference/nlp/setup/)
