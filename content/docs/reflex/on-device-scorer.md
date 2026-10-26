---
title: "Reflex v2 on the Device: magicaf-reflex"
linkTitle: "On-Device Scorer (v2)"
description: "The Lumen Hospital sim's fitted Reflex v2 scorer as a Rust crate: Rust, WASM and Swift builds; exact, Core ML and cloud backends; bit-exact with the TypeScript scorer."
weight: 8.2
keywords: [magicaf-reflex, Reflex v2, on-device decision model, UniFFI, Swift package, xcframework, Core ML MLProgram, WebAssembly, deterministic floating point, libm, msun, bit-exact parity, model manifest, sha256 pinning]
tags: [reflex, rust, swift, wasm, coreml, determinism, on-device]
categories: [reference]
difficulty: advanced
prerequisites:
  - /docs/reflex/
---

{{< callout type="warning" title="Status: built and tested, not yet in a shipping app" >}}
**Renamed 2026-10-26:** this crate was documented as "Reflex v2"; that name now belongs to the System One model family ([Reflex v2](/docs/reflex/reflex-v2/)). The crate `magicaf-reflex`, its formats and this page's measurements are unchanged.

`magicaf-reflex` is on MagicAF `main`. Its WASM build is what the Lumen Hospital sim scores with; the Swift package is built and tested but not yet wired into the Lumen Hospital Apple app. This is a different model from the extension's BERT-based Reflex described elsewhere in this section: a fitted linear scorer over named game features, with no text.
{{< /callout >}}

`magicaf-reflex` is **Reflex v2**, the scorer Lumen Hospital's simulated staff and operations decide with, as a Rust crate with no async runtime and no networking in its default build. It loads the sim's own model file (`reflex-local-v2.json`) and answers a decision with **the same bits** as the sim's TypeScript scorer, then writes the answer as a `reflex.decision_record/v1`.

Per decision it computes:

1. **Logits:** per option, an intercept for its position (fixed option sets) plus Σ w·f over its named features, in the order the caller lists them. Two decisions (`staff.next`, `doctor.plan`) first add the actor's weight deltas, which is how personality and policy change behaviour.
2. **Belief and policy:** calibration (one temperature, a per-context temperature head, or an isotonic map) gives the calibrated *belief*; the decision temperature sharpens it into the *policy* an actor samples; where one option gathers information (a test), value of information decides its share; an out-of-distribution guard scores how far the inputs are outside the training range.
3. **Record:** gates (a confidence gate that hands the decision to a rule, escalation below a confidence or out of distribution), the top four contributing features, and the decision record.

## Three builds

| Build | How | Used by |
|---|---|---|
| Rust | `Reflex::load`, `Reflex::decide` | servers, tools, tests |
| WASM | `wasm32-unknown-unknown`, a plain C ABI (no wasm-bindgen, no imports) | the sim's decision worker, in the browser and in the Apple app's web view |
| Swift | UniFFI 0.29 → the `MagicAFReflex` Swift package with a static xcframework | native Swift code on iOS 17+ and macOS 14+ |

## Three backends

| Backend | Computes | Use it for |
|---|---|---|
| **Exact** | f64 on the CPU with `libm`; the same bits on every device and browser | everything that plays the game, including replay |
| **Core ML** | the linear head only, as an MLProgram; Rust does the rest | batched Swift callers and future, larger heads. **Never replay** |
| **Lumen cloud** | a hosted model's distribution, over the host's own HTTPS | decisions the device escalates, when signed in and within budget |

## Determinism

A saved game or a film must play back identically on an iPhone, a Mac and in a browser. Three things break that with floating point, and the crate handles each:

- **Transcendentals.** Platform `exp`, `log` and `pow` differ in the last bit across CPUs, OS versions and JavaScript engines. The crate uses `libm` (FreeBSD msun, pinned), and the sim's TypeScript ports the same msun sources.
- **Order.** Addition isn't associative, so every sum keeps the TypeScript's order, including the caller's feature order. JavaScript's `Math.max`/`Math.min` rules for NaN and signed zero are reproduced.
- **Parsing.** The crate parses JSON floats exactly (`serde_json`'s `float_roundtrip`); the default parser can be one ulp off.

**Why Core ML never drives replay.** Core ML decides where a model runs. On the GPU or the Neural Engine it computes in fp16, about three significant digits: a probability near a sampling boundary crosses it, an actor picks another option, and the run diverges from its recording. Even in fp32 on the CPU the answers are close, not identical. Records from the Core ML path name their backend `reflex-local-v2+coreml`.

## The Swift API

```swift
import MagicAFReflex

let reflex = try Reflex.load()   // the bundled model, pinned by its manifest's sha256
let decision = try reflex.decide(DecideRequest(
    decision: "ops.divert",
    options: [
        OptionInput(id: "stay", label: "Stay open", features: ["criticalQ": 0.2, "resusFull": 0]),
        OptionInput(id: "divert", label: "Divert", features: ["criticalQ": 0.9, "resusFull": 1]),
    ],
    questionSet: "lumen.hospital.ops@2.3.0",
    escalateBelow: 0.35
))
decision.chosen      // the option (or -1, deferred)
decision.belief      // calibrated probabilities
decision.escalate    // ask the cloud
let record = try decision.record()   // reflex.decision_record/v1; recordJson holds the full JSON

// Batched, with Core ML computing the head:
let coreml = try CoreMLReflex(reflex: reflex, computeUnits: .all)
let answers = try coreml.decide(requests)   // one decision per batch
```

Features are ordered pairs (`KeyValuePairs`), not a dictionary: the sum order is part of what makes every platform agree.

## Core ML in fp32 without losing the answer

Each decision's head is exported as an MLProgram; Rust owns the column layout, builds the rows and takes the logits back, so everything except the dot product has one implementation. The actor's weight deltas are added by Rust in f64, which keeps them out of the exported models.

A plain fp32 dot product was not good enough: `triage.acuity`'s logits reach about 30, where fp32 loses several millionths, and sharpening the policy amplifies that past the 1e-6 gate. So each request's rows are centred (the answers depend only on differences between options), and every input and weight is split as `hi + lo` with `hi` on a 2^-8 grid. Products of two `hi` parts are multiples of 2^-16, so fp32 adds them **exactly** while partial sums stay under 256; the small parts carry the rest. The model returns both sums and Swift adds them in f64. Logits come out within 4e-9 of f64.

## The manifest

A `manifest.json` pins the model bytes a build ships: name, version, sha256, size, written by the crate itself. `Reflex.load()` refuses bytes that differ, even by a trailing space, and each Core ML head carries the same sha256 and is refused if it doesn't match the loaded model.

## The cloud contract

The `cloud` feature holds the wire contract for Lumen cloud and is the crate's only networking code; the host moves the bytes (URLSession on Apple platforms) and holds the token (the Keychain), which never goes in a URL. `POST /api/sim/reflex` with `{task, key, input, client}`; a `200` carries the answer, whether it acts or stays in shadow, and the budget, including the tier's escalation gate (0.35 free, 0.7 paid). Signed out, over budget or failed, the on-device answer stands.

## Measured

Against the TypeScript scorer on the sim's gate split (1,093 real requests from the game, 942 on fitted decisions); gate: same choices, probabilities within 1e-12.

| Path | Values | Bit-exact | Worst difference |
|---|---|---|---|
| Rust scorer | 9,210 | 9,210 | 0 |
| Rust `Reflex::decide` (named features) | 7,326 | 7,326 | 0 |
| Swift, through the bindings (macOS and iOS simulator) | 8,268 | 8,268 | 0 |
| Core ML, fp32 on the CPU, vs exact | 7,326 | — | 1.3e-9; same choice on all 942 |

| Artefact | Size |
|---|---|
| WASM module | 311,510 bytes |
| xcframework, iOS arm64 slice | 2.5 MB |
| added to a linked, stripped arm64 binary | ~730 KB |
| Core ML heads (7) | 128 KB |

In Swift on an 8 GB M1 (release build, under memory pressure from other work, so upper bounds), one exact decision costs 10–45 µs including the FFI round trip and the record JSON. For heads this small Core ML is 2–5× slower than the exact backend: its per-prediction overhead outweighs the dot products it takes over. It exists for larger future heads, not for today's.

The engineering reference, with the WASM ABI and build commands, is `docs/reflex/on-device.md` in the MagicAF repository.
