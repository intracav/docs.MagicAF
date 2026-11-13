---
title: "Crates"
linkTitle: "All crates"
description: "Every crate in the MagicAF workspace — what it does, how mature it is, and what it needs at runtime."
weight: 3.5
keywords: [MagicAF crates, Rust AI crates, magicaf-core, magicaf-agent, magicaf-mcp, magicaf-ui]
hideAutoGrid: true
---

MagicAF is a Cargo workspace of {{< stat "crates" >}} crates. You depend only on the ones you use: a retrieval pipeline needs `magicaf-core` plus a vector store and an LLM client; an agent host adds `magicaf-agent` and `magicaf-tools`; a mobile app may need nothing but `magicaf-mobile`.

Every crate is version `0.1.0`, dual-licensed MIT OR Apache-2.0, and built on Rust 1.91. Crates are consumed as git dependencies from the MagicAF repository — see [Installation](/docs/getting-started/installation/#access).

## Status {#status}

Each crate carries one of four statuses. They describe how much you can lean on the API today, judged from what the source shows: who uses it in production, how it is tested, and how fast it is changing.

| Status | Meaning |
|---|---|
| {{< crate-status "stable" >}} | Used in production by at least one product. Breaking changes are deliberate and recorded in the [changelog](/docs/changelog/). |
| {{< crate-status "preview" >}} | Works and is tested, but young or with a single consumer. Expect breaking changes between minor versions. |
| {{< crate-status "experimental" >}} | In the workspace, with no production consumer yet. Read the source before you depend on it. |
| {{< crate-status "reference" >}} | A working assembly to learn from and adapt — not a supported production deployable. |

## The catalog

{{< crate-catalog >}}
