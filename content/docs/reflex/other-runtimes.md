---
title: "Running Reflex in Other Runtimes"
linkTitle: "Other Runtimes"
description: "The planned Flutter (ONNX Runtime + Dart FFI) and Rust (magicaf-reflex-onnx, DecisionService) ports, and the parity fixtures every port must pass."
weight: 8
keywords: [MagicAF Reflex Rust, magicaf-reflex-onnx, ort crate, ONNX Runtime Rust, Flutter ONNX, Dart FFI, DecisionService, cross-runtime parity, golden fixtures]
tags: [reflex, rust, flutter, onnx, design, parity]
categories: [concept]
difficulty: advanced
prerequisites:
  - /docs/reflex/architecture/
---

{{< callout type="warning" title="Partly built (2026-10-26): the Rust crate exists for Reflex Core; the Reflex_01 port and the Dart runtime do not ship yet" >}}
Since 2026-10-26 `magicaf-reflex-onnx` exists in the MagicAF workspace and serves **Reflex Core** artifacts (see [Reflex v2](/docs/reflex/reflex-v2/)) as a `DecisionService`, with the fail-closed integrity, the `link-ort` feature gating and the error-code mapping described below; the Reflex_01 two-graph port into the same crate is in progress and the Dart ONNX runtime is not built. The rest of this page is the design it follows. What does exist beyond the browser extension's TypeScript implementation (as of 2026-10-12): the `DecisionService` trait in `magicaf-core::decision` (abstaining is an answer, never an error; `Answer`, `AbstainReason`, `verify_evidence`, `check_record`), the server-side question sets `lumen.app_command@1.0.0` / `lumen.app_ground@1.0.0` answered by `lumen_server` over TEI embeddings (shadow), and a pure-Dart port of the page-command RULES lane, grounding and executor in the Lumen app (no model on device).
{{< /callout >}}

The point of a language-neutral contract and a two-graph ONNX artifact is that the model you calibrated and evaluated can run unchanged somewhere else. The design names two more runtimes: the Lumen Flutter app and `lumen_server`. Both use **the same artifacts** and **the same contract JSON**:

- `encoder.onnx` and `heads.onnx`;
- `vocab.txt` and `model.json`;
- `calibration.json`;
- `magicaf-reflex-manifest.json`, with the SHA-256 of every file.

## The parity rule

A port is not correct because it compiles, or because it looks right on a few examples. It is correct when it passes **the same fixture files** that the TypeScript implementation passes:

1. **Canonicalisation:** `magicaf.text/v1` on the shared text fixture, output for output.
2. **Tokenizer ids:** WordPiece ids matching the fixtures that the Hugging Face tokenizer wrote, id for id.
3. **A golden decision set:** (request → calibrated answers), matching to within **1e−4**.

The first two fixture files exist today and gate the TypeScript and Python implementations. The golden decision set is part of the port design. Each port also has to implement the JSON Schemas' `x-semantic-rules`, which the schemas cannot express themselves (see [the contract](/docs/reflex/contract/#questions)).

## Flutter app (iOS, Android, macOS, Windows)

- **Runtime:** ONNX Runtime mobile or desktop, through a Dart FFI binding: either an existing ONNX Runtime package for Dart, or a thin FFI over the ONNX Runtime C API. That is the same shape as the `magicaf-mobile` FFI already in the MagicAF repository (see [Mobile API](/docs/api-reference/mobile/)).
- **Port:** `text.ts`, `tokenizer.ts`, and the post-processing in `backends/local.ts` (softmax and sigmoid with the calibrated temperatures, Platt scaling for `route`, per-question abstention) move to Dart, gated on the parity fixtures above.
- **Integrity:** the model ships as a signed pack, and every file is checked against its SHA-256 before it is loaded, exactly as in the browser worker.

## `lumen_server` (Rust)

A new crate in the MagicAF workspace, **`magicaf-reflex-onnx`**, following the framework's `magicaf-<capability>-<runtime>` naming, as `magicaf-asr-onnx` does:

- It uses the `ort` crate (ONNX Runtime bindings), linked behind a `link-ort` feature. That mirrors `magicaf-asr-onnx`, whose native linking is behind a feature so that `cargo check` and `cargo doc` work without the native libraries.
- An `integrity.rs` does fail-closed SHA-256 before load, as `magicaf-asr-onnx/src/integrity.rs` does today: stream-hash the file, compare, and return an error *before* the bytes reach the native runtime.
- It uses flat DTOs and numeric error codes, following MagicAF's [FFI conventions](/docs/api-reference/core/ffi/).
- It implements a **`DecisionService`** trait in `magicaf-core`, so that it sits beside `EmbeddingService`, `VectorStore`, and `LlmService` as one more swappable infrastructure service (see [Traits and Interfaces](/docs/core-concepts/traits-and-interfaces/)).

The server use cases are the [planned question sets](/docs/reflex/question-sets/#planned-sets): gating a proposed tool call (`lumen.tool_risk`) and routing between a small and a frontier model (`lumen.route`), both *before* an LLM call is made. The model runs where the data already is, so no additional data leaves the server.

The error codes (1001–2004, carried in the response) map to `MagicError::ReflexInvalidRequest` … `ReflexBackendError` (`error_code()` 26001–26104) with `reflex_wire_code()` / `from_reflex_wire_code()` converting both ways (MagicAF ADR-003).

## Rollout across runtimes

- Artifacts are published by version. Clients pin the model and the calibration by SHA-256, and **never fetch a floating "latest"**.
- The server bootstrap names the `(model, calibration)` pair allowed at each rung of the [promotion ladder](/docs/reflex/promotion-ladder/). A client holding a different pair runs in shadow only.
- Telemetry stays counts-only in every runtime, as described in [Privacy and Supply Chain](/docs/reflex/privacy-and-supply-chain/#counts-only-telemetry).
