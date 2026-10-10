import { requireAdminPage } from "@/lib/admin-auth";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const { supabase, user } = await requireAdminPage();

  // 取得文章列表
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  // 取得留言總數
  const { count: commentsCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true });

  // 取得日記總數（受 RLS 保護，只會回傳本人的）
  const { count: diariesCount } = await supabase
    .from("diaries")
    .select("*", { count: "exact", head: true });

  return (
    <AdminDashboard
      user={user}
      posts={posts || []}
      commentsCount={commentsCount || 0}
      diariesCount={diariesCount || 0}
    />
  );
}
