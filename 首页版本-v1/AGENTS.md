# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable Roomie visual decisions

- The right-side key set is a single hanging cluster: the top ring of every individual key must sit on the main hook ring, with the three keys fanning left, center, and right from that shared anchor. The three supplied key canvases are identical apart from color. Use the normal ring-top anchor at about `45% / 13.5%`; horizontally mirror the leftmost pink key so 林晓's tag faces outward, and mirror its anchor to about `55% / 13.5%`. Do not vertically stack the keys.
- The four functional paper modules need visibly generous side and bottom margins inside their irregular paper edges; controls must not run to the torn border.
- Polaroids must be composed from the supplied `polaroid-frame-v2.png` asset and a supplied photo, while preserving the frame's portrait aspect ratio and transparent window.
- The central yellow note's title must remain smaller than its usable paper width at desktop sizes, with no visual overflow.
- Preserve the existing module-heading type scale; solve paper overflow with a separate inner safe area rather than shrinking headings.
- The header note contains only the Roomie brand, apartment, date, and its pink divider. Do not repeat the daily to-do summary outside the yellow note.
- The flower bouquet is not part of the default board state.
- The yellow today note uses the same editable fastener state as all other papers.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
