# Zarai Mandi — Product → By Product → Detail Restructure

## Context

The Zarai Mandi mobile app (single file `src/App.tsx`, ~8,551 lines) currently treats the
Product flow as a "find one by-product" lookup: a 3-step division → product → byproduct
drilldown that ends in a flat rates list. The attached UX requirements
(`src/imports/pasted_text/product-byproduct-ux.md`) reframe the app around a clearer mental
model:

> **Find it → understand today's market → compare mandis → see the trend → save it → come back tomorrow.**

Product selection becomes *intent to watch a whole product family*; the **By Product** is the
user's real monitoring object. The change makes discovery multi-select and in-place, collapses
per-product byproduct screens into **one combined screen with product chip-tabs**, adds a
**By Product Detail page** with Overview/Trends, promotes **stars → Your Picks** onto every
byproduct row, and turns location into a **contextual chip** rather than a blocking step.

Per the confirmed scope: **rework the Home "Product" tile flow only.** Leave the "Live Market"
tile (`ByProductSelectScreen`) and the Analytics tab exactly as they are. Preserve the existing
brand aesthetic (greens `#0F8A5F`/`#0A5E43`/`#2FBF71`, Inter, circular tiles, gradient header),
navigation model, and all unrelated screens. Do **not** redesign from scratch.

All work is in `src/App.tsx`.

## Guiding principles from the requirements

- Product = discovery, By Product = object of interest, Location/Time = context, Trends = understanding, Your Picks = repeat access, Historical = escalation to sales.
- No separate "by-product select mode"; no geography-first or time-first navigation; no eight separate graphs; no dense tables; Product-vs-Vertical stays invisible to users.

## Existing pieces to reuse (do not rebuild)

- `RateItem = {vertical, commodity, byproduct}` (line 24) and the `${vertical}|${commodity}|${byproduct}` key scheme (used identically at 5356 / 5547 / 7775) — preserve verbatim so stars dedupe across screens.
- `getByproductImg` (2934), `getVerticalImg` (2920), `getVerticalIcon` (2908), `CircleTile`, `ScrollRow`, `RateCard`, `TrendBadge`, `ZMMessageModal`.
- Data: `VERTICALS` (74-407), `MANDI_ROWS` (2276), `INITIAL_MANDIS`, `FEED_MESSAGES`, `PROVINCE`/`LOCATIONS` map (~489).
- Chart/synthesis: `genPts` (6692), `LineChart` (6701), `ALL_RATE_TYPES` (451), `RATE_COLORS` (473). Multi-series SVG normalization pattern to copy: AnalyticsScreen lines 7068-7095. `RATE_MULTS` (currently local ~6856) must be **hoisted to module scope** for reuse.
- Sheets: `PriceTypeSheet` (3240), `LocationSheet` (3771), `MandiPickerSheet` (3370).

## Implementation (staged so each stage compiles)

### Stage 1 — Lift `pickedByproducts` (Your Picks) to `App()` root
Favorites currently live only inside `HomeScreen` (state 7767, `togglePickBP` 7773, `isPickedBP` 7785). Lift so stars work app-wide.
- In `App()` (8422) add `const [pickedByproducts, setPickedByproducts] = useState<RateItem[]>([])` and move `togglePickBP` / `isPickedBP` to root.
- Remove those three from `HomeScreen`; add them + `setPickedByproducts` as props. Keep Home's UI-only state (`picksFavSheet`, `picksSearch`, `picksVertical`) local. The picks sheet's "Clear all" (8079) uses `setPickedByproducts`, so pass it.
- Update Home render wiring (8480-8488) to thread the props. Behavior unchanged.

### Stage 2 — Star affordance on byproduct tiles
- Add optional `starred?: boolean` and `onStar?: () => void` to `CircleTile`, rendering a ★/☆ badge (brand green when starred) that stops propagation.
- Thread `isPickedBP`/`togglePickBP` into `CommoditySelectScreen` (5320) and the new combined screen; wire the star on each byproduct tile using the exact key scheme (`commodity = product ?? div.name`).

### Stage 3 — Product multi-select in place + combined By-Product screen
**3a. `CommoditySelectScreen` (5320):** in the "products" step (5474-5488), make products multi-selectable (✓ state, "+ Add Product" affordance) via a new `selectedProducts: {vertical, commodity}[]`. Footer CTA becomes **"View N Products →"**; on press `push({ id: "byproduct-combined", products: selectedProducts, active: 0 })`. (Keep the existing division grid and single-product drilldown path available as a fallback for a product that is tapped-through.)

**3b. New `ByProductCombinedScreen`:** model its chip-tab row on the vertical-tabs pattern at 5593-5607, but source chips from `products`. Layout: horizontal **product chip-tabs** (highlight active) → location chip (Stage 5) → byproduct tiles for the active product from `VERTICALS[vertical].commodities[commodity]`, each with a ★ star and tap → `push({ id: "commodity-rates", vertical, commodity, byproduct })`.

**3c. Screen union + wiring:**
- Add to `Screen` (25-37): `| { id: "byproduct-combined"; products: { vertical: string; commodity: string }[]; active: number }`.
- Add `const replace = (s: Screen) => setStack(p => [...p.slice(0, -1), s])` in `App()`; the combined screen calls it to persist the active chip index in its payload, so returning via `pop()` from the detail page restores the active product (selections already live in the payload).
- Add the render conditional near 8495.

### Stage 4 — By Product Detail: extend `CommodityRatesScreen` (6219) with Overview | Trends
Same signature/props/Screen variant (`commodity-rates`) — it is already the push target from Your Picks and Voice (8531). Add `const [tab, setTab] = useState<"overview"|"trends">("overview")` + a segmented control in the header.

**Overview:** reuse existing `allRows` (6234-6249). Four large stat chips computed from `allRows` — MAX `max(max)`, MIN `min(min)`, ARRIVAL (sum of parsed arrival), MANDIS (distinct count). Then **Mandi comparison** as compact cards (mandi name, Min, Max, Arrival) — a small inline card, not the dense `RateCard`; tap keeps `setMsgModal(rowToMsg(r))` for the report modal.

**Trends:**
- Memoize (`useMemo` keyed on commodity/byproduct/tab/timeRange) a multi-series price dataset: `ALL_RATE_TYPES.map(rt => ({ label: rt, color: RATE_COLORS[rt], data: genPts(base * (RATE_MULTS[rt]||1), len, 0.025) }))` with `base = allRows[0]?.min || 2850`. Render with the inline multi-series SVG normalization copied from 7068-7095 (**not** `LineChart`, which is single-series).
- Price-type toggle chips ([✓ Mandi] … [✓ Stock]) driven by `activeTypes` state (all on by default); filter the series.
- **Price Trend | Arrival Trend** toggle; Arrival uses single-series `LineChart` (`genPts(arrivalBase, len)`, color `#B9822E`).
- Secondary "Need older data? → Request Historical Data" opening a new `HistoricalRequestSheet` (bottom sheet styled like `PriceTypeSheet`): textarea + example placeholder + "Send Request" + 🎙 "Speak your request". No backend — closes with a brief confirmation.

### Stage 5 — Contextual location chip
- App-root state `const [locationScope, setLocationScope] = useState<{kind:"district"|"province"|"pakistan"|"mandi"; label:string}>({kind:"province", label:"Punjab"})`, threaded to the combined + detail screens.
- New lightweight `LocationScopeSheet` (bottom sheet, 4 rows): My District / My Province / Pakistan / Select Mandi. "Select Mandi" delegates to the existing `LocationSheet` (3771) / `MandiPickerSheet` rather than reimplementing.
- Render a `📍 {label} ▾` chip atop the combined byproduct list and the detail Overview (chip styling from AnalyticsScreen ~6919-6930). Extend the detail `allRows` filter (6237-6242) with a scope predicate on `r.province`/mandi.

## Risks / watch-outs
- **Key-scheme drift:** stars from the combined screen must build the identical `${vertical}|${commodity}|${byproduct}` key (with `commodity = product ?? div.name`) or Your Picks won't dedupe.
- **Home breakage:** the picks sheet mutates picks directly (8079) — pass `setPickedByproducts`, not just the toggle.
- **Chart jitter:** `genPts` uses randomness; memoize series so toggling a price-type chip doesn't reseed the lines.
- **Back preserves state:** store active chip index in the `byproduct-combined` payload via `replace` so `pop()` from detail doesn't reset it.
- **Scope discipline:** do not touch `ByProductSelectScreen` (Live Market) or `AnalyticsScreen`.

## Verification
- Dev server is already running on `$PORT`; changes hot-reload — no build needed.
- Manual walkthrough: Home → Product → select Wheat + Rice (both show ✓, CTA reads "View 2 Products") → combined screen shows Wheat|Rice chip-tabs, switching swaps the list → star a byproduct → it appears in Home → Your Picks → tap a byproduct → Detail opens on Overview (4 stat chips + mandi compare cards) → Trends (multi-line chart, toggle price types, switch to Arrival Trend, open Request Historical Data form) → Back returns to the combined screen with the active product preserved.
- Confirm Live Market tile and Analytics tab still behave exactly as before.
- Sanity: a quick typecheck (`pnpm exec tsc --noEmit`) after Stages 3-5 to catch prop/union mismatches, since edits touch shared types.
