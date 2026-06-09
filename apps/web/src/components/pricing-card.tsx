"use client";

import { useTranslations } from "next-intl";

interface PricingCardProps {
  onUpgrade: () => void;
  isLoading: boolean;
}

export default function PricingCard({ onUpgrade, isLoading }: PricingCardProps) {
  const t = useTranslations("pricing");

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      {/* Free */}
      <div className="border border-gray-200 rounded-2xl p-6 bg-white">
        <h3 className="text-lg font-semibold text-gray-900">{t("free.name")}</h3>
        <p className="text-3xl font-bold mt-2">{t("free.price")}</p>
        <p className="text-sm text-gray-500 mt-1">{t("free.desc")}</p>
        <ul className="mt-4 space-y-2">
          {(t.raw("free.features") as string[]).map((f: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-6 px-4 py-2.5 text-center text-sm text-gray-500 border border-gray-200 rounded-xl">
          {t("currentPlan")}
        </div>
      </div>

      {/* Pro */}
      <div className="border-2 border-blue-500 rounded-2xl p-6 bg-blue-50 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {t("recommended")}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{t("pro.name")}</h3>
        <p className="text-3xl font-bold mt-2">{t("pro.price")}</p>
        <p className="text-sm text-gray-500 mt-1">{t("pro.desc")}</p>
        <ul className="mt-4 space-y-2">
          {(t.raw("pro.features") as string[]).map((f: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <button
          onClick={onUpgrade}
          disabled={isLoading}
          className="mt-6 w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? t("processing") : t("pro.cta")}
        </button>
      </div>
    </div>
  );
}