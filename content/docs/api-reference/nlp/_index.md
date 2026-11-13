---
title: "NLP Pipelines"
description: "In-process transformer pipelines from magicaf-nlp — question answering, entities, sentiment, translation, summarization and more — what each one does today, what it needs, and its current limits."
weight: 2
keywords: [NLP, natural language processing, in-process inference, transformer models, NER, sentiment analysis, question answering, translation, summarization, rust-bert]
---

{{< crate-header "magicaf-nlp" >}}

`magicaf-nlp` runs task-specific transformer models inside your process, through [rust-bert](https://github.com/guillaume-be/rust-bert) and libtorch. It suits work a general LLM is too slow or too heavy for — tagging entities in every document you ingest, scoring sentiment in bulk, pulling an exact answer span from a passage — with no inference server to run.

## Pipelines

| Pipeline | Model | Task |
|---|---|---|
| [Question answering](/docs/api-reference/nlp/question-answering/) | DistilBERT (SQuAD) | Extract an answer span from a passage |
| [Named entities](/docs/api-reference/nlp/named-entity-recognition/) | BERT (CoNLL-03), English | Tag people, places, organizations, miscellany — word by word |
| [Sentiment](/docs/api-reference/nlp/sentiment-analysis/) | DistilBERT (SST-2) | Positive or negative, with a score |
| [Zero-shot classification](/docs/api-reference/nlp/zero-shot-classification/) | BART (MNLI) | Score text against labels you supply |
| [Summarization](/docs/api-reference/nlp/summarization/) | BART (CNN/DailyMail) | Abstractive summaries |
| [Translation](/docs/api-reference/nlp/translation/) | Marian, falling back to M2M100 | 25 languages |
| [Text generation](/docs/api-reference/nlp/text-generation/) | GPT-2 | Continue a prompt |
| [Dialogue](/docs/api-reference/nlp/dialogue/) | DialoGPT | Short conversational replies |
| [Keyword extraction](/docs/api-reference/nlp/keyword-extraction/) | all-MiniLM-L6-v2 | Single-word keywords ranked by similarity to the text |
| [Part-of-speech tagging](/docs/api-reference/nlp/pos-tagging/) | MobileBERT (Penn Treebank) | A grammatical tag per word |
| [Masked language model](/docs/api-reference/nlp/masked-language-model/) | BERT base, uncased | Fill in `[MASK]` tokens |

Every pipeline runs its model on a dedicated thread — libtorch tensors cannot move between threads — and exposes an async API. Pipelines are `Send + Sync`; calls to one pipeline are processed one at a time.

## Current limits

`magicaf-nlp` is a {{< crate-status "preview" >}} crate. Plan around these behaviors of the current source; each pipeline's page notes the ones that affect it.

- **Errors can look like empty results.** Translation, summarization, text generation, zero-shot classification, keyword extraction, masked language modeling, and dialogue return `Ok` with an empty result when inference fails. Treat an empty result as a possible failure, not as "nothing found".
- **Local model directories are honored only by question answering.** `ModelSource::Local` is used by `QaConfig`; every other pipeline loads its default model through rust-bert's cache, and `ModelSource::Remote` is not used anywhere.
- **Some settings are not applied.** `KeywordConfig` and `PosConfig` are ignored entirely (both pipelines use their defaults and pick the device automatically), and `DialogueConfig.max_history` is not read.
- **Named-entity recognition is English, per word.** Multi-word names come back as separate entities.

## What it needs

| | |
|---|---|
| Feature | `models` — without it the crate exports only `config::{ModelSource, Device}` |
| Native library | libtorch **2.4.0** (the version `tch` 0.17 binds to). If `LIBTORCH` is unset, the build downloads it — set it for offline builds. |
| Model files | Downloaded on first use into `~/.cache/.rustbert`, or the directory in `RUSTBERT_CACHE` |
| `onnx` feature | Adds rust-bert's ONNX Runtime support. It does **not** remove the libtorch requirement. Point `ORT_LIB_LOCATION` at the ONNX Runtime *directory*. |

```toml
magicaf-nlp = { git = "ssh://git@github.com/intracav/MagicAF.git", features = ["models"] }
```

If you enable `onnx` from outside the MagicAF workspace, also copy the workspace's `[patch.crates-io]` entry for `ort` into your `Cargo.toml`; the version rust-bert asks for has been yanked from crates.io.

## Offline use

Because most pipelines load through rust-bert's cache rather than `ModelSource::Local`, prepare an offline host by warming the cache: on a connected machine, set `RUSTBERT_CACHE` to an empty directory, construct each pipeline you need once, then copy that directory to the same `RUSTBERT_CACHE` path on the isolated host.

## Example

```rust
use magicaf_nlp::prelude::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let sentiment = SentimentPipeline::new(SentimentConfig::default()).await?;
    for r in sentiment.predict(&["I love Rust!", "This is terrible."]).await? {
        println!("{:?}: {:.4}", r.polarity, r.score);
    }

    let ner = NerPipeline::new(NerConfig::default()).await?;
    let entities = ner.predict(&["Amy lives in Paris."]).await?;
    for e in &entities[0] {
        println!("{}: {} ({:.4})", e.label, e.word, e.score);
    }
    Ok(())
}
```

{{< card-grid >}}
{{< card title="Quick Start" href="/docs/api-reference/nlp/quickstart/" >}}
Get up and running with your first NLP pipeline in minutes.
{{< /card >}}
{{< card title="Setup & Configuration" href="/docs/api-reference/nlp/setup/" >}}
Install native dependencies, configure models, and set up for air-gapped deployments.
{{< /card >}}
{{< card title="Pipelines" href="/docs/api-reference/nlp/pipelines/" >}}
Complete reference for all available NLP pipelines.
{{< /card >}}
{{< card title="Use Cases & Examples" href="/docs/api-reference/nlp/use-cases/" >}}
Working code examples for common NLP tasks.
{{< /card >}}
{{< /card-grid >}}
