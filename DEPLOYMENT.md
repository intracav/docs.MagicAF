# Deployment

The site is a static Hugo build deployed to **GitHub Pages** by
`.github/workflows/hugo.yml` on every push to `main`, and served through
**Cloudflare** (proxied DNS on the `intracav.ai` zone).

```
push to main → GitHub Actions (hugo --minify) → GitHub Pages → Cloudflare → visitor
```

---

## Cloudflare: AI crawler access

> **Status as of 2026-08-27: BROKEN.** Cloudflare blocks every AI crawler at the
> edge. This nullifies `robots.txt`, `llms.txt`, `llms-full.txt`, the per-page
> Markdown mirrors, and `.well-known/ai.txt` — none of them are reachable by the
> agents they were written for.

Run the verifier at any time:

```bash
./scripts/verify-bot-access.sh magicaf.intracav.ai
# or check the whole ecosystem:
./scripts/verify-bot-access.sh magicaf.intracav.ai intracav.ai docs.intracav.ai lumen.intracav.ai qpolicy.ai clinical-database.com
```

### What's wrong

Three separate Cloudflare features are working against the site's stated policy.

**1. AI crawlers get a hard `403` at the edge.**

Every AI agent is refused before the request reaches GitHub Pages; search
engines are let through. The response body is `Your request was blocked.` with
`server: cloudflare`.

| Blocked (403) | Allowed (200) |
|---|---|
| ClaudeBot | Googlebot |
| Claude-User | Bingbot |
| Claude-SearchBot | Applebot |
| GPTBot | Slackbot |
| OAI-SearchBot | Twitterbot |
| ChatGPT-User | browser |
| PerplexityBot | |
| Perplexity-User | |
| CCBot | |
| Meta-ExternalAgent | |
| Bytespider | |

**2. Cloudflare rewrites `robots.txt`,** injecting a managed block *above* the
site's own rules that says the opposite of what this repo serves:

```
# BEGIN Cloudflare Managed content
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
...
User-agent: ClaudeBot
Disallow: /
User-agent: GPTBot
Disallow: /
User-agent: CCBot
Disallow: /
# END Cloudflare Managed Content
```

Compare `public/robots.txt` (166 lines, all `Allow`) with the live file
(181 lines) to see the injection.

**3. `Content-Signal: ai-train=no`** is a machine-readable opt-out of AI
training — the direct contradiction of `static/.well-known/ai.txt`, which
declares `Allow-Training: yes` for every vendor.

### Blast radius

This is a per-zone setting, and it is not applied consistently:

| Site | Browser | AI crawlers |
|---|---|---|
| magicaf.intracav.ai | 200 | **403** |
| intracav.ai | 200 | **403** |
| docs.intracav.ai | 200 | **403** |
| lumen.intracav.ai | 200 | **403** |
| qpolicy.ai | 200 | **403** |
| clinical-database.com | 200 | 200 ✅ |

`clinical-database.com` is configured the way the others should be — useful as a
reference when comparing dashboard settings.

### How to fix it

All of this is dashboard-side; nothing in this repo can override it. Cloudflare
began enabling AI-crawler blocking **by default for new zones in mid-2025**,
which is the likely origin — these zones were probably never deliberately set
to block.

Do this for the **`intracav.ai`** zone, then repeat for **`qpolicy.ai`**.

**Step 1 — Turn off AI crawler blocking.**

1. <https://dash.cloudflare.com> → select the **`intracav.ai`** zone.
2. Go to **AI Crawl Control** in the left sidebar. (Older dashboards:
   **Security → Bots**; the feature has also appeared as *"AI Scrapers and
   Crawlers"* and *"Block AI bots"*.)
3. Set the crawler policy to **Allow**. If crawlers are listed individually, set
   ClaudeBot, Claude-User, Claude-SearchBot, GPTBot, OAI-SearchBot, ChatGPT-User,
   PerplexityBot, CCBot, Meta-ExternalAgent, and Amazonbot to **Allow**.

**Step 2 — Stop Cloudflare managing `robots.txt`.**

In the same **AI Crawl Control** area, find **Manage robots.txt** (or *Content
Signals Policy*) and **turn it off**, so the origin's `robots.txt` — the one
built from `layouts/robots.txt` — is served verbatim. If the feature can only be
configured rather than disabled, set `ai-train=yes`.

**Step 3 — Check the WAF and bot settings for leftovers.**

- **Security → WAF → Custom rules** — delete or disable any rule matching AI
  user-agent strings.
- **Security → Bots** — if **Bot Fight Mode** / **Super Bot Fight Mode** is on,
  make sure *"Definitely automated"* is not set to **Block**; verified AI
  crawlers are classified as automated and will be caught by it.
- **Security → Settings** — confirm Security Level isn't *Under Attack*, which
  challenges all non-browser clients.

**Step 4 — Verify.**

```bash
./scripts/verify-bot-access.sh magicaf.intracav.ai intracav.ai docs.intracav.ai lumen.intracav.ai qpolicy.ai
```

Expected: every agent `200`, and no Cloudflare Managed block in `robots.txt`.
Allow a few minutes for the edge to pick up the change.

> **Note on the trade-off.** Allowing these crawlers is what makes MagicAF
> citable in Claude, ChatGPT, and Perplexity answers — the stated goal in
> `layouts/robots.txt` and `.well-known/ai.txt`. It also means the documentation
> can be used as AI training data. That is already this project's declared
> position (`Allow-Training: yes`, open-source docs meant to be quoted). If that
> position ever changes, update `.well-known/ai.txt` and `layouts/robots.txt`
> **first** so the site's own files stay the source of truth.

---

## What the site publishes for AI agents

| Endpoint | What it is |
|---|---|
| `/llms.txt` | Index of all 180 pages, each with a one-line description. Generated from content by `layouts/index.llms.txt`. |
| `/llms-full.txt` | The entire corpus (~138k words) as one Markdown document. |
| `<page>/index.md` | Any page as clean Markdown, no site chrome. Advertised per-page via `<link rel="alternate" type="text/markdown">`. |
| `/sitemap.xml` | All 180 pages. |
| `/robots.txt` | Explicit `Allow` for 46 declared user-agents. |
| `/.well-known/ai.txt` | AI/TDM policy — training, retrieval, and citation all permitted. |
| `/index.json` | Slim Fuse.js search index. |

`scripts/llm-check.sh` runs in CI on every build and fails the deploy if any of
these drift out of sync with the content.

```bash
make llm-check     # build + verify the mirrors
make claims-check  # guard against unverifiable compliance claims
```
