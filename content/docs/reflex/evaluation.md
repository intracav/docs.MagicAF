---
title: "Evaluation Harness"
description: "Frozen, hashed datasets with a held-out vocabulary split, gold labels by construction, the JSON eval report, and the lane-policy safety metrics."
weight: 5
keywords: [MagicAF Reflex evaluation, frozen eval set, held-out vocabulary, synthetic data, adversarial set, eval report, must-defer, Clopper-Pearson, lane policy metrics, decision model benchmark]
tags: [reflex, evaluation, datasets, safety, reproducibility]
categories: [concept, reference]
difficulty: advanced
prerequisites:
  - /docs/reflex/calibration-and-abstention/
---

An evaluation of a decision model fails in three predictable ways. The test set leaks into training. The labels come from the system you are trying to beat, so the model is scored on how well it imitates the old rules. Or the reported number cannot be traced to the model, data, and thresholds that produced it. The MagicAF Reflex harness is built to rule out all three, and it shares its approach with [Evaluating a Clinical RAG System](/docs/lumen-models/evaluating-clinical-rag/): commit to the data by hash before you score anything.

## The data

All the data is **synthetic**. None of it is patient data and none of it contains PHI. It is generated, or written by hand, in the repository.

**The generator is seeded and deterministic.** It builds (request, page) pairs from typed templates. The pages are synthetic EHR-style pages that mix navigation places with commit and utility buttons, and that include duplicate tab/link pairs. The templates cover these strata:

- command paraphrases and bare section names;
- find requests, including labs, medications, vital signs, and values with units;
- scroll requests;
- clinical questions and instructions, and commit-verb phrasings;
- chat and acknowledgements;
- politeness prefixes and suffixes, negation, and multi-clause requests;
- `?` placement, and numbers and units;
- Unicode tricks: homoglyphs, zero-width characters, fullwidth forms, and NBSP;
- targets absent from the page, ambiguous targets, and commit controls named as targets.

**Gold labels come from the template's construction, never from the rules.** A template that builds "open the MAR" on a page with exactly one MAR tab knows that the answer is `local_command`, `open`, that tab. The rules decider is used only as a cross-check: every disagreement between gold and the rules on a frozen set was reviewed by hand, and label errors were fixed before freezing. The labels encode the policy defined in [Question Sets](/docs/reflex/question-sets/). They were written by engineers, not clinicians, and owner review of the adversarial set is on the approval list.

**Must-defer rows.** A row is `must_defer` when acting on it locally would be *harmful*: it is clinical, it commits something, it is negated, it is chat, or its find target is empty. A request that is merely unresolvable, such as one with an absent or ambiguous target, is `cloud` but not must-defer. Every must-defer row is `cloud`, and the safety gate counts acts on these rows.

**Disjoint vocabulary pools.** Verbs, templates, clinical terms, and label variants are split by hand into TRAIN-only and HELD-OUT pools. The calibration and test splits draw from the held-out pools, so they measure generalisation rather than template memory. Each row records whether it used a held-out item (`novel`), and the report breaks accuracy down on that axis.

## The frozen sets

The frozen sets are committed with a SHA-256 and a row count for each file in `FROZEN.json`, which also pins the question set (`reflex.page_command@1.0.0`) and the text canonicalisation (`magicaf.text/v1`) they were labelled for.

| File | Rows | Source | Used for |
|---|---|---|---|
| `calibration.jsonl` | {{< stat "reflex_calibration_rows" >}} | generated, held-out pools | fitting temperatures and thresholds; never for reporting the gate |
| `test.jsonl` | {{< stat "reflex_test_rows" >}} | generated, held-out pools, disjoint from calibration, different seed | the gate is measured here |
| `adversarial.jsonl` | {{< stat "reflex_adversarial_rows" >}} | **written by hand, line by line**: not generated and not labelled by the rules | reported separately: it is a distribution shift, so the calibration guarantees do not transfer to it |
| `legacy.jsonl` | {{< stat "reflex_legacy_rows" >}} | the Reflex lane's original test corpus of commands, must-defer requests, and commit buttons | continuity with the rules lane's approved corpus, labelled as that corpus labels it |
| `pages.jsonl` | {{< stat "reflex_pages" >}} | the pages the rows reference | — |

The test split holds {{< stat "reflex_test_must_defer" >}} must-defer rows, well above the 598 needed to certify a 0.5% bound with zero failures (see [the metrics](/docs/reflex/calibration-and-abstention/#the-metrics-exactly)).

Every frozen line is readable: the text, a page id, the gold labels, the stratum, and the provenance (`template:…`, `hand:…`, or `corpus:…`). A person can audit any row.

**Guards in CI:**

- A unit test re-hashes every frozen file and fails on any change to its bytes or row count.
- It checks every row against its page: the gold section is a real candidate, every must-defer row is `cloud`, every local command has its target, and no local command is clinical.
- It fails if either split drops below 598 must-defer rows.
- Training refuses to start if any training request, after canonicalisation, appears in a frozen set.

Re-freezing is a deliberate, reviewed step, and it changes every hash.

## Running it

```bash
pnpm magicaf:eval                            # rules + needle + magicaf-local, whichever are vendored
MAGICAF_EVAL_BACKENDS=rules pnpm magicaf:eval
```

The runner loads the frozen sets, verifies their hashes, and runs **every available backend on identical inputs**: `rules` always, and `needle` and `magicaf-local` when they are vendored. `magicaf-local` runs through onnxruntime-web in Node, which is the same WebAssembly runtime the browser uses. Requests are built by the lane's own `buildPageCommandRequest()`, so the eval asks exactly what the lane asks. Separately, `commit_risk` is scored once per (page, candidate) pair, both on all labels and on held-out labels alone.

The run asserts the design's central safety property on every backend and every dataset: **the strict two-key policy never acts on more must-defer rows than the rules alone do**, whatever the model proposes.

## The report

Each run writes a machine-readable JSON report (`magicaf.reflex.eval-report/v1`) and prints a short summary. The report records:

- the question-set version and the text-canonicalisation version;
- the SHA-256 of every dataset file, and whether the data was frozen;
- every backend's info and artifact hash, plus the full calibration artifact, if any;
- per backend and per dataset:
  - **per-question metrics** for `route`, `intent`, `section`, and `clinical`: effective accuracy (an abstention counts as its safe default), coverage, selective accuracy, ECE, Brier, NLL, AUROC, reliability bins, and the risk–coverage curve with AURC;
  - `commit_risk` metrics, on all labels and on held-out labels;
  - accuracy on novel versus seen rows;
  - **lane-policy outcomes**;
  - latency (p50, p95, mean, max) and error counts by code.

**The report never contains request text.** It identifies rows by id; the text stays in the committed dataset. A unit test pins the report's shape and asserts that no request text appears in it. The only way to get text out is an explicit triage flag that writes rules-versus-gold disagreements for synthetic data to a separate local file.

## Lane-policy metrics

Per-question accuracy says whether the model reads a request correctly. The lane-policy metrics say what would *happen* if a policy were in charge. The same records are scored under each policy:

| Policy | Acts when |
|---|---|
| `rules` | the rules decider acts |
| `backend_argmax` | the backend's argmax answers form a proposal (a diagnostic, not a rung) |
| `rules_plus_veto` | the rules act and no veto fires ([rung 1](/docs/reflex/promotion-ladder/#rung-1-veto)) |
| `two_key` | the backend proposes and the rules agree ([rung 2](/docs/reflex/promotion-ladder/#rung-2-strict-two-key)) |
| `model_decides` | c ≥ λ, when a certified λ exists ([rung 3](/docs/reflex/promotion-ladder/#rung-3-model-decides)) |

For each policy, the report gives:

- **Command exact-action accuracy:** of the gold-local rows, the share handled with *exactly* the right action. That means the right section for an open, the same normalized term for a find, and the same direction for a scroll.
- **Must-defer acts:** the count of must-defer rows acted on, with the **one-sided 95% Clopper–Pearson upper bound** on that rate, and the row ids.
- **Wrong acts:** acts that were not exactly right on any row, with the same kind of upper bound.

These three numbers feed the [hard gate](/docs/reflex/promotion-ladder/#the-hard-gate) directly.

## Results

{{< callout type="info" title="Pending" >}}
The model is still being trained and selected, so no results are published yet. Numbers from in-progress runs are deliberately left out.
{{< /callout >}}

[NEEDS: for the selected model, the eval report id and date; the model, calibration, and dataset hashes; per-question metrics on test and adversarial; the lane-policy table (command accuracy, must-defer acts with the 95% UB, and wrong acts) for rules, rules_plus_veto, two_key, and model_decides on test, adversarial, and legacy; and the rules baseline on the same sets for comparison]
