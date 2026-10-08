# AgentCity

A one-page landing site for a town whose residents are AI agents, built on Robinhood Chain. The shipped site is plain HTML and CSS with local SVG artwork and Inter. It has no browser JavaScript, backend, wallet connection, analytics, cookies, or third-party asset requests.

The complete publishable export is **`dist/`**, included alongside `src/`, the package manifest, and the lockfile. The build copies the six source files exactly; it requires no installed packages or network access. Development dependencies are only for checking the build/preview/check scripts.

## Install and work locally

Use Node.js 22 or newer and npm.

```sh
npm ci --ignore-scripts
npm run build
npm run typecheck
npm run check
npm run preview
```

Open `http://localhost:4173/preview/`. Stop the preview with Ctrl+C. The preview deliberately uses a subpath to exercise relative asset URLs. If the port is occupied, use `PORT=4187 npm run preview` and open port 4187 instead. This is a local development file server; it is not part of the published site.

Edit `src/index.html`, `src/styles.css`, or `src/assets/`, then rebuild. Do not edit `dist/` directly. Refresh the preview after rebuilding; it serves current files without a bundler or hot-reload script. `npm run build` removes and regenerates only `dist/`.

For an offline build or preview, Node.js alone is enough. Typechecking requires the development dependencies to have been installed first.

## Publish

1. Run `npm run build`, `npm run typecheck`, and `npm run check`.
2. Include all of `dist/` in the submission, including `dist/assets/`. `.gitignore` intentionally does not exclude it.
3. Upload the **contents** of `dist/` to the static host's chosen document root or subdirectory. The publisher can serve this existing export without rebuilding.
4. Serve `.html` as `text/html`, `.css` as `text/css`, `.svg` as `image/svg+xml`, and `.woff2` as `font/woff2`.
5. Check the home page, its three section links, town link, agent guide, and documentation link at the published path.

All local URLs begin with `./`, and navigation within the page uses fragments. There are no routes needing server rewrites, no environment variables or credentials required for production, and no external font service. The three outbound URLs are exactly those supplied in the brief.

## Validation performed

Checked on 2026-10-08 with Node.js 24.21.0, npm 11.19.0, TypeScript 5.8.3, and the supplied Chromium/Playwright browser.

| Check | Actual result |
| --- | --- |
| `npm run build` | Passed after final source changes. Six files; export 383,531 bytes. |
| `npm run typecheck -- --typeRoots ./test/scratch/tools/@types` with the pinned TypeScript binary on `PATH` | Passed. Strict `checkJs` checks the three Node tooling scripts. There is no TypeScript or JavaScript shipped to the browser. |
| `npm run check` | Passed: exact source/export parity, required headline and six cards, three destination URLs, every local anchor/asset, alternatives, no scripts/embeds/forms, focus/motion guards, export and ignore-file budgets. |
| Served export under `/preview/` | HTML, stylesheet, local font, town SVG, and favicon loaded successfully. No local console errors or warnings. |
| Responsive browser checks | No horizontal overflow at 320, 360, 704, 705, 768, 960, 961, and 1440 CSS pixels. Final desktop/mobile screenshots inspected. |
| Keyboard and navigation | Skip link moves focus to main; next Tab reaches the town CTA. Tab navigation and visible focus checked. Section links scroll to the correct sections. All three external links were activated and reached the supplied destinations. |
| Accessibility | axe-core 4.10.3: zero violations, 37 passing rules at both 1440 and 360 px. Two manual contrast items were resolved by checking the real rendered color pairs. |
| Adaptation | 200% root-font enlargement at 768 px reflows after fixes; reduced-motion and forced-colors emulation checked. |

To respect the assignment's prohibition on touching `node_modules/`, this work generated the lockfile using `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --cache /tmp/agentcity-npm-cache`, then extracted the pinned TypeScript and Node type packages into disposable `test/scratch/tools/` for the actual typecheck. That temporary toolchain is not shipped; the ordinary `npm ci` workflow above supplies the same pinned development tools.

See [the consolidated six-domain review](artifacts/validation.md), [browser measurements](artifacts/browser-checks.json), [desktop screenshot](artifacts/desktop.webp), [mobile screenshot](artifacts/mobile.webp), [keyboard focus](artifacts/builder-focus.webp), and [200% text enlargement](artifacts/text-200.webp). These are worker-side observations, not independent certification.

Limitations: no manual screen-reader session, physical-device test, Firefox/WebKit run, or browser-native zoom check. Text enlargement is recorded separately from native zoom. The external town reached its route but reported billboard image/CORS errors and WebGL warnings; the guide's external favicon returned 404. Those services are outside this landing page; their complete application behavior was not certified. The landing export itself loaded without errors.

## Layout and file budgets

| Path | Role | Explicit budget |
| --- | --- | --- |
| `src/` | Editable site and all local runtime assets | 1 MiB |
| `dist/` | Required, complete production export | 1 MiB |
| `artifacts/` | Review, measurements, screenshots | 3 MiB |
| `scripts/` | Build, preview, static integrity checks | 64 KiB |
| `licenses/` | Guidance license notices | 32 KiB |
| Root documentation and package/configuration files | Handoff and reproducible tooling | 128 KiB |
| `.gitignore` | Explicitly include `dist/` and review artifacts; exclude dependencies/caches at every nesting level and disposable scratch space | **512 bytes** |

The overall submission ceiling is 8,388,608 bytes. No dependency directories, tarballs, registry mirrors, package caches, or submodules belong in the submission. The final file-size inventory is in `artifacts/size-report.json`. Git metadata is not modified by this assignment; `dist/` is left present for the submission process to include.

## Design and attribution

[DESIGN.md](DESIGN.md) describes the final tokens, type scale, components, and responsive behavior.

The town illustration, house mark, and district SVG icons were created for this page. Inter 4.1 is bundled from `rsms/inter` (release `v4.1`, `docs/font-files/InterVariable.woff2`), under the SIL Open Font License; retain [its license](src/assets/Inter-LICENSE.txt) when publishing.

The review used the supplied pinned Better Interface guide, adapted from Jakub Krehel's Better Interface, MIT, commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`. The documentation method is adapted from Paul Bakaus's Impeccable, Apache-2.0, commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`. Copyright 2026 Jakub Krehel; Copyright 2025 Paul Bakaus. [Both supplied license texts are retained](licenses/design-guidance.txt). The site and documentation apply the guidance to this assignment; the pinned reference itself is not a build dependency.
