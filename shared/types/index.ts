export interface ResumeAnalysisResult {
  score: number;
  atsScore: number;
  keywords: string[];
  suggestions: string[];
  improvedHtml: string;
}

export interface PricingTier {
  nameKey: string;
  price: string;
  priceKey: string;
  descKey: string;
  features: string[];
  isPro: boolean;
  ctaKey?: string;
}

export interface LocaleConfig {
  code: string;
  label: string;
  hrefLang: string;
}