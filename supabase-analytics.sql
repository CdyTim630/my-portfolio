-- =============================================
-- 網站分析：Page Views 追蹤資料表
-- 請在 Supabase SQL Editor 中執行此腳本
-- =============================================

-- 建立 page_views 資料表
CREATE TABLE IF NOT EXISTS page_views (
  id        BIGSERIAL PRIMARY KEY,
  path      TEXT        NOT NULL,
  referrer  TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 啟用 Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 允許任何人（包含匿名訪客）寫入瀏覽紀錄
CREATE POLICY "Anyone can insert page views"
  ON page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 只有已登入的管理員可以讀取分析資料
CREATE POLICY "Only authenticated users can read page views"
  ON page_views FOR SELECT
  TO authenticated
  USING (true);

-- 索引：加快依時間查詢的速度
CREATE INDEX IF NOT EXISTS idx_page_views_created_at
  ON page_views (created_at DESC);

-- 索引：加快依路徑統計的速度
CREATE INDEX IF NOT EXISTS idx_page_views_path
  ON page_views (path);
