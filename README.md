# kohaku-wiki

A tiny, Wikipedia-styled static wiki for `kohaku-cli` docs. Plain Markdown in,
flat static HTML out, zero server-side moving parts — built to be pinned to
IPFS as-is.

## Layout

```
content/     one .md file per page (title/order/summary in frontmatter)
public/      static assets copied verbatim into dist/ (css, js, favicon)
scripts/
  build.js   renders content/ -> dist/*.html + dist/search-index.json.js
  serve.js   zero-dependency static file server for local preview
dist/        build output (gitignored) — this is what you publish
```

## Dev workflow

```bash
npm install
npm run dev     # builds once, then rebuilds on any content/public change
npm run serve   # serves dist/ at http://localhost:8080, in another terminal
```

Or just `npm run build` for a one-off build, or `npm start` to build once
and serve.

## Adding a page

Drop a new file in `content/`, e.g. `content/faq.md`:

```markdown
---
title: FAQ
order: 4
summary: Common questions
---

## Why does X happen?

...
```

`order` controls sidebar position; lower comes first. Rebuild and the page
appears automatically in the sidebar and search — nothing else to wire up.

## Why it's IPFS-safe

A few deliberate constraints keep this publishable as a plain directory on
IPFS, with no gateway-specific configuration:

- **All links are relative** (`./page.html`, `./wiki.css`), never absolute
  (`/page.html`). IPFS gateways serve your site under a path like
  `/ipfs/<CID>/`, so an absolute link would 404 the moment it's not hosted at
  domain root.
- **All pages are flat** in `dist/` (no subfolders), so relative linking
  between any two pages is always just `./other-page.html`.
- **No client-side routing** and no server-side rewrites — every page is a
  real file that exists on disk, so a gateway can serve it directly.
- **Search is inlined**, not fetched. The search index is emitted as a `<script>`
  (`search-index.json.js`, a JS var assignment) rather than JSON loaded via
  `fetch()`, so it works even where `fetch()` of a sibling file behaves
  oddly (some gateway configurations, or opening straight off `file://`).

## Publishing to IPFS

Build first:

```bash
npm run build
```

Then pick one of:

**Local IPFS node (Kubo)**

```bash
ipfs add -r dist
# prints a CID for the dist/ directory — pin it, then browse via
# https://<your-gateway>/ipfs/<CID>/  or  ipfs://<CID>/
ipfs pin add -r <CID>
```

**web3.storage / Storacha CLI** (no local node needed)

```bash
npx w3 up dist --no-wrap
```

**Pinata / Fleek / similar pinning services**

Most accept a straight folder upload through their web UI or CLI — just
upload the contents of `dist/`, not the project root (you don't want
`node_modules` or `content/` published, only the built output).

After pinning, the `index.html` inside `dist/` is your homepage — link people
to `https://<gateway>/ipfs/<CID>/index.html` (or just `.../<CID>/`, most
gateways resolve `index.html` automatically).
