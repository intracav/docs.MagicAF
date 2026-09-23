---
title: "Privacy and Supply Chain"
description: "Zero network proven by CDP capture in an end-to-end test, fail-closed SHA-256 on every runtime and model file, counts-only telemetry, and internal-only packaging."
weight: 7
keywords: [on-device inference privacy, zero network, SHA-256 integrity, fail closed, model supply chain, tamper detection, counts-only telemetry, browser extension CSP, wasm-unsafe-eval, offscreen document]
tags: [reflex, privacy, security, supply-chain, integrity]
categories: [concept]
difficulty: intermediate
prerequisites:
  - /docs/reflex/architecture/
---

"Runs on the device" is a claim that is easy to make and easy to break without noticing: a runtime that fetches its WebAssembly from a CDN, a telemetry field that happens to hold the request, a build that ships the model where it shouldn't. MagicAF Reflex treats each of these as something to **prove in a test**, not to state in a README. This page lists what is proven and how.

The same register applies here as everywhere on this site (see [Security Hardening](/docs/deployment/security/)): these are capabilities of the software. Whether a deployment meets a particular obligation depends on that deployment.

## Zero network

The Reflex model runs in a worker inside the extension's offscreen document. The only files it loads are the extension's own packaged files.

The end-to-end test proves this. It attaches Chrome DevTools Protocol sessions to the offscreen document and, through nested sessions, to its workers, auto-attaching each worker before it runs. It then records every network request they make while the model loads and answers 101 requests. The test requires that:

- every request goes to the extension's own `chrome-extension://<id>/` origin, with no foreign URL at all; and
- the requested paths are **exactly** the expected set: the worker script, `magicaf-reflex-manifest.json`, and eight vendored files (`ort.wasm.min.js`, `ort-wasm-simd-threaded.mjs`, `ort-wasm-simd-threaded.wasm`, `encoder.onnx`, `heads.onnx`, `vocab.txt`, `model.json`, and `calibration.json`).

The test uses a CDP capture, not the page's Resource Timing API, because Resource Timing does not report `chrome-extension://` requests.

The runtime is configured so that it cannot reach out silently. It runs with one thread and no proxy worker, and it creates no `blob:` URLs. A cross-origin glue URL would have to be fetched into a `blob:`, which the extension's content security policy forbids, so that failure would be loud.

## Fail-closed integrity on every file

`magicaf-reflex-manifest.json` pins the SHA-256 and byte size of every runtime and model file, and of the license texts shipped beside them. The manifest is packaged inside the extension alongside the files it pins. Before the worker executes or loads any file, it:

1. fetches the file from the packaged `magicaf/vendor/` path;
2. refuses it if the manifest does not pin it (`integrity`);
3. refuses it if it is missing (`model_unavailable`);
4. hashes it with SHA-256 and refuses it on any mismatch (`integrity`).

The worker also refuses a `model.json` that does not declare the expected intent order.

The end-to-end suite tampers with five files in turn: the runtime JavaScript, the WebAssembly glue, the `.wasm` binary, `encoder.onnx`, and `calibration.json`. For `calibration.json` the edit is to set `lambda` to 0, which would widen what rung 3 may do. Each tampered build must be refused with `integrity`.

The same rule applies earlier, when the files are vendored:

- `pnpm magicaf:vendor` copies or fetches each pinned file, verifies it, and never keeps a file that does not match its pin.
- Pinning refuses a calibration that was fitted on a different encoder: the calibration's `model_sha256` must equal the encoder's hash.
- A retrain produces new artifacts with new hashes. Pins are re-pointed only by an explicit, reviewed step, never silently.
- The onnxruntime-web version is pinned, and its files are hashed like the model's.

The pattern follows `magicaf-asr-onnx` in the MagicAF framework, which hashes each model file with SHA-256 at load time and fails closed before the file reaches the native runtime.

## Counts-only telemetry

In shadow mode, the lane records a comparison between the model and the rules. It stores these, and only these:

- counters;
- latency buckets;
- per-question agreement matrices;
- calibration buckets (a predicted-probability bin crossed with agreement);
- allowlisted error codes;
- the ids of the model and calibration artifacts.

Any error code that is not on the allowlist is counted as `other`, so free text can never enter through an error message.

It never stores request text, page labels, page content, or identifiers. A unit test runs the recorder over real requests and asserts that none of their text or labels appears in the stored record. The record lives in the extension's local storage. Uploading it anywhere would be a future change requiring separate approval.

The eval report follows the same rule: it identifies rows by id and never holds request text (see [the report](/docs/reflex/evaluation/#the-report)).

## Internal builds only

The model, its runtime, and the offscreen document ship **only in internal Chrome and Edge builds**. Inclusion is opt-in at build time, so no packaging path can ship the model by accident. Every other build keeps the extension's pre-Reflex posture, including every store build and every Safari build:

| | Store and Safari builds | Internal Chrome/Edge build |
|---|---|---|
| `offscreen` permission | no | yes, and nothing else is added |
| Content security policy | `script-src 'self'` | `script-src 'self' 'wasm-unsafe-eval'` |
| Offscreen document, Reflex worker, `magicaf/` assets | absent | present |
| onnxruntime code anywhere in the bundle | absent | present |

`'wasm-unsafe-eval'` lets the extension compile its **packaged** WebAssembly. It permits no JavaScript `eval` and no remote script origin, and the posture test asserts that the policy never contains `'unsafe-eval'` or any `http(s):` source.

The posture test runs against the manifests that each build actually produced. For store and Safari builds, it also checks that no file in the bundle references the onnxruntime WebAssembly. Without the offscreen API, every rung of the [promotion ladder](/docs/reflex/promotion-ladder/) resolves to off.

## Licenses

The runtime and every candidate encoder are under permissive licenses (MIT or Apache-2.0). Vendoring fetches the onnxruntime `LICENSE` and `ThirdPartyNotices` at the pinned release, pins them in the manifest, and ships them next to the runtime. The model artifact carries its license text as `LICENSE-model.txt`. The design also calls for keeping an attribution line, and for marking modifications (fine-tuning, quantisation) in a model card.

[NEEDS: link to the published model card and third-party notices, if the owner decides to publish them]
