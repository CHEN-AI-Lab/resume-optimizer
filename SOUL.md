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
├── apps/web/             ← Next.js application (pages, UI components, API routes)
│   ├── src/
│   │   ├── app/[locale]/ ← Pages (home, analyze, success, privacy)
│   │   ├── app/api/      ← API routes (thin handlers, logic in shared/)
│   │   ├── components/   ← UI components
│   │   └── i18n/         ← next-intl request config
│   ├── next.config.ts
│   └── tsconfig.json
├── shared/               ← Cross-platform shared layer
│   ├── api/              ← API client wrappers (ai.ts, creem.ts)
│   ├── constants/        ← Constants, enums, config data
│   ├── messages/         ← Translation files (zh-CN.json, en.json)
│   ├── types/            ← Type definitions, DTOs, interfaces
│   └── utils/            ← Pure functions, utility functions
├── package.json           ← Workspace root
└── pnpm-workspace.yaml
```

## Rules
- Code that is cross-platform → `shared/`
- Framework-specific code (Next.js) → `apps/web/`
- Never put shared logic in `apps/*/src/lib/` or `apps/*/src/hooks/`

## Commands
```bash
pnpm dev       # Start dev server (apps/web)
pnpm build     # Production build
pnpm lint      # ESLint
```