"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Nav from "@/components/nav";
import { toast } from "sonner";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = pathname.split("/")[1];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Show welcome toast if redirected after registration
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success(t("auth.registerSuccess"));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError(t("auth.emailRequired")); return; }
    if (!password) { setError(t("auth.passwordRequired")); return; }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("auth.loginError"));
      } else {
        toast.success(t("auth.loginSuccess"));
        const callbackUrl = searchParams.get("callbackUrl") || `/${locale}/analyze`;
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError(t("auth.loginError"));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-sm mx-auto px-4 pt-20">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t("auth.loginTitle")}</h1>
          <p className="text-sm text-gray-500 mb-6">{t("auth.needLogin")}</p>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? "..." : t("auth.loginBtn")}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            {t("auth.noAccount")}{" "}
            <Link href={`/${locale}/register`} className="text-blue-600 hover:underline">
              {t("auth.registerLink")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}