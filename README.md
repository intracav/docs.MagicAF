# MagicAF Documentation

Source for [magicaf.intracav.ai](https://magicaf.intracav.ai) — documentation for **MagicAF**, Intracav's open-source Rust AI/ML/NLP framework, and **Lumen UI**, the component DSL that renders Lumen's AI-generated interfaces.

Fully custom Hugo site — **no theme**. Requires Hugo extended **0.154.5+**.

```bash
make serve   # dev server at :1313
make build   # production build
make check   # build and surface errors/warnings
make claims-check  # grep guard against unverifiable compliance claims
```

Deploys automatically to GitHub Pages on push to `main` (`.github/workflows/hugo.yml`).

## Layout

| Path | What it is |
|---|---|
| `layouts/` | All templates (baseof, single, list, home, 404, partials, 16 shortcodes) |
| `assets/css/main.css` | The entire design system — tokens, both themes, components |
| `assets/css/lumen-mockups.css` | Lumen UI mockup library, loaded **only** on `/docs/lumen-ui/` pages |
| `assets/css/chroma.css` | Generated syntax palette (`hugo gen chromastyles --style=dracula`) |
| `assets/js/main.js` | Theme toggle, reveal, tabs, code copy, sidebar, scroll |
| `assets/js/search-modal.js` | Fuse.js search modal (⌘K); index built by `layouts/_default/index.json` |
| `data/site.yaml` | **Single source of truth for counts** (component totals, crate list). Never hardcode these numbers in prose — use `{{</* stat "key" */>}}`. |
| `static/llms.txt`, `static/.well-known/` | AI-crawler index files — keep in sync with content moves |

## Frontmatter contract

```yaml
---
title: "Page Title"          # required
description: ""              # required, ≤160 chars; rendered as the page lead + meta description
weight: 10                   # required; ordering within the section
tags: []                     # optional; inert metadata (taxonomy pages are disabled)
categories: [concept]        # concept | reference | guide | tutorial | component
difficulty: beginner         # beginner | intermediate | advanced → badge in the page header
prerequisites: [/docs/...]   # optional list of paths
aliases: [/old-path/]        # REQUIRED when moving a page — GitHub Pages has no redirects
---
```

Dates come from **git history** (`enableGitInfo`) — do not add `date`, `lastmod`, `last_reviewed`, or `estimated_reading_time` fields.

## Shortcodes

| Shortcode | Use |
|---|---|
| `callout` | `type=info\|tip\|success\|warning\|danger\|important`, optional `title` |
| `tip` | Quick tip card with optional `title` |
| `step` | Numbered step: `num`, `title` |
| `prerequisites` | "Before you start" box |
| `badge` / `difficulty` | Inline badge / difficulty level badge |
| `card` + `card-grid` | Link cards: `title`, `href`, `tint=accent\|green\|blue`, `label`, `icon` |
| `tabs` + `tab` | Tabbed code/content: `{{</* tab name="Cargo" */>}}…` |
| `faq` | `question="…"` — also emits FAQPage JSON-LD automatically |
| `cta` | Banner: `heading`, `href`, `label`, `variant=contrast\|subtle` |
| `status-badge` | `beta` / `coming-soon` / `new` |
| `stat` | Inline a number from `data/site.yaml` — `{{</* stat "lumen_ui_components" */>}}` |
| `decision-card` | "Choose this if" card for decision guides: `title`, `tint` |
| `api-sig` | Anchored mono signature block: `kind`, `name`, `sig` |

## Style rules

**Voice.** Concept and decision pages teach: open from something the reader (a working engineer) already does, name the concept in bold, take positions ("Default to X; move to Y when…"). API reference stays terse and scannable. Every page's opening should make clear who it's for and what they'll be able to do.

**Claims firewall (enforced by CI grep).** This is a regulated company. Never state or imply a certification: no "HIPAA-compliant", "SOC 2", "ISO 27001", "defense-grade", "SIPR/NIPR". The defensible register is *capability*: "runs air-gapped with zero cloud dependencies", "designed for environments where data cannot leave the network". The canonical hedge lives in `content/docs/deployment/security.md` ("MagicAF is a framework, not a service — compliance depends on your deployment"). If you can't verify a claim, write `[NEEDS: description]` instead.

**Banned copy:** "transform your clinical workflow", "AI-powered insights", "revolutionize", "seamless", "empower", "unlock", "at scale", "the future of".

**Design.** Every color and spacing value comes from the tokens in `main.css` — no hardcoded hex in components. Both themes are designed, not inverted: dark overrides live in *two* blocks (`@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]`). Content must be readable without JavaScript.
