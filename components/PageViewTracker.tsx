"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 自動追蹤頁面瀏覽的 Client Component
 * 每次路由切換時會呼叫 /api/track 記錄訪問資料
 * 不追蹤 /admin 及 /login 頁面
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 跳過後台與登入頁面，避免記錄管理員自身的訪問
    if (pathname.startsWith("/admin") || pathname === "/login") return;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
      }),
    }).catch(() => {
      // 靜默失敗，不影響使用者體驗
    });
  }, [pathname]);

  return null;
}
