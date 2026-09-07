import re

with open('src/CustomerFaceApp.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add flex-shrink-0 and mb-6 to the overview racetrack card
old_racetrack_tag = 'className="w-full rounded-3xl overflow-hidden mb-3 relative shadow-xl"'
new_racetrack_tag = 'className="w-full rounded-3xl overflow-hidden mb-6 relative shadow-xl flex-shrink-0"'
if old_racetrack_tag in text:
    text = text.replace(old_racetrack_tag, new_racetrack_tag, 1)
    print('Added flex-shrink-0 and mb-6 to Racetrack container')

# 2. Update table to display 2-3 rows by default unless expanded
# Find where tableRows is filtered and mapped
table_code_search = text.find('const tableRows = tableSourceRows.filter(')
if table_code_search != -1:
    # Add visibleTableRows definition
    end_filter = text.find('const BASE_DATE = new Date(2026, 7, 21);', table_code_search)
    if end_filter != -1:
        text = text[:end_filter] + 'const visibleTableRows = isTableExpanded ? tableRows : tableRows.slice(0, 3);\n              ' + text[end_filter:]
        print('Added visibleTableRows')

# Replace tableRows.map with visibleTableRows.map in the table render
table_map_search = text.find('{tableRows.map((r, ci) => {')
if table_map_search != -1:
    text = text.replace('{tableRows.map((r, ci) => {', '{visibleTableRows.map((r, ci) => {', 1)
    print('Replaced tableRows.map with visibleTableRows.map')

# Add expand/collapse footer button if table has more than 3 rows and not expanded
table_end_map = text.find('                  </div>\n\n                  {/* Comparison summary strip', table_map_search)
if table_end_map != -1:
    footer_expand = """                  </div>

                  {/* Expand/Collapse Footer Toggle */}
                  {tableRows.length > 3 && !isTableExpanded && (
                    <button
                      type="button"
                      onClick={() => setIsTableExpanded(true)}
                      className="tap-target w-full py-2.5 px-4 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition hover:bg-[#E4F2EC]"
                      style={{
                        background: "#F1F7F4",
                        borderTop: "1px solid #E8EFEC",
                        color: "#087F63",
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                        fontSize: lang === "ur" ? 14 : 11.5,
                      }}
                    >
                      <span>
                        {lang === "ur"
                          ? `تمام ${tableRows.length} منڈیاں دیکھیں (${tableRows.length - 3} مزید)`
                          : `View all ${tableRows.length} mandis (${tableRows.length - 3} more)`}
                      </span>
                      <span>▾</span>
                    </button>
                  )}
                  {tableRows.length > 3 && isTableExpanded && (
                    <button
                      type="button"
                      onClick={() => setIsTableExpanded(false)}
                      className="tap-target w-full py-2 px-4 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition hover:bg-[#E4F2EC]"
                      style={{
                        background: "#F1F7F4",
                        borderTop: "1px solid #E8EFEC",
                        color: "#087F63",
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                        fontSize: lang === "ur" ? 14 : 11.5,
                      }}
                    >
                      <span>
                        {lang === "ur"
                          ? "کم منڈیاں دکھائیں (3 منڈیاں)"
                          : "Show less (3 mandis)"}
                      </span>
                      <span>▴</span>
                    </button>
                  )}"""
    text = text[:table_end_map] + footer_expand + text[table_end_map+len('                  </div>'):]
    print('Added Expand/Collapse Footer Toggle')

with open('src/CustomerFaceApp.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Saved CustomerFaceApp.tsx')
