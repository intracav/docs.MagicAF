---
title: "Speech-to-Text (ASR)"
description: "API reference for Automatic Speech Recognition — the AsrService trait, Voice Activity Detection, and Whisper integration."
weight: 17
tags: [api, asr, speech-to-text, whisper, voice-activity-detection, audio]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/architecture/]
estimated_reading_time: "10 min"
last_reviewed: "2026-03-10"
---

MagicAF provides an abstract `AsrService` trait for speech-to-text, a `WhisperAsrService` implementation for Whisper-compatible endpoints, and a `VadProcessor` for client-side voice activity detection.

**Modules:** `magicaf_core::asr`, `magicaf_local_llm::whisper`

---

## `AsrService` Trait

```rust
#[async_trait]
pub trait AsrService: Send + Sync {
    async fn transcribe(&self, audio: &[u8], config: &AsrConfig) -> Result<AsrResult>;
    async fn health_check(&self) -> Result<()>;
    fn service_name(&self) -> &'static str { "asr" }
}
```

### `AsrConfig`

```rust
pub struct AsrConfig {
    pub language: Option<String>,           // BCP-47 tag (e.g., "en", "fr")
    pub specialty: Option<String>,          // Domain hint (e.g., "clinical", "legal")
    pub vocabulary_hints: Vec<String>,      // Domain-specific terms to bias recognition
    pub audio_format: String,               // default: "wav"
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `language` | `Option<String>` | `None` | BCP-47 language tag (auto-detected if omitted) |
| `specialty` | `Option<String>` | `None` | Domain hint for specialized vocabulary |
| `vocabulary_hints` | `Vec<String>` | `[]` | Terms to bias the recognition model toward |
| `audio_format` | `String` | `"wav"` | Audio format of the input bytes |

### `AsrResult`

```rust
pub struct AsrResult {
    pub text: String,                       // Full transcription
    pub language: Option<String>,           // Detected language
    pub confidence_score: Option<f32>,      // Overall confidence [0.0, 1.0]
    pub confidence: Option<ConfidenceLevel>,
    pub segments: Vec<AsrSegment>,          // Time-aligned segments
    pub duration_ms: Option<u32>,           // Audio duration
}
```

### `AsrSegment`

```rust
pub struct AsrSegment {
    pub text: String,
    pub start_ms: u32,
    pub end_ms: u32,
    pub confidence_score: Option<f32>,
    pub confidence: Option<ConfidenceLevel>,
}
```

### `ConfidenceLevel`

```rust
pub enum ConfidenceLevel {
    High,       // score >= 0.85
    Medium,     // score >= 0.60
    Low,        // score < 0.60
}
```

Computed from a raw score via `ConfidenceLevel::from_score(f32)`.

---

## `WhisperAsrService`

**Crate:** `magicaf-local-llm`

HTTP client for Whisper-compatible transcription endpoints.

### `AsrEndpointConfig`

```rust
pub struct AsrEndpointConfig {
    pub base_url: String,
    pub api_key: Option<SecretString>,
    pub connect_timeout_secs: u64,          // default: 5
    pub request_timeout_secs: u64,          // default: 120
    pub health_check_timeout_secs: u64,     // default: 5
    pub retry: RetryConfig,
    pub circuit_breaker: CircuitBreakerConfig,
    pub rate_limit: RateLimitConfig,
    pub tls: TlsConfig,
}
```

### Constructor

```rust
pub fn new(config: AsrEndpointConfig) -> Result<Self>
```

### Compatible Servers

| Server | Notes |
|--------|-------|
| **OpenAI Whisper API** | Cloud endpoint (requires internet) |
| **Groq Whisper** | Cloud, fast inference |
| **faster-whisper** | Local, Python-based, GPU accelerated |
| **whisper.cpp** | Local, C++, CPU/GPU, air-gapped safe |

### Request Format

Sends a `multipart/form-data` POST to `{base_url}/audio/transcriptions` with:
- `file` — audio bytes
- `model` — `"whisper-1"` (or server-configured)
- `response_format` — `"verbose_json"` (includes segments and timestamps)
- `language` — optional BCP-47 tag
- `prompt` — vocabulary hints joined as a biasing prompt

### Silence Filtering

Segments with a `no_speech_prob` above `0.6` are automatically filtered out of the result.

### Example

```rust
use magicaf_core::asr::{AsrConfig, AsrService};
use magicaf_core::config::AsrEndpointConfig;
use magicaf_local_llm::WhisperAsrService;

let asr = WhisperAsrService::new(AsrEndpointConfig {
    base_url: "http://localhost:8787".into(),
    ..Default::default()
})?;

let audio_bytes = std::fs::read("recording.wav")?;

let result = asr.transcribe(&audio_bytes, &AsrConfig {
    language: Some("en".into()),
    specialty: Some("clinical".into()),
    vocabulary_hints: vec!["tachycardia".into(), "myocardial".into()],
    audio_format: "wav".into(),
}).await?;

println!("Transcription: {}", result.text);
for segment in &result.segments {
    println!("[{}-{}ms] {} ({:?})",
        segment.start_ms, segment.end_ms,
        segment.text, segment.confidence);
}
```

---

## Voice Activity Detection (VAD)

Client-side audio preprocessing to detect speech boundaries before sending to the ASR service.

**Module:** `magicaf_core::asr::vad`

### `VadEvent`

```rust
pub enum VadEvent {
    Silence,                    // Current chunk is below threshold
    SpeechOngoing,              // Speech detected, buffering
    SegmentReady(Vec<u8>),      // Complete speech segment ready for transcription
}
```

### `VadProcessor`

```rust
pub struct VadProcessor { /* ... */ }
```

#### Constructor

```rust
pub fn new(sample_rate_hz: u32) -> Self
```

Creates a VAD processor for the given sample rate. Assumes PCM-16 LE mono audio.

#### Builder Methods

```rust
pub fn with_threshold(self, threshold: f32) -> Self         // default: 0.02
pub fn with_min_silence_ms(self, ms: u32) -> Self           // default: 500
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `silence_threshold` | `0.02` | RMS energy level below which audio is silence |
| `min_silence_ms` | `500` | Minimum silence duration to end a speech segment |
| `min_segment_ms` | `150` | Minimum segment duration to emit (rejects clicks/noise) |

#### Methods

```rust
/// Process a chunk of PCM-16 LE mono audio.
pub fn process(&mut self, chunk: &[u8]) -> VadEvent

/// Flush any remaining buffered speech.
pub fn flush(&mut self) -> Option<Vec<u8>>

/// Reset the processor state.
pub fn reset(&mut self)

/// Check if currently in a speech segment.
pub fn is_in_speech(&self) -> bool

/// Get the number of buffered bytes.
pub fn buffered_bytes(&self) -> usize
```

### `rms_energy_i16`

```rust
pub fn rms_energy_i16(bytes: &[u8]) -> f32
```

Computes the RMS energy of PCM-16 LE audio samples, normalized to `[0.0, 1.0]`.

### Example

```rust
use magicaf_core::asr::vad::VadProcessor;
use magicaf_core::asr::{AsrConfig, VadEvent};

let mut vad = VadProcessor::new(16_000)
    .with_threshold(0.03)
    .with_min_silence_ms(300);

// Process audio chunks as they arrive (e.g., from a microphone)
for chunk in audio_stream {
    match vad.process(&chunk) {
        VadEvent::Silence => { /* no speech */ }
        VadEvent::SpeechOngoing => { /* still talking */ }
        VadEvent::SegmentReady(segment) => {
            // Send segment to ASR
            let result = asr.transcribe(&segment, &config).await?;
            println!("{}", result.text);
        }
    }
}

// Flush any remaining audio
if let Some(final_segment) = vad.flush() {
    let result = asr.transcribe(&final_segment, &config).await?;
    println!("{}", result.text);
}
```
