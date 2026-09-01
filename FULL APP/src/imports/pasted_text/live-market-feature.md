Yes, understood. Since \*\*Live Market is an existing external data feed that is currently being delivered to customers as screenshots\*\*, we should \*\*not redesign the underlying information architecture or reinterpret the data\*\*.

We simply need to turn that existing Live Market message into an in-app feature while preserving the same information.

Use this as an addition to your existing Figma prompt:

---

## Add Live Market Feature

Add a dedicated \*\*“Live Market”\*\* button on the Home screen.

This feature is separate from the normal Product → By-Product → Mandi Rates flow.

The purpose of Live Market is to bring the \*\*existing Live Market International Rate updates\*\*, which are currently received by customers as screenshots generated from an external database, directly into the application.

### Live Market Entry

When the user taps:

\*\*LIVE MARKET\*\*

open a dedicated Live Market screen.

At the top display:

\*\*Live Market International Rate\*\*

and the latest available update time and date exactly as provided by the external data source.

Example:

\*\*Live Market International Rate\*\*
\*\*11:20 AM · 12/08/2026 · Wednesday\*\*

The timestamp must dynamically reflect the latest data received.

### Preserve the Existing Data Structure

Do \*\*not reinterpret, simplify, rename, remove, or reorganize the information from the existing Live Market source.\*\*

The app should essentially convert the existing screenshot/table experience into a responsive mobile interface.

The data shown in the provided example includes columns such as:

\*\*Name | +/- $ | L.Trade | High | Low | Volume | O.Int\*\*

For the second market section:

\*\*Name | +/- $ | L.Trade | High | Low | Ask | Bid\*\*

Preserve these fields and their values exactly as supplied by the external database.

### Commodity Market Table

Display the commodity market data in the same logical order as the source.

Examples from the current source include:

\*\*CT 2610\*\*
\*\*CT 2612\*\*
\*\*CT 2703\*\*
\*\*CT 2705\*\*
\*\*CT 2707\*\*
\*\*KPO 2608\*\*
\*\*KPO 2609\*\*
\*\*KPO 2610\*\*
\*\*KPO 2611\*\*
\*\*WHITE SUGAR 2610\*\*
\*\*WHITE SUGAR 2612\*\*
\*\*WHITE SUGAR 2703\*\*
\*\*SE 2607\*\*
\*\*SE 2610\*\*
\*\*SE 2703\*\*
\*\*WHEAT 2607\*\*
\*\*WHEAT 2609\*\*
\*\*WHEAT 2612\*\*
\*\*WHEAT 2703\*\*
\*\*CORN 2607\*\*
\*\*CORN 2609\*\*
\*\*CORN 2612\*\*
\*\*CORN 2703\*\*
\*\*SOYBEANS 2607\*\*
\*\*SOYBEANS 2609\*\*
\*\*SOY OIL 2607\*\*
\*\*SOY OIL 2609\*\*
\*\*SOY MEAL 2607\*\*
\*\*SOY MEAL 2609\*\*

Do not hard-code these values in the final product. Treat them as \*\*example data coming from the external database\*\*.

### Global / International Market Table

Also preserve the second table from the source, containing instruments such as:

\*\*PAKISTANI RUPEE\*\*
\*\*JAPAN YEN\*\*
\*\*E.U.R.\*\*
\*\*GB POUND\*\*
\*\*CNY SPOT\*\*
\*\*L.CRude OIL 1ST\*\*
\*\*LOCO GOLD\*\*
\*\*LOCOSILVER\*\*

Use the same source fields:

\*\*Name | +/- $ | L.Trade | High | Low | Ask | Bid\*\*

Again, these values should be dynamically populated from the external data source.

### Mobile UX

Because the original source is a wide table and the app is mobile, make the table \*\*responsive and readable without changing its information\*\*.

Do not remove important columns merely to make the design simpler.

Use horizontal scrolling if required, but make sure:

\*\*Name\*\* remains visible while the user scrolls horizontally.

The table should feel like a \*\*professional market-data table\*\*, not like the normal Zarai Mandi price cards.

Preserve:

• Green upward movement indicators
• Red downward movement indicators
• Numerical precision
• High/Low values
• Volume
• Open Interest
• Ask/Bid values where applicable

### Update Behavior

The Live Market data should be treated as a \*\*time-stamped external market update\*\*.

When a new update is received:

\*\*Update the table data + update the timestamp.\*\*

The user should always be able to see when the displayed market data was last updated.

Do not imply continuous real-time streaming unless the backend actually provides continuous updates.

### Important UX Boundary

Keep Live Market completely separate from:

\*\*Product → By-Product → Mandi → Rate Type → Market Comparison\*\*

Live Market is simply an additional Home-screen destination for the \*\*existing external market-data feed\*\*.

Do not add the Product/Mandi/location filtering system to Live Market.

The goal is:

\*\*Current customer receives Live Market screenshot → customer opens Live Market in Zarai Mandi → sees the same market information in an interactive, readable mobile table.\*\*

### Prototype Requirement

Create the complete clickable flow:

\*\*HOME → LIVE MARKET → LIVE MARKET DATA\*\*

Include realistic sample data based on the provided screenshot so the prototype demonstrates exactly how the external data will appear once connected to the database.

The design should be \*\*visually consistent with the existing Zarai Mandi app\*\*, but Live Market should retain the professional table-based appearance of the existing customer-facing market update rather than being converted into the normal Rates card system.