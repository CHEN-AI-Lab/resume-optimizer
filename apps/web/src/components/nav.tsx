"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import LanguageSwitcher from "./language-switcher";

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { data: session } = useSession();

  const locale = pathname.split("/")[1];
  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/pricing`, label: t("pricing") },
    { href: `/${locale}/analyze`, label: t("analyze") },
  ];

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-semibold text-gray-900">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Resume Optimizer</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === link.href
                  ? "text-blue-600 bg-blue-50 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              {t("logout")}
            </button>
          ) : (
            <Link
              href={`/${locale}/login`}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname.endsWith("/login")
                  ? "text-blue-600 bg-blue-50 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {t("login")}
            </Link>
          )}
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}