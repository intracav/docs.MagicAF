---
title: "Translation"
description: "Translate text between 25+ languages using neural machine translation models. Supports Marian (fast, pair-specific) and M2M100 (100+ languages)."
weight: 5
keywords: [translation, machine translation, Marian, M2M100, multilingual, NMT]
---

Neural machine translation converts text from one language to another using pre-trained transformer models. MagicAF supports two model families: **Marian** for fast, high-quality pair-specific translation, and **M2M100** for direct translation between 100+ languages.

---

## Overview

**Module:** `magicaf_nlp::translation`
**Default Model:** Marian-based neural machine translation
**Task:** Translate text between languages
**Supported Languages:** 25 listed + 75+ via M2M100

### When to Use

- ✅ You need to translate text between supported languages
- ✅ You want in-process translation with no external API calls
- ✅ You need batch translation of multiple texts
- ✅ You're building multilingual document processing pipelines

### When Not to Use

- ❌ You need real-time streaming translation (model loads once, then translates in batches)
- ❌ You need translation for extremely low-resource languages not in the supported set
- ❌ You need translation with domain-specific terminology preservation (consider fine-tuned models)

---

## Quick Example

```rust
use magicaf_nlp::translation::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = TranslationPipeline::new(TranslationConfig {
        source_languages: vec![Language::English],
        target_languages: vec![Language::French],
        ..Default::default()
    }).await?;

    let results = pipeline.translate(&[
        "Hello, how are you?",
        "The weather is nice today.",
    ], None, None).await?;

    for r in &results {
        println!("{}", r.text);
    }
    // → "Bonjour, comment allez-vous?"
    //   "Le temps est beau aujourd'hui."

    Ok(())
}
```

---

## API Reference

### Types

#### `Language`

```rust
pub enum Language {
    English,    French,     German,     Spanish,    Portuguese,
    Italian,    Dutch,      Russian,    Chinese,    Japanese,
    Korean,     Arabic,     Hindi,      Turkish,    Polish,
    Swedish,    Czech,      Romanian,   Finnish,    Vietnamese,
    Thai,       Indonesian, Hebrew,     Greek,      Ukrainian,
}
```

#### `TranslationOutput`

```rust
pub struct TranslationOutput {
    pub text: String,  // The translated text
}
```

#### `TranslationConfig`

```rust
pub struct TranslationConfig {
    pub source: ModelSource,              // Where to load the model
    pub source_languages: Vec<Language>,  // Source language(s)
    pub target_languages: Vec<Language>,  // Target language(s)
    pub device: Device,                   // CPU or CUDA
}
```

### Methods

#### `new(config: TranslationConfig) -> Result<Self>`

Creates a new translation pipeline. The appropriate model is selected based on the configured source/target language pair. Model loading happens asynchronously on a background thread.

```rust
let pipeline = TranslationPipeline::new(TranslationConfig {
    source_languages: vec![Language::English],
    target_languages: vec![Language::German],
    ..Default::default()
}).await?;
```

#### `translate(texts, source_language, target_language) -> Result<Vec<TranslationOutput>>`

Translates one or more texts.

**Parameters:**
- `texts: &[&str]` — one or more texts to translate
- `source_language: Option<Language>` — override the source language (defaults to the first language in the pipeline config)
- `target_language: Option<Language>` — override the target language (defaults to the first language in the pipeline config)

**Returns:** One `TranslationOutput` per input text.

```rust
let results = pipeline.translate(&[
    "Good morning!",
    "How are you doing?",
], None, None).await?;
```

---

## Configuration

### Default Config

```rust
let config = TranslationConfig::default();
// source_languages: [English]
// target_languages: [French]
// Downloads Marian EN→FR model from HuggingFace Hub on first use
```

### Specific Language Pair

```rust
let config = TranslationConfig {
    source_languages: vec![Language::German],
    target_languages: vec![Language::English],
    ..Default::default()
};
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = TranslationConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/marian-en-de".into(),
    },
    source_languages: vec![Language::English],
    target_languages: vec![Language::German],
    device: Device::Cpu,
};
```

**Required files:**
- `rust_model.ot` (PyTorch weights)
- `config.json` (model configuration)
- `vocab.json` and `source.spm` / `target.spm` (tokenizer files)

### GPU Acceleration

```rust
let config = TranslationConfig {
    source_languages: vec![Language::English],
    target_languages: vec![Language::French],
    source: ModelSource::Default,
    device: Device::Cuda(0),
};
```

---

## Supported Languages

| Language | Enum Value | Language | Enum Value |
|----------|-----------|----------|-----------|
| English | `Language::English` | Turkish | `Language::Turkish` |
| French | `Language::French` | Polish | `Language::Polish` |
| German | `Language::German` | Swedish | `Language::Swedish` |
| Spanish | `Language::Spanish` | Czech | `Language::Czech` |
| Portuguese | `Language::Portuguese` | Romanian | `Language::Romanian` |
| Italian | `Language::Italian` | Finnish | `Language::Finnish` |
| Dutch | `Language::Dutch` | Vietnamese | `Language::Vietnamese` |
| Russian | `Language::Russian` | Thai | `Language::Thai` |
| Chinese | `Language::Chinese` | Indonesian | `Language::Indonesian` |
| Japanese | `Language::Japanese` | Hebrew | `Language::Hebrew` |
| Korean | `Language::Korean` | Greek | `Language::Greek` |
| Arabic | `Language::Arabic` | Ukrainian | `Language::Ukrainian` |
| Hindi | `Language::Hindi` | | |

Additional languages are available through M2M100 models loaded via `ModelSource::Local` or `ModelSource::Remote`.

---

## Advanced Usage

### Batch Translation

```rust
let documents = vec![
    "The quarterly report shows strong growth.",
    "Customer satisfaction has improved significantly.",
    "We are expanding into new markets.",
    "Revenue exceeded expectations this quarter.",
];

let results = pipeline.translate(&documents, None, None).await?;

for (original, translated) in documents.iter().zip(&results) {
    println!("EN: {original}");
    println!("FR: {}", translated.text);
    println!();
}
```

### Multi-Language Pipeline

Create separate pipelines for different language pairs:

```rust
let en_to_fr = TranslationPipeline::new(TranslationConfig {
    source_languages: vec![Language::English],
    target_languages: vec![Language::French],
    ..Default::default()
}).await?;

let en_to_de = TranslationPipeline::new(TranslationConfig {
    source_languages: vec![Language::English],
    target_languages: vec![Language::German],
    ..Default::default()
}).await?;

let text = &["Hello, world!"];
let french = en_to_fr.translate(text, None, None).await?;
let german = en_to_de.translate(text, None, None).await?;

println!("French: {}", french[0].text);
println!("German: {}", german[0].text);
```

### Overriding Language at Translate Time

If your pipeline is configured with multiple source/target languages, you can override per call:

```rust
let results = pipeline.translate(
    &["Bonjour le monde"],
    Some(Language::French),   // Override source
    Some(Language::English),  // Override target
).await?;
```

If `None` is passed, the first language from the pipeline config is used.

---

## Model Families

| Model Family | Strengths | Trade-offs |
|-------------|-----------|------------|
| **Marian** | Fast, small (~300–600MB), excellent quality for specific pairs | One model per language pair |
| **M2M100** | Direct translation between 100 languages, single model | Larger (~2GB+), slower inference |

**Marian** is the default and recommended choice when you know your language pairs in advance. **M2M100** is better suited for applications requiring dynamic language selection.

---

## Performance

- **Model size:** ~300–600MB (Marian per pair), ~2GB+ (M2M100)
- **Inference speed:** ~100–300ms per text on CPU (Marian), ~500ms–1s (M2M100)
- **Memory:** ~1–2GB RAM (Marian), ~4–6GB RAM (M2M100)
- **Batch processing:** Efficient for multiple texts in a single call

---

## Troubleshooting

### Poor Translation Quality

If translations seem inaccurate or unnatural:
- Ensure you're using the correct source/target language configuration
- Marian models are trained on specific language pairs — using the wrong pair will produce poor results
- Very short or fragmented text may not translate well due to lack of context

### Unsupported Language Pair

Not all Marian models exist for all language pair combinations. If you get a model loading error:
- Check that a Marian model exists for your specific source→target pair
- Consider using M2M100 via `ModelSource::Local` for less common pairs
- Try routing through English as a pivot language

### Long Text Truncation

Translation models have maximum input token limits. If your text is very long:
- Split into paragraphs or sentences before translating
- Translate each chunk separately and concatenate the results

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/nlp-tools/use-cases/) for multi-language pipelines
- **Explore Other Pipelines:** See [Pipelines](/docs/nlp-tools/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/nlp-tools/setup/)
