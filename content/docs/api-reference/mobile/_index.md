---
title: "Mobile API"
description: "Every public function and type in magicaf-mobile — text helpers, readability and jargon detection, voice activity detection, the prompt-injection check, and the optional speech-recognition API — with feature flags and the Flutter binding pattern."
weight: 3
keywords: [magicaf-mobile, Flutter, flutter_rust_bridge, on-device NLP, VAD, mobile API reference]
---

{{< crate-header "magicaf-mobile" >}}

All functions take owned arguments (`String`, `Vec<u8>`) so they bind cleanly through `flutter_rust_bridge`. Every function outside the `asr` module is synchronous, does no I/O, and loads no model. With the `frb` feature, they carry `#[frb(sync)]`, so Dart calls them without `await`.

## Text

| Function | Returns |
|---|---|
| `suggest_title(text: String) -> String` | A short title built from the most significant words, title-cased. `"Untitled Note"` for empty input. |
| `extract_keywords(text: String, max_keywords: u32) -> Vec<String>` | Up to `max_keywords` terms ranked by term frequency with logarithmic saturation, stopwords removed |
| `word_count(text: String) -> u32` | Words, by Unicode word boundaries |
| `truncate_to_words(text: String, max_words: u32) -> String` | About the first `max_words` words, cut at a word boundary |
| `stopwords::is_stopword(word: &str) -> bool` | Whether a word is on the built-in English stopword list |

## Readability and jargon

| Function | Returns |
|---|---|
| `flesch_kincaid_grade(text: String) -> f32` | The Flesch–Kincaid US grade level |
| `detect_medical_jargon(text: String) -> Vec<JargonSpan>` | Clinical terms found, each with a plain-English suggestion |
| `sentence_complexity(text: String) -> Vec<SentenceScore>` | One score per sentence; `is_complex` when it exceeds `COMPLEX_SENTENCE_WORDS` (25) words |

```rust
pub struct JargonSpan { pub text: String, pub start: u32, pub end: u32, pub suggestion: String, pub confidence: f32 }
pub struct SentenceScore { pub sentence: String, pub word_count: u32, pub start: u32, pub end: u32, pub is_complex: bool }
```

Offsets are positions in the input string. Jargon detection is a dictionary heuristic to help writers; it is not clinical advice.

## Audio

| Function | Returns |
|---|---|
| `audio_energy_level(bytes: Vec<u8>) -> f32` | RMS energy of little-endian 16-bit PCM, 0.0–1.0 |
| `is_audio_silence(bytes: Vec<u8>, threshold: f32) -> bool` | Whether energy is below `threshold`. Pass `0.0` or less to use the default of 0.02, which matches the server-side VAD. |
| `vad::vad_process(audio_chunk: Vec<f32>, silence_threshold: f32) -> VadResult` | `VadResult { energy, is_speech }` for one frame of `f32` samples |

## Prompt-injection check — `guard` feature

| Function | Returns |
|---|---|
| `is_prompt_injection(text: String) -> bool` | Whether the text matches the same patterns as the server-side [`PromptGuard`](/docs/api-reference/core/security/) |

`guard` is on by default and is the only part of the crate that depends on `magicaf-core` — about 52 MB of additional dependencies on iOS. Mobile apps should build with `default-features = false` and run this check on the server instead.

## Speech recognition — `asr` feature

{{< callout type="warning" title="Experimental" >}}
The `asr` feature links [`magicaf-asr-onnx`](/docs/crates/magicaf-asr-onnx/), brings `magicaf-core` back in, and needs native sherpa-onnx libraries at build time. No shipping app enables it yet.
{{< /callout >}}

A process-wide engine with numbered sessions. These functions are not marked `sync`, so Dart receives them as `Future`s.

| Function | Does |
|---|---|
| `asr_init(params: AsrInitParams) -> Result<(), String>` | Loads and verifies the model; the only call that touches disk. A second call returns `Ok` without reloading — call `asr_shutdown` first to change models. |
| `asr_open_session() -> Result<u64, String>` | Starts an utterance; returns its id |
| `asr_accept_pcm_chunk(session_id, pcm_le_bytes: Vec<u8>) -> Result<Vec<AsrEventDto>, String>` | Feeds 16 kHz mono 16-bit PCM; returns partial and endpoint events |
| `asr_finalize_session(session_id) -> Result<AsrFinalDto, String>` | The final transcript and duration |
| `asr_close_session(session_id)`, `asr_shutdown()` | Release a session, or the engine |
| `asr_is_initialised()`, `asr_active_session_count()` | Status |

`AsrInitParams` carries `model_dir`, `num_threads`, `provider` (`"cpu"`, `"coreml"`, or `"nnapi"`), `max_session_secs`, and an expected SHA-256 for each of the encoder, decoder, joiner, and tokens files.

## Features

| Feature | Default | Effect |
|---|---|---|
| `guard` | on | `is_prompt_injection`, via `magicaf-core` |
| `frb` | off | `flutter_rust_bridge` annotations on every function |
| `asr` | off | The speech-recognition API |

## Using it from Flutter

```toml
# rust/Cargo.toml in your Flutter app — a thin wrapper crate
[dependencies]
magicaf-mobile = { git = "ssh://git@github.com/intracav/MagicAF.git", default-features = false }
flutter_rust_bridge = "=2.12.0"
```

Re-export the functions your app needs from the wrapper, annotated `#[flutter_rust_bridge::frb(sync)]`, then generate and commit the Dart bindings with `flutter_rust_bridge_codegen generate`. Pinning the bridge version in your own wrapper keeps each app's bindings stable regardless of what `magicaf-mobile` enables. See the [crate page](/docs/crates/magicaf-mobile/) for an example and [Edge and mobile](/docs/deployment/edge-mobile/) for what else runs on the device.
