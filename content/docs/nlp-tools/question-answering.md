---
title: "Question Answering"
description: "Extract answer spans from context passages using extractive question answering. Perfect for document Q&A when you have the source text."
weight: 1
keywords: [question answering, extractive QA, SQuAD, document Q&A]
---

Extractive question answering finds the **exact span** of text within a context passage that best answers a question. Unlike RAG, this requires both a question and the context passage as input.

---

## Overview

**Module:** `magicaf_nlp::qa`  
**Default Model:** DistilBERT fine-tuned on SQuAD (Stanford Question Answering Dataset)  
**Task:** Given a question and context, extract the answer span

### When to Use

- ✅ You have the source document/passage
- ✅ You need precise, extractive answers (not generated)
- ✅ You want zero external service dependencies
- ✅ You're doing document Q&A on known texts

### When Not to Use

- ❌ You need to search across multiple documents (use RAG)
- ❌ You want free-form generated answers (use RAG with LLM)
- ❌ You need answers that synthesize information (use RAG)

---

## Quick Example

```rust
use magicaf_nlp::qa::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = QuestionAnsweringPipeline::new(QaConfig::default()).await?;

    let answers = pipeline.predict(&[QaInput {
        question: "Where does Amy live?".into(),
        context: "Amy lives in Amsterdam. She works as a software engineer.".into(),
    }], 1, 32).await?;

    println!("Answer: {} (score: {:.4})", answers[0][0].answer, answers[0][0].score);
    // → Answer: Amsterdam (score: 0.9976)

    Ok(())
}
```

---

## API Reference

### Types

#### `QaInput`

```rust
pub struct QaInput {
    pub question: String,  // The natural-language question
    pub context: String,   // The passage containing the answer
}
```

#### `Answer`

```rust
pub struct Answer {
    pub answer: String,    // The extracted answer text
    pub score: f64,        // Confidence score (0.0–1.0)
    pub start: usize,      // Start character offset in context
    pub end: usize,        // End character offset in context
}
```

#### `QaConfig`

```rust
pub struct QaConfig {
    pub source: ModelSource,  // Where to load the model
    pub device: Device,       // CPU or CUDA
}
```

### Methods

#### `new(config: QaConfig) -> Result<Self>`

Creates a new question-answering pipeline. Model loading happens asynchronously on a background thread.

```rust
let pipeline = QuestionAnsweringPipeline::new(QaConfig {
    source: ModelSource::Default,
    device: Device::Cpu,
}).await?;
```

#### `predict(inputs, top_k, max_answer_len) -> Result<Vec<Vec<Answer>>>`

Extracts answers from one or more question–context pairs.

**Parameters:**
- `inputs: &[QaInput]` — question/context pairs
- `top_k: i64` — maximum number of answers to return per input
- `max_answer_len: usize` — maximum token length of each answer span

**Returns:** One `Vec<Answer>` per input, each sorted by descending score.

```rust
let answers = pipeline.predict(&[
    QaInput {
        question: "What is the capital of France?".into(),
        context: "Paris is the capital and largest city of France.".into(),
    },
    QaInput {
        question: "Who wrote Romeo and Juliet?".into(),
        context: "Romeo and Juliet is a tragedy written by William Shakespeare.".into(),
    },
], 3, 50).await?;

// answers[0] contains up to 3 answers for the first question
// answers[1] contains up to 3 answers for the second question
```

---

## Configuration

### Default Model

```rust
let config = QaConfig::default();
// Uses DistilBERT fine-tuned on SQuAD
// Downloads from HuggingFace Hub on first use
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = QaConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/distilbert-qa".into(),
    },
    device: Device::Cpu,
};
```

**Required files:**
- `rust_model.ot` (PyTorch weights)
- `config.json` (model configuration)
- `vocab.txt` (tokenizer vocabulary)

### GPU Acceleration

```rust
let config = QaConfig {
    source: ModelSource::Default,
    device: Device::Cuda(0),  // Use GPU 0
};
```

---

## Advanced Usage

### Multiple Answers per Question

```rust
let answers = pipeline.predict(&[QaInput {
    question: "What is machine learning?".into(),
    context: "Machine learning is a subset of artificial intelligence. \
              It involves training algorithms on data. \
              Deep learning is a type of machine learning using neural networks.".into(),
}], 5, 100).await?;  // Get top 5 answers, max 100 tokens each

for (i, answer) in answers[0].iter().enumerate() {
    println!("Answer {}: {} (score: {:.4})", i + 1, answer.answer, answer.score);
}
```

### Batch Processing

```rust
let inputs = vec![
    QaInput {
        question: "Where is Paris?".into(),
        context: "Paris is the capital of France.".into(),
    },
    QaInput {
        question: "What is Rust?".into(),
        context: "Rust is a systems programming language.".into(),
    },
    // ... more inputs
];

let all_answers = pipeline.predict(&inputs, 1, 32).await?;

for (i, answers) in all_answers.iter().enumerate() {
    println!("Question {}: {}", i + 1, inputs[i].question);
    if let Some(answer) = answers.first() {
        println!("  Answer: {} (score: {:.4})", answer.answer, answer.score);
    }
}
```

### Answer Span Extraction

Use the `start` and `end` offsets to extract the answer from the original context:

```rust
let answers = pipeline.predict(&[QaInput {
    question: "What color is the sky?".into(),
    context: "The sky is blue during the day.".into(),
}], 1, 32).await?;

if let Some(answer) = answers[0].first() {
    let extracted = &context[answer.start..answer.end];
    println!("Extracted span: '{}'", extracted);
    // Output: "Extracted span: 'blue'"
}
```

---

## Comparison with RAG

| Aspect | Extractive QA (this module) | RAG (`magicaf_core::rag`) |
|--------|----------------------------|---------------------------|
| **Input** | Question + context passage | Question only |
| **Model** | Small classifier (DistilBERT, ~250MB) | Large generative LLM (7B+ params) |
| **Output** | Exact text span from context | Free-form generated text |
| **Runtime** | In-process, no server needed | Requires external LLM server |
| **Dependencies** | libtorch / ONNX Runtime | HTTP client (`reqwest`) |
| **Use case** | Known document, precise extraction | Open-ended knowledge retrieval |
| **Accuracy** | High for extractive answers | Can synthesize information |

**When to use Extractive QA:**
- You have the source document
- You need the exact text that answers the question
- You want fast, lightweight inference
- You're doing document Q&A on known texts

**When to use RAG:**
- You need to search across multiple documents
- You want synthesized, free-form answers
- You need to combine information from multiple sources
- You have a powerful LLM server available

---

## Performance

- **Model size:** ~250MB (DistilBERT)
- **Inference speed:** ~50–100ms per question on CPU
- **Memory:** ~500MB–1GB RAM
- **Batch processing:** Efficient for multiple questions on the same context

---

## Troubleshooting

### Low Confidence Scores

If answers have low scores (< 0.5), the question may not be answerable from the context:

```rust
let answers = pipeline.predict(&[QaInput {
    question: "What is the meaning of life?".into(),
    context: "The sky is blue.".into(),  // Unrelated context
}], 1, 32).await?;

// Score will be low — question not answerable from context
```

### Answer Too Long

If answers exceed `max_answer_len`, they'll be truncated. Increase the parameter:

```rust
let answers = pipeline.predict(&inputs, 1, 100).await?;  // Max 100 tokens
```

### Multiple Valid Answers

Use `top_k > 1` to get multiple candidate answers:

```rust
let answers = pipeline.predict(&inputs, 5, 50).await?;  // Top 5 answers
```

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/nlp-tools/use-cases/) for real-world use cases
- **Explore Other Pipelines:** See [Pipelines](/docs/nlp-tools/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/nlp-tools/setup/)
