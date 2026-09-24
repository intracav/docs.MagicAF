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

Eval run of 2026-09-23 for {{< stat "reflex_model_name" >}} 0.1.0, with its calibration, on the frozen sets. The data hashes match `FROZEN.json`. The `rules` backend is the approved decider; `needle` is the earlier uncalibrated generative baseline. The calibration split was used only for fitting, so every number below comes from data the fit never saw.

### Per question (test split)

Accuracy is *effective*: an abstained answer counts as its safe default.

| Question | Backend | Accuracy | ECE | Brier | AUROC |
|---|---|---|---|---|---|
| `route` | rules (0/1) | .683 | .317 | — | .500 |
| | needle | .582 | .380 | .789 | .491 |
| | **{{< stat "reflex_model_name" >}}** | **.834** | **.005** | **.102** | **.884** |
| `intent` | rules | .584 | .416 | — | .500 |
| | needle | .510 | .474 | .958 | .482 |
| | **{{< stat "reflex_model_name" >}}** | **.834** | **.018** | **.132** | **.900** |
| `section` | rules | .787 | .213 | — | .500 |
| | needle | .791 | .204 | .411 | .539 |
| | {{< stat "reflex_model_name" >}} | .745 (always abstains) | .012 | .112 | .894 |
| `clinical` | rules (derived) | .782 | .218 | — | .740 |
| | {{< stat "reflex_model_name" >}} | .677 (abstains below p .970) | **.010** | **.037** | **.976** |
| `commit_risk` | rules (derived) | .942 | .058 | — | .957 |
| | **{{< stat "reflex_model_name" >}}** | **.989** (unseen labels: .972) | **.007** | **.011** | **1.000** |

How to read this table:

- **The rules' probabilities carry no ranking information.** They are 0 or 1, so their AUROC is .500 by construction.
- **Needle's confidence carries no information about correctness either.** Its AUROC is about 0.5, and its ECE is 0.38–0.47.
- **{{< stat "reflex_model_name" >}}'s calibration held on the test split.** Its ECE is .005–.018 on every question.
- **Two of its accuracies look low because it abstains, not because it is wrong.** For `section` and `clinical`, abstention sends the answer to the safe default. `section` could not certify its selective threshold at all, and `clinical` abstains below p = .970. The lane reads their probabilities instead, and their AUROC (.894 and .976) is what the lane uses.
- **Coverage at the per-question thresholds:** `route` 72%, `intent` 76%, `clinical` 63%, `commit_risk` 100%.
- **On held-out vocabulary it generalises better than the rules.** On the 2,582 test rows that use held-out vocabulary, its `route` accuracy is .829, against the rules' .651. On the 418 rows with seen phrasing, it is .868 against .880.

### Lane policies (test split)

The test split has 1,242 commands and {{< stat "reflex_test_must_defer" >}} must-defer requests.

| Policy | Commands exactly right | Must-defer acts | 95% UB | Wrong acts |
|---|---|---|---|---|
| rules (today) | 241 (19.4%) | 25 | 2.4% | 126 |
| needle, at its own argmax | 269 | 74 | 6.3% | 274 |
| {{< stat "reflex_model_name" >}}, at argmax (no threshold) | 616 (49.6%) | 24 | 2.4% | 194 |
| **rung 1: rules + veto** | **237 (19.1%)** | **12** | **1.4%** | **104** |
| rung 2: strict two-key | 225 (18.1%) | 8 | 1.0% | 79 |
| rung 3: model decides at λ = 0.940 | 86 (6.9%) | **0** | **0.21%** | 13 |

On the hand-written adversarial set (86 commands, 142 must-defer) and the legacy corpus (24 commands, 178 must-defer):

| Policy | Adversarial: commands, must-defer acts | Legacy: commands, must-defer acts |
|---|---|---|
| rules | 59, 6 | 24, 0 |
| rules + veto | 57, 1 | 23, 0 (wrong acts fall from 2 to 0) |
| strict two-key | 57, 1 | 22, 0 |
| model decides | 3, 0 | 6, 0 |
| needle, at argmax | 52, 35 | 14, 18 |

What the tables show:

- **The veto halves the rules' must-defer acts at almost no cost.** On test it takes them from 25 to 12, and costs 4 of 1,242 commands. On the adversarial set, it takes them from 6 to 1.
- **The rules' command recall is low on held-out vocabulary**, at 19.4%. The rules also act on 25 must-defer test requests, such as find-shaped clinical questions ("search for red flags") and "discharge the patient" matched to a Discharge tab. These are findings about the rules. They are reported, not quietly patched, because the rules are the approved behaviour and changing them needs an owner decision.
- **Rung 3 is safe but narrow.** It made no must-defer acts on any set. Its low command coverage comes mostly from argument extraction, not from the model. The shared deterministic grammar builds find and scroll arguments, and it cannot parse held-out find and scroll verbs: 312 of the 1,269 calibration commands get no action at all.

### The hard gate

| Requirement | Status |
|---|---|
| Zero must-defer acts without the second key, with a meaningful bound | **Met on test:** 0 of 1,428, 95% UB 0.21%. Adversarial: 0 of 142 (UB 2.1%). Legacy: 0 of 178. |
| Command exact-action accuracy ≥ 97% | **Not met:** 6.9% on test. |
| Owner approval | Not given. |

So [rung 3](/docs/reflex/promotion-ladder/#rung-3-model-decides) stays compiled out. The binding constraint is argument extraction and held-out phrasing, not the safety bound.

### Speed in the eval

In Node, through onnxruntime-web, {{< stat "reflex_model_name" >}} answers in p50 5.0 ms and p95 15.8 ms per request on the test split. The needle baseline answers in p50 694 ms and p95 2.9 s under the same load. The browser measurements are on the [overview](/docs/reflex/#budgets-and-measured-runtime).

### What is not verified

- Everything above is on synthetic data. There is no evidence yet from real clinician traffic; rung 0 exists to gather it.
- There has been no run against a real EHR sandbox, and none in Edge.
- The browser measurements come from Playwright-managed Chromium, because branded Google Chrome 137 and later ignores `--load-extension`.
- The labels and the adversarial set were written by engineers, and have not been reviewed by a clinician.
