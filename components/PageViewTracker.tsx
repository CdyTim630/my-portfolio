"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSupabaseConfig } from "@/lib/supabase/config";

/**
 * 自動追蹤頁面瀏覽的 Client Component
 * 每次路由切換時會呼叫 /api/track 記錄訪問資料
 * 不追蹤 /admin 及 /login 頁面
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!getSupabaseConfig() || navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    // 跳過後台與登入頁面，避免記錄管理員自身的訪問
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname === "/login") return;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer ? new URL(document.referrer).origin : null,
      }),
    }).catch(() => {
      // 靜默失敗，不影響使用者體驗
    });
  }, [pathname]);

  return null;
}
