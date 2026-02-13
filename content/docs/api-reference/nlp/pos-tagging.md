---
title: "POS Tagging"
description: "Assign grammatical categories (noun, verb, adjective, etc.) to each word in text using BERT fine-tuned on the Penn Treebank tag set."
weight: 9
keywords: [POS tagging, part of speech, Penn Treebank, grammatical analysis, BERT]
---

Part-of-Speech (POS) tagging assigns a **grammatical category** — noun, verb, adjective, adverb, etc. — to every word in the input text. This is a foundational NLP task used for syntactic analysis, text preprocessing, and linguistic feature extraction.

---

## Overview

**Module:** `magicaf_nlp::pos`
**Default Model:** BERT fine-tuned on English Penn Treebank POS tags
**Task:** Tag each word with its grammatical category

### When to Use

- ✅ You need grammatical analysis of text (syntactic parsing, dependency analysis)
- ✅ You're building text preprocessing pipelines that need POS features
- ✅ You want to filter words by grammatical role (e.g. extract all nouns or verbs)
- ✅ You're doing linguistic research or annotation

### When Not to Use

- ❌ You need named entity types (person, location, etc.) — use NER
- ❌ You need semantic meaning or topic classification — use zero-shot classification
- ❌ You need POS tagging for non-English text (default model is English only)

---

## Quick Example

```rust
use magicaf_nlp::pos::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = PosPipeline::new(PosConfig::default()).await?;

    let results = pipeline.predict(&["My name is Bob"]).await?;

    for tag in &results[0] {
        println!("{}: {} ({:.4})", tag.word, tag.label, tag.score);
    }
    // → My: PRP$ (0.1560)
    //   name: NN (0.6565)
    //   is: VBZ (0.3697)
    //   Bob: NNP (0.7460)

    Ok(())
}
```

---

## API Reference

### Types

#### `PosTag`

```rust
pub struct PosTag {
    pub word: String,    // The word text
    pub score: f64,      // Confidence score (0.0–1.0)
    pub label: String,   // Penn Treebank POS label (e.g. "NN", "VB", "JJ")
}
```

#### `PosConfig`

```rust
pub struct PosConfig {
    pub source: ModelSource,  // Where to load the model
    pub device: Device,       // CPU or CUDA
}
```

### Penn Treebank Tag Set

| Tag | Description | Example |
|-----|------------|---------|
| `NN` | Noun, singular | *dog*, *city*, *music* |
| `NNS` | Noun, plural | *dogs*, *cities* |
| `NNP` | Proper noun, singular | *Bob*, *Paris*, *Google* |
| `NNPS` | Proper noun, plural | *Americans*, *Sundays* |
| `VB` | Verb, base form | *run*, *eat*, *think* |
| `VBD` | Verb, past tense | *ran*, *ate*, *thought* |
| `VBG` | Verb, gerund/present participle | *running*, *eating* |
| `VBN` | Verb, past participle | *run*, *eaten*, *thought* |
| `VBP` | Verb, non-3rd person present | *run*, *eat* |
| `VBZ` | Verb, 3rd person singular present | *runs*, *eats* |
| `JJ` | Adjective | *big*, *fast*, *green* |
| `JJR` | Adjective, comparative | *bigger*, *faster* |
| `JJS` | Adjective, superlative | *biggest*, *fastest* |
| `RB` | Adverb | *quickly*, *very*, *well* |
| `RBR` | Adverb, comparative | *faster*, *better* |
| `RBS` | Adverb, superlative | *fastest*, *best* |
| `PRP` | Personal pronoun | *I*, *he*, *she*, *they* |
| `PRP$` | Possessive pronoun | *my*, *his*, *their* |
| `DT` | Determiner | *the*, *a*, *this* |
| `IN` | Preposition/subordinating conjunction | *in*, *of*, *after* |
| `CC` | Coordinating conjunction | *and*, *but*, *or* |
| `TO` | "to" | *to* |
| `MD` | Modal | *can*, *will*, *should* |
| `CD` | Cardinal number | *one*, *42*, *2024* |

### Methods

#### `new(config: PosConfig) -> Result<Self>`

Creates a new POS tagging pipeline. Model loading happens asynchronously on a background thread.

```rust
let pipeline = PosPipeline::new(PosConfig {
    source: ModelSource::Default,
    device: Device::Cpu,
}).await?;
```

#### `predict(texts) -> Result<Vec<Vec<PosTag>>>`

Tags parts of speech in one or more texts.

**Parameters:**
- `texts: &[&str]` — one or more text inputs

**Returns:** One `Vec<PosTag>` per input text, with one tag per word.

```rust
let results = pipeline.predict(&[
    "The quick brown fox jumps over the lazy dog.",
    "She sells sea shells by the sea shore.",
]).await?;

// results[0] → [The/DT, quick/JJ, brown/JJ, fox/NN, jumps/VBZ, ...]
// results[1] → [She/PRP, sells/VBZ, sea/NN, shells/NNS, ...]
```

---

## Configuration

### Default Model

```rust
let config = PosConfig::default();
// Uses BERT fine-tuned on English Penn Treebank
// Downloads from HuggingFace Hub on first use
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = PosConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/bert-pos".into(),
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
let config = PosConfig {
    source: ModelSource::Default,
    device: Device::Cuda(0),  // Use GPU 0
};
```

---

## Advanced Usage

### Filtering by Part of Speech

Extract only specific grammatical categories:

```rust
let results = pipeline.predict(&[
    "The brilliant scientist discovered a groundbreaking new theory.",
]).await?;

// Extract all nouns
let nouns: Vec<&str> = results[0].iter()
    .filter(|t| t.label.starts_with("NN"))
    .map(|t| t.word.as_str())
    .collect();
println!("Nouns: {:?}", nouns);
// → ["scientist", "theory"]

// Extract all adjectives
let adjectives: Vec<&str> = results[0].iter()
    .filter(|t| t.label.starts_with("JJ"))
    .map(|t| t.word.as_str())
    .collect();
println!("Adjectives: {:?}", adjectives);
// → ["brilliant", "groundbreaking", "new"]

// Extract all verbs
let verbs: Vec<&str> = results[0].iter()
    .filter(|t| t.label.starts_with("VB"))
    .map(|t| t.word.as_str())
    .collect();
println!("Verbs: {:?}", verbs);
// → ["discovered"]
```

### Batch Processing

```rust
let sentences = vec![
    "Rust is a systems programming language.",
    "The compiler catches memory errors at compile time.",
    "Async support makes concurrent code easier to write.",
];

let results = pipeline.predict(&sentences).await?;

for (i, tags) in results.iter().enumerate() {
    let tagged: Vec<String> = tags.iter()
        .map(|t| format!("{}/{}", t.word, t.label))
        .collect();
    println!("Sentence {}: {}", i + 1, tagged.join(" "));
}
```

### Combining with NER

Use POS tags to enrich entity extraction:

```rust
use magicaf_nlp::pos::*;
use magicaf_nlp::ner::*;

let pos_pipeline = PosPipeline::new(PosConfig::default()).await?;
let ner_pipeline = NerPipeline::new(NerConfig::default()).await?;

let text = &["Marie Curie discovered radium in Paris."];

let tags = pos_pipeline.predict(text).await?;
let entities = ner_pipeline.predict(text).await?;

println!("POS tags:");
for tag in &tags[0] {
    println!("  {}: {}", tag.word, tag.label);
}

println!("Entities:");
for entity in &entities[0] {
    println!("  {}: {}", entity.word, entity.label);
}
```

### Word Frequency by POS Category

```rust
use std::collections::HashMap;

let results = pipeline.predict(&[long_text]).await?;

let mut counts: HashMap<&str, usize> = HashMap::new();
for tag in &results[0] {
    *counts.entry(tag.label.as_str()).or_default() += 1;
}

let mut sorted: Vec<(&&str, &usize)> = counts.iter().collect();
sorted.sort_by(|a, b| b.1.cmp(a.1));

for (label, count) in sorted.iter().take(10) {
    println!("{}: {}", label, count);
}
```

---

## Performance

- **Model size:** ~1.3GB (BERT)
- **Inference speed:** ~50–150ms per text on CPU
- **Memory:** ~2–3GB RAM
- **Batch processing:** Efficient for multiple texts

---

## Troubleshooting

### Incorrect Tags for Ambiguous Words

Some words can be multiple parts of speech (e.g. "run" can be a noun or verb). The model uses context to disambiguate, but may occasionally choose incorrectly. Lower confidence scores indicate higher ambiguity:

```rust
let results = pipeline.predict(&["I run every day."]).await?;
// "run" should be tagged VBP (verb, non-3rd person present)

let results = pipeline.predict(&["The run was exhausting."]).await?;
// "run" should be tagged NN (noun, singular)
```

### Sub-Word Tokenisation

BERT uses sub-word tokenisation, so some words may be split into pieces. The pipeline reassembles these, but unusual or very long words may produce unexpected splits.

### Non-English Text

The default model is trained on English Penn Treebank. For other languages, load a language-specific model via `ModelSource::Local`.

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/api-reference/nlp/use-cases/) for linguistic analysis pipelines
- **Explore Other Pipelines:** See [Pipelines](/docs/api-reference/nlp/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/api-reference/nlp/setup/)
