#!/usr/bin/env bash
# Verifies the machine-readable mirrors stay in sync with the site.
#
# Guards against the drift that made the old hand-maintained static/llms.txt
# advertise a /search/ page that 404'd. Run against a built ./public.
set -euo pipefail

PUB="${1:-public}"
fail=0
note() { printf '  %s\n' "$*"; }

[[ -d "$PUB" ]] || { echo "✗ no build at $PUB — run 'hugo' first"; exit 1; }

for f in llms.txt llms-full.txt sitemap.xml robots.txt; do
  [[ -s "$PUB/$f" ]] || { echo "✗ missing or empty: $PUB/$f"; fail=1; }
done
[[ $fail -eq 0 ]] || exit 1

tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
# grep -m1 rather than `grep | head -1`: head closing the pipe early sends
# SIGPIPE to grep, which pipefail turns into a build failure.
SITE=$(grep -m1 -o '<loc>[^<]*</loc>' "$PUB/sitemap.xml" | sed -e 's|<loc>||' -e 's|</loc>||' -e 's|/$||')
grep -o '<loc>[^<]*</loc>' "$PUB/sitemap.xml" | sed -e 's|<loc>||' -e 's|</loc>||' | sort -u > "$tmp/sitemap"
grep -oE '\(https://[^)]+\)' "$PUB/llms.txt" | tr -d '()' | sort -u > "$tmp/llms"
grep '^- Canonical URL: ' "$PUB/llms-full.txt" | sed 's|^- Canonical URL: ||' | sort -u > "$tmp/full"

# 1. Every page on the site is listed in llms.txt.
if missing=$(comm -13 "$tmp/llms" "$tmp/sitemap") && [[ -n "$missing" ]]; then
  echo "✗ pages in sitemap.xml but absent from llms.txt:"; note "$missing"; fail=1
else
  echo "✓ llms.txt lists all $(wc -l < "$tmp/sitemap" | tr -d ' ') pages"
fi

# 2. llms.txt advertises no URL that isn't a real page (the /search/ 404 class of bug).
#    Non-page endpoints are legitimate and allowlisted.
allow='/(llms\.txt|llms-full\.txt|sitemap\.xml|robots\.txt|index\.xml|\.well-known/)'
if dangling=$(comm -23 "$tmp/llms" "$tmp/sitemap" | grep -vE "$allow" || true) && [[ -n "$dangling" ]]; then
  while read -r u; do
    [[ -z "$u" ]] && continue
    [[ "$u" == "$SITE"* ]] || continue   # sister-site links are not ours to verify
    rel="${u#*://*/}"; [[ -f "$PUB/$rel/index.html" || -f "$PUB/${rel}index.html" ]] \
      || { echo "✗ llms.txt links a path with no page: $u"; fail=1; }
  done <<< "$dangling"
fi
[[ $fail -eq 0 ]] && echo "✓ llms.txt has no dangling self-links"

# 3. llms-full.txt covers every page.
if missing=$(comm -13 "$tmp/full" "$tmp/sitemap") && [[ -n "$missing" ]]; then
  echo "✗ pages missing from llms-full.txt:"; note "$missing"; fail=1
else
  echo "✓ llms-full.txt contains all $(wc -l < "$tmp/full" | tr -d ' ') pages"
fi

# 4. Every page has a Markdown mirror.
html=$(find "$PUB" -name index.html -not -path "*/page/*" | wc -l | tr -d ' ')
md=$(find "$PUB" -name index.md | wc -l | tr -d ' ')
if [[ "$md" -lt "$(wc -l < "$tmp/sitemap" | tr -d ' ')" ]]; then
  echo "✗ only $md Markdown mirrors for $(wc -l < "$tmp/sitemap" | tr -d ' ') pages"; fail=1
else
  echo "✓ $md Markdown mirrors present ($html HTML pages)"
fi

# 5. No HTML entity leakage in the plain-text mirrors.
if grep -qE '&(amp|#39|quot|lt|gt|#34);' "$PUB/llms.txt"; then
  echo "✗ llms.txt contains HTML entities — check htmlUnescape at the partial call sites"; fail=1
else
  echo "✓ no HTML entity escaping in llms.txt"
fi

# 6. AI crawlers are declared in robots.txt.
for ua in ClaudeBot Claude-User GPTBot OAI-SearchBot PerplexityBot; do
  grep -qi "^User-agent: $ua\$" "$PUB/robots.txt" || { echo "✗ robots.txt missing $ua"; fail=1; }
done
[[ $fail -eq 0 ]] && echo "✓ robots.txt declares the major AI crawlers"

[[ $fail -eq 0 ]] && echo "✓ LLM accessibility checks passed" || echo "✗ LLM accessibility checks FAILED"
exit $fail
