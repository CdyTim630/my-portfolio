import type { MetadataRoute } from "next";
import { getPublicProjectDocuments } from "@/lib/project-cms";
import { siteUrl } from "@/lib/seo";
import { getPublicContent } from "@/lib/public-content";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ posts }, projects] = await Promise.all([getPublicContent(), getPublicProjectDocuments()]);
  return [
    { url: siteUrl, priority: 1 },
    { url: `${siteUrl}/portfolio`, priority: 0.9 },
    { url: `${siteUrl}/projects`, priority: 0.9 },
    { url: `${siteUrl}/blog`, priority: 0.7 },
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.id}`,
      lastModified: new Date(post.updated_at || post.created_at),
      priority: 0.6,
    })),
  ];
}
