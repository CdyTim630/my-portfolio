import { expect, test, type Page } from "@playwright/test";
import { projects, type Project } from "../../lib/projects";
import { localizeProject } from "../../lib/localized-projects";
import type { PortfolioLocale } from "../../lib/portfolio-locale";
import {
  type AdditionalProject,
} from "../../lib/project-archive";
import { projectCollections } from "../../lib/project-collections";
import { seedProjectDocuments } from "../../lib/project-cms-seeds";
import { projectArchiveEntry, projectGalleryEntry } from "../../lib/project-presentation";

const additionalProjects = seedProjectDocuments.filter((document) => document.archived).map((document) => projectArchiveEntry(document));
const featuredAdditionalProjects = seedProjectDocuments.filter((document) => document.archived && document.en.featured).map((document) => projectArchiveEntry(document));
const projectGalleryMeta = Object.fromEntries(seedProjectDocuments.map((document) => [document.slug, projectGalleryEntry(document)]));

async function expectNoHorizontalOverflow(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    )
    .toBe(true);
}

async function expectCaseStudyContent(
  page: Page,
  sourceProject: Project,
  locale: PortfolioLocale,
) {
  const project = localizeProject(sourceProject, locale);
  const zh = locale === "zh-TW";
  await expect(page.locator(".portfolio-theme")).toHaveAttribute(
    "lang",
    locale,
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    project.title,
  );
  await expect(
    page.getByRole("link", {
      name: zh ? "查看原始碼" : "View source",
      exact: true,
    }),
  ).toHaveAttribute("href", project.repository);
  if (project.demo)
    await expect(
      page.getByRole("link", {
        name: zh ? "線上展示" : "Live demo",
        exact: true,
      }),
    ).toHaveAttribute("href", project.demo);
  await expect(
    page.locator(".case-article > section:not(#evidence)"),
  ).toHaveCount(project.sections.length);
  for (const section of project.sections) {
    const content = page.locator(`#${section.id}`);
    await expect(content.getByRole("heading", { level: 2 })).toHaveText(
      section.title,
    );
    await expect(content).toContainText(section.paragraphs[0]);
  }
  const architecture = page.locator("#architecture .architecture-nodes > li");
  await expect(architecture).toHaveCount(project.architecture.length);
  for (const [index, node] of project.architecture.entries()) {
    await expect(architecture.nth(index).locator("strong")).toHaveText(
      node.label,
    );
    await expect(architecture.nth(index).locator("p")).toHaveText(node.detail);
  }
  await expect(page.locator("#evidence li")).toHaveCount(
    project.evidence.length,
  );
  for (const evidence of project.evidence)
    await expect(
      page
        .locator("#evidence")
        .getByRole("link", { name: evidence.label, exact: true }),
    ).toHaveAttribute("href", evidence.url);
  const language = page.getByRole("navigation", {
    name: zh ? "作品集語言" : "Portfolio language",
  });
  await expect(language.getByRole("link")).toHaveCount(1);
  await expect(
    language.getByRole("link", { name: zh ? "Switch to English" : "切換至繁體中文", exact: true }),
  ).toHaveAttribute("href", `/projects/${project.slug}?lang=${zh ? "en" : "zh-TW"}`);
  await expect(language).toHaveAttribute("data-language", locale);

  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  // Ancestor overflow: clip can hide an oversized grid track without increasing
  // document.scrollWidth. Measure the content boxes directly; a code block may
  // still scroll horizontally inside a correctly sized section.
  await expect
    .poll(
      () =>
        page.locator(".case-article").evaluate((article) => {
          const articleBounds = article.getBoundingClientRect();
          const viewportWidth = document.documentElement.clientWidth;
          return [
            article,
            ...article.querySelectorAll(".case-section, .architecture-diagram"),
          ].flatMap((element) => {
            const bounds = element.getBoundingClientRect();
            const minLeft =
              element === article ? 0 : Math.max(0, articleBounds.left);
            const maxRight =
              element === article
                ? viewportWidth
                : Math.min(viewportWidth, articleBounds.right);
            return bounds.width > 0 &&
              bounds.left >= minLeft - 1 &&
              bounds.right <= maxRight + 1
              ? []
              : [
                  {
                    element: element.id || element.className,
                    left: bounds.left,
                    right: bounds.right,
                    width: bounds.width,
                    allowedLeft: minLeft,
                    allowedRight: maxRight,
                  },
                ];
          });
        }),
      {
        message: `${project.slug} (${locale}) case content must remain inside its article and viewport`,
      },
    )
    .toEqual([]);
}

async function expectArchiveDisclosure(
  page: Page,
  project: AdditionalProject,
  language: "en" | "zh",
) {
  const card = page.locator(`.archive-card[data-project-id="${project.id}"]`);
  await expect(
    card.getByRole("heading", { name: project.title[language], exact: true }),
  ).toBeVisible();
  await expect(card.locator(".gallery-teaser")).toHaveText(projectGalleryMeta[project.id].teaser[language]);
  await expect(card.locator(".gallery-teaser")).toBeVisible();
  const details = card.locator("details");
  const summary = details.locator("summary");
  await expect(summary).toContainText(
    language === "en" ? "Details" : "專案詳情",
  );
  await expect(card.locator(".archive-summary")).not.toBeVisible();
  await summary.click();
  await expect(details).toHaveAttribute("open", "");
  if (project.summary[language].trim() !== projectGalleryMeta[project.id].teaser[language].trim()) {
    await expect(card.locator(".archive-summary")).toHaveText(project.summary[language]);
    await expect(card.locator(".archive-summary")).toBeVisible();
  } else {
    // The introduction stays above the disclosure; opening details should not repeat it.
    await expect(card.locator(".archive-summary")).toHaveCount(0);
  }
  await expect(card.locator(".archive-contribution")).toContainText(
    project.contribution[language],
  );
  await expect(card.locator(".archive-contribution")).toBeVisible();
  const destinations = await card
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  for (const url of [project.repository, project.demo, project.evidence].filter(
    Boolean,
  ))
    expect(destinations).toContain(url);
  if (seedProjectDocuments.some((document) => document.slug === project.id))
    await expect(
      card.getByRole("link", {
        name: language === "en" ? "Read project" : "閱讀專案",
        exact: true,
      }),
    ).toHaveAttribute(
      "href",
      `/projects/${project.id}?lang=${language === "en" ? "en" : "zh-TW"}`,
    );
  if (project.sourceLabel)
    await expect(
      card.getByText(project.sourceLabel[language], { exact: true }),
    ).toBeVisible();
  await summary.click();
  await expect(card.locator(".archive-summary")).not.toBeVisible();
}

test("portfolio landing page presents engineering work and working project navigation", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/portfolio?lang=en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Download resume" }),
  ).toHaveAttribute("href", /^https:\/\//);
  await expect(page.locator("main .work-card")).toHaveCount(
    projects.filter((project) => project.featured).length +
      featuredAdditionalProjects.length,
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("link", { name: "b13705020@ntu.edu.tw" }),
  ).toHaveAttribute("href", "mailto:b13705020@ntu.edu.tw");
  await expect(page.locator(".collection-folder")).toHaveCount(
    projectCollections.length,
  );
  for (const collection of projectCollections) {
    await expect(
      page.locator(`.collection-folder[data-category="${collection.id}"]`),
    ).toHaveAttribute("href", `/projects?lang=en#collection-${collection.id}`);
  }
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("portfolio.png"),
    fullPage: true,
  });
  for (const project of featuredAdditionalProjects)
    await expect(
      page.locator(
        `[data-featured-project="${project.id}"] .work-card-title a`,
      ),
    ).toHaveAttribute("href", `/projects/${project.id}?lang=en`);
  const sigmile = projects.find((project) => project.slug === "sigmile")!;
  await page
    .locator('[data-featured-project="sigmile"] .work-card-title a')
    .click();
  await expect(page).toHaveURL(/\/projects\/sigmile\?lang=en$/);
  await expectCaseStudyContent(page, sigmile, "en");
  await page.goBack();
  await expect(page).toHaveURL(/\/portfolio\?lang=en$/);
  await page.getByRole("link", { name: "View projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\?lang=en$/);
  expect(errors).toEqual([]);
});

test("personal website and portfolio preserve separate styles and theme preferences", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Ding-Yuan\s*Chen/,
  );
  await expect(page.locator(".personal-site")).toHaveCount(1);
  await expect(page.locator(".home-theme")).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https?:\/\/[^/]+\/?$/,
  );
  await expectNoHorizontalOverflow(page);
  const personalFont = await page
    .getByRole("heading", { level: 1 })
    .evaluate((element) => getComputedStyle(element).fontFamily);
  await page
    .getByRole("button", { name: "Open personal theme selector" })
    .click();
  await page
    .getByRole("group", { name: "Personal website color theme" })
    .getByRole("button", { name: "Dark", exact: true })
    .click();
  await expect(page.locator(".personal-site")).toHaveAttribute(
    "data-mode",
    "dark",
  );
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("personal-homepage-dark.png"),
    fullPage: true,
  });

  await page.getByRole("link", { name: "View portfolio", exact: true }).click();
  await expect(page).toHaveURL(/\/portfolio(?:\?lang=en)?$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".personal-site")).toHaveCount(0);
  await expect(page.locator(".home-theme")).toHaveAttribute(
    "data-mode",
    "light",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/portfolio(?:\?lang=en)?$/,
  );
  await expectNoHorizontalOverflow(page);
  await page
    .getByRole("combobox", { name: "Color theme" })
    .selectOption("color");
  await expect(page.locator(".home-theme")).toHaveAttribute(
    "data-mode",
    "color",
  );

  const menu = page.getByRole("button", { name: "Open menu" });
  if (await menu.isVisible()) {
    await menu.click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Personal website", exact: true })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Personal website", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Ding-Yuan\s*Chen/,
  );
  await expect(page.locator(".personal-site")).toHaveAttribute(
    "data-mode",
    "dark",
  );
  await expect(page.locator(".home-theme")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  expect(
    await page
      .getByRole("heading", { level: 1 })
      .evaluate((element) => getComputedStyle(element).fontFamily),
  ).toBe(personalFont);
  await page
    .getByRole("button", { name: "Open personal theme selector" })
    .click();
  await page
    .getByRole("group", { name: "Personal website color theme" })
    .getByRole("button", { name: "Light", exact: true })
    .click();
  await expect(page.locator(".personal-site")).toHaveAttribute(
    "data-mode",
    "light",
  );
  await page.screenshot({
    path: testInfo.outputPath("personal-homepage-light.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "View portfolio", exact: true }).click();
  await expect(page.locator(".home-theme")).toHaveAttribute(
    "data-mode",
    "color",
  );
  await expectNoHorizontalOverflow(page);
});

test("project filters and every published case study are usable", async ({
  page,
}, testInfo) => {
  await page.goto("/projects?lang=en");
  await expect(page.locator(".work-card")).toHaveCount(projects.length);
  await expect(page.locator(".archive-card")).toHaveCount(
    additionalProjects.length,
  );
  await expect(
    page.locator(".archive-card").filter({ hasText: "SIGmile" }),
  ).toHaveCount(1);
  const categories = page.getByRole("group", {
    name: "Browse project categories",
  });
  await expect(
    categories.getByRole("button", { name: "All work", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".archive-collection")).toHaveCount(
    projectCollections.length,
  );
  for (const collection of projectCollections) {
    const count = additionalProjects.filter(
      (project) => projectGalleryMeta[project.id].category === collection.id,
    ).length;
    const button = categories.getByRole("button", {
      name: collection.label.en,
      exact: true,
    });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".archive-card")).toHaveCount(count);
    await expect(page.locator(".archive-collection")).toHaveCount(1);
    await expect(page.locator(".archive-collection")).toHaveAttribute(
      "data-category",
      collection.id,
    );
    await expect(page.locator(".archive-collection")).toHaveAttribute(
      "id",
      `collection-${collection.id}`,
    );
  }
  const archiveSearch = page.getByRole("searchbox", {
    name: "Search more projects",
  });
  const systems = projectCollections.find(
    (collection) => collection.id === "systems",
  )!;
  const systemsCount = additionalProjects.filter(
    (project) => projectGalleryMeta[project.id].category === "systems",
  ).length;
  await categories
    .getByRole("button", { name: systems.label.en, exact: true })
    .click();
  // SIGmile belongs to Data & Algorithms; search must respect the current category.
  await archiveSearch.fill("sigmile");
  await expect(page.locator(".archive-card")).toHaveCount(0);
  await expect(
    page.getByText(
      "No matches in this collection. Try another keyword or category.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(archiveSearch).toBeFocused();
  await expect(
    categories.getByRole("button", { name: systems.label.en, exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".archive-card")).toHaveCount(systemsCount);
  const data = projectCollections.find(
    (collection) => collection.id === "data",
  )!;
  await categories
    .getByRole("button", { name: data.label.en, exact: true })
    .click();
  await archiveSearch.fill("sigmile");
  await expect(page.locator(".archive-card")).toHaveCount(1);
  await expect(page.locator(".archive-card")).toContainText("SIGmile");
  await expectArchiveDisclosure(
    page,
    additionalProjects.find((project) => project.id === "sigmile")!,
    "en",
  );
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(archiveSearch).toBeFocused();
  await expect(
    categories.getByRole("button", { name: data.label.en, exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await categories
    .getByRole("button", { name: "All work", exact: true })
    .click();
  await expect(page.locator(".archive-card")).toHaveCount(
    additionalProjects.length,
  );
  await page.getByRole("button", { name: "Data", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Data", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".work-card")).toHaveCount(
    projects.filter((project) => project.category.includes("Data")).length,
  );
  await page.getByRole("button", { name: "Frontend", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Frontend", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".work-card")).toHaveCount(
    projects.filter((project) => project.category.includes("Frontend")).length,
  );
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".work-card")).toHaveCount(projects.length);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("projects.png"),
    fullPage: true,
  });
  for (const project of projects) {
    await page.goto(`/projects/${project.slug}?lang=en`);
    await expectCaseStudyContent(page, project, "en");
    await expectNoHorizontalOverflow(page);
    await page
      .getByRole("combobox", { name: "Color theme" })
      .selectOption("dark");
    await expect(page.locator(".home-theme")).toHaveAttribute(
      "data-mode",
      "dark",
    );
    await expectNoHorizontalOverflow(page);
    await page
      .getByRole("combobox", { name: "Color theme" })
      .selectOption("light");
  }
  await page.screenshot({
    path: testInfo.outputPath("case-study.png"),
    fullPage: true,
  });
});

test("keyboard navigation and persisted dark mode work", async ({
  page,
}, testInfo) => {
  await page.goto("/portfolio?lang=en");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  const menu = page.getByRole("button", { name: "Open menu" });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toHaveCount(0);
  }
  await page
    .getByRole("combobox", { name: "Color theme" })
    .selectOption("dark");
  await page.reload();
  await expect(page.locator(".home-theme")).toHaveAttribute(
    "data-mode",
    "dark",
  );
  await expect(page.getByRole("combobox", { name: "Color theme" })).toHaveValue(
    "dark",
  );
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("dark-portfolio.png"),
    fullPage: true,
  });
});

test("CMS outages preserve public pages and fail closed for administration", async ({
  page,
}) => {
  await page.goto("/blog");
  await expect(
    page.getByRole("heading", { level: 1, name: "Blog" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Writing is temporarily unavailable" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View portfolio" }).click();
  await expect(page).toHaveURL(/\/portfolio(?:\?lang=en)?$/);
  await page.goto("/admin/diary");
  await expect(page).toHaveURL(/\/login\?reason=unavailable$/);
  await expect(
    page.getByRole("heading", { name: "Administrator sign in" }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("unknown projects return an accessible 404", async ({ page }) => {
  const response = await page.goto("/projects/not-a-real-project?lang=en");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This path ends here." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore projects" }),
  ).toHaveAttribute("href", /^\/projects(?:\?lang=en)?$/);
});

test("public content remains visible without JavaScript", async ({
  browser,
  baseURL,
  viewport,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport,
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /Ding-Yuan\s*Chen/,
    );
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page
      .getByRole("link", { name: "View portfolio", exact: true })
      .click();
    await expect(page).toHaveURL(/\/portfolio(?:\?lang=en)?$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const sigmile = projects.find((project) => project.slug === "sigmile")!;
    await page
      .locator('[data-featured-project="sigmile"] .work-card-title a')
      .click();
    await expect(page).toHaveURL(/\/projects\/sigmile\?lang=en$/);
    await expectCaseStudyContent(page, sigmile, "en");
    await expect(page.locator("#my-role")).toBeVisible();
    await expect(page.locator(".back-link")).toHaveAttribute(
      "href",
      "/projects?lang=en",
    );
    await page.locator(".back-link").click();
    await expect(page).toHaveURL(/\/projects\?lang=en$/);
    await expect(page.locator(".work-card")).toHaveCount(projects.length);
    await expect(page.locator(".archive-card")).toHaveCount(
      additionalProjects.length,
    );
    await expect(page.locator(".archive-collection")).toHaveCount(
      projectCollections.length,
    );
    for (const project of additionalProjects)
      await expectArchiveDisclosure(page, project, "en");
    await expectNoHorizontalOverflow(page);
    await page.getByRole("link", { name: "Read project" }).first().click();
    for (const project of projects) {
      if (new URL(page.url()).pathname !== `/projects/${project.slug}`)
        await page.goto(`/projects/${project.slug}?lang=en`);
      await expectCaseStudyContent(page, project, "en");
      await expect(page.locator("#my-role")).toBeVisible();
      if (
        featuredAdditionalProjects.some(
          (featured) => featured.id === project.slug,
        )
      ) {
        await page.getByRole("link", { name: "切換至繁體中文", exact: true }).click();
        await expect(page).toHaveURL(
          (url) =>
            url.pathname === `/projects/${project.slug}` &&
            url.searchParams.get("lang") === "zh-TW",
        );
        await expectCaseStudyContent(page, project, "zh-TW");
        await expect(page.locator("#my-role")).toBeVisible();
        await expectNoHorizontalOverflow(page);
      }
    }
  } finally {
    await context.close();
  }
});

test("portfolio language switch translates complete cases and leaves personal pages unchanged", async ({
  page,
}, testInfo) => {
  await page.goto("/portfolio?lang=en");
  await expect(page.locator(".portfolio-theme")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: "切換至繁體中文", exact: true }).click();
  await expect(page).toHaveURL(/\/portfolio\?lang=zh-TW$/);
  await expect(page.locator(".portfolio-theme")).toHaveAttribute(
    "lang",
    "zh-TW",
  );
  await expect(
    page.getByRole("navigation", { name: "作品集語言" }),
  ).toHaveAttribute("data-language", "zh-TW");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /\p{Script=Han}/u,
  );
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("portfolio-zh-TW.png"),
    fullPage: true,
  });
  for (const project of featuredAdditionalProjects)
    await expect(
      page.locator(
        `[data-featured-project="${project.id}"] .work-card-title a`,
      ),
    ).toHaveAttribute("href", `/projects/${project.id}?lang=zh-TW`);
  await page
    .locator('[data-featured-project="sigmile"] .work-card-title a')
    .click();
  await expect(page).toHaveURL(/\/projects\/sigmile\?lang=zh-TW$/);
  await expectCaseStudyContent(
    page,
    projects.find((project) => project.slug === "sigmile")!,
    "zh-TW",
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/portfolio\?lang=zh-TW$/);
  await page.getByRole("link", { name: "查看作品", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\?lang=zh-TW$/);
  await expect(page.locator(".work-card")).toHaveCount(projects.length);
  await expect(page.locator(".archive-card")).toHaveCount(
    additionalProjects.length,
  );
  for (const project of additionalProjects) {
    const card = page.locator(`.archive-card[data-project-id="${project.id}"]`);
    await expect(
      card.getByRole("heading", { name: project.title.zh, exact: true }),
    ).toBeVisible();
    await expect(card.locator(".gallery-teaser")).toHaveText(projectGalleryMeta[project.id].teaser.zh);
    await expect(card.locator(".gallery-teaser")).toBeVisible();
  }
  const categories = page.getByRole("group", { name: "依分類瀏覽作品" });
  const data = projectCollections.find(
    (collection) => collection.id === "data",
  )!;
  await categories
    .getByRole("button", { name: data.label.zh, exact: true })
    .click();
  const archiveSearch = page.getByRole("searchbox", { name: "搜尋更多作品" });
  await archiveSearch.fill("餐點 Gurobi");
  await expect(page.locator(".archive-card")).toHaveCount(1);
  await expect(page.locator(".archive-card")).toContainText("便利商店");
  await expectArchiveDisclosure(
    page,
    additionalProjects.find(
      (project) => project.id === "convenience-store-meal-optimizer",
    )!,
    "zh",
  );
  await page.getByRole("button", { name: "清除", exact: true }).click();
  await expect(archiveSearch).toBeFocused();
  await expect(
    categories.getByRole("button", { name: data.label.zh, exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".archive-card")).toHaveCount(
    additionalProjects.filter(
      (project) => projectGalleryMeta[project.id].category === "data",
    ).length,
  );
  await categories
    .getByRole("button", { name: "全部作品", exact: true })
    .click();
  await expect(page.locator(".archive-card")).toHaveCount(
    additionalProjects.length,
  );
  await page.getByRole("button", { name: "資料工程", exact: true }).click();
  await expect(page.locator(".work-card")).toHaveCount(
    projects.filter((project) => project.category.includes("Data")).length,
  );
  await page.getByRole("button", { name: "前端開發", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "前端開發", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".work-card")).toHaveCount(
    projects.filter((project) => project.category.includes("Frontend")).length,
  );
  await page.getByRole("button", { name: "全部", exact: true }).click();
  await expectNoHorizontalOverflow(page);
  await page
    .getByRole("link", { name: "閱讀專案", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects\/[^?]+\?lang=zh-TW$/);

  for (const project of projects) {
    await page.goto(`/projects/${project.slug}?lang=zh-TW`);
    await expectCaseStudyContent(page, project, "zh-TW");
    await expectNoHorizontalOverflow(page);
  }

  // A saved Chinese preference applies to bare portfolio URLs; explicit EN wins.
  await page.goto("/portfolio");
  await expect(page.locator(".portfolio-theme")).toHaveAttribute(
    "lang",
    "zh-TW",
  );
  await page.goto("/portfolio?lang=en");
  await expect(page.locator(".portfolio-theme")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("link", { name: "View projects", exact: true }),
  ).toBeVisible();
  await page.goto("/portfolio");
  await page.getByRole("link", { name: "Switch to English", exact: true }).click();
  await expect(page).toHaveURL(/\/portfolio\?lang=en$/);
  await page.goto("/portfolio");
  await expect(page.locator(".portfolio-theme")).toHaveAttribute("lang", "en");

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Ding-Yuan\s*Chen/,
  );
  await expect(page.locator(".personal-site")).toHaveCount(1);
  await expect(page.locator(".language-switch")).toHaveCount(0);
  await page.goto("/blog");
  await expect(
    page.getByRole("heading", { level: 1, name: "Blog" }),
  ).toBeVisible();
  await expect(page.locator(".personal-site")).toHaveCount(1);
  await expect(page.locator(".language-switch")).toHaveCount(0);
});

test("metadata, safe API failure modes and cron authentication are enforced", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain(`/projects/${projects[0].slug}`);
  expect(sitemapText).toMatch(
    /<loc>https?:\/\/[^<]+\/portfolio(?:\?lang=en)?<\/loc>/,
  );
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /admin");
  const admin = await request.get("/api/admin/posts");
  expect(admin.status()).toBe(503);
  expect(admin.headers()["cache-control"]).toBe("no-store");
  // Production must keep the explicitly enabled development workspace inaccessible.
  expect((await request.get("/api/local-admin/projects")).status()).toBe(404);
  expect((await request.post("/api/local-admin/session")).status()).toBe(404);
  expect((await request.get("/local-admin/projects")).status()).toBe(404);
  const projectsAdmin = await request.get("/api/admin/projects");
  expect(projectsAdmin.status()).toBe(503);
  expect(projectsAdmin.headers()["cache-control"]).toBe("no-store");
  const projectMutation = await request.put("/api/admin/projects/employa", {
    data: { action: "publish", document: seedProjectDocuments[0] },
  });
  expect(projectMutation.status()).toBe(503);
  const foreignProjectMutation = await request.put("/api/admin/projects/employa", {
    data: {}, headers: { origin: "https://attacker.example" },
  });
  expect(foreignProjectMutation.status()).toBe(403);
  const badTrack = await request.post("/api/track", {
    data: { path: "//attacker.example" },
  });
  expect(badTrack.status()).toBe(400);
  const foreignMutation = await request.post("/api/admin/posts", {
    data: {},
    headers: { origin: "https://attacker.example" },
  });
  expect(foreignMutation.status()).toBe(403);
  expect((await request.get("/api/cron/supabase-keepalive")).status()).toBe(
    401,
  );
  const cron = await request.get("/api/cron/supabase-keepalive", {
    headers: {
      authorization: "Bearer smoke-tests-only-not-a-production-secret",
    },
  });
  expect(cron.status()).toBe(503);
});
