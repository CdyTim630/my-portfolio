import { requireAdminPage } from "@/lib/admin-auth";
import ExperienceManager from "./ExperienceManager";

export default async function ExperiencePage() {
  const { supabase } = await requireAdminPage();

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  return <ExperienceManager initialExperiences={experiences || []} />;
}
