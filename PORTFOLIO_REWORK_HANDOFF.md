# Portfolio rework — initial handoff

This first pass establishes a public-facing portfolio that leads with current engineering and research work without inventing private-project details. It is designed to be expanded with project visuals and tighter, role-specific evidence.

## What changed

- `index.html` is now a focused landing page with a concise positioning statement, proof points, and four featured projects.
- `datascience.html` is the selected-work index. It groups primary engineering work, data/interface work, and **Other work**.
- `about.html` and `page1contact.html` now share the same information architecture and clearly route visitors to work, email, LinkedIn, GitHub, and the resume.
- `site.js` creates the shared, responsive navigation. Case-study pages use `data-root=".."` so the same navigation works one level down.
- `style.css` contains the shared responsive components, reduced-motion behavior, accessible mobile navigation, and the light/dark page variants.
- The current resume is intentionally a temporary, unchanged copy at `resume/Corina-Kaiser-Resume-May-2026.pdf`.
- `capstone.html` and `project1.html` are now clear summaries that lead to the untouched original reports in a new tab.
- `bot-lexicon-portal.html` now presents the Vat Lexicon image and explanatory context without an iframe that can crop or fail to load.
- Photography and Catch-Fall are positioned under **Other work**. Catch-Fall now uses bundled browser libraries and asks before enabling camera controls.

## Case-study placeholders ready for content

Each page is deliberately complete enough to link publicly, while reserving a clearly marked visual slot for later material:

- `case-studies/memory-hub.html`
- `case-studies/joint-ai-chat.html`
- `case-studies/ledger-bulwork.html`
- `case-studies/pca-workbench.html`
- `case-studies/wearabllm.html`
- `case-studies/nemoh-routing.html`

For each project, add one primary image (or a short clip/GIF) before adding a gallery. The best first visual is the one that shows a real interface or system boundary: an architecture diagram, end-to-end flow, terminal/API trace with secrets removed, or final user-facing screen. Pair it with a 1–2 sentence caption explaining the decision or technical constraint it demonstrates.

## Content that still needs your judgment

1. Replace the temporary resume PDF with a version whose summary and bullets match the site’s research-engineering direction.
2. Confirm which projects can name employers, collaborators, repositories, metrics, or live links. The current copy avoids adding claims that have not been explicitly cleared for public use.
3. Add visuals and any substantive outcomes to the six case studies. Do not force a uniform metric section; use the clearest evidence available for each project.
4. Decide whether a lightweight custom domain and site analytics are worthwhile after the project content is settled.

## Before publishing

1. Read each case study aloud once and remove or sharpen any claim that no longer feels precise.
2. Check contact links and the new resume PDF after replacing it.
3. Test Catch-Fall in a desktop browser: keyboard play should work before camera permission, and optional camera control should begin only after its button is selected.
4. Test on a phone or narrow desktop window, especially the navigation menu and long project titles.

## Verification completed for this pass

- JavaScript syntax checks passed for `site.js`, `global_transition.js`, and `CatchFall/sketch.js`.
- Whitespace validation (`git diff --check`) passed.
- Every newly routed public page and the resume asset returned a successful response from the local static server.
- Desktop and narrow-screen visual checks were completed for the landing page, selected-work page, and a representative case-study layout. The browser’s final local-page reload stalled during the final check, so the remaining route verification was completed directly against the local server.

No deploy, commit, or push is included in this pass.
