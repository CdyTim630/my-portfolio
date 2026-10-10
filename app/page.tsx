import type { Metadata } from "next";
import PersonalHome from "@/components/personal/PersonalHome";

export const metadata: Metadata = {
  title: { absolute: "Ding-Yuan Chen · CdyTim" },
  description:
    "The personal website of Ding-Yuan Chen, an Information Management student at NTU. About me, experiences, writing, and a separate engineering portfolio.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ding-Yuan Chen · CdyTim",
    description: "About me, experiences, writing, and engineering projects.",
    url: "/",
  },
};

export const revalidate = 300;

export default function Home() {
  return <PersonalHome />;
}
