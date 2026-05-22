-- =============================================
-- Diaries（私人日記）資料表 + RLS
-- 安全可重複執行：每次只會更新 schema / 政策
-- =============================================

-- 1. 建立 diaries 資料表
CREATE TABLE IF NOT EXISTS diaries (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  mood TEXT,                          -- 心情標籤 (e.g. happy / tired / focused)
  weather TEXT,                       -- 當天天氣標籤
  cover_image TEXT,
  spotify_track_id TEXT,              -- Spotify 曲目 ID（可選，用 SpotifyEmbed 內嵌播放器）
  -- 與部落格的連動：
  --   is_published_to_blog = TRUE 時表示已產生一篇公開的 posts 紀錄
  --   published_post_id     = 對應 posts.id（NULL 表示尚未發布）
  is_published_to_blog BOOLEAN DEFAULT FALSE,
  published_post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 已建過資料表的人：補上 spotify_track_id 欄位（safe to re-run）
ALTER TABLE diaries ADD COLUMN IF NOT EXISTS spotify_track_id TEXT;

CREATE INDEX IF NOT EXISTS diaries_author_idx ON diaries(author_id);
CREATE INDEX IF NOT EXISTS diaries_entry_date_idx ON diaries(entry_date DESC);

-- 2. 啟用 RLS
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;

-- 3. 清掉舊政策（若存在）
DROP POLICY IF EXISTS "Diaries are private to author select" ON diaries;
DROP POLICY IF EXISTS "Diaries insert own" ON diaries;
DROP POLICY IF EXISTS "Diaries update own" ON diaries;
DROP POLICY IF EXISTS "Diaries delete own" ON diaries;

-- 4. 建立 RLS 政策：日記只有作者本人能存取，沒有任何 public read
CREATE POLICY "Diaries are private to author select"
  ON diaries FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Diaries insert own"
  ON diaries FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Diaries update own"
  ON diaries FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Diaries delete own"
  ON diaries FOR DELETE
  USING (auth.uid() = author_id);

-- 5. updated_at 自動更新 trigger
CREATE OR REPLACE FUNCTION diaries_set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS diaries_set_updated_at_trigger ON diaries;
CREATE TRIGGER diaries_set_updated_at_trigger
  BEFORE UPDATE ON diaries
  FOR EACH ROW
  EXECUTE FUNCTION diaries_set_updated_at();
