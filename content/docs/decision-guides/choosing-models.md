---
title: "Choosing Models"
description: "Compare embedding models, LLMs, and quantization strategies for local MagicAF deployments."
weight: 1
tags: [models, embeddings, llm, quantization, bge, mistral, llama, phi]
categories: [guide]
difficulty: intermediate
prerequisites:
  - /docs/getting-started/prerequisites/
---

{{< difficulty "intermediate" >}}

When you built on a hosted API, choosing a model meant editing a config string — someone else's datacenter absorbed the consequences. Local-first inverts that. The **model menu** is the first place a local deployment feels like a constraint, because every model you pick has to fit on hardware you own, and every quality upgrade has a VRAM price you pay personally. That constraint is not a problem to route around; it is the decision framework.

This guide is for engineers standing up a local MagicAF pipeline who need to pick two models — an embedding model for retrieval and an LLM for generation — plus a quantization level for each. You will leave with defaults you can deploy today and the specific triggers that justify moving off them. The short version: **default to BGE-large-en-v1.5 for embeddings and Mistral-7B-Instruct-v0.2 (Q4_K_M) for generation.** Everything below is the evidence and the escalation paths.

## Embedding Models

Every document you index and every query you run passes through the **embedding model**, which converts text into dense vectors. The choice affects retrieval quality, memory usage, and inference speed — and unlike the LLM, you cannot swap it casually later, because a new embedding model means re-embedding your entire corpus. Decide this one deliberately.

### Comparison

| Model | Dimensions | Size | MTEB Score | Speed (CPU) | Speed (GPU) | Best For |
|-------|-----------|------|------------|-------------|-------------|----------|
| **BGE-large-en-v1.5** | 1024 | 1.3 GB | 64.2 | ~50 docs/s | ~500 docs/s | Best quality for English text |
| **BGE-small-en-v1.5** | 384 | 130 MB | 62.2 | ~200 docs/s | ~2000 docs/s | Resource-constrained / edge |
| **E5-large-v2** | 1024 | 1.3 GB | 62.4 | ~50 docs/s | ~500 docs/s | Multilingual or diverse domains |
| **all-MiniLM-L6-v2** | 384 | 80 MB | 56.3 | ~400 docs/s | ~3000 docs/s | Ultra-lightweight, prototyping |

*MTEB scores from the [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard). Speed estimates for batch size 32 on a single core / single GPU.*

### The Call

Default to **BGE-large-en-v1.5**. Retrieval quality compounds through the whole pipeline — a weaker embedding model hands the LLM worse evidence, and no amount of prompt engineering recovers what retrieval never found. Move down to BGE-small only when hardware forces you to; move sideways to E5 only when your corpus is genuinely multilingual.

{{< card-grid >}}
{{< decision-card title="BGE-large-en-v1.5" tint="green" >}}
- Retrieval quality is your top priority
- You have GPU or dedicated CPU resources for embedding
- Your corpus is English-language
- Documents are technical or domain-specific (higher quality matters more)
{{< /decision-card >}}
{{< decision-card title="BGE-small-en-v1.5" tint="blue" >}}
- You are deploying on edge devices or limited hardware
- Throughput matters more than marginal quality gains
- Memory is constrained (384-dim vectors use 62% less storage than 1024-dim)
{{< /decision-card >}}
{{< decision-card title="E5-large-v2" tint="accent" >}}
- Your corpus is multilingual
- You need a single model for diverse text types
{{< /decision-card >}}
{{< decision-card title="all-MiniLM-L6-v2" tint="accent" >}}
- You are prototyping and want the fastest setup
- Edge deployment with minimal memory
- Retrieval quality is acceptable for your use case
{{< /decision-card >}}
{{< /card-grid >}}

### Quantization for Embedding Models

You already accept lossy compression everywhere else in your stack; embeddings are no different. GGUF-quantized embedding models reduce memory and increase speed with minimal quality loss:

| Quantization | Size Reduction | Quality Impact | Recommended |
|-------------|---------------|----------------|-------------|
| **F16** | ~50% | Negligible | Yes — best default |
| **Q8_0** | ~75% | < 1% degradation | Yes — good for edge |
| **Q4_K_M** | ~87% | 1–3% degradation | Acceptable for prototyping |

Take F16 by default. Drop to Q8_0 on edge hardware. Reserve Q4_K_M for prototypes you intend to re-embed later.

---

## LLM Models for Local Use

The LLM generates answers from retrieved context, and it is where local hardware bites hardest: parameter count drives quality, VRAM, and tokens per second all at once. There is no free axis. Your job is to pick the smallest model that clears your quality bar, then spend the savings on faster inference.

### Comparison

| Model | Parameters | VRAM (FP16) | VRAM (Q4) | Quality | Speed (A100) | Speed (RTX 3090) |
|-------|-----------|-------------|-----------|---------|-------------|-------------------|
| **Mistral-7B-Instruct-v0.2** | 7B | 14 GB | 4 GB | High | ~40 tok/s | ~25 tok/s |
| **Llama-2-13B-Chat** | 13B | 26 GB | 8 GB | Higher | ~25 tok/s | ~12 tok/s |
| **Phi-2** | 2.7B | 6 GB | 2 GB | Good | ~80 tok/s | ~50 tok/s |
| **Llama-2-7B-Chat** | 7B | 14 GB | 4 GB | Good | ~40 tok/s | ~25 tok/s |
| **TinyLlama-1.1B** | 1.1B | 2.5 GB | 1 GB | Basic | ~120 tok/s | ~80 tok/s |

*Speed estimates for single-request inference. Throughput increases significantly with batching (vLLM).*

### The Call

Default to **Mistral-7B-Instruct-v0.2**. It has the best quality-to-size ratio on the menu, follows instructions well enough for structured JSON output, and runs quantized in 4 GB of VRAM. Escalate to Llama-2-13B only when you have measured a quality gap on your own data and have the VRAM to pay for closing it. De-escalate to Phi-2 or TinyLlama when latency or hardware — not preference — demands it.

{{< card-grid >}}
{{< decision-card title="Mistral-7B-Instruct" tint="green" >}}
- You want the best quality-to-size ratio
- You have at least 4 GB VRAM (quantized) or 14 GB (full)
- Your use case requires instruction following and structured output (JSON)
- This is the **recommended default** for most MagicAF deployments
{{< /decision-card >}}
{{< decision-card title="Llama-2-13B-Chat" tint="blue" >}}
- You need higher quality and have the VRAM budget
- Complex reasoning or multi-step analysis tasks
- You have an A100 or multiple consumer GPUs
{{< /decision-card >}}
{{< decision-card title="Phi-2" tint="accent" >}}
- You need fast inference on limited hardware
- Simple Q&A tasks where conciseness matters
- Edge deployment with 4+ GB VRAM
{{< /decision-card >}}
{{< decision-card title="TinyLlama-1.1B" tint="accent" >}}
- CPU-only deployment
- Latency-sensitive applications
- Quality requirements are modest
{{< /decision-card >}}
{{< /card-grid >}}

### Quantization Trade-offs for LLMs

Quantization is how a 14 GB model fits in 4 GB of VRAM. The trade is precision for memory, and the curve is not linear — the first halving is nearly free, the last one is not:

| Format | Size vs FP16 | Quality Impact | Use Case |
|--------|-------------|----------------|----------|
| **FP16** | 1x (baseline) | None | Production with sufficient VRAM |
| **Q8_0** | 0.5x | Negligible | Production with limited VRAM |
| **Q4_K_M** | 0.25x | Small (1–5%) | Good balance for most deployments |
| **Q4_0** | 0.25x | Moderate (3–8%) | Maximum compression, acceptable for prototyping |
| **Q2_K** | 0.15x | Significant (10–20%) | Only if nothing else fits |

**Recommendation:** Start with **Q4_K_M** for quantized deployments. It offers the best balance of size reduction and quality preservation. Q2_K is a last resort, not a strategy.

---

## Hardware → Model Mapping

Your hardware makes most of these decisions for you. Find your row, take the pairing, and stop second-guessing it:

| Hardware | Embedding Model | LLM | Notes |
|----------|----------------|-----|-------|
| **Laptop (8 GB RAM, no GPU)** | BGE-small (Q8) | TinyLlama (Q4) | CPU inference only |
| **Workstation (16 GB RAM, 8 GB VRAM)** | BGE-large (F16) | Mistral-7B (Q4_K_M) | Recommended starter setup |
| **Server (64 GB RAM, 24 GB VRAM)** | BGE-large (F16) | Mistral-7B (FP16) or Llama-2-13B (Q4) | Production-ready |
| **Multi-GPU (2x A100 80GB)** | BGE-large (F16) | Llama-2-13B (FP16) + tensor parallelism | High-throughput production |
| **Edge (Jetson, RPi 8GB)** | BGE-small (Q4) | Phi-2 (Q4) or no LLM | Retrieval-focused |

---

## Summary

For most MagicAF deployments, start with:
- **Embedding:** BGE-large-en-v1.5 (F16 or Q8)
- **LLM:** Mistral-7B-Instruct-v0.2 (Q4_K_M)
- **Infrastructure:** Qdrant + llama.cpp or vLLM

Deviate only on a trigger you can name: hardware that will not fit the default, a multilingual corpus, or a quality gap you have measured on your own data. The defaults exist so you can ship first and tune second. Measure before you optimize.
