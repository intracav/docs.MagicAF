---
title: "Deployment"
description: "Deploy MagicAF in production — Docker, air-gapped, edge/mobile, observability, and scaling."
weight: 5
---

Running a pipeline on your laptop and shipping one are different problems: production adds a network boundary, the hardware you actually have, and someone on call. These pages cover each deployment shape — a single Docker host, a network with no internet, edge devices — and the operating work that comes with all of them. If you have not chosen a shape yet, start with the [deployment strategy guide](/docs/decision-guides/deployment-strategy/).

---

{{< card-grid >}}
{{< card title="Docker Compose" href="/docs/deployment/docker/" >}}
Reference Docker Compose configuration for all services.
{{< /card >}}
{{< card title="Air-Gapped Setup" href="/docs/deployment/air-gapped/" >}}
Deploy in fully disconnected environments with no internet access.
{{< /card >}}
{{< card title="Edge & Mobile" href="/docs/deployment/edge-mobile/" >}}
Run on resource-constrained devices with InMemoryVectorStore.
{{< /card >}}
{{< card title="Observability" href="/docs/deployment/observability/" >}}
Structured logging, health checks, and metrics.
{{< /card >}}
{{< card title="Scaling" href="/docs/deployment/scaling/" >}}
Horizontal scaling strategies for each component.
{{< /card >}}
{{< card title="Security" href="/docs/deployment/security/" >}}
Security checklist and hardening guidance.
{{< /card >}}
{{< /card-grid >}}
