import type { Metadata } from "next";
import ProjectStudio from "@/app/admin/projects/ProjectStudio";
import { requireLocalAdminPage } from "@/lib/local-admin";
import { getLocalProjectCatalog } from "@/lib/local-project-store";

export const metadata: Metadata = { title: "本機作品工作室" };

export default async function LocalProjectsPage() {
  await requireLocalAdminPage();
  const { entries } = await getLocalProjectCatalog();
  return <ProjectStudio initialEntries={entries} available mode="local" />;
}
