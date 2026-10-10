import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProjectStudio from "@/app/admin/projects/ProjectStudio";
import { seedProjectDocuments } from "@/lib/project-cms-seeds";
import type { ProjectAdminEntry, ProjectDocument } from "@/lib/project-cms-types";

const document = seedProjectDocuments[0];
const entry: ProjectAdminEntry = { document, status: "seed", hasDraftChanges: false, publishedDocument: document };
const secondEntry: ProjectAdminEntry = { document: seedProjectDocuments[1], status: "seed", hasDraftChanges: false, publishedDocument: seedProjectDocuments[1] };

afterEach(() => vi.unstubAllGlobals());

describe("project studio editing", () => {
  it("sends local changes only to the local workspace API and explains the publication scope", async () => {
    const fetch = vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(init.body as string);
      return { ok: true, json: async () => ({ entry: { ...entry, document: body.document, status: body.action === "save" ? "draft" : "published", hasDraftChanges: body.action === "save", publishedDocument: body.action === "save" ? document : body.document } }) };
    });
    vi.stubGlobal("fetch", fetch);
    render(<ProjectStudio initialEntries={[entry]} available mode="local" />);
    expect(screen.getByText("本機工作區 · 修改儲存在這台電腦，發布只更新本機作品集。")).toBeVisible();
    expect(screen.getByRole("link", { name: /管理中心/ })).toHaveAttribute("href", "/local-admin");
    fireEvent.change(screen.getByLabelText("專案名稱"), { target: { value: "本機草稿" } });
    fireEvent.click(screen.getByRole("button", { name: "儲存草稿" }));
    await waitFor(() => expect(screen.getByText("草稿已儲存在這台電腦。本機作品集維持原本的版本。")).toBeVisible());
    expect(fetch).toHaveBeenLastCalledWith(`/api/local-admin/projects/${document.slug}`, expect.objectContaining({ method: "PUT" }));
    expect(JSON.parse(fetch.mock.calls[0][1].body as string)).toMatchObject({ action: "save", document: { zh: { title: "本機草稿" } } });
    fireEvent.click(screen.getByRole("button", { name: "發布至本機" }));
    await waitFor(() => expect(screen.getByText("專案已發布至本機作品集，中英文內容已更新。")).toBeVisible());
    expect(JSON.parse(fetch.mock.calls[1][1].body as string)).toMatchObject({ action: "publish" });
  });

  it("keeps independent language edits and shared technology input while switching languages", () => {
    render(<ProjectStudio initialEntries={[entry]} available />);
    fireEvent.change(screen.getByLabelText("專案名稱"), { target: { value: "中文新名稱" } });
    fireEvent.change(screen.getByLabelText("技術標籤"), { target: { value: "Next.js, TypeScript, " } });
    expect(screen.getByLabelText("技術標籤")).toHaveValue("Next.js, TypeScript, ");
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByLabelText("專案名稱")).toHaveValue(document.en.title);
    expect(screen.getByLabelText("技術標籤")).toHaveValue("Next.js, TypeScript, ");
    fireEvent.change(screen.getByLabelText("專案名稱"), { target: { value: "English new name" } });
    fireEvent.click(screen.getByRole("button", { name: "繁體中文" }));
    expect(screen.getByLabelText("專案名稱")).toHaveValue("中文新名稱");
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByLabelText("專案名稱")).toHaveValue("English new name");
  });

  it("saves drafts separately and retains the public version and unpublish control", async () => {
    const saved: { action: string; document: ProjectDocument }[] = [];
    vi.stubGlobal("fetch", vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(init.body as string);
      saved.push(body);
      return { ok: true, json: async () => ({ entry: { document: body.document, status: body.action === "save" ? "draft" : "published", hasDraftChanges: body.action === "save", publishedDocument: body.action === "save" ? document : body.document } }) };
    }));
    render(<ProjectStudio initialEntries={[entry]} available />);
    fireEvent.change(screen.getByLabelText("專案名稱"), { target: { value: "修改草稿" } });
    fireEvent.change(screen.getByLabelText("技術標籤"), { target: { value: " Next.js, TypeScript, " } });
    fireEvent.click(screen.getByRole("button", { name: "儲存草稿" }));
    await waitFor(() => expect(screen.getByText("草稿已儲存。公開頁面維持原本的版本。")).toBeVisible());
    expect(saved[0].action).toBe("save");
    expect(saved[0].document.zh.title).toBe("修改草稿");
    expect(saved[0].document.en.title).toBe(document.en.title);
    expect(saved[0].document.en.stack).toEqual(["Next.js", "TypeScript"]);
    fireEvent.click(screen.getByRole("tab", { name: /展示設定/ }));
    expect(screen.getByRole("button", { name: "下架專案" })).toBeEnabled();
    expect(screen.getByRole("link", { name: /查看目前公開版本/ })).toHaveAttribute("href", `/projects/${document.slug}?lang=zh-TW`);
    fireEvent.click(screen.getByRole("button", { name: "發布更新 ↗" }));
    await waitFor(() => expect(screen.getByText("專案已發布，中英文內容已同步更新至公開頁面。")).toBeVisible());
    expect(saved[1].action).toBe("publish");
    expect(saved[1].document.zh.title).toBe("修改草稿");
  });

  it("retains edits when a save fails and announces the error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "儲存服務暫時無法連線" }) }));
    render(<ProjectStudio initialEntries={[entry]} available />);
    fireEvent.change(screen.getByLabelText("專案名稱"), { target: { value: "尚未保存的名稱" } });
    fireEvent.click(screen.getByRole("button", { name: "儲存草稿" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("儲存服務暫時無法連線"));
    expect(screen.getByLabelText("專案名稱")).toHaveValue("尚未保存的名稱");
    expect(screen.getByText("● 尚未儲存")).toBeVisible();
    expect(screen.getByRole("button", { name: "儲存草稿" })).toBeEnabled();
  });

  it("guards unsaved project changes and internal navigation", () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<ProjectStudio initialEntries={[entry, secondEntry]} available />);
    fireEvent.change(screen.getByLabelText("專案名稱"), { target: { value: "保留修改" } });
    fireEvent.click(screen.getByRole("button", { name: new RegExp(secondEntry.document.zh.title) }));
    expect(confirm).toHaveBeenCalledOnce();
    expect(screen.getByLabelText("專案名稱")).toHaveValue("保留修改");
    expect(fireEvent.click(screen.getByRole("link", { name: /管理中心/ }))).toBe(false);
    expect(confirm).toHaveBeenCalledTimes(2);
  });

  it("allows editing and previewing when storage is unavailable while disabling writes", () => {
    render(<ProjectStudio initialEntries={[entry]} available={false} />);
    expect(screen.getByRole("status")).toHaveTextContent("暫時無法連接作品儲存空間");
    fireEvent.change(screen.getByLabelText("專案簡介"), { target: { value: "只在工作室預覽的新簡介" } });
    expect(screen.getByText("只在工作室預覽的新簡介", { selector: "p" })).toBeVisible();
    expect(screen.getByRole("button", { name: "儲存草稿" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "發布更新 ↗" })).toBeDisabled();
  });

  it("requires bilingual titles for a new draft and helps find the missing language", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(<ProjectStudio initialEntries={[entry]} available />);
    fireEvent.click(screen.getByRole("button", { name: "＋ 新增專案" }));
    fireEvent.change(screen.getByLabelText("專案名稱"), { target: { value: "新的作品" } });
    fireEvent.click(screen.getByRole("tab", { name: /展示設定/ }));
    fireEvent.change(screen.getByLabelText("網址代稱"), { target: { value: "new-project" } });
    fireEvent.click(screen.getByRole("button", { name: "儲存草稿" }));
    expect(screen.getByRole("alert")).toHaveTextContent("請填寫英文的專案名稱");
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("專案名稱")).toHaveValue("");
    expect(fetch).not.toHaveBeenCalled();
  });
});
