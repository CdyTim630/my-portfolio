# Supabase 後端設置指南

## 📋 步驟一：建立 Supabase 專案

1. 前往 [Supabase](https://supabase.com/) 並登入
2. 點擊 "New Project" 建立新專案
3. 填寫專案名稱和資料庫密碼
4. 選擇距離你最近的區域
5. 等待專案建立完成

---

## 🔐 步驟二：取得 API 金鑰

1. 在 Supabase Dashboard 中，點擊左側 **Settings** → **API**
2. 複製以下資訊：
   - **Project URL** (例如: `https://xxxxx.supabase.co`)
   - **anon public** key (在 Project API keys 區塊)

3. 更新你的 `.env.local` 檔案：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_public_key
```

---

## 🗃️ 步驟三：建立資料表

在 Supabase Dashboard 中，點擊左側 **SQL Editor**，然後執行以下 SQL：

```sql
-- 建立 posts 資料表（如果不存在）
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

-- 啟用 RLS (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 建立 RLS 政策：任何人都可以讀取已發布的文章
CREATE POLICY "Public posts are viewable by everyone" 
  ON posts FOR SELECT 
  USING (published = true);

-- 建立 RLS 政策：登入使用者可以讀取所有文章（包含草稿）
CREATE POLICY "Authors can view all own posts" 
  ON posts FOR SELECT 
  USING (auth.uid() = author_id);

-- 建立 RLS 政策：登入使用者可以新增文章
CREATE POLICY "Authors can create posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

-- 建立 RLS 政策：登入使用者可以更新自己的文章
CREATE POLICY "Authors can update own posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = author_id);

-- 建立 RLS 政策：登入使用者可以刪除自己的文章
CREATE POLICY "Authors can delete own posts" 
  ON posts FOR DELETE 
  USING (auth.uid() = author_id);
```

---

## 👤 步驟四：建立管理員帳號

1. 在 Supabase Dashboard 中，點擊左側 **Authentication** → **Users**
2. 點擊 **Add user** → **Create new user**
3. 輸入你的 Email 和密碼
4. 勾選 **Auto Confirm User** 
5. 點擊 **Create user**

或者，你也可以：
- 前往 `/login` 頁面
- 使用 **Magic Link** 功能，輸入 Email 後會收到登入連結

---

## �️ 步驟五：設置圖片儲存

1. 在 Supabase Dashboard 中，點擊左側 **Storage**
2. 點擊 **Create a new bucket**
3. Bucket 名稱填入：`blog-images`
4. 設定為 **Public bucket**（允許公開存取）
5. 點擊 **Create bucket**

6. 設置儲存政策 (Storage Policies)：
   - 點擊剛建立的 `blog-images` bucket
   - 點擊 **Policies** 標籤
   - 點擊 **New Policy**
   
7. 建立上傳政策：
   ```sql
   -- 允許已認證用戶上傳
   CREATE POLICY "Allow authenticated users to upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'blog-images');
   ```

8. 建立公開讀取政策：
   ```sql
   -- 允許所有人讀取
   CREATE POLICY "Allow public to read"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'blog-images');
   ```

---

## 🔄 步驟六：啟用 Auth 設定

1. 在 Supabase Dashboard 中，點擊 **Authentication** → **Providers**
2. 確保 **Email** provider 已啟用
3. 如果要使用 Magic Link：
   - 前往 **Authentication** → **Email Templates**
   - 確認 Magic Link template 已正確設定

---

## ✅ 完成！

現在你可以：

1. **啟動開發伺服器**：
   ```bash
   npm run dev
   ```

2. **前往登入頁面**：`http://localhost:3000/login`

3. **登入後前往後台**：`http://localhost:3000/admin`

4. **建立新文章**：點擊「新增文章」按鈕

5. **查看部落格**：`http://localhost:3000/blog`

---

## 🔧 疑難排解

### 問題：登入失敗
- 確認 `.env.local` 中的 URL 和 Key 正確
- 確認 Supabase 專案的 Auth 設定已啟用 Email provider

### 問題：無法儲存文章
- 確認已執行 SQL 建立 posts 資料表
- 確認 RLS 政策已正確設定
- 確認使用者已登入

### 問題：文章不顯示
- 確認文章已設為「已發布」狀態
- 確認 `published = true` 的 RLS 政策已生效

---

## 📁 相關檔案

- `/lib/supabase/client.ts` - 瀏覽器端 Supabase Client
- `/lib/supabase/server.ts` - 伺服器端 Supabase Client  
- `/app/login/page.tsx` - 登入頁面
- `/app/admin/page.tsx` - 後台首頁
- `/app/admin/new/page.tsx` - 新增文章頁面（支援圖片上傳）
- `/app/admin/edit/[id]/page.tsx` - 編輯文章頁面（支援圖片上傳）
- `/app/admin/AdminDashboard.tsx` - 後台 Dashboard 組件
- `/app/api/admin/posts/route.ts` - 文章 API 路由

---

## 🎨 圖片上傳功能

新增和編輯文章頁面都支援：

1. **封面圖片上傳**：
   - 點擊「上傳」按鈕選擇本機圖片
   - 圖片會自動上傳到 Supabase Storage
   - URL 會自動填入表單

2. **文章內容圖片上傳**：
   - 點擊工具列的圖片按鈕 📷
   - 選擇本機圖片上傳
   - Markdown 語法會自動插入到游標位置

3. **圖片儲存位置**：
   - Bucket: `blog-images`
   - 路徑: `images/隨機檔名.副檔名`
   - 公開 URL: 自動生成
