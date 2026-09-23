---
title: "Question Sets"
description: "reflex.page_command@1.0.0 key by key: route, intent, section, clinical, commit_risk, with meanings, safe defaults, semver rules, and planned sets."
weight: 2
keywords: [MagicAF Reflex question set, reflex.page_command, safe default, semver, question keys, route intent section clinical commit_risk, dynamic options]
tags: [reflex, question-sets, versioning, safety]
categories: [reference]
difficulty: intermediate
prerequisites:
  - /docs/reflex/contract/
---

A **question set** is data, not code. It is a JSON file that names each question a backend can be asked, fixes the question's type and options, and gives it a **safe default**: the answer a consumer uses when the backend abstains. Backends are trained for the keys of a set. There is no free-text question, so a new question is a new key in a new version of a set.

Question sets live beside the contract, in `src/shared/magicaf/reflex/question-sets/*.json`, and are loaded by a small registry (`question-sets.ts`). Today there is one set.

## `reflex.page_command@1.0.0`

The Reflex lane's set. It answers one question: *is this request an on-device page command on this page, and is it safe to run locally?* It has {{< stat "reflex_page_command_keys" >}} keys.

| Key | Type | Options | Safe default |
|---|---|---|---|
| `route` | `choice` | `local_command`, `cloud` | `cloud` |
| `intent` | `choice` | `open`, `find`, `scroll`, `none` | `none` |
| `section` | `choice`, dynamic, `allow_none` | the page's candidates + `none` | `none` |
| `clinical` | `yes_no` | — | `yes` |
| `commit_risk` | `yes_no`, per subject (`label`, `role`) | — | `yes` |

Every safe default fails toward the cloud: it never acts, never treats a request as non-clinical, and never treats a control as safe to click. A unit test asserts this for every key.

### `route`

*Can this request be fully handled as an on-device page command (open a place, find a term, scroll) on this page?* Anything else, or anything uncertain, is `cloud`.

The labelling policy is strict. A request is `local_command` only if it is one of these:

- an `open` whose place exists **exactly once** on the page and is not a commit or utility control;
- a `find` with a target you can name;
- a `scroll`.

Everything with extra clinical content, a negation, a question mark (except a plain "where is X?"), or an ambiguous or absent target is `cloud`. So "open the MAR?" is `cloud` even though it names a place, and "find it" is `cloud` even though its intent is `find`. That is why `route` has its own head in the model instead of being derived from `intent` and `section` (see [Architecture](/docs/reflex/architecture/#the-model-a-shared-encoder-and-small-heads)).

### `intent`

*Which page command is this, if any?*

| Option | Meaning |
|---|---|
| `open` | Navigate to a named chart place. |
| `find` | Locate or highlight a named term or value. |
| `scroll` | Move the page. |
| `none` | Everything else: questions, clinical instructions, commit actions, chat. |

### `section`

*Which on-page place does an `open` request name?* The caller supplies the candidates. The answer is `none` when the request names no candidate, names more than one, or is not an `open` at all.

The Reflex lane builds candidates with `sectionCandidates()` (in `page-command.ts`):

- It keeps navigable roles only: `tab`, `treeitem`, `menuitem`, `link`, `button`, ranked in that order.
- It keeps **one entry per place**. Count badges ("Results (3)") and trailing role words ("Results Review tab") do not create a second place, and when a tab and a link share a label, the best-ranked role wins.
- When several entries tie at the best role, it keeps all of them, because that is real ambiguity.
- It preserves page order and caps the list at 64 candidates.

Buttons stay in the list on purpose. The model has to learn that "Sign Orders" is not a place, and `commit_risk` checks the pick independently. Filtering buttons out would hide exactly the cases the model must get right.

### `clinical`

*Is this a clinical question or instruction?* That covers interpretation, reasoning, dosing, ordering, medication actions, documentation, and signing or attestation. Navigating to a place with a clinical name is not clinical: "open orders" is a navigation request.

### `commit_risk`

*Does clicking this control commit, sign, attest, administer, order, send, delete, or otherwise change clinical or legal state?* It is asked once per control, with the control in `subject`.

- **Yes:** sign, attest, and cosign; order, place, and pend; administer, given, held, and refused; discontinue, stop, and hold; submit, save, send, and transmit; verify, release, approve, acknowledge, reconcile, and complete; delete, void, and cancel.
- **No:** navigation, and utilities such as refresh, print preview, filter, help, close, and expand.

`commit_risk` does not replace the lane's deterministic hard-block. The hard-block still runs on every click. The key gives the model a second, independent way to recognize a dangerous target (see [The Promotion Ladder](/docs/reflex/promotion-ladder/)).

### The set file

The full file, as committed:

```json
{
  "id": "reflex.page_command",
  "version": "1.0.0",
  "description": "Reflex lane (browser extension): is this request an on-device page command on THIS page, and is it safe to run locally?",
  "keys": {
    "route": {
      "type": "choice",
      "options": ["local_command", "cloud"],
      "safe_default": "cloud",
      "description": "Can this request be fully handled as an on-device page command (open a place, find a term, scroll) on this page? Anything else, or anything uncertain, is cloud."
    },
    "intent": {
      "type": "choice",
      "options": ["open", "find", "scroll", "none"],
      "safe_default": "none",
      "description": "Which page command the request is, if any. Questions, clinical instructions, commit actions and chat are none."
    },
    "section": {
      "type": "choice",
      "dynamic": true,
      "allow_none": true,
      "safe_default": "none",
      "description": "Which on-page place (candidate supplied by the caller) an open request names; none when it names no candidate, more than one, or is not an open."
    },
    "clinical": {
      "type": "yes_no",
      "safe_default": "yes",
      "description": "Is this a clinical question or instruction (interpretation, reasoning, dosing, ordering, medication actions, documentation, signing)? Navigating to a place with a clinical name is not."
    },
    "commit_risk": {
      "type": "yes_no",
      "subject": ["label", "role"],
      "safe_default": "yes",
      "description": "Does clicking this control commit, sign, attest, administer, order, send, delete or otherwise change clinical or legal state?"
    }
  }
}
```

## Versioning and compatibility

Question sets use semantic versioning with one rule per kind of change:

| Change | Bump |
|---|---|
| A new key | minor |
| A new option on an existing key | **major** |
| A changed meaning of an existing key | **major** |

A request names its set as `id@MAJOR.MINOR.PATCH`. The registry resolves it to a set with the **same id and the same major version, whose minor is at least the one requested**. A newer minor only adds keys, so it can answer an older request. Anything else is refused with `unknown_question_set` (1002).

An unknown key within a known set is not an error: the backend answers it `abstain: unsupported`. A consumer can therefore ask a new key of an old backend and get the safe default back.

A **known** key asked with the wrong type or the wrong fixed options is a caller bug. `checkConformance()` reports it, and the unit tests run it over the lane's own request.

## Planned sets

{{< callout type="info" title="Design only" >}}
None of these sets exists. They are in the design so that the contract is shaped to carry them without a wire change: each one is a new question set, not a new field.
{{< /callout >}}

| Set | Type | Question |
|---|---|---|
| `lumen.route@1` | `choice` of `small`, `frontier` | Which model tier should the cloud agent use for this request? |
| `lumen.tool_risk@1` | `yes_no`, per proposed tool call | Is this cloud tool call risky? |
| `lumen.needs_page@1` | `yes_no` | Does answering need page context? |

The first two are the reason for the server-side design in [Other Runtimes](/docs/reflex/other-runtimes/#lumen_server-rust).
