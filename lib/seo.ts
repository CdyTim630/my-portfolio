function getSiteUrl(configured: string | undefined): string {
  try {
    const url = new URL(configured || "https://cdytim.vercel.app");
    if (
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    )
      return url.origin;
  } catch {
    /* An invalid optional setting must not break public rendering. */
  }
  return "https://cdytim.vercel.app";
}

export const siteUrl = getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
