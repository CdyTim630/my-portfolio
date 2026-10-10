# Portfolio font subsets

Created 10 October 2026 from the unchanged, officially sourced files in `../personal/`. These derivative WOFF2 files are used only by `components/HomeThemeSwitcher.tsx`; the original personal website continues using its complete fonts.

- Archivo Bold (700) and Black (900): [Omnibus-Type/Archivo](https://github.com/Omnibus-Type/Archivo/tree/211127690e8ff106c36c935f7e5e697114cff103), revision `211127690e8ff106c36c935f7e5e697114cff103`, original `fonts/webfonts/Archivo-Bold.woff2` and `Archivo-Black.woff2`.
- Space Grotesk: [floriankarsten/space-grotesk](https://github.com/floriankarsten/space-grotesk/tree/03507d024a01282884232081fc6011c09ff4e849), revision `03507d024a01282884232081fc6011c09ff4e849`, original `fonts/woff2/SpaceGrotesk[wght].woff2`. Variable weight axis 300–700 preserved.

Both families are licensed under SIL Open Font License 1.1. The original complete copyright/license texts are copied unchanged into `Archivo-LICENSE.txt` and `SpaceGrotesk-LICENSE.txt`. These modified subsets remain under that license. Neither included license declares a reserved font name. See `../personal/SOURCE.md` for original file hashes.

## Subsetting and validation

Tool: fontTools 4.60.2, Brotli 1.2.0, in a temporary Python environment. No build or runtime dependency was added to the website.

Retained Unicode ranges: Basic Latin, Latin-1 Supplement, Latin Extended-A, combining marks, general punctuation, currency symbols, letterlike symbols and arrows, plus the minus sign, byte-order mark and replacement character where present:

```text
U+0000-00FF,U+0100-017F,U+0300-036F,U+2000-206F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2212,U+FEFF,U+FFFD
```

Equivalent reproduction command for each original input and corresponding output:

```sh
pyftsubset INPUT.woff2 --output-file=OUTPUT.woff2 --flavor=woff2 \
  --unicodes='U+0000-00FF,U+0100-017F,U+0300-036F,U+2000-206F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2212,U+FEFF,U+FFFD' \
  --layout-features='*' --name-IDs='*' --name-languages='*' --notdef-outline
```

Retained existing layout features, names, hinting and `.notdef` outline. Reopened each WOFF2 to verify Unicode coverage, unchanged vertical metrics and ASCII advance widths, and the variable weight axis. Chinese text continues using the existing system-font fallback; these original fonts did not provide Chinese glyphs. Characters outside the subset also fall back to the next configured font.

| Output | Original bytes | Subset bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `archivo-bold-latin.woff2` | 53,360 | 36,640 | `b70592c6a7acbe1e9427f9c1b91efa819e6e5a88c70c581feb7d77d7ba02ec96` |
| `archivo-black-latin.woff2` | 52,504 | 35,772 | `224a98243b4e990642b31642b445e5493b5cb60870fd7b4d3ab39eda31515f7d` |
| `space-grotesk-variable-latin.woff2` | 49,256 | 36,144 | `01f7ca5e2d50427593a2181c443a4922aabc7966d0d44b9323aa65a0da2b7594` |

Combined: 155,120 → 108,556 bytes, saving 46,564 bytes (30.0%) when all three faces are requested. Existing loading behavior is retained: the body face is preloaded, heading faces are not. This is a measured asset-size reduction; a page-level performance improvement should be verified by the final build and Lighthouse run.
