---
title: "Installation"
description: "Get access to the MagicAF repository, add the crates you need as git dependencies, and choose TLS and feature flags."
weight: 2
tags: [setup, cargo, dependencies, configuration]
categories: [guide]
difficulty: beginner
---

MagicAF is a Cargo workspace consumed as source. You add the crates you need as git dependencies on the MagicAF repository; nothing is published to crates.io.

## Access {#access}

The MagicAF repository is private. To request read access for yourself or your team, email [hello@intracav.ai](mailto:hello@intracav.ai) with the GitHub accounts or deploy keys that need it.

Once you have access, confirm Git can reach it:

```bash
git ls-remote git@github.com:intracav/MagicAF.git HEAD
```

Cargo uses your Git credentials for git dependencies. If `cargo build` fails to fetch over SSH while `git` succeeds, tell Cargo to use the Git CLI:

```toml
# ~/.cargo/config.toml
[net]
git-fetch-with-cli = true
```

## Add the crates

A retrieval pipeline needs three crates — the core, a vector store, and an LLM client:

```toml
[dependencies]
magicaf-core      = { git = "ssh://git@github.com/intracav/MagicAF.git" }
magicaf-qdrant    = { git = "ssh://git@github.com/intracav/MagicAF.git" }
magicaf-local-llm = { git = "ssh://git@github.com/intracav/MagicAF.git" }

tokio      = { version = "1", features = ["full"] }
serde_json = "1"
anyhow     = "1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }
```

Cargo finds each crate inside the workspace by name. Pin a revision for reproducible builds — `rev = "<commit>"` or `tag = "<tag>"` on each line — and commit your `Cargo.lock`.

Other crates are added the same way. The [crate catalog](/docs/crates/) lists all {{< stat "crates" >}}, with what each needs at runtime.

{{< callout type="info" title="Working from a local checkout" >}}
If you have the repository cloned — for development, or on an air-gapped build host — use path dependencies instead: `magicaf-core = { path = "../MagicAF/magicaf-core" }`. The [air-gapped tutorial](/docs/tutorials/air-gapped-deployment/) covers vendoring everything for an offline build.
{{< /callout >}}

## Choose a TLS backend

`magicaf-core`, `magicaf-qdrant`, and `magicaf-local-llm` each have two TLS features. Pick one for all three.

| Feature | Default | Use it when |
|---|---|---|
| `tls-rustls` | on | Almost always. Pure-Rust TLS; no system OpenSSL needed. |
| `fips` | off | Your host runs OpenSSL in FIPS mode (for example RHEL 8 or 9 with FIPS enabled) and policy requires it. Uses the system OpenSSL and checks FIPS mode at startup. |

To switch to `fips`, turn off defaults on every MagicAF crate:

```toml
magicaf-core      = { git = "ssh://git@github.com/intracav/MagicAF.git", default-features = false, features = ["fips"] }
magicaf-qdrant    = { git = "ssh://git@github.com/intracav/MagicAF.git", default-features = false, features = ["fips"] }
magicaf-local-llm = { git = "ssh://git@github.com/intracav/MagicAF.git", default-features = false, features = ["fips", "streaming"] }
```

The `fips` feature makes MagicAF use the platform's crypto module; it does not make your deployment validated on its own.

## Configuration

MagicAF does not read environment variables. Every service takes a config struct — `EmbeddingConfig`, `VectorStoreConfig`, `LlmConfig` — and how you fill it is your choice. Because each struct derives `Deserialize` with defaults for everything but the endpoint, the usual pattern is to load it from a file:

```toml
# magicaf.toml
[embedding]
base_url   = "http://localhost:8080"
model_name = "bge-large-en-v1.5"

[vector_store]
base_url = "http://localhost:6333"

[llm]
base_url   = "http://localhost:8000/v1"
model_name = "mistral-7b"
request_timeout_secs = 300   # default is 120; raise it for CPU-only inference
```

```rust
use magicaf_core::prelude::*;
use serde::Deserialize;

#[derive(Deserialize)]
struct Settings {
    embedding: EmbeddingConfig,
    vector_store: VectorStoreConfig,
    llm: LlmConfig,
}

let settings: Settings = toml::from_str(&std::fs::read_to_string("magicaf.toml")?)?;
```

Every field you omit — timeouts, retry, circuit breaker, rate limit, TLS, connection pool — takes the default documented in [Configuration](/docs/api-reference/core/configuration/). API keys are `SecretString` values: they are never serialized or logged.

The Docker deployment files use `MAGICAF_*` variables (`MAGICAF_EMBEDDING_URL`, `MAGICAF_LLM_MODEL`, and so on) as a convention for your application to read; the library itself does not look at them.

## Verify the build

```rust
use magicaf_core::prelude::*;

fn main() {
    let llm = LlmConfig { base_url: "http://localhost:8000/v1".into(), ..Default::default() };
    println!("MagicAF linked; LLM request timeout = {}s", llm.request_timeout_secs);
}
```

```bash
cargo run
```

A successful build means Cargo fetched the workspace and your toolchain is new enough. Next, run a real pipeline.
