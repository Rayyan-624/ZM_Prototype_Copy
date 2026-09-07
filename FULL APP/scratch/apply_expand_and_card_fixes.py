import re

with open('src/CustomerFaceApp.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update RateCard
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
        padding: "11px 10px",
        minHeight: 228,
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

      {/* Center: Bigger Icon Floating Cleanly Without Colored Box Background */}
      <div className="flex flex-col items-center justify-center my-1.5">
        <div className="flex items-center justify-center py-1">
          <ProductIcon
            name={r.byproduct || vKey}
            vertical={vKey}
            size={60}
          />
        </div>

        {/* Title: Mandi name with By-product name in SINGLE LINE */}
        <p
          className="font-black text-center mt-1 px-0.5 truncate w-full"
          style={{
            color: "#183B34",
            fontSize: lang === "ur" ? 16.5 : 14,
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

      {/* Prices: Clean Side-by-Side with Price on Top and Min/Max Label Below */}
      <div
        className="flex items-center justify-between px-2 py-1.5 rounded-xl my-1"
        style={{ background: "#F4FAF7", border: "1px solid #E5EBE8" }}
      >
        {/* Min */}
        <div className="flex flex-col items-center flex-1">
          <span
            className="font-black leading-tight tracking-tight text-center"
            style={{
              color: "#183B34",
              fontSize: lang === "ur" ? 17 : 14.5,
              fontFamily:
                lang === "ur"
                  ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                  : "'Poppins', sans-serif",
            }}
          >
            {fmt(r.min)}
          </span>
          <span
            className="text-[9px] font-semibold tracking-tight text-[#80918B] mt-0.5"
            style={{
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            {lang === "ur" ? "کم سے کم (۴۰ کلو)" : "Min (40 KG)"}
          </span>
        </div>

        <div className="w-[1px] h-6 bg-[#D5E2DD]" />

        {/* Max */}
        <div className="flex flex-col items-center flex-1">
          <span
            className="font-black leading-tight tracking-tight text-center"
            style={{
              color: "#183B34",
              fontSize: lang === "ur" ? 17 : 14.5,
              fontFamily:
                lang === "ur"
                  ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                  : "'Poppins', sans-serif",
            }}
          >
            {fmt(r.max)}
          </span>
          <span
            className="text-[9px] font-semibold tracking-tight text-[#80918B] mt-0.5"
            style={{
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            {lang === "ur" ? "زیادہ سے زیادہ (۴۰ کلو)" : "Max (40 KG)"}
          </span>
        </div>
      </div>

      {/* Bottom Row: Compact Rate Type Badge + Speaker Audio Button */}
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
    print('Updated RateCard without circle background and side-by-side labeled prices')

# 2. Update MultiLocSheet Province Cards: Remove emojis and keep only Province Name & Tradition Name
old_prov_grid_start = text.find('{/* Province Cultural Selector Cards in 2x2 Grid */}')
if old_prov_grid_start != -1:
    end_prov_grid = text.find('{/* Districts & Mandis inside Unified Box */}', old_prov_grid_start)
    if end_prov_grid != -1:
        new_prov_grid_clean = """{/* Province Cultural Selector Cards in 2x2 Grid (No Emojis, Pure Cultural Identity) */}
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
                {lang === "ur" ? "صوبہ اور روایت منتخب کریں" : "Select Province (Tradition & Region)"}
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
                      traditionUr: "روایت: پھلکاری",
                      traditionEn: "Tradition: Phulkari",
                      bgActive: "linear-gradient(135deg, #033D31 0%, #087F63 100%)",
                      bgInactive: "linear-gradient(135deg, #E6F6F0 0%, #D1EFE4 100%)",
                      borderActive: "#087F63",
                      borderInactive: "#B8E2D1",
                      textActive: "#FFFFFF",
                      textInactive: "#075E4F",
                    },
                    Sindh: {
                      pattern: "ajrak",
                      traditionUr: "روایت: اجرک",
                      traditionEn: "Tradition: Ajrak",
                      bgActive: "linear-gradient(135deg, #072F3E 0%, #0E7490 100%)",
                      bgInactive: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
                      borderActive: "#0E7490",
                      borderInactive: "#7DD3FC",
                      textActive: "#FFFFFF",
                      textInactive: "#0C4A6E",
                    },
                    KPK: {
                      pattern: "khyber",
                      traditionUr: "روایت: خیبر",
                      traditionEn: "Tradition: Khyber",
                      bgActive: "linear-gradient(135deg, #103326 0%, #1F694F 100%)",
                      bgInactive: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                      borderActive: "#1F694F",
                      borderInactive: "#A7F3D0",
                      textActive: "#FFFFFF",
                      textInactive: "#064E3B",
                    },
                    Balochistan: {
                      pattern: "baloch",
                      traditionUr: "روایت: بلوچی کڑھائی",
                      traditionEn: "Tradition: Balochi",
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
                      className="tap-target relative overflow-hidden rounded-xl p-3 flex flex-col justify-between text-left transition active:scale-[0.98] shadow-sm"
                      style={{
                        background: active ? cfg.bgActive : cfg.bgInactive,
                        border: `1.5px solid ${active ? cfg.borderActive : cfg.borderInactive}`,
                        minHeight: 64,
                        cursor: "pointer",
                      }}
                    >
                      {/* Rich Traditional Cultural SVG Pattern with Enhanced Visibility */}
                      <div className="absolute inset-0 pointer-events-none z-0">
                        <ProvincePatternSvg pattern={cfg.pattern} opacity={active ? 0.45 : 0.35} />
                      </div>

                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 900,
                            color: active ? cfg.textActive : cfg.textInactive,
                            fontFamily:
                              lang === "ur"
                                ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                                : "inherit",
                          }}
                        >
                          {tmL(p)}
                        </span>
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
                            fontSize: 10,
                            fontWeight: 700,
                            color: active ? cfg.textActive : cfg.textInactive,
                            opacity: 0.9,
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
        text = text[:old_prov_grid_start] + new_prov_grid_clean + text[end_prov_grid:]
        print('Updated MultiLocSheet province cards without emojis')

# 3. Update Table Expand to open from the bottom taking 75% height of the screen with scrollable content
old_table_section_match = re.search(r'return\s*\(\s*<div\s+className="rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-sm"[\s\S]*?{/\* Comparison summary strip', text)
if old_table_section_match:
    print('Found inline table section, updating to bottom 75% expand sheet')

table_div_start = text.find('return (\n                <div\n                  className="rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-sm"')
if table_div_start != -1:
    new_table_jsx = """return (
                <>
                  {/* Backdrop overlay when expanded to 75% from bottom */}
                  {isTableExpanded && (
                    <div
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity"
                      onClick={() => setIsTableExpanded(false)}
                    />
                  )}

                  <div
                    className={
                      isTableExpanded
                        ? "fixed bottom-0 left-0 right-0 z-50 h-[75vh] flex flex-col rounded-t-[28px] bg-[#F4FAF7] shadow-2xl border-t border-[#D5E2DD] overflow-hidden transition-all duration-300"
                        : "rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-sm"
                    }
                    style={{
                      border: isTableExpanded ? "none" : "1.5px solid #D5E2DD",
                      background: "#F4FAF7",
                    }}
                  >
                    {/* Top Drag Handle on 75% Bottom Sheet */}
                    {isTableExpanded && (
                      <div className="w-10 h-1 rounded-full mx-auto mt-2.5 mb-0.5 bg-[#C7D6D0] flex-shrink-0" />
                    )}"""
    old_slice = text[table_div_start:table_div_start+len('return (\n                <div\n                  className="rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-sm"\n                  style={{\n                    border: "1.5px solid #D5E2DD",\n                    background: "#F4FAF7",\n                  }}\n                >')]
    text = text.replace(old_slice, new_table_jsx, 1)
    print('Replaced table container with bottom 75% sheet')

# Update table body maxHeight when expanded
text = text.replace(
    'maxHeight: isTableExpanded ? 460 : 200,',
    'maxHeight: isTableExpanded ? "calc(75vh - 160px)" : 200,\n                      flex: isTableExpanded ? "1 1 auto" : "none",',
    1
)
print('Updated table body max height')

# Wrap return closing
text = text.replace(
    '                  {/* Expand/Collapse Footer Toggle */}',
    '</>\n                  {/* Expand/Collapse Footer Toggle */}',
    1
) if '</>\n                  {/* Expand/Collapse Footer Toggle */}' not in text else text

with open('src/CustomerFaceApp.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Saved CustomerFaceApp.tsx')
