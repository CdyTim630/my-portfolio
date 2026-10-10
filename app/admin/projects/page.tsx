import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-auth";
import { getAdminProjectCatalog } from "@/lib/project-cms";
import ProjectStudio from "./ProjectStudio";

export const metadata: Metadata = { title: "作品工作室" };

export default async function ProjectsAdminPage() {
  const { supabase } = await requireAdminPage();
  const { entries, available } = await getAdminProjectCatalog(supabase);
  return <ProjectStudio initialEntries={entries} available={available} />;
}
