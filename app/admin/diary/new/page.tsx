import { requireAdminPage } from "@/lib/admin-auth";
import DiaryEditor from "@/components/DiaryEditor";

export default async function NewDiaryPage() {
  await requireAdminPage();
  return <DiaryEditor mode="new" />;
}
