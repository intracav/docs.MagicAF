---
title: "Deployment"
description: "Deploy MagicAF in production — Docker, air-gapped, edge/mobile, observability, and scaling."
weight: 5
---

Running a pipeline on your laptop and shipping one to production are different problems — production adds the network boundary, the hardware you actually have, and the pager. This section is for the shipping part. MagicAF is designed for secure, on-premises deployments where data must not leave the network boundary, and these pages cover every scenario that implies: from Docker Compose on a single host to fully disconnected environments and resource-constrained edge devices, plus the observability, scaling, and hardening work that comes with operating any of them. If you're still choosing between deployment options, start with the [Deployment Strategy](/docs/decision-guides/deployment-strategy/) decision guide — come here once the decision is made and it's time to ship.

---

<div class="card-grid">
<div class="card">

### [Docker Compose →](/docs/deployment/docker/)
Reference Docker Compose configuration for all services.

</div>
<div class="card">

### [Air-Gapped Setup →](/docs/deployment/air-gapped/)
Deploy in fully disconnected environments with no internet access.

</div>
<div class="card">

### [Edge & Mobile →](/docs/deployment/edge-mobile/)
Run on resource-constrained devices with InMemoryVectorStore.

</div>
<div class="card">

### [Observability →](/docs/deployment/observability/)
Structured logging, health checks, and metrics.

</div>
<div class="card">

### [Scaling →](/docs/deployment/scaling/)
Horizontal scaling strategies for each component.

</div>
<div class="card">

### [Security →](/docs/deployment/security/)
Security checklist and hardening guidance.

</div>
</div>
