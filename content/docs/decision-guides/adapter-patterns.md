---
title: "Adapter Patterns"
description: "When to customize each MagicAF adapter trait, with common patterns and anti-patterns."
weight: 2
tags: [adapters, patterns, anti-patterns, evidence-formatter, prompt-builder, result-parser]
categories: [guide]
difficulty: intermediate
prerequisites:
  - /docs/core-concepts/traits-and-interfaces/
  - /docs/guides/building-adapters/
---

{{< difficulty "intermediate" >}}

You have worked with frameworks that offer two options: accept their opinions or fork them. MagicAF's answer to that is its three **adapter traits** — `EvidenceFormatter`, `PromptBuilder`, and `ResultParser` — the extension points where your domain logic lives without touching framework internals. Each one is a seam the pipeline was designed to be cut at.

This guide is for engineers who have a working pipeline on the defaults and are deciding what to customize next. You will leave knowing which trait to implement first, the signals that tell you it is time, and the patterns (and anti-patterns) for each. The position up front: **default to the built-in adapters, and when output quality forces your hand, customize `PromptBuilder` and `ResultParser` together — structured output is the most common reason to leave the defaults, and it requires both.** Customize `EvidenceFormatter` only when the evidence itself is the problem.

## The Default Path

Defaults are fine when:
- You are **prototyping** or exploring a new data set
- Output is **unstructured text** (raw answers)
- You have not yet defined your domain schema
- The pipeline is for **internal exploration**, not production

Move to custom adapters when:
- You need **structured, typed output** (JSON → struct)
- Evidence requires **domain-specific formatting** or filtering
- You need **audit trails** or **compliance logging**
- The prompt requires **few-shot examples** or complex instructions

None of these triggers is "it feels unpolished." Each one is a concrete requirement the defaults cannot meet. Until you hit one, stay put.

---

## EvidenceFormatter

The formatter decides what the LLM sees. Bad evidence in, bad answer out — and no prompt fixes evidence that was never retrieved, was duplicated, or lacks attribution.

### When to Customize

| Signal | Default OK? | Custom Needed? |
|--------|------------|----------------|
| LLM answers are generally correct | Yes | — |
| LLM cites irrelevant information | — | Yes — filter results |
| Evidence contains duplicate content | — | Yes — deduplicate |
| Domain requires source attribution | — | Yes — add metadata labels |
| Context window is filling up | — | Yes — trim or summarize |

### Pattern: Metadata-Annotated Evidence

Add source labels so the LLM can cite them:

```rust
buf.push_str(&format!(
    "[Source {}] ({}, {}, relevance: {:.2})\n{}\n\n",
    i + 1, source_type, date, result.score, content
));
```

**When:** You need source attribution in the output (Q&A, analysis, compliance).

### Pattern: Re-Ranking by Domain Signal

Sort results by a domain-specific field instead of pure vector similarity:

```rust
let mut sorted = results.to_vec();
sorted.sort_by(|a, b| {
    let a_priority = a.payload.get("priority").and_then(|v| v.as_f64()).unwrap_or(0.0);
    let b_priority = b.payload.get("priority").and_then(|v| v.as_f64()).unwrap_or(0.0);
    b_priority.partial_cmp(&a_priority).unwrap_or(std::cmp::Ordering::Equal)
});
```

**When:** Vector similarity alone does not capture relevance (e.g., newer documents should rank higher).

### Pattern: Content Deduplication

Remove overlapping evidence that wastes context tokens:

```rust
let mut seen_hashes = HashSet::new();
let unique: Vec<_> = results.iter()
    .filter(|r| {
        let content = r.payload.get("content").and_then(|v| v.as_str()).unwrap_or("");
        let hash = hash_content(content);
        seen_hashes.insert(hash)
    })
    .collect();
```

**When:** Your corpus contains overlapping chunks (common with sliding-window chunking).

### Anti-Pattern: Doing LLM Calls in the Formatter

The evidence formatter runs **before** the LLM call. Do not call external services here — it adds latency and creates a dependency loop.

---

## PromptBuilder

The prompt builder is where instructions live, and it is the highest-leverage adapter of the three: a one-line schema instruction here changes the shape of every response downstream.

### When to Customize

| Signal | Default OK? | Custom Needed? |
|--------|------------|----------------|
| Raw text answers are acceptable | Yes | — |
| You need JSON or structured output | — | Yes |
| Different query types need different prompts | — | Yes |
| You need few-shot examples | — | Yes |
| Regulatory requirements dictate prompt content | — | Yes |

### Pattern: Schema-Directed Prompting

Tell the LLM exactly what JSON fields to produce:

```rust
Ok(format!(
    r#"Respond with a JSON object containing exactly:
- "answer": string
- "confidence": float (0.0–1.0)
- "sources": array of integers

Sources:
{evidence}

Question: {query}

JSON:"#
))
```

**When:** You need structured, parseable output.

### Pattern: Query-Type Routing

Use different prompt templates based on the query type:

```rust
async fn build_prompt(&self, query: &str, evidence: &str) -> Result<String> {
    if query.starts_with("compare") || query.contains("vs") {
        self.comparison_prompt(query, evidence)
    } else if query.starts_with("summarize") {
        self.summary_prompt(query, evidence)
    } else {
        self.default_prompt(query, evidence)
    }
}
```

**When:** Your application handles multiple types of queries with different output expectations.

### Pattern: Few-Shot Examples

Include example input/output pairs to improve consistency:

```rust
let prompt = format!(
    r#"Given evidence, produce an analysis.

Example:
Evidence: "Sales increased 15% in Q3."
Analysis: {{"trend": "positive", "magnitude": "moderate", "period": "Q3"}}

Now analyze:
{evidence}

Question: {query}

JSON:"#
);
```

**When:** The LLM struggles to produce the exact format you need. Few-shot examples dramatically improve consistency.

### Anti-Pattern: Hardcoding Evidence in the Prompt

Never embed raw evidence text into the prompt template. Always use the `evidence` parameter — the evidence comes from the formatter, which has already processed and filtered it.

### Anti-Pattern: Overly Long System Instructions

Extremely detailed system prompts eat into your context window. Keep instructions concise and put complexity into the evidence formatter or result parser instead.

---

## ResultParser

The parser is the boundary between LLM output and your type system. Everything downstream of it gets to assume valid data — which means the parser is where you stop trusting the model and start enforcing your schema.

### When to Customize

| Signal | Default OK? | Custom Needed? |
|--------|------------|----------------|
| Raw text output is fine | `RawResultParser` | — |
| You need typed JSON output | `JsonResultParser<T>` | — |
| LLM wraps JSON in markdown fences | — | Yes |
| You need validation / normalization | — | Yes |
| You need to extract from mixed text | — | Yes |

### Pattern: Robust JSON Extraction

Handle JSON wrapped in markdown code fences or explanation text:

```rust
let json_str = if let Some(start) = trimmed.find('{') {
    if let Some(end) = trimmed.rfind('}') {
        &trimmed[start..=end]
    } else {
        trimmed
    }
} else {
    trimmed
};
```

**When:** Almost always, if you are parsing JSON from an LLM. This is so common it should be your default approach.

### Pattern: Validation and Normalization

Validate parsed fields against domain constraints:

```rust
// Normalize enum-like fields
assessment.risk_level = assessment.risk_level.to_uppercase();
if !["LOW", "MODERATE", "HIGH"].contains(&assessment.risk_level.as_str()) {
    assessment.risk_level = "MODERATE".to_string();
}

// Clamp numeric fields
assessment.confidence = assessment.confidence.clamp(0.0, 1.0);
```

**When:** The output feeds into downstream systems that expect specific value ranges.

### Anti-Pattern: Silently Ignoring Parse Errors

Never swallow parse errors. Return `Err` so the caller can decide how to handle it (retry, fall back, log):

```rust
// BAD — hides failures
Ok(default_value)

// GOOD — surfaces the problem
Err(MagicError::SerializationError { message, source })
```

---

## Which Adapter First

| Adapter | Customization Effort | Impact on Quality | When Worth It |
|---------|---------------------|-------------------|---------------|
| `EvidenceFormatter` | Low | Medium | When evidence is noisy or needs domain labels |
| `PromptBuilder` | Low–Medium | High | When you need structured output or domain-specific instructions |
| `ResultParser` | Medium | High | When you need typed, validated results |

{{< card-grid >}}
{{< decision-card title="EvidenceFormatter" tint="blue" >}}
- The LLM cites irrelevant or duplicate evidence
- Your domain requires source attribution or metadata labels
- Retrieved chunks overflow the context window
- Vector similarity alone ranks results poorly
{{< /decision-card >}}
{{< decision-card title="PromptBuilder" tint="green" >}}
- You need JSON or otherwise structured output
- Different query types need different prompt templates
- Few-shot examples are required for output consistency
- Regulatory requirements dictate prompt content
{{< /decision-card >}}
{{< decision-card title="ResultParser" tint="green" >}}
- Output must land in typed Rust structs
- The LLM wraps JSON in markdown fences or prose
- Fields need validation, normalization, or clamping
- Downstream systems expect guaranteed value ranges
{{< /decision-card >}}
{{< /card-grid >}}

**Start with defaults, then customize one adapter at a time.** Measure the impact before adding more complexity. The traits will still be there when you need them — that is the point of the design.
