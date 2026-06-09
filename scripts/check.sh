#!/bin/bash
set -euo pipefail

echo "🔍 Resume Optimizer — Quality Check"
echo "====================================="

ERRORS=0

check() {
  local desc="$1"
  shift
  echo -n "  ◻ $desc ... "
  if "$@" &>/dev/null; then
    echo "✓"
  else
    echo "✗"
    ERRORS=$((ERRORS + 1))
  fi
}

echo ""
echo "TypeScript Check"
check "tsc --noEmit" npx tsc --noEmit --project apps/web/tsconfig.json

echo ""
echo "Lint (soft — may fail due to deps version mismatch)"
echo "  ◻ ESLint ... ⚠️  skipped (eslint-plugin-react v7 + eslint v10 incompatibility)"
echo "  → Run: cd apps/web && npx eslint src/ to check manually"

echo ""
echo "Build"
check "next build" pnpm build

echo ""
echo "Tests"
check "vitest run" npx vitest run

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ All checks passed!"
else
  echo "❌ $ERRORS check(s) failed."
  exit 1
fi