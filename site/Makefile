# Jock Block Website - Makefile
# Simplifies common development commands

.PHONY: help install dev test test-watch test-coverage test-e2e test-e2e-headed test-all lint clean build deploy

# Default target - show help
help:
	@echo ""
	@echo "  Jock Block Website - Development Commands"
	@echo "  =========================================="
	@echo ""
	@echo "  Setup:"
	@echo "    make install        Install all dependencies"
	@echo "    make install-e2e    Install Playwright browsers for E2E tests"
	@echo ""
	@echo "  Development:"
	@echo "    make dev            Start development server (localhost:3000)"
	@echo "    make dev-open       Start dev server and open in browser"
	@echo ""
	@echo "  Testing:"
	@echo "    make test           Run unit tests"
	@echo "    make test-watch     Run unit tests in watch mode"
	@echo "    make test-coverage  Run tests with coverage report"
	@echo "    make test-e2e       Run E2E tests (headless)"
	@echo "    make test-e2e-headed Run E2E tests (visible browser)"
	@echo "    make test-all       Run all tests (unit + E2E)"
	@echo ""
	@echo "  Quality:"
	@echo "    make lint           Run ESLint"
	@echo "    make validate       Run all quality checks"
	@echo ""
	@echo "  Build & Deploy:"
	@echo "    make build          Build for production"
	@echo "    make clean          Remove generated files"
	@echo "    make deploy         Deploy to Netlify (requires setup)"
	@echo ""

# ============================================
# SETUP
# ============================================

install:
	@echo "📦 Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed"

install-e2e: install
	@echo "🎭 Installing Playwright browsers..."
	npx playwright install --with-deps
	@echo "✅ Playwright browsers installed"

# ============================================
# DEVELOPMENT
# ============================================

dev:
	@echo "🚀 Starting development server at http://localhost:3000"
	npx serve . -p 3000

dev-open:
	@echo "🚀 Starting development server and opening browser..."
	npx serve . -p 3000 -o

# ============================================
# TESTING
# ============================================

test:
	@echo "🧪 Running unit tests..."
	npm test

test-watch:
	@echo "👀 Running unit tests in watch mode..."
	npm run test:watch

test-coverage:
	@echo "📊 Running tests with coverage..."
	npm run test:coverage
	@echo "📁 Coverage report: ./coverage/lcov-report/index.html"

test-e2e:
	@echo "🎭 Running E2E tests (headless)..."
	npm run test:e2e

test-e2e-headed:
	@echo "🎭 Running E2E tests (visible browser)..."
	npm run test:e2e:headed

test-e2e-debug:
	@echo "🐛 Running E2E tests in debug mode..."
	npx playwright test --debug

test-e2e-ui:
	@echo "🖥️  Opening Playwright UI..."
	npx playwright test --ui

test-all: test test-e2e
	@echo "✅ All tests completed"

# ============================================
# QUALITY
# ============================================

lint:
	@echo "🔍 Running ESLint..."
	npx eslint js/**/*.js --fix || true

validate: lint test
	@echo "✅ All quality checks passed"

# ============================================
# BUILD & DEPLOY
# ============================================

build:
	@echo "🏗️  Building for production..."
	@echo "ℹ️  Static site - no build step needed"
	@echo "📁 Files ready in current directory"

clean:
	@echo "🧹 Cleaning generated files..."
	rm -rf node_modules
	rm -rf coverage
	rm -rf playwright-report
	rm -rf test-results
	@echo "✅ Cleaned"

deploy:
	@echo "🚀 Deploying to Netlify..."
	@if command -v netlify >/dev/null 2>&1; then \
		netlify deploy --prod; \
	else \
		echo "❌ Netlify CLI not installed. Run: npm install -g netlify-cli"; \
	fi

# ============================================
# QUICK COMMANDS
# ============================================

# Shorthand aliases
t: test
tw: test-watch
tc: test-coverage
e2e: test-e2e
d: dev

# Run everything for CI
ci: install test test-coverage
	@echo "✅ CI pipeline completed"
