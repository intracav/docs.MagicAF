---
title: "Tutorial: Custom Adapters"
description: "Learn when to customize MagicAF adapters, build a healthcare memo analyzer, and test it — all without modifying framework code."
weight: 2
tags: [tutorial, adapters, healthcare, intermediate, testing, domain-logic]
categories: [tutorial]
difficulty: intermediate
prerequisites:
  - /docs/tutorials/your-first-rag-pipeline/
  - /docs/core-concepts/traits-and-interfaces/
estimated_reading_time: "25 min"
last_reviewed: "2026-02-12"
---

{{< difficulty "intermediate" >}}

{{< prerequisites >}}
- You have completed [Tutorial: Your First RAG Pipeline](/docs/tutorials/your-first-rag-pipeline/)
- You understand that the RAG pipeline has six steps, each handled by a pluggable component
- You are familiar with Rust traits and `async_trait`
{{< /prerequisites >}}

## What You Will Build

In this tutorial, you will build a **healthcare memo analyzer** — a RAG pipeline that reads clinical memos and produces structured assessments. Along the way, you will:

1. Learn a decision framework for **when** to customize vs. use defaults
2. Implement all three adapter traits (`EvidenceFormatter`, `PromptBuilder`, `ResultParser`)
3. Write tests for each adapter in isolation
4. Wire everything into a complete workflow

The goal is not just to write the code — it is to understand **why** each customization exists and **when** you would make similar decisions in your own projects.

---

## When to Customize: A Decision Framework

Before writing any custom code, ask yourself these questions:

### Use the defaults when...

- You are **prototyping** and want fast iteration
- Your output is **unstructured text** (plain answers)
- Evidence formatting does not need domain-specific context
- You have not yet decided on your output schema

### Customize the `EvidenceFormatter` when...

- You need to **filter or re-rank** results before the LLM sees them
- Evidence needs **domain-specific annotations** (source type, date, classification)
- You want to **deduplicate** overlapping content to save context tokens
- Some payload fields are irrelevant and should be excluded

### Customize the `PromptBuilder` when...

- You need a **specific output format** (JSON schema, markdown template, etc.)
- Your domain requires **few-shot examples** in the prompt
- You need **system instructions** beyond what `DefaultPromptBuilder.with_system()` provides
- Different query types need **different prompt strategies**

### Customize the `ResultParser` when...

- You want **structured output** (JSON → typed struct)
- You need **validation** (e.g., confidence must be 0.0–1.0)
- The LLM wraps JSON in markdown code fences or explanation text
- You need **post-processing** (normalize dates, clean formatting)

For our healthcare memo analyzer, we need all three: clinical memos require careful evidence formatting, the prompt must request a specific medical assessment schema, and we need to parse the result into a typed struct.

---

## Step 1 — Define the Domain Result Type

Start with what you want out of the pipeline. A clinical memo assessment should include:

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClinicalAssessment {
    /// One-paragraph summary of the relevant findings
    pub summary: String,
    /// Key clinical observations extracted from the memos
    pub observations: Vec<String>,
    /// Risk level based on the evidence
    pub risk_level: String,
    /// Confidence in the assessment (0.0–1.0)
    pub confidence: f32,
}
```

**Design decision:** We use `String` for `risk_level` rather than an enum because LLMs may phrase it differently ("HIGH", "High", "Elevated"). Validation happens in the parser, not the struct definition.

## Step 2 — Implement the Evidence Formatter

Clinical memos have specific fields that matter: the author, date, department, and content. Our formatter extracts these and presents them in a consistent format:

```rust
use async_trait::async_trait;
use magicaf_core::adapters::EvidenceFormatter;
use magicaf_core::errors::Result;
use magicaf_core::vector_store::SearchResult;

pub struct ClinicalEvidenceFormatter;

#[async_trait]
impl EvidenceFormatter for ClinicalEvidenceFormatter {
    async fn format_evidence(&self, results: &[SearchResult]) -> Result<String> {
        let mut buf = String::new();

        for (i, r) in results.iter().enumerate() {
            let author = r.payload.get("author")
                .and_then(|v| v.as_str())
                .unwrap_or("Unknown");
            let dept = r.payload.get("department")
                .and_then(|v| v.as_str())
                .unwrap_or("General");
            let date = r.payload.get("date")
                .and_then(|v| v.as_str())
                .unwrap_or("N/A");
            let content = r.payload.get("content")
                .and_then(|v| v.as_str())
                .unwrap_or("");

            buf.push_str(&format!(
                "--- Memo {} ---\n\
                 Author: {} | Department: {} | Date: {}\n\
                 Relevance: {:.3}\n\n\
                 {}\n\n",
                i + 1, author, dept, date, r.score, content
            ));
        }

        Ok(buf)
    }
}
```

**Why this matters:** The `DefaultEvidenceFormatter` would dump the entire JSON payload. Our formatter:
- Extracts only the fields the LLM needs
- Adds human-readable labels ("Author", "Department")
- Includes the relevance score so the LLM can weigh evidence appropriately

## Step 3 — Implement the Prompt Builder

The prompt builder is your primary prompt engineering surface. For clinical assessments, we need to be very specific about the output format:

```rust
use magicaf_core::adapters::PromptBuilder;

pub struct ClinicalPromptBuilder;

#[async_trait]
impl PromptBuilder for ClinicalPromptBuilder {
    async fn build_prompt(&self, query: &str, evidence: &str) -> Result<String> {
        Ok(format!(
            r#"You are a clinical documentation analyst. Review the following
medical memos and produce a structured assessment.

IMPORTANT: Base your assessment ONLY on the provided memos.
Do not infer information that is not explicitly stated.

{evidence}

Assessment request: {query}

Respond with a JSON object containing exactly these fields:
- "summary": a one-paragraph summary of relevant findings
- "observations": an array of key clinical observations
- "risk_level": one of "LOW", "MODERATE", or "HIGH"
- "confidence": a float from 0.0 to 1.0

Respond ONLY with valid JSON."#
        ))
    }
}
```

**Why this matters:** Clinical systems must be conservative — the LLM should never speculate beyond the evidence. The prompt explicitly forbids inference beyond stated facts.

## Step 4 — Implement the Result Parser

The parser converts raw LLM text into our typed struct, with validation:

```rust
use magicaf_core::adapters::ResultParser;
use magicaf_core::errors::MagicError;

pub struct ClinicalResultParser;

#[async_trait]
impl ResultParser<ClinicalAssessment> for ClinicalResultParser {
    async fn parse_result(&self, raw_output: &str) -> Result<ClinicalAssessment> {
        let trimmed = raw_output.trim();

        // Extract JSON even if the LLM wraps it in markdown or explanation
        let json_str = if let Some(start) = trimmed.find('{') {
            if let Some(end) = trimmed.rfind('}') {
                &trimmed[start..=end]
            } else {
                trimmed
            }
        } else {
            trimmed
        };

        let mut assessment: ClinicalAssessment =
            serde_json::from_str(json_str).map_err(|e| {
                MagicError::SerializationError {
                    message: format!("Failed to parse clinical assessment: {e}"),
                    source: Some(Box::new(e)),
                }
            })?;

        // Normalize risk level
        assessment.risk_level = assessment.risk_level.to_uppercase();
        if !["LOW", "MODERATE", "HIGH"].contains(&assessment.risk_level.as_str()) {
            assessment.risk_level = "MODERATE".to_string();
        }

        // Clamp confidence to valid range
        assessment.confidence = assessment.confidence.clamp(0.0, 1.0);

        Ok(assessment)
    }
}
```

**Why this matters:** LLMs are not perfectly reliable JSON generators. The parser:
- Handles JSON wrapped in markdown fences or explanation text
- Normalizes the risk level to a known set of values
- Clamps confidence to the valid range

## Step 5 — Test Each Adapter

MagicAF's trait-based design makes each adapter independently testable. No live services required.

### Test the Evidence Formatter

```rust
#[tokio::test]
async fn formatter_extracts_clinical_fields() {
    let formatter = ClinicalEvidenceFormatter;
    let results = vec![SearchResult {
        id: "1".into(),
        score: 0.92,
        payload: serde_json::json!({
            "author": "Dr. Smith",
            "department": "Cardiology",
            "date": "2026-01-15",
            "content": "Patient shows elevated troponin levels."
        }),
    }];

    let evidence = formatter.format_evidence(&results).await.unwrap();
    assert!(evidence.contains("Dr. Smith"));
    assert!(evidence.contains("Cardiology"));
    assert!(evidence.contains("elevated troponin"));
}
```

### Test the Result Parser

```rust
#[tokio::test]
async fn parser_handles_valid_assessment() {
    let parser = ClinicalResultParser;
    let raw = r#"{"summary":"test","observations":["obs1"],"risk_level":"high","confidence":0.85}"#;

    let result = parser.parse_result(raw).await.unwrap();
    assert_eq!(result.risk_level, "HIGH"); // Normalized to uppercase
    assert!((result.confidence - 0.85).abs() < f32::EPSILON);
}

#[tokio::test]
async fn parser_clamps_invalid_confidence() {
    let parser = ClinicalResultParser;
    let raw = r#"{"summary":"test","observations":[],"risk_level":"LOW","confidence":1.5}"#;

    let result = parser.parse_result(raw).await.unwrap();
    assert!((result.confidence - 1.0).abs() < f32::EPSILON);
}

#[tokio::test]
async fn parser_rejects_non_json() {
    let parser = ClinicalResultParser;
    assert!(parser.parse_result("not json at all").await.is_err());
}
```

### Test the Full Workflow with Mocks

```rust
use magicaf_tests::mocks::*;

#[tokio::test]
async fn workflow_produces_valid_clinical_assessment() {
    let llm = MockLlmService::new(
        r#"{"summary":"Patient stable","observations":["Normal vitals"],"risk_level":"LOW","confidence":0.9}"#,
    );

    let workflow = RAGWorkflow::builder()
        .embedding_service(MockEmbeddingService::new(1024))
        .vector_store(MockVectorStore::with_results(vec![]))
        .llm_service(llm)
        .evidence_formatter(ClinicalEvidenceFormatter)
        .prompt_builder(ClinicalPromptBuilder)
        .result_parser(ClinicalResultParser)
        .collection("clinical_memos")
        .build()
        .unwrap();

    let result = workflow.run("Assess cardiac risk", None).await.unwrap();
    assert_eq!(result.result.risk_level, "LOW");
}
```

## Step 6 — Wire It Up for Production

```rust
let workflow = RAGWorkflow::builder()
    .embedding_service(embedder)
    .vector_store(store)
    .llm_service(llm)
    .evidence_formatter(ClinicalEvidenceFormatter)
    .prompt_builder(ClinicalPromptBuilder)
    .result_parser(ClinicalResultParser)
    .collection("clinical_memos")
    .top_k(10)
    .min_score(0.5)
    .generation_config(GenerationConfig {
        temperature: 0.1, // Low temperature for consistent clinical output
        max_tokens: 2048,
        ..Default::default()
    })
    .build()?;

let result = workflow.run("Assess the patient's cardiac risk factors", None).await?;

println!("Summary: {}", result.result.summary);
println!("Risk Level: {}", result.result.risk_level);
println!("Confidence: {:.0}%", result.result.confidence * 100.0);
for obs in &result.result.observations {
    println!("  - {obs}");
}
```

---

## Common Pitfalls

### 1. Over-engineering the evidence formatter

Start simple. Add complexity only when you see the LLM struggling with the evidence format. The default formatter works well for prototyping.

### 2. Not testing the parser with real LLM output

LLMs produce surprising output. Capture raw outputs during development and add them as test cases. Your parser should handle:
- JSON wrapped in `` ```json ... ``` `` code fences
- Leading/trailing explanation text
- Missing optional fields
- Unexpected field values

### 3. Setting temperature too high for structured output

For JSON output, keep `temperature` between 0.0 and 0.3. Higher temperatures increase creativity but also increase the likelihood of malformed JSON.

### 4. Ignoring the evidence count

Always check `result.evidence_count`. If it is 0, the vector store returned no results — and the LLM is generating from nothing. This is a critical signal in production.

---

## Next Steps

- **[Tutorial: Air-Gapped Deployment →](/docs/tutorials/air-gapped-deployment/)** — deploy your pipeline in a disconnected environment
- **[Guide: Testing →](/docs/guides/testing/)** — comprehensive testing strategies
- **[Decision Guide: Adapter Patterns →](/docs/decision-guides/adapter-patterns/)** — when to customize each adapter
