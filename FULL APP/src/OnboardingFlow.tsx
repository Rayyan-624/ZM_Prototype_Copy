import { useState, useRef, useEffect } from "react"
import logoImg from "@/imports/zmlogodark-removebg-preview.png"

// ─── Product Icons ─────────────────────────────────────────────────────────────
import cotton200 from "./cotton200.png"
import dates200 from "./dates200.png"
import dryfruits200 from "./dryfruits200.png"
import edible200 from "./edible200.png"
import fertilizers200 from "./fertilizers200.png"
import fruits200 from "./fruits200.png"
import herbals200 from "./herbals200.png"
import maize200 from "./maize200.png"
import millet200 from "./millet200.png"
import mustard200 from "./mustard200.png"
import paddy200 from "./paddy200.png"
import pulses200 from "./pulses200.png"
import rice200 from "./rice200.png"
import sesame200 from "./sesame200.png"
import spices200 from "./spices200.png"
import sugar200 from "./sugar200.png"
import vegetables200 from "./vegetables200.png"
import wheat200 from "./wheat200.png"
import kiryana200 from "./kiryana200.png"
import livestock200 from "./livestock200.png"
import livemarket200 from "./livemarket200.png"

// Maps each product id used in PRODUCTS / REP_PRODUCTS to its icon
const ICONS: Record<string, string> = {
  wheat: wheat200,
  rice: rice200,
  cotton: cotton200,
  maize: maize200,
  sugar: sugar200,
  pulses: pulses200,
  mustard: mustard200,
  sesame: sesame200,
  millet: millet200,
  paddy: paddy200,
  dates: dates200,
  spices: spices200,
  dryfruit: dryfruits200,
  livemarket: livemarket200,
  fruits: fruits200,
  vegetables: vegetables200,
  livestock: livestock200,
  fertilizer: fertilizers200,
  edibleoil: edible200,
  kiryana: kiryana200,
  herbs: herbals200,
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "lang" | "role" | "account" | "otp" | "interests" | "location" | "subscription" | "payment" | "loading" | "dashboard"
type Role = "customer" | "representative"

// ─── Data ─────────────────────────────────────────────────────────────────────
const CITIES: { city: string; district: string; province: string }[] = [
  { city: "Lahore", district: "Lahore", province: "Punjab" },
  { city: "Faisalabad", district: "Faisalabad", province: "Punjab" },
  { city: "Rawalpindi", district: "Rawalpindi", province: "Punjab" },
  { city: "Multan", district: "Multan", province: "Punjab" },
  { city: "Gujranwala", district: "Gujranwala", province: "Punjab" },
  { city: "Sialkot", district: "Sialkot", province: "Punjab" },
  { city: "Bahawalpur", district: "Bahawalpur", province: "Punjab" },
  { city: "Okara", district: "Okara", province: "Punjab" },
  { city: "Sahiwal", district: "Sahiwal", province: "Punjab" },
  { city: "Sargodha", district: "Sargodha", province: "Punjab" },
  { city: "Sheikhupura", district: "Sheikhupura", province: "Punjab" },
  { city: "Rahim Yar Khan", district: "Rahim Yar Khan", province: "Punjab" },
  { city: "Jhang", district: "Jhang", province: "Punjab" },
  { city: "Gujrat", district: "Gujrat", province: "Punjab" },
  { city: "Kasur", district: "Kasur", province: "Punjab" },
  { city: "Chiniot", district: "Chiniot", province: "Punjab" },
  { city: "Khanewal", district: "Khanewal", province: "Punjab" },
  { city: "Mandi Bahauddin", district: "Mandi Bahauddin", province: "Punjab" },
  { city: "Pakpattan", district: "Pakpattan", province: "Punjab" },
  { city: "Vehari", district: "Vehari", province: "Punjab" },
  { city: "Muzaffargarh", district: "Muzaffargarh", province: "Punjab" },
  { city: "Lodhran", district: "Lodhran", province: "Punjab" },
  { city: "Chakwal", district: "Chakwal", province: "Punjab" },
  { city: "Attock", district: "Attock", province: "Punjab" },
  { city: "Jhelum", district: "Jhelum", province: "Punjab" },
  { city: "Karachi", district: "Karachi", province: "Sindh" },
  { city: "Hyderabad", district: "Hyderabad", province: "Sindh" },
  { city: "Sukkur", district: "Sukkur", province: "Sindh" },
  { city: "Larkana", district: "Larkana", province: "Sindh" },
  { city: "Nawabshah", district: "Nawabshah", province: "Sindh" },
  { city: "Mirpurkhas", district: "Mirpurkhas", province: "Sindh" },
  { city: "Jacobabad", district: "Jacobabad", province: "Sindh" },
  { city: "Shikarpur", district: "Shikarpur", province: "Sindh" },
  { city: "Khairpur", district: "Khairpur", province: "Sindh" },
  { city: "Dadu", district: "Dadu", province: "Sindh" },
  { city: "Umerkot", district: "Umerkot", province: "Sindh" },
  { city: "Tharparkar", district: "Tharparkar", province: "Sindh" },
  { city: "Peshawar", district: "Peshawar", province: "KPK" },
  { city: "Mardan", district: "Mardan", province: "KPK" },
  { city: "Abbottabad", district: "Abbottabad", province: "KPK" },
  { city: "Swat", district: "Swat", province: "KPK" },
  { city: "Nowshera", district: "Nowshera", province: "KPK" },
  { city: "Charsadda", district: "Charsadda", province: "KPK" },
  { city: "Kohat", district: "Kohat", province: "KPK" },
  { city: "Mansehra", district: "Mansehra", province: "KPK" },
  { city: "Dera Ismail Khan", district: "D.I. Khan", province: "KPK" },
  { city: "Haripur", district: "Haripur", province: "KPK" },
  { city: "Quetta", district: "Quetta", province: "Balochistan" },
  { city: "Gwadar", district: "Gwadar", province: "Balochistan" },
  { city: "Khuzdar", district: "Khuzdar", province: "Balochistan" },
  { city: "Hub", district: "Lasbela", province: "Balochistan" },
  { city: "Turbat", district: "Kech", province: "Balochistan" },
  { city: "Chaman", district: "Qilla Abdullah", province: "Balochistan" },
  { city: "Zhob", district: "Zhob", province: "Balochistan" },
  { city: "Muzaffarabad", district: "Muzaffarabad", province: "AJK" },
  { city: "Mirpur", district: "Mirpur", province: "AJK" },
  { city: "Rawalakot", district: "Poonch", province: "AJK" },
  { city: "Gilgit", district: "Gilgit", province: "Gilgit-Baltistan" },
  { city: "Skardu", district: "Skardu", province: "Gilgit-Baltistan" },
]

const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "AJK",
  "Gilgit-Baltistan",
]

const PRODUCTS = [
  { id: "wheat", label: "Wheat", price: 3000 },
  { id: "maize", label: "Maize", price: 3000 },
  { id: "sesame", label: "Sesame", price: 3000 },
  { id: "millet", label: "Millet", price: 3000 },
  { id: "cotton", label: "Cotton", price: 3000 },
  { id: "paddy", label: "Paddy", price: 3000 },
  { id: "rice", label: "Rice", price: 3000 },
  { id: "edibleoil", label: "Edible Oil", price: 5000 },
  { id: "fertilizer", label: "Fertilizer", price: 5000 },
  { id: "livestock", label: "Livestock", price: 5000 },
  { id: "livemarket", label: "Live Market", price: 3000 },
  { id: "dates", label: "Dates", price: 3000 },
  { id: "mustard", label: "Mustard", price: 3000 },
  { id: "spices", label: "Spices", price: 3000 },
  { id: "pulses", label: "Pulses", price: 3000 },
  { id: "kiryana", label: "Kiryana", price: 5000 },
  { id: "sugar", label: "Sugarcane/Sugar", price: 3000 },
  { id: "fruits", label: "Fruits", price: 5000 },
  { id: "vegetables", label: "Vegetables", price: 5000 },
  { id: "dryfruit", label: "Dry Fruit", price: 3000 },
  { id: "herbs", label: "Herbs", price: 3000 },
]

// Rep products in the specified order with updated labels
const REP_PRODUCTS = [
  { id: "wheat", label: "Wheat" },
  { id: "maize", label: "Maize" },
  { id: "sesame", label: "Sesame" },
  { id: "millet", label: "Millet" },
  { id: "cotton", label: "Cotton" },
  { id: "paddy", label: "Paddy" },
  { id: "rice", label: "Rice" },
  { id: "edibleoil", label: "Edible Oil" },
  { id: "fertilizer", label: "Fertilizer" },
  { id: "livestock", label: "Livestock" },
  { id: "livemarket", label: "Live Market" },
  { id: "dates", label: "Dates" },
  { id: "mustard", label: "Mustard" },
  { id: "spices", label: "Spices" },
  { id: "pulses", label: "Pulses" },
  { id: "kiryana", label: "Kiryana" },
  { id: "sugar", label: "Sugar" },
  { id: "fruits", label: "Fruits" },
  { id: "vegetables", label: "Vegetable" },
  { id: "dryfruit", label: "Dry Fruit" },
  { id: "herbs", label: "Herbs" },
]

const REP_PROFESSIONS = [
  "Farmer",
  "Stockist",
  "Broker",
  "Commission Agent",
  "Dealer",
  "Wholesaler",
  "Retailer",
  "Exporter",
  "Importer",
  "Miller",
  "Indenting Agents",
  "Commodity Brokerage House",
  "Commodity Data Provider / Data & Information Company",
  "Other",
]

const LANGUAGES = [
  { code: "en", native: "English", urdu: false },
  { code: "ur", native: "اردو", urdu: true },
  { code: "pa", native: "پنجابی", urdu: true },
  { code: "sd", native: "سنڌي", urdu: true },
  { code: "bl", native: "بلوچی", urdu: true },
  { code: "ps", native: "پښتو", urdu: true },
  { code: "sk", native: "سرائیکی", urdu: true, centered: true },
]

const DURATION_MONTHS = [1, 3, 6, 12]
const DURATION_LABELS = ["1 Month", "3 Months", "6 Months", "1 Year"]
const DISCOUNTS = [0, 0.1, 0.15, 0.25]

function calcPricing(selectedIds: string[], durIdx: number) {
  const monthlyTotal = selectedIds.reduce((sum, id) => {
    const p = PRODUCTS.find((x) => x.id === id)
    return sum + (p?.price ?? 0)
  }, 0)
  const months = DURATION_MONTHS[durIdx]
  const discount = DISCOUNTS[durIdx]
  const regularTotal = monthlyTotal * months
  const discountAmt = Math.round(regularTotal * discount)
  const finalTotal = regularTotal - discountAmt
  return {
    monthlyTotal,
    months,
    discount,
    regularTotal,
    discountAmt,
    finalTotal,
  }
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Progress({ total, current }: { total: number; current: number }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 5,
        justifyContent: "center",
        marginBottom: 18,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`progress-dot${i === current ? " active" : ""}`}
        />
      ))}
    </div>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "14px 0",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "var(--zm-border)" }} />
      <span
        style={{
          fontSize: 11.5,
          color: "var(--zm-muted)",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--zm-border)" }} />
    </div>
  )
}

function TermsToggle({
  agreed,
  onChange,
}: {
  agreed: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        margin: "6px 0 14px",
      }}
    >
      <div
        className={`toggle-track${agreed ? " on" : ""}`}
        style={{ marginTop: 2, flexShrink: 0 }}
        onClick={() => onChange(!agreed)}
      >
        <div className="toggle-thumb" />
      </div>
      <span
        style={{
          fontSize: 12.5,
          color: "var(--zm-muted)",
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        I agree to the{" "}
        <span
          style={{
            color: "var(--zm-green)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Terms &amp; Conditions
        </span>{" "}
        and{" "}
        <span
          style={{
            color: "var(--zm-green)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Privacy Policy
        </span>
      </span>
    </div>
  )
}

const SocialIcon = {
  google: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
    </svg>
  ),
}

// ─── Screen 1 – Language ──────────────────────────────────────────────────────
function LangScreen({ onNext }: { onNext: (lang: string) => void }) {
  return (
    <div
      className="screen-scroll s-enter"
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "52px 20px 32px",
        gap: 28,
      }}
    >
      <img
        src={logoImg}
        alt="Zarai Mandi"
        className="logo-anim"
        style={{ height: 80 }}
      />
      <div style={{ textAlign: "center" }}>
        <div className="headline" style={{ textAlign: "center", fontSize: 22 }}>
          Choose Language
        </div>
        <div
          style={{
            fontFamily: "'Noto Nastaliq Urdu', serif",
            fontSize: 15,
            color: "var(--zm-muted)",
            marginTop: 4,
          }}
        >
          زبان منتخب کریں
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          width: "100%",
          maxWidth: 320,
        }}
      >
        {LANGUAGES.map((lng) => (
          <button
            key={lng.code}
            className={`lang-btn${lng.urdu ? " regional" : ""}`}
            onClick={() => onNext(lng.code)}
            style={
              (lng as any).centered
                ? {
                  gridColumn: "1 / -1",
                  justifySelf: "center",
                  width: "calc(50% - 5px)",
                }
                : { width: "100%" }
            }
          >
            <span className="btn-txt">{lng.native}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Screen 2 – Who Are You? (simplified — no descriptions, no sub-options) ──
function RoleScreen({
  onNext,
  onBack,
}: {
  onNext: (role: Role) => void
  onBack: () => void
}) {
  const [role, setRole] = useState<Role | "">("")

  const roles: { id: Role; label: string }[] = [
    { id: "customer", label: "Customer" },
    { id: "representative", label: "Representative" },
  ]

  return (
    <div
      className="screen-scroll s-enter"
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 20px 32px",
      }}
    >
      <div className="auth-card">
        <Progress total={6} current={0} />
        <div className="eyebrow">Step 1 of 6</div>
        <div className="headline">Who are you?</div>
        <div className="subline">
          Select your role to personalise Zarai Mandi.
        </div>

        <div className="radio-group-container" style={{ marginBottom: 8 }}>
          {roles.map((r) => (
            <label key={r.id} className="radio-label">
              <input
                type="radio"
                name="role"
                value={r.id}
                className="radio-input"
                checked={role === r.id}
                onChange={() => setRole(r.id)}
              />
              <span className="radio-custom" />
              <span className="radio-text">{r.label}</span>
            </label>
          ))}
        </div>

        <button
          className="btn-primary"
          disabled={!role}
          onClick={() => onNext(role as Role)}
        >
          Continue →
        </button>
        <button
          className="btn-ghost"
          style={{
            margin: "10px auto 0",
            display: "flex",
            fontSize: 14,
            padding: "8px 16px",
          }}
          onClick={onBack}
        >
          ← Change Language / زبان
        </button>
      </div>
    </div>
  )
}

// ─── Screen 3a – Customer Account ────────────────────────────────────────────
function CustomerAccountScreen({
  onWhatsApp,
  onSocial,
  onBack,
}: {
  onWhatsApp: (name: string, phone: string) => void
  onSocial: () => void
  onBack: () => void
}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [waOpen, setWaOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [agreed, setAgreed] = useState(false)

  const phoneDigits = phone.replace(/\D/g, "")
  const canSendOtp =
    name.trim().length > 1 && phoneDigits.length >= 10 && agreed

  const socialBtnStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    border: "1.5px solid var(--zm-border)",
    borderRadius: 12,
    background: "white",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--zm-text)",
    marginBottom: 9,
    transition: "border-color 0.15s, background 0.15s",
  } as const

  return (
    <div
      className="screen-scroll s-enter"
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 16px 32px",
      }}
    >
      <div className="auth-card">
        <Progress total={6} current={1} />
        <div className="eyebrow">Step 2 of 6</div>
        <div className="headline">Customer Registration</div>
        <div className="subline">Sign in or register to get started.</div>

        {/* Username or Email */}
        <div className="field">
          <div style={{ position: "relative" }}>
            <input
              className={`fl-input${username ? " filled" : ""}`}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%" }}
              autoComplete="username"
            />
            <label className="fl-label">Username or Email *</label>
            <div className="fl-underline" />
          </div>
        </div>

        {/* Password */}
        <div className="field">
          <div style={{ position: "relative" }}>
            <input
              className={`fl-input${password ? " filled" : ""}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
              autoComplete="current-password"
            />
            <label className="fl-label">Password *</label>
            <div className="fl-underline" />
          </div>
        </div>

        {/* Login Button */}
        <button
          className="btn-primary"
          disabled={!username.trim() || !password.trim()}
          onClick={() => onSocial()}
          style={{
            marginBottom: "14px",
          }}
        >
          Login →
        </button>

        {/* Social login — no prerequisites */}
        <div style={{ marginBottom: 2 }}>
          <button style={socialBtnStyle} onClick={onSocial}>
            {SocialIcon.google}
            Continue with Google
          </button>
        </div>

        <Divider label="or register with WhatsApp" />

        {/* Collapsible WhatsApp panel */}
        {/* Collapsible WhatsApp panel */}
        <div className={`wa-panel${waOpen ? " expanded" : ""}`}>
          <div className="wa-panel-header" onClick={() => setWaOpen((v) => !v)}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#25D366",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--zm-text)",
                }}
              >
                Continue with WhatsApp
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "var(--zm-muted)",
                  marginTop: 1,
                }}
              >
                Register using your WhatsApp number
              </div>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                flexShrink: 0,
                transform: waOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.3s",
              }}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="var(--zm-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className={`wa-panel-body${waOpen ? " open" : ""}`}>
            <div className="wa-panel-inner">
              {/* Full name — only shown in WhatsApp flow */}
              <div className="field" style={{ marginTop: 14 }}>
                <div style={{ position: "relative" }}>
                  <input
                    className={`fl-input${name ? " filled" : ""}`}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%" }}
                  />
                  <label className="fl-label">Full Name</label>
                  <div className="fl-underline" />
                </div>
              </div>

              <TermsToggle agreed={agreed} onChange={setAgreed} />

              {/* Phone number row */}
              <div className="field" style={{ marginBottom: phone ? 12 : 0 }}>
                <div className="field-row">
                  <div className="cc-wrap">
                    <select className="cc-select">
                      <option value="+92">+92</option>
                    </select>
                  </div>
                  <div className="input-wrap">
                    <input
                      className={phone ? "filled" : ""}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder=" "
                    />
                    <label>WhatsApp Number</label>
                    <div className="input-underline" />
                  </div>
                </div>
              </div>

              {/* OTP button — only when number entered */}
              {phone.trim().length > 0 && (
                <button
                  className="btn-primary"
                  disabled={!canSendOtp}
                  onClick={() => onWhatsApp(name, phone)}
                  style={{ marginTop: 4 }}
                >
                  Send OTP →
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            fontSize: 13,
            color: "var(--zm-muted)",
          }}
        >
          Already have an account?{" "}
          <span
            style={{
              color: "var(--zm-green)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Log In
          </span>
        </div>
        <button
          className="btn-ghost"
          style={{
            margin: "10px auto 0",
            display: "flex",
            fontSize: 14,
            padding: "8px 16px",
          }}
          onClick={onBack}
        >
          ← Back
        </button>
      </div>
    </div >
  )
}

// ─── Screen 3b – Representative Account ──────────────────────────────────────
function RepAccountScreen({
  onNext,
  onBack,
}: {
  onNext: (name: string) => void
  onBack: () => void
}) {
  const [name, setName] = useState("")
  const [mandi, setMandi] = useState("")
  const [address, setAddress] = useState("")
  const [profession, setProfession] = useState("")
  const [professionOpen, setProfessionOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [photoLabel, setPhotoLabel] = useState("")

  function toggleProduct(id: string) {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const canSubmit =
    name.trim().length > 1 &&
    mandi.trim().length > 1 &&
    profession !== "" &&
    agreed

  return (
    <div
      className="screen-scroll s-enter"
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 16px 32px",
        boxSizing: "border-box",
      }}
    >
      <div className="auth-card" style={{ maxHeight: "none" }}>
        <Progress total={6} current={1} />
        <div className="eyebrow">Step 2 of 6</div>
        <div className="headline">Representative Registration</div>
        <div className="subline">
          Complete your profile for mandi representation.
        </div>

        {/* Full Name */}
        <div className="field">
          <div style={{ position: "relative" }}>
            <input
              className={`fl-input${name ? " filled" : ""}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%" }}
            />
            <label className="fl-label">Full Name *</label>
            <div className="fl-underline" />
          </div>
        </div>

        {/* Mandi / Station */}
        <div className="field">
          <div style={{ position: "relative" }}>
            <input
              className={`fl-input${mandi ? " filled" : ""}`}
              type="text"
              value={mandi}
              onChange={(e) => setMandi(e.target.value)}
              style={{ width: "100%" }}
            />
            <label className="fl-label">Mandi / Station *</label>
            <div className="fl-underline" />
          </div>
        </div>

        {/* Profession */}
        <div style={{ marginBottom: 14 }}>
          <div className="role-sub-label" style={{ marginBottom: 6 }}>
            Profession *
          </div>

          <div
            className="occ-scroll-box"
            style={{
              maxHeight: 210,
              marginBottom: 10,
            }}
          >
            {REP_PROFESSIONS.map((p) => (
              <div
                key={p}
                className={`occ-option${profession === p ? " selected" : ""}`}
                onClick={() => {
                  setProfession(p)
                }}
              >
                <span className="occ-dot" />

                <span
                  style={{
                    fontWeight: profession === p ? 700 : 500,
                  }}
                >
                  {p}
                </span>
              </div>
            ))}

            {REP_PROFESSIONS.length === 0 && (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  fontSize: 13,
                  color: "var(--zm-muted)",
                }}
              >
                No professions found
              </div>
            )}
          </div>
        </div>

        <TermsToggle agreed={agreed} onChange={setAgreed} />

        <button
          className="btn-primary"
          disabled={!canSubmit}
          onClick={() => onNext(name)}
        >
          Create Representative Account →
        </button>
        <button
          className="btn-ghost"
          style={{
            margin: "10px auto 0",
            display: "flex",
            fontSize: 14,
            padding: "8px 16px",
          }}
          onClick={onBack}
        >
          ← Back
        </button>
      </div>
    </div>
  )
}

// ─── Screen 4 – OTP ───────────────────────────────────────────────────────────
function OtpScreen({
  phone,
  onNext,
  onBack,
}: {
  phone: string
  onNext: () => void
  onBack: () => void
}) {
  const [vals, setVals] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(30)
  const r0 = useRef<HTMLInputElement>(null)
  const r1 = useRef<HTMLInputElement>(null)
  const r2 = useRef<HTMLInputElement>(null)
  const r3 = useRef<HTMLInputElement>(null)
  const r4 = useRef<HTMLInputElement>(null)
  const r5 = useRef<HTMLInputElement>(null)
  const refs = [r0, r1, r2, r3, r4, r5]

  useEffect(() => {
    r0.current?.focus()
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])

  function handleChange(i: number, v: string) {
    const digit = v.replace(/\D/g, "").slice(-1)
    const next = [...vals]
    next[i] = digit
    setVals(next)
    if (digit && i < 5) refs[i + 1].current?.focus()
  }
  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !vals[i] && i > 0) refs[i - 1].current?.focus()
  }

  return (
    <div
      className="screen-scroll s-enter"
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 16px 32px",
      }}
    >
      <div className="auth-card">
        <Progress total={6} current={2} />
        <div className="eyebrow">Step 3 of 6</div>
        <div className="headline">Verify your number</div>
        <div className="subline">
          We sent a 6-digit code to{" "}
          <span style={{ fontWeight: 700, color: "var(--zm-dark)" }}>
            +92 {phone}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            margin: "24px 0 18px",
          }}
        >
          {refs.map((r, i) => (
            <input
              key={i}
              ref={r}
              className={`otp-box${vals[i] ? " filled" : ""}`}
              type="tel"
              maxLength={1}
              value={vals[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 12.5,
            color: "var(--zm-muted)",
            marginBottom: 18,
          }}
        >
          {timer > 0 ? (
            <>
              Resend in{" "}
              <span style={{ fontWeight: 700, color: "var(--zm-green)" }}>
                {timer}s
              </span>
            </>
          ) : (
            <span
              style={{
                color: "var(--zm-green)",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => setTimer(30)}
            >
              Resend OTP
            </span>
          )}
        </div>
        <button
          className="btn-primary"
          disabled={!vals.every((v) => v)}
          onClick={onNext}
        >
          Verify →
        </button>
        <button
          className="btn-ghost"
          style={{
            margin: "10px auto 0",
            display: "flex",
            fontSize: 14,
            padding: "8px 16px",
          }}
          onClick={onBack}
        >
          ← Change number
        </button>
      </div>
    </div>
  )
}

// ─── Screen 5 – Product Interests ────────────────────────────────────────────
function InterestsScreen({
  onNext,
  onBack,
}: {
  onNext: (prods: string[]) => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState("")

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const filtered = PRODUCTS.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase()),
  )
  const selectedItems = PRODUCTS.filter((p) => selected.includes(p.id))
  const monthlyTotal = selected.reduce(
    (s, id) => s + (PRODUCTS.find((p) => p.id === id)?.price ?? 0),
    0,
  )

  return (
    <div
      className="screen-scroll s-enter"
      style={{ alignItems: "center", padding: "32px 16px 35px" }}
    >
      <div className="auth-card" style={{ maxHeight: "none" }}>
        <Progress total={6} current={3} />
        <div className="eyebrow">Step 4 of 6</div>
        <div className="headline">What are you interested in?</div>
        <div className="subline">Select your favorite products</div>

        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            className="fl-input filled"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{ paddingTop: 13, paddingBottom: 13 }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 14,
            maxHeight: 400,
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {filtered.map((p) => (
            <div
              key={p.id}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => toggle(p.id)}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: "50%",
                  border: selected.includes(p.id)
                    ? "2.5px solid var(--zm-green)"
                    : "2px solid var(--zm-border)",
                  background: selected.includes(p.id)
                    ? "var(--zm-light)"
                    : "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 6,
                  transition: "border-color 0.18s, background 0.18s",
                  boxShadow: selected.includes(p.id)
                    ? "0 0 0 3px rgba(8,127,99,0.12)"
                    : "none",
                }}
              >
                <img
                  src={ICONS[p.id]}
                  alt={p.label}
                  style={{ width: "72%", height: "72%", objectFit: "contain" }}
                />
              </button>
              {selected.includes(p.id) && (
                <div className="item-check" style={{ top: 0, right: "8%" }}>
                  ✓
                </div>
              )}
              <span
                style={{
                  marginTop: 4,
                  fontSize: 10.5,
                  fontWeight: selected.includes(p.id) ? 700 : 500,
                  color: selected.includes(p.id)
                    ? "var(--zm-dark)"
                    : "var(--zm-muted)",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {selectedItems.length > 0 && (
          <div
            style={{
              background: "var(--zm-light)",
              borderRadius: 14,
              border: "1px solid rgba(15,138,95,0.18)",
              padding: "12px 14px",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--zm-gold)",
                  fontWeight: 700,
                }}
              >
                Your Selection ({selectedItems.length})
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--zm-dark)",
                }}
              >
                PKR {monthlyTotal.toLocaleString()}/mo
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {selectedItems.map((p) => (
                <div
                  key={p.id}
                  className="sel-tag"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <img
                    src={ICONS[p.id]}
                    alt=""
                    style={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  {p.label}
                  <button onClick={() => toggle(p.id)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="btn-primary"
          disabled={selected.length === 0}
          onClick={() => onNext(selected)}
        >
          Continue →
        </button>
        <button
          className="btn-ghost"
          style={{
            margin: "10px auto 0",
            display: "flex",
            fontSize: 14,
            padding: "8px 16px",
          }}
          onClick={onBack}
        >
          ← Back
        </button>
      </div>
    </div>
  )
}

// ─── Screen 6 – Location ──────────────────────────────────────────────────────
function LocationScreen({
  onNext,
  onBack,
}: {
  onNext: (city: string, district: string, province: string) => void
  onBack: () => void
}) {
  const [selectedProvince, setSelectedProvince] = useState("")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<typeof CITIES[0] | null>(null)

  const citiesInProvince = selectedProvince
    ? CITIES.filter((c) => c.province === selectedProvince)
    : CITIES
  const filtered = citiesInProvince.filter((c) =>
    c.city.toLowerCase().includes(search.toLowerCase()),
  )

  function handleSelect(c: typeof CITIES[0]) {
    setSelected(c)
    onNext(c.city, c.district, c.province)
  }

  return (
    <div
      className="screen-scroll s-enter"
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "55px 20px",
      }}
    >
      <div className="auth-card">
        <Progress total={6} current={4} />
        <div className="eyebrow">Step 5 of 6</div>
        <div className="headline">Where are your markets?</div>
        <div className="subline">
          Select your province and city. District is identified automatically.
        </div>

        <button
          onClick={() =>
            handleSelect({
              city: "Lahore",
              district: "Lahore",
              province: "Punjab",
            })
          }
          style={{
            width: "100%",
            padding: "13px 16px",
            border: "1.5px solid var(--zm-border)",
            borderRadius: 14,
            background: "white",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            marginBottom: 14,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--zm-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              flexShrink: 0,
            }}
          >
            📍
          </div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: "var(--zm-text)",
              }}
            >
              Use My Current Location
            </div>
            <div
              style={{ fontSize: 11.5, color: "var(--zm-muted)", marginTop: 1 }}
            >
              Detect automatically via GPS
            </div>
          </div>
        </button>

        <Divider label="or select manually" />

        <div className="role-sub-label" style={{ marginBottom: 6 }}>
          Province
        </div>
        <div
          className="occ-scroll-box"
          style={{ maxHeight: 150, marginBottom: 14 }}
        >
          {PROVINCES.map((prov) => (
            <div
              key={prov}
              className={`occ-option${selectedProvince === prov ? " selected" : ""
                }`}
              onClick={() => {
                setSelectedProvince(prov)
                setSelected(null)
                setSearch("")
              }}
            >
              <span className="occ-dot" />
              <span
                style={{ fontWeight: selectedProvince === prov ? 700 : 500 }}
              >
                {prov}
              </span>
            </div>
          ))}
        </div>

        {selectedProvince && (
          <>
            <div className="role-sub-label" style={{ marginBottom: 6 }}>
              City
            </div>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <input
                className="fl-input filled"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city…"
                style={{ paddingTop: 13, paddingBottom: 13 }}
              />
            </div>
            <div className="occ-scroll-box" style={{ maxHeight: 200 }}>
              {filtered.map((c) => (
                <div
                  key={`${c.city}-${c.province}`}
                  className={`occ-option${selected?.city === c.city ? " selected" : ""
                    }`}
                  onClick={() => handleSelect(c)}
                >
                  <span className="occ-dot" />
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontWeight: selected?.city === c.city ? 700 : 500,
                      }}
                    >
                      {c.city}
                    </span>
                    {c.district !== c.city && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--zm-muted)",
                          marginLeft: 6,
                          opacity: 0.7,
                        }}
                      >
                        {c.district}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    fontSize: 13,
                    color: "var(--zm-muted)",
                  }}
                >
                  No cities found
                </div>
              )}
            </div>
          </>
        )}

        <button
          className="btn-ghost"
          style={{
            margin: "14px auto 0",
            display: "flex",
            fontSize: 14,
            padding: "8px 16px",
          }}
          onClick={onBack}
        >
          ← Back
        </button>
      </div>
    </div>
  )
}

// ─── Screen 7 – Subscription ──────────────────────────────────────────────────
function SubscriptionScreen({
  products,
  city,
  province,
  onTrial,
  onPay,
  onBack,
}: {
  products: string[]
  city: string
  province: string
  onTrial: () => void
  onPay: (amount: number, dur: number) => void
  onBack: () => void
}) {
  const [dur, setDur] = useState(0)
  const { months, discount, regularTotal, discountAmt, finalTotal } =
    calcPricing(products, dur)
  const selectedItems = PRODUCTS.filter((p) => products.includes(p.id))

  return (
    <div
      className="screen-scroll s-enter"
      style={{ alignItems: "center", padding: "36px 16px 32px" }}
    >
      <div className="auth-card" style={{ maxHeight: "none" }}>
        <Progress total={6} current={5} />
        <div className="eyebrow">Step 6 of 6</div>
        <div className="headline">Choose your ZM plan</div>
        <div className="subline">
          Prices are based on your selected products.
        </div>

        {/* Duration tabs */}
        <div
          style={{
            display: "flex",
            background: "rgba(15,138,95,0.07)",
            borderRadius: 12,
            padding: 4,
            gap: 3,
            marginBottom: 16,
          }}
        >
          {DURATION_LABELS.map((d, i) => (
            <button
              key={d}
              className={`dur-tab${dur === i ? " active" : ""}`}
              onClick={() => setDur(i)}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Pricing breakdown */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1.4px solid var(--zm-border)",
            marginBottom: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 16px 6px",
              borderBottom: "1px solid var(--zm-border)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--zm-gold)",
                fontWeight: 700,
              }}
            >
              Product Pricing
            </div>
          </div>
          <div
            style={{
              maxHeight: 140,
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
            className="thin-scroll"
          >
            {selectedItems.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 16px",
                  borderBottom:
                    i < selectedItems.length - 1
                      ? "1px solid rgba(15,138,95,0.06)"
                      : "none",
                  fontSize: 12.5,
                  color: "var(--zm-muted)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <img
                    src={ICONS[p.id]}
                    alt=""
                    style={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  {p.label}
                </span>
                <span style={{ fontWeight: 600, color: "var(--zm-dark)" }}>
                  PKR {p.price.toLocaleString()}/mo
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: "1.5px solid rgba(15,138,95,0.1)",
              background: "var(--zm-light)",
            }}
          >
            <div className="price-row" style={{ padding: "10px 16px" }}>
              <span>
                Total/mo × {months} month{months > 1 ? "s" : ""}
              </span>
              <span>PKR {regularTotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div
                className="price-row"
                style={{ padding: "8px 16px", color: "#16A34A" }}
              >
                <span style={{ fontWeight: 600 }}>
                  Discount ({Math.round(discount * 100)}% off)
                </span>
                <span style={{ fontWeight: 700 }}>
                  − PKR {discountAmt.toLocaleString()}
                </span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                borderTop: "1px solid rgba(15,138,95,0.1)",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--zm-dark)",
                }}
              >
                Your Price
              </span>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--zm-dark)",
                  }}
                >
                  PKR {finalTotal.toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: "var(--zm-muted)" }}>
                  PKR {Math.round(finalTotal / months).toLocaleString()}/mo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location info */}
        {city && (
          <div
            style={{
              background: "white",
              border: "1px solid var(--zm-border)",
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 14,
              display: "flex",
              gap: 8,
              alignItems: "center",
              fontSize: 12.5,
            }}
          >
            <span style={{ fontSize: 16 }}>📍</span>
            <span style={{ color: "var(--zm-muted)" }}>
              {city}, {province}
            </span>
          </div>
        )}

        {/* Two CTAs */}
        <button className="btn-primary" onClick={onTrial}>
          Start 3-Day Free Trial →
        </button>
        <button
          className="btn-secondary"
          onClick={() => onPay(finalTotal, dur)}
        >
          Pay &amp; Subscribe — PKR {finalTotal.toLocaleString()}
        </button>
        <div
          style={{
            textAlign: "center",
            marginTop: 8,
            fontSize: 11.5,
            color: "var(--zm-muted)",
          }}
        >
          Free trial requires no payment. Review before subscribing.
        </div>
        <button
          className="btn-ghost"
          style={{
            margin: "10px auto 0",
            display: "flex",
            fontSize: 14,
            padding: "8px 16px",
          }}
          onClick={onBack}
        >
          ← Back
        </button>
      </div>
    </div>
  )
}

// ─── Screen 8 – Payment Confirmation ─────────────────────────────────────────
function PaymentScreen({
  amount,
  durIdx,
  onConfirm,
  onBack,
}: {
  amount: number
  durIdx: number
  onConfirm: () => void
  onBack: () => void
}) {
  const [method, setMethod] = useState<"jazzcash" | "easypaisa" | "bank" | "">(
    "",
  )
  const [hasFile, setHasFile] = useState(false)
  const planLabel = DURATION_LABELS[durIdx]

  const paymentMethods = [
    { id: "jazzcash", label: "JazzCash", color: "#E83D2B", img: "/src/icons/jazz.png" },
    { id: "easypaisa", label: "EasyPaisa", color: "#4CAF50", img: "/src/icons/easypaisa.png" },
    { id: "bank", label: "Bank Transfer", color: "#1565C0", img: "/src/icons/bank.png" },
  ] as const

  const details: Record<string, { rows: [string, string][] }> = {
    jazzcash: {
      rows: [
        ["Account", "0300-1234567"],
        ["Account Name", "Zarai Mandi Pvt Ltd"],
        ["Amount", `PKR ${amount.toLocaleString()}`],
      ],
    },
    easypaisa: {
      rows: [
        ["Account", "0333-9876543"],
        ["Account Name", "Zarai Mandi Pvt Ltd"],
        ["Amount", `PKR ${amount.toLocaleString()}`],
      ],
    },
    bank: {
      rows: [
        ["Bank", "HBL"],
        ["Account Title", "Zarai Mandi Pvt Ltd"],
        ["Account No.", "0001-2345678-901"],
        ["IBAN", "PK36HABB0000012345678901"],
        ["Amount", `PKR ${amount.toLocaleString()}`],
      ],
    },
  }

  return (
    <div
      className="screen-scroll s-enter"
      style={{ alignItems: "center", padding: "36px 16px 32px" }}
    >
      <div className="auth-card" style={{ maxHeight: "none" }}>
        <div className="eyebrow">Payment Confirmation</div>
        <div className="headline">Complete your payment</div>
        <div className="subline">
          Send{" "}
          <strong style={{ color: "var(--zm-dark)" }}>
            PKR {amount.toLocaleString()}
          </strong>{" "}
          for the{" "}
          <strong style={{ color: "var(--zm-dark)" }}>{planLabel}</strong> plan.
        </div>

        {/* Method selection */}
        <div className="role-sub-label" style={{ marginBottom: 8 }}>
          Choose Payment Method
        </div>
        {paymentMethods.map((m) => (
          <div
            key={m.id}
            className={`pay-method${method === m.id ? " selected" : ""}`}
            onClick={() => setMethod(m.id)}
          >
            <div
              className="pay-method-icon"
              style={{ background: `${m.color}14`, overflow: "hidden" }}
            >
              <img
                src={m.img}
                alt={m.label}
                style={{ width: 28, height: 28, objectFit: "contain" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--zm-text)",
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "var(--zm-muted)",
                  marginTop: 1,
                }}
              >
                {m.id === "jazzcash" && "Send via JazzCash mobile wallet"}
                {m.id === "easypaisa" && "Send via EasyPaisa mobile wallet"}
                {m.id === "bank" && "Direct bank / IBFT transfer"}
              </div>
            </div>
            {method === m.id && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#0F8A5F" opacity="0.15" />
                <path
                  d="M7 12.5l3.5 3.5 6.5-7"
                  stroke="#0F8A5F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}

        {/* Payment details */}
        {method && (
          <>
            <div className="pay-detail-box">
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--zm-gold)",
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                Payment Details
              </div>
              {details[method].rows.map(([k, v]) => (
                <div key={k} className="pay-detail-row">
                  <span>{k}</span>
                  <span
                    style={{
                      fontFamily:
                        k === "IBAN" || k === "Account No."
                          ? "monospace"
                          : "inherit",
                      fontSize: k === "IBAN" ? 11 : 13,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Screenshot upload */}
            <div className="role-sub-label" style={{ marginBottom: 6 }}>
              Upload Payment Screenshot
            </div>
            <div
              className={`upload-area${hasFile ? " has-file" : ""}`}
              onClick={() => setHasFile(true)}
            >
              {hasFile ? (
                <>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--zm-dark)",
                    }}
                  >
                    Screenshot attached
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "var(--zm-muted)",
                      marginTop: 3,
                    }}
                  >
                    Tap to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📎</div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--zm-text)",
                    }}
                  >
                    Tap to upload screenshot
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "var(--zm-muted)",
                      marginTop: 3,
                    }}
                  >
                    JPG, PNG — Max 10 MB
                  </div>
                </>
              )}
            </div>

            <button
              className="btn-primary"
              disabled={!hasFile}
              onClick={onConfirm}
            >
              Confirm &amp; Verify Payment →
            </button>
            {!hasFile && (
              <div
                style={{
                  textAlign: "center",
                  fontSize: 11.5,
                  color: "var(--zm-muted)",
                  marginTop: 6,
                }}
              >
                Please upload your payment screenshot to continue.
              </div>
            )}
          </>
        )}

        <button
          className="btn-ghost"
          style={{
            margin: "12px auto 0",
            display: "flex",
            fontSize: 14,
            padding: "8px 16px",
          }}
          onClick={onBack}
        >
          ← Back
        </button>
      </div>
    </div>
  )
}

// ─── Loading ──────────────────────────────────────────────────────────────────
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const dotId = setInterval(
      () => setDots((d) => (d.length >= 3 ? "" : d + ".")),
      480,
    )
    const navId = setTimeout(onDone, 3000)
    return () => {
      clearInterval(dotId)
      clearTimeout(navId)
    }
  }, [])

  return (
    <div
      className="s-enter"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        background: "var(--zm-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={logoImg}
        alt="Zarai Mandi"
        className="logo-anim"
        style={{ width: 160, marginBottom: 36 }}
      />
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--zm-dark)",
          textAlign: "center",
        }}
      >
        VERIFYING &amp; LOADING ZARAI MANDI{dots}
      </div>
      <div
        style={{
          marginTop: 28,
          width: 180,
          height: 3,
          borderRadius: 2,
          background: "rgba(15,138,95,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            background: "var(--zm-green)",
            animation: "loadBar 3s linear forwards",
          }}
        />
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({
  name,
  city,
  province,
  onBack,
}: {
  name: string
  city: string
  province: string
  onBack: () => void
}) {
  const prices = [
    { label: "Wheat", price: "4,200", change: "+2.1%", up: true },
    { label: "Rice", price: "6,800", change: "+0.8%", up: true },
    { label: "Cotton", price: "9,500", change: "-1.3%", up: false },
    { label: "Maize", price: "2,900", change: "+3.5%", up: true },
  ]

  return (
    <div className="screen-scroll s-enter" style={{ padding: "0 0 24px" }}>
      <div
        style={{
          padding: "48px 20px 22px",
          position: "relative",
          background:
            "linear-gradient(160deg, var(--zm-dark), var(--zm-green))",
          color: "white",
        }}
      >
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            background: "rgba(255,255,255,0.14)",
            border: "none",
            borderRadius: 20,
            padding: "5px 14px",
            color: "white",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          ← Back
        </button>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.65,
            marginBottom: 3,
            marginTop: 14,
          }}
        >
          Good morning
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {name || "Customer"}
        </div>
        <div style={{ fontSize: 12, opacity: 0.65, marginTop: 3 }}>
          {city || "Lahore"}, {province || "Punjab"} — 3-Day Trial Active
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ marginTop: 20, marginBottom: 10 }}>
          <div className="eyebrow">Live Mandi Prices</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 18,
          }}
        >
          {prices.map((c) => (
            <div
              key={c.label}
              style={{
                background: "white",
                borderRadius: 16,
                padding: "14px",
                border: "1px solid var(--zm-border)",
                boxShadow: "0 2px 12px rgba(10,94,67,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 11.5,
                  color: "var(--zm-muted)",
                  marginBottom: 4,
                  fontWeight: 500,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "var(--zm-dark)",
                }}
              >
                PKR {c.price}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  marginTop: 3,
                  color: c.up ? "#16A34A" : "#DC2626",
                }}
              >
                {c.change} today
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "var(--zm-gold-lt)",
            border: "1px solid rgba(185,130,46,0.22)",
            borderRadius: 14,
            padding: "13px 15px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--zm-gold)",
              marginTop: 5,
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "var(--zm-dark)",
                marginBottom: 1,
              }}
            >
              Market Alert
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--zm-muted)",
                lineHeight: 1.4,
              }}
            >
              Cotton prices down in Multan Mandi — check rates
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {["Prices", "Market", "Alerts", "Profile"].map((tab, i) => (
            <button
              key={tab}
              style={{
                flex: 1,
                padding: "10px 4px",
                border: "none",
                borderRadius: 10,
                background:
                  i === 0 ? "var(--zm-green)" : "rgba(15,138,95,0.07)",
                color: i === 0 ? "white" : "var(--zm-muted)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Onboarding Flow Export ──────────────────────────────────────────────────
export type OnboardingUserData = {
  lang: string
  role: Role
  name: string
  phone: string
  products: string[]
  city: string
  district: string
  province: string
  payAmount: number
  payDur: number
}

export default function OnboardingFlow({
  onComplete,
}: {
  onComplete?: (data: OnboardingUserData) => void
}) {
  const [screen, setScreen] = useState<Screen>("lang")
  const [lang, setLang] = useState("en")
  const [role, setRole] = useState<Role>("customer")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [products, setProducts] = useState<string[]>([])
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [province, setProvince] = useState("")
  const [payAmount, setPayAmount] = useState(0)
  const [payDur, setPayDur] = useState(0)

  function go(s: Screen) {
    setScreen(s)
  }

  function handleComplete() {
    if (onComplete) {
      onComplete({
        lang,
        role,
        name,
        phone,
        products,
        city,
        district,
        province,
        payAmount,
        payDur,
      })
    } else {
      go("dashboard")
    }
  }

  return (
    <div
      className={`phone-shell ${lang === "ur" ? "lang-ur" : ""}`}
      dir={lang === "ur" ? "rtl" : "ltr"}
    >
      {screen === "lang" && (
        <LangScreen
          onNext={(l) => {
            setLang(l)
            go("role")
          }}
        />
      )}

      {screen === "role" && (
        <RoleScreen
          onNext={(r) => {
            setRole(r)
            go("account")
          }}
          onBack={() => go("lang")}
        />
      )}

      {screen === "account" && role === "customer" && (
        <CustomerAccountScreen
          onWhatsApp={(n, p) => {
            setName(n)
            setPhone(p)
            go("otp")
          }}
          onSocial={() => {
            setName("")
            go("interests")
          }}
          onBack={() => go("role")}
        />
      )}

      {screen === "account" && role === "representative" && (
        <RepAccountScreen
          onNext={(n) => {
            setName(n)
            handleComplete()
          }}
          onBack={() => go("role")}
        />
      )}

      {screen === "otp" && (
        <OtpScreen
          phone={phone}
          onNext={() => go("interests")}
          onBack={() => go("account")}
        />
      )}

      {screen === "interests" && (
        <InterestsScreen
          onNext={(prods) => {
            setProducts(prods)
            go("location")
          }}
          onBack={() => go(phone ? "otp" : "account")}
        />
      )}

      {screen === "location" && (
        <LocationScreen
          onNext={(c, d, p) => {
            setCity(c)
            setDistrict(d)
            setProvince(p)
            go("subscription")
          }}
          onBack={() => go("interests")}
        />
      )}

      {screen === "subscription" && (
        <SubscriptionScreen
          products={products}
          city={city}
          province={province}
          onTrial={() => {
            go("loading")
          }}
          onPay={(amt, dur) => {
            setPayAmount(amt)
            setPayDur(dur)
            go("payment")
          }}
          onBack={() => go("location")}
        />
      )}

      {screen === "payment" && (
        <PaymentScreen
          amount={payAmount}
          durIdx={payDur}
          onConfirm={() => {
            go("loading")
          }}
          onBack={() => go("subscription")}
        />
      )}

      {screen === "loading" && <LoadingScreen onDone={handleComplete} />}

      {screen === "dashboard" && (
        <Dashboard
          name={name}
          city={city}
          province={province}
          onBack={() =>
            go(role === "representative" ? "account" : "subscription")
          }
        />
      )}
    </div>
  )
}
