---
title: "Adding a Question to a Question Set"
linkTitle: "Adding a Question"
description: "Add a key to a Reflex question set, teach the backends to answer it, and get it calibrated and evaluated, following the real code paths. Plus: writing a backend."
weight: 9
keywords: [MagicAF Reflex guide, add question key, question set semver, ReflexBackend implementation, runBackend, new classifier head, ONNX heads, calibration, frozen dataset]
tags: [reflex, guide, question-sets, backends]
categories: [guide]
difficulty: advanced
prerequisites:
  - /docs/reflex/question-sets/
  - /docs/reflex/architecture/
---

Sooner or later a consumer needs to ask something new. Adding a question to MagicAF Reflex touches more than a JSON file, because the whole point is that answers are trained, calibrated, and evaluated for exactly the keys that exist. This guide follows a new key through every layer, in the order the work has to happen, and names the file that changes at each step. The last section covers the smaller job of adding a backend without changing any question.

The running example is a **hypothetical** `yes_no` key, `selection_ref`: *does the request refer to the user's current text selection?* ("what does this mean", "find this"). It does not exist. It is just a realistic shape to work through.

## 1. Check that it is a Reflex question

Before writing anything, check the key against the design's rules:

- **It must be locally observable in the text.** If answering needs counting, arithmetic, several hops, or outside knowledge, it belongs to the LLM, not to a System One model.
- **It must be orthogonal.** A small question that code combines with others beats one big "should I act?" question. That decomposition is what lets `commit_risk` check `section`'s pick independently.
- **It must have a safe default that fails toward the careful path.** If an abstention cannot be mapped to a safe answer, the key is not ready. For `selection_ref`, the careful default is `yes`: assume the request depends on context the lane does not have, and send it to the cloud.

## 2. Version the question set

Add the key to the set's JSON file, `src/shared/magicaf/reflex/question-sets/reflex.page_command.json`, and bump the version:

```json
{
  "id": "reflex.page_command",
  "version": "1.1.0",
  "keys": {
    "selection_ref": {
      "type": "yes_no",
      "safe_default": "yes",
      "description": "Does the request refer to the user's current text selection rather than naming its target?"
    }
  }
}
```

This excerpt shows only the new key. The set's `description` and its other five keys stay as they are. A new key is a **minor** bump. Adding an option to an existing key, or changing what a key means, is a **major** bump, and a major bump breaks every consumer that pins the old major.

Nothing else in the contract changes: this is a question-set change, not a wire change. The registry resolves a request for `@1.0.0` to the `1.1.0` set, because a newer minor only adds keys. A backend that has not learned the key answers it `abstain: unsupported`, so consumers can start asking before any backend can answer.

Run the contract tests. The test that every key's safe default fails toward the cloud now covers `selection_ref` too.

## 3. Ask it

If the Reflex lane is the consumer, add the question to `buildPageCommandRequest()` in `page-command.ts`, and read the answer in `readPageCommand()`:

```typescript
{ id: 'selection_ref', key: 'selection_ref', type: 'yes_no' },
```

Then decide how a lane policy uses it: as a new veto signal, or as a factor in the act-confidence. Whatever you choose must be refitted in step 6, because the lane reads calibrated probabilities against certified thresholds, not raw answers.

## 4. Label it by construction

Gold labels come from how an example is built, never from an existing decider. In `ml/magicaf-reflex/magicaf_reflex/generate.py`:

- add the gold field to the `Example` record;
- set it in every template, and add templates for the new strata, such as deictic phrasings ("this", "that value", "the highlighted one") and near misses that name their target;
- split any new vocabulary into TRAIN and HELD-OUT pools in `vocab.py`, so that the calibration and test splits measure generalisation;
- add hand-written cases to `data/adversarial.psv`.

Then **re-freeze**. This is a reviewed step, because it replaces every frozen file and every hash in `FROZEN.json`, and the frozen-dataset test fails until the new hashes are committed. The frozen sets record the question-set version they were labelled for, so they move to `reflex.page_command@1.1.0`. After freezing, regenerate the parity fixtures with `scripts/fixtures.py`.

## 5. Teach the model

A new key means a new head, and the change runs through the model, the export, and the TypeScript runtime:

| File | Change |
|---|---|
| `magicaf_reflex/model.py` | Add the head to `Heads`, return it from `forward`, and add its loss (and distillation term) to `losses` |
| `scripts/export.py` | Add the output name to the heads graph's `output_names` |
| `backends/local.ts` | Add it to `HeadOutputs`, `KEYS`, and `LocalCalibration.temperature`, and answer the key in `answerAll` with `yesNoAnswer()` |
| `runtime/ort-runner.ts` | Read the new output by name in `heads()` |

The two-graph split helps here: a per-request head goes on `heads.onnx` and leaves the encoder graph alone, and the export still has to pass its torch-versus-ONNX and int8-versus-fp32 checks. Retraining produces a new model artifact with new hashes. That is a new model version, not a change to the old one.

## 6. Calibrate it

Add the head to the calibration runner (`test/unit/magicaf-reflex.calibrate.test.ts`):

- collect its raw logits in pass 1;
- fit its temperature with `fitTemperatureBinary()` (or `fitTemperature()` for a choice);
- fit its `abstain_below` with `selectiveThreshold()`;
- if a lane policy uses it, refit that policy's threshold: `vetoThreshold()` for a veto signal, or λ with `riskControllingThreshold()` if it enters the act-confidence.

Calibration always runs on the frozen calibration split, through the deployed int8 pipeline, and produces a new calibration artifact with its own id and hash.

## 7. Evaluate it

Add the key to `summarize()` in `eval/evaluate.ts`, with its safe default in `SAFE`, so that the report carries accuracy, coverage, ECE, Brier, AUROC, and risk–coverage for it. Then run `pnpm magicaf:eval` and compare every backend on the same frozen sets. The rules backend answers the new key `unsupported` unless you add a derived answer to `backends/rules.ts`. That is fine: its absence shows up as coverage, not as an error.

## 8. Ship it through the ladder

A new key starts with no authority. It enters in shadow, where its agreement and confidence buckets are counted. It earns a place in a lane policy only through the same [promotion ladder](/docs/reflex/promotion-ladder/) as everything else.

When you are done, four versions have moved independently: the question set (1.1.0), the frozen data (new hashes), the model artifact, and the calibration. The wire schema is still v1.

## Adding a backend instead

If you only need a different engine behind the existing keys, such as a new model family, a server-side scorer, or a heuristic baseline for comparison, you implement `ReflexBackend` and let the shared envelope do the rest:

```typescript
import { runBackend, type ReflexBackend } from '../backend';
import { yesNoAnswer, type BackendInfo, type ReflexAnswer, type ReflexRequest } from '../contract';

export class ClinicalBaselineBackend implements ReflexBackend {
  readonly info: BackendInfo = { id: 'clinical-baseline', version: '0.1.0' };

  constructor(private score: (text: string) => Promise<number>) {}

  supports(key: string): boolean {
    return key === 'clinical';
  }

  answer(request: ReflexRequest) {
    return runBackend(this.info, (k) => this.supports(k), request, async (req) => {
      const out: Record<string, ReflexAnswer> = {};
      for (const q of req.questions) {
        if (q.key === 'clinical' && q.type === 'yes_no') out[q.id] = yesNoAnswer(await this.score(req.state.text));
      }
      return out;
    });
  }
}
```

`runBackend()` validates the request and resolves its question set. It answers every other key `abstain: unsupported`, turns a thrown error into a numeric error code with every answer abstained, and times the call. Build answers only with the helpers in `contract.ts` (`choiceAnswer`, `yesNoAnswer`, `abstained`), so that the shapes cannot drift from the schema. Then add the backend to the contract test (`test/unit/magicaf-reflex-contract.test.ts`), which validates responses under both the zod schema and the JSON Schema.

To compare the new backend with the others, add it to the backend list in the eval runner (`test/unit/magicaf-reflex.eval.test.ts`). The harness then runs it on the same frozen inputs and applies the same two-key safety assertion to it.
