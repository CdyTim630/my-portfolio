import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExperienceManager from "./ExperienceManager";

export default async function ExperiencePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  return <ExperienceManager initialExperiences={experiences || []} />;
}
