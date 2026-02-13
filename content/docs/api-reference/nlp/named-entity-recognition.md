---
title: "Named Entity Recognition"
description: "Extract persons, locations, organisations, and miscellaneous entities from text using transformer-based NER. Perfect for structured information extraction."
weight: 2
keywords: [NER, named entity recognition, entity extraction, CoNLL-03, BERT]
---

Named Entity Recognition (NER) identifies and classifies **named entities** — people, places, organisations, and other proper nouns — within unstructured text, returning each entity with its label, confidence score, and character offsets.

---

## Overview

**Module:** `magicaf_nlp::ner`
**Default Model:** BERT cased large fine-tuned on CoNLL-03 (MDZ Digital Library, Bavarian State Library)
**Task:** Extract named entities with type labels and character offsets
**Supported Languages:** English, German, Spanish, Dutch

### When to Use

- ✅ You need to extract people, places, and organisations from text
- ✅ You need structured output with character offsets for downstream processing
- ✅ You want zero external service dependencies
- ✅ You're building entity-aware pipelines (search, knowledge graphs, compliance)

### When Not to Use

- ❌ You need custom entity types beyond PER/LOC/ORG/MISC (consider zero-shot classification)
- ❌ You need entity linking or disambiguation (NER gives labels, not knowledge base IDs)
- ❌ You need relation extraction between entities (NER identifies entities, not relations)

---

## Quick Example

```rust
use magicaf_nlp::ner::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = NerPipeline::new(NerConfig::default()).await?;

    let entities = pipeline.predict(&[
        "My name is Amy. I live in Paris.",
    ]).await?;

    for entity in &entities[0] {
        println!("{}: {} (score: {:.4})", entity.label, entity.word, entity.score);
    }
    // → I-PER: Amy (0.9986)
    //   I-LOC: Paris (0.9985)

    Ok(())
}
```

---

## API Reference

### Types

#### `Entity`

```rust
pub struct Entity {
    pub word: String,    // The entity text span
    pub score: f64,      // Confidence score (0.0–1.0)
    pub label: String,   // Entity type label ("I-PER", "I-LOC", "I-ORG", "I-MISC")
    pub start: usize,    // Start character offset in the original input
    pub end: usize,      // End character offset in the original input
}
```

#### `NerConfig`

```rust
pub struct NerConfig {
    pub source: ModelSource,  // Where to load the model
    pub device: Device,       // CPU or CUDA
}
```

### Entity Labels

| Label | Meaning | Examples |
|-------|---------|----------|
| `I-PER` | Person | Amy, Barack Obama, Shakespeare |
| `I-LOC` | Location | Paris, Mount Everest, the Nile |
| `I-ORG` | Organisation | Google, United Nations, NASA |
| `I-MISC` | Miscellaneous | English (language), Nobel Prize, COVID-19 |

### Methods

#### `new(config: NerConfig) -> Result<Self>`

Creates a new NER pipeline. Model loading happens asynchronously on a background thread.

```rust
let pipeline = NerPipeline::new(NerConfig {
    source: ModelSource::Default,
    device: Device::Cpu,
}).await?;
```

#### `predict(texts) -> Result<Vec<Vec<Entity>>>`

Extracts entities from one or more input texts.

**Parameters:**
- `texts: &[&str]` — one or more text inputs

**Returns:** One `Vec<Entity>` per input text. Each entity includes the word, label, score, and character offsets.

```rust
let entities = pipeline.predict(&[
    "My name is Amy. I live in Paris.",
    "Google was founded by Larry Page and Sergey Brin.",
]).await?;

// entities[0] → Amy (I-PER), Paris (I-LOC)
// entities[1] → Google (I-ORG), Larry Page (I-PER), Sergey Brin (I-PER)
```

---

## Configuration

### Default Model

```rust
let config = NerConfig::default();
// Uses BERT cased large fine-tuned on CoNLL-03
// Downloads from HuggingFace Hub on first use
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = NerConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/bert-ner".into(),
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
let config = NerConfig {
    source: ModelSource::Default,
    device: Device::Cuda(0),  // Use GPU 0
};
```

---

## Advanced Usage

### Character Offset Extraction

Use the `start` and `end` offsets to extract entities from the original text:

```rust
let text = "Amy works at Google in Mountain View.";
let entities = pipeline.predict(&[text]).await?;

for entity in &entities[0] {
    let extracted = &text[entity.start..entity.end];
    println!("{} → {} ({})", extracted, entity.label, entity.score);
}
// → Amy → I-PER (0.9986)
//   Google → I-ORG (0.9912)
//   Mountain View → I-LOC (0.9870)
```

### Batch Processing

```rust
let texts = vec![
    "Barack Obama was born in Hawaii.",
    "Tesla announced new factories in Berlin.",
    "The United Nations held a summit in Geneva.",
];

let all_entities = pipeline.predict(&texts).await?;

for (i, entities) in all_entities.iter().enumerate() {
    println!("Text {}: {} entities found", i + 1, entities.len());
    for entity in entities {
        println!("  {} [{}]: {:.4}", entity.word, entity.label, entity.score);
    }
}
```

### Filtering by Entity Type

```rust
let entities = pipeline.predict(&[
    "Amy from Google visited Paris last Tuesday.",
]).await?;

let people: Vec<&Entity> = entities[0].iter()
    .filter(|e| e.label == "I-PER")
    .collect();

let locations: Vec<&Entity> = entities[0].iter()
    .filter(|e| e.label == "I-LOC")
    .collect();

println!("People: {:?}", people.iter().map(|e| &e.word).collect::<Vec<_>>());
println!("Locations: {:?}", locations.iter().map(|e| &e.word).collect::<Vec<_>>());
```

---

## Comparison with Zero-Shot Classification

| Aspect | NER (this module) | Zero-Shot Classification |
|--------|-------------------|--------------------------|
| **Entity types** | Fixed: PER, LOC, ORG, MISC | Arbitrary labels at inference time |
| **Granularity** | Token-level (word by word) | Document/sentence-level |
| **Output** | Entities with character offsets | Labels with probability scores |
| **Model size** | ~1.3GB (BERT large) | ~1.6GB (BART-MNLI) |
| **Use case** | Structured extraction from text | Flexible categorisation |

---

## Performance

- **Model size:** ~1.3GB (BERT cased large)
- **Inference speed:** ~50–150ms per text on CPU
- **Memory:** ~2–3GB RAM
- **Batch processing:** Efficient for multiple texts in a single call

---

## Troubleshooting

### Missing Entities

If expected entities are not detected, the model may not recognise uncommon names or domain-specific terms:

```rust
// Common names are well-recognised
pipeline.predict(&["Amy lives in Paris."]).await?;  // ✅ Both detected

// Rare or domain-specific names may be missed
pipeline.predict(&["Xylophia lives in Kraznovia."]).await?;  // May miss unusual names
```

Consider using a domain-specific fine-tuned model via `ModelSource::Local` for specialised use cases.

### Overlapping Entities

If you see fragmented entities (e.g. "New" and "York" as separate LOC entities), this is expected behaviour with sub-word tokenisation. Post-process by merging adjacent entities with the same label.

### Low Confidence Scores

Scores below 0.5 often indicate ambiguous entities. You can filter by threshold:

```rust
let confident_entities: Vec<&Entity> = entities[0].iter()
    .filter(|e| e.score > 0.8)
    .collect();
```

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/api-reference/nlp/use-cases/) for real-world NER pipelines
- **Explore Other Pipelines:** See [Pipelines](/docs/api-reference/nlp/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/api-reference/nlp/setup/)
