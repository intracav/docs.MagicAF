---
title: "magicaf-mobile"
description: "Synchronous, model-free text and audio helpers for Flutter clients — keywords, titles, readability, jargon detection, and voice-activity detection — with optional on-device speech recognition."
weight: 70
keywords: [magicaf-mobile, Flutter Rust, flutter_rust_bridge, on-device NLP, voice activity detection, mobile AI]
---

{{< crate-header "magicaf-mobile" >}}

`magicaf-mobile` is the small, fast end of MagicAF: functions a phone or desktop app can call synchronously on every keystroke or audio frame, with no model download, no async runtime, and no network. It suggests note titles and keywords, scores reading level, spots clinical jargon and offers plain-language alternatives, and detects speech in audio.

## Example

```rust
use magicaf_mobile::vad::vad_process;
use magicaf_mobile::{detect_medical_jargon, extract_keywords, flesch_kincaid_grade, suggest_title};

fn main() {
    let note = "Patient has hypertension and dyspnea; start PO furosemide.".to_string();

    println!("title: {}", suggest_title(note.clone()));
    println!("keywords: {:?}", extract_keywords(note.clone(), 5));
    println!("grade level: {:.1}", flesch_kincaid_grade(note.clone()));
    for span in detect_medical_jargon(note) {
        println!("{} -> {} ({:.2})", span.text, span.suggestion, span.confidence);
    }

    // 100 ms of silence at 16 kHz.
    let frame = vad_process(vec![0.0; 1600], 0.02);
    println!("speech: {}", frame.is_speech);
}
```

## Functions

| Function | Returns |
|---|---|
| `suggest_title(text)` | A title from the most significant words; `"Untitled Note"` for empty input |
| `extract_keywords(text, max)` | Keywords by frequency, stopwords removed |
| `word_count(text)`, `truncate_to_words(text, max)` | |
| `nlp::flesch_kincaid_grade(text)` | US grade level |
| `nlp::detect_medical_jargon(text)` | `JargonSpan`s with a plain-English suggestion and a confidence |
| `nlp::sentence_complexity(text)` | Per-sentence scores; sentences over 25 words are flagged |
| `audio_energy_level(bytes)`, `is_audio_silence(bytes, threshold)` | RMS energy of 16-bit PCM; default silence threshold 0.02 |
| `vad::vad_process(samples, threshold)` | A `VadResult` for one frame of `f32` samples |
| `is_prompt_injection(text)` | Same patterns as the server-side guard. **Requires the `guard` feature.** |

Jargon detection is a dictionary heuristic meant to help writers; it is not clinical advice.

## Keep `guard` off on mobile

`guard` is on by default and is the only thing that pulls in `magicaf-core` — and with it tokio, an HTTP stack, and telemetry, about 52 MB across 202 crates on iOS. Mobile builds should turn defaults off:

```toml
magicaf-mobile = { git = "ssh://git@github.com/intracav/MagicAF.git", default-features = false }
```

## Calling it from Flutter

The pattern that works in production is a thin wrapper crate in your app:

1. Create `rust/` in your Flutter project with a crate that depends on `magicaf-mobile` (`default-features = false`) and on a pinned `flutter_rust_bridge` (2.12).
2. Re-export the functions you need from that crate, annotated `#[frb(sync)]`.
3. Run `flutter_rust_bridge_codegen generate` and commit the generated bindings.

Keeping the annotations in your wrapper rather than enabling `magicaf-mobile`'s `frb` feature lets each app pin its own bridge version. The repository's `magicaf-mobile/build.sh` builds the crate directly for macOS, iOS, and Android (without `guard`, with `frb`; override with `CARGO_FEATURE_ARGS`) and copies the libraries into a Flutter project. The wrapper pattern is still the better fit for apps that pin their own bridge version.

## Speech recognition (`asr`)

The `asr` feature adds a handle-based streaming recognizer — `asr_init`, `asr_open_session`, `asr_accept_pcm_chunk`, `asr_finalize_session`, `asr_close_session` — backed by [`magicaf-asr-onnx`](/docs/crates/magicaf-asr-onnx/). It brings `magicaf-core` back in and needs native sherpa-onnx libraries at build time. It is experimental and no shipping app enables it yet.

## Related

- [Edge and mobile deployment](/docs/deployment/edge-mobile/)
- [`magicaf-asr-onnx`](/docs/crates/magicaf-asr-onnx/)
