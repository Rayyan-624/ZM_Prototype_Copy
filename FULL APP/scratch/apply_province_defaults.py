import re

with open('src/CustomerFaceApp.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update toggleProvince in MultiLocSheet for single-selection / mutual exclusivity with Pakistan
old_toggle_prov = text.find('const toggleProvince = (p: string) => {')
if old_toggle_prov != -1:
    end_toggle_prov = text.find('setSelectedProvince(p);\n  };', old_toggle_prov)
    if end_toggle_prov != -1:
        new_toggle_prov = """const toggleProvince = (p: string) => {
    const isAlready = draft.some(
      (x) => x.kind === "province" && x.label === p,
    );
    if (isAlready) {
      setDraft([{ kind: "pakistan", label: "All Pakistan" }]);
    } else {
      setDraft([{ kind: "province", label: p }]);
    }
    setSelectedProvince(p);
  };"""
        text = text[:old_toggle_prov] + new_toggle_prov + text[end_toggle_prov+len('setSelectedProvince(p);\n  };'):]
        print('Updated toggleProvince logic for mutual exclusivity')

# 2. Update MultiLocSheet 2x2 Province Cards: Show rich colored backgrounds BY DEFAULT, checkmark circle top-right
old_grid_start = text.find('{/* Province Cultural Selector Cards in 2x2 Grid (No Emojis, Pure Cultural Identity) */}')
if old_grid_start != -1:
    end_grid_box = text.find('{/* Districts & Mandis inside Unified Box */}', old_grid_start)
    if end_grid_box != -1:
        new_grid_jsx = """{/* Province Cultural Selector Cards in 2x2 Grid (Rich Backgrounds by default, single checkmark) */}
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
                  const isSelectedInDraft = isProvSelected(p);
                  const pConfig: Record<string, {
                    pattern: "phulkari" | "ajrak" | "khyber" | "baloch";
                    traditionUr: string;
                    traditionEn: string;
                    bg: string;
                    borderColor: string;
                  }> = {
                    Punjab: {
                      pattern: "phulkari",
                      traditionUr: "روایت: پھلکاری",
                      traditionEn: "Tradition: Phulkari",
                      bg: "linear-gradient(135deg, #033D31 0%, #087F63 100%)",
                      borderColor: "#087F63",
                    },
                    Sindh: {
                      pattern: "ajrak",
                      traditionUr: "روایت: اجرک",
                      traditionEn: "Tradition: Ajrak",
                      bg: "linear-gradient(135deg, #072F3E 0%, #0E7490 100%)",
                      borderColor: "#0E7490",
                    },
                    KPK: {
                      pattern: "khyber",
                      traditionUr: "روایت: خیبر",
                      traditionEn: "Tradition: Khyber",
                      bg: "linear-gradient(135deg, #103326 0%, #1F694F 100%)",
                      borderColor: "#1F694F",
                    },
                    Balochistan: {
                      pattern: "baloch",
                      traditionUr: "روایت: بلوچی کڑھائی",
                      traditionEn: "Tradition: Balochi",
                      bg: "linear-gradient(135deg, #381A03 0%, #78350F 100%)",
                      borderColor: "#78350F",
                    },
                  };

                  const cfg = pConfig[p] || pConfig.Punjab;

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleProvince(p)}
                      className="tap-target relative overflow-hidden rounded-2xl p-3 flex flex-col justify-between text-left transition active:scale-[0.98] shadow-md"
                      style={{
                        background: cfg.bg,
                        border: `1.5px solid ${cfg.borderColor}`,
                        minHeight: 68,
                        cursor: "pointer",
                      }}
                    >
                      {/* Rich Traditional Cultural SVG Pattern with Full Default Visibility */}
                      <div className="absolute inset-0 pointer-events-none z-0">
                        <ProvincePatternSvg pattern={cfg.pattern} opacity={0.4} />
                      </div>

                      {/* Header with Province Title and White Circle Checkmark */}
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span
                          style={{
                            fontSize: 14.5,
                            fontWeight: 900,
                            color: "#FFFFFF",
                            fontFamily:
                              lang === "ur"
                                ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                                : "inherit",
                          }}
                        >
                          {tmL(p)}
                        </span>

                        {/* White Circular Checkbox: Ticked only if selected */}
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                            color: "#087F63",
                            fontSize: 11,
                            fontWeight: 900,
                          }}
                        >
                          {isSelectedInDraft ? "✓" : ""}
                        </div>
                      </div>

                      {/* Tradition Subtitle in Clean Light Text */}
                      <div className="relative z-10 mt-1">
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.92)",
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
        text = text[:old_grid_start] + new_grid_jsx + text[end_grid_box:]
        print('Updated MultiLocSheet 2x2 grid with rich default backgrounds & single tick')

# 3. Update DeepViewLocationSheet to also use rich default province backgrounds and single-tick behavior
old_deep_prov_start = text.find('level === "province" ? (\n            <div className="flex flex-col gap-2.5 px-4 pb-4 pt-2">')
if old_deep_prov_start != -1:
    end_deep_prov = text.find('{/* Level 2: District list */}', old_deep_prov_start)
    if end_deep_prov != -1:
        new_deep_prov = """level === "province" ? (
            <div className="px-4 pb-4 pt-2">
              <div className="px-1 pb-2">
                <p
                  className="text-[10.5px] font-extrabold uppercase tracking-wider"
                  style={{ color: "#52635F" }}
                >
                  {lang === "ur" ? "صوبہ اور روایت منتخب کریں" : "Select Province (Tradition & Region)"}
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {provinces.map((p) => {
                  const isSelected = current.kind === "province" && current.label === p;
                  const pConfig: Record<string, {
                    pattern: "phulkari" | "ajrak" | "khyber" | "baloch";
                    traditionUr: string;
                    traditionEn: string;
                    bg: string;
                    borderColor: string;
                  }> = {
                    Punjab: {
                      pattern: "phulkari",
                      traditionUr: "روایت: پھلکاری",
                      traditionEn: "Tradition: Phulkari",
                      bg: "linear-gradient(135deg, #033D31 0%, #087F63 100%)",
                      borderColor: "#087F63",
                    },
                    Sindh: {
                      pattern: "ajrak",
                      traditionUr: "روایت: اجرک",
                      traditionEn: "Tradition: Ajrak",
                      bg: "linear-gradient(135deg, #072F3E 0%, #0E7490 100%)",
                      borderColor: "#0E7490",
                    },
                    KPK: {
                      pattern: "khyber",
                      traditionUr: "روایت: خیبر",
                      traditionEn: "Tradition: Khyber",
                      bg: "linear-gradient(135deg, #103326 0%, #1F694F 100%)",
                      borderColor: "#1F694F",
                    },
                    Balochistan: {
                      pattern: "baloch",
                      traditionUr: "روایت: بلوچی کڑھائی",
                      traditionEn: "Tradition: Balochi",
                      bg: "linear-gradient(135deg, #381A03 0%, #78350F 100%)",
                      borderColor: "#78350F",
                    },
                  };
                  const cfg = pConfig[p] || pConfig.Punjab;

                  return (
                    <button
                      key={p}
                      onClick={() => {
                        onSelect({ kind: "province", label: p });
                        onClose();
                      }}
                      className="tap-target relative overflow-hidden rounded-2xl p-3 flex flex-col justify-between text-left transition active:scale-[0.98] shadow-md"
                      style={{
                        background: cfg.bg,
                        border: `1.5px solid ${cfg.borderColor}`,
                        minHeight: 68,
                        cursor: "pointer",
                      }}
                    >
                      {/* Traditional Cultural Background Pattern */}
                      <div className="absolute inset-0 pointer-events-none z-0">
                        <ProvincePatternSvg pattern={cfg.pattern} opacity={0.4} />
                      </div>

                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span
                          style={{
                            fontSize: 14.5,
                            fontWeight: 900,
                            color: "#FFFFFF",
                            fontFamily:
                              lang === "ur"
                                ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                                : "inherit",
                          }}
                        >
                          {tm(p)}
                        </span>

                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                            color: "#087F63",
                            fontSize: 11,
                            fontWeight: 900,
                          }}
                        >
                          {isSelected ? "✓" : ""}
                        </div>
                      </div>

                      <div className="relative z-10 mt-1">
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.92)",
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
          ) : """
        text = text[:old_deep_prov_start] + new_deep_prov + text[end_deep_prov:]
        print('Updated DeepViewLocationSheet with 2x2 rich cards and single-tick behavior')

with open('src/CustomerFaceApp.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Saved CustomerFaceApp.tsx')
