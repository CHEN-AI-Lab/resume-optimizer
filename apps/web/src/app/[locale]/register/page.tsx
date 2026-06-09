"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Nav from "@/components/nav";
import { toast } from "sonner";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError(t("auth.nameRequired")); return; }
    if (!email.trim()) { setError(t("auth.emailRequired")); return; }
    if (!password || password.length < 6) { setError(t("auth.passwordMin")); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("auth.registerError"));
        return;
      }

      // Redirect to login with success message
      router.push(`/${locale}/login?registered=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.registerError"));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-sm mx-auto px-4 pt-20">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t("auth.registerTitle")}</h1>
          <p className="text-sm text-gray-500 mb-6">{t("auth.registerSubtitle")}</p>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : t("auth.registerBtn")}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            {t("auth.hasAccount")}{" "}
            <Link href={`/${locale}/login`} className="text-blue-600 hover:underline">
              {t("auth.loginLink")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}