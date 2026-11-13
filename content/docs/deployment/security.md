---
title: "Security"
description: "What MagicAF does and does not do for security — network behavior, secret handling, TLS and FIPS, input and output guards, logging — and a hardening checklist for isolated and regulated environments."
weight: 6
keywords: [security, secure AI, hardening, secure deployment, logging, secret handling, FIPS]
tags: [deployment, security, hardening, logging]
categories: [deployment]
difficulty: intermediate
prerequisites: [/docs/deployment/docker/]
---

MagicAF's security posture rests on one property: **it connects only to the endpoints you configure.** It has no telemetry, no update check, and no license server. What crosses your network boundary is decided by which services you construct and where you point them. This page covers what the framework provides on top of that, and what remains yours.

## What the framework does

| Area | Behavior |
|---|---|
| Network | Every service client takes an explicit `base_url`; there are no built-in defaults to a hosted service for the core clients. Clients that reach hosted APIs — `AnthropicLlmService`, `DeepgramTtsService`, and the search helpers in `magicaf-browser` — are used only if you construct them. |
| Secrets | API keys are `SecretString` values: excluded from `Debug` and from serialization, and exposed only when the request is built. |
| Credentials on the wire | `Authorization: Bearer` for embedding, LLM, rerank, and Kokoro endpoints; Qdrant's `api-key` header; Anthropic's `x-api-key`; Deepgram's `Authorization: Token`. |
| TLS | rustls by default. Each config's `tls` section can require `https://` (`enforce_https`) and add a private CA (`ca_cert_pem`). |
| FIPS | The `fips` feature switches TLS to the system OpenSSL; `assert_fips_mode()` fails unless the host's OpenSSL is in FIPS mode. This uses a validated module if your platform provides one — MagicAF itself is not a validated module. |
| Input guard | `PromptGuard` checks questions against prompt-injection patterns before they reach retrieval or the model, and counts detections. |
| Output guard | `ResponseGuard` caps reply size and can check required structure before parsing. |
| Logs | At `info`, operational metadata — durations, counts, collection names, error codes — not query text, documents, or prompts. `init_logging_with_pii_filter()` adds pattern-based redaction. |
| Audit | Audit events record a SHA-256 hash of the query, never its text. |
| Erasure | `GdprService` deletes an entity's vectors from every collection and emits an audit event. |

Guards are pattern-based defenses. They reduce risk; they do not make a model safe to expose to untrusted input on their own.

## What remains yours

- **Network isolation.** MagicAF will not make calls you did not configure, but only your network can prevent them. Bind services to internal interfaces and restrict egress.
- **Authentication and authorization** for your application's users — see [`magicaf-auth`](/docs/crates/magicaf-auth/), and read its limits before relying on its certificate or LDAP providers.
- **Data classification.** Which documents may be indexed, and which users may retrieve them. Enforce the second with vector-store filters, so excluded passages never reach the model.
- **Encryption at rest** for the vector store, model files, and logs.
- **Retention** of logs, audit events, and anything your application persists.

## Hardening checklist

- [ ] Services bind to internal interfaces (`127.0.0.1`, or a private network), never `0.0.0.0` on a shared host
- [ ] Qdrant and the LLM server require API keys when anything else can reach them
- [ ] `tls.enforce_https = true` for any service reached over a network you do not fully control
- [ ] `RUST_LOG` is `info` or quieter in production; `debug` and `trace` can include content
- [ ] `PromptGuard` and `ResponseGuard` are enabled on workflows that take user input
- [ ] Retrieval filters scope each user to the documents they are allowed to see
- [ ] Model files are checked against SHA-256 hashes after transfer
- [ ] Container images are pinned by version and scanned before deployment
- [ ] Rust dependencies are audited — `cargo audit` and `cargo deny check` — and `Cargo.lock` is committed

## Binding to internal interfaces

```yaml
# deploy/docker/docker-compose.override.yml
services:
  qdrant:
    ports: ["127.0.0.1:6333:6333"]
  embedding:
    ports: ["127.0.0.1:8080:80"]
  llm:
    ports: ["127.0.0.1:8000:8000"]
```

## API keys

Set the key on the service (for Qdrant, `QDRANT_API_KEY` in the compose `.env`) and the same value in the MagicAF config. Load it from the environment or a secrets manager rather than a committed file:

```rust
use magicaf_core::prelude::*;
use secrecy::SecretString;

let mut store_config: VectorStoreConfig = serde_json::from_value(serde_json::json!({
    "base_url": "https://qdrant.internal:6333",
    "tls": { "enforce_https": true }
}))?;
store_config.api_key = std::env::var("QDRANT_API_KEY").ok().map(SecretString::from);
```

This needs `secrecy = "0.8"` in your dependencies. MagicAF does not read environment variables itself; your application decides where secrets come from.

## Supply chain

The MagicAF repository keeps a software bill of materials in `docs/security/SBOM.md`. Pin the MagicAF revision you build against (`rev = "…"` on the git dependency), commit `Cargo.lock`, and vendor dependencies for isolated builds as described in [Air-gapped setup](/docs/deployment/air-gapped/).

---

## Security FAQ

### Does MagicAF phone home?

No. It has no telemetry, update checks, license validation, or analytics, and it connects only to the endpoints you configure. You can confirm this by auditing the source, and by running it on a network with no route out.

### Where are API keys kept?

In memory, as `SecretString` values in the config structs. The framework never writes them to logs, never serializes them, and never persists them. Storing them is up to you.

### What does MagicAF write to logs?

At `info`: operation names and durations, collection names and result counts, error messages and codes, and token counts when the server reports them. Not query text, document content, embedding vectors, prompts, or model replies. At `debug` and `trace`, more operational detail is logged; keep those levels out of production wherever logs could hold sensitive data.

{{< faq question="Is MagicAF HIPAA-compliant?" >}}
MagicAF is a framework, not a service — HIPAA compliance depends on your deployment. MagicAF supports HIPAA-compliant deployments by:

- Running entirely on-premises with no cloud dependencies
- Never persisting request content itself — storage is what you configure
- Logging operational metadata rather than content at `info`, with an optional PII-redacting log writer
- Supporting air-gapped deployment where no data can leave the network

Your deployment must also address access controls, encryption at rest, audit logging, and BAA requirements — these are infrastructure-level concerns outside the framework's scope.
{{< /faq >}}
