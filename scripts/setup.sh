#!/bin/bash
set -euo pipefail

echo "🔧 Resume Optimizer — Setup"
echo "============================="

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Install Node.js 18+ first."
  exit 1
fi

NODE_VERSION=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required (found: $(node -v))"
  exit 1
fi
echo "✓ Node.js $(node -v)"

# Check pnpm
if ! command -v pnpm &>/dev/null; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm
fi
echo "✓ pnpm $(pnpm -v)"

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install

# Copy env if not present
if [ ! -f .env.local ]; then
  if [ -f .env.example ]; then
    cp .env.example .env.local
    echo "⚠️  Created .env.local from .env.example — edit with your API keys"
  fi
fi

echo ""
echo "✅ Setup complete! Run: pnpm dev"