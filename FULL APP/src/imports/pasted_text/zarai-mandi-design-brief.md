# Zarai Mandi Customer App — Figma Design Brief

## Context

Zarai Mandi is an agricultural market-price app for Pakistan. The primary customer base is largely low-literacy/illiterate — farmers, retailers, brokers, dealers, stockists, mill owners, exporters. Every decision below is grounded in a real 56-flow usage dataset (448 onboarded uses / 223 classified current-customer uses) and stated data/product requirements, not aesthetic preference.

Build mobile-first, but as **one responsive component system** — 1 column on phone, 2 on tablet, 4 on desktop. Never design the desktop layout separately.

## Core design principles (why these decisions were made)

- **94%+ of users enter through Product-first**, not By-Product-first → Product stays the largest, most dominant entry point on Home.
- **One product is picked ~2x as often as multiple** → default interactions optimize for single-tap, single-select; multi-select is a lightweight add-on, never the default mode.
- **93.8%+ of users want All Price Types, not one** → the answer screen shows all price types together by default; never hide most of them behind a single hero number.
- **Mature customers gravitate to Province/District scope**, not Single Mandi or Whole Country (Single Mandi usage fell from 25% at onboarding to 6% for current customers; Province rose 19%→33%; District rose 8%→20%) → the geography step defaults to the user's own Province/District, pre-filled and editable — never defaults to either extreme.
- **The taxonomy has two structurally different division types** — 13 "Product" divisions that go straight to by-products, 8 "Vertical" divisions that go through an intermediate Products layer — but this must be **invisible to the user**. One recursive icon-grid component handles both; the user just keeps tapping pictures until prices appear.
- **Illiterate users respond to pictures, size, and repetition — not text.** Real photos of commodities wherever possible, not abstract icon sets. All tappable tiles are circular, minimum 48px.

## Full navigation flow

### 1. Home Screen (update existing)
Keep as-is: header (user name, home mandi + dropdown, notification bell), Your Picks favorites row (min/max price cards), WhatsApp-style Rates Feed card, bottom nav (Home / Analytics / News + separate circular Voice button).

Add: a **search bar** with an inline mic icon, positioned near the top action area — this was part of the originally agreed home shape and needs to be reinstated. It's the direct fix for a user who wants one specific by-product without walking the full tree.

Rename: **"Commodity" tile → "Product."**

Tiles keep their current visual hierarchy: **Product** (large, primary), **Live Market**, **Mandi** (both secondary — Live Market is real-time and structurally separate from historical rates; Mandi is the geography-first entry point).

### 2. Search (new screen)
Tapping the search bar or mic opens full-screen search: large input field, inline voice-input button, live-filtered results as a scrollable list of round photo tiles (≥48px) with a name label beneath. Tapping a result — or a completed voice query — jumps straight to the Rate Card screen (Step 6), skipping the grid tree entirely.

### 3. Division Grid Screen (tap "Product")
A grid of 20 circular photo tiles, 48px minimum (scales up per the 1/2/4-column breakpoint rule) — one per division (13 Product-type + 7 Vertical-type; Live Market is excluded here since it has its own Home tile). Short label under each photo; real commodity photography, not icon illustrations.

Order and size tiles by real usage volume where available (highest-demand commodities first and visually larger); fall back to a sensible grouping (grains, livestock inputs, fresh produce...) if usage data isn't ready yet.

**Optional, include if time allows:** a tiny corner badge per tile — a small stack icon on tiles that open another grid (Vertical-type), a small price-tag icon on tiles that go straight to prices (Product-type). Purely a predictive cue for repeat users; never required to proceed.

Tapping a tile:
- **Product-type division** → straight to Step 5 (By-Product Grid).
- **Vertical-type division** → Step 4 (Product Grid) first.

### 4. Product Grid Screen (Vertical-type divisions only)
Same exact tile component as Step 3, one level deeper. Example: tapping "Fruits" shows Mango / Banana / Citrus / Melon / Apple / Pomegranate / etc. as photo tiles. Same 48px round-tile spec, same ordering rules.

Supports multi-select (checkmark state on tile) for the ~20–30% of users who want more than one product. Selected products pin as a chip row at the top so the user can keep browsing while tracking selections.

Proceeds to Step 5 on a single tap or a confirmed multi-select.

### 5. By-Product Grid Screen (terminal picker)
Same recursive tile component again — **no special-cased layout for large lists.** Even Rice's ~70 by-products render as a plain scrollable grid of round 48px+ photo tiles, not a grouped drill-down and not a text list.

If multiple products were selected in Step 4, a product chip row sits at the top so the user can cycle between each selected product's by-product grid — this is the existing chip-cycling pattern, unchanged.

Tapping a by-product tile (or multi-selecting several, same chip pattern) proceeds to Step 6.

### 6. Rate Card Screen (the answer)
The payoff screen — feels like the existing "Your Picks" card, expanded:
- Commodity photo + name at top.
- **Geography chip**, pre-filled with a smart default (the user's own District or Province — never Single Mandi or Whole Country by default). Tap to widen/narrow, or multi-select provinces, which then shows as a cyclable chip row exactly like the product chip row.
- **Time chip**, defaulting to "Today." Tap to reveal Yesterday / This Week / Pick a Date — never a blocking step; always inline on this screen.
- **All 8 price types shown together by default** as a compact list of icon-coded rows (Farm / Broker / Mandi (Auction) / Mill / Dealer / Wholesale / Retail / Stock), each with min–max and a colored trend arrow. A small toggle lets the rare user isolate a single price type — never the default state.
- If multiple by-products were selected upstream, a by-product chip row cycles between their Rate Cards.

### 7. Advanced / Compare Mode (existing dashboard, kept but gated)
The current three-chip-row filter dashboard (multi-select product × mandi × rate-type, all simultaneous) stays exactly as it is today, but moves behind an explicit **"Compare"** toggle on the Rate Card screen. This is what Layer 2+ personas (broker, dealer, wholesaler, stockist, mill owner, exporter) actually want; everyone else gets the funneled default above.

## Component specs

- **Photo tile:** circular, minimum 48px (scales with breakpoint), real commodity photography, short label beneath, optional corner badge (stack / price-tag), selected state = colored ring + checkmark.
- **Chip (geography / product / by-product / price-type):** pill shape, default / selected / multi-selected-cycling states, matches the app's existing green palette.
- **Price-type row:** icon + label + min–max value + trend arrow (green up, red down, neutral gray flat).
- **Search bar:** persistent on Home, icon-prefixed, inline mic icon, expands to full-screen search on tap.

## Visual system

Match the existing screen exactly: dark green gradient header, white/light card backgrounds, rounded corners and soft shadows throughout, green accent for primary actions and positive price movement, red for negative movement. Keep bilingual Urdu/English labeling wherever the existing app already uses it (e.g. the Rates Feed header). Bottom nav (Home / Analytics / News + circular Voice button), Your Picks, and the Rates Feed section on Home stay exactly as they are today.

## Out of scope for this pass

Live Market screen internals, the Mandi-tile (geography-first) screen internals, Voice's response format, and the Analytics/Graphs tab — none of these change as part of this flow.