# Resume Optimizer — Architecture

## Overview

AI-powered resume optimization SaaS. Users upload/ paste resume content → AI analyzes structure, keywords, ATS compatibility → returns score + suggestions + improved HTML resume.

## System Design

```
User Browser → Next.js App (apps/web) → AI API (SenseTime) → Response
                                    ↕
                            Creem Payment (Pro tier)
```

## Route Design

| Route | Type | Purpose |
|-------|------|---------|
| `/[locale]` | Page | Landing: hero, features, pricing |
| `/[locale]/analyze` | Page | Paste resume → AI analysis |
| `/[locale]/success` | Page | Post-payment success |
| `/[locale]/privacy` | Page | Privacy policy |
| `/api/analyze` | POST | Resume analysis (AI call) |
| `/api/checkout` | POST | Create Creem checkout session |
| `/api/webhooks/creem` | POST | Payment webhook callback |

## Shared Layer (`shared/`)

| Module | Contents |
|--------|----------|
| `types/` | ResumeAnalysisResult, PricingTier, LocaleConfig |
| `constants/` | PRICING_TIERS, LOCALES, FREE_DAILY_LIMIT |
| `api/` | ai.ts (SenseTime client), creem.ts (Creem API wrapper) |
| `messages/` | zh-CN.json, en.json (next-intl translations) |
| `utils/` | Pure functions: generateId, formatDate, truncateText |

## Data Flow

1. Free user visits landing → sees pricing (¥19.9 for Pro)
2. User pastes resume text on `/analyze` → POST `/api/analyze`
3. Server calls SenseTime AI → returns score/ATS/suggestions/HTML
4. Free tier allows 3 analyses/day (cookie-tracked)
5. Pro user clicks "Upgrade" → POST `/api/checkout` → Creem payment page
6. Creem webhook → marks user as Pro (IP-based lookup)