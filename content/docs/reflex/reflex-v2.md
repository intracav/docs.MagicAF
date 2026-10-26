---
title: "Reflex v2: Reflex Core and Reflex_02"
linkTitle: "Reflex v2 (Core)"
description: "The in-house System One model family: a Laya-class instruction-following model (Reflex Core) and its on-device distillate (Reflex_02), shipped as a MagicAF SDK capability. Status, what is proven, what is not."
weight: 8.7
keywords: [Reflex Core, Reflex v2, System One model, Laya, Jev-compatible, ModernBERT, RLCD, magicaf-reflex-onnx, DecisionService, air-gapped]
tags: [reflex, decisions, onnx, rust, design, status]
categories: [concept]
difficulty: advanced
prerequisites:
  - /docs/reflex/contract/
---

{{< callout type="warning" title="Status 2026-10-26: runtime and contract built and tested; NO trained Reflex Core exists yet" >}}
Everything on this page that says *proven* has a committed report behind it (paths below, in the MagicAF
repository). **No Reflex Core model has been trained, calibrated or shipped.** The runtime is exercised with
a random-weight parity fixture and with the published Laya checkpoint; the training job is a reviewed bundle
awaiting a GPU host. Reflex_02 does not exist. Nothing here holds authority above shadow anywhere.
{{< /callout >}}

## Naming

*Reflex v2* is the model family built under `docs/reflex/v2/` in the MagicAF repository (ADR-001):

- **Reflex Core** — a Laya-class model (ModernBERT encoder + a per-option `[MASK]`-marker decision head)
  that answers *free-text* typed questions (`choice`, `score`, `noul`) about a state in one forward pass.
- **Reflex_02** — the small on-device keyed specialist, distilled from Core, successor to
  {{< stat "reflex_model_name" >}} (planned; not built).

The fitted linear scorer of Lumen Hospital, formerly documented as "Reflex v2", is now the
[Reflex Sim Scorer](/docs/reflex/on-device-scorer/); its crate and file formats are unchanged.

## Two kinds of question, two levels of trust (ADR-002)

| | Keyed | Ad-hoc |
|---|---|---|
| Shape | `key` names a key in a versioned question set | `instructions` (+ `criteria`), no `key` |
| Calibration | per key, on a frozen calibration split | one temperature per (type × option-count bucket) |
| Answer flags | `certified` may be true, `calibration_scope: "key"` | `certified: false`, `calibration_scope: "generic"` |
| Authority | may hold a rung above shadow once certified and approved | never: shadow and advisory only; `verdict` never returns *act* |
| On device | answered | `abstain: unsupported` |

## Contract v2, revision 2 (ADR-003)

The wire stays `magicaf.reflex.request/v2` / `response/v2`; revision 2 adds, all optional: a conversation
(array) `state`, `noul` criteria as `{true?, false?}` descriptions, and on every answer `answer_confidence`
(max p), `certified`, `calibration_scope`; plus the abstain reasons `unsupported_language` and
`input_truncated`. A question with `key` is keyed; with `instructions` and no `key` it is ad-hoc; with
neither it is keyed with key = id. The canonical schemas and a shared accept/reject corpus (50 request + 24
response cases) live in MagicAF `docs/contracts/`; the TypeScript (extension), Dart (Lumen app) and Rust
(`magicaf-core`) validators all agree on every case, and `magicaf.state/v1` (the canonical text a model
sees) has its own fixture that all three plus Python reproduce.

## What is proven (committed reports)

| Claim | Evidence (MagicAF repo) |
|---|---|
| Our reimplementation of the Laya architecture reproduces the published checkpoint exactly: 32/32 cases, identical token ids and marker positions, max |Δlogit| = 0.0 (fp32, CPU) | `ml/reflex_core/reports/laya-parity-2026-10-26.json` |
| The Rust runtime (`magicaf-reflex-onnx`, ONNX Runtime) reproduces PyTorch on a Core-architecture artifact: ids/markers identical, logits and probabilities within 1e-4 on 32 golden cases; tokenizer fixture (251 strings) id for id | `magicaf-reflex-onnx/tests/parity.rs`, fixtures `tests/fixtures/core-mini/golden.json`, `docs/contracts/fixtures/magicaf.tokenizer/` |
| Fail-closed integrity: every artifact file hash-checked before load; a calibration that does not name the loaded graph is refused; a tampered byte makes the server exit | `magicaf-reflex-onnx/tests/parity.rs`, `deploy/reflex/airgap-test.sh` |
| Malformed and oversized requests never panic and always yield well-formed abstentions (3,000 mutations) | `magicaf-reflex-onnx/tests/fuzz_contract.rs` |
| Frozen evaluation splits for the planned sets `lumen.route`, `lumen.tool_risk`, `lumen.needs_page`, `lumen.clinical_content` (1,500 calibration + 1,500 test + 300 adversarial each; ≥ 704 must-defer rows per split) and an ad-hoc corpus; leakage guard against every frozen set | `ml/reflex_core/data/frozen/*/FROZEN.json` |
| The calibration/certification path runs through ONNX Runtime and **refuses** to certify when the evidence is not there (smoke artifact: every key `abstain_below = 1.0`, nothing certified) | `ml/reflex_core/reports/calibration-magicaf-reflex-core-mini-0.0.0-smoke-2026-10-26.json` |
| A Jev-compatible server exists: `POST /v1/systemone` (TypeSafe/Jev request and response shape) and the native `POST /v2/reflex`, bearer auth required, counts-only stats | `magicaf-reflex-onnx/src/bin/reflex-serve.rs`, `deploy/reflex/RUNBOOK.md` |

## What is not done

- **Training.** Stage 1 + RLCD code exists and ran end to end on a random mini encoder (pipeline proof
  only). Candidates A (Laya-initialised) and B (ModernBERT-large, our data only) are job bundles for a
  GPU host (`ml/reflex_core/jobs/`); no host was available. No quality number for Reflex Core exists.
- **Certification** of any keyed set on a shipped artifact; **Reflex_02**; the Dart ONNX runtime; the
  rung-3 argument-extraction prototype (ADR-008); the ADR-010 air-gap gate table (built, not measured).
- **Teacher labels.** The cached teacher pipeline exists; no frontier-model call has been made.

## Proving grounds (all shadow, counts only)

`lumen_server` asks a Core artifact the three planned keyed questions per chat turn through its decision
gateway (off by default: `REFLEX_CORE_SHADOW`); the Lumen Hospital sim can name Reflex Core as an
*escalation* backend (replay stays on the Sim Scorer); the extension gets Reflex_02 only when it exists.

## Air-gapped availability (ADR-010)

Reflex Core ships in the air-gapped profile only when every gate passes: provenance in the SBOM (candidate
B is the default; A only with the upstream hash pinned and its training-data gap written up), zero network
(`--network none` test), CPU int8 latency on x86 and Apple silicon, robustness (adversarial, fuzz, soak),
safe degradation, and ad-hoc answers never certified. Until then the air-gapped profile ships keyed
questions only. The gate table is in `docs/reflex/v2/adr/ADR-010-air-gapped.md`, every row **pending**.
