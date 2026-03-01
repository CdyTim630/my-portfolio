-- =============================================
-- Experiences 資料表設置
-- =============================================

-- 1. 建立 experiences 資料表
-- =============================================
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 啟用 RLS
-- =============================================
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- 3. 刪除舊政策（可安全重複執行）
-- =============================================
DROP POLICY IF EXISTS "Experiences are viewable by everyone" ON experiences;
DROP POLICY IF EXISTS "Authenticated users can manage experiences" ON experiences;

-- 4. 建立 RLS 政策
-- =============================================

-- 所有人可以讀取
CREATE POLICY "Experiences are viewable by everyone"
  ON experiences FOR SELECT
  USING (true);

-- 已登入用戶可以新增、修改、刪除
CREATE POLICY "Authenticated users can manage experiences"
  ON experiences FOR ALL
  USING (auth.role() = 'authenticated');

-- 5. 插入初始資料（如果資料表為空）
-- =============================================
INSERT INTO experiences (title, company, period, description, skills, sort_order)
SELECT * FROM (VALUES
  (
    'Internship - Backend Engineer (Expected, confirmed in February 2026)',
    'National Taiwan University',
    '2026 - Present',
    'Develop and maintain services for teachers and students.',
    ARRAY['Backend', 'TypeScript'],
    1
  ),
  (
    'Teaching Assistant - Calculus',
    'Department of Information Management, National Taiwan University',
    '2025 - Present',
    'Led review sessions, clarified key mathematical concepts, and provided individualized academic support. Collaborated with other lecturers on material preparation and student progress monitoring. Strengthened communication skills by explaining technical concepts clearly and efficiently',
    ARRAY['Calculus', 'Teaching', 'Latex'],
    2
  )
) AS v(title, company, period, description, skills, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM experiences LIMIT 1);
