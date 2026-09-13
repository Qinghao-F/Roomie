# Roomie 首页视觉与交互 QA

## Comparison target

- Source visual truth: `/Users/fangqinghao/Desktop/合租生活管家/ChatGPT Image 2026年9月13日 19_00_07.png`
- Implementation: `http://127.0.0.1:4173/` in Codex In-app Browser tab 11.
- Viewport: desktop; the board preserves the reference `1484 × 1060` ratio and scales to the available window height.
- State: browse and edit states were both captured on 2026-09-14.

## Findings

- No actionable P0/P1/P2 findings remain.
- [P3] On a compact desktop viewport the full board is scaled down to keep the wood frame visible. This is intentional for this computer-first prototype.

## Full-view comparison evidence

The rendered board retains the source’s corkboard, wood frame, title note, two polaroids, three-key hook, central yellow note, four paper modules and quick-action strip. The title paper is taller, has no lower pink rule, and keeps the date inside the paper. The yellow note has upper clearance for a clip.

## Focused-region evidence

- Keys retain hover glow. Clicking only brings that key to the front; no viewpoint label or pink active marker remains.
- Clicking a polaroid in browse mode opens a stacked viewer with the selected card on top; arrows, buttons and drag move through the collection. Edit mode is the only place photos can be changed.
- Board-card buttons are removed; whole cards open their detail modal. Quick actions remain interactive.
- Decorations layer above paper and polaroid surfaces, while separately-rendered fasteners and the key group always layer above decorations.
- The edit tray loaded 37 images with 0 failed requests: all pins, clips, doodles and photo choices render.

## Required fidelity surfaces

- Fonts and typography: Roomie/headings use ZCOOL KuaiLe with Chinese fallbacks; functional text uses Noto Sans SC/system sans.
- Spacing and layout rhythm: torn-paper safety zones remain intact; central note has 16% upper fastener clearance.
- Colors and tokens: fluorescent pink, blue, lime, warm paper, cork and wood retain the supplied direction.
- Image quality and asset fidelity: all board imagery, textures and decorative assets are supplied raster files; browser inspection found no loading failures.
- Copy and content: the board remains scoped to shared fees, chores, supplies, house rules and memories.

## Comparison history

### Pass 8

- Earlier findings: key clicks implied a data viewpoint, polaroid clicks changed images directly, board cards had redundant action buttons, decorations could not reliably sit below fasteners, title/date spacing was tight, and the stopped preview server caused edit-mode assets to fail.
- Fixes: separated key foreground state from app data; added stacked photo viewer plus edit-only replacement; converted board controls to passive status copy; rendered fasteners as a dedicated overlay; increased title and yellow-note clearance; restarted the preview from `首页版本-v1`.
- Post-fix evidence: browser checks replaced a polaroid with the cat photo, changed the yellow-note fastener to a binder clip, opened the stacked photo viewer, and brought 林晓’s key to z-index 10. Browser console error/warning logs were empty. `npm run build` passed.

## Final result

passed
