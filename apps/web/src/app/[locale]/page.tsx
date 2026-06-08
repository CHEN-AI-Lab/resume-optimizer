"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Nav from "@/components/nav";
import PricingCard from "@/components/pricing-card";
import { useState } from "react";

export default function HomePage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch (e) {
      console.error("Checkout failed:", e);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Powered • 30秒出结果
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {t("hero.subtitle")}
            </p>
            <Link
              href={`/${locale}/analyze`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              {t("hero.cta")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            {t("features.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(["ats", "suggestions", "format"] as const).map((key, i) => (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition-all animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  {key === "ats" && (
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {key === "suggestions" && (
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {key === "format" && (
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{t(`features.${key}.title`)}</h3>
                <p className="text-sm text-gray-600">{t(`features.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-4xl mx-auto px-4 pb-20" id="pricing">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">定价 / Pricing</h2>
          <PricingCard onUpgrade={handleUpgrade} isLoading={loading} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between text-sm text-gray-500">
          <p>{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-gray-700">{t("footer.privacy")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}