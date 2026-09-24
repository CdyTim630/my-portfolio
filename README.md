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

`CRON_SECRET` is optional. If you add it to the Vercel Production environment,
use a random value of at least 16 characters. Vercel automatically sends it as
a Bearer token when invoking the cron route, and other callers receive `401`.
Without it, the route remains public so the scheduled reads still run; this
route only makes small, read-only queries with the public anon key.

The existing variables are also required in Production:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# Optional: CRON_SECRET=your-random-secret
```

After the next production deployment, confirm that
`/api/cron/supabase-keepalive` appears in **Vercel → Project → Settings → Cron
Jobs**, is enabled, and its **View Logs** show a daily `200` response with
`{ "ok": true }`. A `502` means the Supabase query failed; check that the
Production URL/key point to the intended project and that `posts` is readable.
If you set `CRON_SECRET`, redeploy so the function receives the new value.

The cron uses the public anon key and a read-only query, so no Supabase
`service_role` key is needed. Vercel Cron runs only on production deployments.
If Supabase has already paused the project, resume it in the Supabase Dashboard
once; the scheduled reads cannot resume a paused project. A paid Supabase plan
is the only guaranteed way to prevent automatic inactivity pausing.
