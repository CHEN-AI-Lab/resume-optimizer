# Resume Optimizer — SOUL

## Product Definition
AI-powered resume optimization tool. Upload a resume → AI analysis → get score/ATS match/keywords/suggestions/improved HTML. Free tier (3x/day) + Pro ¥19.9 (lifetime).

## Tech Stack
- Next.js 15 App Router + TypeScript strict
- Tailwind CSS 4
- next-intl v4 (zh-CN + en, cookie-only)
- SenseTime AI (sensenova-6.7-flash-lite)
- Creem payment (test mode)
- pnpm workspace monorepo

## Directory Structure
```
resume-optimizer/
├── apps/web/          ← Next.js application
│   ├── src/
│   │   ├── app/[locale]/  ← Pages (home, analyze, success, privacy)
│   │   ├── app/api/      ← API routes (analyze, checkout, webhooks)
│   │   ├── components/   ← UI components
│   │   ├── lib/          ← AI, Creem library
│   │   └── i18n/         ← i18n request config
│   └── messages/         ← Translation files
├── docs/
├── package.json          ← Workspace root
└── pnpm-workspace.yaml
```

## Commands
```bash
pnpm dev       # Start dev server (apps/web)
pnpm build     # Production build
pnpm lint      # ESLint
```