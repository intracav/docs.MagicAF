---
title: "magicaf-qdrant"
description: "A VectorStore implementation over Qdrant's REST API."
weight: 3
---

{{< crate-header "magicaf-qdrant" >}}

`magicaf-qdrant` implements `magicaf-core`'s `VectorStore` trait against [Qdrant](https://qdrant.tech/)'s REST API on port 6333: collections, indexing, filtered and scoped search, payload updates, deletion by filter, paginated scrolling, counting, and quantized collections. Collections use cosine distance and UUID point ids.

## Documentation

| Page | Covers |
|---|---|
| [Vector store reference](/docs/api-reference/core/vector-store/) | The trait, Qdrant, and the in-memory store |
