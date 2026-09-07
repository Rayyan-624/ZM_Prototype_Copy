import re

with open('src/CustomerFaceApp.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update MultiLocSheet Whole Country card & province buttons
multi_loc_target = """          {/* Quick Select: Whole Country (All Pakistan) Card with Cultural Flag */}
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
                  fontWeight: 900,
                }}
              >
                {isWholeCountrySelected ? "✓" : ""}
              </div>
            </button>
          </div>"""

# Replace the quick select part in MultiLocSheet
old_multi_box = text.find('{/* Quick Select: Whole Country (All Pakistan) Card with Cultural Flag */}')
if old_multi_box != -1:
    end_multi_box = text.find('{/* Unified Container Box for Province Tabs & Mandis/Districts */}', old_multi_box)
    if end_multi_box != -1:
        text = text[:old_multi_box] + multi_loc_target + '\n\n          ' + text[end_multi_box:]
        print('Replaced MultiLocSheet Pakistan Card')

# Update province tabs in MultiLocSheet to include ProvincePatternSvg
prov_tabs_search = text.find('{provinces.map((p) => {')
if prov_tabs_search != -1:
    end_prov_tabs = text.find('</div>\n            </div>\n\n            <div style={{ height: 1', prov_tabs_search)
    if end_prov_tabs != -1:
        new_prov_tabs = """{provinces.map((p) => {
                  const isCurrentTab = selectedProvince === p;
                  const isSelectedInDraft = isProvSelected(p);
                  const pPattern: "phulkari" | "ajrak" | "khyber" | "baloch" =
                    p === "Sindh" ? "ajrak" : p === "KPK" ? "khyber" : p === "Balochistan" ? "baloch" : "phulkari";
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleProvince(p)}
                      className="tap-target relative overflow-hidden px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5"
                      style={{
                        background:
                          isSelectedInDraft || isCurrentTab
                            ? "#087F63"
                            : "#F4FAF7",
                        color:
                          isSelectedInDraft || isCurrentTab
                            ? "#fff"
                            : "#183B34",
                        border:
                          isSelectedInDraft || isCurrentTab
                            ? "1.5px solid #087F63"
                            : "1.5px solid #D5E2DD",
                        boxShadow:
                          isSelectedInDraft || isCurrentTab
                            ? "0 2px 8px rgba(8,127,99,0.2)"
                            : "none",
                      }}
                    >
                      <div className="absolute inset-0 pointer-events-none opacity-25">
                        <ProvincePatternSvg pattern={pPattern} opacity={isSelectedInDraft || isCurrentTab ? 0.4 : 0.25} />
                      </div>
                      <span className="relative z-10">{tmL(p)}</span>
                      {isSelectedInDraft && <span className="relative z-10">✓</span>}
                    </button>
                  );
                })}"""
        text = text[:prov_tabs_search] + new_prov_tabs + text[end_prov_tabs:]
        print('Updated Province Tabs with Cultural Patterns in MultiLocSheet')

# Update LocationSheet province buttons with cultural patterns
old_loc_provs = text.find('{!province &&\n            Object.keys(LOCATIONS).map((p) => (')
if old_loc_provs != -1:
    end_loc_provs = text.find('{province &&\n            !district &&', old_loc_provs)
    if end_loc_provs != -1:
        new_loc_provs = """{!province &&
            Object.keys(LOCATIONS).map((p) => {
              const pPattern: "phulkari" | "ajrak" | "khyber" | "baloch" =
                p === "Sindh" ? "ajrak" : p === "KPK" ? "khyber" : p === "Balochistan" ? "baloch" : "phulkari";
              return (
                <button
                  key={p}
                  onClick={() => setProvince(p)}
                  className="tap-target relative overflow-hidden rounded-2xl px-4 flex items-center justify-between"
                  style={{
                    background: "#F1F7F4",
                    border: "1px solid #D5E2DD",
                    minHeight: 52,
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none opacity-25">
                    <ProvincePatternSvg pattern={pPattern} opacity={0.3} />
                  </div>
                  <span className="relative z-10 font-bold text-base">{p}</span>
                  <span className="relative z-10" style={{ color: "#52635F" }}>›</span>
                </button>
              );
            })}
          """
        text = text[:old_loc_provs] + new_loc_provs + text[end_loc_provs:]
        print('Updated LocationSheet Province buttons with Cultural Patterns')

with open('src/CustomerFaceApp.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Saved CustomerFaceApp.tsx')
