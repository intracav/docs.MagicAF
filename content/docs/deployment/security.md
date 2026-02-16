---
title: "Security"
description: "Defense-grade security architecture, HIPAA compliance, and hardening guidance for secure AI deployments. Complete security checklist for classified, healthcare, and regulated environments."
weight: 6
keywords: [security, defense-grade, HIPAA-compliant, secure AI, classified security, healthcare security, compliance, hardening, secure deployment]
tags: [deployment, security, hardening, logging, compliance, hipaa]
categories: [deployment]
difficulty: intermediate
prerequisites: [/docs/deployment/docker/]
estimated_reading_time: "6 min"
last_reviewed: "2026-02-12"
---

MagicAF is designed with security as a first principle — a core tenet of every Intracav framework. All services run locally, no data leaves the network boundary, and the framework makes no assumptions about data sensitivity. Learn more about MagicAF's [defense-grade architecture and compliance features](/about/).

## Security Architecture

- **No outbound network** — every service endpoint is configurable and defaults to `localhost`
- **No secrets in structs** — API keys are `Option<String>` and never serialized to logs
- **No PII/PHI handling** — the framework never inspects payload content; data classification is the application's responsibility
- **Domain-neutral** — adapters control what data enters the pipeline and what leaves it

## Hardening Checklist

- [ ] All service endpoints bind to internal interfaces only (`127.0.0.1` or VPC, not `0.0.0.0`)
- [ ] API keys configured for Qdrant and LLM if exposed on a shared network
- [ ] TLS termination at load balancer or reverse proxy
- [ ] Log output does not contain raw payloads (configure log level accordingly)
- [ ] Model files are integrity-checked (SHA-256) after transfer to air-gapped hosts
- [ ] Vector store access is restricted to authorized application instances
- [ ] Docker images are scanned for vulnerabilities before deployment
- [ ] Rust dependencies are audited (`cargo audit`)

## Network Security

### Bind to Internal Interfaces

```yaml
# docker-compose.yml — bind to localhost only
services:
  qdrant:
    ports:
      - "127.0.0.1:6333:6333"
  llm:
    ports:
      - "127.0.0.1:8000:8000"
```

### API Key Configuration

```bash
# Set API keys for services on shared networks
export QDRANT_API_KEY="your-secret-key"
export LLM_API_KEY="your-secret-key"
```

MagicAF passes these keys in request headers automatically.

## Logging Security

MagicAF uses structured logging via `tracing`. By default, it logs operational metadata (latency, counts, collection names) but **not** payload content or query text.

### Log Level Guidance

| Level | What's Logged | Production Use |
|-------|--------------|---------------|
| `error` | Failures only | Minimum for production |
| `warn` | Failures + degraded conditions | Recommended baseline |
| `info` | Operation summaries (no content) | Standard production |
| `debug` | Detailed operation data | Development only |
| `trace` | Everything including payloads | Never in production |

### Filtering Sensitive Data

```rust
tracing_subscriber::fmt()
    .json()
    .with_env_filter("info,magicaf=info") // No debug/trace in production
    .init();
```

## Dependency Auditing

Regularly audit Rust dependencies for known vulnerabilities:

```bash
# Install cargo-audit
cargo install cargo-audit

# Run audit
cargo audit
```

## Air-Gap Security Benefits

Air-gapped deployments inherently prevent:
- Data exfiltration via network
- Supply chain attacks on model downloads
- Unauthorized model or dependency updates

See [Air-Gapped Setup](/docs/deployment/air-gapped/) for deployment instructions.

---

## Security FAQ for Compliance Officers

### Does MagicAF ever phone home?

No. MagicAF makes zero outbound network connections. All service endpoints are explicitly configured by the deployer (embedding server, vector store, LLM server), and they default to `localhost`. There is no telemetry, no update checking, no license validation, and no analytics. The framework is distributed as source code — you can verify this by auditing the codebase.

### Where are API keys stored?

API keys are passed as `Option<String>` fields in configuration structs (`EmbeddingConfig`, `VectorStoreConfig`, `LlmConfig`). They are:
- **Never serialized to logs** — the `tracing` instrumentation excludes credential fields
- **Never persisted to disk** by the framework — storage is the deployer's responsibility
- **Transmitted only in HTTP `Authorization` headers** to the configured service endpoints

For production, load API keys from environment variables or a secrets manager — never hardcode them in source files.

### What data is written to logs?

At the default `info` level, MagicAF logs:
- Operation names and durations (e.g., "vector search completed in 3ms")
- Collection names and result counts
- Error messages and error codes
- Token usage statistics (if reported by the LLM)

MagicAF does **not** log at `info` level:
- Query text or user input
- Document content or payloads
- Embedding vectors
- LLM prompts or responses

At `debug` and `trace` levels, additional operational data is logged. **Never use `debug` or `trace` in production** for classified or HIPAA environments.

### Is MagicAF HIPAA-compliant?

MagicAF is a framework, not a service — HIPAA compliance depends on your deployment. MagicAF supports HIPAA-compliant deployments by:
- Running entirely on-premises with no cloud dependencies
- Never inspecting, classifying, or persisting PHI within the framework
- Providing structured logging that can be configured to exclude sensitive data
- Supporting air-gapped deployment where no data can leave the network

Your deployment must also address access controls, encryption at rest, audit logging, and BAA requirements — these are infrastructure-level concerns outside the framework's scope.
