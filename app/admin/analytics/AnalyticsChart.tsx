"use client";

import { useState } from "react";

export interface DayData {
  date: string;
  views: number;
}

interface Props {
  data: DayData[];
}

export default function AnalyticsChart({ data }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxViews = Math.max(...data.map((d) => d.views), 1);
  const totalInPeriod = data.reduce((sum, d) => sum + d.views, 0);

  // Y 軸刻度（4 格）
  const yTicks = [0, 1, 2, 3].map((i) => Math.round((maxViews / 3) * (3 - i)));

  return (
    <div className="w-full">
      <div className="flex gap-2">
        {/* Y 軸 */}
        <div className="flex flex-col justify-between text-right pr-2 pb-5" style={{ minWidth: "2.5rem" }}>
          {yTicks.map((tick) => (
            <span key={tick} className="text-xs text-[#A1A1AA] leading-none">
              {tick}
            </span>
          ))}
        </div>

        {/* 圖表主體 */}
        <div className="flex-1 flex flex-col">
          <div
            className="flex items-end gap-px h-44 relative"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* 背景網格線 */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0">
              {yTicks.map((tick) => (
                <div key={tick} className="w-full border-t border-[#F4F4F5]" />
              ))}
            </div>

            {/* 柱狀條 */}
            {data.map((day, i) => {
              const heightPercent = (day.views / maxViews) * 100;
              const isHovered = hoveredIndex === i;

              return (
                <div
                  key={day.date}
                  className="relative flex-1 flex flex-col justify-end h-full cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                      <div className="bg-[#09090B] text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                        <div className="font-semibold">{day.views} 次瀏覽</div>
                        <div className="text-[#A1A1AA] text-[10px] mt-0.5">{day.date}</div>
                        {/* 三角箭頭 */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#09090B]" />
                      </div>
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className="w-full rounded-t-sm transition-all duration-150"
                    style={{
                      height: `${Math.max(heightPercent, day.views > 0 ? 2 : 0)}%`,
                      backgroundColor: isHovered ? "#1d4ed8" : "#2563EB",
                      opacity: hoveredIndex !== null && !isHovered ? 0.45 : 1,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* X 軸日期（每 5 天顯示一個） */}
          <div className="flex items-start h-5 mt-1">
            {data.map((day, i) => (
              <div key={day.date} className="flex-1 text-center">
                {i % 5 === 0 && (
                  <span className="text-[10px] text-[#A1A1AA]">{day.date}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 摘要列 */}
      <div className="mt-3 flex items-center gap-4 text-xs text-[#71717A]">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#2563EB]" />
          <span>每日瀏覽</span>
        </div>
        <span className="text-[#09090B] font-medium">
          共 {totalInPeriod.toLocaleString()} 次（過去 30 天）
        </span>
      </div>
    </div>
  );
}
