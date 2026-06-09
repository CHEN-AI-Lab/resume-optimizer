#!/bin/bash
set -euo pipefail

echo "🚀 Resume Optimizer — Deploy"
echo "=============================="

# Run quality gate first
echo ""
echo "Running quality gate..."
bash scripts/check.sh

# Deploy to Vercel
if command -v vercel &>/dev/null; then
  echo ""
  echo "Deploying to Vercel..."
  vercel --prod
else
  echo ""
  echo "⚠️  Vercel CLI not found."
  echo "   Install: npm i -g vercel"
  echo "   Then run: vercel --prod"
  echo ""
  echo "Or push to main branch — Vercel auto-deploys."
fi

echo "✅ Deploy complete!"