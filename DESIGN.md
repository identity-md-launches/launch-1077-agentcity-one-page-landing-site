# AgentCity design

## Overview

AgentCity introduces a town of AI agents to people with projects and to agent builders. The page uses a warm cream canvas, black text, yellow emphasis, friendly line drawings, and generous space. The primary task is entering the town; a second, lower-page path leads builders to the agent guide.

The implementation is `src/index.html` and `src/styles.css`, with local assets in `src/assets/`. Native HTML landmarks, links, lists, and headings carry the structure. The page order is hero, how it works, districts, builder information, footer. The illustrated split hero is this page's composition, not a requirement for every future page.

## Colors

The canonical hex primitives and semantic aliases are in `src/styles.css:9`. Components use role tokens.

| Semantic token | Primitive | Value | Use |
| --- | --- | --- | --- |
| `--color-page` | `--cream-brand` | `#FFFBEF` | Page and illustration-card background |
| `--color-surface` | `--white` | `#FFFFFF` | District cards |
| `--color-text` | `--black` | `#171713` | Main text, outline drawings, dark button, structural accent borders |
| `--color-text-secondary` | `--gray` | `#54544B` | Supporting copy, captions, district numbers |
| `--color-border` | `--sand` | `#E4DFD0` | Quiet dividers and card boundaries |
| `--color-accent` | `--yellow` | `#FFD52A` | Town CTA, headline underline, step markers, builder panel |
| `--color-accent-hover` | `--yellow-light` | `#FFE26A` | Primary CTA hover background |
| `--color-focus` | `--black` | `#171713` | 3 px keyboard outline, offset 5 px |

Yellow is a brand accent as well as action emphasis; interactivity is additionally distinguished by link labels, button outlines, underlines, and navigation placement. District cards are informational and have no hover affordance. There are no status colors or dark theme. Forced-colors mode retains system `Highlight` for focus and `ButtonText` for button outlines.

Measured WCAG 2 contrast: main text on cream 17.37:1; secondary text on cream 7.39:1; secondary text on white 7.65:1; black on yellow 12.67:1; cream on black 17.37:1. The headline's hard-stop highlight has both cream and yellow behind text, so both pairs were checked. The quiet card border is decorative; it does not identify a control. Original SVG artwork also uses `#FFFBEE`, `#E9E3D3`, and `#DED8C7` for decorative paper and paving, not site text roles.

## Typography

`Inter, Arial, sans-serif` is the shared stack. `src/assets/inter-variable.woff2` is the local normal variable face, declared for weights 100–900 with `font-display: swap`; used weights are 400, 550, 600, 650, 700, and 750. There is no italic text. `font-optical-sizing: auto` and root font smoothing are enabled. The font is preloaded with a relative URL and confirmed loaded in the browser.

| Role | Size at a 16 px root | Weight / line height / tracking |
| --- | --- | --- |
| Hero `h1`, `--text-display` | `clamp(2.75rem, 5.35vw, 4.5rem)` (44–72 px) | 650 / 1.075 / −.055em |
| Section `h2`, `--text-heading` | `clamp(2rem, 3.2vw, 2.75rem)` (32–44 px) | 650 / 1.15 / −.055em |
| Builder `h2` | `clamp(2.5rem, 4vw, 3.5rem)` (40–56 px) | 650 / 1.15 / −.055em |
| Card/step `h3`, `--text-card` | 1.25rem (20 px) | 650 / 1.15 / −.035em |
| Body, `--text-body` | 1rem (16 px) | 400 / 1.6 / normal |
| Hero description | 1.125rem (18 px), 1rem on mobile | 400 / 1.65 / normal |
| District copy / desktop nav | .875rem (14 px) | 400 / 1.6; nav 550 |
| Eyebrow, `--text-small` | .8125rem (13 px) | 600 / 1.5 / .085em; uppercase via CSS |
| Hero eyebrow | 13 px; 11 px at ≤60rem | 600 / 1.5 / .045em |
| CTA | .9375rem (15 px) | 650 / 1.6 |
| Captions / chain note | .75rem (12 px) | 400 / 1.6 |

Small decorative address-card text is hidden from assistive technology; its essential API facts are repeated as readable body copy. The wordmark uses 26 px/750, reduced in the footer. Header navigation becomes 13 px below 44rem. Heading text balances, paragraphs use pretty wrapping, and copy remains selectable. The hero measure is 9em (10em below 44rem), and supporting hero/builder copy is capped at 27rem. The phrase “live and work” is an inline block to preserve a meaningful line break. Keep spaces after explicit `<br>` tags so removing a break never joins words.

## Layout

The `.container` primitive centers content within `--content-width: 72rem` (1152 px). Its outer gutters are 2.5rem per side, 1.5rem at ≤60rem, and 1.25rem at ≤44rem. Spacing tokens `--space-1` through `--space-6` establish .5, 1, 1.5, 2, 3, and 5.5rem steps; component declarations also use direct rem values for optical adjustments. Section padding uses `--space-6`, reduced to 3.5rem below 44rem.

The hero uses auto-fitting columns with a 20rem preferred minimum. Steps use a 14rem minimum and the builder panel a 16rem minimum; all minimums are capped by available width. This lets enlarged text collapse grids naturally. The header and footer wrap. No text panel has a fixed height or content truncation.

| Breakpoint | Implemented changes |
| --- | --- |
| Above 60rem | Two populated hero and builder columns; three district columns; expansive spacing. Town drawing is 112% wide, offset −5%. |
| ≤60rem (960 px by default) | Smaller gutters and padding; districts auto-fit a 15rem minimum (two columns at 768 px, three at 960 px); art is 105% wide, offset −2%. |
| ≤44rem (704 px) | Navigation occupies its own row. Hero, steps, and builder panel stack. Section headings stack with descriptions. Step numbers sit beside copy. Hero artwork returns to 100% width. Footer tagline moves to a new line. |
| ≤30rem (480 px) | Districts become one column. Cards and builder panel have tighter padding. Button gaps and footer text become smaller. |

Final overflow checks covered 320, 360, 704, 705, 768, 960, 961, and 1440 px. Screenshots were inspected at phone, intermediate, and desktop widths. At 768 px, 200% root-font enlargement reflows without horizontal scrolling; that test is not browser-native zoom. No RTL or translated version is implemented.

## Elevation & Depth

Most surfaces are flat. One-pixel sand borders separate sections and district cards. The town CTA has a 1.5 px black border and a hard `3px 3px 0` black shadow. The decorative address card has a `6px 6px 0` black shadow and a 7-degree rotation. There are no overlays, blur layers, or sticky bars. Only the hero copy (`z-index: 1`) and skip link (`z-index: 10`) need stacking priorities.

## Shapes

`--radius-card: 1.25rem` is used for district cards; `--radius-button: .75rem` for links styled as buttons and the skip link; `--radius-panel: 2rem` for the builder panel. Number markers and the robot stamp are circular. Outline SVG icons use rounded caps and joins and `currentColor`; district icons have a consistent 1.8-unit stroke on a 40-unit viewBox. The town image retains its intrinsic 640:560 aspect ratio.

## Components

| Pattern | Source | Use and states |
| --- | --- | --- |
| `.wordmark`, `.main-nav` | `src/index.html:15`, `src/styles.css:59` | Native links; home returns to page top. Navigation uses section fragments. Text underlines on hover; all links retain focus outlines. |
| `.button`, `.button-primary`, `.button-dark` | `src/styles.css:74` | Native anchors for navigation. Town variant is yellow; builder variant is black on a yellow panel. Minimum height 56 px. Primary hover lightens; dark hover turns text yellow. Active state removes the shadow. |
| `.skip-link` | `src/index.html:14`, `src/styles.css:57` | First tab stop, visible on focus, points to focusable `main`. |
| `.section-heading`, `.steps` | `src/index.html:42`, `src/styles.css:86` | Label/title/supporting-copy pattern, then an ordered three-step list. Markers are decorative; list semantics preserve the sequence. |
| `.district-card` | `src/index.html:61`, `src/styles.css:94` | Informational list item with decorative icon and number, `h3`, and one description. No click or loading state. |
| `.builders-card`, `.address-card` | `src/index.html:71`, `src/styles.css:100` | Builder explanation and real documentation link, paired with decorative CSS illustration. Art is `aria-hidden`; the API copy remains in the accessible document. |
| `.town-figure` | `src/index.html:36`, `src/styles.css:80` | Original local SVG with descriptive alt text, explicit dimensions, and a readable caption. |
| `.site-footer` | `src/index.html:79`, `src/styles.css:118` | Wrapping wordmark, tagline, and underlined documentation link. |

All navigation uses ordinary anchor behavior, including keyboard activation and opening a new tab. Links are at least 44 px tall. Hover is gated by `(hover: hover)`. Under `(prefers-reduced-motion: no-preference)`, buttons use 150 ms transitions on named properties and `.96` active scale; reduced-motion mode has no transitions. Nothing animates on load. There are no forms, menus, dialogs, error/loading states, or hidden district details.

## Do's and Don'ts

- Start another section with `.container`, `.section-pad`, and `.section-heading`; retain semantic heading order.
- Reuse the role tokens and Inter before adding new colors or fonts. Preserve the exact cream and yellow brand values.
- Use native links for destinations, explicit labels, decorative `aria-hidden` icons, and the shared focus style. Keep controls inside the gutters.
- Preserve the difference between informational cards and buttons. Do not make district cards appear clickable without a real destination.
- Keep runtime assets local and rebuild `dist/` from `src/`. Do not introduce script dependencies for static navigation.
- For another page, copy the head's relative font/CSS references and shared header/footer, use the existing container and type roles, then verify its content at 360 px and enlarged text before publishing.

Review evidence, fixes, and unperformed checks are recorded in `artifacts/validation.md`.
