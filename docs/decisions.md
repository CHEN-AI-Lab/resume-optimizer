# Key Decisions

## ADR-001: Cookie-only i18n (no URL detection)

- **Context**: next-intl v4 supports locale detection from Accept-Language header, but this causes flash of wrong locale on first load.
- **Decision**: Cookie-only with `localeDetection: false` in middleware. User preference set via LanguageSwitcher dropdown.
- **Consequence**: Clean UX, no redirect loops. User must explicitly switch locale once.

## ADR-002: Lifetime license (¥19.9), not subscription

- **Context**: Resume optimization is a one-time need for most users (1-2 job searches per year).
- **Decision**: One-time payment ¥19.9 → lifetime Pro. No monthly recurring billing.
- **Consequence**: Lower ARPU but higher conversion. No subscription management needed.

## ADR-003: Cookie-based daily limit (no database)

- **Context**: No database in project — keeping zero infrastructure cost.
- **Decision**: Track free daily usage (3/day) in browser cookie via shared/hooks.
- **Consequence**: Limit resets on cookie clear. Good enough for MVP; add DB later if needed.

## ADR-004: SenseTime AI as backend

- **Context**: Need cheap Chinese AI API. User already has SenseTime API key.
- **Decision**: Use SenseTime's OpenAI-compatible endpoint (sensenova-6.7-flash-lite).
- **Consequence**: ¥0.003/request → ¥19.9/charge = 99.98% gross margin. Can switch to any OpenAI-compatible API.

## ADR-005: Monorepo with shared/ layer

- **Context**: Future mobile app / mini-program may need same business logic.
- **Decision**: pnpm workspace monorepo with shared/ containing types, constants, API clients, translations.
- **Consequence**: Easy to add apps/weapp or apps/app later. Cross-platform code reuse enforced by SOUL.md rules.