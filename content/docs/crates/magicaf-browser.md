---
title: "magicaf-browser"
description: "Render JavaScript-heavy pages in a shared headless Chrome, plus web and literature search helpers that query third-party engines."
weight: 52
keywords: [magicaf-browser, headless Chrome, chromiumoxide, render SPA, web search]
---

{{< crate-header "magicaf-browser" >}}

Some pages are empty until JavaScript runs. `magicaf-browser` launches one shared headless Chrome on first use and returns the rendered HTML. It is mostly used indirectly, through the `headless` feature of [`magicaf-fetch`](/docs/crates/magicaf-fetch/).

## Example

```rust
#[tokio::main]
async fn main() {
    let url = "https://example.com/app";
    match magicaf_browser::render_page(url).await {
        Some(html) => {
            let links = magicaf_browser::extract_links(&html, url);
            println!("rendered {} bytes, {} links", html.len(), links.len());
        }
        // Chrome missing, the page failed, or it exceeded the 15 s budget.
        None => println!("render failed; fall back to a static fetch"),
    }
}
```

## Functions

| Function | Behavior |
|---|---|
| `render_page(url) -> Option<String>` | Loads the page, waits a fixed 3 seconds, and returns the HTML. `None` if Chrome is missing, loading fails, or 15 seconds pass. |
| `extract_links(html, base_url)` | Absolute links from rendered HTML. |
| `search_google(query, max)` | Web search, trying Serper, Brave, DuckDuckGo, then Google through the browser. At most 9 results. |
| `search_clinical(query, max)` | Literature search across PubMed, Google Scholar, and DuckDuckGo, merged. |

## Before you use it

- **It is experimental.** The crate has no tests yet, and timings are hard-coded.
- **No guards of its own.** `render_page` does not check for SSRF or `robots.txt`; call it through `ScrapeService` to get those.
- **Chrome runs without its sandbox** (`--no-sandbox`). Run it in a container or as an unprivileged user.
- **Search leaves the network.** The search helpers send queries to third-party engines (`SERPER_API_KEY` and `BRAVE_SEARCH_API_KEY` are read from the environment when set). Do not use them in a deployment that must not make outbound calls.
