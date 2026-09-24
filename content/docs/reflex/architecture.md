---
title: "Architecture"
linkTitle: "Architecture"
description: "Swappable Reflex backends, the shared encoder and heads, the two ONNX graphs and their I/O, text canonicalisation, tokenizer parity, and the hash-verified runtime."
weight: 3
keywords: [MagicAF Reflex architecture, ReflexBackend, bi-encoder, ONNX export, onnxruntime-web, WordPiece tokenizer, text canonicalisation, NFKC, homoglyph folding, int8 quantisation, offscreen document]
tags: [reflex, architecture, onnx, tokenizer, runtime]
categories: [concept]
difficulty: advanced
prerequisites:
  - /docs/reflex/contract/
---

If you have built a MagicAF pipeline, you already know the shape: a narrow trait, several implementations behind it, and the choice between them made in configuration (see [Traits and Interfaces](/docs/core-concepts/traits-and-interfaces/)). MagicAF Reflex follows the same shape. One interface, `ReflexBackend`, sits in front of three implementations that can be swapped or run side by side, and the calibrated model is just one of them.

This page covers the module boundary, the backends, the model, the exact ONNX graphs, and the runtime that loads them. The TypeScript implementation is the reference. The [planned ports](/docs/reflex/other-runtimes/) implement the same pieces in the same order.

## The module boundary

```
src/shared/magicaf/reflex/          pure, runtime-agnostic: no I/O, no engine
├── contract.ts                     types, zod schemas, version constants, answer builders
├── schema/*.schema.json            the cross-language source of truth
├── question-sets.ts + *.json       registry, compatibility, safe defaults
├── text.ts                         magicaf.text/v1 canonicalisation
├── tokenizer.ts                    BERT WordPiece (uncased)
├── backend.ts                      the ReflexBackend interface + shared envelope
├── backends/rules.ts               wraps the approved deterministic decider
├── backends/needle.ts              wraps the earlier generative shadow model
├── backends/local.ts               the calibrated model's post-processing
├── runtime/ort-runner.ts           LocalRunner over onnxruntime-web
├── page-command.ts                 the Reflex lane's adapter and lane policies
├── rungs.ts                        the promotion ladder as configuration
└── eval/{metrics,calibrate,evaluate}.ts
```

Nothing under `src/shared/magicaf/` imports extension code, apart from the two adapters that wrap the lane's existing deciders (`backends/rules.ts` and `backends/needle.ts`). That boundary is what would let the module be extracted into a shared package later.

## Backends

```typescript
export interface ReflexBackend {
  readonly info: BackendInfo;
  /** Question keys this backend answers; everything else → `unsupported`. */
  supports(key: string): boolean;
  answer(request: ReflexRequest): Promise<ReflexResponse>;
}
```

Every backend answers through the same envelope, `runBackend()`. It validates the request, resolves the question set, times the call, converts a thrown engine error into a numeric error with every answer abstained, and answers unsupported keys `abstain: unsupported`. A backend never throws on a well-formed request.

| Backend | What it is | Keys | Probabilities |
|---|---|---|---|
| `rules` | The approved deterministic decider (`decide()`), wrapped so that its decisions are byte-for-byte unchanged. A defer becomes an abstention with `rules_defer:<reason>`. `clinical` and `commit_risk` are *derived* from the rules, not classified. | all five | 0 or 1 |
| `needle` | An earlier small on-device generative tool-caller that the lane already ran in shadow, with its tool calls mapped onto `route`, `intent`, and `section`. A call the engine itself withheld becomes `cloud`, abstained. | `route`, `intent`, `section` | the engine's own score, **not calibrated**: it is reported as-is so that the eval can measure exactly that |
| `magicaf-local` | The calibrated encoder described below. | all five | calibrated |

The rules backend sees the **raw** text, because it must behave exactly like the lane's own `decide()` call. The model backends see the canonical text. That difference is deliberate: when the hand-written adversarial set finds a Unicode trick that fools the rules, it is reported, not quietly patched.

## The model: a shared encoder and small heads

`magicaf-local` is an **encoder classifier**, not a generator. It produces a fixed set of logits, has no decoding loop, and has nothing to hallucinate.

```
  canon(text) ──WordPiece──▶ encoder ──mean pool──▶ r            (1 × D)
  canon("<role>: <label>") ─▶ encoder ──mean pool──▶ l₁ … l_K     (K × D, cached per label string)

  heads(r, L, section_mask):
    intent(r)                        4 logits: open, find, scroll, none
    clinical(r)                      1 logit
    section: sᵢ = MLP([r, lᵢ, r⊙lᵢ, |r−lᵢ|])   one logit per candidate
             none = MLP(r)           + one "none" logit
    route(r, none, max sᵢ, has_any)  1 logit, conditioned on the section evidence
    commit_risk(lᵢ)                  1 logit per label
```

Each head is a two-layer MLP (Linear → GELU → Linear) over the encoder's mean-pooled embedding.

- **The request is encoded once.** Labels are encoded separately and cached by their exact string, because page labels repeat. With the labels warm, a decision needs only one encoder pass, for the request. The TypeScript backend keeps an LRU of 1,024 label embeddings.
- **It is a bi-encoder, not a cross-encoder, for latency.** With about 16 candidates, a cross-encoder would run 16 forward passes per decision. The bi-encoder runs one, and the pair MLP over `[r, lᵢ, r⊙lᵢ, |r−lᵢ|]` recovers most of the interaction.
- **`route` is its own head.** An earlier draft derived `route` from `intent` × `section`, but the labelling policy makes that impossible: "open the MAR?" names a place yet is `cloud`. The route head therefore sees the request embedding plus three pieces of section evidence: the none logit, the best candidate logit, and whether the page offered any candidate at all.
- **`section_mask` is inside the graph.** The label list holds the section candidates first (mask 1), then any extra subjects that are asked only `commit_risk` (mask 0). Masked labels take no section probability and count as no route evidence, but they still get a commit logit. Because this lives inside the ONNX graph, every runtime handles commit-only labels and the no-candidate case identically.
- **Training** sums the cross-entropy losses of the five heads, with `commit_risk` weighted 0.5. A distillation loss is available so that a smaller encoder can learn from a larger teacher.

**The encoder.** Every candidate encoder was a small, openly licensed (Apache-2.0 or MIT) BERT-family model sharing the uncased BERT WordPiece vocabulary of 30,522 tokens. Candidates were compared on the development split and chosen in this order: the safety bound first, then command accuracy, then latency and size. A character n-gram logistic regression was trained as a reference baseline. It never ships; its job is to show whether a transformer earns its place.

**The selected model: {{< stat "reflex_model_name" >}}.** It pairs a compact encoder with the heads above, fine-tuned on the synthetic training data and **distilled** from a larger encoder that was itself fine-tuned on the same data. Development-split accuracy, with the int8 export where one exists:

| Candidate | intent | clinical | route | section | Outcome |
|---|---|---|---|---|---|
| Character n-gram logistic regression (reference) | .890 | .954 | .769 | — | not shipped: it cannot see the page |
| Compact encoder, fine-tuned | .914 | .967 | .914 | .889 | runner-up |
| **Compact encoder, distilled ({{< stat "reflex_model_name" >}})** | **.932** | **.975** | **.921** | **.903** | **selected** |
| Larger encoder, fine-tuned (fp32; the distillation teacher) | .955 | .981 | .922 | .917 | not shipped: about 41 MB packaged, over the 30 MB budget |

The larger encoders score slightly higher, but they cannot fit the package budget, because the onnxruntime-web WebAssembly binary alone is 14.2 MB. So they serve as teachers. Distillation recovers most of the gap. The selected artifact is an 11.3 MB int8 encoder plus 2.4 MB of fp32 heads. On the development split, its int8 graph agrees with fp32 on 98.6–99.7% of argmax answers per head, and its accuracy is within ±0.3 points.

It is **English only**, and `section` is its weakest head on label wordings it has not seen. Its measured calibration is on [Calibration and Abstention](/docs/reflex/calibration-and-abstention/#results), and its evaluation is on [Evaluation Harness](/docs/reflex/evaluation/#results).

## The two ONNX graphs

The exporter writes the model as two graphs (ONNX opset 17). The runner feeds them by these exact names:

| Graph | Inputs | Outputs |
|---|---|---|
| `encoder.onnx` | `input_ids` int64 `[B, T]`, `attention_mask` int64 `[B, T]` | `embeddings` float32 `[B, D]`, mean-pooled inside the graph |
| `heads.onnx` | `request` float32 `[1, D]`, `labels` float32 `[K, D]`, `section_mask` float32 `[K]` | `intent` `[4]`, `clinical` `[1]`, `route` `[1]`, `section` `[K+1]` (the last entry is `none`), `commit` `[K]` |

The encoder ships with **dynamic int8 quantisation**, and the heads stay fp32. The export fails unless two checks pass, and both results are written to an export report:

1. torch versus ONNX fp32, on real development batches: the maximum absolute difference of every head output;
2. the int8 encoder versus the fp32 encoder, on the development split: argmax agreement per head, and the development accuracy of each.

The int8 graph ships only if it holds up. Calibration is then fitted **through the int8 pipeline**, so the probabilities describe the model that actually runs.

A page with no labels still runs `heads.onnx`, with one masked zero label. Zero-size tensors are not portable across ONNX Runtime builds.

Beside the graphs, the artifact carries `vocab.txt`, `model.json` (dimensions, maximum lengths, the label template `"{role}: {label}"`, and the intent order), `calibration.json`, and a `magicaf-reflex-manifest.json` that pins the SHA-256 of every file.

## Text canonicalisation: `magicaf.text/v1`

Every model backend canonicalises the request, and every label, before tokenizing:

1. **NFKC.** Fullwidth letters become ASCII; ligatures, compatibility forms, and non-breaking spaces are normalized.
2. **Drop invisible format characters:** zero-width characters, bidi controls, the soft hyphen, variation selectors, and tag characters. They can split or disguise a word.
3. **Fold Latin look-alikes.** A deliberately small table maps Cyrillic and Greek letters that are visually identical to Latin ones: "ѕign" with a Cyrillic ѕ must *mean* "sign". This is a safety fold, not transliteration.
4. **Collapse whitespace and trim**, using an explicit whitespace class, because JavaScript's `\s` and Python's `\s` disagree on a few control characters.

Case is kept, because the tokenizer lowercases. Training applies the Python port of the same function (`text.py`), and a unit test checks both implementations against one shared fixture file. The model therefore never sees a different string at run time than it saw in training.

## Tokenizer parity

`tokenizer.ts` is a from-scratch BERT WordPiece (uncased) tokenizer that matches Hugging Face's `BertTokenizerFast` with `do_lower_case=True`:

1. **Clean.** Drop NUL, U+FFFD, and control or format characters; map whitespace to a space.
2. **Pad CJK ideographs** with spaces.
3. **Lowercase**, apply NFD, and strip combining marks.
4. **Split** on whitespace and punctuation.
5. **Greedy longest-match WordPiece**, with `##` continuations. A word longer than 100 characters, or one with no match, becomes `[UNK]`.
6. **Wrap** the result as `[CLS] … [SEP]`, truncated to the model's maximum length.

A Python script writes fixtures with the real `transformers` tokenizer, and a unit test requires the TypeScript encodings to match them **exactly**, id for id. The same fixture run also checks that the Python port of `sectionCandidates()` builds the same candidate ids as the TypeScript one, so training and inference see the same candidates.

## The runtime

In the browser extension, inference runs in a dedicated worker spawned by the extension's offscreen document. It exists in internal builds only (see [Privacy and Supply Chain](/docs/reflex/privacy-and-supply-chain/)).

- **Every file is verified before use.** The worker fetches the manifest, then every runtime and model file, all from the extension's own packaged origin. It checks each one's SHA-256 against the pin **before** executing or loading it. A missing pin or a mismatch fails closed with `integrity`.
- **onnxruntime-web (pinned at 1.30.0) on WebAssembly with SIMD.** The worker sets one thread, no proxy worker, and no `blob:` URLs. The runtime script is imported from the same packaged URL whose bytes were just verified, because the extension's content security policy forbids evaluating verified bytes from a `blob:` URL. Sessions run with full graph optimization, and with the CPU memory arena and memory-pattern planning turned off.
- **A failed load does not wedge the worker.** The next request retries the load. After the runtime is instantiated, the worker drops its reference to the WebAssembly binary.
- **Protocol.** `{ id, type: 'magicaf', request }` returns `{ id, ok: true, response, policy }`; `{ id, type: 'magicaf_warm' }` loads the model ahead of time. A failure returns `{ id, ok: false, code }`. The reply also carries the calibration's thresholds (`policy`), so the lane's policies always use the thresholds certified for the loaded model.

**Why threads are off.** Multi-threaded WebAssembly needs `crossOriginIsolated`, which would need cross-origin isolation headers in the extension manifest. That is a change to the extension's security posture, and the design does not make it.

**Why WebGPU is off.** The design does not use it. The budgets are set, and tested end to end, on the single-threaded WebAssembly path.

The same `LocalRunner` interface (`encode()` and `heads()`) is implemented over the Node build of onnxruntime-web for the eval and calibration runners. The numbers the harness reports therefore come from the same WebAssembly runtime the browser runs.
