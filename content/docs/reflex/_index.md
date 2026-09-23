---
title: "MagicAF Reflex: Calibrated On-Device Decisions"
linkTitle: "MagicAF Reflex"
description: "A System One decision layer: one state, typed questions, calibrated answers with an explicit abstain. Runs on the device from hash-pinned ONNX, zero network."
weight: 8.5
keywords: [MagicAF Reflex, System One model, decision model, calibrated classifier, selective prediction, abstention, on-device ONNX, onnxruntime-web, Jev alternative, typed decisions, LLM gating]
tags: [reflex, decisions, calibration, on-device, onnx, lumen]
categories: [concept]
difficulty: intermediate
---

{{< callout type="warning" title="Status: in development, internal builds only" >}}
MagicAF Reflex is not released. The contract, backends, runtime, calibration tooling and evaluation harness described in this section exist and are tested, on an unmerged development branch. The model itself is still being trained and selected, so these pages publish **no accuracy figures yet**. The only consumer today is an internal build of the Lumen browser extension. Anything marked **planned** or **design** has not been built.
{{< /callout >}}

You have probably written this code already: an `if` in front of an LLM call that decides whether the call is needed at all. Is this request something we can handle locally? Is this tool call dangerous? Does the answer need the page? You usually write that `if` as a regex, and it degrades the way regexes do. Or you ask the LLM itself, which gives you an answer, but no calibrated probability and no clean way to say *I don't know*.

**MagicAF Reflex** is a small decision model built for that `if`. It generates no text. A caller sends one **state** (a request, plus facts such as the sections on a page) and a list of typed **questions**. It gets back typed **answers**: a choice, a yes/no, or a score. Each answer carries a **calibrated probability** and an explicit **`abstain`** flag with a reason. The model runs **on the device**, from packaged ONNX artifacts pinned by SHA-256, and makes no network request.

This section is for engineers who put fast, gated decisions in front of slow, expensive, or risky actions. By the end you will know the wire contract, how the model turns logits into calibrated probabilities, how thresholds are certified with a stated risk bound, and how a decision model earns authority step by step rather than getting it on day one.

## Decisions, not generation

A **System One** model answers quickly and narrowly, the way you recognize a word without reading it letter by letter. A generative model is System Two: it can reason, and it can also make things up. Reflex deliberately stays on the System One side:

- **Its output space is closed.** An answer is one of the options you sent, a yes/no, or a level. There is no decoding loop, so there is nothing to hallucinate and no output to parse.
- **Its questions are fixed.** A question names a **key** in a versioned **question set**, and the model is trained for exactly those keys. You cannot send free-text instructions: a small encoder cannot follow them, and pretending it could would make its probabilities meaningless.
- **Its probabilities mean something.** They are fitted on held-out data (see [Calibration and Abstention](/docs/reflex/calibration-and-abstention/)), so a consumer can put a threshold on them and state the risk that threshold carries.
- **It is allowed to not know.** Every answer can abstain. An abstained answer tells the consumer to use the question's **safe default**, and every safe default points toward the more careful path.

Reflex is not a replacement for the LLM agent beside it. It answers questions that are *locally observable in the text*: does this request name a place on this page, is it a clinical instruction, would clicking this control sign something? Counting, arithmetic, indirection, and anything that needs several steps of reasoning go to the LLM. In Reflex terms, the answer to those is `route = cloud`.

## Where it sits

```
                    ┌───────────────────────────────┐
  request + page ──▶│  MagicAF Reflex (on device)   │── typed, calibrated answers
                    │  one state, typed questions   │   + abstain flags
                    └──────────────┬────────────────┘
                                   │
                    ┌──────────────▼────────────────┐
                    │  consumer policy (your code)  │  thresholds certified on the
                    │  act locally · veto · defer   │  calibration split
                    └───────┬───────────────┬───────┘
                            │               │
                   local command       everything else
                   (same grants,       ──▶ the LLM agent,
                   hard-blocks,            exactly as before
                   confirmations)
```

The model never acts. It answers questions, and your code decides what to do with the answers. That split is what makes the [promotion ladder](/docs/reflex/promotion-ladder/) possible. The first consumer, the **Reflex lane** of the Lumen browser extension, starts the model with no authority at all and widens it only on evidence.

## Names

- **Reflex** is the umbrella name for Lumen's fast on-device decision layer.
- **MagicAF Reflex** is the engine and the contract documented here. Its identifiers always carry the `magicaf` prefix: `magicaf.reflex.request/v1`, `magicaf.reflex.response/v1`, model ids `magicaf-reflex-<encoder>-<version>`, and the text canonicalisation `magicaf.text/v1`.
- **The Reflex lane** is the consumer inside the browser extension: a local lane beside the cloud agent that runs page commands such as "open the MAR", "find the potassium", or "scroll down".

## What it copies from Jev, and what it doesn't

Reflex's API shape follows **Jev**, the System One model TypeSafe AI [announced in September 2026](https://typesafe.ai/blog/introducing-system-one-models-and-jev). We copied the interface, not the vendor: nothing in Reflex calls Jev, and no Lumen data was sent to it while designing Reflex.

| | Jev (hosted) | MagicAF Reflex (on device) |
|---|---|---|
| Input | a `state` plus questions, each with free-text instructions | a `state` (`text`, `fields`, `page`) plus questions that name keys in a versioned question set |
| Question types | Choice, Score, Noul (a calibrated yes/no) | `choice`, `score`, `yes_no` (Noul renamed for clarity) |
| Options | fixed per question, up to 255 | fixed or **dynamic**: supplied per request, because every page has different sections |
| Abstention | not part of the answer | `abstain` and `abstain_reason` on **every** answer |
| Where it runs | a hosted API | in the client, from pinned artifacts, with no network |
| Speed and cost | 70–500 ms end to end, $0.042 per million input tokens (vendor claims) | a latency *budget* (below); no per-call cost |

The vendor figures are TypeSafe's own, as reported in [its documentation](https://docs.typesafe.ai/introduction) and in [this technical write-up](https://flaviocopes.com/jev/). We have not measured them.

Four lessons from public Jev material shaped the design:

- **Confidence is not correctness.** A [community benchmark of Jev in an agent harness](https://dev.to/aitejiu/benchmarking-jev-what-a-decision-model-can-and-cant-do-in-an-agent-harness-20po) found that its lowest-score bucket (0–0.1) on a prompt-injection dataset still held 16.6% malicious samples. Reflex therefore assumes no calibration: every threshold is fitted on a held-out calibration split and checked on a separate frozen test split.
- **Decompose.** The same benchmark reported shell-command gate false positives falling from 14.5% to 1.8% when one monolithic question was split into several orthogonal ones combined in code. Reflex asks small questions (`intent`, `section`, `clinical`, `commit_risk`) and composes them, rather than asking "should I act?".
- **The choice competes, the yes/no verifies.** `section` picks a target, and `commit_risk` independently checks the picked target.
- **Stay in bounds.** [Published guidance](https://flaviocopes.com/jev/) notes that Jev does not count reliably, and struggles with arithmetic, indirection (a property of a property), and double negatives. Reflex questions are restricted to things you can see in the text; everything else is `cloud`.

## Budgets

The design sets three performance budgets for the browser runtime, and the end-to-end test asserts all three on every run: a warm decision at p95 ≤ 50 ms, a cold start ≤ 1.5 s, and a model package ≤ 30 MB. These are targets that a candidate model must meet to be selected. They are not measurements.

[NEEDS: measured latency, cold start, package size, and memory for the selected model, with hardware, browser, and date]

## The pages in this section

{{< card-grid >}}
{{< card title="The Decision Contract" href="/docs/reflex/contract/" tint="accent" label="Reference" >}}
`magicaf.reflex.request/v1` and `response/v1` field by field: question types, dynamic options, the reserved `none`, abstain reasons, numeric error codes, and four independent version axes.
{{< /card >}}
{{< card title="Question Sets" href="/docs/reflex/question-sets/" tint="blue" label="Reference" >}}
`reflex.page_command@1.0.0` key by key, with meanings and safe defaults, the semver rules, and the planned `lumen.*` sets.
{{< /card >}}
{{< card title="Architecture" href="/docs/reflex/architecture/" tint="green" label="Concept" >}}
Swappable backends, the shared encoder and its heads, the two ONNX graphs and their exact I/O, text canonicalisation, tokenizer parity, and the hash-verified runtime.
{{< /card >}}
{{< card title="Calibration and Abstention" href="/docs/reflex/calibration-and-abstention/" tint="accent" label="Concept" >}}
Temperature and Platt scaling, per-question selective thresholds, veto thresholds with a bounded recall cost, and λ chosen with a Clopper–Pearson upper bound.
{{< /card >}}
{{< card title="Evaluation Harness" href="/docs/reflex/evaluation/" tint="blue" label="Concept + reference" >}}
Frozen, hashed datasets with a train/held-out vocabulary split, gold labels by construction, the JSON report, and the lane-policy metrics.
{{< /card >}}
{{< card title="The Promotion Ladder" href="/docs/reflex/promotion-ladder/" tint="green" label="Concept" >}}
Shadow, veto, strict two-key, model decides: what the model may do at each rung, and the invariants that hold at all of them.
{{< /card >}}
{{< card title="Privacy and Supply Chain" href="/docs/reflex/privacy-and-supply-chain/" tint="accent" label="Concept" >}}
Zero network, proven in an end-to-end test; fail-closed SHA-256 on every runtime and model file; counts-only telemetry; internal-build-only packaging.
{{< /card >}}
{{< card title="Other Runtimes" href="/docs/reflex/other-runtimes/" tint="blue" label="Design" >}}
The planned Flutter (Dart FFI) and Rust (`magicaf-reflex-onnx`) ports, and the rule that each one must pass the same parity fixtures.
{{< /card >}}
{{< card title="Adding a Question" href="/docs/reflex/adding-a-question/" tint="green" label="Guide" >}}
Add a key to a question set, teach the backends to answer it, and get it calibrated and evaluated, following the real code paths.
{{< /card >}}
{{< /card-grid >}}

Reflex is not a medical device. It makes no clinical decisions: its job in Lumen is to decide whether a request is a page command the device can run, and to hand everything else to the cloud agent.
