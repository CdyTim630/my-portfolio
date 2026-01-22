// Experience data
export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

export const experiences: Experience[] = [
  {
    id: "1",
    title: "Internship - Backend Engineer (Expected, confirmed in February 2026)",
    company: "National Taiwan University ",
    period: "2026 - Present",
    description: "Develop and maintain services for teachers and students.",
    skills: ["Backend", "TypeScript"],
  },
  {
    id: "2",
    title: "Teaching Assistant - Calculus",
    company: "Department of Information Management, National Taiwan University",
    period: "2025 - Present",
    description: "Led review sessions, clarified key mathematical concepts, and provided individualized academic support. Collaborated with other lecturers on material preparation and student progress monitoring. Strengthened communication skills by explaining technical concepts clearly and efficiently. Strengthened communication skills by explaining technical concepts clearly and efficiently",
    skills: ["Calculus", "Teaching", "Latex"],
  },
];
