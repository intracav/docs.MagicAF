---
title: "Security"
description: "Defense-grade security architecture, HIPAA compliance, and hardening guidance for secure AI deployments. Complete security checklist for classified, healthcare, and regulated environments."
weight: 6
keywords: [security, defense-grade, HIPAA-compliant, secure AI, classified security, healthcare security, compliance, hardening, secure deployment]
---

MagicAF is designed with security as a first principle. All services run locally, no data leaves the network boundary, and the framework makes no assumptions about data sensitivity. Learn more about MagicAF's [defense-grade architecture and compliance features](/about/).

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
