---
title: "Examples"
description: "Complete, runnable programs from the MagicAF repository, from a three-document pipeline to fully custom adapters and on-device decisions."
weight: 6
---

Each example is a crate in the MagicAF workspace's `examples/` directory, so it builds in the workspace's own CI. The pages here explain what each one demonstrates and include its full source as of commit `f190749`. If you want to be taught step by step, start with the [Tutorials](/docs/tutorials/); if you need one task done, see the [Guides](/docs/guides/).

| Example | Shows | Custom adapters | Result type |
|---|---|---|---|
| [Minimal RAG](/docs/examples/minimal-rag/) | The default pipeline end to end | None | `String` |
| [Document Q&A](/docs/examples/document-qa/) | Citations and JSON output | Formatter, prompt builder | `QAAnswer` |
| [Multi-Source Analysis](/docs/examples/multi-source-analysis/) | Every stage customized | Formatter, prompt builder, parser | `IntelSummary` |
| [Reflex: Decide](/docs/examples/reflex-decide/) | Calibrated on-device decisions | — | Answer distributions |

## Running them

From a checkout of the MagicAF repository, with the services from [Prerequisites](/docs/getting-started/prerequisites/) running:

```bash
cargo run -p example-minimal-rag
cargo run -p example-document-qa
cargo run -p example-intelligence-analysis
cargo run -p example-reflex-decide -- magicaf-reflex-onnx/tests/fixtures/core-mini   # no services needed
```

The crate pages carry smaller, compiled examples for everything else — agents, tools, MCP, ingest, routing, and more. Start from the [crate catalog](/docs/crates/).
