You are a Senior Product Designer, UX Researcher and Design Systems Lead.
You are redesigning the complete Customer Application of Zarai Mandi, Pakistan's agricultural market intelligence platform.
I have attached:
Brand Guidelines
Product Overview
Customer Personas
Existing Wireframe
Existing Design References
Read everything first before designing.
Do not start generating UI until you understand the information architecture.
PRODUCT
Zarai Mandi is NOT an e-commerce platform.
It is NOT a marketplace.
It is Pakistan's agricultural market intelligence platform.
Customers use it to make buying and selling decisions using verified mandi prices collected from representatives across Pakistan.
THE BIGGEST UX PROBLEM
Currently almost every customer uses Zarai Mandi through WhatsApp.
WhatsApp currently works like this:
General Groups
↓
Daily commodity prices are posted continuously
↓
Private Chat
↓
Customer asks
"Today's Wheat rate in Lahore?"
or
"Cotton in Multan?"
↓
Our sales representative manually filters data and replies.
The application should replace this workflow.
The app should feel like chatting with a Zarai Mandi sales representative,
WITHOUT making the user actually type or chat.
Every screen should simply reveal the next answer.
Think of it as
Button → Answer
instead of
Question → Text Reply.
PRIMARY USER FLOW
This flow must be extremely fast.
Open App
↓
Home
↓
See today's rates
↓
Search OR Tap Commodity
↓
View rates
↓
Decision made
↓
Exit App
The user should be able to complete this in under 20 seconds.
Nothing should interrupt this.
No analytics.
No weather.
No news.
No graphs.
No clutter.
Those belong elsewhere.
DESIGN PHILOSOPHY
The entire application is built around one idea.
Every tap reveals one more layer.
Never overwhelm the user.
Never show everything at once.
Every screen answers only one question.
The information architecture should progressively disclose information.
Layer 1
↓
Layer 2
↓
Layer 3
↓
Layer 4
Exactly like talking to a human.
HOME SCREEN
This is the most important screen.
It should resemble my wireframe.
Large touch targets.
Very visual.
Almost no reading.
The screen should contain:
Current Location
Notification Button
Search Bar
Voice Button
Two large shortcut cards
Nearby Mandis
Commodity List
Then comes the main information layer.
Large Commodity Cards
Examples
Wheat
Rice
Cotton
Maize
Vegetables
Fruit
Livestock
Fertilizer
etc.
These should NOT be tiny grid icons.
They should be large tappable cards.
Each card should feel like a doorway.
CARD BEHAVIOUR
Click Wheat
↓
Open Wheat Detail Layer
Click Rice
↓
Open Rice Detail Layer
Every commodity opens another screen.
No popups.
No dropdown overload.
Navigation should always feel forward.
COMMODITY DETAIL PAGE
When a commodity opens,
show only:
Commodity Name
Nearby Mandi
Current Rate
Min Price
Max Price
Average
Arrival
Last Updated
Simple price trend
Compare Button
No overwhelming tables.
No spreadsheets.
FILTERS
Filtering is extremely important.
Current dashboards require too many steps.
I want
Maximum
2 Click Filtering.
Example
Tap Wheat
↓
Tap Lahore
↓
Done
or
Tap Rice
↓
Tap Nearby Mandis
↓
Done
No complicated filter menus.
PERSONAS
One application serves everyone.
Farmers
Commission Agents
Brokers
Mill Owners
Stockists
Dealers
Wholesalers
Retailers
Exporters
DO NOT create different applications.
Instead create progressive layers.
Simple users stop at Layer 1.
Advanced users naturally continue deeper.
SECONDARY FEATURES
These are NOT on the homepage.
These belong in bottom navigation.
Graphs
News & Updates
Voice
BOTTOM NAVIGATION
Only four navigation items.
Home
Graphs
News & Updates
Voice
Voice is NOT an AI assistant.
Voice simply replaces WhatsApp voice notes.
Users press the microphone.
Speak
"I need Wheat rates."
The application returns graphical results instead of long audio replies.
GRAPHS PAGE
This page is for power users.
Brokers
Mill Owners
Exporters
Stockists
Dealer
Graphs should resemble financial trading dashboards.
Daily
Weekly
Monthly
Yearly
Moving averages
Price history
Comparison
Nearby mandi comparison
Pakistan map comparison
Everything chart focused.
NEWS PAGE
Verified agricultural news only.
Government announcements
Support prices
Weather advisories
Crop disease alerts
Import Export
Market disruptions
Everything card based.
No newspapers.
WEATHER
Weather is NOT primary.
Weather appears only after opening a commodity.
It supports informed estimates.
Weather should integrate with
PAR
(Pakistan Agricultural Research)
to help predict future market movement.
Example
Wheat
↓
Weather
↓
Yield Forecast
↓
Estimated Price Outlook
This is a secondary workflow.
VISUAL STYLE
Modern.
Premium.
Minimal.
Organic.
Clean.
Large spacing.
Soft elevation.
Rounded corners.
Friendly.
Inspired by
Linear
Stripe
Apple
Not government portals.
ACCESSIBILITY
Primary audience:
Farmers
Outdoor sunlight
Low literacy
Android
Patchy internet
Large buttons.
High contrast.
Minimal reading.
Every important interaction should be possible through icons and images.
Users who cannot comfortably read Urdu or English should still understand navigation.
RESPONSIVE DESIGN
This application is Mobile First.
However,
every screen must intelligently scale to
Tablet
Desktop
Large Screens
without redesigning layouts.
Do not make a separate desktop interface.
Stretch the same design system.
Cards become grids.
Panels expand.
Content breathes.
The experience remains identical.
COMPONENTS
Create a complete reusable design system.
Buttons
Cards
Search
Price Cards
Commodity Cards
Navigation
Charts
Filters
Notifications
Badges
Tables
Bottom Navigation
Modals
Everything should become reusable Figma Components.
FINAL GOAL
Do NOT design a dashboard.
Design a visual conversation.
Every button is a question.
Every next screen is the answer.
The user should feel like Zarai Mandi is personally guiding them through market information one step at a time.
The entire experience should feel effortless, trustworthy, and instantly understandable, even for first-time users with low digital literacy.
I think there's one addition that will make Zarai Mandi stand out from every agriculture app I've seen: don't think in terms of screens—think in terms of cards as conversations.
For example:
Home → "What are you looking for today?"
Wheat card → "Which mandi?"
Lahore → "Here's today's verified price."
Tap price → "Want the 30-day trend?"
Tap trend → "Compare with nearby mandis?"
That interaction pattern mirrors how your team already serves users over WhatsApp, but transforms it into a fast, visual, touch-first experience. It's a much stronger mental model than trying to compress everything into a traditional analytics dashboard.