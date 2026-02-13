---
title: "Security & Compliance - HIPAA, SIPR/NIPR, Defense-Grade Security"
description: "Security and compliance guidance for MagicAF deployments in defense, healthcare, and classified environments. HIPAA-compliant, SIPR/NIPR-ready, defense-grade security hardening for airgapped AI systems."
weight: 6
keywords: "hipaa-compliant ai, hipaa-approved ai, sipr ai security, nipr ai security, defense-grade ai security, secret ai security, classified ai security, airgapped ai security, secure llm security, secure ai compliance, healthcare ai security, defense ai security"
---

MagicAF is designed with **defense-grade security and compliance** as first principles. All services run locally, no data leaves the network boundary, and the framework makes no assumptions about data sensitivity. MagicAF is engineered for **HIPAA-compliant healthcare deployments**, **SIPR/NIPR classified environments**, **secret and top-secret government systems**, and **defense-grade airgapped infrastructure**.

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

## Compliance & Regulatory Support

### HIPAA Compliance

MagicAF is designed to support **HIPAA-compliant healthcare deployments**:

- **No PHI/PII assumptions** — framework never inspects payload content; data classification is application-controlled
- **Local-only processing** — all AI services run on-premises; no data transmission to external services
- **Audit trail support** — structured logging provides natural integration points for HIPAA audit requirements
- **Access control ready** — adapter layer provides natural boundaries for role-based access control (RBAC)
- **Encryption support** — TLS termination and encryption at rest are application-controlled

### SIPR/NIPR & Classified Environments

MagicAF is engineered for **SIPR/NIPR networks** and **classified government systems**:

- **Air-gapped by design** — zero outbound network dependencies
- **No cloud services** — all components run on-premises
- **Vendor-independent** — no vendor lock-in or external dependencies
- **Model integrity** — SHA-256 checksums for model file verification
- **Secret/classified data handling** — framework is domain-neutral; data classification is application-controlled

### Defense-Grade Security

MagicAF meets **defense-grade security requirements**:

- **Network isolation** — all services bind to internal interfaces
- **Supply chain security** — dependency auditing with `cargo audit`
- **Container security** — Docker image vulnerability scanning
- **Structured logging** — JSON-formatted logs for SIEM integration
- **No data leakage** — operational metadata only; no payload content in logs

## Air-Gap Security Benefits

Air-gapped deployments inherently prevent:
- Data exfiltration via network
- Supply chain attacks on model downloads
- Unauthorized model or dependency updates
- External service dependencies
- Cloud vendor lock-in

See [Air-Gapped Setup](/docs/deployment/air-gapped/) for deployment instructions.
