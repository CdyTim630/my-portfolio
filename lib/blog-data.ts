// Blog data types and mock data
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  coverImage?: string;
  spotifyTrackId?: string;
  published: boolean;
}

// Mock data - later you can connect to a database
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "設計系統的力量：如何打造一致的使用者體驗",
    excerpt: "探索如何通過建立設計系統來提升產品的一致性和開發效率...",
    content: `
## 前言

設計系統是現代產品開發的基石。它不僅僅是一套 UI 組件庫，更是一種思維方式和協作方法論。

## 什麼是設計系統？

設計系統包含了：
- **視覺語言**：顏色、字體、間距、圖標等
- **組件庫**：按鈕、表單、卡片等可重用組件
- **設計原則**：指導設計決策的核心理念
- **文檔**：使用指南和最佳實踐

## 為什麼需要設計系統？

1. **一致性**：確保產品各處體驗一致
2. **效率**：減少重複工作，加速開發
3. **協作**：設計師和開發者有共同語言

## 結語

建立設計系統是一項投資，但回報是巨大的。
    `,
    date: "2026-01-20",
    readTime: "5 min",
    category: "Design",
    spotifyTrackId: "4cOdK2wGLETKBW3PvgPWqT",
    published: true,
  },
  {
    id: "2",
    title: "Next.js 16 新功能探索",
    excerpt: "深入了解 Next.js 16 帶來的新功能和性能改進...",
    content: `
## Next.js 16 亮點

Next.js 16 帶來了許多令人興奮的新功能，讓開發體驗更上一層樓。

## Turbopack 正式版

Turbopack 現在已經是正式版本，提供了：
- 更快的開發伺服器啟動
- 即時的熱模組替換 (HMR)
- 優化的建置時間

## 新的路由功能

- 平行路由改進
- 攔截路由優化
- 更好的錯誤處理

## 結語

Next.js 16 是一個重要的版本更新，值得嘗試！
    `,
    date: "2026-01-18",
    readTime: "4 min",
    category: "Development",
    published: true,
  },
  {
    id: "3",
    title: "我的遠端工作經驗分享",
    excerpt: "分享三年遠端工作的心得與技巧...",
    content: `
## 遠端工作的挑戰與機遇

遠端工作已經成為新常態，但如何做好它需要技巧和紀律。

## 建立工作空間

一個好的工作環境是成功的一半：
- 專屬的工作區域
- 舒適的椅子和桌子
- 良好的照明

## 時間管理

- 設定固定的工作時間
- 使用番茄工作法
- 定期休息

## 保持社交

遠端不代表孤立：
- 定期視訊會議
- 虛擬咖啡時間
- 線下聚會

## 結語

遠端工作是一種技能，需要時間來掌握。
    `,
    date: "2026-01-15",
    readTime: "6 min",
    category: "Lifestyle",
    spotifyTrackId: "0VjIjW4GlUZAMYd2vXMi3b",
    published: true,
  },
];

export function getLatestPosts(count: number = 3): BlogPost[] {
  return blogPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getAllPosts(): BlogPost[] {
  return blogPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostById(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}
