"use client";

import { useState, useEffect, useCallback } from "react";

const DAILY_LIMIT_KEY = "resume_daily_count";
const PRO_KEY = "resume_pro";

/**
 * Track daily free usage (resets daily via date in cookie)
 */
export function useDailyLimit(freeLimit: number = 3) {
  const [used, setUsed] = useState(0);
  const [remaining, setRemaining] = useState(freeLimit);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DAILY_LIMIT_KEY);
      if (raw) {
        const { date, count } = JSON.parse(raw);
        const today = new Date().toISOString().split("T")[0];
        if (date === today) {
          setUsed(count);
          setRemaining(Math.max(0, freeLimit - count));
        } else {
          localStorage.removeItem(DAILY_LIMIT_KEY);
        }
      }
    } catch {
      // localStorage unavailable (SSR)
    }
  }, [freeLimit]);

  const increment = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const newCount = used + 1;
    try {
      localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify({ date: today, count: newCount }));
    } catch {
      // quota exceeded or SSR
    }
    setUsed(newCount);
    setRemaining(Math.max(0, freeLimit - newCount));
  }, [used, freeLimit]);

  return { used, remaining, increment, canUse: remaining > 0 };
}

/**
 * Check if user has Pro access
 */
export function useProStatus() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    try {
      const val = localStorage.getItem(PRO_KEY);
      setIsPro(val === "true");
    } catch {
      // SSR
    }
  }, []);

  const setPro = useCallback(() => {
    try {
      localStorage.setItem(PRO_KEY, "true");
    } catch {
      // quota exceeded
    }
    setIsPro(true);
  }, []);

  return { isPro, setPro };
}