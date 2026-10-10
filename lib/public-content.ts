import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import { parsePositiveId } from "./validation";

export interface PublicPost {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  cover_image: string | null;
  spotify_track_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicCategory { name: string; color: string }
export interface PublicExperience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  sort_order: number;
}

const postColumns = "id,title,excerpt,content,category,cover_image,spotify_track_id,created_at,updated_at";

/** Live CMS content is never replaced by invented sample articles or experiences. */
export const getPublicContent = cache(async (): Promise<{
  posts: PublicPost[];
  categories: PublicCategory[];
  experiences: PublicExperience[];
  available: boolean;
}> => {
  const supabase = createPublicClient();
  if (!supabase) return { posts: [], categories: [], experiences: [], available: false };
  try {
    const [posts, categories, experiences] = await Promise.all([
      supabase.from("posts").select(postColumns).eq("published", true).order("created_at", { ascending: false }),
      supabase.from("categories").select("name,color").order("display_order", { ascending: true }),
      supabase.from("experiences").select("id,title,company,period,description,skills,sort_order").order("sort_order", { ascending: true }),
    ]);
    return {
      posts: (posts.data || []) as PublicPost[],
      categories: (categories.data || []) as PublicCategory[],
      experiences: (experiences.data || []).map((experience) => ({
        ...experience,
        // The original SQL allows NULL here; normalize legacy rows before UI use.
        skills: Array.isArray(experience.skills)
          ? experience.skills.filter((skill): skill is string => typeof skill === "string")
          : [],
      })) as PublicExperience[],
      available: !posts.error && !categories.error && !experiences.error,
    };
  } catch {
    return { posts: [], categories: [], experiences: [], available: false };
  }
});

export const getPublishedPost = cache(async (id: string): Promise<{ post: PublicPost | null; available: boolean }> => {
  let numericId: number;
  try { numericId = parsePositiveId(id); } catch { return { post: null, available: true }; }
  const supabase = createPublicClient();
  if (!supabase) return { post: null, available: false };
  try {
    const { data, error } = await supabase.from("posts").select(postColumns).eq("id", numericId).eq("published", true).maybeSingle();
    return { post: data as PublicPost | null, available: !error };
  } catch { return { post: null, available: false }; }
});
