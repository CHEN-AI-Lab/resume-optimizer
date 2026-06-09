# Resume Optimizer

AI 智能简历优化工具。上传简历 → AI 分析 → 获取评分/ATS 匹配度/关键词/优化建议/改进版 HTML 简历。

AI-powered resume optimization: upload → AI analysis → score/ATS match/keywords/suggestions/improved HTML.

## Features

- **AI Analysis**: Score your resume, check ATS compatibility, get keyword suggestions
- **Free Tier**: 3 analyses per day, no login required
- **Pro Tier**: ¥19.9 lifetime — unlimited analyses, priority processing
- **Bilingual**: Chinese (zh-CN) and English (en)

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start dev server (opens on http://localhost:3000)
pnpm dev
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| i18n | next-intl v4 (zh-CN + en) |
| AI API | SenseTime (OpenAI-compatible) |
| Payment | Creem (test mode) |
| Monorepo | pnpm workspace |

## Project Structure

```
resume-optimizer/
├── CLAUDE.md           ← Project map for AI agents
├── docs/               ← Architecture, progress, decisions
├── scripts/            ← Setup, check, deploy automation
├── shared/             ← Cross-platform code (types, constants, api, utils, validators, hooks, messages)
├── apps/web/           ← Next.js application
├── packages/ui/        ← Shared UI components
├── tests/unit/         ← Unit tests (Vitest)
├── tests/e2e/          ← E2E tests (Playwright)
└── .github/workflows/  ← CI/CD pipelines
```

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint check |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests (requires Playwright) |
| `bash scripts/check.sh` | Full quality gate |
| `bash scripts/setup.sh` | First-time setup |

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `OPENAI_API_KEY` — SenseTime API key (sk-...)
- `CREEM_API_KEY` — Creem payment key (creem_test_... for test mode)
- `CREEM_PRODUCT_ID` — Creem product ID for the Pro tier

## Deployment

Push to `main` branch → Vercel auto-deploys.
