---
name: testing-static-site
description: How to serve and visually test the Violaine Briand static HTML site (index/actualite/methode/stage/contact), including mobile-width verification.
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
- Home (`index.html`) uses a single-column `home-grid` (`max-width: 54rem`) with a full-width `rentree` block above it. Blocks are `.card` sections (presentation, cours collectifs, workshops).
- `actualite.html` is a list of `<article class="post">` blocks; newest article goes first. Article titles are `<h2 class="entry-title">`.
- Styles live in `assets/css/style.css`; responsive breakpoint is `@media (max-width: 48rem)` (=768px).

## Narrow-viewport testing
Chrome cannot be resized below ~500 CSS px via `wmctrl`. To reach ~390–400px,
shrink the window then press `ctrl+equal` (zoom to 125%) with focus on the page
(not the omnibox), and confirm with
`document.documentElement.clientWidth` in the console. Check overflow with
`document.documentElement.scrollWidth === clientWidth`.

## Devin Secrets Needed
none
