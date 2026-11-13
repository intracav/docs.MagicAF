---
title: "Setup & Configuration"
description: "Complete guide to configuring NLP pipelines: native dependencies, model sources, device selection, and air-gapped deployment."
weight: 2
keywords: [NLP configuration, model setup, air-gapped NLP, libtorch, ONNX Runtime]
---

This guide covers everything you need to configure NLP pipelines for your environment.

---

## Native Dependencies

MagicAF NLP requires one of two native backends (only when the `models` feature is enabled):

### Option A: libtorch (Default)

**Installation:**

```bash
# macOS / Linux — via pip. tch 0.17 needs libtorch 2.4.0 exactly.
pip3 install torch==2.4.0
export LIBTORCH=$(python3 -c "import torch; print(torch.__path__[0])")
export LD_LIBRARY_PATH=$LIBTORCH/lib:$LD_LIBRARY_PATH   # Linux
export DYLD_LIBRARY_PATH=$LIBTORCH/lib:$DYLD_LIBRARY_PATH  # macOS

# Or download libtorch 2.4.0 from pytorch.org, extract it, and set LIBTORCH to it.
# If LIBTORCH is unset, the build downloads libtorch itself — set it for offline builds.
```

**Build-time:**

```bash
LIBTORCH=/path/to/libtorch cargo build --features models
```

**Runtime:**

Ensure `LIBTORCH` and library paths are set in your environment.

---

### Option B: Adding ONNX Runtime

The `onnx` feature adds rust-bert's ONNX Runtime support **on top of** libtorch — it does not replace it, so complete Option A first. ONNX Runtime is not downloaded for you.

**Build-time:**

```bash
cargo build --features onnx
```

**Air-gapped:**

Set `ORT_LIB_LOCATION` to the directory containing the ONNX Runtime library:

```bash
export ORT_LIB_LOCATION=/opt/onnxruntime/lib
cargo build --features onnx
```

---

## Model Source Configuration

All pipelines accept a `Config` struct with a `source: ModelSource` field:

### Default (HuggingFace Hub)

Downloads and caches models automatically:

```rust
use magicaf_nlp::prelude::*;

let pipeline = SentimentPipeline::new(SentimentConfig {
    source: ModelSource::Default,
    device: Device::Cpu,
}).await?;
```

Models are cached in `~/.cache/.rustbert/`, or in `RUSTBERT_CACHE` if set, for future runs.

---

### Local Model Directory (Air-Gapped)

Load models from a local directory:

```rust
use magicaf_nlp::config::{ModelSource, Device};

let source = ModelSource::Local {
    model_dir: "/opt/magicaf/models/distilbert-sentiment".into(),
};

let pipeline = SentimentPipeline::new(SentimentConfig {
    source,
    device: Device::Cpu,
}).await?;
```

**Required files** (varies by pipeline):

- `rust_model.ot` (PyTorch weights in tch format) or `model.onnx` (ONNX format)
- `config.json` (model configuration)
- `vocab.txt` / `vocab.json` / `spiece.model` (tokenizer)
- `merges.txt` (BPE merges, if applicable)

**For ONNX mode:** Replace `rust_model.ot` with `model.onnx`.

---

### Remote Model (Custom HuggingFace Model)

Download a specific model by name:

```rust
let source = ModelSource::Remote {
    model_name: "distilbert-base-cased-distilled-squad".into(),
};
```

---

## Device Selection

Choose CPU or CUDA:

```rust
use magicaf_nlp::config::Device;

// CPU (default, always available)
let device = Device::Cpu;

// CUDA GPU (requires CUDA toolkit and compatible GPU)
let device = Device::Cuda(0);  // GPU index 0
```

**CUDA Requirements:**

- CUDA toolkit installed
- Compatible NVIDIA GPU
- `libtorch` built with CUDA support (or ONNX Runtime with CUDA provider)

---

## Air-Gapped Deployment

{{< callout type="info" title="Which pipelines read local directories" >}}
Only question answering honors `ModelSource::Local`. Every other pipeline loads its model from the rust-bert cache, so the reliable offline method is to **warm the cache**: on a connected machine, point `RUSTBERT_CACHE` at an empty directory, construct each pipeline you need once, then copy that directory to the same `RUSTBERT_CACHE` path on the isolated host. The manual downloads below are useful for the QA model.
{{< /callout >}}

Complete workflow for offline environments:

### Step 1: Download Models (Internet-Connected Machine)

```bash
# Create model directories
mkdir -p /tmp/models/{sentiment,ner,qa}

# Download DistilBERT sentiment model
cd /tmp/models/sentiment
wget https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english/resolve/main/rust_model.ot
wget https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english/resolve/main/config.json
wget https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english/resolve/main/vocab.txt

# Download BERT NER model
cd /tmp/models/ner
wget https://huggingface.co/dbmdz/bert-large-cased-finetuned-conll03-english/resolve/main/rust_model.ot
wget https://huggingface.co/dbmdz/bert-large-cased-finetuned-conll03-english/resolve/main/config.json
wget https://huggingface.co/dbmdz/bert-large-cased-finetuned-conll03-english/resolve/main/vocab.txt

# Download QA model
cd /tmp/models/qa
wget https://huggingface.co/distilbert-base-cased-distilled-squad/resolve/main/rust_model.ot
wget https://huggingface.co/distilbert-base-cased-distilled-squad/resolve/main/config.json
wget https://huggingface.co/distilbert-base-cased-distilled-squad/resolve/main/vocab.txt
```

### Step 2: Transfer to Target Machine

```bash
# Package models
tar -czf magicaf-models.tar.gz /tmp/models

# Transfer via secure channel (USB, network, etc.)
scp magicaf-models.tar.gz user@target:/opt/magicaf/
```

### Step 3: Configure on Target

```rust
use magicaf_nlp::config::{ModelSource, Device};

let sentiment_source = ModelSource::Local {
    model_dir: "/opt/magicaf/models/sentiment".into(),
};

let ner_source = ModelSource::Local {
    model_dir: "/opt/magicaf/models/ner".into(),
};

let sentiment = SentimentPipeline::new(SentimentConfig {
    source: sentiment_source,
    device: Device::Cpu,
}).await?;

let ner = NerPipeline::new(NerConfig {
    source: ner_source,
    device: Device::Cpu,
}).await?;
```

---

## Configuration Examples

### Minimal (Defaults)

```rust
let pipeline = SentimentPipeline::new(SentimentConfig::default()).await?;
```

### Custom Model + GPU

```rust
let config = SentimentConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/custom-sentiment".into(),
    },
    device: Device::Cuda(0),
};

let pipeline = SentimentPipeline::new(config).await?;
```

### Keyword Extraction with Custom Parameters

```rust
let config = KeywordConfig {
    source: ModelSource::Default,
    top_n: 10,              // Return top 10 keywords
    diversity: 0.7,         // Higher diversity
    max_ngram_size: 2,     // Only unigrams and bigrams
    device: Device::Cpu,
};

let pipeline = KeywordExtractionPipeline::new(config).await?;
```

### Summarization with Length Control

```rust
let config = SummaryConfig {
    source: ModelSource::Default,
    min_length: Some(50),   // Minimum 50 tokens
    max_length: Some(200),  // Maximum 200 tokens
    num_beams: Some(4),     // Beam search with 4 beams
    length_penalty: Some(1.2),  // Encourage longer summaries
    device: Device::Cpu,
};

let pipeline = SummarizationPipeline::new(config).await?;
```

---

## Environment Variables

| Variable | Purpose | Required For |
|----------|---------|--------------|
| `LIBTORCH` | Path to libtorch installation | libtorch backend |
| `LD_LIBRARY_PATH` | Library search path (Linux) | libtorch backend |
| `DYLD_LIBRARY_PATH` | Library search path (macOS) | libtorch backend |
| `ORT_LIB_LOCATION` | Directory containing the ONNX Runtime library | `onnx` feature |
| `RUSTBERT_CACHE` | Model cache directory (default `~/.cache/.rustbert`) | Model caching and offline use |

---

## Troubleshooting

### Model Loading Fails

**Check model directory structure:**

```bash
ls -la /opt/models/sentiment/
# Should contain: rust_model.ot, config.json, vocab.txt
```

**Verify file permissions:**

```bash
chmod -R 644 /opt/models/sentiment/*
```

### CUDA Not Available

**Check CUDA installation:**

```bash
nvidia-smi  # Should show GPU info
nvcc --version  # Should show CUDA version
```

**Verify libtorch CUDA support:**

```bash
python3 -c "import torch; print(torch.cuda.is_available())"
```

### ONNX Runtime Issues

**Check auto-download:**

ONNX Runtime is not downloaded automatically. Install it and set `ORT_LIB_LOCATION` to its library directory.

**Verify ONNX model format:**

ONNX models use `.onnx` extension, not `.ot`. Ensure your model directory contains `model.onnx` when using the `onnx` feature.

---

## Next Steps

- **Explore Pipelines:** See [Pipelines](/docs/api-reference/nlp/pipelines/) for all available NLP tasks.
- **View Examples:** Check out [Use Cases & Examples](/docs/api-reference/nlp/use-cases/) for real-world configurations.
