---
title: "Core Concepts"
description: "The mental model behind MagicAF: how the crates layer, what happens inside a retrieval run, and which traits are yours to implement."
weight: 2
---

Three pages give you the model the rest of these docs assume. Read them in order.

{{< card-grid >}}
{{< card title="Architecture" href="/docs/core-concepts/architecture/" label="The map" >}}
The crates by layer, the service traits at the bottom, the engines that compose them, and where your code goes.
{{< /card >}}
{{< card title="The RAG pipeline" href="/docs/core-concepts/rag-pipeline/" label="Inside a run" >}}
Every stage between your question and a typed result, its defaults, and how each one fails.
{{< /card >}}
{{< card title="Traits and interfaces" href="/docs/core-concepts/traits-and-interfaces/" label="The contract" >}}
Every trait, its methods, what ships in the box, and what you would implement yourself.
{{< /card >}}
{{< /card-grid >}}
