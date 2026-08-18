---
name: testing-static-site
description: How to serve and visually test the Violaine Briand static HTML site (index/actualite/methode/stage/contact), including mobile-width verification and a known mobile-nav CSS bug.
---

# Testing the Violaine Briand static site

No build step, no dependencies, no credentials needed.

## Serve locally
```bash
cd /path/to/Violaine-Briand && python3 -m http.server 8899
```
Open `http://localhost:8899/index.html` in Chrome. Maximize with
`wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`.

## Page/structure notes
- Home (`index.html`) uses a 3-column `panel-grid`: left "Rennes et Paris" (cours + tarifs), middle bio/stage, right "À venir" (workshops list).
- `actualite.html` is a list of `<article class="post">` blocks; newest article goes first. Anchors like `actualite.html#rentree-2026-2027` work via the article's `id`.
- Styles live in `assets/css/style.css`; responsive breakpoint is `@media (max-width: 48rem)` (=768px).

## Narrow-viewport testing
Chrome cannot be resized below ~500 CSS px via `wmctrl`. To reach ~390–400px,
shrink the window then press `ctrl+equal` (zoom to 125%) with focus on the page
(not the omnibox), and confirm with
`document.documentElement.clientWidth` in the console. Check overflow with
`document.documentElement.scrollWidth === clientWidth`.

## Known issue (as of 2026-08, pre-existing)
On mobile widths the hamburger is invisible and nav links are hidden, so there is
**no navigation at all below 768px**: `.main-navigation .menu-toggle { display: none }`
(specificity 0,2,0) overrides the media-query rule `.menu-toggle { display: inline-block }`
(0,1,0). A fix would be to scope the media-query rule as
`.main-navigation .menu-toggle { display: inline-block; }`. Do not report this as a
regression of unrelated content PRs; verify against `main` before blaming a change.

## Devin Secrets Needed
none
