---
title: "Choosing Models"
description: "Compare embedding models, LLMs, and quantization strategies for local MagicAF deployments."
weight: 1
tags: [models, embeddings, llm, quantization, bge, mistral, llama, phi]
categories: [guide]
difficulty: intermediate
prerequisites:
  - /docs/getting-started/prerequisites/
estimated_reading_time: "12 min"
last_reviewed: "2026-02-12"
---

{{< difficulty "intermediate" >}}

Choosing the right models for a local deployment is one of the most impactful decisions you will make. This guide provides comparison data and a decision framework.

## Embedding Models

Embedding models convert text into dense vectors. The choice affects retrieval quality, memory usage, and inference speed.

### Comparison

| Model | Dimensions | Size | MTEB Score | Speed (CPU) | Speed (GPU) | Best For |
|-------|-----------|------|------------|-------------|-------------|----------|
| **BGE-large-en-v1.5** | 1024 | 1.3 GB | 64.2 | ~50 docs/s | ~500 docs/s | Best quality for English text |
| **BGE-small-en-v1.5** | 384 | 130 MB | 62.2 | ~200 docs/s | ~2000 docs/s | Resource-constrained / edge |
| **E5-large-v2** | 1024 | 1.3 GB | 62.4 | ~50 docs/s | ~500 docs/s | Multilingual or diverse domains |
| **all-MiniLM-L6-v2** | 384 | 80 MB | 56.3 | ~400 docs/s | ~3000 docs/s | Ultra-lightweight, prototyping |

*MTEB scores from the [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard). Speed estimates for batch size 32 on a single core / single GPU.*

### Decision Matrix

**Choose BGE-large-en-v1.5 when:**
- Retrieval quality is your top priority
- You have GPU or dedicated CPU resources for embedding
- Your corpus is English-language
- Documents are technical or domain-specific (higher quality matters more)

**Choose BGE-small-en-v1.5 when:**
- You are deploying on edge devices or limited hardware
- Throughput matters more than marginal quality gains
- Memory is constrained (384-dim vectors use 62% less storage than 1024-dim)

**Choose E5-large-v2 when:**
- Your corpus is multilingual
- You need a single model for diverse text types

**Choose all-MiniLM-L6-v2 when:**
- You are prototyping and want the fastest setup
- Edge deployment with minimal memory
- Retrieval quality is acceptable for your use case

### Quantization for Embedding Models

GGUF-quantized embedding models reduce memory and increase speed with minimal quality loss:

| Quantization | Size Reduction | Quality Impact | Recommended |
|-------------|---------------|----------------|-------------|
| **F16** | ~50% | Negligible | Yes — best default |
| **Q8_0** | ~75% | < 1% degradation | Yes — good for edge |
| **Q4_K_M** | ~87% | 1–3% degradation | Acceptable for prototyping |

---

## LLM Models for Local Use

The LLM generates answers from retrieved context. Local models must balance quality, speed, and hardware requirements.

### Comparison

| Model | Parameters | VRAM (FP16) | VRAM (Q4) | Quality | Speed (A100) | Speed (RTX 3090) |
|-------|-----------|-------------|-----------|---------|-------------|-------------------|
| **Mistral-7B-Instruct-v0.2** | 7B | 14 GB | 4 GB | High | ~40 tok/s | ~25 tok/s |
| **Llama-2-13B-Chat** | 13B | 26 GB | 8 GB | Higher | ~25 tok/s | ~12 tok/s |
| **Phi-2** | 2.7B | 6 GB | 2 GB | Good | ~80 tok/s | ~50 tok/s |
| **Llama-2-7B-Chat** | 7B | 14 GB | 4 GB | Good | ~40 tok/s | ~25 tok/s |
| **TinyLlama-1.1B** | 1.1B | 2.5 GB | 1 GB | Basic | ~120 tok/s | ~80 tok/s |

*Speed estimates for single-request inference. Throughput increases significantly with batching (vLLM).*

### Decision Matrix

**Choose Mistral-7B-Instruct when:**
- You want the best quality-to-size ratio
- You have at least 4 GB VRAM (quantized) or 14 GB (full)
- Your use case requires instruction following and structured output (JSON)
- This is the **recommended default** for most MagicAF deployments

**Choose Llama-2-13B-Chat when:**
- You need higher quality and have the VRAM budget
- Complex reasoning or multi-step analysis tasks
- You have an A100 or multiple consumer GPUs

**Choose Phi-2 when:**
- You need fast inference on limited hardware
- Simple Q&A tasks where conciseness matters
- Edge deployment with 4+ GB VRAM

**Choose TinyLlama-1.1B when:**
- CPU-only deployment
- Latency-sensitive applications
- Quality requirements are modest

### Quantization Trade-offs for LLMs

| Format | Size vs FP16 | Quality Impact | Use Case |
|--------|-------------|----------------|----------|
| **FP16** | 1x (baseline) | None | Production with sufficient VRAM |
| **Q8_0** | 0.5x | Negligible | Production with limited VRAM |
| **Q4_K_M** | 0.25x | Small (1–5%) | Good balance for most deployments |
| **Q4_0** | 0.25x | Moderate (3–8%) | Maximum compression, acceptable for prototyping |
| **Q2_K** | 0.15x | Significant (10–20%) | Only if nothing else fits |

**Recommendation:** Start with **Q4_K_M** for quantized deployments. It offers the best balance of size reduction and quality preservation.

---

## Hardware → Model Mapping

Use this table to pick models based on your available hardware:

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

Adjust based on your hardware constraints and quality requirements. When in doubt, start with the recommended defaults and measure quality on your actual data before optimizing.
