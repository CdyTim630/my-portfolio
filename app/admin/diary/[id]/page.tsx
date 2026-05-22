import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DiaryEditor from "@/components/DiaryEditor";

export default async function EditDiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/login");
  }

  const { data: diary } = await supabase
    .from("diaries")
    .select("*")
    .eq("id", numericId)
    .single();

  if (!diary) notFound();

  return (
    <DiaryEditor
      mode="edit"
      diaryId={diary.id}
      initial={{
        title: diary.title,
        content: diary.content,
        mood: diary.mood ?? "",
        weather: diary.weather ?? "",
        coverImage: diary.cover_image ?? "",
        spotifyTrackId: diary.spotify_track_id ?? "",
        entryDate: diary.entry_date,
        isPublishedToBlog: diary.is_published_to_blog,
        publishedPostId: diary.published_post_id,
      }}
    />
  );
}
