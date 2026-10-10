import { requireAdminPage } from "@/lib/admin-auth";
import CategoriesManager from "./CategoriesManager";

export default async function CategoriesPage() {
  const { supabase } = await requireAdminPage();
  const { data, error } = await supabase.from("categories").select("*").order("display_order", { ascending: true });
  if (error) throw new Error("Categories could not be loaded. Please try again later.");
  return <CategoriesManager initialCategories={data || []} />;
}
