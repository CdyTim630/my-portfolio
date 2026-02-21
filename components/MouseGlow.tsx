"use client";

import { useEffect, useRef } from "react";

/**
 * 跟隨滑鼠移動的科技感光暈背景
 * 使用 requestAnimationFrame + CSS custom properties 達到零 re-render 流暢效果
 */
export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;

    // lerp 讓光暈緩慢跟隨，增加流暢感
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.05);
      currentY = lerp(currentY, targetY, 0.05);

      if (glowRef.current) {
        glowRef.current.style.setProperty("--gx", `${currentX}px`);
        glowRef.current.style.setProperty("--gy", `${currentY}px`);
      }
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* 細點陣網格 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(24,24,27,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 滑鼠光暈 */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={
          {
            "--gx": "-9999px",
            "--gy": "-9999px",
          } as React.CSSProperties
        }
      >
        {/* 主光暈 */}
        <div
          className="absolute"
          style={{
            left: "var(--gx)",
            top: "var(--gy)",
            width: 520,
            height: 520,
            transform: "translate(-50%,-50%)",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.04) 0%, rgba(124,58,237,0.025) 40%, transparent 65%)",
            borderRadius: "50%",
          }}
        />
        {/* 核心亮點 */}
        <div
          className="absolute"
          style={{
            left: "var(--gx)",
            top: "var(--gy)",
            width: 100,
            height: 100,
            transform: "translate(-50%,-50%)",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>
    </>
  );
}
