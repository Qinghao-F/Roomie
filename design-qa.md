# Roomie 首页视觉 QA

## Comparison target

- Source visual truth: `/Users/fangqinghao/Desktop/合租生活管家/ChatGPT Image 2026年9月13日 19_00_07.png`
- Implementation: `http://localhost:4173/` in Codex In-app Browser
- Implementation capture: Codex In-app Browser tab 2, browser-rendered screenshot captured on 2026-09-14 during final QA
- Browser viewport: 1265 × 710 CSS px; device scale factor 1
- Source pixels: 1484 × 1060; source aspect ratio 1.400
- Implementation board: same 1484:1060 aspect-ratio board scaled to fit the desktop viewport with top and bottom breathing room
- State: browse mode, default board layout; edit mode separately checked

## Full-view comparison evidence

The source and implementation share the same primary composition: wood frame, cork surface, top identity note, two polaroids, right-side key chain, central yellow action note, four paper module entrances, and a vertical quick-action strip. The implementation uses the supplied transparent assets rather than recreating the visual objects with CSS or placeholder graphics.

The implementation intentionally keeps text as real HTML so amounts, tasks, buttons, and status changes can be interacted with. The reference image contains baked-in copy and is treated as visual hierarchy guidance; the implementation uses the product-spec copy and a current-date label.

## Focused-region evidence

- Top identity and photo region: confirmed correct photo crops, paper framing, hand-drawn title treatment, key placement, and date/status hierarchy.
- Core interaction region: confirmed four paper modules, central today note, quick actions, and supplied function icons are visible and distinguishable.
- Editing region: confirmed the board scales upward and the bottom material tray opens without covering the board; tray includes fasteners, doodles, photos, reset, save, and delete controls.

## Required fidelity surfaces

- Fonts and typography: title copy uses ZCOOL KuaiLe with a Chinese sans fallback; functional copy, amounts, dates, and controls use Noto Sans SC/system sans fallbacks. Hierarchy is intentionally close to the reference while keeping small text readable.
- Spacing and layout rhythm: board uses the source 1484:1060 ratio, fixed relative positions, paper padding, short hard shadows, and a visible outer margin. A short-height desktop media rule keeps the whole board visible at 1265 × 710.
- Colors and visual tokens: cork brown, honey wood, warm paper, black ink, fluorescent pink, electric blue, and lime green are used consistently with the source direction.
- Image quality and asset fidelity: cork, wood frame, paper textures, keys, pins, clips, icons, polaroid frame, photos, doodles, plant, and flowers are supplied assets from `素材/` and render as raster assets with transparency where provided.
- Copy and content: homepage copy follows `Roomie产品说明-v1.md`, including the four modules, three roommates, current task summary, quick actions, and edit-mode language.

## Primary interactions tested

- Clicking a module title opens its detail paper modal.
- Clicking the AA quick action opens a real expense form and saving it produces a status toast.
- Clicking a chore action produces a completion toast and updates the task state.
- Clicking the stock action updates the paper to `已补货 / 充足 / 0 件`.
- Clicking a roommate key changes the active viewpoint label and selected key state.
- Clicking a polaroid changes the selected photo in the supplied photo set.
- Entering edit mode opens the material tray; selecting a module and a fastener updates its selected fastening asset.
- Adding a doodle creates a selectable, draggable decoration; completing edit saves the layout to localStorage.
- Console logs were checked for error and warning levels; none were present.

## Comparison history

### Pass 1

- Finding: board was too small at the short desktop viewport because its height was constrained to fit the browser.
- Fix: switched to the source aspect-ratio width on large viewports and added a short-height media rule that uses the available viewport height while preserving the source ratio.
- Post-fix evidence: final browser capture at 1265 × 710 shows the complete wood frame, all four modules, key chain, photos, central note, and quick-action strip.

### Pass 2

- Finding: none at P0/P1/P2 severity after the layout adjustment.
- Fix: no further P0/P1/P2 changes required.
- Post-fix evidence: final browser capture plus edit-mode capture show the intended visual hierarchy and the material tray remains below the board.

### Pass 3

- Finding: supplied key images were visually separated, the four paper modules needed more breathing room, the yellow note asset path was incorrect, and the polaroid frame was visually masked by a CSS white card.
- Fix: grouped the three keys under one ring with centered name labels; enlarged and repositioned the four module papers; switched the central note to `paper-note-yellow 1.png`; and composed the supplied polaroid frame over the supplied photos with a transparent parent.
- Post-fix evidence: browser capture at 1265 × 710 confirms the yellow base is visible, photos sit inside the supplied frame, key names align on the tags, and module copy stays inside the torn paper edges. Interaction regression passed for key switching, module modal, photo cycling, edit mode, and console errors.

### Pass 4

- Finding: the key cluster still read as a vertical stack, the supplied polaroid frame was distorted by non-native card proportions, and the two lower paper cards allowed their action bars to reach the torn edge.
- Fix: rebuilt the key layout around a shared ring anchor with left/center/right rotations; restored the portrait ratio of `polaroid-frame-v2.png`; widened the four functional papers; and reserved a dedicated lower safe area for the supplies and rules action bars.
- Post-fix evidence: current local preview shows the three key rings attached at one hook point and fanned apart, the supplied frame/photo composition uses its natural portrait ratio, the today heading remains within the yellow note, and the lower green actions sit within their paper surfaces rather than below them.

### Pass 5

- Finding: the supplied polaroid photo could sit outside the transparent frame window; the header repeated the yellow-note task message; the default bouquet overlapped the quick-action area; and the today note did not receive the editable fastener state.
- Fix: placed each photo and frame in a shared portrait-ratio inner card, added separate paper-content safe areas without reducing heading type, retained only the brand/apartment/date/divider in the header, removed the default bouquet, and passed the today note through the common fastener component.
- Post-fix evidence: local browser inspection confirms the photo rectangle is fully contained by its card (`photoInside: true`); clicking a polaroid changes its supplied-photo source; selecting the yellow today note in edit mode and choosing a blue pin changes its asset, then the default red pin can be restored. Build and Sites worker tests pass. The key implementation was deliberately left unchanged in this pass.

### Pass 6

- Finding: the key images shared a nominal transform origin, but it was below the real top of the metal ring. The pink key was also mirrored, and the overlapping transparent image canvases caused the front key to intercept clicks intended for the other two keys.
- Fix: measured the three identical `1024 × 1536` transparent canvases, moved the common rotation origin to the visible ring top at approximately `45% / 13.5%`, aligned it with the bottom of the supplied hook ring, removed image mirroring, and set fixed left/center/right angles of `26° / 0° / -26°`. The visual key image and its interactive nameplate were separated so transparent pixels no longer block neighboring keys.
- Post-fix evidence: a browser-rendered, equal-scale comparison surface placed the `1484 × 1060` reference beside the current `1484 × 1060` implementation. It confirms that all three upper rings meet the main hook and the bodies fan outward. Browser interaction checks independently selected 陈默、周屿、林晓 and updated the current-view caption each time. Error/warning console logs were empty; build and all four Sites worker tests pass.

### Pass 7

- Finding: the leftmost pink key tag faced inward and remained substantially covered by the center key.
- Fix: horizontally mirrored only the pink key image, moved 林晓's nameplate hit area to the mirrored tag position, and mirrored its shared anchor from `45% / 13.5%` to `55% / 13.5%` so the visible ring top remains attached to the same hook point. Its active marker now also points outward.
- Post-fix evidence: the equal-scale browser comparison shows the pink nameplate exposed on the left while the three-ring connection and fan remain intact. Interaction checks selected 林晓、陈默、周屿 independently after the change, and browser error/warning logs remained empty.

## Follow-up polish

- P3: self-host the two font files before public deployment if the target audience may have restricted access to Google Fonts.
- P3: add a small “恢复演示数据” control if the demo needs to be reset from inside the public page.

## Final result

passed
