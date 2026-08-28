# Prompt 2 — Modified Final Version

Yes. After OTP, you currently have **6 stages**:

1. Product Selection
2. By-Product Preference
3. Location Preference
4. Subscription Selection
5. Welcome
6. Loading → Dashboard

To reduce these to **3 actual onboarding screens** without losing any information, I would combine them like this:

## Recommended 3-Screen Flow After OTP

### SCREEN 1 — YOUR AGRICULTURAL INTERESTS

**Combine: Product Selection + By-Product Preference**

This is the best combination because both screens are about **what the customer is interested in**.

**Top:**

* Heading: **What are you interested in?**
* Short description: *Select the products and by-products you want to track.*

**Section 1 — Products**

* Search bar
* Searchable chip/grid
* Product cards/chips
* PRO badge where applicable
* Selected products appear in a small **“Your Selection”** area

**Section 2 — By-Product Preference**

* Heading: **Which by-products interest you?**
* 20 round buttons
* **84 × 84 px**
* 4-column grid
* All buttons exactly the same size
* No categories/grouping
* Multi-select
* Selected state using ZM green/border
* No icons inside the circles unless already part of your existing design

**Bottom:**
`Continue →`

### Why this works

Product and by-product selection are logically one task:

**“Tell ZM what you want to follow.”**

Instead of making the user feel like they are completing two separate forms, it becomes one personalization step.

---

# SCREEN 2 — SET YOUR LOCATION

**Combine the location hierarchy and automatic detection into one screen.**

### Top

**Where do you want to see market rates?**

*Select your location to personalize the rates shown to you.*

### Location Detection

Large primary card:

**📍 Use My Current Location**

`Detect Automatically`

This should be the first option because it removes the need to manually navigate through the entire hierarchy.

Then:

**OR SELECT MANUALLY**

### Cascading Location

Use progressive selection:

**Province**
`Select Province ▼`

↓

**District**
`Select District ▼`

↓

**City**
`Select City ▼`

The next field remains disabled until the previous level is selected.

For example:

**Punjab**
→ **Okara**
→ **Okara City**

or

**Sindh**
→ **District**
→ **City**

This follows your existing ZM hierarchy without exposing the entire hierarchy simultaneously.

### Bottom

`Continue →`

### Important UX improvement

Don't show all districts/cities immediately.

Use:

**Province → District → City**

as a **dynamic cascading selector**.

That makes your 110+ location options feel much smaller.

---

# SCREEN 3 — CHOOSE YOUR ZM PLAN

**Subscription + Welcome + Loading become one final onboarding stage.**

### Top

**Choose Your Plan**

*Get personalized market rates and insights based on your interests.*

### Trial Banner

A prominent card:

**3 DAYS FREE**

*Try ZM before you subscribe.*

---

### Duration Selector

Use your existing four options:

`1 Month` | `3 Months` | `6 Months` | `1 Year`

The selected duration gets the ZM active state.

### Dynamic Pricing

The price automatically changes according to:

**Product Tier**

* PKR **3,000/month**
* PKR **5,000/month**

Then display:

**Regular Price**
~~PKR X~~

**Discount**
`10% OFF`

**Your Price**
**PKR X**

This keeps the subscription calculation understandable instead of displaying a large pricing table.

---

### Bottom Summary

A compact summary card:

**Your ZM Setup**

✓ Products selected
✓ By-products selected
✓ Location selected
✓ 3-day free trial

Then:

### `Start 3-Day Free Trial →`

Underneath:

*You can review your subscription before payment.*

---

# What Happens After Clicking the Final Button?

Don't create another onboarding screen for Welcome and Loading.

Instead, make them **states of Screen 3**.

### State 1 — Subscription Confirmation

Button changes to:

**Setting up your ZM experience...**

---

### State 2 — Welcome Animation

Show:

**✓**

**Welcome to Zarai Mandi**

*Personalizing your market experience...*

A short 1–2 second animation can check off:

✓ Your interests
✓ Your location
✓ Your preferences

---

### State 3 — Loading

Then show a lightweight loading state:

**Preparing your dashboard...**

After completion:

**→ ZM Dashboard**

This means Welcome and Loading are **transitions**, not additional onboarding screens.

---

# Final Structure

```text
OTP VERIFICATION
       │
       ▼
┌──────────────────────────────┐
│ SCREEN 1                     │
│ YOUR AGRICULTURAL INTERESTS  │
│                              │
│ Product Selection            │
│          +                   │
│ By-Product Preference        │
│                              │
│ 20 × 84px round buttons      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ SCREEN 2                     │
│ SET YOUR LOCATION             │
│                              │
│ GPS Auto Detection           │
│          OR                  │
│ Province                     │
│      ↓                       │
│ District                     │
│      ↓                       │
│ City                         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ SCREEN 3                     │
│ CHOOSE YOUR ZM PLAN           │
│                              │
│ 3-Day Free Trial             │
│ Duration                     │
│ Dynamic Pricing              │
│ Discount                     │
│ Subscription Summary         │
│                              │
│ START FREE TRIAL             │
└──────────────┬───────────────┘
               │
               ▼
        WELCOME STATE
               │
               ▼
        LOADING STATE
               │
               ▼
          ZM DASHBOARD
```

## Why I recommend this structure

The three screens now have **three clear questions**:

**Screen 1:**

> *What agricultural information do you want?*

**Screen 2:**

> *Where do you want that information from?*

**Screen 3:**

> *How do you want to access ZM?*

So the entire onboarding becomes:

**Interests → Location → Plan → Dashboard**

rather than making the customer feel like they are filling out six separate forms.

### One important adjustment

For the **20 by-product circles**, don't try to force all 20 into the visible 390 × 844 screen along with the product selection. Keep the **4-column × 84px grid**, but make Screen 1 vertically scrollable. The user can select products at the top and scroll naturally into the by-product section. This preserves your exact 84px requirement without making the UI cramped.

---

# Additional Requirement — Language Selection

Before the **Who Are You?** screen, the existing files currently contain only **English and Urdu** language options.

Expand this existing language-selection step to include **all major regional languages of Pakistan** while keeping the existing design and button treatment consistent.

The language options should be:

* **English**
* **Urdu**
* **Sindhi**
* **Punjabi**
* **Balochi**
* **Pashto**
* **Saraiki**

### Language Button Requirements

* All **7 language buttons must have exactly the same visual treatment**.
* Use the same **gold `#f5ddb7` background**.
* Maintain the same padding and border-radius for every language button.
* Keep button dimensions and spacing consistent.
* Only change the **font family/typeface where required**, particularly for RTL or regional-language rendering.
* Preserve the existing botanical leaf SVG hover treatment above each button.
* Do **not** add separate language icons.
* Do **not** add a scroll hint.
* Ensure all seven options fit naturally within the mobile layout without making the screen confusing or visually crowded.
* Selecting a language should apply that language to the subsequent onboarding experience where translations are available.

This language-selection screen remains the **first screen of the onboarding flow**, before **Who Are You?**, and should use the existing ZM language-selection design as the source of truth.
