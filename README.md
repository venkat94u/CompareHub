# CompareHub

CompareHub is a fast, privacy-first Angular comparison platform for Text, JSON and Source Code. All comparisons run in the browser: no backend, no database, no authentication and no uploads.

## Architecture

- Angular standalone components with lazy loaded routes.
- Routes: `/`, `/text-compare`, `/json-compare`, `/code-compare`.
- Folders: `core`, `shared`, `features`, `services`, `models`, `themes`, `layouts`.
- Shared UI: `ToolShellComponent` and `DropZoneDirective`.
- Services: `DiffService`, `StorageService`, `ThemeService`, `SeoService`.
- Theme: CSS custom properties in `src/styles.scss`, system dark-mode detection and persisted toggle.
- SEO: route titles, dynamic meta tags, Open Graph tags, `robots.txt` and `sitemap.xml`.

## Features

- Text compare with side-by-side and inline views.
- JSON validation, pretty formatting and diff highlighting.
- Code compare for TypeScript, JavaScript, HTML, CSS, Java and Python.
- Keyboard shortcuts: `Ctrl/Cmd + Enter` to compare; `Ctrl/Cmd + K` clears text compare.
- Autosave drafts, local comparison history, drag and drop files, full screen mode and comparison statistics.

## Implementation Plan

1. App foundation: standalone bootstrap, lazy routing, layout, theme and SEO services.
2. Home module: hero, tool cards, trust signals, benefits, FAQ and footer.
3. Text module: options, side-by-side view, inline view, stats, copy and download.
4. JSON module: validation, pretty formatting, comparison, copy and download.
5. Code module: language selection, lightweight syntax highlighting and side-by-side diff.
6. Hardening: unit tests for diff logic, accessibility checks, Lighthouse pass and GitHub Pages deployment.

## Development

Run the local dev server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

Build for GitHub Pages:

```bash
npm run build:gh-pages
```

Deploy with:

```bash
npm run deploy:gh-pages
```

`deploy:gh-pages` uses `angular-cli-ghpages` through `npx`; install or approve the package when prompted by your package manager.

trigger Mon Jun 15 12:23:09 AM IST 2026
