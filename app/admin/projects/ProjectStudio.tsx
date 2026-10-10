"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import ProjectArtwork from "@/components/portfolio/ProjectArtwork";
import type { Project, ProjectCategory } from "@/lib/projects";
import { projectCollections, type ProjectCollectionId } from "@/lib/project-collections";
import type { ProjectAdminEntry, ProjectDocument } from "@/lib/project-cms-types";
import { createBlankProjectDocument } from "@/lib/project-cms-seeds";
import styles from "./ProjectStudio.module.css";

type Locale = "zh" | "en";
type EditorTab = "overview" | "story" | "media" | "settings";
type Action = "save" | "publish" | "unpublish";
const statuses: Record<ProjectAdminEntry["status"], string> = {
  seed: "現有作品", draft: "草稿", published: "已發布", unpublished: "已下架",
};
const categories: ProjectCategory[] = ["Backend", "Data", "AI", "Full-stack", "Frontend"];
const visualOptions: { value: Project["visual"]; label: string }[] = [
  { value: "employa", label: "AI 對話與服務" }, { value: "atlas", label: "資料圖表" },
  { value: "pipeline", label: "資料管線" }, { value: "portfolio", label: "依專案自動選擇" },
  { value: "sigmile", label: "物流與路線" }, { value: "tomybaby", label: "互動與對話" },
  { value: "algorithms", label: "演算法" }, { value: "delivery", label: "部署流程" },
];

function cloneDocument(document: ProjectDocument): ProjectDocument {
  return JSON.parse(JSON.stringify(document));
}

function reorder<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= items.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function Field({ label, value, onChange, multiline, hint, type = "text", disabled, placeholder }: {
  label: string; value: string | number; onChange: (value: string) => void;
  multiline?: boolean; hint?: string; type?: string; disabled?: boolean; placeholder?: string;
}) {
  const id = useId();
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    {multiline ? <textarea id={id} aria-describedby={hint ? `${id}-hint` : undefined} value={value} onChange={event => onChange(event.target.value)} rows={4} placeholder={placeholder} disabled={disabled} />
      : <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} type={type} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} disabled={disabled} />}
    {hint && <small id={`${id}-hint`}>{hint}</small>}
  </div>;
}

function Panel({ number, title, description, children }: { number: string; title: string; description: string; children: ReactNode }) {
  return <section className={styles.panel}>
    <div className={styles.panelHeading}><span className={styles.sectionNumber}>{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>
    {children}
  </section>;
}

function OrderControls({ label, index, count, onMove, onRemove }: {
  label: string; index: number; count: number; onMove: (direction: -1 | 1) => void; onRemove: () => void;
}) {
  return <div className={styles.orderControls}>
    <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`上移${label}`} title="上移">↑</button>
    <button type="button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label={`下移${label}`} title="下移">↓</button>
    <button type="button" onClick={onRemove} aria-label={`移除${label}`} className={styles.removeButton}>移除</button>
  </div>;
}

function TextList({ label, items, onChange, multiline = false }: {
  label: string; items: string[]; onChange: (items: string[]) => void; multiline?: boolean;
}) {
  return <div className={styles.textList}>
    {items.map((item, index) => <div className={styles.textListItem} key={index}>
      <Field label={`${label} ${index + 1}`} value={item} multiline={multiline} onChange={value => onChange(items.map((current, itemIndex) => itemIndex === index ? value : current))} />
      <OrderControls label={`${label} ${index + 1}`} index={index} count={items.length} onMove={direction => onChange(reorder(items, index, direction))} onRemove={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} />
    </div>)}
    <button type="button" className={styles.addButton} onClick={() => onChange([...items, ""])}>＋ 新增{label}</button>
  </div>;
}

function Preview({ project, locale }: { project: Project; locale: Locale }) {
  const cover = project.images[0];
  return <article className={styles.previewArticle} lang={locale === "zh" ? "zh-Hant" : "en"}>
    <div className={styles.previewCover}>
      {cover?.src ? (
        // CMS assets can be local paths or remote URLs.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover.src} alt={cover.alt} />
      ) : (
        <ProjectArtwork slug={project.slug} visual={project.visual} title={project.title || (locale === "zh" ? "你的下一件作品" : "Your next project")} locale={locale === "zh" ? "zh-TW" : "en"} />
      )}
    </div>
    <div className={styles.previewBody}>
      <p className={styles.previewEyebrow}>{project.status || (locale === "zh" ? "專案狀態" : "Project status")}</p>
      <h2>{project.title || (locale === "zh" ? "你的下一件作品" : "Your next project")}</h2>
      <p className={styles.previewSummary}>{project.summary || (locale === "zh" ? "用一小段文字，讓人認識這件作品。" : "Introduce the idea behind your work.")}</p>
      <div className={styles.tags}>{project.stack.map((tag, index) => <span key={`${tag}-${index}`}>{tag}</span>)}</div>
      {(project.role || project.team) && <dl className={styles.previewMetadata}><div><dt>{locale === "zh" ? "我的角色" : "Role"}</dt><dd>{project.role || "—"}</dd></div><div><dt>{locale === "zh" ? "團隊" : "Team"}</dt><dd>{project.team || "—"}</dd></div></dl>}
      {project.contribution && <p className={styles.previewContribution}>{project.contribution}</p>}
      {project.images.filter(item => item.src).map((item, index) => <figure className={styles.previewFigure} key={`${item.src}-${index}`}>
        {/* CMS assets can be local paths or remote URLs; native images support both in the private preview. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.src} alt={item.alt} loading="lazy" />
        {item.caption && <figcaption>{item.caption}</figcaption>}
      </figure>)}
      {project.video?.src && <figure className={styles.previewFigure}><video src={project.video.src} poster={project.video.poster || undefined} controls preload="none" aria-label={project.video.caption || "專案影片"} /><figcaption>{project.video.caption}</figcaption></figure>}
      {project.architecture.length > 0 && <div className={styles.previewArchitecture}>{project.architecture.map((step, index) => <div key={index}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.label}</strong><p>{step.detail}</p></div></div>)}</div>}
      {project.sections.map((section, index) => <section className={styles.previewSection} key={`${section.id}-${index}`}>
        <h3>{section.title || (locale === "zh" ? "未命名章節" : "Untitled section")}</h3>
        {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
        {section.bullets && section.bullets.length > 0 && <ul>{section.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}</ul>}
        {section.code?.content && <figure><pre><code>{section.code.content}</code></pre>{section.code.caption && <figcaption>{section.code.caption}</figcaption>}</figure>}
      </section>)}
      {project.evidence.length > 0 && <section className={styles.previewSection}><h3>{locale === "zh" ? "參考與成果" : "Evidence"}</h3>{project.evidence.map((item, index) => <div className={styles.previewEvidence} key={index}><strong>{item.label}</strong><p>{item.detail}</p><small>{item.url}</small></div>)}</section>}
    </div>
  </article>;
}

export default function ProjectStudio({ initialEntries, available, mode = "supabase" }: { initialEntries: ProjectAdminEntry[]; available: boolean; mode?: "supabase" | "local" }) {
  const local = mode === "local";
  const apiBase = local ? "/api/local-admin/projects" : "/api/admin/projects";
  const [entries, setEntries] = useState(initialEntries);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialEntries[0]?.document.slug ?? null);
  const [document, setDocument] = useState<ProjectDocument>(() => cloneDocument(initialEntries[0]?.document ?? createBlankProjectDocument()));
  const [baseline, setBaseline] = useState(() => JSON.stringify(initialEntries[0]?.document ?? createBlankProjectDocument()));
  const [locale, setLocale] = useState<Locale>("zh");
  const [tab, setTab] = useState<EditorTab>("overview");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [pending, setPending] = useState<Action | null>(null);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const currentEntry = entries.find(entry => entry.document.slug === selectedSlug);
  const project = document[locale];
  const dirty = JSON.stringify(document) !== baseline;
  const filtered = useMemo(() => entries.filter(entry => {
    const term = search.trim().toLocaleLowerCase();
    const matches = !term || `${entry.document.zh.title} ${entry.document.en.title} ${entry.document.slug} ${entry.document.en.stack.join(" ")}`.toLocaleLowerCase().includes(term);
    return matches && (filter === "all" || (filter === "draft" ? entry.status === "draft" || entry.hasDraftChanges : entry.document.collection === filter));
  }), [entries, search, filter]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const guardLink = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.href && link.href !== window.location.href && !window.confirm("你有尚未儲存的修改，確定要離開工作室嗎？")) {
        event.preventDefault(); event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", warn);
    window.document.addEventListener("click", guardLink, true);
    return () => { window.removeEventListener("beforeunload", warn); window.document.removeEventListener("click", guardLink, true); };
  }, [dirty]);

  function setLocalized(patch: Partial<Project>) {
    setDocument(current => ({ ...current, [locale]: { ...current[locale], ...patch } }));
    setNotice(null);
  }

  function setShared(patch: Partial<Project>) {
    setDocument(current => ({ ...current, en: { ...current.en, ...patch }, zh: { ...current.zh, ...patch } }));
    setNotice(null);
  }

  function choose(entry?: ProjectAdminEntry) {
    if (pending || (dirty && !window.confirm("你有尚未儲存的修改，要放棄修改並切換作品嗎？"))) return;
    const next = cloneDocument(entry?.document ?? createBlankProjectDocument());
    setSelectedSlug(entry?.document.slug ?? null);
    setDocument(next); setBaseline(JSON.stringify(next)); setNotice(null); setTab("overview"); setCatalogOpen(false);
  }

  async function persist(action: Action) {
    if (pending || !available) return;
    if (!document.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(document.slug)) {
      setNotice({ kind: "error", message: "請先設定網址代稱，使用小寫英文字母、數字與連字號，例如 my-new-project。" }); setTab("settings"); return;
    }
    if (!selectedSlug && entries.some(entry => entry.document.slug === document.slug)) {
      setNotice({ kind: "error", message: "這個網址代稱已被使用，請換一個名稱。" }); setTab("settings"); return;
    }
    for (const language of ["zh", "en"] as const) {
      const name = language === "zh" ? "繁體中文" : "英文";
      if (!document[language].title.trim()) {
        setNotice({ kind: "error", message: `請填寫${name}的專案名稱。每次儲存都會包含中英文版本。` }); setLocale(language); setTab("overview"); return;
      }
      if (action === "publish" && !document[language].summary.trim()) {
        setNotice({ kind: "error", message: `發布前，請先填寫${name}的專案簡介。` }); setLocale(language); setTab("overview"); return;
      }
    }
    if (action === "unpublish" && !window.confirm(local ? "將這件作品從本機作品集下架？內容會保留在工作室，之後可以重新發布。" : "下架後，訪客將無法查看這件作品。內容會保留在工作室，之後可以重新發布。確定下架？")) return;
    setPending(action); setNotice(null);
    try {
      const prepared = { ...document, en: { ...document.en, stack: document.en.stack.map(tag => tag.trim()).filter(Boolean) }, zh: { ...document.zh, stack: document.zh.stack.map(tag => tag.trim()).filter(Boolean) } };
      const response = await fetch(`${apiBase}/${encodeURIComponent(document.slug)}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, document: prepared }),
      });
      const result = await response.json();
      if (!response.ok || !result.entry) throw new Error(result.error || "暫時無法儲存，請稍後重試。");
      const entry: ProjectAdminEntry = result.entry;
      setEntries(current => [...current.filter(item => item.document.slug !== entry.document.slug), entry].sort((a, b) => a.document.sortOrder - b.document.sortOrder));
      setSelectedSlug(entry.document.slug); setDocument(cloneDocument(entry.document)); setBaseline(JSON.stringify(entry.document));
      setNotice({ kind: "success", message: local
        ? action === "save" ? "草稿已儲存在這台電腦。本機作品集維持原本的版本。" : action === "publish" ? "專案已發布至本機作品集，中英文內容已更新。" : "專案已從本機作品集下架，所有編輯內容已保留。"
        : action === "save" ? "草稿已儲存。公開頁面維持原本的版本。" : action === "publish" ? "專案已發布，中英文內容已同步更新至公開頁面。" : "專案已下架，所有編輯內容已保留。" });
    } catch (error) {
      setNotice({ kind: "error", message: error instanceof Error ? error.message : "儲存失敗，請再試一次。" });
    } finally { setPending(null); }
  }

  function updateSection(index: number, patch: Partial<Project["sections"][number]>) {
    setLocalized({ sections: project.sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, ...patch } : section) });
  }

  const isPublic = Boolean(currentEntry?.publishedDocument);
  const tabs: { id: EditorTab; label: string; number: string }[] = [
    { id: "overview", label: "專案概覽", number: "01" }, { id: "story", label: "內容編排", number: "02" },
    { id: "media", label: "圖片與影片", number: "03" }, { id: "settings", label: "展示設定", number: "04" },
  ];

  return <main id="main-content" className={styles.studio}>
    <header className={styles.topbar}>
      <Link href={local ? "/local-admin" : "/admin"} className={styles.backLink}><span aria-hidden="true">←</span> 管理中心</Link>
      <span className={styles.topbarLabel}>{local ? "TIM / LOCAL" : "TIM / ADMIN"}</span>
      <Link href="/projects?lang=zh-TW" target="_blank" rel="noreferrer" className={styles.publicLink}>查看作品集 <span aria-hidden="true">↗</span></Link>
    </header>
    <section className={styles.hero}>
      <div><p className={styles.eyebrow}>PROJECT STUDIO</p><h1>作品工作室</h1></div>
      <div className={styles.heroAside}><span>{String(entries.length).padStart(2, "0")}</span><p>件作品</p><button type="button" onClick={() => choose()} disabled={!!pending} className={styles.primaryButton}>＋ 新增專案</button></div>
    </section>

    {local && <p className={styles.setupNotice}>本機工作區 · 修改儲存在這台電腦，發布只更新本機作品集。</p>}
    {!available && <div className={styles.setupNotice} role="status"><strong>目前可編輯與預覽，暫時無法連接作品儲存空間。</strong>{local ? <p>請確認本機儲存空間後重新整理。</p> : <p>請確認 Supabase 連線與資料表。初次設定時，在 SQL Editor 執行專案中的 <code>supabase-projects.sql</code>，再重新整理即可儲存及發布。</p>}</div>}

    <div className={styles.workspace}>
      <aside className={`${styles.catalog} ${catalogOpen ? styles.catalogOpen : ""}`} aria-label="作品目錄">
        <button type="button" className={styles.catalogToggle} onClick={() => setCatalogOpen(!catalogOpen)} aria-expanded={catalogOpen}>作品目錄 <span>{entries.length} 件 {catalogOpen ? "−" : "+"}</span></button>
        <div className={styles.catalogContent}>
          <div className={styles.catalogHeading}><h2>所有作品</h2><span>{entries.length}</span></div>
          <label className={styles.search}><span className={styles.srOnly}>搜尋專案</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="搜尋名稱、技術…" /></label>
          <label className={styles.filter}><span className={styles.srOnly}>篩選專案</span><select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">全部作品</option><option value="draft">有待發布的草稿</option>{projectCollections.map(group => <option key={group.id} value={group.id}>{group.label.zh}</option>)}</select></label>
          <p className={styles.resultCount}>{filtered.length} 件符合條件</p>
          <div className={styles.projectList}>
            {filtered.map((entry, index) => <button type="button" key={entry.document.slug} onClick={() => choose(entry)} disabled={!!pending} className={`${styles.projectItem} ${selectedSlug === entry.document.slug ? styles.projectItemActive : ""}`} aria-pressed={selectedSlug === entry.document.slug}>
              <span className={styles.projectIndex}>{String(index + 1).padStart(2, "0")}</span><span className={styles.projectItemBody}><strong>{entry.document.zh.title || entry.document.en.title}</strong><small>{projectCollections.find(group => group.id === entry.document.collection)?.label.zh}</small><span className={styles.itemStatus} data-status={entry.status}><i />{entry.hasDraftChanges ? "有待發布修改" : statuses[entry.status]}</span></span><span className={styles.itemArrow} aria-hidden="true">↗</span>
            </button>)}
            {filtered.length === 0 && <p className={styles.empty}>沒有找到作品，試試別的關鍵字。</p>}
          </div>
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <div className={styles.editorHeader}>
          <div className={styles.editorTitle}><p>{selectedSlug ? "正在編輯" : "開始一件新作品"}</p><h2>{project.title || "未命名專案"}</h2><div className={styles.documentStatus}><span data-dirty={dirty || currentEntry?.hasDraftChanges}>{dirty ? "● 尚未儲存" : currentEntry?.hasDraftChanges ? "● 草稿待發布" : currentEntry ? statuses[currentEntry.status] : "新專案"}</span>{currentEntry?.updatedAt && <small>上次儲存 {new Intl.DateTimeFormat("zh-TW", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Taipei" }).format(new Date(currentEntry.updatedAt))}</small>}</div></div>
          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={() => persist("save")} disabled={!available || !!pending}>{pending === "save" ? "儲存中…" : "儲存草稿"}</button>
            <button type="button" className={styles.primaryButton} onClick={() => persist("publish")} disabled={!available || !!pending}>{pending === "publish" ? "發布中…" : local ? "發布至本機" : isPublic ? "發布更新 ↗" : "發布專案 ↗"}</button>
          </div>
        </div>
        {notice && <div className={notice.kind === "error" ? styles.errorNotice : styles.successNotice} role={notice.kind === "error" ? "alert" : "status"}>{notice.message}</div>}
        <div className={styles.editorToolbar}>
          <div className={styles.languageSwitch} aria-label="編輯語言"><button type="button" aria-pressed={locale === "zh"} onClick={() => setLocale("zh")} disabled={!!pending}>繁體中文</button><button type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")} disabled={!!pending}>English</button></div>
          <button type="button" className={styles.previewToggle} aria-expanded={showPreview} onClick={() => setShowPreview(!showPreview)}>{showPreview ? "收起預覽" : "開啟即時預覽"} <span aria-hidden="true">◧</span></button>
        </div>
        <div className={`${styles.editAndPreview} ${!showPreview ? styles.noPreview : ""}`}>
          <div className={styles.editor}>
            <div className={styles.tabs} role="tablist" aria-label="編輯區域">{tabs.map((item, index) => <button type="button" role="tab" id={`tab-${item.id}`} aria-controls={`panel-${item.id}`} aria-selected={tab === item.id} tabIndex={tab === item.id ? 0 : -1} key={item.id} onClick={() => setTab(item.id)} onKeyDown={event => {
              const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
              if (next === null) return;
              event.preventDefault(); setTab(tabs[next].id); event.currentTarget.parentElement?.querySelectorAll("button")[next]?.focus();
            }}><small>{item.number}</small>{item.label}</button>)}</div>
            <fieldset className={styles.editorFields} disabled={!!pending} role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
              <legend className={styles.srOnly}>{locale === "zh" ? "中文" : "英文"}專案編輯</legend>
              {tab === "overview" && <>
                <Panel number="01" title="基本資訊" description={`目前編輯${locale === "zh" ? "繁體中文" : "英文"}內容。切換語言會保留尚未儲存的修改。`}>
                  <Field label="專案名稱" value={project.title} onChange={title => setLocalized({ title })} placeholder="給作品一個好記的名字" />
                  <Field label="專案簡介" value={project.summary} onChange={summary => setLocalized({ summary })} multiline hint="會出現在作品卡片與專案頁面，建議用 1–2 句話說清楚價值。" />
                  <div className={styles.fieldGrid}><Field label="專案狀態" value={project.status} onChange={status => setLocalized({ status })} placeholder="例如：已上線、開發中、競賽原型" /><Field label="年份（中英文共用）" value={project.year || ""} type="number" onChange={year => setShared({ year: Number(year) || 0 })} /></div>
                </Panel>
                <Panel number="02" title="角色與貢獻" description="說明你的職責與團隊組成。">
                  <div className={styles.fieldGrid}><Field label="我的角色" value={project.role} onChange={role => setLocalized({ role })} /><Field label="團隊組成" value={project.team} onChange={team => setLocalized({ team })} /></div>
                  <Field label="個人貢獻" value={project.contribution} onChange={contribution => setLocalized({ contribution })} multiline />
                </Panel>
                <Panel number="03" title="技術與連結" description="此區的技術、分類與連結由中英文版本共用。">
                  <Field label="技術標籤" value={project.stack.join(",")} onChange={value => setShared({ stack: value.split(",") })} hint="以英文逗號分隔，例如 Next.js, TypeScript, Supabase。" />
                  <fieldset className={styles.categoryFieldset}><legend>技術分類</legend><div className={styles.categoryChoices}>{categories.map(category => <label key={category}><input type="checkbox" checked={project.category.includes(category)} onChange={event => setShared({ category: event.target.checked ? [...project.category, category] : project.category.filter(item => item !== category) })} /><span>{category}</span></label>)}</div></fieldset>
                  <Field label="原始碼網址" value={project.repository} onChange={repository => setShared({ repository })} placeholder="https://github.com/…" />
                  <Field label="線上展示網址" value={project.demo || ""} onChange={demo => setShared({ demo })} placeholder="https://…" />
                </Panel>
              </>}

              {tab === "story" && <>
                <Panel number="01" title="專案章節" description="編排專案背景、設計過程與成果。">
                  {project.sections.map((section, index) => <div className={styles.block} key={index}>
                    <div className={styles.blockToolbar}><span>章節 {String(index + 1).padStart(2, "0")}</span><OrderControls label={`章節 ${index + 1}`} index={index} count={project.sections.length} onMove={direction => setLocalized({ sections: reorder(project.sections, index, direction) })} onRemove={() => setLocalized({ sections: project.sections.filter((_, sectionIndex) => sectionIndex !== index) })} /></div>
                    <details open={index === 0} className={styles.sectionDetails}><summary>{section.title || "未命名章節"}<span>編輯內容</span></summary>
                      <div className={styles.sectionFields}><Field label={`章節 ${index + 1} 標題`} value={section.title} onChange={title => updateSection(index, { title })} /><Field label={`章節 ${index + 1} 網址錨點`} value={section.id} onChange={id => updateSection(index, { id })} hint="以小寫英文與連字號命名，例如 overview。每個章節需使用不同名稱。" />
                        <TextList label="段落" items={section.paragraphs} onChange={paragraphs => updateSection(index, { paragraphs })} multiline />
                        <TextList label="重點" items={section.bullets || []} onChange={bullets => updateSection(index, { bullets })} />
                        {section.code ? <div className={styles.codeEditor}><div className={styles.blockToolbar}><strong>程式碼片段</strong><button type="button" className={styles.textButton} onClick={() => updateSection(index, { code: undefined })}>移除程式碼</button></div><Field label="程式語言" value={section.code.language} onChange={language => updateSection(index, { code: { ...section.code!, language } })} /><Field label="程式碼內容" value={section.code.content} onChange={content => updateSection(index, { code: { ...section.code!, content } })} multiline /><Field label="程式碼圖說" value={section.code.caption || ""} onChange={caption => updateSection(index, { code: { ...section.code!, caption } })} /></div> : <button type="button" className={styles.addButton} onClick={() => updateSection(index, { code: { language: "typescript", content: "" } })}>＋ 加入程式碼片段</button>}
                      </div>
                    </details>
                  </div>)}
                  <button type="button" className={styles.addButton} onClick={() => { let next = project.sections.length + 1; while (project.sections.some(section => section.id === `section-${next}`)) next++; setLocalized({ sections: [...project.sections, { id: `section-${next}`, title: "", paragraphs: [""] }] }); }}>＋ 新增章節</button>
                </Panel>
                <Panel number="02" title="架構與流程" description="將系統拆成幾個清楚的步驟，自動排列為流程圖。">
                  {project.architecture.map((step, index) => <div className={styles.block} key={index}><div className={styles.blockToolbar}><span>步驟 {index + 1}</span><OrderControls label={`架構步驟 ${index + 1}`} index={index} count={project.architecture.length} onMove={direction => setLocalized({ architecture: reorder(project.architecture, index, direction) })} onRemove={() => setLocalized({ architecture: project.architecture.filter((_, stepIndex) => stepIndex !== index) })} /></div><Field label={`步驟 ${index + 1} 名稱`} value={step.label} onChange={label => setLocalized({ architecture: project.architecture.map((item, stepIndex) => stepIndex === index ? { ...item, label } : item) })} /><Field label={`步驟 ${index + 1} 說明`} value={step.detail} multiline onChange={detail => setLocalized({ architecture: project.architecture.map((item, stepIndex) => stepIndex === index ? { ...item, detail } : item) })} /></div>)}
                  <button type="button" className={styles.addButton} onClick={() => setLocalized({ architecture: [...project.architecture, { label: "", detail: "" }] })}>＋ 新增架構步驟</button>
                </Panel>
                <Panel number="03" title="參考與成果" description="補上原始碼、報告、成果展示等來源，讓每個成果都有依據。">
                  {project.evidence.map((item, index) => <div className={styles.block} key={index}><div className={styles.blockToolbar}><span>參考 {index + 1}</span><OrderControls label={`參考 ${index + 1}`} index={index} count={project.evidence.length} onMove={direction => setLocalized({ evidence: reorder(project.evidence, index, direction) })} onRemove={() => setLocalized({ evidence: project.evidence.filter((_, evidenceIndex) => evidenceIndex !== index) })} /></div><Field label={`參考 ${index + 1} 名稱`} value={item.label} onChange={label => setLocalized({ evidence: project.evidence.map((current, evidenceIndex) => evidenceIndex === index ? { ...current, label } : current) })} /><Field label={`參考 ${index + 1} 網址`} value={item.url} onChange={url => setLocalized({ evidence: project.evidence.map((current, evidenceIndex) => evidenceIndex === index ? { ...current, url } : current) })} /><Field label={`參考 ${index + 1} 說明`} value={item.detail} multiline onChange={detail => setLocalized({ evidence: project.evidence.map((current, evidenceIndex) => evidenceIndex === index ? { ...current, detail } : current) })} /></div>)}
                  <button type="button" className={styles.addButton} onClick={() => setLocalized({ evidence: [...project.evidence, { label: "", url: "", detail: "" }] })}>＋ 新增參考</button>
                </Panel>
              </>}

              {tab === "media" && <>
                <Panel number="01" title="作品畫面" description="加入截圖、成品或設計過程。圖片會依比例呈現，搭配清楚的圖說。">
                  {project.images.map((item, index) => <div className={styles.block} key={index}><div className={styles.blockToolbar}><span>圖片 {index + 1}</span><OrderControls label={`圖片 ${index + 1}`} index={index} count={project.images.length} onMove={direction => setLocalized({ images: reorder(project.images, index, direction) })} onRemove={() => setLocalized({ images: project.images.filter((_, imageIndex) => imageIndex !== index) })} /></div><Field label={`圖片 ${index + 1} 網址`} value={item.src} onChange={src => setLocalized({ images: project.images.map((current, imageIndex) => imageIndex === index ? { ...current, src } : current) })} placeholder="https://… 或 /projects/example.png" /><Field label={`圖片 ${index + 1} 替代文字`} value={item.alt} onChange={alt => setLocalized({ images: project.images.map((current, imageIndex) => imageIndex === index ? { ...current, alt } : current) })} hint="描述畫面內容，協助使用螢幕閱讀器的訪客。" /><Field label={`圖片 ${index + 1} 圖說`} value={item.caption || ""} multiline onChange={caption => setLocalized({ images: project.images.map((current, imageIndex) => imageIndex === index ? { ...current, caption } : current) })} /></div>)}
                  {project.images.length === 0 && <div className={styles.mediaEmpty}><strong>尚未加入圖片</strong><p>加入已上傳的圖片網址，或網站 public 資料夾中的圖片路徑。</p></div>}
                  <button type="button" className={styles.addButton} onClick={() => setLocalized({ images: [...project.images, { src: "", alt: "", caption: "" }] })}>＋ 新增圖片</button>
                </Panel>
                <Panel number="02" title="動態展示" description="支援直接影片檔網址，例如 .mp4 或 .webm。請使用可公開存取的影片來源。">
                  {project.video ? <><Field label="影片網址" value={project.video.src} onChange={src => setLocalized({ video: { ...project.video!, src } })} /><Field label="影片封面網址" value={project.video.poster || ""} onChange={poster => setLocalized({ video: { ...project.video!, poster } })} /><Field label="影片圖說" value={project.video.caption} onChange={caption => setLocalized({ video: { ...project.video!, caption } })} /><Field label="影片文字說明" value={project.video.transcript || ""} multiline onChange={transcript => setLocalized({ video: { ...project.video!, transcript } })} hint="提供文字版內容，讓訪客不播放影片也能了解作品。" /><button type="button" className={styles.textButton} onClick={() => setLocalized({ video: undefined })}>移除影片</button></> : <button type="button" className={styles.addButton} onClick={() => setLocalized({ video: { src: "", caption: "" } })}>＋ 加入影片</button>}
                </Panel>
              </>}

              {tab === "settings" && <>
                <Panel number="01" title="作品的所在位置" description="設定作品的網址、系列與出場順序，中英文版本共用。">
                  <Field label="網址代稱" value={document.slug} disabled={!!selectedSlug} onChange={slug => { setDocument(current => ({ ...current, slug, en: { ...current.en, slug }, zh: { ...current.zh, slug } })); setNotice(null); }} placeholder="my-new-project" hint={selectedSlug ? "既有專案的網址固定，避免已分享的連結失效。" : "使用小寫英文、數字與連字號。儲存後固定為 /projects/網址代稱。"} />
                  <label className={styles.field}><span>作品系列</span><select value={document.collection} onChange={event => setDocument(current => ({ ...current, collection: event.target.value as ProjectCollectionId }))}>{projectCollections.map(group => <option key={group.id} value={group.id}>{group.label.zh}</option>)}</select></label>
                  <Field label="排列順序" type="number" value={document.sortOrder} onChange={sortOrder => setDocument(current => ({ ...current, sortOrder: Number(sortOrder) || 0 }))} hint="數字越小，作品越前面。" />
                  <label className={styles.field}><span>專案示意圖樣式</span><select value={project.visual} onChange={event => setShared({ visual: event.target.value as Project["visual"] })}>{visualOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><small>未設定封面圖片時，套用於作品卡片與專案頁。</small></label>
                </Panel>
                <Panel number="02" title="展示方式" description={local ? "這些設定會在按下「發布至本機」後套用到本機作品集。" : "這些設定會在按下「發布」後套用到公開網站。"}>
                  <label className={styles.setting}><span><strong>精選作品</strong><small>放入作品集的精選專案區。</small></span><input type="checkbox" checked={project.featured} onChange={event => setShared({ featured: event.target.checked })} /></label>
                  <label className={styles.setting}><span><strong>顯示於專案列表</strong><small>讓訪客從完整作品列表找到這件專案。</small></span><input type="checkbox" checked={document.listed} onChange={event => setDocument(current => ({ ...current, listed: event.target.checked }))} /></label>
                  <label className={styles.setting}><span><strong>收錄於作品存檔</strong><small>加入作品集的分類索引與歷年作品。</small></span><input type="checkbox" checked={document.archived} onChange={event => setDocument(current => ({ ...current, archived: event.target.checked }))} /></label>
                </Panel>
                <section className={styles.publicationPanel}><h3>發布與下架</h3><p>{local ? "儲存草稿只會保存編輯內容；發布會更新本機作品集的中英文版本。下架會保留內容，並從本機作品集移除。" : "儲存草稿只會保存編輯內容；發布會一次更新中英文版本。下架會保留內容，並從公開網站移除。"}</p><div className={styles.publicationActions}>{isPublic && selectedSlug && <Link href={`/projects/${selectedSlug}?lang=${locale === "zh" ? "zh-TW" : "en"}`} target="_blank" rel="noreferrer">{local ? "查看本機發布版本 ↗" : "查看目前公開版本 ↗"}</Link>}<button type="button" className={styles.dangerButton} disabled={!available || !isPublic || !!pending} onClick={() => persist("unpublish")}>{pending === "unpublish" ? "下架中…" : "下架專案"}</button></div></section>
              </>}
            </fieldset>
            <p className={styles.editorFootnote}>每次儲存與發布都會包含中英文版本。安心編輯，確認後再發布。</p>
          </div>
          {showPreview && <aside className={styles.preview} aria-label="專案即時預覽"><div className={styles.previewHeading}><div><span className={styles.liveDot} />即時預覽</div><span>{locale === "zh" ? "繁體中文" : "English"}</span></div><p className={styles.previewHint}>內容預覽・發布前僅你可見</p><Preview project={project} locale={locale} /></aside>}
        </div>
      </div>
    </div>
  </main>;
}
