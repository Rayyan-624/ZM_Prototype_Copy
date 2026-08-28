Reference materials attached: 1) screen recording / mp4 of the live onboarding 
(pakistan-map-bg.mp4 as background layer), 2) the production HTML/JS source, 
3) screenshots of each live screen. Match these EXACTLY for layout, color, 
copy, and motion timing — this is a recreation, not a reinterpretation.

═══════════════════════════════
GLOBAL LAYERS (persist across all screens)
═══════════════════════════════
Layer 1 — Base: solid cream background (#FBF8F1)
Layer 2 — Background video: Pakistan map animation, positioned left 0-58% of 
  screen width, full height, blend mode "Multiply," opacity 85%, right edge 
  fades to transparent via gradient mask (solid 0-30% width, fading to 
  transparent by 100% width). Slightly increased contrast/saturation look.
Layer 3 — 3D turbaned character (center-right, transparent background sprite/
  Lottie): starts in left side-profile, slowly rotates to face forward as the 
  flow progresses through steps 1→4. Idle motion: gentle vertical bob + slight 
  sway, continuous loop, subtle breathing scale on torso.
Layer 4 — Grain/noise texture overlay, ~3.5% opacity, static, blend "Multiply," 
  full-bleed, non-interactive.
All 4 layers stay mounted and visible behind every card/step — only the 
foreground card content changes between screens.

═══════════════════════════════
SCREEN 0 — LOGO / LANGUAGE SELECT (entry state)
═══════════════════════════════
- Centered "Zarai Mandi" logo mark. Entrance: fades in + rises 14px + scales 
  from 0.94→1 over 1.0s (ease power3.out), then loops a slow float 
  (bob −8px over ~6.2s) + soft drop-shadow glow pulse, infinite.
- Below logo: frosted glass pill (cream @85% opacity, 16px backdrop blur, 
  24px radius, hairline border) with two buttons: "English" and "اردو" 
  (Nastaliq Urdu font). Buttons: gold/cream (#F5DDB7), rounded 12px, soft 
  drop+inset shadow. On hover, small decorative wheat/leaf icons animate 
  upward from behind the button in a staggered flourish.
- Above the logo, up to 4 glass info cards stack in one at a time, CUMULATIVE 
  (each new one pushes older ones upward, all stay visible), triggered by 
  scroll/progress at ~25%, 50%, 75%, 100% of this screen's "explore" zone. 
  Each card: eyebrow (uppercase teal label) + serif title + short body/pill row.
  Card 1: "Since 2021 • Pakistan" / "What is Zarai Mandi?" / Pakistan's first 
    B2C price-discovery platform for agri commodities.
  Card 2: "How we work" / "Powered by WhatsApp & Real Reps"
  Card 3: "Our Services" / "Everything the Agri Market Needs" (pill tags)
  Card 4: "Join the community" / "100+ Markets. One Feed." + CTA link
- A subtle "scroll hint" indicator is visible at the very start and fades out 
  once the first card appears.
- Transition out: whole logo/card group fades out (0.35s, ease power2.in, 
  moves up −14px) when a language is picked.

═══════════════════════════════
SCREEN 1 — ROLE SELECT (Step 1 of 4)
═══════════════════════════════
Card anchored to the RIGHT side of the screen, vertically centered, so the 3D 
character stays visible on the left. Card: white/cream surface, ~400px wide, 
rounded 20px, soft elevated shadow, generous padding.
- Eyebrow: "Step 1 of 4"
- Headline (serif): "Who are you?"
- Subline: "Select your role to personalise Zarai Mandi."
- Two large radio options: "Customer" (Track mandi prices, buy & sell 
  commodities) and "Representative" (Submit field rates, manage mandi regions)
- Conditional sub-section (expands based on selection):
  - If Customer: scrollable list of occupations (Farmer, Seed Dealer, 
    Commission Agent, Mill Operator, etc. — ~29 options) with radio dots
  - If Representative: second radio pair — "Representative" vs "Agronomist"
- Primary CTA button: "Continue →" (disabled/greyed until valid selection), 
  full width, dark teal (#0F5D52)
- Ghost/text back button: "← Change Language / زبان"

═══════════════════════════════
SCREEN 2 — PHONE NUMBER (Step 2 of 4)
═══════════════════════════════
Same right-anchored card position/style.
- Eyebrow: "Step 2 of 4"
- Headline: "What's your WhatsApp number?"
- Subline: "We'll send a one-time verification code over WhatsApp."
- Field row: country-code dropdown (PK flag + "+92 (PK)" default, also US/UK/
  UAE/KSA options) beside a floating-label phone input ("WhatsApp number")
- Primary CTA: "Continue" (disabled until valid), Ghost back button

═══════════════════════════════
SCREEN 3 — OTP VERIFICATION (Step 3 of 4)
═══════════════════════════════
- Eyebrow: "Step 3 of 4"
- Headline: "Enter Verification Code"
- Subline: "We sent a 4-digit code over WhatsApp."
- Row of 4 individual square OTP digit boxes (auto-advance focus)
- Primary CTA: "Verify Code" (disabled until 4 digits filled), Ghost back button

═══════════════════════════════
SCREEN 4 — NAME ENTRY (Step 4 of 4)
═══════════════════════════════
- Eyebrow: "Step 4 of 4"
- Headline: "What's Your Name?"
- Subline: "Please enter your real name for profile identity."
- Two floating-label text inputs stacked: "First Name," "Last Name" (each with 
  an animated underline that fills in teal on focus)
- Primary CTA: "Continue" (disabled until both filled), Ghost back button

═══════════════════════════════
TRANSITIONS BETWEEN STEPS (apply identically everywhere)
═══════════════════════════════
- Outgoing card: fade opacity 1→0, translate up −14px, 0.35s, ease power2.in
- Incoming card: fade opacity 0→1, translate from +18px→0, 0.6s, ease power3.out
- Background video, grain, and 3D character layers do NOT reset — they persist 
  and continue their idle motion/rotation across the transition.
- On final step completion: a full-screen white "veil" fades in over ~0.4-0.6s, 
  holds briefly (~1.6s) while content swaps underneath, then fades out to reveal 
  the dashboard.

═══════════════════════════════
STYLE TOKENS
═══════════════════════════════
Colors — Teal: #0A3E38, #0F5D52 (primary), #146B5E, #1C8272 | 
  Cream: #FBF8F1, #F3EDE0 | Gold: #D8A94E, #B9812F | 
  Ink: #182422 (headings), #4B5C58 (body)
Type — Headlines: Fraunces (serif) | UI/body: Inter | Urdu: Noto Nastaliq Urdu
Motion easing — entrances: power3.out | exits: power2.in | progress-linked 
  camera/scroll interpolation: power2.inOut

═══════════════════════════════
DELIVERABLE
═══════════════════════════════
Build as 5 frames (Logo/Language, Role, Phone, OTP, Name) sharing one base 
component for the video+character+grain background layer, connected via Smart 
Animate prototyping using the transition specs above, so the flow can be played 
end-to-end as an interactive Figma prototype matching the attached video 1:1.

Build it as an mobile app , for its screen.