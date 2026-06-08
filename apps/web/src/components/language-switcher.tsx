"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const nextLocale = locale === "zh-CN" ? "en" : "zh-CN";
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000`;
      router.replace(newPath);
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 0a10 10 0 01-6 9m6-9a10 10 0 016 9m-6 9v2m0-2a10 10 0 01-6-9m6 9a10 10 0 016-9" />
      </svg>
      {locale === "zh-CN" ? "English" : "中文"}
    </button>
  );
}