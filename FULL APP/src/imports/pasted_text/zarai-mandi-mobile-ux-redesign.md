# Zarai Mandi Mobile UX Redesign

## Complete Home → Product → By Product → Location → Time → Rate Card Flow

Design a complete mobile-first UX flow for the Zarai Mandi application.

The goal is to make the experience understandable and usable by ANYONE, including users with very low literacy or users who are not comfortable navigating complex digital interfaces.

The interface should therefore prioritize:

1. Visual recognition over text
2. Large touch targets
3. Real commodity/product imagery
4. Extremely simple navigation
5. Minimal cognitive load
6. Consistent interaction patterns
7. Clear visual hierarchy
8. One primary action per screen
9. Easy back navigation
10. Search and voice as shortcuts
11. Product and By Product browsing without requiring the user to understand the taxonomy

Do NOT make the user understand the difference between a "Vertical", "Product", or "By Product".

Those are backend/data-model concepts.

The user should simply see visual cards and keep tapping until they reach the price information they want.

---

# 1. CORE INFORMATION ARCHITECTURE

The system has 21 divisions.

However, these divisions are of two different structural types.

## Product-type divisions

These are themselves Products.

When the user taps one of these, they should go directly to its By Product selection.

Product-type divisions:

1. Wheat
2. Maize
3. Sesame
4. Millet
5. Cotton
6. Paddy
7. Rice
8. Fertilizer
9. Dates
10. Mustard
11. Spices
12. Pulses
13. Sugarcane/Sugar

Their flow is:

Division/Product
↓
By Products
↓
Location + Time
↓
Rate Card

Example:

Wheat
↓
Fine Flour / Flour / Semolina / Bran / Straw / etc.
↓
Location + Time
↓
Prices

---

## Vertical-type divisions

These contain Products.

Vertical-type divisions:

1. Edible Oil
2. Livestock
3. Live Market
4. Kiryana
5. Fruits
6. Vegetable
7. Dry Fruit
8. Herbs

Their flow is:

Vertical
↓
Products
↓
By Products
↓
Location + Time
↓
Rate Card

The user should NOT be told that one is a Vertical and another is a Product.

The UI must make both look and behave like the same visual browsing system.

The only difference is that some tiles require one additional visual selection screen.

---

# 2. IMPORTANT UX PRINCIPLE

Build ONE reusable visual selection component.

Do not create separate interaction patterns for:

Product
Vertical
By Product
Rice
Fruits
Vegetables
Edible Oil
etc.

The same interaction pattern should repeat.

For example:

Tap:

Edible Oil

Then:

Canola
Mustard
Soybean
Sunflower
Arugula
Castor

Then:

Canola Seed
Canola Oil
Canola Meal

Then:

Location + Time

Then:

Rate Card

Whereas:

Tap:

Wheat

Immediately show:

Wheat
Fine Flour
Flour
Semolina
Bran
Special Flour
Barley
Oat
Sorghum

Then:

Location + Time

Then:

Rate Card

The user should never feel that the application has changed modes.

---

# 3. HOME SCREEN

Redesign the Home screen around three primary entry points.

The Home screen should contain:

## A. Search

Add a prominent Search field near the top.

This was missing from the current screen and MUST be added.

Placeholder:

"Search product"

The search should support:

• Product names
• By Product names
• Commodity names
• Common user terminology

Example:

User searches:

"1121"

Results can show:

1121 Basmati-1
1121 Basmati-2
1121 Steam
1121 Kacha
1121 Rejection Steam
etc.

Selecting a search result should bypass the hierarchy completely and take the user directly toward the relevant Rate Card.

Search is the shortcut for users who already know exactly what they want.

---

# 4. VOICE SEARCH

Add a microphone icon inside or beside the Search field.

The user should be able to tap the microphone and say:

"1121"
"wheat"
"canola oil"
"potato"
"today's wheat rate"

The interface should visually confirm what was understood before continuing.

Voice should be treated as an accessibility feature, not a separate complicated feature.

---

# 5. HOME SCREEN PRIMARY ACTIONS

Below Search, provide the primary visual entry points:

## Product

Rename the existing "Commodity" button to:

"Product"

This is the main browsing entry point.

The current research shows Product-first behavior dominates:

• Product-first is approximately 94% among onboarded users
• Product-first remains approximately 88% among current customers

Therefore Product MUST remain the dominant entry point.

Do not replace it with Geography-first navigation.

Do not make Location the first decision.

---

## Live Market

Keep Live Market separately visible on the Home screen.

Live Market is fundamentally different from the normal commodity/product pricing flow.

Therefore it should NOT be buried inside the normal Product hierarchy.

Home should provide:

Search
Product
Live Market

These should be immediately understandable.

Use large visual cards with recognizable imagery/icons.

---

# 6. PRODUCT SCREEN

When the user taps:

PRODUCT

Open the Division selection screen.

Display the 21 divisions as large visual tiles.

Every tile must look consistent.

Do NOT visually separate:

Product divisions
Vertical divisions

Do NOT label them as:

"Vertical"
"Product"

Those terms are for the internal data model only.

The user should simply see:

Wheat
Maize
Rice
Cotton
Fruits
Vegetables
Edible Oil
etc.

---

# 7. DIVISION GRID

Use a visual grid.

Each tile must contain:

• Realistic commodity/product image
• Large readable name
• Minimum 48px circular image/icon
• Large touch target
• High contrast
• Clear selected state

The actual clickable area should be significantly larger than 48px.

48px is the MINIMUM size for the visual icon.

Prefer approximately 56–64px where space allows.

Do not use tiny icons.

Do not rely on text alone.

The image should allow a user with limited literacy to recognize the category.

---

# 8. DIVISION ORDER

Do NOT automatically alphabetize the divisions.

Use usage data to determine ordering once actual division-level usage data is available.

Until then, use the current business-priority order:

Wheat
Maize
Sesame
Millet
Cotton
Paddy
Rice
Edible Oil
Fertilizer
Livestock
Live Market
Dates
Mustard
Spices
Pulses
Kiryana
Sugarcane/Sugar
Fruits
Vegetable
Dry Fruit
Herbs

However, Live Market is already available from Home, so its placement inside Product browsing should be treated carefully and should not create confusion or duplicate entry unnecessarily.

---

# 9. PRODUCT-TYPE DIVISION BEHAVIOR

For:

Wheat
Maize
Sesame
Millet
Cotton
Paddy
Rice
Fertilizer
Dates
Mustard
Spices
Pulses
Sugarcane/Sugar

the selected division is already the Product.

Therefore:

Tap Division
↓
Show By Products

Do NOT show an unnecessary intermediate screen.

Example:

User taps:

MAIZE

Next screen:

MAIZE BY PRODUCTS

Visual grid:

Maize Grade A
Maize Grade B
Maize Grade C
Maize Grade D
Corn Starch
Corn Silage
Popcorn

Each item is a visual circular image/icon with a minimum 48px icon.

---

# 10. VERTICAL-TYPE DIVISION BEHAVIOR

For:

Edible Oil
Livestock
Live Market
Kiryana
Fruits
Vegetable
Dry Fruit
Herbs

the selected division contains Products.

Therefore:

Tap Vertical
↓
Show Products

Example:

Tap:

EDIBLE OIL

Next screen:

Canola
Mustard
Soybean
Sunflower
Arugula
Castor

Each is a visual tile.

Then:

Tap Canola

Next screen:

Canola Seed
Canola Oil
Canola Meal

Then the user selects the By Product.

---

# 11. EDIBLE OIL STRUCTURE

Edible Oil is a Vertical.

Its Products are:

Canola
Mustard
Soybean
Sunflower
Arugula
Castor

The structure is:

Edible Oil
→ Canola
→ Canola Seed
→ Canola Oil
→ Canola Meal

Edible Oil
→ Mustard
→ Mustard Seed
→ Mustard Oil
→ Mustard Cake

Edible Oil
→ Soybean
→ Soybean Oil
→ Soybean Meal
→ Soybean Seed
→ Soybean Oil Washed

Edible Oil
→ Sunflower
→ Sunflower Seed
→ Sunflower Oil
→ Sunflower Meal

Edible Oil
→ Arugula
→ Arugula Seed
→ Arugula Oil

Edible Oil
→ Castor
→ Castor Bean

---

# 12. RICE UX

Rice is a Product, not a Vertical.

Therefore:

Rice
↓
By Product selection

However, Rice has a very large number of By Products.

Do NOT convert these into a text-heavy dropdown.

All Rice options must remain visually tappable.

Use a scrollable visual grid.

Every Rice option should have:

• Circular image/icon
• Minimum 48px icon
• Large touch target
• Short readable label
• Clear selection state

Examples:

PK-386
1121 Basmati-1
1121 Basmati-2
1509 Sella
1509 Steam
386 Basmati-New
386 Basmati-Old
386 Steam
C-9 Basmati
C-9 Steam
1718 Steam
1847 Steam
etc.

If necessary, visually group them into families while keeping the exact same tap interaction.

Possible visual group labels:

1121
1509
386
C-9
1718
1847
Irri
Super
Sella
Other

But this grouping must NOT become another mandatory interaction step.

The user should still be able to scroll and tap directly.

---

# 13. BY PRODUCT SCREEN

Once the user reaches a By Product screen, make it visually obvious that these are the actual items whose prices are being requested.

Example:

WHEAT

[Fine Flour]
[Flour]
[Semolina]
[Bran]
[Straw]

or:

RICE

[1121 Basmati-1]
[1121 Basmati-2]
[1509 Steam]
[386 Basmati]
etc.

Use visual recognition first.

Avoid long technical descriptions.

---

# 14. FAVORITES / QUICK ACCESS

Returning users should not need to repeat the hierarchy.

Add:

"Your Picks"

on Home.

If the user repeatedly checks:

1121 Basmati
Wheat
Canola Oil
Potato Red

show those as quick-access visual cards.

Tap:

1121 Basmati

and go directly toward its Rate Card.

This is particularly important because the application is expected to become a repeated daily/weekly workflow.

---

# 15. LOCATION FLOW

After the user selects a By Product, location becomes relevant.

Do NOT make geography the first step.

The correct order is:

Product
↓
By Product
↓
Location
↓
Time
↓
Rate Card

The user research shows:

Product-first behavior dominates.

Location scope also changes significantly between new and mature users.

Current customer behavior shows stronger preference toward:

Single District
Single Province

rather than always using:

Single Mandi
Whole Country

Therefore the location experience should be smart and adaptive.

---

# 16. SMART LOCATION DEFAULT

Do not force the user to choose a location from scratch every time.

Show a preselected location based on the user's known/default location.

Example:

"Karachi District"

or:

"Sindh"

The user can tap the location chip to change it.

The goal is:

Confirm or adjust

rather than:

Make a complicated decision.

---

# 17. LOCATION SELECTION

The location selector should use visual progressive narrowing/widening.

Possible levels:

Mandi
District
Province
Country

Do not show all possible locations as a massive text list.

Use visual cards/chips.

Example:

LOCATION

[My Mandi]

[My District]

[My Province]

[Pakistan]

Then allow the user to drill into the selected level if required.

Use recognizable visual indicators.

---

# 18. TIME SELECTION

TIME MUST NOW BE PART OF THE FLOW.

However, do NOT make Time another large blocking screen.

Time should be a lightweight selector attached to the Rate Card context.

Default:

Today

Show a compact chip:

Today ▼

The user can tap it.

Options:

Today
Yesterday
This Week
Custom Date

The default should always be Today.

The user should not have to think about time unless they specifically want historical information.

---

# 19. MULTI-SELECT

The research indicates that single-product selection dominates, but multi-product flows also exist.

Therefore:

Default interaction:

Tap one item → continue

Do NOT introduce a complicated "Select Multiple" mode immediately.

Provide a subtle:

"+ Add another"

action.

If the user wants multiple products, they can add another.

Maintain the selected items visually as chips/cards.

Example:

Selected:

[Wheat ×]
[Rice ×]

Location:

[Sindh ▼]

Time:

[Today ▼]

Then:

[View Rates]

---

# 20. RATE CARD

The final destination should be a clear Rate Card.

The rate card should show:

Product / By Product
Location
Time

at the top.

Example:

1121 Basmati-1

Sindh
Today

Then display ALL relevant price types.

The research indicates that more than 93% of users want All Price Types.

Therefore DO NOT hide price types behind a single hero price.

Show all price types by default.

---

# 21. PRICE TYPE PRESENTATION

Do not create a wall of text.

Use visually recognizable rows/cards.

Each row should have:

Icon
Price Type
Price
Unit
Trend

Example:

🏠 Farm
Rs. 25,000

🏪 Mandi
Rs. 25,500

🏭 Mill
Rs. 26,000

etc.

Use simple visual trend indicators:

↑ Increased
→ Same
↓ Decreased

Do not depend entirely on color to communicate the trend.

Color can reinforce the meaning, but the icon/text must communicate it too.

---

# 22. RATE CARD HEADER

At the top:

[Back]

1121 Basmati-1

[Sindh ▼] [Today ▼]

Then:

Current Rates

All Price Types

The location and time chips should remain tappable.

This means the user can change:

Location

or:

Time

without going back through the entire Product hierarchy.

---

# 23. DIRECT SEARCH FLOW

Search is the fastest route.

Flow:

Home
↓
Search
↓
Search result
↓
By Product
↓
Location + Time
↓
Rate Card

If the user searches for a By Product directly, DO NOT make them go through:

Division
→ Product
→ By Product

Take them directly to the relevant selection/rate context.

---

# 24. VOICE FLOW

Flow:

Home
↓
Microphone
↓
"1121 Basmati"
↓
Confirmation
↓
Location + Time
↓
Rate Card

The confirmation should be visual.

Example:

Did you mean?

[1121 Basmati-1]

[1121 Basmati-2]

The user taps the desired option.

---

# 25. LIVE MARKET FLOW

Live Market is separate from Product pricing.

Keep it on Home.

Do not force it through:

Product
→ By Product
→ Location
→ Time

Instead:

Home
↓
Live Market
↓
Live Market-specific experience

The Live Market experience can have its own hierarchy and UX.

Do not merge it with the normal commodity pricing flow merely for consistency.

---

# 26. HOME SCREEN FINAL STRUCTURE

The Home screen should visually prioritize:

HEADER

Zarai Mandi

↓

SEARCH

[ 🔍 Search product                         🎙 ]

↓

YOUR PICKS

[ Wheat ] [ 1121 ] [ Canola Oil ]

↓

PRIMARY ACTIONS

[ PRODUCT ]

Visual commodity imagery

[ LIVE MARKET ]

Visual market imagery

↓

RECENT / WHATSAPP-STYLE UPDATES

Continue using the existing feed concept where appropriate.

↓

BOTTOM NAVIGATION

Home
Rates
Updates

Maintain the existing application navigation unless there is a strong UX reason to change it.

---

# 27. ICON DESIGN REQUIREMENT

This is extremely important.

Every selectable Product and By Product must have a circular visual icon/image.

Minimum icon size:

48px × 48px

Prefer:

56px–64px

The touch target should be larger than the icon itself.

Recommended touch target:

at least 48px × 48px

Prefer approximately 56px or larger.

Icons/images should be:

• Circular
• Visually recognizable
• Consistent
• High quality
• Realistic where appropriate
• Not overly decorative
• Not abstract if a real commodity image can be used

For example:

Rice → rice visual

Wheat → wheat visual

Cotton → cotton visual

Mango → mango visual

Canola → canola visual

1121 Basmati → rice/grain visual with a subtle identifying label

---

# 28. LOW-LITERACY UX PRINCIPLES

Design for someone who may not comfortably read English.

Therefore:

Do NOT rely on long instructions.

Do NOT use complex menus.

Do NOT use small text.

Do NOT make users understand terminology.

Do NOT require users to remember previous selections.

Do NOT hide important actions behind menus.

Instead:

Use images.

Use repetition.

Use large buttons.

Use familiar icons.

Use visual hierarchy.

Use simple labels.

Use confirmation states.

Use voice.

Use search.

Use favorites.

---

# 29. NAVIGATION

Every selection screen must have:

← Back

at the top.

Also show the current context.

Example:

Edible Oil
↓
Canola
↓
Select By Product

This can be represented visually as a simple breadcrumb, but do not make the breadcrumb text-heavy.

The user should always know:

"Where am I?"

"How do I go back?"

"What am I selecting?"

---

# 30. SELECTION STATE

When a user taps an item:

• Give immediate visual feedback
• Highlight the selected card
• Use a check indicator
• Slightly elevate or emphasize the card
• Keep the interaction fast

Do not make users wonder whether their tap worked.

---

# 31. MULTIPLE PRODUCTS

If multi-selection is enabled:

Example:

[✓ Wheat]
[✓ Rice]
[ + Add another ]

Then:

[View Rates]

Do not force users through separate rate cards one at a time unless necessary.

If multiple products have been selected, the resulting rate screen can show separate rate sections/cards.

---

# 32. ERROR / EMPTY STATES

Design clear visual states for:

No prices available

No data for selected location

No data for selected date

No search results

Network issue

Use simple language.

Example:

"No rate available"

"Try another location"

"Try another date"

Do not show technical error messages.

---

# 33. RESPONSIVE MOBILE DESIGN

Design primarily for mobile.

Primary frame:

390 × 844

Also ensure the system works for:

360 × 800

and:

430 × 932

Do not allow important controls to become too small on smaller screens.

---

# 34. DESIGN SYSTEM

Create reusable components for:

Division Card
Product Card
By Product Card
Search Bar
Voice Button
Location Chip
Time Chip
Rate Card
Price Type Row
Favorite Card
Back Button
Bottom Navigation
Empty State
Loading State
Selection State

All components must use consistent:

Spacing
Typography
Corner radius
Icon sizing
Touch targets
Selected states
Elevation
Visual hierarchy

---

# 35. COMPLETE USER FLOWS TO PROTOTYPE

Create working prototype connections for at least these flows.

## Flow A — Wheat

Home
→ Product
→ Wheat
→ Fine Flour
→ Location
→ Today
→ Rate Card

## Flow B — Maize

Home
→ Product
→ Maize
→ Maize Grade A
→ Location
→ Today
→ Rate Card

## Flow C — Rice

Home
→ Product
→ Rice
→ 1121 Basmati-1
→ Location
→ Today
→ Rate Card

## Flow D — Edible Oil

Home
→ Product
→ Edible Oil
→ Canola
→ Canola Oil
→ Location
→ Today
→ Rate Card

## Flow E — Fruits

Home
→ Product
→ Fruits
→ Mango
→ Mango Sindhri
→ Location
→ Today
→ Rate Card

## Flow F — Vegetable

Home
→ Product
→ Vegetable
→ Potato
→ Potato Red
→ Location
→ Today
→ Rate Card

## Flow G — Dry Fruit

Home
→ Product
→ Dry Fruit
→ Almonds
→ Almond American
→ Location
→ Today
→ Rate Card

## Flow H — Herbs

Home
→ Product
→ Herbs
→ Psyllium
→ Psyllium Husk
→ Location
→ Today
→ Rate Card

## Flow I — Search

Home
→ Search
→ 1121 Basmati-1
→ Location
→ Today
→ Rate Card

## Flow J — Voice

Home
→ Voice
→ "1121 Basmati"
→ Select result
→ Location
→ Today
→ Rate Card

## Flow K — Live Market

Home
→ Live Market
→ Live Market experience

---

# 36. MOST IMPORTANT UX RULE

The user should NEVER have to ask themselves:

"Is this a Product or a Vertical?"

They should only think:

"What do I want?"

Then:

"Which picture represents it?"

Then:

"Which specific item?"

Then:

"Where?"

Then:

"When?"

Then:

"What is the rate?"

The entire experience should feel like:

WHAT
↓
WHICH ONE
↓
WHERE
↓
WHEN
↓
RATE

This is the fundamental UX model.

---

# 37. FINAL SCREEN FLOW

The complete architecture should therefore be:

HOME
│
├── SEARCH
│     ↓
│   Search Result
│     ↓
│   Location
│     ↓
│   Time
│     ↓
│   RATE CARD
│
├── PRODUCT
│     ↓
│   21 DIVISIONS
│     │
│     ├── Product-type Division
│     │       ↓
│     │   By Products
│     │       ↓
│     │   Location
│     │       ↓
│     │   Time
│     │       ↓
│     │   RATE CARD
│     │
│     └── Vertical-type Division
│             ↓
│         Products
│             ↓
│         By Products
│             ↓
│         Location
│             ↓
│         Time
│             ↓
│         RATE CARD
│
└── LIVE MARKET
↓
Live Market Experience

---

# 38. PROTOTYPE REQUIREMENT

Create a high-fidelity clickable mobile prototype.

Do not only create static screens.

The prototype must demonstrate:

Home → Product

Product → Division

Product-type Division → By Products

Vertical-type Division → Products

Products → By Products

By Product → Location

Location → Rate Card

Rate Card → Change Location

Rate Card → Change Time

Home → Search

Search → Direct Rate Flow

Home → Voice

Home → Live Market

Back navigation at every stage

Favorites / Your Picks → Direct Rate Flow

---

# 39. DESIGN GOAL

The final experience should feel:

Simple
Visual
Fast
Familiar
Trustworthy
Agriculture-focused
Human
Accessible
Low-literacy friendly

Avoid making the application feel like an enterprise dashboard.

It should feel like a very simple tool where a farmer, trader, mandi user, dealer, or ordinary customer can open the app and reach the required rate in seconds.

The design should prioritize real-world usability over showing the complexity of the underlying data model.

The backend may have:

Division
Vertical
Product
By Product
Location
Time
Price Type

But the user should experience only:

Product
→ Specific item
→ Where
→ When
→ Rate

Do not expose backend taxonomy terminology to the user.
