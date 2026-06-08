"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Nav from "@/components/nav";
import UploadZone from "@/components/upload-zone";
import ResultCard from "@/components/result-card";
import PricingCard from "@/components/pricing-card";
import Link from "next/link";

const DAILY_LIMIT = 3;
const LIMIT_KEY = "resume_daily_usage";
const PAID_KEY = "resume_paid";

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

function isPaid(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PAID_KEY) === "true";
}

function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export default function AnalyzePage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    setPaid(isPaid());
    const count = getDailyCount();
    setRemaining(Math.max(0, DAILY_LIMIT - count));
  }, []);

  const canAnalyze = paid || remaining > 0;

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setError(null);
    setResults(null);

    if (!canAnalyze) {
      setError("今日免费次数已用完");
      return;
    }

    setIsAnalyzing(true);
    try {
      const text = await extractTextFromFile(f);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, jobDescription: jobDescription || undefined }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "分析失败");
      }

      const data = await res.json();
      setResults(data);

      if (!paid) {
        const newCount = incrementDailyCount();
        setRemaining(Math.max(0, DAILY_LIMIT - newCount));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "分析失败，请重试");
    }
    setIsAnalyzing(false);
  }, [canAnalyze, paid, jobDescription]);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch (e) {
      console.error("Checkout failed:", e);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("upload.title")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {paid ? "专业版 · 无限使用" : `今日剩余 ${remaining} 次免费分析`}
          </p>
        </div>

        {/* Job Description (optional) */}
        {!results && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目标职位描述（可选，让 AI 更有针对性地优化）
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="粘贴目标职位的 JD 描述..."
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
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-700 text-sm mb-2">{error}</p>
            {!paid && remaining <= 0 && (
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {t("result.upgrade")}
              </button>
            )}
            {remaining > 0 && (
              <button
                onClick={() => { setError(null); setFile(null); }}
                className="text-sm text-blue-600 hover:underline"
              >
                {t("result.retry")}
              </button>
            )}
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

        {/* Pricing for free users who haven't uploaded */}
        {!file && !results && !error && remaining <= 0 && !paid && (
          <div className="pt-8">
            <PricingCard onUpgrade={handleUpgrade} isLoading={checkoutLoading} />
          </div>
        )}

        {/* Upload another */}
        {results && (
          <div className="text-center">
            <button
              onClick={() => { setResults(null); setFile(null); setError(null); }}
              className="text-sm text-blue-600 hover:underline"
            >
              上传另一份简历
            </button>
          </div>
        )}
      </main>
    </div>
  );
}