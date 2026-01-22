-- =============================================
-- Supabase 完整設置 SQL（可安全重複執行）
-- =============================================

-- 1. 建立 posts 資料表（如果不存在）
-- =============================================
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Design',
  spotify_track_id TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 啟用 RLS (Row Level Security)
-- =============================================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 3. 刪除舊的政策（如果存在）
-- =============================================
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Authors can view all own posts" ON posts;
DROP POLICY IF EXISTS "Authors can create posts" ON posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON posts;
DROP POLICY IF EXISTS "Authors can delete own posts" ON posts;

-- 4. 建立 RLS 政策
-- =============================================

-- 任何人都可以讀取已發布的文章
CREATE POLICY "Public posts are viewable by everyone" 
  ON posts FOR SELECT 
  USING (published = true);

-- 登入使用者可以讀取所有文章（包含草稿）
CREATE POLICY "Authors can view all own posts" 
  ON posts FOR SELECT 
  USING (auth.uid() = author_id);

-- 登入使用者可以新增文章
CREATE POLICY "Authors can create posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

-- 登入使用者可以更新自己的文章
CREATE POLICY "Authors can update own posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = author_id);

-- 登入使用者可以刪除自己的文章
CREATE POLICY "Authors can delete own posts" 
  ON posts FOR DELETE 
  USING (auth.uid() = author_id);

-- 5. Storage 政策（需要先手動建立 blog-images bucket）
-- =============================================

-- 刪除舊的 storage 政策（如果存在）
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON storage.objects;

-- 允許已登入用戶上傳圖片
CREATE POLICY "Allow authenticated users to upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

-- 允許所有人讀取圖片
CREATE POLICY "Allow public to read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

-- 允許已登入用戶刪除自己上傳的圖片
CREATE POLICY "Allow authenticated users to delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');

-- =============================================
-- 完成！現在可以使用部落格系統了
-- =============================================
