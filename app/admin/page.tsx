import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  // 未登入就導向登入頁
  if (!data.user) {
    redirect("/login");
  }

  // 取得文章列表
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminDashboard user={data.user} posts={posts || []} />;
}
