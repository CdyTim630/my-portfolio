import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DiaryEditor from "@/components/DiaryEditor";

export default async function NewDiaryPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/login");
  }
  return <DiaryEditor mode="new" />;
}
