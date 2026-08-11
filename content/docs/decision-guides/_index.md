---
title: "Decision Guides"
description: "Trade-off analysis and decision frameworks for engineers evaluating MagicAF for their organization."
weight: 2.7
tags: [decisions, evaluation, trade-offs, architecture]
categories: [guide]
---

Some choices are cheap to reverse — a config flag, a default adapter. Others harden into infrastructure: the models you standardize on, the adapters your domain logic grows around, the deployment topology you commit hardware to. Decision guides exist for the expensive ones. They answer **"why" and "when"** questions — the trade-off analysis engineers need when evaluating MagicAF for their organization or choosing between implementation options. Tutorials and guides show you how; these pages help you decide what, before the choice gets expensive.

---

<div class="card-grid">
<div class="card">

### [Choosing Models →](/docs/decision-guides/choosing-models/)
Compare embedding models, LLMs, and quantization strategies for local deployment.

</div>
<div class="card">

### [Adapter Patterns →](/docs/decision-guides/adapter-patterns/)
When to customize each adapter trait, and common patterns and anti-patterns.

</div>
<div class="card">

### [Deployment Strategy →](/docs/decision-guides/deployment-strategy/)
Decision tree for Docker, GPU, air-gapped, and edge deployments.

</div>
</div>
