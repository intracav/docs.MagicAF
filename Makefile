.PHONY: setup serve serve-prod build build-to clean check claims-check llm-check stats help

# Fully custom Hugo site — no theme, no submodules. Requires Hugo extended ≥ 0.154.5.

# ── Setup ────────────────────────────────────────────────────────

## Verify the toolchain
setup:
	@hugo version || (echo "Install Hugo extended 0.154.5+ (brew install hugo)"; exit 1)
	@echo "✓ Setup complete. Run 'make serve' to start the dev server."

# ── Development ──────────────────────────────────────────────────

## Start the Hugo development server with live reload
serve:
	hugo server -D --bind 0.0.0.0 --port 1313

## Start in production mode (no drafts)
serve-prod:
	hugo server --bind 0.0.0.0 --port 1313

# ── Build ────────────────────────────────────────────────────────

## Build the static site for production
build:
	hugo --minify

## Build and output to a custom directory
build-to:
	hugo --minify -d $(DEST)

# ── Utilities ────────────────────────────────────────────────────

## Remove generated files
clean:
	rm -rf public/ resources/_gen/

## Build and surface any errors or warnings
check:
	hugo --minify 2>&1 | grep -i "error\|warn" || echo "✓ No issues found."

## Guard against unverifiable compliance claims (matches lumen-docs CI pattern)
claims-check:
	@! grep -rniE 'hipaa-compliant|hipaa compliant|soc 2|iso 27001|sipr|nipr|defense-grade' content/ hugo.yaml layouts/ \
		--exclude-dir=.well-known | grep -v 'deployment/security.md' \
		|| (echo "✗ Unverified compliance claim found (see lines above)"; exit 1)
	@echo "✓ No unverified compliance claims."

## Verify the LLM-facing mirrors (llms.txt, llms-full.txt, per-page .md)
llm-check: build
	@./scripts/llm-check.sh public

## Show site statistics
stats:
	@echo "Pages:"
	@find content -name "*.md" | wc -l | tr -d ' '
	@echo "Words (approx.):"
	@find content -name "*.md" -exec cat {} + | wc -w | tr -d ' '

help: ## Show this help
	@grep -E '^## ' Makefile | sed 's/^## /  /'
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*' Makefile | grep -v '^\.' | sed 's/:.*//; s/^/  make /'
