---
title: "Lumen Models: LMN Sirona and LMN Brigid"
linkTitle: "Lumen Models"
description: "How Lumen serves its clinical model family, LMN Sirona and LMN Brigid, on MagicAF, and how it evaluates them as a system rather than as models."
weight: 8
keywords: [LMN Sirona, LMN Brigid, Lumen models, clinical LLM, medical LLM, model family, LlmGateway, clinical RAG evaluation, medical LLM benchmark]
tags: [models, lumen, sirona, brigid, evaluation, llm-gateway]
categories: [concept]
difficulty: intermediate
---

If you have shipped a retrieval pipeline, you already know the uncomfortable part: the model is the piece everyone asks about and the piece that decides the least. **Lumen**, Intracav's clinical AI platform, runs on two clinical models, and this section is the engineering view of them: how they are served on MagicAF, and how they are measured without the exam scores the field defaults to.

This section is for engineers building clinical or other high-stakes retrieval systems on MagicAF. You will leave with two patterns you can lift directly: addressing a model family by stable name behind [`LlmGateway`](/docs/api-reference/core/llm-service/), and evaluating the whole pipeline in a way that memorization cannot pass.

## The family

| Model | Role | Used by Lumen on |
|---|---|---|
| **LMN Sirona** | Most capable. Complex cases, conflicting evidence, long documents, multi-step agents. | Plus, Max, Teams, and Enterprise plans |
| **LMN Brigid** | Fast. Quick, capable answers to everyday clinical questions. | The free plan for individual clinicians |

Both are clinical models post-trained by Intracav for use inside Lumen. Their base models are not disclosed, and neither is available outside Lumen: there is no API and there are no downloadable weights. The product description lives at [intracav.ai/models](https://intracav.ai/models).

What matters for an engineer is where they sit. Neither model answers from memory alone. Lumen runs hybrid retrieval (dense, full-text, and a clinical knowledge graph, fused by reciprocal rank), reranks with a cross-encoder, admits evidence into the context by source authority with clinical practice guidelines first, and only then calls Sirona or Brigid, which may call clinical tools before citing what it used. Those retrieval and orchestration layers are built on MagicAF.

## The two patterns

{{< card-grid >}}
{{< card title="Serving a Model Family" href="/docs/lumen-models/serving-a-model-family/" tint="accent" label="Guide" >}}
Address models as `family-version`, resolve them from private configuration into an `LlmGateway`, and keep provider identity out of logs, artifacts, and CI output.
{{< /card >}}
{{< card title="Evaluating a Clinical RAG System" href="/docs/lumen-models/evaluating-clinical-rag/" tint="blue" label="Concept + guide" >}}
Temporal-cut items, a hash commitment over the held-out set, product-mode evaluation, grounded accuracy, and a judge whose independence is enforced and whose agreement with clinicians is measured.
{{< /card >}}
{{< /card-grid >}}

## Beside the models

Not every decision in Lumen needs an LLM. [MagicAF Reflex](/docs/reflex/) is a small on-device decision model that answers typed questions with calibrated probabilities and an explicit abstain. In the Lumen browser extension, it decides whether a request is a page command the device can run itself, or one for the cloud agent. It is in development, in internal builds only.

## Why no exam scores

Public medical exam questions are in the training data of every large model, and an exam score measures a model with none of the retrieval, citation, or abstention a clinician actually depends on. Lumen is evaluated as a whole system on held-out questions whose answers rest on evidence published after model training. The full protocol, including its statistical plan and an honest account of what the harness enforces in code versus by procedure, is written up in the [Lumen-Bench technical report](https://intracav.ai/research/lumen-bench). For the landscape of public medical benchmarks and what each can and cannot see, read [Medical LLM benchmarks](https://intracav.ai/medical-llm-benchmarks).

Lumen and its models are not medical devices, and Intracav asserts no FDA clearance, approval, or endorsement for them.
