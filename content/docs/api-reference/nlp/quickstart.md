---
title: "Quick Start"
description: "Get up and running with MagicAF NLP pipelines in minutes. Install dependencies, load your first model, and run predictions."
weight: 1
keywords: [NLP quickstart, setup guide, first pipeline, installation]
---

This guide will get you running your first NLP pipeline in under 5 minutes.

---

## Prerequisites

1. **Rust** (1.70+)
2. **Native dependency** (choose one):
   - **libtorch** (default) — install via `pip install torch` or download from [PyTorch](https://pytorch.org)
   - **ONNX Runtime** (lighter) — auto-downloaded by the `ort` crate

---

## Step 1: Add Dependency

Add `magicaf-nlp` to your `Cargo.toml`:

```toml
[dependencies]
magicaf-nlp = { path = "../magicaf-nlp", features = ["models"] }
tokio = { version = "1", features = ["full"] }
```

For ONNX Runtime (lighter, recommended for edge):

```toml
magicaf-nlp = { path = "../magicaf-nlp", features = ["onnx"] }
```

---

## Step 2: Set Up Native Dependency

### Option A: libtorch (default)

**macOS / Linux:**

```bash
# Install via pip (easiest)
pip3 install torch

# Set environment variables
export LIBTORCH=$(python3 -c "import torch; print(torch.__path__[0])")
export LD_LIBRARY_PATH=$LIBTORCH/lib:$LD_LIBRARY_PATH   # Linux
export DYLD_LIBRARY_PATH=$LIBTORCH/lib:$DYLD_LIBRARY_PATH  # macOS
```

**Or download directly:**
1. Visit [pytorch.org](https://pytorch.org)
2. Download libtorch for your platform
3. Extract and set `LIBTORCH=/path/to/libtorch`

### Option B: ONNX Runtime

No manual setup needed! The `ort` crate auto-downloads ONNX Runtime on first build. For air-gapped deployments, set `ORT_LIB_LOCATION`.

---

## Step 3: Your First Pipeline

Create `src/main.rs`:

```rust
use magicaf_nlp::prelude::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Sentiment analysis
    let sentiment = SentimentPipeline::new(SentimentConfig::default()).await?;
    let results = sentiment.predict(&[
        "This framework is amazing!",
        "Worst experience of my life.",
    ]).await?;

    for r in &results {
        println!("{:?}: {:.4}", r.polarity, r.score);
    }
    // → Positive: 0.9984
    //   Negative: 0.9967

    // Named Entity Recognition
    let ner = NerPipeline::new(NerConfig::default()).await?;
    let entities = ner.predict(&["Amy lives in Paris."]).await?;

    for entity in &entities[0] {
        println!("{}: {} ({:.4})", entity.label, entity.word, entity.score);
    }
    // → I-PER: Amy (0.9986)
    //   I-LOC: Paris (0.9985)

    Ok(())
}
```

---

## Step 4: Build and Run

```bash
# Set LIBTORCH if using libtorch
export LIBTORCH=$(python3 -c "import torch; print(torch.__path[0])")
export LD_LIBRARY_PATH=$LIBTORCH/lib:$LD_LIBRARY_PATH

# Build
cargo build

# Run
cargo run
```

On first run, the default model will be downloaded from HuggingFace Hub and cached locally. Subsequent runs use the cache.

---

## What Happens Under the Hood

1. **Model Loading:** The pipeline spawns a dedicated OS thread and loads the transformer model.
2. **First Download:** If using `ModelSource::Default`, the model downloads from HuggingFace Hub (~500MB–2GB depending on model).
3. **Caching:** Models are cached in `~/.cache/huggingface/` for future runs.
4. **Inference:** When you call `predict()`, the input is sent to the model thread via a channel, inference runs, and results are returned.

---

## Next Steps

- **Explore Pipelines:** See [Pipelines](/docs/api-reference/nlp/pipelines/) for all available NLP tasks.
- **Configure Models:** Learn about [Configuration](/docs/api-reference/nlp/setup/) for custom models and air-gapped deployments.
- **See Examples:** Check out [Use Cases & Examples](/docs/api-reference/nlp/use-cases/) for real-world use cases.

---

## Troubleshooting

### "Could not find libtorch"

Make sure `LIBTORCH` is set and points to a valid libtorch installation:

```bash
echo $LIBTORCH
ls $LIBTORCH/lib/libtorch.so  # Linux
ls $LIBTORCH/lib/libtorch.dylib  # macOS
```

### "Model download failed"

Check your internet connection. For air-gapped deployments, see [Air-Gapped Setup](/docs/api-reference/nlp/setup/#air-gapped-deployment).

### "Out of memory"

Default models are optimized for CPU but still require 2–4GB RAM. For edge devices, consider:
- Using ONNX Runtime (`features = ["onnx"]`)
- Loading smaller models via `ModelSource::Local`
- Using quantization (if supported by your model)

---

## Feature Flags Reference

| Feature | Effect |
|---------|--------|
| *(none)* | Config types and DTOs only — no native deps, compiles anywhere |
| `models` | Full pipeline support — requires libtorch |
| `onnx` | Full pipeline support — uses ONNX Runtime (lighter) |

You can always use config types and DTOs without any features:

```rust
use magicaf_nlp::config::{ModelSource, Device};

let source = ModelSource::Local {
    model_dir: "/opt/models/bert".into(),
};
```
