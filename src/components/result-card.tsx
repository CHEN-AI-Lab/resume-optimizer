"use client";

import { useTranslations } from "next-intl";

interface ResultCardProps {
  results: {
    score: number;
    atsScore: number;
    keywords: string[];
    suggestions: string[];
    improvedHtml: string;
  } | null;
  onDownload: () => void;
  isPaid: boolean;
  onUpgrade: () => void;
}

export default function ResultCard({ results, onDownload, isPaid, onUpgrade }: ResultCardProps) {
  const t = useTranslations("result");

  if (!results) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Scores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">{t("score")}</p>
          <p className={`text-3xl font-bold ${getScoreColor(results.score)}`}>
            {results.score}/100
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">{t("atsScore")}</p>
          <p className={`text-3xl font-bold ${getScoreColor(results.atsScore)}`}>
            {results.atsScore}%
          </p>
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">{t("keywords")}</h3>
        <div className="flex flex-wrap gap-2">
          {results.keywords.map((kw, i) => (
            <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">{t("suggestions")}</h3>
        <ul className="space-y-2">
          {results.suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 mt-0.5 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Download / Upgrade */}
      <div className="text-center">
        {isPaid ? (
          <button
            onClick={onDownload}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            {t("downloadPdf")}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">{t("improveNow")}</p>
            <button
              onClick={onUpgrade}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              {t("upgrade")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}