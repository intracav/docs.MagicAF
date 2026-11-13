---
title: "Reflex: Decide"
description: "The smallest MagicAF Reflex v2 program: open a verified artifact and ask three typed questions about one state in a single model run."
weight: 4
difficulty: intermediate
keywords: [MagicAF Reflex example, DecisionService, calibrated decisions, ONNX]
---

The `reflex_decide` example opens a Reflex artifact directory — verifying every file's SHA-256 first — asks three typed questions about one piece of state in a single graph run, and prints the calibrated answer distributions.

```bash
cargo run -p example-reflex-decide -- magicaf-reflex-onnx/tests/fixtures/core-mini
```

The bundled `core-mini` fixture has random weights, so its answers are near-uniform: the example demonstrates the shape of the API, not answer quality. Nothing in it touches the network. Reflex makes no clinical decisions and is not a medical device.

## What to notice

- `magicaf_reflex_onnx::open(dir, threads)` refuses to load an artifact whose files do not match their recorded hashes.
- Questions are typed — `QuestionType` with a fixed option list — and `ask_many` answers several against the same state at once.
- Each answer is a probability distribution plus a calibrated confidence, and may be an abstention.

Read [MagicAF Reflex](/docs/reflex/) for what the answers mean and how Reflex earns the authority to act on them.

## Full source

<details class="source-details">
<summary><code>examples/reflex_decide/src/main.rs</code> — the file as it is in the MagicAF repository at <code>9d00780</code></summary>

```rust
//! `reflex_decide` — the smallest MagicAF Reflex v2 program.
//!
//! ```bash
//! cargo run -p example-reflex-decide -- magicaf-reflex-onnx/tests/fixtures/core-mini
//! ```
//! Opens an artifact directory (every file SHA-256-verified first), asks three typed questions about
//! one state in ONE graph run, and prints the calibrated distributions. The mini fixture has random
//! weights, so its answers are near-uniform: the point is the shape of the API, not the answers.
//! Nothing here touches the network. Reflex makes no clinical decisions and is not a medical device.

use magicaf_core::decision::{ask_many, DecisionOption, Question, QuestionType};
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let dir = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "magicaf-reflex-onnx/tests/fixtures/core-mini".into());
    let core = magicaf_reflex_onnx::open(std::path::Path::new(&dir), 2)?;
    let art = core.artifact();
    println!(
        "artifact {} {} graph sha256 {}",
        art.model.model,
        art.model.version,
        &art.graph_sha256[..12]
    );

    let state = json!({
        "subject": "Duplicate charge on invoice #4411",
        "body": "We were billed twice for March. Please refund the duplicate today or we will cancel our plan."
    });
    // Ad-hoc questions (free text; answered with the generic calibration, certified: false).
    let questions = vec![
        Question::adhoc(
            "example.adhoc@1.0.0",
            QuestionType::Choice,
            "Which department should handle this request?",
            vec![
                DecisionOption::new("billing", "invoices, payments, refunds"),
                DecisionOption::new("technical", "bugs, outages, system errors"),
                DecisionOption::new("other", "everything else"),
            ],
        ),
        Question::adhoc(
            "example.adhoc@1.0.0",
            QuestionType::Score,
            "How urgent is this request?",
            vec![
                DecisionOption::new("not_urgent", "not urgent"),
                DecisionOption::new("soon", "soon"),
                DecisionOption::new("blocking", "critical deadline or blocking issue"),
            ],
        ),
        Question::adhoc(
            "example.adhoc@1.0.0",
            QuestionType::Noul,
            "Does the user threaten to cancel or leave?",
            magicaf_core::decision::systemone::noul_options(),
        ),
    ];
    let answers = ask_many(&core, &questions, &state).await;
    for (q, a) in questions.iter().zip(&answers) {
        match (&a.probs, &a.abstain) {
            (Some(p), None) => {
                let best = a.argmax().unwrap_or(0);
                println!(
                    "{:<45} → {} (p={:.3}, scope={:?}, certified={}) {:?}",
                    q.instructions,
                    q.options[best].id,
                    a.confidence().unwrap_or(0.0),
                    a.scope,
                    a.certified,
                    q.options
                        .iter()
                        .zip(p)
                        .map(|(o, p)| format!("{}={:.3}", o.id, p))
                        .collect::<Vec<_>>()
                );
            }
            (_, Some(reason)) => println!("{:<45} → abstain: {}", q.instructions, reason.as_wire()),
            _ => unreachable!(),
        }
    }
    // A non-Latin state is refused by the script gate before any inference.
    let hindi = ask_many(
        &core,
        &questions[..1],
        &json!("मुझसे दो बार शुल्क लिया गया कृपया वापस करें"),
    )
    .await;
    println!(
        "Devanagari state → {}",
        hindi[0]
            .abstain
            .as_ref()
            .map(|r| r.as_wire())
            .unwrap_or_else(|| "answered".into())
    );
    Ok(())
}
```

</details>

