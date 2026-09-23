---
title: "The Promotion Ladder"
description: "Shadow, veto, strict two-key, model decides: how a decision model earns authority, the invariants at every rung, and the hard gate before it may act alone."
weight: 6
keywords: [promotion ladder, shadow mode, model veto, two-key, human-in-the-loop, safe ML deployment, model authority, fail closed, decision model rollout]
tags: [reflex, safety, rollout, shadow-mode, governance]
categories: [concept]
difficulty: intermediate
prerequisites:
  - /docs/reflex/calibration-and-abstention/
---

The usual way to deploy a classifier is to evaluate it offline, pick a threshold, and switch it on. For a model that sits in front of a click in a clinical record, that is one step too many. MagicAF Reflex instead **earns authority rung by rung**. It starts with none: it watches and counts. Each rung above that gives it a little more, is switched on separately, and has to be justified by the evidence the rung below produced.

The ladder is configuration (`rungs.ts`) plus pure lane policies (`page-command.ts`). The Reflex lane applies them around the rules decider.

## The rungs

Every rung is off unless explicitly switched on. Rungs 1 to 3 default to off.

| Rung | What the model may do | How it is switched on |
|---|---|---|
| **0 · Shadow** | Nothing. It answers beside the rules, and the lane counts how the two compare. | A server feature flag, or a local developer override, in internal builds only |
| **1 · Veto** | Turn a rules *act* into a defer. It can only remove actions. | Its own server flag, or the local override |
| **2 · Strict two-key** | Propose an action, which runs only if the rules independently agree. | Its own server flag, or the local override |
| **3 · Model decides** | Act within its certified coverage (c ≥ λ), even where the rules defer. | A reviewed **code change** *and* a local override. No server flag exists. |

### Rung 0: shadow

The model reads every panel request beside the rules, on sites eligible for page context, and the lane records **counts only**:

- agreement with the rules, per question;
- confidence buckets crossed with agreement;
- what each rung *would* have done, with model-only acts broken down by the rules' defer reason;
- latency buckets and allowlisted error codes.

It shows nothing, decides nothing, and stores no text. At run time there is no ground truth, so "calibration" here means confidence against *agreement with the rules*. This is the evidence the frozen eval cannot provide: how the model behaves on real traffic. Shadow runs one request at a time, and a request that arrives while one is in flight is counted as skipped.

### Rung 1: veto

The rules decide. The model may then veto an act, turning it into a defer, if any of these holds:

- `P(clinical) ≥ τ_clinical`;
- the action is an open, and `P(commit_risk(target)) ≥ τ_commit`;
- `P(route = cloud) ≥ τ_route`.

The τ values come from the loaded calibration, fitted with a bounded recall cost (see [veto thresholds](/docs/reflex/calibration-and-abstention/#step-3-veto-thresholds-with-a-bounded-recall-cost)). The veto can never *add* an act: a rules defer stays a defer whatever the model says. Each veto is counted by its reason.

### Rung 2: strict two-key

The model proposes an action from its argmax answers. The proposal runs only if `agrees()`, the rules' own check, independently lands on the same action. For find and scroll, the arguments (the search term, the direction) always come from the deterministic grammar, never from the model.

The set of actions taken at this rung is a **subset** of the rules' actions, so it adds no recall. It exists to exercise the model as the *proposer*, with the rules holding the second key. The rung is strict: with no model answer there is no proposal, and with no proposal there is no act.

### Rung 3: model decides

The model acts where its joint act-confidence clears the certified λ (see [Step 4](/docs/reflex/calibration-and-abstention/#step-4-λ-for-model-decides)), including where the rules would defer.

This rung is **compiled out**. It needs `MODEL_DECIDES_CERTIFIED` to be `true` in the source, and today it is `false`. Changing it is a reviewed code change, never a configuration change. Even with every override on, a rules defer stays a defer, and a unit test holds the lane to that.

## Invariants at every rung

**Authority is earned, not assumed.** Each rung is switched on separately, and none is on by default. An older server that does not send the new flags means *off*. A malformed local override is ignored.

**Nothing around the decider changes.** The model only ever replaces or narrows the rules decider. Everything around it stays exactly as it was:

- The text-only check runs first, so a clinical question never touches the page and never consults the model on the lane's path. (Shadow mode does read every panel request, on the device, but its answers only become counters.)
- The permission mapping is unchanged. A find or scroll needs the site to be eligible for page context. An open is a click, which runs automatically only where the clinician enabled auto-approved actions for the site, and otherwise needs a one-tap confirmation.
- The deterministic hard-block runs twice: once in the lane, and once in the content script against the real element's label.
- Confirm tokens are single-use and expire.
- The lane still yields to the cloud agent: it never touches the page once a cloud turn is live or a send has started.
- Local turns are never sent to the cloud as conversation history.

A model that "likes" Sign Orders therefore cannot make the lane click it: the rules defer first, and the hard-block stands behind them. There is a test for exactly that case.

**An unavailable model never widens anything.** If the model is missing, slow (the lane waits at most 150 ms for it), or failing, rungs 0 and 1 leave the rules' decision exactly as it was, which is the approved status quo. Under rung 2, a missing model means no act. The lane counts every unavailable answer, so the team can see how often the veto was absent.

**Only internal builds have a model.** Store builds do not have the offscreen API, so every rung resolves to off there, whatever the flags say (see [Privacy and Supply Chain](/docs/reflex/privacy-and-supply-chain/)).

## The hard gate

Before rung 3 can be compiled in, all of the following must hold:

1. **Command exact-action accuracy of at least 97%** on the frozen eval.
2. **Zero must-defer acts** without the second key.
3. **Enough must-defer examples for the bound to mean something:** a one-sided 95% Clopper–Pearson upper bound on the must-defer act rate of at most 0.5%. With zero failures, that takes n ≥ 598 (rule of three: about 3/n).
4. **Explicit owner approval.**

These are bounds on the synthetic distribution. Real traffic needs its own shadow evidence first, and that is what rung 0 exists to collect.

[NEEDS: the current status of each rung, which the owner updates as rungs are enabled. As of this writing, every rung is off by default and rung 3 is compiled out.]
