#!/usr/bin/env node
"use strict";

/**
 * Build script.
 *
 * content/*.md  --> dist/*.html   (one flat directory, so every page can
 *                                  link to every other page with a plain
 *                                  relative "./slug.html" href — this is
 *                                  what makes the output IPFS-safe: there
 *                                  is no dependency on a web server doing
 *                                  path rewriting, absolute "/x" routing,
 *                                  or a specific mount point.)
 * public/*      --> dist/*        (copied as-is: css, images, favicon)
 *
 * Also emits dist/search-index.json, a tiny flat-file "search engine"
 * used by the client-side JS in public/wiki.js.
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");
const anchor = require("markdown-it-anchor");

const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const PUBLIC_DIR = path.join(ROOT, "public");
const DIST_DIR = path.join(ROOT, "dist");

const SITE_TITLE = "Kohaku CLI Wiki";
const SITE_TAGLINE = "the practical guide to kohaku-cli";

const md = new MarkdownIt({ html: false, linkify: true, typographer: true }).use(
  anchor,
  { permalink: anchor.permalink.linkInsideHeader({ symbol: "#", placement: "before" }) }
);

function slugify(base) {
  return base.replace(/\.md$/, "");
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function readPages() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const pages = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = slugify(file);
    const html = md.render(content);
    return {
      slug,
      href: `./${slug}.html`,
      title: data.title || slug,
      order: typeof data.order === "number" ? data.order : 999,
      section: data.section === "appendix" ? "appendix" : "walkthrough",
      summary: data.summary || "",
      html,
      text: stripHtml(html),
    };
  });
  pages.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return pages;
}

function renderNavList(pages, currentSlug) {
  return pages
    .map((p) => {
      const cls = p.slug === currentSlug ? ' class="current"' : "";
      return `<li${cls}><a href="${p.href}">${escapeHtml(p.title)}</a></li>`;
    })
    .join("\n        ");
}

function renderNav(pages, currentSlug) {
  const walkthrough = pages.filter((p) => p.section === "walkthrough");
  const appendix = pages.filter((p) => p.section === "appendix");

  let html = `<div class="wiki-sidebar-title">Walkthrough</div>
    <ul>
        ${renderNavList(walkthrough, currentSlug)}
    </ul>`;

  if (appendix.length > 0) {
    html += `
    <div class="wiki-sidebar-title wiki-sidebar-title-appendix">Appendix</div>
    <ul class="wiki-sidebar-appendix">
        ${renderNavList(appendix, currentSlug)}
    </ul>`;
  }

  return html;
}

function renderPager(page, pages) {
  const idx = pages.findIndex((p) => p.slug === page.slug);
  const prev = idx > 0 ? pages[idx - 1] : null;
  const next = idx >= 0 && idx < pages.length - 1 ? pages[idx + 1] : null;

  const prevHtml = prev
    ? `<a class="page-pager-prev" href="${prev.href}"><span class="page-pager-icon" aria-hidden="true">←</span><span class="page-pager-label">${escapeHtml(prev.title)}</span></a>`
    : `<span class="page-pager-prev page-pager-disabled"></span>`;

  const nextHtml = next
    ? `<a class="page-pager-next" href="${next.href}"><span class="page-pager-label">${escapeHtml(next.title)}</span><span class="page-pager-icon" aria-hidden="true">→</span></a>`
    : `<span class="page-pager-next page-pager-disabled"></span>`;

  return `<nav class="page-pager" aria-label="Page">
      ${prevHtml}
      ${nextHtml}
    </nav>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pageTemplate({ page, navHtml, pagerHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(page.title)} — ${SITE_TITLE}</title>
<link rel="stylesheet" href="./wiki.css">
<link rel="icon" href="./favicon.svg">
</head>
<body>
<div class="wiki-layout">

  <header class="wiki-header">
    <a class="wiki-logo" href="./index.html">
      <span class="wiki-logo-mark">K</span>
      <span class="wiki-logo-text">${SITE_TITLE}<br><small>${SITE_TAGLINE}</small></span>
    </a>
    <div class="wiki-search">
      <input id="search-input" type="text" placeholder="Search kohaku-cli docs" autocomplete="off">
      <div id="search-results" class="search-results hidden"></div>
    </div>
  </header>

  <nav class="wiki-sidebar">
    ${navHtml}
  </nav>

  <main class="wiki-main">
    <h1 class="page-title">${escapeHtml(page.title)}</h1>
    <div class="page-meta">From ${SITE_TITLE}${page.summary ? " — " + escapeHtml(page.summary) : ""}</div>
    <div class="page-content">
${page.html}
    </div>
    ${pagerHtml}
  </main>

  <footer class="wiki-footer">
    This page is part of a static ${SITE_TITLE}, built from Markdown and hosted on IPFS.
  </footer>

</div>
<script src="./search-index.json.js"></script>
<script src="./wiki.js"></script>
</body>
</html>
`;
}

function copyPublic() {
  fs.mkdirSync(DIST_DIR, { recursive: true });
  for (const f of fs.readdirSync(PUBLIC_DIR)) {
    fs.copyFileSync(path.join(PUBLIC_DIR, f), path.join(DIST_DIR, f));
  }
}

function build() {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  copyPublic();

  const pages = readPages();

  for (const page of pages) {
    const navHtml = renderNav(pages, page.slug);
    const pagerHtml = renderPager(page, pages);
    const html = pageTemplate({ page, navHtml, pagerHtml });
    fs.writeFileSync(path.join(DIST_DIR, `${page.slug}.html`), html);
  }

  // Flat search index consumed client-side by public/wiki.js.
  // Wrapped as a JS var (not fetch()'d as raw JSON) so search works
  // even over file:// during local dev, with no dev server required.
  const index = pages.map((p) => ({
    title: p.title,
    href: p.href,
    summary: p.summary,
    text: p.text.slice(0, 4000),
  }));
  fs.writeFileSync(
    path.join(DIST_DIR, "search-index.json.js"),
    `window.__WIKI_SEARCH_INDEX__ = ${JSON.stringify(index)};\n`
  );

  console.log(`Built ${pages.length} page(s) into dist/`);
}

build();

if (process.argv.includes("--watch")) {
  console.log("Watching content/ and public/ for changes...");
  let timer = null;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        build();
      } catch (e) {
        console.error(e);
      }
    }, 100);
  };
  fs.watch(CONTENT_DIR, rebuild);
  fs.watch(PUBLIC_DIR, rebuild);
}
