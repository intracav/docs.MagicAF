---
title: "Calibration and Abstention"
description: "How Reflex turns logits into calibrated probabilities and certifies thresholds: temperature and Platt scaling, selective thresholds, veto costs, and λ by RCPS."
weight: 4
keywords: [calibration, temperature scaling, Platt scaling, selective prediction, abstention, risk-controlling prediction sets, RCPS, Learn then Test, conformal risk control, Clopper-Pearson, ECE, Brier score, AUROC, AURC, rule of three]
tags: [reflex, calibration, statistics, selective-prediction, safety]
categories: [concept]
difficulty: advanced
prerequisites:
  - /docs/reflex/architecture/
---

Most teams put a threshold on a model's confidence, pick 0.9 because it feels safe, and never state what 0.9 buys them. MagicAF Reflex does it the other way round. It first decides the risk it will accept, such as "acting wrongly on at most 1% of requests, with 95% confidence", and then **fits** the threshold that certifies that risk on held-out data. This page is the exact procedure, as implemented in `eval/calibrate.ts` and `eval/metrics.ts`.

Every step below runs on the **frozen calibration split** only ({{< stat "reflex_calibration_rows" >}} requests, including {{< stat "reflex_calibration_must_defer" >}} must-defer requests), and it runs through the **deployed pipeline**: the int8 encoder on onnxruntime-web, the TypeScript tokenizer and post-processing, and the real rules decider. The test split is never touched while fitting. The resulting `calibration.json` is its own versioned artifact, with an id of the form `cal-<model>-<version>-<date>-<sha8>`, and it pins the SHA-256 of the encoder it was fitted for.

## Step 1: calibrate each head

| Head | Method | Fit |
|---|---|---|
| `intent` | temperature `T`: softmax(z / T) | minimize mean NLL by golden-section search over log T, with T in [0.05, 20] |
| `section` | temperature, over the page's candidates plus `none` | same |
| `clinical` | temperature: sigmoid(z / T) | same, with binary NLL |
| `commit_risk` | temperature | same, fitted per candidate label on the calibration pages |
| `route` | **Platt scaling**: sigmoid(a·z + b) | Newton's method with a tiny ridge, and step halving whenever the NLL would rise, so that near-separable data cannot drive `a` and `b` to infinity |

A calibration report records the NLL and the ECE of each head before and after fitting.

## Step 2: per-question abstention thresholds

For a consumer that reads one question at a time, each key gets a **selective threshold**, `abstain_below[key]`. The backend abstains, with `below_threshold`, when an answer's confidence falls below it.

The threshold is the **smallest** confidence `t` such that the one-sided 95% Clopper–Pearson upper bound on the error rate **among answers with confidence ≥ t** is at most α = 2%. Candidate thresholds are tested from the most confident answer downward, and the search **stops at the first failure**. This is a fixed-sequence test: because the hypotheses are tested in a fixed order and testing stops at the first rejection, no multiplicity correction is needed. A threshold is considered only once it covers at least 30 answers. If even the most confident group fails, the threshold is set above 1, and the question always abstains.

## Step 3: veto thresholds with a bounded recall cost

At [rung 1](/docs/reflex/promotion-ladder/#rung-1-veto), the model may veto an action the rules chose. There are three veto signals: `P(clinical)`, `P(commit_risk)` of the rules' target, and `P(route = cloud)`. Each one's threshold τ is chosen from the grid {0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99}.

- The candidates are the calibration requests where the rules acted **correctly**. A veto there is pure recall cost.
- τ is the **smallest** grid value (the most vetoes, the safest) whose recall cost has a one-sided 95% Clopper–Pearson upper bound of at most **2% of the rules' correct acts**.
- If no grid value is cheap enough, τ is set above 1. The signal is too noisy to veto with, so it is disabled, and the report says so.

## Step 4: λ for "model decides"

[Rung 3](/docs/reflex/promotion-ladder/#rung-3-model-decides) lets the model act where the rules defer, but only above a certified threshold λ on a single **joint act-confidence**:

```
c = P(route = local) · P(intent = â) · (1 − P(clinical))
    · [for an open: P(section = ŝ) · (1 − P(commit_risk(ŝ)))]
```

Here â and ŝ are the model's argmax intent and section. `c` is 0 when the model would not act: the intent is `none`, an open names no section, or there is no `commit_risk` answer for the chosen section. `c` is not a probability of correctness, because the factors are dependent. It is the monotone score that λ is fitted on.

The **loss** is 1 when the policy acts and the act is wrong: it acts on a request whose gold label is `cloud`, or it acts with the wrong target. λ is chosen in the style of **RCPS / Learn-then-Test**:

- λ is the smallest threshold such that the one-sided 95% Clopper–Pearson **upper bound** on the false-act rate is at most α, measured over **all** *n* calibration requests, at that threshold and at every larger one. Raising λ only removes acts, so the scan walks down from the top and stops at the first violation.
- Two constraints are fitted, and the stricter one wins:
  - α = **1%** false acts overall;
  - α = **0.5%** acts on the must-defer subset, where every act counts as an error.
- If no threshold qualifies, λ is set above every score. The model never acts; that is the fail-closed default. `calibration.json` then stores `lambda: null`.

This bounds the risk itself with probability at least 95%, under exchangeability. For comparison, the report also computes the **conformal risk control** threshold: the smallest λ with (n·R̂(λ) + 1)/(n + 1) ≤ α. That bounds only the *expected* risk, so it is less conservative. It is reported and never used.

{{< callout type="warning" title="What the bound covers" >}}
The guarantee holds for requests exchangeable with the calibration split, which is synthetic. It says nothing on its own about real clinician traffic, which is why the promotion ladder requires shadow evidence on real use before any authority, and why the hand-written adversarial set is reported separately rather than folded in.
{{< /callout >}}

## Why lane policies ignore the abstain flag

The Reflex lane reads the **calibrated probabilities** and applies its own thresholds (τ and λ). It ignores each answer's `abstain` flag, and treats an answer as *missing* only when it carries no probabilities at all, such as an `unsupported` or `error` answer.

The reason is that τ and λ were certified on exactly those probabilities. Calibration fits them with `abstain_below` left empty, so per-question abstention hides no signal from the fit. Honoring the flags as well would still be safe, because acting on a subset of a certified policy's acts can only lower its false-act count. But it would make the runtime policy differ from the policy that was certified. Ignoring the flags keeps the two identical. The `abstain_below` thresholds exist for single-question consumers, not for the lane.

## The metrics, exactly

Every metric is a pure function, pinned by unit tests against values computed by hand.

| Metric | Definition |
|---|---|
| **ECE** | Top-label confidence (for yes/no: the confidence of the predicted side) in **15 equal-width bins**: Σ (n_b / N) · \|acc_b − conf_b\|. The last bin is closed on the right, so a confidence of exactly 1 lands in the top bin. |
| **Brier** | Multi-class: the mean over examples of Σ_k (p_k − 1[k = gold])². Binary: the mean of (p − y)². |
| **NLL** | The mean −log p(gold), with probabilities clipped at 1e−12. |
| **AUROC** | Mann–Whitney U, with **average ranks for ties**. For a choice: confidence against correctness. For a yes/no: `p_yes` against the gold label. NaN when either class is empty. |
| **Risk–coverage / AURC** | Sort by confidence, descending; risk(k) is the errors in the top k divided by k. AURC is the mean of risk(k) over all k. |
| **Clopper–Pearson** | The exact one-sided (1 − α) upper bound: the p at which P(X ≤ k; n, p) = α, found by bisection. With k = 0 it is 1 − α^(1/n). |

Two consequences are worth knowing by heart:

- **The rule of three.** With zero failures in *n* trials, the 95% upper bound is about 3/n.
- **n ≥ 598 for ≤ 0.5%.** To certify a 0.5% bound with zero failures, you need n ≥ ⌈ln 0.05 / ln 0.995⌉ = **598**. The frozen test split holds {{< stat "reflex_test_must_defer" >}} must-defer requests, so a clean run on it certifies a bound of about 0.21%. A unit test fails if either frozen split ever drops below 598 must-defer requests.

## Results

[NEEDS: the calibration report for the selected model: per-head ECE and NLL before and after, the fitted temperatures and Platt parameters, `abstain_below` per key, the veto τ values with their recall-cost bounds, and λ with its coverage and bounds, including the conformal-risk-control comparison. Include the model and calibration ids.]
