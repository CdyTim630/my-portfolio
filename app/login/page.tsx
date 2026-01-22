"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        // 註冊
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });
        if (error) throw error;
        setMessage("註冊成功！請檢查你的信箱確認帳號。");
      } else {
        // 登入
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // 登入成功，導向 admin
        window.location.href = "/admin";
      }
    } catch (error: any) {
      setMessage(error.message || "發生錯誤");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMagicLink() {
    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) throw error;
      setMessage("Magic Link 已寄出！請檢查你的信箱。");
    } catch (error: any) {
      setMessage(error.message || "發生錯誤");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#18181B]/10 p-8 shadow-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="h-16 w-16 rounded-full bg-[#18181B] text-white grid place-items-center font-bold text-2xl mx-auto mb-4 hover:scale-110 transition-transform duration-200">
                Tim
              </div>
            </Link>
            <h1 className="text-2xl font-black text-[#09090B]">
              {isSignUp ? "建立帳號" : "歡迎回來"}
            </h1>
            <p className="text-[#71717A] mt-2">
              {isSignUp ? "註冊後即可管理你的部落格" : "登入以管理你的部落格"}
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm ${
              message.includes("成功") || message.includes("已寄出")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3F3F46] mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3F3F46] mb-2">
                密碼
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              {isLoading ? "處理中..." : isSignUp ? "註冊" : "登入"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#18181B]/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-[#71717A]">或</span>
            </div>
          </div>

          {/* Magic Link */}
          <button
            type="button"
            onClick={handleMagicLink}
            disabled={isLoading || !email}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#18181B] text-[#18181B] font-semibold hover:bg-[#18181B] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            使用 Magic Link 登入
          </button>

          {/* Toggle */}
          <p className="mt-6 text-center text-sm text-[#71717A]">
            {isSignUp ? "已經有帳號？" : "還沒有帳號？"}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage("");
              }}
              className="text-[#2563EB] font-medium hover:underline ml-1 cursor-pointer"
            >
              {isSignUp ? "登入" : "註冊"}
            </button>
          </p>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-sm text-[#71717A] hover:text-[#2563EB] transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
