---
title: "Serving a Model Family Behind LlmGateway"
description: "Address models by stable family-version names, resolve them from private configuration into an LlmGateway, and keep provider identity out of logs and artifacts."
weight: 1
keywords: [LlmGateway, model family, model routing, model versioning, per-tier model routing, MagicAF LLM gateway, Rust LLM router]
tags: [llm-gateway, models, configuration, routing, lumen]
categories: [guide]
difficulty: intermediate
prerequisites:
  - /docs/api-reference/core/llm-service/
---


Most teams start by pasting a provider's model ID into config and calling it done. That string then leaks everywhere: into logs, dashboards, evaluation reports, CI output, and eventually into a customer conversation. When you change the model underneath, every one of those places is wrong, and every past evaluation result silently refers to something that no longer exists.

Lumen avoids this by giving each model a **stable public name**, `family-version` (for example `sirona-v1` or `brigid-v1`), and resolving that name to a concrete endpoint in exactly one place. This guide shows the pattern on MagicAF's `LlmGateway`. By the end you will have a resolver that turns a public model name into a working gateway, with the provider and model ID confined to private environment configuration.

## The name is the contract

A model reference has two parts, split on the **last** hyphen so that versions like `v1.2` survive:

```rust
/// A model addressed by family and version, e.g. `sirona-v1`.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ModelRef {
    pub family: String,
    pub version: String,
}

impl ModelRef {
    /// Parse `family-version`, splitting on the last `-`.
    pub fn parse(s: &str) -> anyhow::Result<Self> {
        let (family, version) = s
            .rsplit_once('-')
            .ok_or_else(|| anyhow::anyhow!("expected family-version, got {s}"))?;
        anyhow::ensure!(
            !family.is_empty() && family.chars().all(|c| c.is_ascii_lowercase() || c.is_ascii_digit()),
            "family must be lowercase alphanumeric"
        );
        Ok(Self { family: family.into(), version: version.into() })
    }

    /// `MODEL_SIRONA_V1`, with `.` in the version replaced by `_`.
    fn env_key(&self) -> String {
        format!("MODEL_{}_{}", self.family, self.version.replace('.', "_")).to_uppercase()
    }
}
```

Everything outside the resolver speaks in `ModelRef`. Run reports record `family` and `version`. Routing tables map plans to `ModelRef`s. Nothing else ever sees a provider.

## Resolve in one place

The resolver reads two private variables per model and builds a `GatewayConfig`. `GatewayConfig` and `LlmConfig` are `Deserialize`, so the only required fields are the provider, `base_url`, and `model_name`; retry, circuit breaker, rate limit, TLS, and pool settings take their defaults.

```bash
# Private environment only. Never committed, never logged.
MODEL_SIRONA_V1=openai:<model id>
MODEL_SIRONA_V1_URL=https://inference.internal/v1
```

```rust
use magicaf_core::config::GatewayConfig;
use magicaf_local_llm::LlmGateway;
use serde_json::json;

/// Resolve a public model name to a gateway from private environment.
/// The provider and model id never leave this function.
pub fn gateway_for(model: &ModelRef) -> anyhow::Result<LlmGateway> {
    let key = model.env_key();
    let spec = std::env::var(&key)?;
    let (provider, model_id) = spec
        .split_once(':')
        .ok_or_else(|| anyhow::anyhow!("{key} must be <provider>:<model_id>"))?;
    let base_url = std::env::var(format!("{key}_URL"))?;

    let config: GatewayConfig = serde_json::from_value(json!({
        "provider": provider,
        "llm": { "base_url": base_url, "model_name": model_id }
    }))?;
    Ok(LlmGateway::new(config)?)
}
```

`provider` accepts the lowercase `LlmProvider` variants: `openai`, `anthropic`, `ollama`, or `deepseek`. The gateway routes the first, third, and fourth through the OpenAI-compatible `LocalLlmService` and the second through `AnthropicLlmService`, and exposes both behind the same `LlmService` trait. A self-hosted model served by vLLM or Ollama inside an air-gapped network is just another resolver entry; nothing downstream changes.

The gateway is then used like any other `LlmService`:

```rust
use magicaf_core::llm::{ChatMessage, ChatRequest, LlmService};

let gateway = gateway_for(&ModelRef::parse("brigid-v1")?)?;
let request = ChatRequest {
    messages: vec![ChatMessage::user("Renal dosing for vancomycin at CrCl 45?")],
    temperature: Some(0.0),
    ..Default::default()
};
let response = gateway.chat(request).await?;
println!("{}", response.first_content().unwrap_or_default());
```

## Route by plan, and treat the routing table as configuration under test

Lumen builds one gateway per subscription tier and selects it from the user's plan, so a user never picks a model and a team shares one standard: Brigid for the free plan, Sirona for Plus, Max, Teams, and Enterprise. Store that mapping as `plan → ModelRef`, not `plan → provider model ID`.

The routing table deserves the same discipline as a prompt. Changing which plan gets which model changes what users receive, so record the table in every evaluation run's metadata. A result that does not say which model served which plan cannot be compared with the next one.

## Checklist

- Public names are `family-version`; versions are immutable once a result references them.
- Exactly one function turns a name into an endpoint, and it reads private configuration only.
- Logs, metrics, run reports, and CI output carry `family` and `version`, never the provider or model ID.
- The plan-to-model routing table is recorded with every evaluation run.
- An evaluation judge is resolved the same way, from its own variables, so its vendor can be compared with the contestant's. See [Evaluating a Clinical RAG System](/docs/lumen-models/evaluating-clinical-rag/).
