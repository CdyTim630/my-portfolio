import Link from "next/link";
import { requireLocalAdminPage } from "@/lib/local-admin";
import { getLocalProjectCatalog } from "@/lib/local-project-store";
import styles from "./LocalAdmin.module.css";

export default async function LocalAdminPage() {
  await requireLocalAdminPage();
  const { entries } = await getLocalProjectCatalog();
  const stats = [
    { label: "專案作品", count: entries.length },
    { label: "本機展示中", count: entries.filter(entry => entry.publishedDocument).length },
    { label: "待發布修改", count: entries.filter(entry => entry.hasDraftChanges).length },
  ];
  return <main id="main-content" className={`${styles.dashboard} mx-auto min-h-screen max-w-6xl px-6 py-10`}>
    <header className={`${styles.header} mb-12 flex flex-wrap items-center justify-between gap-5`}>
      <Link href="/" className="text-xl font-semibold">Tim<span className={styles.brandAccent}>.</span> <span className="ml-3 text-base">管理中心</span></Link>
      <div className="flex items-center gap-5 text-sm"><Link href="/portfolio?lang=zh-TW">查看作品集</Link><form action="/api/local-admin/logout" method="post"><button className={`${styles.logout} cursor-pointer rounded-lg border px-4 py-2`}>登出</button></form></div>
    </header>
    <p className={`${styles.eyebrow} text-xs font-medium tracking-widest`}>本機工作區</p>
    <h1 className="mt-3 text-3xl font-semibold tracking-tight">歡迎回來，Tim。</h1>
    <p className={`${styles.description} mt-4 text-sm leading-7`}>修改會儲存在這台電腦。發布後，即可在本機作品集查看成果。</p>
    <div className="my-8 grid gap-4 sm:grid-cols-3">{stats.map(stat => <div key={stat.label} className={`${styles.stat} rounded-2xl border bg-white p-6`}><strong className="text-3xl font-semibold">{stat.count}</strong><p className={`${styles.description} mt-2 text-sm`}>{stat.label}</p></div>)}</div>
    <Link href="/local-admin/projects" className={`${styles.studio} flex flex-col justify-between gap-6 rounded-2xl border p-8 sm:flex-row sm:items-center`}>
      <div><h2 className="text-2xl font-semibold">作品工作室</h2><p className={`${styles.description} mt-3 text-sm leading-7`}>編輯專案內容、圖片與展示設定。</p></div>
      <span className={`${styles.studioAction} self-start whitespace-nowrap rounded-xl px-5 py-3 text-sm font-medium sm:self-auto`}>進入工作室 <span aria-hidden="true">→</span></span>
    </Link>
    <p className={`${styles.description} mt-8 text-sm leading-7`}>文章、日記與其他雲端管理功能，需連接 Supabase 後使用。</p>
  </main>;
}
