---
title: "Evaluating a Clinical RAG System"
description: "Measure a clinical retrieval pipeline the way Lumen is measured: temporal-cut items, a SHA-256 commitment over the held-out set, product-mode runs, grounded accuracy, and an independent judge."
weight: 2
keywords: [clinical RAG evaluation, medical LLM benchmark, benchmark contamination, temporal-cut evaluation, grounded accuracy, LLM-as-a-judge, Cohen's kappa, test set commitment, Wilson interval, Lumen-Bench]
tags: [evaluation, rag, clinical, benchmarks, statistics, lumen]
categories: [concept]
difficulty: advanced
prerequisites:
  - /docs/core-concepts/rag-pipeline/
  - /docs/lumen-models/serving-a-model-family/
---


You tuned a retrieval pipeline until the answers looked right on the twenty questions you keep in a text file. Now someone asks how accurate it is. The honest answer is that you do not know, and the usual ways of finding out mostly measure something else: a public exam set that your model has probably seen, graded by a model from the same vendor, on a path that skips your retriever.

This page is the method Intracav uses to evaluate **Lumen**, its clinical AI platform, and the Lumen model family, **LMN Sirona** and **LMN Brigid**, reduced to the parts you can apply to your own MagicAF pipeline. It is written for engineers responsible for a number someone else will rely on. The complete protocol, with its statistical plan and threats to validity, is the [Lumen-Bench technical report](https://intracav.ai/research/lumen-bench).

The short version: **evaluate the system, on questions memory cannot answer, against a test set you cannot quietly edit, graded by someone who is not you.**

## Measure the system, in three modes

A clinical answer is produced by a pipeline, not a model. Run every item in up to three modes:

| Mode | What runs | What it tells you |
|---|---|---|
| **base** | System prompt and question, no retrieval, no tools | What the model knows on its own |
| **rag** | Your production retrieval, one model call over the retrieved context | What retrieval adds |
| **product** | The full production path: retrieval, context assembly, tool loop, citation | What a user receives |

Only **product** defines a headline number. The discipline that makes it honest: product mode must call **the same functions** your production route calls, not a cleaner copy written for the benchmark. Lumen enforces this by moving its answer-assembly functions out of the HTTP route into a shared module that both the route and the harness import. Then write down every place the harness still differs from production (streaming, caches, iteration caps, which tools are available) and publish that list next to the results.

## Build items memory cannot answer

Public benchmark items are in pretraining data. You cannot fix that by paraphrasing, and you cannot detect it reliably after the fact. You can make it irrelevant.

A **temporal-cut** item is one whose answer rests on evidence published after the training cutoff of any model you will test: a guideline revised this year, a recall, a new trial. A model alone cannot score on it. Only retrieval of current evidence can.

Mine candidates from your own corpus rather than writing them from scratch. Lumen's harness proposes drafts from recently crawled pages and the guideline registry, derives a machine-checkable **gold locator** for each (a URL path, a guideline slug, a title substring), and leaves the question and gold answer blank for a clinician. Two rules keep this honest:

- **Drafts are invalid by construction.** A draft carries a placeholder question that fails schema validation, so it cannot enter a scored set by accident.
- **A human confirms the publication date.** Crawl time is not publication time. A page you fetched last week may carry guidance from 2016. Temporal status is a clinician's determination, not a crawler's.

Include items that **cannot** be answered from your corpus, and make "the evidence is insufficient" the correct response. A system that never abstains will look excellent until it meets one of these.

## Commit to the test set before you score it

The quietest way to inflate a score is to change the test after seeing results: drop the items the model missed as "ambiguous", or fix a gold answer that disagreed with the model. Curating a noisy public set is legitimate. Curating it only where your model failed is selection on the outcome.

Make that detectable. Hash every item, hash the manifest of hashes, and publish the manifest hash before any scored run.

```rust
use serde::Serialize;
use serde_json::json;
use sha2::{Digest, Sha256};

fn sha256_hex(bytes: &[u8]) -> String {
    hex::encode(Sha256::digest(bytes))
}

/// h(i) = SHA-256 of the item's compact JSON, fields in declaration order.
pub fn item_hash<T: Serialize>(item: &T) -> serde_json::Result<String> {
    Ok(sha256_hex(serde_json::to_string(item)?.as_bytes()))
}

/// C = SHA-256 over schema + per-suite track, count, and sorted (id, hash) pairs.
/// `serde_json::Value` objects serialize with sorted keys (without the
/// `preserve_order` feature), so the commitment is independent of insertion order.
pub fn commitment(suites: &[(&str, &str, Vec<(String, String)>)]) -> serde_json::Result<String> {
    let mut map = serde_json::Map::new();
    for (name, track, items) in suites {
        let mut items = items.clone();
        items.sort_by(|a, b| a.0.cmp(&b.0));
        let items: Vec<_> = items.iter().map(|(id, h)| json!({ "id": id, "sha256": h })).collect();
        map.insert(name.to_string(), json!({ "track": track, "item_count": items.len(), "items": items }));
    }
    let body = json!({ "schema": 1, "suites": map });
    Ok(sha256_hex(&serde_json::to_vec(&body)?))
}
```

Dependencies: `serde` (with `derive`), `serde_json`, `sha2`, and `hex`. Keep the items themselves out of your code repository; commit only identifiers and hashes. Before scoring, the harness fetches the items, recomputes every hash, and **refuses to evaluate anything** unless the count matches and every `(id, hash)` pair is in the manifest. Adding, removing, or editing an item, including its gold answer reference, changes the published hash.

Leave editorial fields such as suite descriptions out of the commitment, so fixing a typo in a description does not look like tampering.

## Grade claims, and refuse credit for unsupported ones

Have the judge decompose each answer into its material claims, mark which retrieved source supports each, and return one of four verdicts:

- **correct**: clinically correct, and every material claim is supported by a retrieved source;
- **correct-unsupported**: clinically correct, but at least one material claim has no supporting source;
- **wrong**: at least one material claim is incorrect;
- **refusal**: the system declines or states the evidence is insufficient.

**Grounded accuracy** is the share of validly judged items rated `correct`. A correct answer that cannot be traced to evidence earns nothing, because to the clinician reading it, it is indistinguishable from a confident guess. Report judge and contestant failures as counts, and report a conservative bound that treats them as wrong.

Score retrieval deterministically against the gold locators: recall, precision, and mean reciprocal rank of the first gold source. Measure on the evidence that actually reached the model context, and say so, because that conflates retrieval with context budgeting and is only comparable at a fixed budget.

## Make the judge independent, then measure it

Language-model judges favor their own vendor's outputs. Resolve the judge exactly as you resolve contestants (see [Serving a Model Family](/docs/lumen-models/serving-a-model-family/)) and refuse to start a judged run when the two share a vendor. Lumen's harness enforces this and requires an explicit override flag to bypass it; any overridden run is ineligible for publication.

Independence is necessary, not sufficient. Have clinicians grade a stratified sample blind to the judge's verdict and to which model answered, and report **Cohen's kappa** between judge and clinicians:

```rust
/// Cohen's kappa for two raters over the same items, with the large-sample
/// 95% interval. Labels are any comparable values (e.g. verdict strings).
pub fn cohen_kappa<L: PartialEq>(pairs: &[(L, L)], labels: &[L]) -> Option<(f64, f64, f64)> {
    let n = pairs.len() as f64;
    if n == 0.0 {
        return None;
    }
    let po = pairs.iter().filter(|(a, b)| a == b).count() as f64 / n;
    let pe: f64 = labels
        .iter()
        .map(|l| {
            let a = pairs.iter().filter(|(x, _)| x == l).count() as f64 / n;
            let b = pairs.iter().filter(|(_, y)| y == l).count() as f64 / n;
            a * b
        })
        .sum();
    if (1.0 - pe).abs() < f64::EPSILON {
        return Some((if po == 1.0 { 1.0 } else { 0.0 }, f64::NAN, f64::NAN));
    }
    let kappa = (po - pe) / (1.0 - pe);
    let se = (po * (1.0 - po) / (n * (1.0 - pe).powi(2))).sqrt();
    Some((kappa, (kappa - 1.96 * se).max(-1.0), (kappa + 1.96 * se).min(1.0)))
}
```

On four items where judge and clinician agree on three (`correct/correct`, `wrong/wrong`, `refusal/refusal`, `correct/wrong`), this returns κ ≈ 0.64 with an interval of roughly 0.02 to 1.0. That width is the point: a kappa from a handful of items tells you almost nothing. The large-sample interval is also optimistic at small n, so add a bootstrap interval over adjudicated items before you rely on it.

## Report intervals, not points

A proportion from 150 items carries a 95% interval of about ±8 points near 50%. Report every rate with a Wilson score interval:

```rust
/// 95% Wilson score interval for k successes in n trials.
pub fn wilson(k: u64, n: u64) -> (f64, f64) {
    let (k, n, z) = (k as f64, n as f64, 1.96_f64);
    let p = k / n;
    let denom = 1.0 + z * z / n;
    let center = (p + z * z / (2.0 * n)) / denom;
    let half = z * (p * (1.0 - p) / n + z * z / (4.0 * n * n)).sqrt() / denom;
    (center - half, center + half)
}
```

`wilson(120, 150)` returns about (0.729, 0.856): a "80% accurate" system is somewhere between 73% and 86%. Compare two models on **identical items** and test the paired outcomes with McNemar's test, not by eyeballing two overlapping intervals. Never compare your measured number with a score someone else reported under different conditions.

## Keep artifacts publishable

Write a run report per suite and mode that records the model's `family` and `version`, the judge vendor label and rubric version, the manifest hash, corpus snapshot digests, the plan-to-model routing table, item counts including failures, and per-item verdicts and retrieval metrics. **Leave out question and answer text**, so the report can be published without leaking the held-out set. Generate any leaderboard only from committed reports.

## What this does not tell you

Be as specific about limits as about results. A temporal-cut item stops being contamination-resistant once models train past its evidence date, so retire and refresh suites on a schedule. Coverage follows your corpus. Lexical gold locators miss the same evidence at a different URL. Judges carry biases that kappa bounds but does not remove. And an evaluation you ran on a system you built is not independent replication, however carefully you ran it. None of these measures clinical outcomes.
