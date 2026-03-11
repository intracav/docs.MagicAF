---
title: "Mobile"
description: "API reference for magicaf-mobile — on-device text intelligence for Flutter clients with zero async overhead."
weight: 3
tags: [api, mobile, flutter, ios, android, on-device, text-intelligence]
categories: [reference]
difficulty: beginner
estimated_reading_time: "6 min"
last_reviewed: "2026-03-10"
---

The `magicaf-mobile` crate provides lean, synchronous text intelligence functions designed for Flutter mobile clients. All operations complete in under 1ms with zero network I/O.

**Crate:** `magicaf-mobile`

---

## Overview

| Function | Purpose | Typical Latency |
|----------|---------|----------------|
| `extract_keywords` | Extract key terms from text | < 1ms |
| `suggest_title` | Generate a title from text content | < 1ms |
| `is_prompt_injection` | Detect prompt injection attempts | < 1ms |
| `audio_energy_level` | Compute RMS energy of audio bytes | < 1ms |
| `is_audio_silence` | Check if audio is below silence threshold | < 1ms |
| `word_count` | Unicode-aware word count | < 1ms |
| `truncate_to_words` | Truncate text to N words | < 1ms |

All functions are synchronous and marked with `#[flutter_rust_bridge::frb(sync)]` when the `frb` feature is enabled.

---

## Text Functions

### `extract_keywords`

```rust
pub fn extract_keywords(text: String, max_keywords: u32) -> Vec<String>
```

Extracts key terms from text using frequency-based analysis. Returns up to `max_keywords` terms sorted by relevance.

### `suggest_title`

```rust
pub fn suggest_title(text: String) -> String
```

Generates a suggested title from text content. Returns a title-cased summary derived from the input.

### `word_count`

```rust
pub fn word_count(text: String) -> u32
```

Unicode-aware word count using `unicode_segmentation`. Handles all scripts correctly (CJK, Arabic, Devanagari, etc.).

### `truncate_to_words`

```rust
pub fn truncate_to_words(text: String, max_words: u32) -> String
```

Truncates text to the first `max_words` words, preserving word boundaries.

---

## Security Functions

### `is_prompt_injection`

```rust
pub fn is_prompt_injection(text: String) -> bool
```

Returns `true` if the text contains patterns matching known prompt injection vectors. Uses the same detection patterns as the core `PromptGuard`.

---

## Audio Functions

### `audio_energy_level`

```rust
pub fn audio_energy_level(bytes: Vec<u8>) -> f32
```

Computes the RMS energy of PCM-16 LE audio bytes, normalized to `[0.0, 1.0]`. Useful for audio level meters in the UI.

### `is_audio_silence`

```rust
pub fn is_audio_silence(bytes: Vec<u8>, threshold: f32) -> bool
```

Returns `true` if the audio energy is below `threshold`. Used for silence detection in recording UIs.

---

## Flutter Integration

### Feature Flag

```toml
# Cargo.toml
[dependencies]
magicaf-mobile = { version = "0.1", features = ["frb"] }
```

The `frb` feature enables `flutter_rust_bridge` annotations for automatic Dart binding generation.

### Build

```bash
# Generate Dart bindings
flutter_rust_bridge_codegen generate

# Build for target
cargo build --target aarch64-linux-android --release
cargo build --target aarch64-apple-ios --release
```

### Dart Usage

```dart
import 'package:magicaf_mobile/magicaf_mobile.dart';

// Extract keywords
final keywords = extractKeywords(text: noteBody, maxKeywords: 5);

// Check prompt injection
if (isPromptInjection(text: userInput)) {
  showWarning("Suspicious input detected");
  return;
}

// Audio level meter
final energy = audioEnergyLevel(bytes: audioChunk);
updateLevelMeter(energy);

// Word count
final count = wordCount(text: noteBody);
updateWordCounter(count);
```

---

## Crate Output Types

The crate builds as `staticlib` (iOS), `cdylib` (Android), and `lib` (Rust tests):

```toml
[lib]
crate-type = ["staticlib", "cdylib", "lib"]
```
