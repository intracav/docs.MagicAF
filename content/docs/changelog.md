---
title: "Changelog"
description: "What changed in MagicAF, month by month — new crates, new capabilities, and fixes that change behavior."
weight: 50
keywords: [MagicAF changelog, release notes, MagicAF updates]
---

Every crate is at version `0.1.0`; MagicAF has not cut a tagged release yet. Entries are dated by when the change reached the `main` branch. Pin a commit (`rev = "…"`) on your git dependency to control when you take these changes.

Entries marked **Behavior change** can change the results of code that already works. Read them before you move your pin.

## November 2026

**Security and correctness** *(Nov 13)*

- **Behavior change** — [`magicaf-auth`](/docs/crates/magicaf-auth/): `JwtProvider::new` fails unless a static secret or public key matches the configured algorithms (previously it accepted the config and rejected every token). `LdapProvider` escapes the username in its search filter, refuses empty credentials and ambiguous matches, and now applies `starttls` and `timeout_secs`. `PkiProvider` rejects `DirectTls` mode and CA, CRL, and OCSP settings, since validation belongs at the proxy.
- **Behavior change** — [`magicaf-server`](/docs/crates/magicaf-server/): fails closed when the configured auth provider is not compiled in, when a config file cannot be loaded outside development, and when `air_gap_mode` is set with a hosted LLM provider or a public service URL. Tool tiers come from the server's user record, not the request; chat and MCP tool calls are rate-limited per tier. `MAGICAF_ENCRYPTION_KEY` is accepted alongside `MAGICAF__ENCRYPTION_KEY`.
- The `document_qa` and `intelligence_analysis` examples index a small corpus before querying.
- `deploy/docker/Dockerfile.app` builds the current workspace on Rust 1.91; `magicaf-mobile/build.sh` builds without the `guard` feature and runs on macOS's bash.

**New crates**

- [`magicaf-routing`](/docs/crates/magicaf-routing/) — deterministic model routing, loop escalation, tool-risk classification and execution planning, and the `magicaf.turn_trace/v1` record. *(Nov 11)*
- [`magicaf-knowledge`](/docs/crates/magicaf-knowledge/) — markdown-vault primitives: note parsing, link and entity resolution, typed relations, provenance, an AI-autonomy policy, and graph analytics. *(Nov 3–7)*
- [`magicaf-research`](/docs/crates/magicaf-research/) — the analysis-method registry with R code generation, design review, interpretation guards, and install profiles; 50 methods. *(Nov 2–3)*

**Added**

- Stream timing: `chat_stream_timed` returns time to first byte and first token, total duration, and usage, and records `llm_stream_*` metrics. *(Nov 11)*
- [`magicaf-ui`](/docs/crates/magicaf-ui/): `ultrasound_view` component and `ultrasound` artifact type *(Nov 7)*; `figure` for inline document figures *(Nov 1)*.

**Fixed**

- **Behavior change** — `CachedEmbeddingService::embed_single` now calls the inner service's `embed_single` and caches it separately from batch embeddings, so services that embed queries and passages differently are no longer mixed up. *(Nov 11)*
- `pdf-extract` 0.12 and TLS dependency updates. *(Nov 2)*

## October 2026

**New crates**

- [`magicaf-reflex-onnx`](/docs/crates/magicaf-reflex-onnx/) — the Reflex v2 runtime: Reflex Core artifacts as a `DecisionService`, the Reflex_01 port, a flat C ABI, and the `reflex-serve` HTTP server. *(Oct 26–28)*

**Added**

- `magicaf-core::decision`: the decision gateway and policy, the v2 wire contract (revision 2), `magicaf.state/v1` canonicalization, and calibration helpers. *(Oct 24–26)*
- `magicaf-ui`: `agent_board`, `agent_deliverable`, `questionnaire`, `email_draft`, `vascular_access_view`, and the `chart`, `dashboard`, and `metrics` chart types. *(Oct 5–25)*
- Deepgram text-to-speech streams its response body and serves raw PCM. *(Oct 12)*
- [`magicaf-reflex`](/docs/crates/magicaf-reflex/) — the on-device Reflex v2 scorer, merged to `main`. *(Oct 5)*

**Fixed**

- **Behavior change** — keyed Reflex questions are asked with the instructions and option order the model was trained on; a request with a different option set for a fixed key now abstains as invalid input. *(Oct 28)*
- **Behavior change** — score answers carry probabilities as an object keyed by level id. *(Oct 26)*

## September 2026

**Added**

- `magicaf-core::decision`: the `DecisionService` trait, `reflex.decision_record/v1`, and cited evidence verified against its source. *(Sep 26)*
- `magicaf-ui`: `app_link` and `app_tour` in a new `interactive` category, and `roster`. *(Sep 28–30)*

**Fixed**

- [`magicaf-document`](/docs/crates/magicaf-document/): chunk offsets were wrong. *(Sep 10)*
- `cargo doc` builds with warnings denied across the workspace. *(Sep 14)*

## August 2026

**New crates**

- [`magicaf-agent`](/docs/crates/magicaf-agent/), [`magicaf-mcp`](/docs/crates/magicaf-mcp/), and [`magicaf-tools-code`](/docs/crates/magicaf-tools-code/) — the agent loop, the MCP client, and filesystem, search, and shell tools. *(Aug 18)*

**Added**

- `magicaf-ui`: `anatomy_view` and `organ_view`. *(Aug 5–11)*

**Fixed**

- **Behavior change** — vector-store scoping fails closed. `InMemoryVectorStore` now evaluates `must`, `must_not`, `should`, and nested filters, and a filter shape it does not understand matches nothing instead of everything. `QdrantVectorStore` validates collection names on every call. `VectorStore::search_scoped` was added for searches that must carry a filter. *(Aug 15)*
- Tool-calling wire fixes: provider-specific `max_tokens`, merged tool results, and no silent empty calls. *(Aug 7)*

## July 2026

**Added**

- Structured output: `ResponseFormat` (JSON object or JSON Schema) and `chat_json`, across providers. *(Jul 5)*
- Inline images on chat messages, for vision-capable models. *(Jul 24)*
- `magicaf-document`: the shared contextual chunker. *(Jul 2)*
- `magicaf-ui`: `spreadsheet`, `slide_deck`, and `document_view`. *(Jul 15–16)*

**Fixed**

- Provider-correct wire shapes for extended thinking. *(Jul 20)*

## June 2026

**Added**

- Prompt caching, provider fallback, and interleaved thinking for LLM clients. *(Jun 11)*
- Pseudonymization of chat text sent to external LLM providers, and field-level encryption of stored chat messages and titles ([`magicaf-db`](/docs/crates/magicaf-db/), [`magicaf-server`](/docs/crates/magicaf-server/)). *(Jun 12–17)*
- `magicaf-ui` became the canonical component and artifact registry shared with the Lumen app. *(Jun 13)*

**Fixed**

- GDPR erasure no longer probes with a fixed-size zero vector, which failed on real collections. *(Jun 22)*
- Token budgets release their reservation when a call fails before reporting usage. *(Jun 12)*

## May 2026

**New crates**

- [`magicaf-fetch`](/docs/crates/magicaf-fetch/), [`magicaf-document`](/docs/crates/magicaf-document/), and [`magicaf-browser`](/docs/crates/magicaf-browser/) — web fetching and extraction, document understanding, and headless rendering. *(May 19)*

**Added**

- The `TtsService` trait, with `KokoroTtsService` for local synthesis and `DeepgramTtsService`. *(May 21–28)*

## February – April 2026

- The foundation: [`magicaf-core`](/docs/crates/magicaf-core/), [`magicaf-qdrant`](/docs/crates/magicaf-qdrant/), [`magicaf-local-llm`](/docs/crates/magicaf-local-llm/), and [`magicaf-nlp`](/docs/crates/magicaf-nlp/) *(February)*; [`magicaf-mobile`](/docs/crates/magicaf-mobile/) *(February)*; [`magicaf-auth`](/docs/crates/magicaf-auth/), [`magicaf-db`](/docs/crates/magicaf-db/), [`magicaf-tools`](/docs/crates/magicaf-tools/), [`magicaf-ui`](/docs/crates/magicaf-ui/), and [`magicaf-server`](/docs/crates/magicaf-server/) *(March 29)*; [`magicaf-asr-onnx`](/docs/crates/magicaf-asr-onnx/) *(May 2)*.
