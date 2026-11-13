---
title: "magicaf-server"
description: "A reference Axum server that assembles the MagicAF crates — streaming chat with retrieval and tools, an MCP endpoint, document, space, and artifact APIs, and metrics — under cloud, airgap, and defense build profiles."
weight: 90
keywords: [magicaf-server, Axum, RAG server, MCP server, SSE chat API, air-gapped deployment]
---

{{< crate-header "magicaf-server" >}}

`magicaf-server` shows how the crates fit together into a running service: streaming chat completions that retrieve from Qdrant and call tools, an MCP JSON-RPC endpoint, CRUD APIs for documents, spaces, artifacts, profiles, memories, and agent sessions, and Prometheus metrics. Build profiles swap PostgreSQL and JWT for SQLite and local accounts, or add a FIPS crypto backend and certificate auth.

It is a **reference**, not a supported production server. Use it to learn the wiring, to stand up a demo, or as the starting point for your own service.

{{< callout type="info" title="What it enforces at startup" >}}
The server refuses to start rather than run misconfigured:

- **Auth fails closed.** If the configured provider was not compiled in, startup fails. The provider defaults to the one the build profile includes (`cloud` → JWT, `airgap` → local accounts, `defense` → client certificate). A development-only stub exists, and it runs only with `environment = "development"` **and** `allow_insecure_dev_auth = true`.
- **Air-gap mode is checked.** With `air_gap_mode = true`, startup fails if `llm_provider` is a hosted provider (OpenAI, Anthropic, DeepSeek) or if the embedding, Qdrant, or LLM URL is not a private host — loopback, RFC 1918, link-local, IPv6 unique-local, `localhost`, `*.local`, `*.internal`, or a single-label name. Names are checked as written, not resolved; this is a configuration check, not an egress firewall. Only the clinical tools that make no network calls are registered.
- **A bad config file is fatal** outside `development`.
- **Production needs an encryption key** (`MAGICAF__ENCRYPTION_KEY`, or `MAGICAF_ENCRYPTION_KEY`).

Tool tiers come from the server's record of the user, never from the request, and chat completions and MCP tool calls are rate-limited per user tier over a 24-hour window.

It remains a **reference** server: users are not created automatically, and a user with no record gets the free tier with rate limiting skipped. Put it behind your own gateway if you expose it.

Building it needs the private `helix-deid` crate checked out beside the MagicAF repository.
{{< /callout >}}

## Run it

```bash
# SQLite + local accounts
cargo run -p magicaf-server --no-default-features --features airgap

curl -s localhost:8000/health        # {"status":"ok"}
curl -s localhost:8000/api/status    # environment, tools and components registered, air_gap_mode
```

## Profiles

| Feature | Database | Auth | Adds |
|---|---|---|---|
| `cloud` (default) | PostgreSQL | JWT | The deprecated demo clinical tools and web tools |
| `airgap` | SQLite | Local accounts | — |
| `defense` | SQLite | Client certificate (default), LDAP | The `fips` TLS backend; startup fails unless FIPS mode is detected |

See [`magicaf-auth`](/docs/crates/magicaf-auth/) for what the certificate and LDAP providers do and do not check.

## Endpoints

| Route | Purpose |
|---|---|
| `GET /health`, `GET /api/status`, `GET /metrics` | Liveness, configuration summary, Prometheus metrics (no auth) |
| `POST /api/chat/completion` | Server-sent events: `chat_created`, `loading`, `rag_searching`, `tool_use`, `tool_result`, `completed`, `failed` |
| `POST /mcp` | MCP JSON-RPC: `initialize`, `tools/list`, `tools/call`, `ping` |
| `/api/documents`, `/api/spaces`, `/api/artifacts` | CRUD; uploads limited to 10 MB. `GET /api/artifacts/schema/:component_type` returns a [`magicaf-ui`](/docs/crates/magicaf-ui/) schema. |
| `GET /api/artifacts/shared/:token` | Public read of a shared artifact (no auth) |
| `/api/user/profile`, `/api/user/memories`, `/api/agent-sessions` | Per-user data |
| `DELETE /api/gdpr/user/:id`, `DELETE /api/gdpr/document/:id` | Hard deletion, admin only |

Every response carries `nosniff`, `DENY` framing, HSTS, and `no-store` headers. CORS allows all origins in `development` and only `allowed_origins` otherwise.

## Configuration

Configuration is layered: `config/default.toml`, then `config/<MAGICAF_ENV>.toml`, then environment variables prefixed `MAGICAF__` with `__` between levels — for example `MAGICAF__DATABASE__URL` or `MAGICAF__AUTH__JWT__SECRET`.

| Key | Default |
|---|---|
| `bind_address`, `port` | `0.0.0.0`, `8000` |
| `environment` | `development` |
| `embedding_url`, `embedding_model`, `embedding_dim` | `http://localhost:8080`, `nomic-embed-text`, 768 |
| `qdrant_url`, `qdrant_collection` | `http://localhost:6333`, `lumen_embeddings` |
| `llm_provider`, `llm_url`, `llm_model` | `ollama`, `http://localhost:11434`, `llama3.2` |
| `chat_max_tool_iterations` | 5 |
| `deid_mode` | `external_only` — pseudonymize chat text sent to external LLM providers |
| `air_gap_mode` | `false` — when true, startup checks described above
| `allow_insecure_dev_auth` | `false` — development-only auth stub
| `encryption_key` | none — required when `environment = "production"`; encrypts stored chat content via [`magicaf-db`](/docs/crates/magicaf-db/) |

## Related

- [Docker deployment](/docs/deployment/docker/) — the supporting services
- [`magicaf-agent`](/docs/crates/magicaf-agent/) — a fuller agent loop than the server's chat route
