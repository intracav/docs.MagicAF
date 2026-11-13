---
title: "magicaf-routing"
description: "Deterministic, explainable model routing: which model answers, how hard it thinks, when a tool loop escalates, how risky a tool call is, and what its result means."
weight: 21
keywords: [magicaf-routing, model routing, LLM router, escalation policy, tool risk, explainable routing]
---

{{< crate-header "magicaf-routing" >}}

Every turn in a multi-model system raises the same questions: which model should answer this, with how much reasoning effort, and — once tools start running — whether to keep going, switch models, or ask the user. `magicaf-routing` answers them with plain, deterministic rules over *features* of the request, never the request text. The same inputs always produce the same decision, and every decision can explain itself in one line.

The crate decides; your host executes. It makes no network calls and holds no state beyond what you pass in.

## Example

```rust
use magicaf_routing::tools::{interpret, ResultObservation};
use magicaf_routing::{
    Complexity, EscalationPolicy, LoopSignals, ModelCatalog, RequestFeatures, RouteRequest,
    RoutingPolicy, TaskKind,
};

fn main() {
    let mut catalog = ModelCatalog::new();
    for profile in ModelCatalog::anthropic_documented() {
        catalog.insert(profile);
    }

    // Features describe the request without containing any of its text.
    let mut features = RequestFeatures::simple_chat();
    features.complexity = Complexity::Deep;
    features.task = TaskKind::Research;

    let request = RouteRequest {
        features,
        entitled: vec!["claude-haiku-5-5".into(), "claude-sonnet-5-5".into(), "claude-opus-5-5".into()],
        tier_default: "claude-sonnet-5-5".into(),
        requested_model: None,
        previous_model: None,
        unavailable_providers: vec![],
        reserve_output_tokens: 8_000,
        reflex: None,
    };
    let decision = RoutingPolicy::default().route(&catalog, &request);
    println!("{}", decision.explain());

    // Mid-loop: two tool errors in a row — should we escalate?
    let signals = LoopSignals { iteration: 2, iteration_cap: 10, consecutive_tool_errors: 2, ..Default::default() };
    println!("{:?}", EscalationPolicy::default().assess(&decision, &signals));

    // A search that returned HTTP 200 with zero hits is "empty", not "success".
    println!("{:?}", interpret(&ResultObservation { empty: true, ..Default::default() }));
}
```

Output (first line):

```text
claude-opus-5-5 (frontier) score 0.95 conf 1.00 → thinking high | reasons: upgraded | factors: complexity_deep +0.80, task_research +0.15
```

## Decisions it makes

| Question | Call | Returns |
|---|---|---|
| Which model? | `RoutingPolicy::route(&catalog, &request)` | A `RoutingDecision` — model, class, thinking effort, score, confidence, reasons, factors. It never fails; with no eligible model it returns the tier default and says so. |
| Should the loop escalate? | `EscalationPolicy::assess(&decision, &signals)` | `Stay`, `RaiseEffort`, `SwitchModel`, or `AskUser` |
| How should these tool calls run? | `tools::plan(&calls, unattended)` | Waves of calls that can run in parallel, with approval-gated calls held back |
| What did that tool result mean? | `tools::interpret(&observation)` | An outcome class and next step. HTTP 200 with zero hits is `Empty`, not success, and is not counted as a failure. |
| How risky is this tool? | `ToolProfile::from_mcp(name, hints)` / `classify_by_name` | A risk profile. Missing MCP hints are treated as risky. |

## Inputs

`RequestFeatures` describes a request with enums and flags — complexity, task kind, whether retrieval or tools are needed, context size — produced by your own classifier. `ModelCatalog` holds `ModelProfile`s with capabilities, context limits, observed latency, and prices.

`ModelCatalog::anthropic_documented()` returns profiles for current Claude models with prices captured on 2026-11-03. Treat it as a starting point and keep pricing current with `set_pricing`.

Routing defaults (`RoutingPolicy::default()`): requests scoring below 0.25 go to the small class, at or above 0.60 to the frontier class, with a 0.05 uncertainty band; a conversation over 8,000 cached tokens sticks to its current model to keep the cache warm.

## Advice from Reflex

`RouteRequest.reflex` accepts `ReflexAdvice` from a [Reflex](/docs/reflex/) decision model. Only advice whose calibration has been verified may move a request between classes, and it can never route a safety-sensitive or frontier-required request down.

## Tracing

`trace::TurnTrace` records every decision in a turn under the schema `magicaf.turn_trace/v1` — the factors, the chosen model, escalations, tool outcomes — with no user text, so it is safe to log.

## Related

- [`magicaf-agent`](/docs/crates/magicaf-agent/) — the loop these decisions steer
- [MagicAF Reflex](/docs/reflex/) — calibrated advice for the router
