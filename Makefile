.PHONY: setup serve build clean theme

# Hugo PaperMod theme
THEME_URL  := https://github.com/adityatelange/hugo-PaperMod.git
THEME_DIR  := themes/PaperMod

# ── Setup ────────────────────────────────────────────────────────

## Install Hugo theme as a git submodule
setup: theme
	@echo "✓ Setup complete. Run 'make serve' to start the dev server."

theme:
	@if [ ! -d "$(THEME_DIR)" ]; then \
		echo "Installing PaperMod theme..."; \
		git init 2>/dev/null || true; \
		git submodule add --depth=1 $(THEME_URL) $(THEME_DIR) 2>/dev/null || \
		git clone --depth=1 $(THEME_URL) $(THEME_DIR); \
	else \
		echo "Theme already installed."; \
	fi

# ── Development ──────────────────────────────────────────────────

## Start the Hugo development server with live reload
serve: theme
	hugo server -D --bind 0.0.0.0 --port 1313

## Start in production mode (no drafts)
serve-prod: theme
	hugo server --bind 0.0.0.0 --port 1313

# ── Build ────────────────────────────────────────────────────────

## Build the static site for production
build: theme
	hugo --minify

## Build and output to a custom directory
build-to:
	hugo --minify -d $(DEST)

# ── Utilities ────────────────────────────────────────────────────

## Remove generated files
clean:
	rm -rf public/ resources/_gen/

## Validate all internal links
check:
	hugo --minify 2>&1 | grep -i "error\|warn" || echo "✓ No issues found."

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
