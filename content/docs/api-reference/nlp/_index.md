---
title: "NLP Pipelines"
description: "Production-grade NLP pipelines that run entirely in-process — no external API servers required. Extract entities, analyze sentiment, translate text, answer questions, and more."
weight: 2
keywords: [NLP, natural language processing, in-process inference, transformer models, NER, sentiment analysis, question answering, translation, summarization]
---

MagicAF NLP — powered by Intracav — provides **production-grade NLP pipelines** that run entirely in-process, with no external API servers required. Each pipeline loads a pre-trained transformer model and performs inference directly, making it ideal for air-gapped, on-premises, and edge deployments.

---

## What's Included

| Pipeline | Module | Default Model | Task |
|----------|--------|---------------|------|
| **Question Answering** | [`qa`](/docs/api-reference/nlp/question-answering/) | DistilBERT / SQuAD | Extract answer spans from context |
| **Translation** | [`translation`](/docs/api-reference/nlp/translation/) | Marian / M2M100 | Translate between 100+ languages |
| **Summarization** | [`summarization`](/docs/api-reference/nlp/summarization/) | BART-large-CNN | Abstractive text summarization |
| **Dialogue** | [`dialogue`](/docs/api-reference/nlp/dialogue/) | DialoGPT | Multi-turn conversation |
| **Text Generation** | [`generation`](/docs/api-reference/nlp/text-generation/) | GPT-2 | Auto-regressive language generation |
| **Zero-Shot Classification** | [`zero_shot`](/docs/api-reference/nlp/zero-shot-classification/) | BART-MNLI | Classify into arbitrary labels |
| **Sentiment Analysis** | [`sentiment`](/docs/api-reference/nlp/sentiment-analysis/) | DistilBERT / SST-2 | Positive/negative prediction |
| **Named Entity Recognition** | [`ner`](/docs/api-reference/nlp/named-entity-recognition/) | BERT / CoNLL-03 | Extract persons, locations, orgs |
| **Keyword Extraction** | [`keywords`](/docs/api-reference/nlp/keyword-extraction/) | Sentence embeddings | Key terms from documents |
| **POS Tagging** | [`pos`](/docs/api-reference/nlp/pos-tagging/) | BERT / Penn Treebank | Grammatical category tagging |
| **Masked Language Model** | [`masked_lm`](/docs/api-reference/nlp/masked-language-model/) | BERT base | Fill-in-the-blank prediction |

---

## How NLP Pipelines Differ from Core Services

MagicAF Core provides [`LlmService`](/docs/api-reference/core/llm-service/) and [`EmbeddingService`](/docs/api-reference/core/embedding-service/), which are **HTTP clients** that talk to external inference servers (vLLM, llama.cpp, etc.).

The NLP pipelines in `magicaf-nlp` are fundamentally different:

| Aspect | Core Services | NLP Pipelines |
|--------|---------------|---------------|
| **Runtime** | External HTTP server | In-process model inference |
| **Dependencies** | `reqwest` (HTTP client) | `libtorch` or ONNX Runtime |
| **Model size** | Server runs any size model | Optimized smaller models (DistilBERT, BART, GPT-2) |
| **Task** | General chat/embedding | Specialized NLP (NER, POS, QA, etc.) |
| **Deployment** | Need a running server | Just need model files on disk |

**When to use NLP pipelines:**
- You need specialized NLP tasks (NER, POS, sentiment, extractive QA)
- You want zero external service dependencies
- You're deploying to edge/embedded systems
- You need the model to start with your application

**When to use Core services:**
- You need a powerful generative LLM (7B+ parameters)
- You want to share one model server across multiple applications
- You're doing RAG with the full pipeline

---

## Architecture: Async-Safe Model Threads

Transformer model tensors are `!Send` (they're bound to the thread that created them). Each pipeline spawns a **dedicated OS thread** that owns the model for its entire lifetime. Async callers dispatch work via channels and await results through oneshot channels.

```
┌──────────────────┐         ┌─────────────────────────┐
│ Async Task       │         │ Model Thread (dedicated) │
│                  │         │                         │
│ pipeline.predict ├──tx───▸ │ model.predict(&input)   │
│                  │         │        │                │
│ ◂──reply_rx──────┤         │  ◂─────┘                │
└──────────────────┘         └─────────────────────────┘
```

This means:
- Pipelines are fully **async-safe** (`Send + Sync`)
- Multiple async tasks can call the same pipeline concurrently
- Predictions are serialized per model (one at a time on the model thread)
- When the pipeline struct is dropped, the model thread exits cleanly

---

## Feature Flags

| Feature | Effect |
|---------|--------|
| *(default)* | Exports config types and DTOs only — no native deps |
| `models` | Enables pipeline constructors (requires **libtorch**) |
| `onnx` | Like `models` but uses **ONNX Runtime** instead |

```toml
# Cargo.toml — default (config/DTO types only, zero native deps)
magicaf-nlp = { path = "../magicaf-nlp" }

# Cargo.toml — full pipeline support
magicaf-nlp = { path = "../magicaf-nlp", features = ["models"] }

# Cargo.toml — ONNX Runtime backend (lighter, more portable)
magicaf-nlp = { path = "../magicaf-nlp", features = ["onnx"] }
```

---

## Quick Start

```rust
use magicaf_nlp::prelude::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Sentiment analysis
    let sentiment = SentimentPipeline::new(SentimentConfig::default()).await?;
    let results = sentiment.predict(&["I love Rust!", "This is terrible."]).await?;
    for r in &results {
        println!("{:?}: {:.4}", r.polarity, r.score);
    }

    // Named Entity Recognition
    let ner = NerPipeline::new(NerConfig::default()).await?;
    let entities = ner.predict(&["Amy lives in Paris."]).await?;
    for e in &entities[0] {
        println!("{}: {} ({:.4})", e.label, e.word, e.score);
    }

    Ok(())
}
```

See the [Quick Start Guide](/docs/api-reference/nlp/quickstart/) for detailed setup instructions.

---

## Native Dependencies

This crate requires **one** of (only when the `models` feature is enabled):

- **libtorch** (default with `models`) — install via `pip install torch` or download from [PyTorch](https://pytorch.org), then set `LIBTORCH=/path/to/libtorch`.
- **ONNX Runtime** (feature `onnx`) — lighter, more portable. Enable with `features = ["onnx"]` in your `Cargo.toml`.

See [Setup & Configuration](/docs/api-reference/nlp/setup/) for detailed installation instructions.

---

## Air-Gapped Deployment

All pipelines support loading models from local files via [`ModelSource::Local`](/docs/api-reference/nlp/configuration/#model-source). Pre-download model files on an internet-connected machine, transfer them to the target, and point the config at the directory:

```rust
use magicaf_nlp::config::{ModelSource, Device};

let source = ModelSource::Local {
    model_dir: "/opt/magicaf/models/ner-bert-conll03".into(),
};
let device = Device::Cpu;
```

See [Air-Gapped Deployment](/docs/deployment/air-gapped/) for complete instructions.

---

<div class="card-grid">
<div class="card">

### [Quick Start →](/docs/api-reference/nlp/quickstart/)
Get up and running with your first NLP pipeline in minutes.

</div>
<div class="card">

### [Setup & Configuration →](/docs/api-reference/nlp/setup/)
Install native dependencies, configure models, and set up for air-gapped deployments.

</div>
<div class="card">

### [Pipelines →](/docs/api-reference/nlp/pipelines/)
Complete reference for all available NLP pipelines.

</div>
<div class="card">

### [Use Cases & Examples →](/docs/api-reference/nlp/use-cases/)
Working code examples for common NLP tasks.

</div>
</div>
