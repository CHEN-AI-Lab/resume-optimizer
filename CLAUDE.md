# Resume Optimizer

## Tech Stack
- Web: Next.js 15 App Router + TypeScript strict + Tailwind CSS 4
- i18n: next-intl v4 (zh-CN + en, cookie-only)
- AI: SenseTime (sensenova-6.7-flash-lite)
- Payment: Creem (test mode)
- Build: pnpm workspace monorepo

## Project Structure
```
resume-optimizer/
├── docs/             ← Architecture, progress, decisions
├── scripts/          ← Setup, check, deploy
├── shared/           ← Types, constants, api, utils, validators, hooks, messages
├── apps/web/         ← Next.js app (pages, components, api routes)
├── packages/ui/      ← Shared UI components
├── tests/unit/       ← Unit tests
├── tests/e2e/        ← E2E tests
└── .github/workflows/← CI/CD
```

## Commands
```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # Lint check
pnpm test             # Run tests
pnpm test:e2e         # Run E2E tests
scripts/check.sh      # Full quality gate
```

## Quality Gates (run before push)
- [ ] tsc --noEmit (no type errors)
- [ ] lint pass
- [ ] No console.log in production code
- [ ] No hardcoded secrets
- [ ] pnpm build passes
- [ ] Core tests pass

## Multi-End Architecture
- shared/ → all cross-platform code
- apps/web → Next.js UI (currently only end)
- Future: apps/weapp, apps/desktop, apps/app

## Deploy
- Production: Vercel auto-deploy on main branch push