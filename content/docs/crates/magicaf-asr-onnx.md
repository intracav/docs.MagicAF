---
title: "magicaf-asr-onnx"
description: "On-device streaming speech recognition: the core StreamingAsrService over sherpa-onnx with a Zipformer transducer, with model files checked against pinned SHA-256 hashes before load."
weight: 71
keywords: [magicaf-asr-onnx, on-device speech recognition, sherpa-onnx, Zipformer, streaming ASR, Rust]
---

{{< crate-header "magicaf-asr-onnx" >}}

`magicaf-asr-onnx` transcribes speech as it arrives, on the device, with no service to call. It implements `magicaf-core`'s `StreamingAsrService` over the [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx) C runtime and a streaming Zipformer transducer. You feed it 16 kHz mono PCM; it emits partial transcripts as words form and an endpoint event when the speaker pauses.

Before any native state is created, the engine checks each model file against a SHA-256 hash you pin in config, and refuses to start on a mismatch.

## Example

The configuration side compiles without native libraries:

```rust
use magicaf_asr_onnx::OnnxAsrConfig;

fn main() {
    let mut config = OnnxAsrConfig::default(); // greedy search, CPU, 1 thread
    config.base.model_dir = "/models/zipformer-en".into();
    // Pin each model file; the engine refuses to load on a mismatch.
    config
        .base
        .expected_model_sha256
        .insert("encoder".into(), "<sha256 of encoder.onnx>".into());

    let paths = config.resolve_paths();
    println!("encoder: {}", paths.encoder.display());

    // With `--features link-sherpa` and SHERPA_ONNX_LIB_DIR set:
    // let engine = magicaf_asr_onnx::OnnxStreamingAsrEngine::new(config)?;
    // let mut session = engine.open_session()?;
    // for event in session.accept_pcm_i16(&pcm)? { /* Partial / Endpoint */ }
}
```

## Building with the engine

The engine sits behind the `link-sherpa` feature:

```bash
# Build sherpa-onnx v1.10.32 (includes onnxruntime) once per target
./magicaf-asr-onnx/vendor/build-sherpa-onnx.sh /opt/sherpa-onnx
export SHERPA_ONNX_LIB_DIR=/opt/sherpa-onnx/lib
cargo build --features magicaf-asr-onnx/link-sherpa
```

Libraries link statically by default; set `SHERPA_ONNX_LINK_KIND=dylib` to link dynamically. Set `TARGET_TRIPLE` when cross-compiling the native build.

## Configuration

| Field | Default |
|---|---|
| `base.model_dir` | — (required) |
| `files` | `encoder.onnx`, `decoder.onnx`, `joiner.onnx`, `tokens.txt` |
| `base.provider` | `"cpu"` (also `"coreml"`, `"nnapi"`) |
| `base.num_threads` | 1 |
| `base.max_session_secs` | 1800 |
| `decoding_method` | `"greedy_search"` |
| `base.expected_model_sha256` | empty — add one entry per file to enforce |

## Status

Experimental: the configuration, integrity, and audio-conversion code is unit-tested, but the native engine path has no automated tests yet and no shipping product enables it. The crate does not persist audio or transcripts; whatever calls it decides what to keep.

## Related

- [`magicaf-mobile`](/docs/crates/magicaf-mobile/) — exposes this engine to Flutter through its `asr` feature
