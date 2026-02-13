---
title: "Keyword Extraction"
description: "Extract the most relevant keywords and keyphrases from documents using sentence embeddings, TF-IDF, and Maximal Marginal Relevance."
weight: 8
keywords: [keyword extraction, keyphrase extraction, TF-IDF, sentence embeddings, MMR]
---

Keyword extraction identifies the **most relevant terms and phrases** from documents using a combination of sentence embeddings, n-gram candidate extraction, and Maximal Marginal Relevance (MMR) for diversity. It returns ranked keywords with relevance scores.

---

## Overview

**Module:** `magicaf_nlp::keywords`
**Default Model:** Sentence embeddings (all-MiniLM-L12-v2) + TF-IDF + MMR
**Task:** Extract ranked keywords and keyphrases from documents

### When to Use

- ✅ You need to extract key terms or topics from documents
- ✅ You're building search indexes, tag generators, or topic models
- ✅ You want configurable diversity to avoid redundant keywords
- ✅ You need multi-word keyphrases (n-grams), not just single words

### When Not to Use

- ❌ You need to classify text into predefined categories (use zero-shot classification)
- ❌ You need named entities with type labels (use NER)
- ❌ You need abstractive topic descriptions (use summarization)

---

## Quick Example

```rust
use magicaf_nlp::keywords::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = KeywordExtractionPipeline::new(KeywordConfig::default()).await?;

    let results = pipeline.extract(&[
        "Rust is a multi-paradigm, general-purpose programming language. \
         Rust emphasizes performance, type safety, and concurrency.",
    ]).await?;

    for kw in &results[0] {
        println!("{}: {:.4}", kw.text, kw.score);
    }
    // → rust: 0.5091
    //   concurrency: 0.3383
    //   type safety: 0.2941
    //   performance: 0.2870
    //   programming language: 0.2654

    Ok(())
}
```

---

## API Reference

### Types

#### `Keyword`

```rust
pub struct Keyword {
    pub text: String,   // The keyword or keyphrase text
    pub score: f64,     // Relevance score (higher = more relevant)
}
```

#### `KeywordConfig`

```rust
pub struct KeywordConfig {
    pub source: ModelSource,     // Where to load the model
    pub top_n: usize,           // Max keywords to return per document (default: 5)
    pub diversity: f64,          // MMR diversity parameter, 0.0–1.0 (default: 0.5)
    pub max_ngram_size: usize,  // Max n-gram size for candidates (default: 3)
    pub device: Device,          // CPU or CUDA
}
```

### Configuration Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `top_n` | `5` | Maximum number of keywords returned per document |
| `diversity` | `0.5` | MMR diversity (0.0 = most relevant, 1.0 = most diverse) |
| `max_ngram_size` | `3` | Maximum words per keyphrase (1 = single words only, 3 = up to trigrams) |

### Methods

#### `new(config: KeywordConfig) -> Result<Self>`

Creates a new keyword extraction pipeline. Model loading happens asynchronously on a background thread.

```rust
let pipeline = KeywordExtractionPipeline::new(KeywordConfig {
    top_n: 10,
    diversity: 0.7,
    ..Default::default()
}).await?;
```

#### `extract(documents) -> Result<Vec<Vec<Keyword>>>`

Extracts keywords from one or more documents.

**Parameters:**
- `documents: &[&str]` — one or more documents to extract keywords from

**Returns:** One `Vec<Keyword>` per input document, sorted by descending relevance score.

```rust
let results = pipeline.extract(&[
    "First document text...",
    "Second document text...",
]).await?;

for (i, keywords) in results.iter().enumerate() {
    println!("Document {}:", i + 1);
    for kw in keywords {
        println!("  {}: {:.4}", kw.text, kw.score);
    }
}
```

---

## Configuration

### Default Config

```rust
let config = KeywordConfig::default();
// top_n: 5, diversity: 0.5, max_ngram_size: 3
// Downloads model from HuggingFace Hub on first use
```

### More Keywords, Higher Diversity

```rust
let config = KeywordConfig {
    top_n: 15,
    diversity: 0.8,  // More diverse keywords (less redundancy)
    ..Default::default()
};
```

### Single Words Only

```rust
let config = KeywordConfig {
    max_ngram_size: 1,  // Only single-word keywords
    ..Default::default()
};
```

### Longer Keyphrases

```rust
let config = KeywordConfig {
    max_ngram_size: 5,  // Up to 5-word phrases
    top_n: 10,
    ..Default::default()
};
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = KeywordConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/minilm-embeddings".into(),
    },
    device: Device::Cpu,
    ..Default::default()
};
```

### GPU Acceleration

```rust
let config = KeywordConfig {
    source: ModelSource::Default,
    device: Device::Cuda(0),
    ..Default::default()
};
```

---

## Advanced Usage

### Batch Processing

```rust
let documents = vec![
    "Artificial intelligence is transforming healthcare through early disease \
     detection, drug discovery, and personalized medicine.",
    "Climate change poses significant risks including rising sea levels, \
     extreme weather events, and biodiversity loss.",
    "Quantum computing promises breakthroughs in cryptography, material \
     science, and optimization problems.",
];

let results = pipeline.extract(&documents).await?;

for (i, keywords) in results.iter().enumerate() {
    let terms: Vec<&str> = keywords.iter().map(|k| k.text.as_str()).collect();
    println!("Doc {}: {}", i + 1, terms.join(", "));
}
```

### Tag Generation

Use extracted keywords as document tags:

```rust
let results = pipeline.extract(&[document_text]).await?;

let tags: Vec<String> = results[0].iter()
    .filter(|kw| kw.score > 0.2)  // Minimum relevance threshold
    .map(|kw| kw.text.to_lowercase())
    .collect();

println!("Tags: {:?}", tags);
```

### Combining with Summarization

Extract keywords from summaries for more focused results:

```rust
use magicaf_nlp::summarization::*;
use magicaf_nlp::keywords::*;

let summarizer = SummarizationPipeline::new(SummaryConfig::default()).await?;
let keyword_extractor = KeywordExtractionPipeline::new(KeywordConfig::default()).await?;

let summaries = summarizer.summarize(&[long_document]).await?;
let keywords = keyword_extractor.extract(&[&summaries[0].text]).await?;

println!("Summary: {}", summaries[0].text);
println!("Key topics: {:?}", keywords[0].iter().map(|k| &k.text).collect::<Vec<_>>());
```

### Tuning Diversity

The `diversity` parameter controls the trade-off between relevance and variety:

```rust
// Low diversity (0.2) — keywords may overlap semantically
// "machine learning", "deep learning", "learning algorithms"
let config = KeywordConfig { diversity: 0.2, ..Default::default() };

// High diversity (0.9) — keywords cover distinct topics
// "machine learning", "data pipeline", "model deployment"
let config = KeywordConfig { diversity: 0.9, ..Default::default() };
```

---

## How It Works

The extraction pipeline combines three techniques:

1. **N-gram Candidate Generation:** Extracts all n-grams (up to `max_ngram_size`) from the input as candidates
2. **Sentence Embeddings:** Encodes both the full document and each candidate using the all-MiniLM-L12-v2 model
3. **Cosine Similarity + MMR:** Ranks candidates by cosine similarity to the document embedding, then applies Maximal Marginal Relevance to balance relevance with diversity

This produces keywords that are both **highly relevant** to the document and **diverse** in their coverage of topics.

---

## Performance

- **Model size:** ~90MB (all-MiniLM-L12-v2)
- **Inference speed:** ~50–200ms per document on CPU
- **Memory:** ~300MB–500MB RAM
- **Batch processing:** Efficient for multiple documents

---

## Troubleshooting

### Too Many Generic Keywords

If extracted keywords are too generic (e.g. "the", "it", "this"):
- Increase `diversity` to push for more meaningful terms
- Ensure documents are long enough to contain distinctive vocabulary
- Consider filtering results by a minimum score threshold

### Missing Important Terms

If expected keywords are not extracted:
- Increase `top_n` to return more candidates
- Increase `max_ngram_size` if the term is a multi-word phrase
- Lower `diversity` to focus more on relevance

### Short Documents

Keyword extraction works best on documents with at least a few sentences. For very short text (< 20 words), results may be unreliable.

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/api-reference/nlp/use-cases/) for keyword extraction workflows
- **Explore Other Pipelines:** See [Pipelines](/docs/api-reference/nlp/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/api-reference/nlp/setup/)
