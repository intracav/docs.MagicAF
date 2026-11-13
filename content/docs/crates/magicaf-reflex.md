---
title: "magicaf-reflex"
description: "The Reflex v2 scorer on the device — calibration, gates, abstention, and the decision record — with no async runtime and no networking by default."
weight: 22
---

{{< crate-header "magicaf-reflex" >}}

`magicaf-reflex` makes small, calibrated decisions on the device: it scores a fixed set of options, reports how confident it is, and abstains or escalates when it should not decide alone. It has no dependency on `magicaf-core`, no async runtime, and no networking unless you enable `cloud-ureq`, and it builds to WebAssembly and to a Swift package.

## Documentation

| Page | Covers |
|---|---|
| [On-device scorer](/docs/reflex/on-device-scorer/) | The Rust and Swift APIs |
| [MagicAF Reflex overview](/docs/reflex/) | What Reflex is and how it earns authority |
