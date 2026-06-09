"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Nav from "@/components/nav";
import UploadZone from "@/components/upload-zone";
import ResultCard from "@/components/result-card";
import PricingCard from "@/components/pricing-card";
import Link from "next/link";
import { toast } from "sonner";
import { extractTextFromFile } from "@/lib/file-parser";

const DAILY_LIMIT = 3;
const LIMIT_KEY = "resume_daily_usage";

interface AnalysisResult {
  score: number;
  atsScore: number;
  keywords: string[];
  suggestions: string[];
  improvedHtml: string;
}

function getDailyCount(): number {
  if (typeof window === "undefined") return 0;
  const today = new Date().toISOString().slice(0, 10);
  const stored = JSON.parse(localStorage.getItem(LIMIT_KEY) || "{}");
  return stored[today] || 0;
}

function incrementDailyCount(): number {
  const today = new Date().toISOString().slice(0, 10);
  const stored = JSON.parse(localStorage.getItem(LIMIT_KEY) || "{}");
  stored[today] = (stored[today] || 0) + 1;
  localStorage.setItem(LIMIT_KEY, JSON.stringify(stored));
  return stored[today];
}

export default function AnalyzePage() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1];
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [loadingPro, setLoadingPro] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [jobDescription, setJobDescription] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login?callbackUrl=/${locale}/analyze`);
    }
  }, [status, router, locale]);

  // Fetch pro status from server
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/status")
        .then((res) => res.json())
        .then((data) => {
          setPaid(data.pro);
          if (data.pro) {
            localStorage.setItem("resume_paid", "true");
          }
          setLoadingPro(false);
        })
        .catch(() => {
          setLoadingPro(false);
        });
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      const count = getDailyCount();
      setRemaining(Math.max(0, DAILY_LIMIT - count));
    }
  }, [status]);

  const canAnalyze = paid || remaining > 0;

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setError(null);
    setResults(null);

    if (!canAnalyze) {
      setError(t("result.freeUsed"));
      return;
    }

    setIsAnalyzing(true);
    try {
      const { text } = await extractTextFromFile(f);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, jobDescription: jobDescription || undefined }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || t("result.error"));
      }

      const data = await res.json();
      setResults(data);

      if (!paid) {
        const newCount = incrementDailyCount();
        setRemaining(Math.max(0, DAILY_LIMIT - newCount));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : t("result.error");
      // Special handling for legacy .doc files that couldn't be parsed
      if (msg === "__DOC_CONVERSION__") {
        setError("当前版本不支持直接解析旧版 .doc 格式，请转换为 .docx 格式后重试。");
      } else {
        setError(msg);
      }
    }
    setIsAnalyzing(false);
  }, [canAnalyze, paid, jobDescription, t]);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      // API returned error without throwing
      toast.error(data.error || t("result.checkoutError"));
    } catch (e) {
      toast.error(t("result.checkoutError"));
    }
    setCheckoutLoading(false);
  };

  const handleDownloadPdf = () => {
    if (results?.improvedHtml) {
      const blob = new Blob(
        [
          `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Optimized Resume</title></head><body>${results.improvedHtml}</body></html>`,
        ],
        { type: "text/html" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `optimized-resume-${file?.name || "output"}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (status === "loading" || loadingPro) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("upload.title")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {paid ? t("upload.proBadge") : t("upload.remaining", { count: remaining })}
          </p>
        </div>

        {/* Job Description (optional) */}
        {!results && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("upload.jdLabel")}
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t("upload.jdPlaceholder")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        )}

        {/* Upload */}
        {!results && (
          <UploadZone
            onFileSelected={handleFile}
            isAnalyzing={isAnalyzing}
            disabled={!canAnalyze}
          />
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <ResultCard
            results={results}
            onDownload={handleDownloadPdf}
            isPaid={paid}
            onUpgrade={handleUpgrade}
          />
        )}

        {/* Show upload another button when results exist */}
        {results && (
          <div className="text-center">
            <button
              onClick={() => { setResults(null); setFile(null); setError(null); }}
              className="text-sm text-blue-600 hover:underline"
            >
              {t("upload.another")}
            </button>
          </div>
        )}

        {/* Upgrade prompt for free users who hit limit */}
        {!results && !canAnalyze && !paid && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("pricing.pro.name")}</h3>
            <p className="text-sm text-gray-600 mb-4">{t("pricing.pro.desc")}</p>
            <PricingCard onUpgrade={handleUpgrade} isLoading={checkoutLoading} />
          </div>
        )}
      </main>
    </div>
  );
}