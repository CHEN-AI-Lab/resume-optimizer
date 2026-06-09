import type { PricingTier, LocaleConfig } from "../types";

export const LOCALES: LocaleConfig[] = [
  { code: "zh-CN", label: "中文", hrefLang: "zh-CN" },
  { code: "en", label: "English", hrefLang: "en" },
];

export const DEFAULT_LOCALE = "zh-CN";

export const PRICING_TIERS: PricingTier[] = [
  {
    nameKey: "pricing.free.name",
    price: "¥0",
    priceKey: "pricing.free.price",
    descKey: "pricing.free.desc",
    features: ["pricing.free.features.0", "pricing.free.features.1", "pricing.free.features.2"],
    isPro: false,
  },
  {
    nameKey: "pricing.pro.name",
    price: "¥19.9",
    priceKey: "pricing.pro.price",
    descKey: "pricing.pro.desc",
    features: [
      "pricing.pro.features.0",
      "pricing.pro.features.1",
      "pricing.pro.features.2",
      "pricing.pro.features.3",
      "pricing.pro.features.4",
    ],
    isPro: true,
    ctaKey: "pricing.pro.cta",
  },
];

export const FREE_DAILY_LIMIT = 3;

export const PRO_PRICE_CNY = 19.9;
export const PRO_PRICE_USD = 1.99;