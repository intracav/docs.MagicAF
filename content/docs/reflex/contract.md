---
title: "The Decision Contract"
description: "magicaf.reflex.request/v1 and response/v1 field by field: question types, dynamic options, abstain reasons, numeric error codes, and versioning."
weight: 1
keywords: [MagicAF Reflex contract, magicaf.reflex.request/v1, magicaf.reflex.response/v1, JSON Schema, typed decisions, abstain, calibrated probabilities, error codes, question set versioning]
tags: [reflex, contract, json-schema, api, versioning]
categories: [reference]
difficulty: intermediate
prerequisites:
  - /docs/reflex/
---

The contract is the part of MagicAF Reflex that outlives any model. A caller builds a request, any backend answers it, and the caller reads the answers without knowing which backend ran. That is how rules, a baseline model, and the calibrated model can run side by side on identical inputs.

Two JSON Schemas (draft 2020-12) are the **cross-language source of truth**. The TypeScript implementation validates with zod, and a unit test runs both validators over the same accepted and rejected documents to prove they agree. The planned Dart and Rust ports implement the same schemas (see [Other Runtimes](/docs/reflex/other-runtimes/)). Both schemas are reproduced in full [at the end of this page](#the-json-schemas).

## Request

A real request, as the Reflex lane builds it, trimmed to one candidate section:

```json
{
  "schema": "magicaf.reflex.request/v1",
  "question_set": "reflex.page_command@1.0.0",
  "state": {
    "text": "open the MAR",
    "page": { "sections": [ { "id": "e4", "role": "tab", "label": "MAR" } ] }
  },
  "questions": [
    { "id": "route",    "key": "route",    "type": "choice",
      "options": [ { "id": "local_command" }, { "id": "cloud" } ] },
    { "id": "intent",   "key": "intent",   "type": "choice",
      "options": [ { "id": "open" }, { "id": "find" }, { "id": "scroll" }, { "id": "none" } ] },
    { "id": "section",  "key": "section",  "type": "choice",
      "options": [ { "id": "e4", "label": "MAR", "role": "tab" } ], "allow_none": true },
    { "id": "clinical", "key": "clinical", "type": "yes_no" },
    { "id": "commit:e4", "key": "commit_risk", "type": "yes_no",
      "subject": { "label": "MAR", "role": "tab" } }
  ],
  "budget_ms": 150
}
```

### Top level

| Field | Type | Required | Meaning |
|---|---|---|---|
| `schema` | const `"magicaf.reflex.request/v1"` | yes | Wire-schema version. |
| `question_set` | string, `id@MAJOR.MINOR.PATCH` | yes | The question set the keys belong to, e.g. `reflex.page_command@1.0.0`. The id matches `^[a-z][a-z0-9_.]*`. |
| `state` | object | yes | The one thing every question is about. |
| `questions` | array, 1–300 | yes | The questions to answer. |
| `budget_ms` | integer, 1–60000 | no | The caller's time budget. The backend does not enforce it: the caller races the answer against its own timer, and a late answer counts as unavailable. |

No other top-level fields are allowed.

### `state`

| Field | Type | Meaning |
|---|---|---|
| `text` | string, ≤ 2,000 chars, required | The user's request, raw. Model backends canonicalise it with [`magicaf.text/v1`](/docs/reflex/architecture/#text-canonicalisation-magicaftextv1) before use; the rules backend deliberately sees it unchanged. |
| `fields` | object of flat scalars | String (≤ 400 chars), number, or boolean values, reserved for question sets that need structured facts. `reflex.page_command` does not use them. |
| `page.sections` | array, ≤ 400 | Page facts: `{ id, role, label }`, with `id` ≤ 128 chars, `role` ≤ 40, `label` ≤ 400. |

### Questions

Every question has an `id`, a `key`, and a `type`:

- `id` (1–128 chars) is **unique within the request**. It is the key the answer comes back under.
- `key` (1–64 chars) names the question in the question set. The same key can be asked several times in one request. The Reflex lane asks `commit_risk` once per candidate control, with ids `commit:<candidate id>`.
- `subject` (optional: `label`, `role`, `text`, each bounded) says what a per-item question is about, such as the control whose click risk is being asked.

The `type` decides the rest of the shape:

| Type | Extra fields | Answer |
|---|---|---|
| `choice` | `options`: array of `{ id, label?, role? }`, ≤ 255; optional `allow_none` | one option id |
| `yes_no` | none | a probability of yes |
| `score` | `levels`: 2–16 strings | a level. Reserved: no `reflex.page_command` key uses it. |

**Fixed and dynamic options.** For a key with fixed options, such as `route`, the options must be exactly the set the question set defines. A **dynamic** key, such as `section`, takes its candidates from the caller, because every page has different sections.

**The reserved `none`.** `allow_none: true` adds an implicit option `"none"`, meaning none of the candidates. When `allow_none` is set, no option may use the id `none`. A `choice` question with an empty `options` array must set `allow_none`, so the question always has at least one answer.

Four semantic rules cannot be written in JSON Schema. The schema lists them under `x-semantic-rules`, and the TypeScript validator enforces them:

1. question ids are unique within a request;
2. option ids are unique within a question;
3. with `allow_none`, no option uses the id `none`;
4. a `choice` with no options must set `allow_none`.

A port must enforce all four as well.

## Response

A `magicaf-local` response to the request above. **The probabilities are illustrative**, not output from a selected model:

```json
{
  "schema": "magicaf.reflex.response/v1",
  "question_set": "reflex.page_command@1.0.0",
  "backend": {
    "id": "magicaf-local",
    "model": "magicaf-reflex-<encoder>",
    "version": "0.1.0",
    "artifact_sha256": "<64 hex chars: sha256 of encoder.onnx>",
    "calibration": "cal-magicaf-reflex-<encoder>-0.1.0-<date>-<sha8>"
  },
  "answers": {
    "route":     { "type": "choice", "choice": "local_command",
                   "probabilities": { "local_command": 0.97, "cloud": 0.03 },
                   "confidence": 0.97, "abstain": false },
    "intent":    { "type": "choice", "choice": "open",
                   "probabilities": { "open": 0.98, "find": 0.01, "scroll": 0.0, "none": 0.01 },
                   "confidence": 0.98, "abstain": false },
    "section":   { "type": "choice", "choice": "e4",
                   "probabilities": { "e4": 0.98, "none": 0.02 },
                   "confidence": 0.98, "abstain": false },
    "clinical":  { "type": "yes_no", "p_yes": 0.02, "answer": "no",
                   "confidence": 0.98, "abstain": false },
    "commit:e4": { "type": "yes_no", "p_yes": 0.01, "answer": "no",
                   "confidence": 0.99, "abstain": false }
  },
  "latency_ms": 11.8
}
```

### Top level

| Field | Type | Meaning |
|---|---|---|
| `schema` | const `"magicaf.reflex.response/v1"` | Wire-schema version. |
| `question_set` | string | Echoed from the request. |
| `backend.id` | string, required | `rules`, `needle`, or `magicaf-local` today. |
| `backend.model`, `backend.version` | strings | The model artifact. |
| `backend.artifact_sha256` | 64 lowercase hex | The pinned SHA-256 of the model that answered. `magicaf-local` reports its encoder graph's hash. |
| `backend.calibration` | string | The calibration artifact id (see [versioning](#four-things-are-versioned-independently)). |
| `answers` | object keyed by question id | One answer for **every** question in the request. |
| `latency_ms` | number ≥ 0 | Time spent inside the backend. |
| `error` | `{ code, name }`, optional | Present when the call failed as a whole. |

### Answers

Every question in the request gets an answer, and the answer's `type` matches the question's `type`. Every answer has `abstain` and, when it abstains, an `abstain_reason`.

| Type | Fields |
|---|---|
| `choice` | `choice` (the argmax option id), `probabilities` (option id → p, summing to 1), `confidence` (the probability of `choice`) |
| `yes_no` | `p_yes`, `answer` (`"yes"` when `p_yes ≥ 0.5`, else `"no"`), `confidence` (`max(p_yes, 1 − p_yes)`) |
| `score` | `score`, `distribution` (level → p), `confidence` |

When a backend has nothing to say, these fields are `null` rather than absent: `choice`, `probabilities`, and `confidence` for a choice; `p_yes`, `answer`, and `confidence` for a yes/no. Every probability is in [0, 1].

**Probabilities are calibrated** for the `magicaf-local` backend: they are fitted on a held-out split so that they can be thresholded (see [Calibration and Abstention](/docs/reflex/calibration-and-abstention/)). The `rules` backend returns 0/1. The `needle` baseline returns an uncalibrated engine score, reported as-is precisely so that its calibration can be measured.

### Abstaining

`abstain: true` means **do not act on this answer; use the question's safe default**. The safe defaults live in the [question set](/docs/reflex/question-sets/), and every one of them points toward the careful path: `route` falls back to `cloud`, `clinical` to yes.

| `abstain_reason` | When |
|---|---|
| `below_threshold` | The calibrated confidence is under that question's certified threshold. The probabilities are still present. |
| `unsupported` | This backend does not answer this key. Asking an old backend a new key is not an error. |
| `rules_defer:<reason>` | The rules backend deferred, for example `rules_defer:reasoning`. The reason matches `[a-z_]+`. |
| `timeout` | The whole call timed out. |
| `error` | The whole call failed, or the backend returned no answer for a key it claims to support. |
| `invalid_input` | Defined in the schema for input a backend cannot answer. No current backend emits it. |

A `below_threshold` answer still carries its probabilities, and a consumer with its own certified policy may read them. The Reflex lane does exactly that, for reasons explained in [Why lane policies ignore the abstain flag](/docs/reflex/calibration-and-abstention/#why-lane-policies-ignore-the-abstain-flag).

### Errors

A backend never throws on a well-formed request. A failure comes back as a response with an `error` and every answer abstained, so the consumer's safe defaults always apply. The codes are flat and numeric, in the same spirit as [`MagicError::error_code()`](/docs/api-reference/core/errors/) in `magicaf-core`, so they cross an FFI boundary unchanged. They are their own code space, carried in the response, not `MagicError` variants.

| Code | Name | Meaning | Answers |
|---|---|---|---|
| 1001 | `invalid_request` | The request failed validation. | `{}`: nothing in an invalid request is trusted, including its question ids |
| 1002 | `unknown_question_set` | No known set matches `question_set` (see [compatibility](/docs/reflex/question-sets/#versioning-and-compatibility)). | all abstained, reason `error` |
| 1003 | `unknown_key` | Reserved. Unknown keys are answered `abstain: unsupported` instead, so no backend emits it. | — |
| 2001 | `model_unavailable` | A model file or the runtime is missing, or failed to load. | all abstained, reason `error` |
| 2002 | `integrity` | A runtime or model file failed its SHA-256 check. | all abstained, reason `error` |
| 2003 | `timeout` | The engine timed out. | all abstained, reason `timeout` |
| 2004 | `backend_error` | Any other failure inside the backend. | all abstained, reason `error` |

The shared envelope that every backend runs through (`runBackend` in `backend.ts`) does the work: it validates the request, resolves the question set, times the call, turns an engine exception into the mapped error, and replaces answers to unsupported keys with `abstain: unsupported`.

## Four things are versioned independently

| Thing | Identifier | Changes when |
|---|---|---|
| Wire schema | `magicaf.reflex.request/vN`, `magicaf.reflex.response/vN` | A field changes incompatibly. That is a v2. |
| Question set | `reflex.page_command@MAJOR.MINOR.PATCH` | A new key is a minor bump. A new option, or a changed meaning of an existing key, is a major bump. |
| Model artifact | `magicaf-reflex-<encoder>-<semver>`, plus the SHA-256 of every file | The model is retrained. |
| Calibration | `cal-<model>-<version>-<date>-<sha8>`, plus its SHA-256 | The calibration is refitted on a calibration split. |

Keeping them apart is what lets each one move alone. New questions ship as a question-set change with no wire change. A retrained model needs a new calibration, but no new schema. Every [eval report](/docs/reflex/evaluation/#the-report) records all four, plus the hashes of the datasets it ran on, so any number can be traced to exactly what produced it.

## The JSON Schemas

These are reproduced verbatim from the implementation (`src/shared/magicaf/reflex/schema/`). The `$id` values are identifiers, not download locations.

<details>
<summary><code>request.v1.schema.json</code></summary>

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://intracav.ai/schemas/magicaf.reflex.request/v1",
  "title": "MagicAF Reflex request v1",
  "type": "object",
  "additionalProperties": false,
  "required": ["schema", "question_set", "state", "questions"],
  "properties": {
    "schema": { "const": "magicaf.reflex.request/v1" },
    "question_set": { "type": "string", "pattern": "^[a-z][a-z0-9_.]*@\\d+\\.\\d+\\.\\d+$" },
    "state": {
      "type": "object",
      "additionalProperties": false,
      "required": ["text"],
      "properties": {
        "text": { "type": "string", "maxLength": 2000 },
        "fields": {
          "type": "object",
          "additionalProperties": { "anyOf": [{ "type": "string", "maxLength": 400 }, { "type": "number" }, { "type": "boolean" }] }
        },
        "page": {
          "type": "object",
          "additionalProperties": false,
          "required": ["sections"],
          "properties": { "sections": { "type": "array", "maxItems": 400, "items": { "$ref": "#/$defs/section" } } }
        }
      }
    },
    "questions": { "type": "array", "minItems": 1, "maxItems": 300, "items": { "$ref": "#/$defs/question" } },
    "budget_ms": { "type": "integer", "exclusiveMinimum": 0, "maximum": 60000 }
  },
  "$defs": {
    "id": { "type": "string", "minLength": 1, "maxLength": 128 },
    "section": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "role", "label"],
      "properties": {
        "id": { "$ref": "#/$defs/id" },
        "role": { "type": "string", "maxLength": 40 },
        "label": { "type": "string", "maxLength": 400 }
      }
    },
    "option": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id"],
      "properties": {
        "id": { "$ref": "#/$defs/id" },
        "label": { "type": "string", "maxLength": 400 },
        "role": { "type": "string", "maxLength": 40 }
      }
    },
    "subject": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "label": { "type": "string", "maxLength": 400 },
        "role": { "type": "string", "maxLength": 40 },
        "text": { "type": "string", "maxLength": 400 }
      }
    },
    "question": {
      "type": "object",
      "required": ["id", "key", "type"],
      "properties": {
        "id": { "$ref": "#/$defs/id" },
        "key": { "type": "string", "minLength": 1, "maxLength": 64 },
        "type": { "enum": ["choice", "yes_no", "score"] },
        "subject": { "$ref": "#/$defs/subject" }
      },
      "oneOf": [
        {
          "additionalProperties": false,
          "required": ["options"],
          "properties": {
            "id": true, "key": true, "subject": true,
            "type": { "const": "choice" },
            "options": { "type": "array", "maxItems": 255, "items": { "$ref": "#/$defs/option" } },
            "allow_none": { "type": "boolean" }
          }
        },
        {
          "additionalProperties": false,
          "properties": { "id": true, "key": true, "subject": true, "type": { "const": "yes_no" } }
        },
        {
          "additionalProperties": false,
          "required": ["levels"],
          "properties": {
            "id": true, "key": true, "subject": true,
            "type": { "const": "score" },
            "levels": { "type": "array", "minItems": 2, "maxItems": 16, "items": { "type": "string", "minLength": 1, "maxLength": 64 } }
          }
        }
      ]
    }
  },
  "x-semantic-rules": [
    "question ids are unique within a request",
    "choice option ids are unique within a question",
    "when allow_none is true, no option may use the reserved id \"none\"",
    "a choice question with no options must set allow_none"
  ]
}
```

</details>

<details>
<summary><code>response.v1.schema.json</code></summary>

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://intracav.ai/schemas/magicaf.reflex.response/v1",
  "title": "MagicAF Reflex response v1",
  "type": "object",
  "additionalProperties": false,
  "required": ["schema", "question_set", "backend", "answers", "latency_ms"],
  "properties": {
    "schema": { "const": "magicaf.reflex.response/v1" },
    "question_set": { "type": "string" },
    "backend": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id"],
      "properties": {
        "id": { "type": "string", "minLength": 1, "maxLength": 64 },
        "model": { "type": "string", "maxLength": 128 },
        "version": { "type": "string", "maxLength": 64 },
        "artifact_sha256": { "type": "string", "pattern": "^[0-9a-f]{64}$" },
        "calibration": { "type": "string", "maxLength": 128 }
      }
    },
    "answers": { "type": "object", "additionalProperties": { "$ref": "#/$defs/answer" } },
    "latency_ms": { "type": "number", "minimum": 0 },
    "error": {
      "type": "object",
      "additionalProperties": false,
      "required": ["code", "name"],
      "properties": {
        "code": { "type": "integer" },
        "name": { "enum": ["invalid_request", "unknown_question_set", "unknown_key", "model_unavailable", "integrity", "timeout", "backend_error"] }
      }
    }
  },
  "$defs": {
    "p": { "type": "number", "minimum": 0, "maximum": 1 },
    "pOrNull": { "anyOf": [{ "$ref": "#/$defs/p" }, { "type": "null" }] },
    "abstainReason": {
      "anyOf": [
        { "enum": ["below_threshold", "unsupported", "timeout", "error", "invalid_input"] },
        { "type": "string", "pattern": "^rules_defer:[a-z_]+$" }
      ]
    },
    "answer": {
      "type": "object",
      "required": ["type", "abstain"],
      "properties": { "type": { "enum": ["choice", "yes_no", "score"] } },
      "oneOf": [
        {
          "additionalProperties": false,
          "required": ["choice", "probabilities", "confidence"],
          "properties": {
            "type": { "const": "choice" },
            "choice": { "type": ["string", "null"] },
            "probabilities": { "anyOf": [{ "type": "object", "additionalProperties": { "$ref": "#/$defs/p" } }, { "type": "null" }] },
            "confidence": { "$ref": "#/$defs/pOrNull" },
            "abstain": { "type": "boolean" },
            "abstain_reason": { "$ref": "#/$defs/abstainReason" }
          }
        },
        {
          "additionalProperties": false,
          "required": ["p_yes", "answer", "confidence"],
          "properties": {
            "type": { "const": "yes_no" },
            "p_yes": { "$ref": "#/$defs/pOrNull" },
            "answer": { "enum": ["yes", "no", null] },
            "confidence": { "$ref": "#/$defs/pOrNull" },
            "abstain": { "type": "boolean" },
            "abstain_reason": { "$ref": "#/$defs/abstainReason" }
          }
        },
        {
          "additionalProperties": false,
          "required": ["score", "distribution", "confidence"],
          "properties": {
            "type": { "const": "score" },
            "score": { "type": ["number", "null"] },
            "distribution": { "anyOf": [{ "type": "object", "additionalProperties": { "$ref": "#/$defs/p" } }, { "type": "null" }] },
            "confidence": { "$ref": "#/$defs/pOrNull" },
            "abstain": { "type": "boolean" },
            "abstain_reason": { "$ref": "#/$defs/abstainReason" }
          }
        }
      ]
    }
  }
}
```

</details>
