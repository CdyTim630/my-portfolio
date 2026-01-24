-- 為 authenticated 用戶新增刪除留言的權限
-- 在 Supabase SQL Editor 執行此腳本

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Authenticated users can delete comments" ON comments;

-- Create policy for authenticated users to delete comments
CREATE POLICY "Authenticated users can delete comments"
  ON comments FOR DELETE
  TO authenticated
  USING (true);

-- 如果你想要任何人都能刪除留言（不推薦），可以改用：
-- DROP POLICY IF EXISTS "Anyone can delete comments" ON comments;
-- CREATE POLICY "Anyone can delete comments"
--   ON comments FOR DELETE
--   USING (true);
