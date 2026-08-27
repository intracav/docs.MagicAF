#!/usr/bin/env bash
# Checks whether AI crawlers can actually reach the live site.
#
# robots.txt and llms.txt are only promises; an edge rule (Cloudflare's
# "Block AI Scrapers and Crawlers" toggle, a WAF rule, or Bot Fight Mode) can
# 403 these agents before the request ever reaches the origin. This verifies
# the promise is kept. Usage: ./scripts/verify-bot-access.sh [host ...]
set -uo pipefail

HOSTS=("${@:-magicaf.intracav.ai}")
BROWSER="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"

declare -a BOTS=(
  "ClaudeBot|Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)"
  "Claude-User|Mozilla/5.0 (compatible; Claude-User/1.0; +Claude-User@anthropic.com)"
  "Claude-SearchBot|Mozilla/5.0 (compatible; Claude-SearchBot/1.0; +claudebot@anthropic.com)"
  "GPTBot|Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot"
  "OAI-SearchBot|Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot"
  "ChatGPT-User|Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot"
  "PerplexityBot|Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"
  "Googlebot|Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
)

overall=0
for host in "${HOSTS[@]}"; do
  echo "── https://$host"
  base=$(curl -sS -o /dev/null -w '%{http_code}' -A "$BROWSER" --max-time 20 "https://$host/" 2>/dev/null)
  printf "   %-18s %s  (baseline)\n" "browser" "$base"
  [[ "$base" == "200" ]] || { echo "   ! site itself is not returning 200 — fix that first"; overall=1; continue; }

  fail=0
  for entry in "${BOTS[@]}"; do
    name="${entry%%|*}"; ua="${entry#*|}"
    # Check a page and the LLM mirrors — edge rules sometimes differ by path.
    for path in "/" "/llms.txt" "/llms-full.txt"; do
      code=$(curl -sS -o /dev/null -w '%{http_code}' -A "$ua" --max-time 20 "https://$host$path" 2>/dev/null)
      if [[ "$code" != "200" ]]; then
        printf "   %-18s %s  ✗ BLOCKED at %s\n" "$name" "$code" "$path"; fail=1; overall=1; break
      fi
    done
    [[ $fail -eq 1 ]] && fail=0 || printf "   %-18s 200 ✓\n" "$name"
  done

  # An edge proxy can also rewrite robots.txt itself. Cloudflare's "Manage
  # robots.txt" injects a managed block that can Disallow AI bots and set
  # Content-Signal: ai-train=no — overriding whatever the origin serves.
  rb=$(curl -sS -A "$BROWSER" --max-time 20 "https://$host/robots.txt" 2>/dev/null)
  if grep -q "BEGIN Cloudflare Managed content" <<< "$rb"; then
    echo "   ! robots.txt contains a Cloudflare Managed block:"
    grep -E "^User-agent:|^Disallow:|^Content-Signal:" <<< "$(sed -n '/BEGIN Cloudflare/,/END Cloudflare/p' <<< "$rb")" \
      | paste - - 2>/dev/null | grep -i "disallow" | sed 's/^/     /' | head -12
    overall=1
  fi
  if grep -q "ai-train=no" <<< "$rb"; then
    echo "   ! robots.txt declares Content-Signal ai-train=no (contradicts .well-known/ai.txt)"
    overall=1
  fi
  echo
done

if [[ $overall -eq 0 ]]; then
  echo "✓ All AI crawlers can reach every host tested."
else
  echo "✗ Some AI crawlers are blocked. This is almost always an edge rule, not the origin."
  echo "  See DEPLOYMENT.md → 'Cloudflare: AI crawler access'."
fi
exit $overall
