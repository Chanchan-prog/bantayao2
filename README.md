# Christian Bantayao — Cybersecurity Portfolio

Interactive React/Vite portfolio with a security operations dashboard, canvas globe, scroll modules, project details, and responsive layouts.

## Run locally

```bash
npm install
npm run dev
```

Build for deployment with `npm run build`. Vite writes the static site to `dist/`.

For XAMPP, open `http://localhost/bantayao2/`. Apache uses `index.php` to serve the built site. Run `npm run build` again after changing source files.

Edit personal information, skills, projects, certifications, and display percentages in [`src/data.js`](src/data.js). Each project card opens a direct-link case study at `?project=...`.

The `projectCaseStudies` entries in `src/data.js` have `screenshotUrl`, `sourceUrl`, and `demoUrl` fields. Add real public URLs there when available. Until then, each case study shows a clearly labeled illustration and offers a project inquiry link. The dashboard graphics are also labeled as simulated examples.

The Projects section includes a three-message phishing awareness lab. The header's Pause button stops the canvas motion and other visual animations; the choice is saved locally and the site also respects reduced-motion settings.

## Performance

The background network draws at a lower rate while idle and limits canvas resolution on high-density screens. The globe draws only while its section is near the viewport. The custom cursor stops updating when it reaches the pointer. Scroll animations load from a separate JavaScript file after the portfolio is ready. Apache serves the built `dist/` files; `node_modules/` is for local development.
