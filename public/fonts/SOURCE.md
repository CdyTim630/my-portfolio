# Self-hosted Geist fonts

Downloaded from the official [Vercel Geist repository](https://github.com/vercel/geist-font), revision [`10dc7658f13c38a474cde201bb09a4617267545b`](https://github.com/vercel/geist-font/tree/10dc7658f13c38a474cde201bb09a4617267545b), on 10 October 2026.

| Local file | Upstream path | Style / weight | Size |
| --- | --- | --- | --- |
| `geist-sans-variable.woff2` | `fonts/Geist/webfonts/Geist[wght].woff2` | Normal, variable 100–900 | 69,760 bytes |
| `geist-mono-variable.woff2` | `fonts/GeistMono/webfonts/GeistMono[wght].woff2` | Normal, variable 100–900 | 71,596 bytes |

The font bytes are unmodified; only local filenames differ. No static weights or italic variants are bundled. The `wght` range (minimum 100, default 400, maximum 900) was verified in the corresponding upstream variable TTF `fvar` tables at the same revision. Local files were checked for WOFF2 signatures.

Both fonts are licensed under **SIL Open Font License 1.1**. The upstream copyright notice and complete license are included unchanged in `LICENSE.txt`. Keep that file when redistributing the fonts.

SHA-256:

```text
2ffebe993e969069a9789d15164b7715d42491b5835516c5e3b935d5f81b05f1  geist-sans-variable.woff2
afaacc4c5fbba89d2ebf7a02dc4070208540874592a5504d57175782fe893101  geist-mono-variable.woff2
```

Load these with `next/font/local` or local `@font-face` rules, specifying weight `100 900`, normal style, and a system-font fallback. Fonts are served by this application; no Google Fonts or other runtime font-provider request is required.
