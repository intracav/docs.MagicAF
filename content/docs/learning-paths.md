---
title: "Learning Paths"
description: "Curated reading sequences for new users, decision-makers, and production engineers."
weight: 0
tags: [learning, paths, onboarding, getting-started]
categories: [guide]
last_reviewed: "2026-02-12"
---

Not sure where to start? Pick the path that matches your goal.

---

## Path 1: New to MagicAF

{{< difficulty "beginner" >}}

You are new to MagicAF and want to build your first working pipeline, then understand the architecture well enough to customize it.

<div class="learning-path">
<div class="learning-path-step">
<a href="/docs/getting-started/prerequisites/">Prerequisites</a>
<div class="step-desc">Install Rust and set up local AI services</div>
</div>
<div class="learning-path-step">
<a href="/docs/getting-started/installation/">Installation</a>
<div class="step-desc">Add MagicAF crates and configure environment</div>
</div>
<div class="learning-path-step">
<a href="/docs/tutorials/your-first-rag-pipeline/">Tutorial: Your First RAG Pipeline</a>
<div class="step-desc">Build a working pipeline and understand each component</div>
</div>
<div class="learning-path-step">
<a href="/docs/core-concepts/architecture/">Architecture</a>
<div class="step-desc">Understand the three-layer model and why it exists</div>
</div>
<div class="learning-path-step">
<a href="/docs/tutorials/custom-adapters/">Tutorial: Custom Adapters</a>
<div class="step-desc">Learn when and how to customize pipeline components</div>
</div>
</div>

**Time estimate:** 2–3 hours

---

## Path 2: Evaluating for My Organization

{{< difficulty "intermediate" >}}

You are evaluating MagicAF — part of the [Intracav](https://www.intracav.ai/) ecosystem — for your organization and need to understand capabilities, trade-offs, security posture, and deployment requirements.

<div class="learning-path">
<div class="learning-path-step">
<a href="/about/">About MagicAF</a>
<div class="step-desc">High-level overview and design philosophy</div>
</div>
<div class="learning-path-step">
<a href="/docs/decision-guides/choosing-models/">Choosing Models</a>
<div class="step-desc">Embedding and LLM model comparison, hardware requirements</div>
</div>
<div class="learning-path-step">
<a href="/docs/decision-guides/deployment-strategy/">Deployment Strategy</a>
<div class="step-desc">Decision tree for Docker, air-gapped, edge, and GPU deployments</div>
</div>
<div class="learning-path-step">
<a href="/docs/deployment/security/">Security</a>
<div class="step-desc">Security architecture, hardening checklist, compliance FAQ</div>
</div>
<div class="learning-path-step">
<a href="/docs/deployment/air-gapped/">Air-Gapped Setup</a>
<div class="step-desc">Understand the air-gapped deployment process</div>
</div>
</div>

**Time estimate:** 1–2 hours

---

## Path 3: Building for Production

{{< difficulty "advanced" >}}

You have decided to use MagicAF and need to build, test, deploy, and operate a production pipeline.

<div class="learning-path">
<div class="learning-path-step">
<a href="/docs/getting-started/quickstart/">Quickstart</a>
<div class="step-desc">Get a pipeline running quickly</div>
</div>
<div class="learning-path-step">
<a href="/docs/guides/building-adapters/">Building Adapters</a>
<div class="step-desc">Implement domain-specific pipeline components</div>
</div>
<div class="learning-path-step">
<a href="/docs/guides/testing/">Testing</a>
<div class="step-desc">Unit test adapters and workflows with mocks</div>
</div>
<div class="learning-path-step">
<a href="/docs/deployment/docker/">Docker Compose</a>
<div class="step-desc">Deploy infrastructure services</div>
</div>
<div class="learning-path-step">
<a href="/docs/deployment/observability/">Observability</a>
<div class="step-desc">Set up structured logging, health checks, and metrics</div>
</div>
<div class="learning-path-step">
<a href="/docs/deployment/scaling/">Scaling</a>
<div class="step-desc">Horizontal scaling strategies for each component</div>
</div>
</div>

**Time estimate:** 4–6 hours (including implementation)
