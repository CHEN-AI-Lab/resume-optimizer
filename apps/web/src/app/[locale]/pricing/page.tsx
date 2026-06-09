"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import Nav from "@/components/nav";

export default function PricingPage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!session) {
      router.push(`/${locale}/login?callbackUrl=/${locale}/pricing`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      // API returned error
      toast.error(data.error || t("result.checkoutError"));
    } catch (e) {
      toast.error(t("result.checkoutError"));
    }
    setLoading(false);
  };

  const features = [
    {
      name: t("pricing.free.name"),
      price: t("pricing.free.price"),
      desc: t("pricing.free.desc"),
      items: [
        t("pricing.free.features.0"),
        t("pricing.free.features.1"),
        t("pricing.free.features.2"),
      ],
    },
    {
      name: t("pricing.pro.name"),
      price: t("pricing.pro.price"),
      desc: t("pricing.pro.desc"),
      items: [
        t("pricing.pro.features.0"),
        t("pricing.pro.features.1"),
        t("pricing.pro.features.2"),
        t("pricing.pro.features.3"),
        t("pricing.pro.features.4"),
      ],
      popular: true,
      cta: t("pricing.pro.cta"),
    },
  ];

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("pricing.title")}</h1>
          <p className="text-gray-600">{t("pricing.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {features.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative bg-white border rounded-2xl p-8 ${
                plan.popular
                  ? "border-blue-500 shadow-lg shadow-blue-100 ring-1 ring-blue-500"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-3">{plan.price}</p>
              <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
              <ul className="mt-6 space-y-3">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={plan.popular ? handleUpgrade : () => router.push(`/${locale}/analyze`)}
                disabled={loading}
                className={`w-full mt-8 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {loading ? "..." : (plan.cta || t("hero.cta"))}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t("pricing.compareTitle")}</h2>
          <div className="border border-gray-200 rounded-2xl divide-y divide-gray-100">
            {[
              { label: t("pricing.free.features.0"), free: "✓", pro: "✓" },
              { label: t("pricing.free.features.1"), free: "3", pro: t("pricing.unlimited") },
              { label: t("pricing.free.features.2"), free: "✓", pro: "✓" },
              { label: t("pricing.pro.features.0"), free: "—", pro: "✓" },
              { label: t("pricing.pro.features.1"), free: "—", pro: "✓" },
              { label: t("pricing.pro.features.2"), free: "—", pro: "✓" },
              { label: t("pricing.pro.features.3"), free: "—", pro: "✓" },
            ].map((row) => (
              <div key={row.label} className="flex items-center px-6 py-3 text-sm">
                <span className="flex-1 text-gray-700">{row.label}</span>
                <span className="w-20 text-center text-gray-500">{row.free}</span>
                <span className="w-20 text-center text-green-600 font-medium">{row.pro}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}