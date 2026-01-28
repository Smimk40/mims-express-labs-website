<!-- Copilot instructions for contributors and AI coding agents -->
# Copilot Instructions

Purpose
- Short, actionable guidance for AI contributors working on this repo (static site).

Big picture
- This is a small static website with top-level HTML pages and static assets. Primary files:
  - [index.html](index.html)
  - [about.html](about.html)
  - [services.html](services.html)
  - [facilities.html](facilities.html)
  - [contact.html](contact.html)
  - [script.js](script.js)
  - [style.css](style.css)
  - [images](images/) (e.g., [images/logo.png](images/logo.png))
- No build system, frameworks, or package manifests are present—changes are served as static files.

What to do first
- Inspect the HTML pages for the site-wide header/nav and mirror any edits across pages.
- Check `script.js` for global JS behaviors; prefer small, unobtrusive edits to keep the site predictable.

Project-specific patterns and conventions
- Pages are simple, single-file HTML pages at repository root. Use relative links between pages (e.g., `about.html`).
- Styles are centralized in [style.css](style.css). Prefer adding classes and modifying `style.css` rather than inline styles.
- JavaScript is centralized in [script.js](script.js). If behavior needs to be added, attach to `DOMContentLoaded` or use event delegation rather than assuming global variables.
- Images live in the `images/` folder. Keep filenames and relative paths consistent; update references in HTML when renaming files (example: update `<img src="images/logo.png">`).

Editing guidance (examples)
- Update site navigation: edit the header/nav in [index.html](index.html) and replicate the same structure in other pages so links remain consistent.
- Changing the logo: replace [images/logo.png](images/logo.png) and update `alt` text on pages that show it.
- Adding a new page: create `newpage.html`, add it to the header/nav on each page, and link any new assets under `images/`.

Testing and previewing
- No build step — open files directly in a browser or use a lightweight server (recommended):

```bash
python3 -m http.server 8000
```

- For live-edit preview in editors, use the `Live Server` extension or equivalent.

Edge cases & constraints
- Accessibility: provide `alt` text for images in `images/`.
- Keep file paths relative; avoid absolute URLs for internal links to preserve portability.
- Because there are no unit tests or CI configured, prioritize small, easily verifiable changes.

When to ask the human maintainer
- If a change requires a build tool, new dependency, or restructuring (introducing a package.json, bundler, or server), ask before proceeding.
- If you need clarification about content that looks hand-authored (marketing copy, legal text), request human review.

Where to look for examples
- Nav/header and page layout: [index.html](index.html)
- Global styles: [style.css](style.css)
- Global JavaScript: [script.js](script.js)
- Site images: [images/](images/)

If you update this file
- Keep guidance concise and only document discoverable patterns.
