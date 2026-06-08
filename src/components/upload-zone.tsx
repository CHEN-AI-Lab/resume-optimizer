"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isAnalyzing: boolean;
  disabled: boolean;
}

export default function UploadZone({ onFileSelected, isAnalyzing, disabled }: UploadZoneProps) {
  const t = useTranslations("upload");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        alert(t("formats"));
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : disabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        disabled={disabled}
      />
      {isAnalyzing ? (
        <div className="space-y-3">
          <div className="flex justify-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full typing-dot" />
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full typing-dot" />
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full typing-dot" />
          </div>
          <p className="text-blue-600 font-medium">{t("analyzing")}</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">{t("drag")}</p>
          <p className="text-sm text-gray-500">{t("formats")}</p>
          <p className="text-xs text-gray-400 mt-2">{t("limit")}</p>
        </>
      )}
    </div>
  );
}