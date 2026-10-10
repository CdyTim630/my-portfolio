export function calculateReadTime(content: string): string {
  const chineseCharacters = (content.match(/[\u4e00-\u9fff]/g) || []).length;
  const words = content.replace(/[\u4e00-\u9fff]/g, " ").split(/\s+/).filter(Boolean).length;
  const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  return `${Math.max(1, Math.ceil(chineseCharacters / 500 + words / 200 + images / 6))} min read`;
}
