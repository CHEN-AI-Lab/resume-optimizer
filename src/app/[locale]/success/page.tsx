"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";

export default function SuccessPage() {
  const t = useTranslations("success");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("resume_paid", "true");
    localStorage.removeItem("resume_daily_usage");

    const timer = setTimeout(() => {
      router.push(`/${locale}/analyze`);
    }, 4000);
    return () => clearTimeout(timer);
  }, [locale, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-lg mx-auto px-4 pt-20 text-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{t("title")}</h1>
          <p className="text-gray-600 mb-8">{t("description")}</p>
          <Link
            href={`/${locale}/analyze`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("back")}
          </Link>
          <p className="text-xs text-gray-400 mt-4">3 秒后自动跳转</p>
        </div>
      </main>
    </div>
  );
}