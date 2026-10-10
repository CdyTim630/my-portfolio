import type { Project } from "./projects";
import type { ProjectCollectionId } from "./project-collections";

export type { ProjectCollectionId } from "./project-collections";

/** Content and its placement are versioned together when a project is published. */
export type ProjectDocument = {
  slug: string;
  collection: ProjectCollectionId;
  sortOrder: number;
  listed: boolean;
  archived: boolean;
  en: Project;
  zh: Project;
};

export type ProjectAdminEntry = {
  document: ProjectDocument;
  status: "seed" | "draft" | "published" | "unpublished";
  hasDraftChanges: boolean;
  updatedAt?: string;
  publishedDocument?: ProjectDocument | null;
};

export type ProjectAction = "save" | "publish" | "unpublish";
