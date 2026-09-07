import re
import sys

with open('src/CustomerFaceApp.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add pakistanFlagImg import if not present
if 'import pakistanFlagImg' not in text:
    text = text.replace(
        'import agriForegroundImg from "./assets/agri_foreground.png";',
        'import agriForegroundImg from "./assets/agri_foreground.png";\nimport pakistanFlagImg from "./assets/pakistan_flag.png";'
    )
    print('Added pakistanFlagImg import')

# 2. Update RateCard
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

      {/* Prices: Single line with min and max separated by dash */}
      <div
        className="flex items-center justify-center px-2.5 py-1.5 rounded-xl my-1"
        style={{ background: "#F4FAF7", border: "1px solid #E5EBE8" }}
      >
        <span
          className="font-black text-xs sm:text-sm text-center tracking-tight truncate"
          style={{
            color: "#183B34",
            fontFamily:
              lang === "ur"
                ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                : "inherit",
          }}
        >
          {fmt(r.min)} - {fmt(r.max)}
        </span>
      </div>

      {/* Bottom Row: Non-clickable Rate Type Badge + Speaker Audio Button */}
      <div className="flex items-center gap-1.5 w-full pt-0.5">
        {/* Rate Type Badge (Display only, not clickable) */}
        <div
          className="flex-1 flex items-center justify-center gap-1 rounded-xl py-1.5 px-2 min-w-0 select-none"
          style={{
            background: "#E4F2EC",
            color: "#075E4F",
            border: "1.5px solid #2FAE68",
            fontSize: lang === "ur" ? 12 : 11,
            fontWeight: 800,
            cursor: "default",
            boxShadow: "0 1px 3px rgba(8,127,99,0.06)",
            fontFamily:
              lang === "ur"
                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                : "inherit",
          }}
        >
          <span style={{ fontSize: 11 }}>📊</span>
          <span className="truncate">
            {trL(r.rateType).replace(" ریٹ", "").replace(" Rate", "") + (lang === "ur" ? " ریٹ" : " Rate")}
          </span>
        </div>

        {/* Speaker Audio Button */}
        <button
          type="button"
          onClick={handleSpeakRate}
          className="tap-target flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition active:scale-90"
          style={{
            background: "#F4FAF7",
            color: "#087F63",
            border: "1.5px solid #D5E2DD",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
          title={lang === "ur" ? "ریٹ سنیں (آواز)" : "Listen to rate"}
        >
          <span style={{ fontSize: 13 }}>🔊</span>
        </button>
      </div>
    </div>
  );
}"""

rate_card_match = re.search(r'function RateCard\([\s\S]*?^}\n', text, re.MULTILINE)
if rate_card_match:
    text = text[:rate_card_match.start()] + new_rate_card + '\n' + text[rate_card_match.end():]
    print('Replaced RateCard')
else:
    print('RateCard regex match failed')

# 3. Update MultiLocSheet Pakistan Card & Province buttons
old_multi_pak_card = re.search(r'\{\/\* Quick Select: Whole Country[\s\S]*?\{\/\* Province Selection Box', text)
if old_multi_pak_card:
    new_multi_pak_card = """{/* Quick Select: Whole Country (All Pakistan) Card with Cultural Flag */}
          <div style={{ marginBottom: 12 }}>
            <button
              type="button"
              onClick={toggleWholeCountry}
              className="tap-target relative overflow-hidden w-full text-left"
              style={{
                padding: "13px 15px",
                borderRadius: 14,
                border: isWholeCountrySelected
                  ? "2px solid #087F63"
                  : "1.5px solid #D5E2DD",
                backgroundImage: `linear-gradient(${isWholeCountrySelected ? "rgba(6,77,64,0.85), rgba(8,127,99,0.9)" : "rgba(255,255,255,0.88), rgba(240,249,245,0.92)"}), url(${pakistanFlagImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: isWholeCountrySelected
                  ? "0 4px 14px rgba(8,127,99,0.25)"
                  : "0 2px 6px rgba(0,0,0,0.04)",
                transition: "all 0.15s",
              }}
            >
              <div className="relative z-10 flex items-center gap-3">
                <img
                  src={pakistanFlagImg}
                  alt="Pakistan Flag"
                  className="w-7 h-5 rounded object-cover shadow-sm border border-white/40"
                />
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: isWholeCountrySelected ? "#FFFFFF" : "#183B34",
                      fontFamily:
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit",
                    }}
                  >
                    {lang === "ur"
                      ? "پورا پاکستان"
                      : "All Pakistan"}
                  </div>
                </div>
              </div>

              <div
                className="relative z-10"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: isWholeCountrySelected
                    ? "2px solid #FFFFFF"
                    : "1.5px solid #C7D6D0",
                  background: isWholeCountrySelected ? "#FFFFFF" : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#087F63",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                {isWholeCountrySelected && "✓"}
              </div>
            </button>
          </div>

          {/* Province Selection Box """
    text = text[:old_multi_pak_card.start()] + new_multi_pak_card + text[old_multi_pak_card.end()-len('{/* Province Selection Box'):]
    print('Updated MultiLocSheet Whole Country card')
else:
    print('Could not find old_multi_pak_card')

# 4. Update DeepViewLocationSheet All Pakistan button & Province Cards
old_deep_pak = re.search(r'<button\s+onClick=\{\(\) => \{\s+onSelect\(\{ kind: "pakistan", label: "All Pakistan" \}\);[\s\S]*?<\/button>\s*<\/div>\s*\)}', text)
if old_deep_pak:
    new_deep_pak = """<button
                onClick={() => {
                  onSelect({ kind: "pakistan", label: "All Pakistan" });
                  onClose();
                }}
                className="tap-target relative overflow-hidden w-full rounded-2xl flex items-center justify-between px-4 text-left"
                style={{
                  height: 48,
                  backgroundImage: `linear-gradient(${current.kind === "pakistan" ? "rgba(6,77,64,0.85), rgba(8,127,99,0.9)" : "rgba(255,255,255,0.9), rgba(240,249,245,0.92)"}), url(${pakistanFlagImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: current.kind === "pakistan" ? "2px solid #087F63" : "1px solid #D5E2DD",
                  boxShadow: current.kind === "pakistan" ? "0 4px 14px rgba(8,127,99,0.25)" : "none",
                }}
              >
                <div className="relative z-10 flex items-center gap-3">
                  <img
                    src={pakistanFlagImg}
                    alt="Pakistan Flag"
                    className="w-7 h-5 rounded object-cover shadow-sm border border-white/40"
                  />
                  <span
                    className="font-black text-sm"
                    style={{
                      color: current.kind === "pakistan" ? "#FFFFFF" : "#075E4F",
                      fontFamily:
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit",
                    }}
                  >
                    {lang === "ur" ? "پورا پاکستان" : "All Pakistan"}
                  </span>
                </div>
                {current.kind === "pakistan" && (
                  <div className="relative z-10 w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#087F63] font-bold text-xs">
                    ✓
                  </div>
                )}
              </button>
            </div>
          )}"""
    text = text[:old_deep_pak.start()] + new_deep_pak + text[old_deep_pak.end():]
    print('Updated DeepViewLocationSheet All Pakistan button')
else:
    print('Could not find old_deep_pak')

# 5. Fix racetrack strip in ProductRatesScreen for smooth seamless looping across all 4 sides
old_racetrack = re.search(r'\{\/\* 9 stat tiles with Hand-Drawn Style 4-Sided Continuous Racetrack Border \*\/\}[\s\S]*?\{\/\* CENTER CONTENT: The 9 Rectangular Stat Cards Grid inside \*\/\}', text)
if old_racetrack:
    new_racetrack = """{/* 9 stat tiles with Hand-Drawn Style 4-Sided Continuous Racetrack Border */}
            {(() => {
              const activeMandiLabel =
                locScope.kind === "mandi"
                  ? locScope.label
                  : initialMandi || "Pakpattan Mandi";
              const activeMandiObj = INITIAL_MANDIS.find(
                (m) =>
                  m.name.toLowerCase() === activeMandiLabel.toLowerCase() ||
                  m.city.toLowerCase() === activeMandiLabel.toLowerCase() ||
                  activeMandiLabel.toLowerCase().includes(m.name.toLowerCase()) ||
                  activeMandiLabel.toLowerCase().includes(m.city.toLowerCase()),
              );
              const englishMandi = activeMandiObj
                ? activeMandiObj.name
                : activeMandiLabel.replace(" منڈی", " Mandi");
              const cleanMandiName =
                lang === "ur"
                  ? (tm(englishMandi).includes("منڈی") ? tm(englishMandi) : tm(englishMandi) + " منڈی")
                  : (englishMandi.includes("Mandi") ? englishMandi : englishMandi + " Mandi");

              const mandiProvince =
                locScope.kind === "province"
                  ? locScope.label
                  : activeMandiObj?.province || "Punjab";

              // Province-specific cultural styling and traditional gradient themes
              const PROVINCE_THEMES: Record<string, {
                gradientH: string;
                gradientV: string;
                borderColor: string;
                bulletColor: string;
                pattern: "phulkari" | "ajrak" | "khyber" | "baloch" | "pakistan";
              }> = {
                Punjab: {
                  gradientH: "linear-gradient(90deg, #033D31 0%, #087F63 50%, #033D31 100%)",
                  gradientV: "linear-gradient(180deg, #033D31 0%, #087F63 50%, #033D31 100%)",
                  borderColor: "#087F63",
                  bulletColor: "#FDE047",
                  pattern: "phulkari",
                },
                Sindh: {
                  gradientH: "linear-gradient(90deg, #072F3E 0%, #0E7490 50%, #072F3E 100%)",
                  gradientV: "linear-gradient(180deg, #072F3E 0%, #0E7490 50%, #072F3E 100%)",
                  borderColor: "#0E7490",
                  bulletColor: "#FDA4AF",
                  pattern: "ajrak",
                },
                KPK: {
                  gradientH: "linear-gradient(90deg, #103326 0%, #1F694F 50%, #103326 100%)",
                  gradientV: "linear-gradient(180deg, #103326 0%, #1F694F 50%, #103326 100%)",
                  borderColor: "#1F694F",
                  bulletColor: "#FCD34D",
                  pattern: "khyber",
                },
                Balochistan: {
                  gradientH: "linear-gradient(90deg, #381A03 0%, #78350F 50%, #381A03 100%)",
                  gradientV: "linear-gradient(180deg, #381A03 0%, #78350F 50%, #381A03 100%)",
                  borderColor: "#78350F",
                  bulletColor: "#FDBA74",
                  pattern: "baloch",
                },
                Pakistan: {
                  gradientH: "linear-gradient(90deg, #022c22 0%, #064e3b 50%, #022c22 100%)",
                  gradientV: "linear-gradient(180deg, #022c22 0%, #064e3b 50%, #022c22 100%)",
                  borderColor: "#059669",
                  bulletColor: "#34D399",
                  pattern: "pakistan",
                },
              };

              const pTheme =
                locScope.kind === "pakistan"
                  ? PROVINCE_THEMES.Pakistan
                  : PROVINCE_THEMES[mandiProvince] || PROVINCE_THEMES.Punjab;

              // Build the list of mandis for smooth seamless marquee without clipping
              let mandiNamesList: string[] = [];
              if (locScope.kind === "province" && LOCATIONS[locScope.label]) {
                const dists = LOCATIONS[locScope.label];
                const allMandis = Object.values(dists).flat();
                mandiNamesList = allMandis.map((m) => {
                  const clean = m.replace(/\\s*mandi$/i, "").replace(/\\s*منڈی$/i, "");
                  return lang === "ur" ? `${tm(clean)} منڈی` : `${clean} Mandi`;
                });
              } else if (locScope.kind === "pakistan") {
                const allMandis = Object.values(LOCATIONS).flatMap((dists) => Object.values(dists).flat());
                mandiNamesList = allMandis.slice(0, 10).map((m) => {
                  const clean = m.replace(/\\s*mandi$/i, "").replace(/\\s*منڈی$/i, "");
                  return lang === "ur" ? `${tm(clean)} منڈی` : `${clean} Mandi`;
                });
              } else {
                mandiNamesList = [cleanMandiName];
              }

              // Ensure at least 8 items per loop cycle
              let baseItems = mandiNamesList;
              while (baseItems.length < 8) {
                baseItems = [...baseItems, ...mandiNamesList];
              }

              return (
                <div
                  className="w-full rounded-3xl overflow-hidden mb-3 relative shadow-xl"
                  style={{
                    background: pTheme.gradientH,
                    border: `2px solid ${pTheme.borderColor}`,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                    padding: "24px 22px",
                  }}
                >
                  {/* Traditional Cultural Background Pattern Overlay */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <ProvincePatternSvg pattern={pTheme.pattern} opacity={0.32} />
                  </div>

                  {/* 1. TOP BORDER: Moving Left-to-Right (Clockwise) */}
                  <div
                    className="absolute top-0 left-0 right-0 overflow-hidden flex items-center z-10"
                    style={{
                      height: 24,
                      background: pTheme.gradientH,
                      color: "#FFFFFF",
                      borderBottom: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    <div
                      className="racetrack-track-l2r flex items-center font-black text-[11px] tracking-wide"
                      style={{
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                      }}
                    >
                      <div className="flex items-center gap-5 flex-shrink-0 pr-5">
                        {baseItems.map((name, i) => (
                          <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                            <span>{name}</span>
                            <span style={{ color: pTheme.bulletColor, fontSize: 9 }}>•</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-5 flex-shrink-0 pr-5">
                        {baseItems.map((name, i) => (
                          <span key={`dup-${i}`} className="flex items-center gap-2 whitespace-nowrap">
                            <span>{name}</span>
                            <span style={{ color: pTheme.bulletColor, fontSize: 9 }}>•</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 2. RIGHT BORDER: Moving Top-to-Bottom (Clockwise) */}
                  <div
                    className="absolute top-0 right-0 bottom-0 overflow-hidden z-10"
                    style={{
                      width: 22,
                      background: pTheme.gradientV,
                      color: "#FFFFFF",
                      borderLeft: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 800,
                        height: 22,
                        transformOrigin: "top left",
                        transform: "rotate(90deg) translateY(-22px)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="racetrack-track-l2r flex items-center font-black text-[10.5px] tracking-wide"
                        style={{
                          fontFamily:
                            lang === "ur"
                              ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                              : "inherit",
                        }}
                      >
                        <div className="flex items-center gap-5 flex-shrink-0 pr-5">
                          {baseItems.map((name, i) => (
                            <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                              <span>{name}</span>
                              <span style={{ color: pTheme.bulletColor, fontSize: 9 }}>•</span>
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-5 flex-shrink-0 pr-5">
                          {baseItems.map((name, i) => (
                            <span key={`dup-${i}`} className="flex items-center gap-2 whitespace-nowrap">
                              <span>{name}</span>
                              <span style={{ color: pTheme.bulletColor, fontSize: 9 }}>•</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. BOTTOM BORDER: Moving Right-to-Left (Clockwise) */}
                  <div
                    className="absolute bottom-0 left-0 right-0 overflow-hidden flex items-center z-10"
                    style={{
                      height: 24,
                      background: pTheme.gradientH,
                      color: "#FFFFFF",
                      borderTop: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    <div
                      className="racetrack-track-r2l flex items-center font-black text-[11px] tracking-wide"
                      style={{
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                      }}
                    >
                      <div className="flex items-center gap-5 flex-shrink-0 pr-5">
                        {baseItems.map((name, i) => (
                          <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                            <span>{name}</span>
                            <span style={{ color: pTheme.bulletColor, fontSize: 9 }}>•</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-5 flex-shrink-0 pr-5">
                        {baseItems.map((name, i) => (
                          <span key={`dup-${i}`} className="flex items-center gap-2 whitespace-nowrap">
                            <span>{name}</span>
                            <span style={{ color: pTheme.bulletColor, fontSize: 9 }}>•</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. LEFT BORDER: Moving Bottom-to-Top (Clockwise) */}
                  <div
                    className="absolute top-0 left-0 bottom-0 overflow-hidden z-10"
                    style={{
                      width: 22,
                      background: pTheme.gradientV,
                      color: "#FFFFFF",
                      borderRight: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 800,
                        height: 22,
                        transformOrigin: "top left",
                        transform: "rotate(90deg) translateY(-22px)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="racetrack-track-r2l flex items-center font-black text-[10.5px] tracking-wide"
                        style={{
                          fontFamily:
                            lang === "ur"
                              ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                              : "inherit",
                        }}
                      >
                        <div className="flex items-center gap-5 flex-shrink-0 pr-5">
                          {baseItems.map((name, i) => (
                            <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                              <span>{name}</span>
                              <span style={{ color: pTheme.bulletColor, fontSize: 9 }}>•</span>
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-5 flex-shrink-0 pr-5">
                          {baseItems.map((name, i) => (
                            <span key={`dup-${i}`} className="flex items-center gap-2 whitespace-nowrap">
                              <span>{name}</span>
                              <span style={{ color: pTheme.bulletColor, fontSize: 9 }}>•</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CENTER CONTENT: The 9 Rectangular Stat Cards Grid inside */}"""
    text = text[:old_racetrack.start()] + new_racetrack + text[old_racetrack.end()-len('{/* CENTER CONTENT: The 9 Rectangular Stat Cards Grid inside */}'):]
    print('Updated Racetrack Border')
else:
    print('Could not find old_racetrack')

with open('src/CustomerFaceApp.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Saved CustomerFaceApp.tsx successfully')
