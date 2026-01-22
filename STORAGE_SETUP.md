# 🖼️ Supabase Storage 快速設置

## ⚠️ 如果遇到 "Bucket not found" 錯誤

請按照以下步驟設置 Supabase Storage：

---

## 📦 步驟 1：建立 Storage Bucket

1. 打開你的 **Supabase Dashboard**：
   - 網址：https://supabase.com/dashboard
   - 選擇你的專案

2. 點擊左側選單的 **Storage** 圖示 📦

3. 點擊右上角的 **Create a new bucket** 按鈕

4. 填寫 Bucket 設定：
   ```
   Name: blog-images
   ✅ Public bucket (勾選這個！)
   ```

5. 點擊 **Create bucket**

---

## 🔐 步驟 2：設置存取政策

建立 bucket 後，需要設定誰可以上傳和讀取圖片：

### 方法 A：使用 UI 介面（推薦新手）

1. 點擊剛建立的 `blog-images` bucket
2. 點擊上方的 **Policies** 標籤
3. 點擊 **New Policy** 按鈕

#### 建立上傳政策：
- Template: **Custom**
- Policy name: `Allow authenticated users to upload`
- Allowed operations: ✅ INSERT
- Target roles: `authenticated`
- Policy definition:
  ```sql
  bucket_id = 'blog-images'
  ```

#### 建立讀取政策：
- 再次點擊 **New Policy**
- Template: **Custom**
- Policy name: `Allow public to read`
- Allowed operations: ✅ SELECT
- Target roles: `public`
- Policy definition:
  ```sql
  bucket_id = 'blog-images'
  ```

### 方法 B：使用 SQL（推薦進階用戶）

1. 點擊左側選單的 **SQL Editor**
2. 點擊 **New query**
3. 貼上並執行以下 SQL：

```sql
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
```

4. 點擊 **Run** 執行

---

## ✅ 步驟 3：測試上傳

1. 回到你的網站：http://localhost:3000/admin/new
2. 點擊封面圖片的「上傳」按鈕
3. 選擇一張圖片
4. 應該會成功上傳並顯示預覽！

---

## 🔍 驗證設置是否成功

回到 Supabase Dashboard：
1. 點擊 **Storage** → `blog-images`
2. 應該可以看到 `images/` 資料夾
3. 裡面有你剛上傳的圖片

---

## 🆘 常見問題

### Q: 上傳成功但圖片無法顯示？
**A:** 確認 bucket 設定為 **Public**，並且有建立「讀取」政策

### Q: 顯示 "new row violates row-level security policy" 錯誤？
**A:** 需要建立上傳政策（步驟 2），允許 authenticated 用戶 INSERT

### Q: 想要限制圖片大小或格式？
**A:** 可以在 bucket 設定中加入：
- File size limit: 5MB（例如）
- Allowed MIME types: `image/jpeg, image/png, image/webp`

---

## 📚 更多資訊

完整的 Supabase 設置指南請參考：
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- [Supabase Storage 官方文件](https://supabase.com/docs/guides/storage)
