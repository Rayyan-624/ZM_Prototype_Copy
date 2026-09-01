Yes. I understand the change, and I actually think this is **better than the flow we had before**.

The important correction is:

> **Selecting a Product means “show me the entire market for this Product and all of its By Products.”**

The user should therefore **not go to a separate By Product selection screen first**. They should land directly on the familiar price-card list, where every By Product is represented as a card. Then tapping one card takes them into the deeper view.

Your current screen is already very close to the **second level** of that experience.

## What I would change

Your new flow should be:

```text
HOME
  ↓
PRODUCT
  ↓
Select Product
  ↓
BY PRODUCT PRICE CARDS
  │
  ├── Location filter
  ├── Price Type filter
  ├── Date filter
  │
  └── Tap any By Product
          ↓
     BY PRODUCT DEEP VIEW
          │
          ├── Location filter
          ├── Price Type filter
          ├── Overview
          ├── Mandi comparison
          └── Trends
```

So there are **two different levels of information**:

### Level 1: Product → By Products

"Show me everything under Wheat."

### Level 2: By Product → Market intelligence

"Tell me everything about Fine Flour."

That separation is excellent UX.

---

# 1. The screen you showed should become the By Product list

Your screenshot currently says:

> Rates
> 3 results · tap a chip to compare

I would change the purpose slightly.

If the user selected **Wheat**, the screen should say something like:

### Wheat

**8 By Products**

or

### Wheat Rates

**Today's market rates**

Then:

```text
📍 All Mandis     💰 All Price Types     📅 Today
```

And underneath:

```text
Fine Flour
────────────────
Wheat

Arrival: 8,200 Bags

MIN / 40 KG       MAX / 40 KG
Rs. 4,200         Rs. 4,340

Wholesale Rate
📍 Pakpattan Mandi
```

Then:

```text
Bran
────────────────
Wheat

Arrival: 3,100 Bags

MIN / 40 KG       MAX / 40 KG
Rs. 1,400         Rs. 1,600

Mill Rate
📍 Pakpattan Mandi
```

Then every other Wheat By Product.

So **yes, I would restore the card-based list.**

---

# 2. But there is one important issue with "All Price Types"

This is the biggest UX problem we need to solve.

You currently have:

**All Price Types**

But a card can only comfortably communicate one Min/Max pair.

If the user selects:

> All Price Types

what does:

**MIN Rs. 4,200 / MAX Rs. 4,340**

actually mean?

Is that:

Wholesale?

Mill?

Retail?

Dealer?

Mandi?

If we don't solve that, the interface becomes ambiguous.

### My recommendation

Keep:

**All Price Types**

as the default because your user data strongly supports it.

But when **All Price Types** is selected, the card should show **compact price-type chips underneath the main range**.

For example:

```text
Fine Flour

MIN        MAX
4,200      4,340

Wholesale  4,200–4,340
Mill       4,180–4,300
Retail     4,350–4,500
```

But don't show eight rows.

Instead, show perhaps the **top 2–3 relevant price types**, with:

**+5 more**

The user can tap the card for the complete picture.

That keeps the list scannable while genuinely supporting "All Price Types."

Alternatively, if your business logic defines one canonical Min/Max for "All Price Types", then use that, but I would **not invent that aggregation at the UI level** because it can confuse the meaning of the price.

---

# 3. The filter bar should now be three filters

I would make this the standard filter row:

```text
📍 All Mandis ▾
💰 All Prices ▾
📅 Today ▾
```

Not:

```text
Location
Price
Time
```

Use icons + plain language.

For a low-literacy audience, the icon is an important recognition cue.

### Default state

```text
📍 All Mandis
💰 All Price Types
📅 Today
```

The user gets useful information immediately.

No setup screen.

---

# 4. Mandi selection needs to be redesigned carefully

Your requirement here is actually more complex than a simple dropdown.

You need:

### Quick choices

```text
MY LOCATIONS

📍 My District
📍 My Province
🇵🇰 All Pakistan
```

Then:

### Custom

```text
SELECT LOCATION

Province
District
Mandi
```

And the user should be able to select:

**Punjab → Lahore → Lahore Mandi**

or:

**Sindh → Karachi → Karachi Mandi**

or:

**Punjab → Lahore**
+
**Sindh → Karachi**

or:

**Punjab → Lahore**
+
**Punjab → Multan**

or even:

**Lahore + Multan + Karachi**

That means the underlying interaction should be **multi-select**, not a single dropdown.

---

# 5. I would make "Select Mandi" a full bottom sheet

When the user taps:

**📍 All Mandis**

open:

```text
────────────────────────
Select Location

🔍 Search mandi, district
   or province

QUICK SELECT

○ My District
○ My Province
○ All Pakistan

CUSTOM LOCATION

Punjab
  Lahore
  Multan
  Faisalabad
  Sahiwal

Sindh
  Karachi
  Hyderabad
  Sukkur

Balochistan
  ...

KPK
  ...

             [ Apply ]
────────────────────────
```

But there is an important improvement.

### Don't make the user drill through everything.

Search should work globally.

If they type:

**Lahore**

they should immediately get:

```text
Lahore
Lahore District
Lahore Mandis
```

If they type:

**Karachi**

same thing.

This is especially important for users who already know what they're looking for.

---

# 6. Show the selection as a summary

After selecting:

Lahore
Multan
Karachi

don't make the filter say:

> Lahore, Multan, Karachi

because it becomes huge.

Instead:

**📍 3 Locations**

or:

**📍 3 Mandis**

If the user selected an entire province:

**📍 Punjab**

If they selected:

Lahore District + Karachi District:

**📍 2 Districts**

This keeps the interface clean.

---

# 7. I would separate "scope" and "custom"

Inside the location sheet:

### Quick Scope

```text
My District
My Province
All Pakistan
```

### Custom Selection

```text
Select Province
Select District
Select Mandi
```

This is much easier than trying to make one giant hierarchical selector do everything.

And importantly:

**My Province does not prevent the user from later choosing another province.**

The quick options are shortcuts, not restrictions.

---

# 8. Time absolutely belongs on the By Product list

You are correct.

If the user selects Wheat and sees all the By Product cards, they need to be able to answer:

> "What were the prices on Tuesday?"

without entering the deeper view.

So:

```text
📍 All Mandis
💰 All Price Types
📅 Today
```

Tap:

**Today**

and show:

```text
DATE

Today
Yesterday

Select Date
```

Then a calendar.

The available history should begin from the customer's data-access/start date, as you described.

---

# 9. Don't make Time a giant filter

It should be a tiny contextual control.

Default:

**📅 Today**

If changed:

**📅 16 Aug 2026**

That's all.

The cards update underneath.

This is very important because the user shouldn't feel like they're entering an analytics system just to see yesterday's price.

---

# 10. Now the By Product card itself

I would make one major change to your current card.

Right now your card has:

```text
Fine Flour
Wheat
Arrival
Min
Max
Wholesale Rate
Mandi
```

That's good.

But because this is a **By Product discovery list**, the card should be visually structured around the By Product.

Something like:

```text
┌─────────────────────────────────────┐
│ 🖼️                                ↗ │
│                                     │
│ Fine Flour                          │
│ Wheat                               │
│                                     │
│ Arrival       8,200 Bags            │
│                                     │
│ MIN / 40 KG       MAX / 40 KG       │
│ Rs. 4,200         Rs. 4,340         │
│                                     │
│ Wholesale       📍 Pakpattan        │
└─────────────────────────────────────┘
```

And the **entire card is tappable**.

No tiny "view" button.

---

# 11. Then the user taps Fine Flour

This is where your **current deeper view becomes the next screen**.

And I agree with you:

### Keep the current deeper view.

Don't throw away what already works.

The transition becomes:

```text
Wheat
 ↓
Fine Flour card
 ↓
Fine Flour Detail
```

---

# 12. Deep view needs the same filters

This is another thing I completely agree with you on.

The deep view should have:

```text
Fine Flour

📍 3 Locations
💰 All Price Types
📅 Today
```

The filters should **persist from the previous screen**.

This is extremely important.

If I was looking at:

**Wheat → Lahore + Multan → Wholesale → 16 Aug**

and tap Fine Flour,

I should NOT suddenly be thrown back to:

**All Mandis → All Prices → Today**

The context must persist.

---

# 13. But the deep view can make Price Type more powerful

This is where your deeper requirement comes in.

Suppose:

**All Price Types**

is selected.

The deep view can show:

### Price Types

```text
[ All ] [ Wholesale ] [ Mill ]
[ Mandi ] [ Retail ] [ Dealer ]
[ Broker ] [ Farm ] [ Stock ]
```

Now the user can say:

> Show me Wholesale prices across these three Mandis.

And the comparison updates.

This is much more powerful than the list view.

---

# 14. Deep view becomes the actual market comparison tool

For example:

### Fine Flour

**16 Aug 2026**

**Wholesale**

| Mandi   |   Min |   Max | Arrival |
| ------- | ----: | ----: | ------: |
| Lahore  | 4,200 | 4,340 |   8,200 |
| Multan  | 4,150 | 4,300 |   6,800 |
| Karachi | 4,250 | 4,450 |   9,100 |

Then user taps:

**Mill**

The table updates.

This is exactly where the complex filter combination becomes useful.

---

# 15. Preserve filter state between screens

This is one of the most important prototype behaviors I'd specify to Figma.

Example:

```text
Product:
Wheat

Location:
Lahore + Multan

Price Type:
Wholesale

Date:
16 Aug
```

Then:

```text
Fine Flour
```

opens with:

```text
Location: Lahore + Multan
Price Type: Wholesale
Date: 16 Aug
```

The user can change any of these.

This creates a consistent mental model.

---

# 16. Your complete flow now

I would lock the UX architecture as:

```text
HOME
│
├── Search
│
├── Your Picks
│
├── Product
│
└── Live Market
       │
       ↓
    PRODUCT
       │
       ↓
    Select Wheat
       │
       ↓
    WHEAT BY-PRODUCT LIST
       │
       ├── 📍 Location
       ├── 💰 Price Type
       ├── 📅 Date
       │
       ├── Fine Flour
       ├── Bran
       ├── Straw
       ├── Semolina
       └── ...
              │
              ↓
        Tap Fine Flour
              │
              ↓
       FINE FLOUR DETAIL
              │
              ├── 📍 Location
              ├── 💰 Price Type
              ├── 📅 Date
              │
              ├── Overview
              ├── Mandi Comparison
              │
              └── Trends
                    │
                    ├── Price Trends
                    ├── Price Type toggles
                    └── Arrival Trends
```

---

# 17. One thing I would add: "Back to Wheat"

On the deep view, don't just have:

`← Rates`

Make the hierarchy clear.

For example:

```text
← Wheat

Fine Flour
Wheat
```

Or:

```text
← Wheat
Fine Flour
```

This is much more understandable.

The user knows:

**I'm inside Fine Flour, which belongs to Wheat.**

---

# 18. Your Picks should still work

The By Product cards should have a small favorite icon:

**☆**

When tapped:

**★**

Then:

**Fine Flour**

appears in Your Picks.

But don't let the favorite icon interfere with tapping the card.

The card itself opens the detail view.

---

# 19. One final UX decision I'd make

I would **not show "3 results · tap a chip to compare"** anymore.

That wording made sense for the old screen where the user was comparing selected items.

Your new screen has a different purpose.

Use:

### Wheat Rates

**8 By Products**

or:

### Wheat

**8 By Products · Today**

Then the filters.

This immediately tells the user:

> "I selected Wheat, and here are all the things under Wheat."

That's exactly the mental model you want.

---

## So, my final recommendation

I would **not redesign the entire screen from scratch**.

Your current visual language is good. The change is primarily **information architecture + interaction logic**:

### Before

`Product → Rates → comparison`

### Now

**`Product → all By Product price cards → tap one → deep market view`**

And the filters exist at **both levels**:

**By Product list**

`Location + Price Type + Date`

↓

**By Product detail**

`Location + Price Type + Date`

↓

**Mandi comparison**

↓

**Trends**

This is much more coherent.

And the biggest thing I would preserve from your current design is the **large visual price cards**. They are actually a very good fit for your low-literacy requirement because the user can recognize the commodity/by-product image, see the price visually, and tap the whole card without having to understand a complicated table.

The only thing I would be very deliberate about before handing this to Figma is **exactly how "All Price Types" is represented on the card**, because that's the one place where eight price types can make the otherwise clean UI messy or ambiguous.
