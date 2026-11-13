---
title: "magicaf-fetch"
description: "Web fetching and content extraction: an SSRF guard, robots.txt cache, per-domain rate limiting, URL canonicalization, HTML-to-markdown extraction, and a retrying scrape service."
weight: 50
keywords: [magicaf-fetch, web scraping Rust, SSRF protection, robots.txt, HTML to markdown, content extraction]
---

{{< crate-header "magicaf-fetch" >}}

When an assistant reads the web — to answer from a page, or to ingest a site into a knowledge base — the fetch layer decides whether it is safe and allowed to go there and turns what comes back into clean text. `magicaf-fetch` provides those pieces separately, so you can use one or all of them, and assembles them into `ScrapeService` for the common case.

## Example

```rust
use magicaf_fetch::{canonicalize, extract, validate_url, CanonicalOptions, DomainRateLimiter, ExtractOptions, OutputFormat, RobotsCache};
use magicaf_fetch::scrape_service::ScrapeService;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let url = "https://example.com/page?utm_source=x#top";
    let canonical = canonicalize(url, &CanonicalOptions::default()).map_err(anyhow::Error::msg)?;
    validate_url(&canonical).await?;
    let client = reqwest_client();
    let robots = RobotsCache::new();
    if !robots.is_allowed(&client, &canonical).await { return Ok(()); }
    DomainRateLimiter::new().check("example.com").await.map_err(anyhow::Error::msg)?;

    let html = "<html><head><title>T</title></head><body><nav>x</nav><article><p>Hello <a href=\"/a\">a</a></p></article></body></html>";
    let opts = ExtractOptions { formats: vec![OutputFormat::Markdown, OutputFormat::Links], ..Default::default() };
    let out = extract(html, &canonical, &opts)?;
    println!("{:?} {:?}", out.markdown, out.metadata.title);

    // Full pipeline: SSRF guard -> robots -> rate limit -> 3 header strategies -> extract.
    let svc = ScrapeService::new();
    let res = svc.scrape(&canonical, None).await?;
    println!("{} words via {}", res.word_count, res.strategy);
    Ok(())
}
fn reqwest_client() -> reqwest::Client { reqwest::Client::new() }
```

## Pieces

| Item | What it does |
|---|---|
| `validate_url(url)` | Allows only `http`/`https`, resolves DNS, and rejects loopback, private (RFC 1918), link-local, CGNAT, and IPv6 unique-local addresses — the standard server-side request forgery guard. |
| `RobotsCache` | Fetches and caches `robots.txt` per host for an hour: `is_allowed`, `crawl_delay_for`, `sitemaps_for`. If `robots.txt` cannot be fetched, it allows the request. |
| `DomainRateLimiter` | 10 requests per domain per 60 seconds, in memory or shared through Redis. |
| `canonicalize`, `dedupe` | Normalize URLs so duplicates collapse — tracking parameters and fragments are stripped by default; dropping the whole query or lower-casing the path are options. |
| `etld_plus_one`, `is_same_registrable_domain` | Registrable-domain checks for staying on one site. |
| `extract(html, base_url, &opts)` | Main-content extraction to Markdown, HTML, text, links, or images, with page metadata (title, Open Graph, author, published date, canonical URL). |
| `scrape_service::ScrapeService` | The full pipeline: guard, robots, rate limit, fetch with retries, extract. PDFs are extracted in-process. |

`ScrapeService` caps bodies at 2 MB and output at 8,000 words, and classifies failures (`SsrfBlocked`, `RobotsBlocked`, `RateLimited`, `NotFound`, `Timeout`, `TlsError`, `ContentEmpty`, and others) so callers can react sensibly.

## How it identifies itself

`robots.txt` is evaluated for the user agent `LumenBot`. When a site rejects the first attempt, `ScrapeService` retries with browser-like request headers. If your use requires every request to identify your crawler, use the individual pieces with your own HTTP client rather than `ScrapeService`.

## Optional features

- `headless` — when a static fetch yields fewer than 50 words (typical of single-page apps), `ScrapeService` renders the page in headless Chrome through [`magicaf-browser`](/docs/crates/magicaf-browser/) and extracts again.
- `redis` — `DomainRateLimiter::with_redis` shares limits across processes, and `ScrapeCache` stores results. Without it the cache is a no-op.

## Related

- [`magicaf-document`](/docs/crates/magicaf-document/) — layout-aware PDF extraction and OCR
- [`magicaf-browser`](/docs/crates/magicaf-browser/) — rendering JavaScript-heavy pages
