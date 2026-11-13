---
title: "magicaf-research"
description: "A registry of statistical analysis methods with typed rendering to R, design review, interpretation guards, and an execution-provider contract. It plans analyses; it never runs them."
weight: 80
keywords: [magicaf-research, statistical analysis, R code generation, research methods, analysis review]
---

{{< crate-header "magicaf-research" >}}

`magicaf-research` lets an assistant propose a statistical analysis safely. It holds a registry of {{< stat "research_methods" >}} analysis methods — t-tests, regression, survival models, power analysis, simulation, and more — stored as data, each with an R template and a typed parameter list. Given parameters, it renders R code in which no value can become arbitrary code; it reviews the study design for mistakes before anything runs; and after a run it checks the written interpretation against the actual output.

Execution belongs to someone else. The crate defines the `lumen.research.exec/1` contract an execution provider implements, and stops there.

## Example

```rust
use magicaf_research::review::{review, Design};
use magicaf_research::{method, methods, render};
use serde_json::json;

fn main() {
    println!("{} built-in methods", methods().len());

    // Render a Welch t-test against R's built-in `sleep` dataset.
    let t_test = method("inference.t_test").expect("built-in method");
    let params = json!({ "data": "sleep", "outcome": "extra", "group": "group" });
    let rendered = render(t_test, params.as_object().unwrap(), &[]).expect("valid parameters");
    println!("{}", rendered.code);

    // Review the design before anything runs.
    let review = review(t_test, &rendered.params, &Design::default(), None);
    for finding in &review.findings {
        println!("{:?} {}: {}", finding.severity, finding.code, finding.message);
    }
    println!("could not check: {:?}", review.unknowns);
}
```

The rendered code begins with a header comment recording the method and version, then the analysis, then effect sizes.

## What it provides

| Area | Items |
|---|---|
| Registry | `methods()`, `method(id)`, `export_json()` |
| Rendering | `render(method, params, schemas) -> Rendered` — R code, the normalized parameters, and required packages. Fails with every parameter problem at once. |
| Design review | `review::review(method, params, design, data)` and `review_with_run` — findings graded `Error`, `Caution`, or `Suggestion`, plus a list of facts it could not check |
| Interpretation guards | `interpret::unsupported_numbers` (numbers in prose that the output does not contain), `wording_flags` (causal language for non-randomized designs), `mc_precision_flags` |
| Execution contract | `contract::{ExecRequest, ExecResult, ExecEvent, RuntimeInfo, Isolation, NetworkPolicy}` |
| Install profiles | `profiles::{profiles, get, closure, enabled_methods}` — `core`, `statistics`, `bioinformatics`, `single_cell`, `simulation`, each listing packages with their licenses |

## Methods by category

| Category | Methods |
|---|---|
| inference | 14 |
| simulation | 10 |
| design | 5 |
| models | 5 |
| clinical | 4 |
| genomics | 4 |
| exploration | 3 |
| survival | 3 |
| machine_learning | 1 |
| single_cell | 1 |

## Testing against R

The crate's test suite runs every method's generated code in a real R session and compares results with published or reference values. Without `Rscript` on the path those tests are skipped with a warning; set `LUMEN_REQUIRE_R=1` to make a missing R an error in CI.

"Checked against reference values" is the scope of that testing. It is not a regulatory validation of the methods.

## Related

- [`magicaf-routing`](/docs/crates/magicaf-routing/) and [`magicaf-knowledge`](/docs/crates/magicaf-knowledge/) — the same decide-don't-execute design
