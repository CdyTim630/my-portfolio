This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Keep Supabase active on the Free plan

The production deployment includes a Vercel Cron Job that performs three tiny
database reads every day at `03:00 UTC`. This creates regular database activity
for a low-traffic Supabase Free project.

Before deploying, add a Vercel environment variable named `CRON_SECRET` for the
Production environment. Use a random value of at least 16 characters. Vercel
automatically sends it as a Bearer token when invoking the cron route.

The existing variables are also required in Production:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
CRON_SECRET=your-random-secret
```

After the next production deployment, confirm that
`/api/cron/supabase-keepalive` appears in **Vercel → Project → Settings → Cron
Jobs**. A successful invocation returns `200` and `{ "ok": true }`; calls
without the Bearer token return `401`.

The cron uses the public anon key and a read-only query, so no Supabase
`service_role` key is needed. Vercel Cron runs only on production deployments.
