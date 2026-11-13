---
title: "magicaf-reflex-onnx"
description: "The Reflex v2 runtime: Reflex Core and Reflex_01 ONNX artifacts served as a DecisionService, with integrity checks, a C ABI, and an HTTP server."
weight: 23
---

{{< crate-header "magicaf-reflex-onnx" >}}

`magicaf-reflex-onnx` serves trained Reflex artifacts. It loads an ONNX model and its calibration, verifies their hashes before use, and answers through `magicaf-core`'s `DecisionService` trait — in process, through a flat C ABI, or over HTTP with the `reflex-serve` binary.

## Documentation

| Page | Covers |
|---|---|
| [Other runtimes](/docs/reflex/other-runtimes/) | The ONNX runtime, C ABI, and reflex-serve |
| [Reflex v2](/docs/reflex/reflex-v2/) | Current status of Reflex Core |
