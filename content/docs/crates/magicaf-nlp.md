---
title: "magicaf-nlp"
description: "In-process NLP pipelines — question answering, named entities, translation, summarization, sentiment, and more — with no external service."
weight: 20
---

{{< crate-header "magicaf-nlp" >}}

`magicaf-nlp` runs transformer pipelines inside your process through rust-bert and libtorch: extractive question answering, named-entity recognition, sentiment, zero-shot classification, summarization, translation, text generation, dialogue, keyword extraction, part-of-speech tagging, and masked-language modeling. Without the `models` feature it compiles to configuration types only.

## Documentation

| Page | Covers |
|---|---|
| [NLP reference](/docs/api-reference/nlp/) | Setup, pipelines, and each task |
| [Setup](/docs/api-reference/nlp/setup/) | libtorch and model files |
