import re

with open('src/CustomerFaceApp.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update RateCard: bigger prices, slightly smaller rate type badge
new_rate_card = """function RateCard({
  r,
  onClick,
  onPriceChipTap,
  onMandiChipTap,
  dateText,
  isToday = true,
  isFavorite = false,
  onToggleFavorite,
}: {
  r: RichRow;
  onClick: () => void;
  onPriceChipTap?: (rateType: string) => void;
  onMandiChipTap?: (mandiName: string) => void;
  dateText?: string;
  isToday?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}) {
  const { lang, tc: tcL, tm: tmL, tr: trL } = useLang();
  const vKey =
    r.vertical ||
    Object.entries(VERTICALS).find(([, vd]) => vd.products[r.product])?.[0] ||
    "Grains";
  const bg = VERTICAL_BG[vKey] || "#087F63";

  // Audio speech prompt on card
  const handleSpeakRate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const bp = tcL(r.byproduct || r.product);
    const m = tmL(r.mandiName);
    const speech =
      lang === "ur"
        ? `${bp}، ${m}۔ قیمت کم سے کم ${r.min.toLocaleString()}، زیادہ سے زیادہ ${r.max.toLocaleString()} روپے۔`
        : `${r.byproduct || r.product}, ${r.mandiName}. Min rate ${r.min.toLocaleString()}, Max rate ${r.max.toLocaleString()} rupees.`;
    speakText(speech);
  };

  // Strip 'Mandi' / 'منڈی' from city name for clean single line
  const rawMandi = tmL(r.mandiName);
  const cleanCity = rawMandi
    .replace(/\\s*mandi\\s*/gi, "")
    .replace(/\\s*منڈی\\s*/g, "")
    .trim() || rawMandi;
  const cleanBP = tcL(r.byproduct || r.product);
  const singleLineTitle = `${cleanBP} - ${cleanCity}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="card-mobile-interactive tap-target w-full rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between"
      style={{
        background: "#FFFFFF",
        border: "1.5px solid #E5EBE8",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        padding: "10px 9px",
        minHeight: 224,
      }}
    >
      {/* Top Row: Trend Pill on Left, Favorite Heart Button on Right */}
      <div className="flex items-center justify-between w-full">
        <TrendBadge trend={r.trend} pct={r.trendPct} compact />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className="tap-target w-8 h-8 rounded-full flex items-center justify-center transition active:scale-90"
          style={{
            background: isFavorite ? "#FFEBEB" : "#F4FAF7",
            color: isFavorite ? "#E11D48" : "#80918B",
            border: isFavorite ? "1.5px solid #FDA4AF" : "1.5px solid #D5E2DD",
            boxShadow: isFavorite ? "0 2px 6px rgba(225,29,72,0.18)" : "0 1px 3px rgba(0,0,0,0.04)",
          }}
          title={
            isFavorite
              ? lang === "ur"
                ? "پسندیدہ سے ہٹائیں"
                : "Remove from favorites"
              : lang === "ur"
                ? "پسندیدہ میں شامل کریں"
                : "Add to favorites"
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isFavorite ? "#E11D48" : "none"}
            stroke={isFavorite ? "#E11D48" : "currentColor"}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Center: Soft Mint Circle with Product Icon */}
      <div className="flex flex-col items-center justify-center my-1">
        <div
          className="rounded-full flex items-center justify-center shadow-inner"
          style={{
            width: 68,
            height: 68,
            background: "linear-gradient(135deg, #E4F2EC 0%, #D1EFE4 100%)",
            border: "1.5px solid #B8E2D1",
            boxShadow: "inset 0 2px 5px rgba(8,127,99,0.08), 0 2px 8px rgba(8,127,99,0.06)",
          }}
        >
          <ProductIcon
            name={r.byproduct || vKey}
            vertical={vKey}
            size={44}
          />
        </div>

        {/* Title: Mandi name with By-product name in SINGLE LINE */}
        <p
          className="font-black text-center mt-2 px-0.5 truncate w-full"
          style={{
            color: "#183B34",
            fontSize: lang === "ur" ? 16 : 13.5,
            lineHeight: 1.25,
            fontFamily:
              lang === "ur"
                ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                : "'Poppins', sans-serif",
          }}
          title={singleLineTitle}
        >
          {singleLineTitle}
        </p>
      </div>

      {/* Prices: Bigger & Bolder on Single Line separated by dash */}
      <div
        className="flex items-center justify-center px-2 py-1.5 rounded-xl my-1"
        style={{ background: "#F4FAF7", border: "1px solid #E5EBE8" }}
      >
        <span
          className="font-black text-center tracking-tight truncate"
          style={{
            color: "#183B34",
            fontSize: lang === "ur" ? 17 : 14.5,
            fontFamily:
              lang === "ur"
                ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                : "'Poppins', sans-serif",
          }}
        >
          {fmt(r.min)} - {fmt(r.max)}
        </span>
      </div>

      {/* Bottom Row: Slightly smaller Rate Type Badge + Speaker Audio Button */}
      <div className="flex items-center gap-1.5 w-full pt-0.5">
        {/* Rate Type Badge (Display only, not clickable) */}
        <div
          className="flex-1 flex items-center justify-center gap-1 rounded-lg py-1 px-1.5 min-w-0 select-none"
          style={{
            background: "#E4F2EC",
            color: "#075E4F",
            border: "1px solid #2FAE68",
            fontSize: lang === "ur" ? 11 : 9.5,
            fontWeight: 800,
            cursor: "default",
            boxShadow: "0 1px 2px rgba(8,127,99,0.05)",
            fontFamily:
              lang === "ur"
                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                : "inherit",
          }}
        >
          <span style={{ fontSize: 10 }}>📊</span>
          <span className="truncate">
            {trL(r.rateType).replace(" ریٹ", "").replace(" Rate", "") + (lang === "ur" ? " ریٹ" : " Rate")}
          </span>
        </div>

        {/* Speaker Audio Button */}
        <button
          type="button"
          onClick={handleSpeakRate}
          className="tap-target flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition active:scale-90"
          style={{
            background: "#F4FAF7",
            color: "#087F63",
            border: "1px solid #D5E2DD",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
          title={lang === "ur" ? "ریٹ سنیں (آواز)" : "Listen to rate"}
        >
          <span style={{ fontSize: 12 }}>🔊</span>
        </button>
      </div>
    </div>
  );
}"""

rate_card_match = re.search(r'function RateCard\([\s\S]*?^}\n', text, re.MULTILINE)
if rate_card_match:
    text = text[:rate_card_match.start()] + new_rate_card + '\n' + text[rate_card_match.end():]
    print('Updated RateCard font sizes')

# 2. Update MultiLocSheet Province Selector to show rich 2x2 cards with prominent cultural patterns
old_prov_tabs_header = text.find('{/* Province Tabs Header inside Box */}')
if old_prov_tabs_header != -1:
    end_prov_tabs_box = text.find('{/* Districts & Mandis inside Unified Box */}', old_prov_tabs_header)
    if end_prov_tabs_box != -1:
        new_prov_grid = """{/* Province Cultural Selector Cards in 2x2 Grid */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#52635F",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                }}
              >
                {lang === "ur" ? "صوبائی روایات اور منڈیاں" : "Select Province (Tradition & Mandis)"}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                {provinces.map((p) => {
                  const isCurrentTab = selectedProvince === p;
                  const isSelectedInDraft = isProvSelected(p);
                  const pConfig: Record<string, {
                    pattern: "phulkari" | "ajrak" | "khyber" | "baloch";
                    badge: string;
                    traditionUr: string;
                    traditionEn: string;
                    bgActive: string;
                    bgInactive: string;
                    borderActive: string;
                    borderInactive: string;
                    textActive: string;
                    textInactive: string;
                  }> = {
                    Punjab: {
                      pattern: "phulkari",
                      badge: "🌾",
                      traditionUr: "پھلکاری",
                      traditionEn: "Phulkari",
                      bgActive: "linear-gradient(135deg, #033D31 0%, #087F63 100%)",
                      bgInactive: "linear-gradient(135deg, #E6F6F0 0%, #D1EFE4 100%)",
                      borderActive: "#087F63",
                      borderInactive: "#B8E2D1",
                      textActive: "#FFFFFF",
                      textInactive: "#075E4F",
                    },
                    Sindh: {
                      pattern: "ajrak",
                      badge: "🏺",
                      traditionUr: "اجرک",
                      traditionEn: "Ajrak",
                      bgActive: "linear-gradient(135deg, #072F3E 0%, #0E7490 100%)",
                      bgInactive: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
                      borderActive: "#0E7490",
                      borderInactive: "#7DD3FC",
                      textActive: "#FFFFFF",
                      textInactive: "#0C4A6E",
                    },
                    KPK: {
                      pattern: "khyber",
                      badge: "🏔️",
                      traditionUr: "خیبر",
                      traditionEn: "Khyber",
                      bgActive: "linear-gradient(135deg, #103326 0%, #1F694F 100%)",
                      bgInactive: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                      borderActive: "#1F694F",
                      borderInactive: "#A7F3D0",
                      textActive: "#FFFFFF",
                      textInactive: "#064E3B",
                    },
                    Balochistan: {
                      pattern: "baloch",
                      badge: "✨",
                      traditionUr: "بلوچی کڑھائی",
                      traditionEn: "Balochi",
                      bgActive: "linear-gradient(135deg, #381A03 0%, #78350F 100%)",
                      bgInactive: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                      borderActive: "#78350F",
                      borderInactive: "#FDE68A",
                      textActive: "#FFFFFF",
                      textInactive: "#78350F",
                    },
                  };

                  const cfg = pConfig[p] || pConfig.Punjab;
                  const active = isSelectedInDraft || isCurrentTab;

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleProvince(p)}
                      className="tap-target relative overflow-hidden rounded-xl p-2.5 flex flex-col justify-between text-left transition active:scale-[0.98] shadow-sm"
                      style={{
                        background: active ? cfg.bgActive : cfg.bgInactive,
                        border: `1.5px solid ${active ? cfg.borderActive : cfg.borderInactive}`,
                        minHeight: 62,
                        cursor: "pointer",
                      }}
                    >
                      {/* Rich Traditional Cultural SVG Pattern with Enhanced Visibility */}
                      <div className="absolute inset-0 pointer-events-none z-0">
                        <ProvincePatternSvg pattern={cfg.pattern} opacity={active ? 0.45 : 0.35} />
                      </div>

                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="text-base">{cfg.badge}</span>
                        {isSelectedInDraft && (
                          <span
                            className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                            style={{
                              background: active ? "#FFFFFF" : "#087F63",
                              color: active ? "#087F63" : "#FFFFFF",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="relative z-10 mt-1">
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 900,
                            color: active ? cfg.textActive : cfg.textInactive,
                            fontFamily:
                              lang === "ur"
                                ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                                : "inherit",
                            lineHeight: 1.15,
                          }}
                        >
                          {tmL(p)}
                        </div>
                        <div
                          style={{
                            fontSize: 9.5,
                            fontWeight: 700,
                            color: active ? cfg.textActive : cfg.textInactive,
                            opacity: 0.85,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {lang === "ur" ? cfg.traditionUr : cfg.traditionEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ height: 1, background: "#E8EFEC" }} />

            """
        text = text[:old_prov_tabs_header] + new_prov_grid + text[end_prov_tabs_box:]
        print('Updated MultiLocSheet with 2x2 Province Cultural Cards')

# 3. Update Table Expand behavior in ProductRatesScreen (Same page, inline expansion)
old_table_container = re.search(r'<div\s+className=\{isTableExpanded \? "fixed inset-0 z-50 overflow-hidden flex flex-col bg-\[#F4FAF7\] p-3 shadow-2xl" : "rounded-2xl overflow-hidden"\}\s+style=\{\{\s+border: isTableExpanded \? "none" : "1.5px solid #D5E2DD",\s+background: "#F4FAF7",\s+\}\}>', text)
if old_table_container:
    new_table_container = """<div
                  className="rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-sm"
                  style={{
                    border: "1.5px solid #D5E2DD",
                    background: "#F4FAF7",
                  }}>"""
    text = text[:old_table_container.start()] + new_table_container + text[old_table_container.end():]
    print('Updated Table container to stay inline on the same page')

# Update table body maxHeight when expanded vs collapsed
old_tbody = re.search(r'{\/\* Scrollable table body — keeps the deep-view card compact \*\/}\s*<div\s+className="flex flex-col overflow-y-auto"\s+style=\{\{\s+maxHeight:\s*300,', text)
if old_tbody:
    new_tbody = """{/* Scrollable table body — keeps the deep-view card compact */}
                  <div
                    className="flex flex-col overflow-y-auto"
                    style={{
                      maxHeight: isTableExpanded ? 460 : 200,
                      scrollbarWidth: "thin",
                      scrollbarColor: "#A9CFC2 transparent",
                    }}"""
    text = text[:old_tbody.start()] + new_tbody + text[old_tbody.end():]
    print('Updated Table scrollable body height for inline expand/collapse')

with open('src/CustomerFaceApp.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Saved CustomerFaceApp.tsx')
