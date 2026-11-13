---
title: "Guides"
description: "Step-by-step tutorials for building with MagicAF."
weight: 3
---

You're mid-build and need exactly one thing — a custom adapter, typed JSON out of the LLM, a test that doesn't need a live model server. Guides are for that moment: each one walks a single task from start to working code, step by step. Unlike [Tutorials](/docs/tutorials/), which teach the framework by building projects in order, guides are independent — pick the one that matches your task and go.

---

{{< card-grid >}}
{{< card title="Building Adapters" href="/docs/guides/building-adapters/" >}}
Create custom EvidenceFormatter, PromptBuilder, and ResultParser implementations.
{{< /card >}}
{{< card title="Structured Output" href="/docs/guides/structured-output/" >}}
Get typed JSON responses from the LLM using `JsonResultParser<T>`.
{{< /card >}}
{{< card title="Testing" href="/docs/guides/testing/" >}}
Unit test your adapters and workflows using mock services.
{{< /card >}}
{{< /card-grid >}}
