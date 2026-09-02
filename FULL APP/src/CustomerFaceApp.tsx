import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import farmHeroBg from "./assets/farm_hero_bg.jpg";

import agriForegroundImg from "./assets/agri_foreground.png";

const ZM_THEME_CSS = `
  @font-face {
    font-family: 'Jameel Noori Nastaleeq';
    src: url('/fonts/JameelNooriNastaleeq.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  :root {
    --zm-deep: #064D40;
    --zm-primary: #087F63;
    --zm-teal: #0B7F70;
    --zm-bright: #2FAE68;
    --zm-mint: #E4F2EC;
    --zm-surface: #F1F7F4;
    --zm-card: #F4FAF7;
    --zm-border: #D5E2DD;
    --zm-muted: #52635F;
  }
  * { -webkit-tap-highlight-color: transparent; }
  body { background: #E8F2EE; color: #183B34; }
  input, select, textarea { color: #183B34; }
  input::placeholder { color: #80918B; }
  .urdu, [dir="rtl"], .lang-ur {
    font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
  }
  [dir="rtl"] {
    text-align: right;
    --urdu-body-size: clamp(18px, 4.8vw, 22px);
    --urdu-label-size: clamp(17px, 4.5vw, 21px);
    --urdu-button-size: clamp(18px, 4.8vw, 22px);
    --urdu-heading-size: clamp(24px, 6.5vw, 32px);
    font-size: 110%;
  }
  [dir="rtl"] * {
    letter-spacing: 0 !important;
  }
  [dir="rtl"] h1 {
    font-size: 1.45em;
    line-height: 1.5;
  }
  [dir="rtl"] h2 {
    font-size: 1.3em;
    line-height: 1.5;
  }
  [dir="rtl"] h3 {
    font-size: 1.2em;
    line-height: 1.5;
  }
  [dir="rtl"] p, [dir="rtl"] span, [dir="rtl"] button {
    line-height: 1.6;
  }
  [dir="rtl"] .text-\[8px\] { font-size: 14px !important; }
  [dir="rtl"] .text-\[9px\] { font-size: 14.5px !important; }
  [dir="rtl"] .text-\[10px\] { font-size: 15.5px !important; }
  [dir="rtl"] .text-\[11px\] { font-size: 16.5px !important; }
  [dir="rtl"] .text-\[12px\] { font-size: 17.5px !important; }
  [dir="rtl"] .text-xs { font-size: 17px !important; }
  [dir="rtl"] .text-sm { font-size: 19px !important; }
  [dir="rtl"] .text-base { font-size: 21px !important; }
  [dir="rtl"] .text-lg { font-size: 24px !important; }
  [dir="rtl"] .text-xl { font-size: 28px !important; }
  [dir="rtl"] .text-2xl { font-size: 32px !important; }
  [dir="rtl"] .text-3xl { font-size: 36px !important; }
  [dir="rtl"] .ltr-only {
    direction: ltr;
    text-align: left;
  }
`;

// ─── COMPREHENSIVE URDU DICTIONARY & TRANSLATION SYSTEM ────────────────────────

const AUTO_URDU_DICT: Record<string, string> = {
  // Navigation & Core
  Home: "ہوم",
  Analytics: "تجزیات",
  News: "خبریں",
  Voice: "آواز",
  "Voice On": "آواز آن",
  "Voice Off": "آواز آف",
  "Voice Query": "آواز سے تلاش",
  "Voice Search": "آواز سے تلاش",
  "Live Market": "لائیو مارکیٹ",
  "My Products": "میری مصنوعات",
  "MY PRODUCTS": "میری مصنوعات",
  Favorites: "پسندیدہ",
  FAVORITES: "پسندیدہ",
  "Today's Rates": "آج کے نرخ",
  Subscribe: "سبسکرائب",
  "+ Subscribe": "+ سبسکرائب",
  ACTIVE: "فعال",
  Active: "فعال",
  Search: "تلاش",
  "Search product or byproduct...": "اجناس یا ضمنی مصنوع تلاش کریں…",
  "Search product or byproduct…": "اجناس یا ضمنی مصنوع تلاش کریں…",
  "Search product or byproduct…": "اجناس یا ضمنی مصنوع تلاش کریں…",
  "Search Mandis, Cities...": "منڈیاں یا شہر تلاش کریں…",
  "Search byproducts...": "ضمنی مصنوعات تلاش کریں…",
  "Search products...": "مصنوعات تلاش کریں…",
  "Muhammad Arif": "محمد عارف",
  "Pakpattan Mandi": "پاکپتن منڈی",
  Pakpattan: "پاکپتن",
  Today: "آج",
  Yesterday: "گزشتہ کل",
  All: "سب",
  "All Mandis": "تمام منڈیاں",
  "All Verticals": "تمام شعبے",
  "All Pakistan": "پورا پاکستان",
  Pakistan: "پاکستان",
  Punjab: "پنجاب",
  Sindh: "سندھ",
  KPK: "خیبر پختونخوا",
  Balochistan: "بلوچستان",
  Islamabad: "اسلام آباد",
  Lahore: "لاہور",
  Faisalabad: "فیصل آباد",
  Multan: "ملتان",
  Okara: "اوکاڑہ",
  Sahiwal: "ساہیوال",
  Sargodha: "سرگودھا",
  Bahawalpur: "بہاولپور",
  "Rahim Yar Khan": "رحیم یار خان",
  Gujranwala: "گوجرانوالہ",
  Rawalpindi: "راولپنڈی",
  Peshawar: "پشاور",
  Quetta: "کوئٹہ",
  Karachi: "کراچی",
  Hyderabad: "حیدرآباد",
  Sukkur: "سکھر",
  Jhang: "جھنگ",
  Kasur: "قصور",
  Vehari: "وہاڑی",
  Khanewal: "خانیوال",
  Chiniot: "چنیوٹ",
  Sheikhupura: "شیخوپورہ",
  Burewala: "بورے والا",
  "D.G. Khan": "ڈیرہ غازی خان",
  "D.I. Khan": "ڈیرہ اسماعیل خان",
  "Mandi Bahauddin": "منڈی بہاؤالدین",
  Bahawalnagar: "بہاولنگر",
  Muzaffargarh: "مظفر گڑھ",
  Layyah: "لیہ",
  Lodhran: "لودھراں",
  "Toba Tek Singh": "ٹوبہ ٹیک سنگھ",
  Hafizabad: "حافظ آباد",
  "Nankana Sahib": "ننکانہ صاحب",
  Attock: "اٹک",
  Chakwal: "چکوال",
  Jhelum: "جہلم",
  Mianwali: "میانوالی",
  Bhakkar: "بھکر",
  Khushab: "خوشاب",
  Sialkot: "سیالکوٹ",
  Narowal: "نارووال",
  Gujrat: "گجرات",

  // Verticals / Categories
  Grains: "اجناس و اناج",
  Fruits: "پھل",
  Vegetables: "سبزیاں",
  Livestock: "مویشی",
  "Agri-Inputs": "زرعی کھاد و ادویات",
  Fertilizer: "کھاد",
  "Dry-Fruits": "خشک میوہ جات",
  Herbals: "جڑی بوٹیاں",
  Kiryana: "کریانہ",
  Oilseeds: "تیل دار اجناس",
  Fodder: "چارہ",
  "Cotton & Fiber": "کپاس و ریشہ",
  "Sugar & Sweeteners": "چینی و میٹھا",

  // products
  Wheat: "گندم",
  Maize: "مکئی",
  Cotton: "کپاس",
  Rice: "چاول",
  Paddy: "دھان",
  Millet: "باجرہ",
  Sesame: "تل",
  "Edible Oil": "خوردنی تیل",
  Canola: "کینولا",
  Soybean: "سویا بین",
  Sunflower: "سورج مکھی",
  Sugarcane: "گنا",
  Sugar: "چینی",
  Mustard: "سرسوں",
  Raya: "رایا",
  Barley: "جو",
  Sorghum: "جوار",
  Oat: "جئی",
  Gram: "چنا",
  Pulses: "دالیں",
  Moong: "مونگ",
  Mash: "ماش",
  Masoor: "مسور",
  Dates: "کھجور",
  Mango: "آم",
  Citrus: "کنو",
  Guava: "امرود",
  Apple: "سیب",
  Banana: "کیلا",
  Potato: "آلو",
  Tomato: "ٹماٹر",
  Onion: "پیاز",
  Garlic: "لہسن",
  Ginger: "ادرک",
  Chili: "مرچ",
  Milk: "دودھ",
  Meat: "گوشت",
  Eggs: "انڈے",
  Wool: "اون",
  Cattle: "گائے بیل",
  Buffalo: "بھینس",
  Goat: "بکرا / بکری",
  Sheep: "دنبہ / بھیڑ",
  Urea: "یوریا",
  DAP: "ڈی اے پی",
  NP: "این پی",
  Potash: "پوٹاش",

  // Byproducts
  "Fine Flour": "باریک آٹا",
  "Fine-Flour": "باریک آٹا",
  Flour: "آٹا",
  Atta: "آٹا",
  Bran: "چوکر",
  "Wheat Bran": "گندم چوکر",
  Semolina: "سوجی",
  Straw: "بھوسہ",
  "Wheat Straw": "گندم کا بھوسہ",
  "Maize Grain": "مکئی دانہ",
  "Corn Silage": "مکئی سائیلج",
  "Corn Gluten": "کارن گلوٹن",
  "Corn Oil": "مکئی کا تیل",
  Popcorn: "پاپ کارن",
  Phutti: "پھٹی",
  "Seed Cotton": "کپاس (پھٹی)",
  "Lint Cotton": "روئی",
  "Cotton Seed": "بنولہ",
  "Cotton Seed Cake": "بنولہ کھل",
  "Cotton Seed Oil": "بنولہ تیل",
  "Cotton Waste": "کپاس ویسٹ",
  "Basmati Super": "سپر باسمتی",
  "Basmati 1121": "باسمتی ۱۱۲۱",
  Kainat: "کائنات چاول",
  "IRRI-6": "ارری-۶",
  "IRRI-9": "ارری-۹",
  "Broken Rice": "ٹوٹا چاول",
  "Rice Bran": "چاول چوکر",
  "Rice Husk": "چاول بھوسی",
  "Rice Polish": "چاول پالش",
  Husk: "بھوسی",
  Oil: "تیل",
  Cake: "کھل",
  Molasses: "شیرہ",
  Bagasse: "کھوئی / بگاس",
  Gur: "گڑ",
  Jaggery: "گڑ",
  Shakar: "شکر",
  "Brown Sugar": "شکر",
  "White Sugar": "سفید چینی",

  // Rate Types & Terminology
  "Mill Rate": "مل ریٹ",
  "Farm Rate": "فارم ریٹ",
  "Wholesale Rate": "تھوک ریٹ",
  "Retail Rate": "پرچون ریٹ",
  "Market Rate": "مارکیٹ ریٹ",
  "Mandi Rate": "منڈی ریٹ",
  Mill: "مل",
  Farm: "فارم",
  Wholesale: "تھوک",
  Retail: "پرچون",
  Market: "مارکیٹ",
  Arrival: "آمد",
  Arrivals: "آمد",
  Rate: "ریٹ",
  Rates: "نرخ / ریٹس",
  Price: "قیمت",
  Prices: "قیمتیں",
  Min: "کم از کم",
  Max: "زیادہ سے زیادہ",
  Avg: "اوسط",
  Average: "اوسط",
  Change: "تبدیلی",
  Trend: "رجحان",
  Stable: "مستحکم",
  Up: "اضافہ",
  Down: "کمی",
  Volume: "حجم",
  High: "زیادہ",
  Low: "کم",
  Rs: "روپے",
  PKR: "روپے",
  "Rs.": "روپے",
  Maund: "من",
  "40kg": "۴۰ کلو",
  "100kg": "۱۰۰ کلو",
  "50kg": "۵۰ کلو",
  "40 kg": "۴۰ کلو",
  Bag: "بوری",
  Bags: "بوریاں",
  Ton: "ٹن",
  MT: "میٹرک ٹن",
  Kilo: "کلو",
  Kg: "کلو",

  // Deep View, Attributes & Quality
  Overview: "جائزہ",
  Trends: "رجحانات",
  "Price Trends": "قیمت کے رجحانات",
  "Price Trend": "قیمت کا رجحان",
  "Arrival Trend": "آمد کا رجحان",
  "Today's Overview": "آج کا جائزہ",
  "Overview in Pakistan": "پاکستان میں جائزہ",
  National: "قومی",
  "RATE TYPE": "نرخ کی قسم",
  "Rate Type": "نرخ کی قسم",
  "Price Type": "نرخ کی قسم",
  "Price Types": "نرخ کی اقسام",
  VARIETY: "قسم",
  Variety: "قسم",
  "NEW/OLD": "نیا / پرانا",
  "New / Old": "نیا / پرانا",
  New: "نیا",
  Old: "پرانا",
  COLOR: "رنگ",
  Color: "رنگ",
  SPEC: "خصوصیت",
  Specifications: "خصوصیات",
  Specification: "خصوصیت",
  CONDITION: "حالت",
  Condition: "حالت",
  Quality: "معیار",
  Station: "منڈی / اسٹیشن",
  "Min – Max": "کم – زیادہ",
  "Seed Quality": "بیج کا معیار",
  Damage: "خراب",
  "Export Grade": "ایکسپورٹ گریڈ",
  Wet: "گیلا",
  Dry: "خشک",
  Mix: "ملا جلا",
  Golden: "سنہری",
  White: "سفید",
  Yellow: "زرد",
  Cleaned: "صاف شدہ",
  Uncleaned: "غیر صاف شدہ",
  "Sona Moti": "سونا موتی",
  "TD-1": "ٹی ڈی-۱",
  SurSabz: "سرسسبز",
  Akbar: "اکبر",
  Anaj: "اناج",
  Ujala: "اجالا",
  Galaxy: "گلیکسی",
  Dilkush: "دلکش",
  Arooj: "عروج",
  Subham: "سبھم",
  "Special Flour": "خصوصی آٹا",
  "All Provinces": "تمام صوبے",
  "Clear (Today)": "ہٹائیں (آج)",
  "Clear date": "تاریخ ہٹائیں",
  "Clear selection": "انتخاب ہٹائیں",
  "Not in mandi": "منڈی میں نہیں",
  Mandi: "منڈی",
  Mandis: "منڈیاں",
  mandis: "منڈیاں",
  mandi: "منڈی",
  "tap row to view details": "تفصیل کے لیے منتخب کریں",
  "No data available.": "ڈیٹا دستیاب نہیں۔",
  "No mandi data": "منڈی ڈیٹا دستیاب نہیں",
  "No matching rows": "کوئی مماثل ریکارڈ نہیں",
  "Need older data?": "پرانا ڈیٹا درکار ہے؟",
  "Ask our team for history beyond what's shown.":
    "مزید تاریخی ڈیٹا کے لیے ہماری ٹیم سے رابطہ کریں۔",
  "Request →": "درخواست کریں ←",
  "Select Date": "تاریخ منتخب کریں",
  "Filter comparison by date or range": "تاریخ یا مدت کے لحاظ سے فلٹر کریں",
  "This Week": "اس ہفتے",
  "Compare across multiple days": "متعدد دنوں کا موازنہ کریں",
  "Latest available rates": "تازہ ترین دستیاب نرخ",
  "Previous day rates": "پچھلے دن کے نرخ",
  "Unit = Rs. · Unit = (40 kg)": "اکائی = روپے · وزن = (۴۰ کلو)",
  Days: "دن",
  "Price (Rs/40kg)": "قیمت (روپے / ۴۰ کلو)",
  "Arrivals (MT)": "آمد (میٹرک ٹن)",
  Jan: "جنوری",
  Feb: "فروری",
  Mar: "مارچ",
  Apr: "اپریل",
  May: "مئی",
  Jun: "جون",
  Jul: "جولائی",
  Aug: "اگست",
  Sep: "ستمبر",
  Oct: "اکتوبر",
  Nov: "نومبر",
  Dec: "دسمبر",
  January: "جنوری",
  February: "فروری",
  March: "مارچ",
  April: "اپریل",
  June: "جون",
  July: "جولائی",
  August: "اگست",
  September: "ستمبر",
  October: "اکتوبر",
  November: "نومبر",
  December: "دسمبر",
  Sunday: "اتوار",
  Monday: "پیر",
  Tuesday: "منگل",
  Wednesday: "بدھ",
  Thursday: "جمعرات",
  Friday: "جمعہ",
  Saturday: "ہفتہ",
  Sun: "اتوار",
  Mon: "پیر",
  Tue: "منگل",
  Wed: "بدھ",
  Thu: "جمعرات",
  Fri: "جمعہ",
  Sat: "ہفتہ",
  week: "ہفتہ",
  month: "مہینہ",
  quarter: "سہ ماہی",
  Week: "ہفتہ",
  Month: "مہینہ",
  Quarter: "سہ ماہی",

  // UI Actions & Labels
  "Select Products": "مصنوعات منتخب کریں",
  "Select Product": "مصنوع منتخب کریں",
  Products: "مصنوعات",
  Product: "مصنوعات",
  "By Products": "ضمنی مصنوعات",
  Byproducts: "ضمنی مصنوعات",
  "By Product": "ضمنی مصنوع",
  Byproduct: "ضمنی مصنوع",
  "Your Picks": "آپ کی پسند",
  "Select Your Picks": "اپنی پسند منتخب کریں",
  "Choose byproducts to track on your home screen":
    "ہوم اسکرین پر دیکھنے کے لیے ضمنی مصنوعات منتخب کریں",
  "Tap products to add them": "شامل کرنے کے لیے ٹیپ کریں",
  "Tap a product · + add more": "ٹیپ کریں · مزید شامل کریں",
  "View 1 Product →": "۱ مصنوع دیکھیں ←",
  "View Products →": "مصنوعات دیکھیں ←",
  "See All Mandi Rates for Wheat →": "گندم کے تمام منڈی ریٹ دیکھیں ←",
  "Search Again": "دوبارہ تلاش کریں",
  "No data for today": "آج کا ڈیٹا موجود نہیں",
  "No data available": "ڈیٹا دستیاب نہیں ہے",
  "No by-products found": "کوئی ضمنی مصنوعات نہیں ملیں",
  "No results found": "کوئی نتیجہ نہیں ملا",
  "Loading...": "لوڈ ہو رہا ہے…",
  Close: "بند کریں",
  Cancel: "منسوخ",
  Apply: "لاگو کریں",
  Done: "مکمل",
  Save: "محفوظ کریں",
  Back: "واپس",
  Next: "اگلا",
  Reset: "ری سیٹ",
  "Clear all": "سب صاف کریں",
  Filter: "فلٹر",
  Filters: "فلٹرز",
  "Sort by": "ترتیب دیں",
  "Highest Price": "سب سے زیادہ قیمت",
  "Lowest Price": "سب سے کم قیمت",
  "Highest Arrival": "سب سے زیادہ آمد",
  Notifications: "اطلاعات",
  "Market Updates": "مارکیٹ اپڈیٹس",
  "Live Ticker": "لائیو ٹکر",
  "Historical Data": "تاریخی ڈیٹا",
  "Deep View": "تفصیلی جائزہ",
  "Request Data": "ڈیٹا کی درخواست کریں",
  "Select Mandi": "منڈی منتخب کریں",
  "Select Location": "مقام منتخب کریں",
  "Price Filter": "قیمت کا فلٹر",
  "Reset Price Filter": "قیمت فلٹر ہٹائیں",
  "↺ Reset Price Filter": "↺ قیمت فلٹر ہٹائیں",
  "Tap to hear it": "سننے کے لیے ٹیپ کریں",
  "byproducts selected": "ضمنی مصنوعات منتخب ہیں",
  selected: "منتخب",
  "Unlock Full Access": "مکمل رسائی حاصل کریں",
  "Upgrade your account to unlock all products and detailed market analytics.":
    "تمام اجناس اور تفصیلی مارکیٹ تجزیات تک رسائی کے لیے اکاؤنٹ اپگریڈ کریں۔",
  "Upgrade Now": "ابھی اپگریڈ کریں",
  "Not Now": "بعد میں",
};

const TRANS: Record<string, { en: string; ur: string }> = {
  // Navigation
  "nav.home": { en: "Home", ur: "ہوم" },
  "nav.analytics": { en: "Analytics", ur: "تجزیات" },
  "nav.news": { en: "News", ur: "خبریں" },
  "nav.voice": { en: "Voice", ur: "آواز" },

  // Common
  "common.all": { en: "All", ur: "سب" },
  "common.back": { en: "←", ur: "→" },
  "common.today": { en: "Today", ur: "آج" },
  "common.byproducts": { en: "By Products", ur: "ضمنی مصنوعات" },
  "common.prod": { en: "Prod", ur: "مصنوع" },
  "common.byp": { en: "ByP", ur: "ضمنی" },
  "common.price": { en: "Price", ur: "قیمت" },
  "common.noData": { en: "No data for today", ur: "آج کا ڈیٹا موجود نہیں" },
  "common.resetFilter": {
    en: "↺ Reset Price Filter",
    ur: "↺ قیمت فلٹر ہٹائیں",
  },
  "common.noByproducts": {
    en: "No by-products found",
    ur: "ضمنی مصنوعات نہیں ملیں",
  },
  "common.pakistan": { en: "Pakistan", ur: "پاکستان" },

  // Home screen
  "home.search": {
    en: "Search product or byproduct…",
    ur: "اجناس یا ضمنی مصنوع تلاش کریں…",
  },
  "home.product": { en: "Product", ur: "مصنوعات" },
  "home.liveMarket": { en: "Live Market", ur: "لائیو مارکیٹ" },
  "home.mandi": { en: "Mandi", ur: "منڈی" },
  "home.yourPicks": { en: "Your Picks", ur: "آپ کی پسند" },
  "home.tapToHear": { en: "Tap to hear it", ur: "سننے کے لیے ٹیپ کریں" },
  "home.pakpattan": { en: "Pakpattan Mandi", ur: "پاکپتن منڈی" },
  "home.selectedCount": { en: "byproducts selected", ur: "ضمنی مصنوعات منتخب" },
  "home.langToggle": { en: "اردو", ur: "انگریزی" },

  // Product selection
  "prodsel.title": { en: "Product", ur: "مصنوعات" },
  "prodsel.selectProducts": { en: "Select Products", ur: "مصنوعات منتخب کریں" },
  "prodsel.tapToAdd": {
    en: "Tap products to add them",
    ur: "شامل کرنے کے لیے ٹیپ کریں",
  },
  "prodsel.tapAndAdd": {
    en: "Tap a product · + add more",
    ur: "ٹیپ کریں · مزید شامل کریں",
  },
  "prodsel.products": { en: "Products", ur: "مصنوعات" },
  "prodsel.viewSingle": { en: "View 1 Product →", ur: "۱ مصنوع دیکھیں ←" },

  // Rate types
  "rate.Mill Rate": { en: "Mill Rate", ur: "مل ریٹ" },
  "rate.Farm Rate": { en: "Farm Rate", ur: "فارم ریٹ" },
  "rate.Wholesale Rate": { en: "Wholesale Rate", ur: "تھوک ریٹ" },
  "rate.Retail Rate": { en: "Retail Rate", ur: "پرچون ریٹ" },
  "rate.Market Rate": { en: "Market Rate", ur: "مارکیٹ ریٹ" },

  // products
  "c.Wheat": { en: "Wheat", ur: "گندم" },
  "c.Maize": { en: "Maize", ur: "مکئی" },
  "c.Cotton": { en: "Cotton", ur: "کپاس" },
  "c.Rice": { en: "Rice", ur: "چاول" },
  "c.Paddy": { en: "Paddy", ur: "دھان" },
  "c.Millet": { en: "Millet", ur: "باجرہ" },
  "c.Sesame": { en: "Sesame", ur: "تل" },
  "c.Fertilizer": { en: "Fertilizer", ur: "کھاد" },
  "c.Livestock": { en: "Livestock", ur: "مویشی" },
  "c.Dates": { en: "Dates", ur: "کھجور" },
  "c.Edible Oil": { en: "Edible Oil", ur: "خوردنی تیل" },
  "c.Sugarcane": { en: "Sugarcane", ur: "گنا" },
  "c.Pulses": { en: "Pulses", ur: "دالیں" },
  "c.Vegetables": { en: "Vegetables", ur: "سبزیاں" },
  "c.Fruits": { en: "Fruits", ur: "پھل" },
  "c.Fine Flour": { en: "Fine Flour", ur: "باریک آٹا" },
  "c.Bran": { en: "Bran", ur: "چوکر" },
  "c.Flour": { en: "Flour", ur: "آٹا" },
  "c.Straw": { en: "Straw", ur: "بھوسہ" },
  "c.Husk": { en: "Husk", ur: "بھوسی" },
  "c.Oil": { en: "Oil", ur: "تیل" },
  "c.Cake": { en: "Cake", ur: "کھل" },
  "c.Canola": { en: "Canola", ur: "کینولا" },
  "c.Soybean": { en: "Soybean", ur: "سویا بین" },
  "c.Sunflower": { en: "Sunflower", ur: "سورج مکھی" },
  "c.Milk": { en: "Milk", ur: "دودھ" },
  "c.Meat": { en: "Meat", ur: "گوشت" },
  "c.Eggs": { en: "Eggs", ur: "انڈے" },
  "c.Wool": { en: "Wool", ur: "اون" },

  // Orientation voice
  "orient.search": {
    en: "Search. Find any product or byproduct by name to see its prices.",
    ur: "تلاش۔ کسی بھی اجناس یا ضمنی مصنوع کا نام لکھ کر قیمت دیکھیں۔",
  },
  "orient.product": {
    en: "Product. Select a crop or product to discover its byproduct prices.",
    ur: "مصنوعات۔ اپنی فصل منتخب کریں اور ضمنی مصنوعات کی قیمتیں دیکھیں۔",
  },
  "orient.liveMarket": {
    en: "Live Market. See real-time prices from active mandis across Pakistan.",
    ur: "لائیو مارکیٹ۔ پاکستان کی منڈیوں کی براہ راست قیمتیں دیکھیں۔",
  },
  "orient.mandi": {
    en: "Mandi. Browse all markets across Pakistan and see today's rates.",
    ur: "منڈی۔ پاکستان کی تمام منڈیاں دیکھیں اور آج کی قیمتیں جانیں۔",
  },
  "orient.notif": {
    en: "Notification bell. All market updates and alerts are shown here.",
    ur: "اطلاع۔ تمام مارکیٹ اپڈیٹس اور الرٹس یہاں دکھائے جاتے ہیں۔",
  },
  "orient.yourPicks": {
    en: "Your Picks. Your favourite byproducts are shown here on your homescreen.",
    ur: "آپ کی پسند۔ آپ کی پسندیدہ ضمنی مصنوعات یہاں دکھائی جاتی ہیں۔",
  },

  // Voice product tap
  "voice.locked": {
    en: "This product is locked. Please upgrade to access it.",
    ur: "یہ مصنوع لاک ہے۔ رسائی کے لیے اپگریڈ کریں۔",
  },
  "voice.selected": { en: "selected", ur: "منتخب" },
  "voice.findPrices": {
    en: "Find out prices of byproducts of",
    ur: "ضمنی مصنوعات کی قیمتیں جانیں",
  },

  // Misc screens
  "screen.search.title": { en: "Search", ur: "تلاش" },
  "screen.mandi.title": { en: "Mandi", ur: "منڈی" },
  "screen.analytics.title": { en: "Analytics", ur: "تجزیات" },
  "screen.news.title": { en: "Market Updates", ur: "مارکیٹ اپڈیٹس" },
};

type Lang = "en" | "ur";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  tc: (name: string) => string;
  tm: (mandiName: string) => string;
  tr: (rateType: string) => string;
  voiceEnabled: boolean;
  setVoiceEnabled: (v: boolean) => void;
}

const LangContext = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  t: (k) => TRANS[k]?.en ?? (AUTO_URDU_DICT[k] || k),
  tc: (n) => n,
  tm: (m) => m,
  tr: (r) => r,
  voiceEnabled: false,
  setVoiceEnabled: () => {},
});

function useLang() {
  return useContext(LangContext);
}

// Module-level lang for speakText (synced by LangProvider)
let appLang: Lang = "en";

function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const setLang = (l: Lang) => {
    setLangState(l);
    appLang = l;
  };

  const t = (key: string): string => {
    if (!key) return "";
    if (TRANS[key]?.[lang]) return TRANS[key][lang];
    if (lang === "ur") {
      return AUTO_URDU_DICT[key] || AUTO_URDU_DICT[key.trim()] || key;
    }
    return TRANS[key]?.en || key;
  };

  const tc = (name: string): string => {
    if (!name) return "";
    if (lang === "en") return name;
    return (
      TRANS[`c.${name}`]?.ur ||
      AUTO_URDU_DICT[name] ||
      AUTO_URDU_DICT[name.trim()] ||
      name
    );
  };

  const tm = (mandiName: string): string => {
    if (!mandiName) return "";
    if (lang === "en") return mandiName;
    return (
      AUTO_URDU_DICT[mandiName] || AUTO_URDU_DICT[mandiName.trim()] || mandiName
    );
  };

  const tr = (rateType: string): string => {
    if (!rateType) return "";
    if (lang === "en") return rateType;
    return (
      TRANS[`rate.${rateType}`]?.ur ||
      AUTO_URDU_DICT[rateType] ||
      AUTO_URDU_DICT[rateType.trim()] ||
      rateType
    );
  };

  return (
    <>
      <style>{ZM_THEME_CSS}</style>
      <LangContext.Provider
        value={{ lang, setLang, t, tc, tm, tr, voiceEnabled, setVoiceEnabled }}
      >
        {children}
      </LangContext.Provider>
    </>
  );
}

//  TYPES

type RateItem = { vertical: string; product: string; byproduct: string };
type Screen =
  | { id: "home" }
  | { id: "search" }
  | { id: "mandi-list" }
  | {
      id: "mandi-detail";
      mandiId: string;
    }
  | { id: "product-select" }
  | { id: "byproduct-select" }
  | {
      id: "rates-result";
      items: RateItem[];
      source: "product" | "byproduct";
    }
  | {
      id: "byproduct-combined";
      products: { vertical: string; product: string }[];
      active: number;
    }
  | {
      id: "product-rates";
      vertical: string;
      product: string;
      byproduct: string;
      initialRateType?: string;
      initialMandi?: string;
      initialVariety?: string;
      initialNewOld?: string;
      initialColor?: string;
      initialSpec?: string;
      initialCondition?: string;
      initialStatDate?: string;
    }
  | { id: "analytics" }
  | { id: "news" }
  | {
      id: "live-market";
    }
  | {
      id: "billing";
      product: string;
      vertical?: string;
    };

type LocationScope = {
  kind: "district" | "province" | "pakistan" | "mandi";
  label: string;
};

type NavTab = "home" | "analytics" | "news" | "voice";
type TimeRange = "day" | "week" | "month" | "year";
type AnalyticsTab = "trends" | "allrates" | "compare" | "regional";

type FeedMsg = {
  id: number;
  time: string;
  vertical: string;
  productUrdu: string;
  product: string;
  byproduct: string;
  stationUrdu: string;
  station: string;
  province: string;
  priceMin: number;
  priceMax: number;
  unit: string;
  arrivalCount: string;
  arrivalUnit: string;
  arrivalUnitUrdu: string;
  colorUrdu: string;
  color: string;
  rateType: string;
  specUrdu: string;
  spec: string;
  qualityUrdu: string;
  quality: string;
  qualityTypeUrdu: string;
  qualityType: string;
  trend?: "up" | "down" | "stable";
  trendPct?: number;
};

//  COMPLETE VERTICALS DATA

const VERTICALS: Record<
  string,
  {
    icon: string;
    urdu: string;
    products: Record<string, string[]>;
  }
> = {
  Grains: {
    icon: "grains",
    urdu: "اناج",
    products: {
      Wheat: [
        "Wheat",
        "Fine Flour",
        "Flour",
        "Bran",
        "Semolina",
        "Straw",
        "Sorghum",
        "Barley",
        "Oat",
        "Special Flour",
      ],
      Rice: [
        "1121 Basmati-1",
        "1121 Basmati-2",
        "1509 Steam",
        "1509 Sella",
        "386 Basmati-New",
        "386 Basmati-Old",
        "Irri 6",
        "Irri 9",
        "Super Basmati",
        "Sella 1121-1",
        "C-9 Basmati",
        "C-9 Steam",
        "C-9 White",
        "Rice Polish",
        "Broken Irri 6",
        "Rice Husk",
        "Super Kernel",
        "Punia Basmati-1",
        "Punia 1121-1",
        "Supri New",
        "Supri Old",
        "1121 Steam",
        "1509 White",
        "PP-7",
      ],
      Paddy: [
        "Paddy Irri 6",
        "Paddy Irri 9",
        "Paddy 1509",
        "Paddy Kainat-1121",
        "Paddy Super 515",
        "Paddy 386",
        "Paddy 1847",
        "Paddy C-9",
        "Paddy Super",
        "Paddy PP-7",
        "Paddy Diamond",
      ],
      Maize: [
        "Maize Grade A",
        "Maize Grade B",
        "Maize Grade C",
        "Corn Silage",
        "Popcorn",
      ],
      Cotton: [
        "Cotton Grade A",
        "Cotton Grade B",
        "Cotton Grade C",
        "Cotton Seed",
        "Cotton Seed Oil",
        "Cotton Seed Cake",
        "Lint Cotton",
      ],
      Sugar: [
        "Sugarcane",
        "Sugar (Mill)",
        "Sugar (Wholesale)",
        "Jaggery",
        "Brown Sugar",
        "Sugar (Retail)",
      ],
      Mustard: ["Mustard Seed", "Mustard Oil", "Mustard Cake"],
      Canola: ["Canola Seed", "Canola Oil", "Canola Meal"],
      Sunflower: ["Sunflower Seed", "Sunflower Oil", "Sunflower Meal"],
      Millet: ["Millet Grade A", "Millet Grade B", "Millet Grade C"],
      Pulses: [
        "Red Lentil",
        "Whole Red Lentil Large",
        "Whole Red Lentil Small",
        "Black Chickpea Large",
        "Black Chickpea Small",
        "Split Chickpea Large",
        "Kabuli Chickpea 7mm",
        "Kabuli Chickpea 9mm",
        "Whole Green Gram Large",
        "Split Green Gram Washed",
        "Whole Black Gram Small",
        "Pigeon Pea Large",
        "Red Kidney Bean Large",
        "White Kidney Bean Large",
      ],
      Sesame: ["Sesame Grade A", "Sesame Grade B", "Sesame Grade C"],
      Spices: [
        "Red Chilli",
        "Red Chilli Powder",
        "Coriander Seed",
        "Coriander Seed Powder",
        "White Cumin",
        "Black Cumin",
        "Turmeric",
        "Black Pepper",
        "Black Pepper Powder",
        "Fennel",
        "Cinnamon",
        "Clove",
        "Small Cardamom",
        "Large Black Cardamom",
        "Longi Chilli",
        "Hybrid Chilli",
      ],
      Dates: [
        "Ajwa Dates",
        "Aseel Dates",
        "Mazafati Dates",
        "Rabbi Dates",
        "Amber Dates",
        "Begum Jangi Dates",
        "Aseel Dry Dates",
        "Dhaki Dry Dates",
      ],
      Soybean: ["Soybean Seed", "Soybean Oil", "Soybean Meal"],
    },
  },
  Fruits: {
    icon: "fruits",
    urdu: "پھل",
    products: {
      Mango: [
        "Mango Sindhri",
        "Mango White Chunsa",
        "Mango Black Chunsa",
        "Mango Anwer Ratul",
        "Mango Fajri",
        "Mango Dasheri",
        "Mango Almas",
        "Mango Saroli",
      ],
      Banana: ["Banana"],
      Citrus: [
        "Orange",
        "Musambi",
        "Grapefruit",
        "Mandarin",
        "Sweet Lime",
        "Fruiter",
      ],
      Melon: ["Watermelon", "Melon"],
      Apple: ["Apple Kala Kullu", "Apple", "Apple Golden"],
      Pomegranate: ["Pomegranate"],
      Grapes: ["Grapes"],
      Peach: ["Peach"],
      Apricot: ["Apricot"],
      Papaya: ["Papaya"],
      Cherry: ["Cherry"],
      Plum: ["Plum"],
      Falsa: ["Falsa"],
    },
  },
  Vegetables: {
    icon: "vegetables",
    urdu: "سبزیاں",
    products: {
      Potato: [
        "Potato (Mozika)",
        "Potato (Santa)",
        "Potato (Red)",
        "Potato (White)",
        "Potato (Goli)",
        "Potato (Raveera)",
        "Potato (Seed)",
      ],
      Tomato: ["Tomato (Grade A)", "Tomato (Grade B)", "Tomato (Grade C)"],
      Onion: ["Onion (Grade A)", "Onion (Grade B)", "Onion (Grade C)"],
      Garlic: ["Garlic Desi", "Garlic Chinese", "Garlic G1", "Garlic Harnai"],
      Chilli: [
        "Desi Chilli",
        "Green Chilli - Small",
        "Green Chilli - Medium",
        "Green Chilli - Large",
        "Capsicum",
      ],
      Cauliflower: ["Cauliflower"],
      Cabbage: ["Cabbage"],
      Brinjal: ["Brinjal Round", "Brinjal Long"],
      Carrot: ["Carrot"],
      Spinach: ["Spinach"],
      Peas: ["Peas"],
      Guar: ["Guar"],
      Okra: ["Okra"],
      Cucumber: ["Cucumber"],
      Bitter_Gourd: ["Bitter Gourd"],
      Bottle_Gourd: ["Bottle Gourd", "Round Gourd"],
      Ridge_Gourd: ["Ridge Gourd"],
      Ginger: ["Ginger"],
      Lemon: ["Lemon Desi", "Lemon China"],
      Turnip: ["Turnip"],
      "Sweet Potato": ["Sweet Potato"],
      Broccoli: ["Broccoli"],
    },
  },
  Livestock: {
    icon: "livestock",
    urdu: "مویشی",
    products: {
      "Cattle Market": ["Cow", "Buffalo", "Goat", "Camel"],
      "Slaughter House": ["Cow", "Buffalo", "Goat"],
      Poultry: ["Broiler", "Layer"],
      Dairy: ["Milk", "Yogurt", "Butter"],
      Fisheries: ["Rohu", "Catla", "Tilapia"],
      Feed: [
        "Alfalfa",
        "Rhode Grass",
        "Corn Silage",
        "Wheat Bran",
        "Canola Meal",
        "Soybean Meal",
        "Mustard Seed Cake",
        "Cotton Seed Cake",
        "Wheat Straw",
      ],
    },
  },
  "Agri Inputs": {
    icon: "agri-inputs",
    urdu: "زرعی ان پٹس",
    products: {
      Fertilizer: [
        "Urea",
        "DAP",
        "NP",
        "NPK",
        "SOP-G",
        "SSP",
        "MOP",
        "Ammonium Nitrate",
        "Ammonium Sulphate",
        "TSP",
        "CAN",
        "Zabardast Urea",
        "Pak Arab Guara",
      ],
      Pesticide: [
        "Chlorphenapyr 36% SC",
        "Clothianidin 20% EC",
        "Mesotrione + Atrazine 50% WP",
        "Mesotrione + Atrazine 55% WP",
      ],
      Weedicide: [
        "S-Metolachlor 960EC 800ML",
        "Glyphosate",
        "Mesotrione + Atrazine 50% WP",
      ],
    },
  },
  "Dry Fruits": {
    icon: "dry-fruits",
    urdu: "خشک میوہ",
    products: {
      Almonds: ["Almond (American)", "Almond (Australian)", "Almond (Desi)"],
      Cashew: ["Cashew"],
      Walnut: ["Walnut"],
      Fig: ["Fig"],
      Pistachio: ["Pistachio"],
      Raisins: ["Dried Raisins"],
    },
  },
  Herbals: {
    icon: "herbals",
    urdu: "جڑی بوٹیاں",
    products: {
      Honey: ["Honey"],
      Psyllium: ["Psyllium Seed", "Psyllium Husk"],
      "Black Seed": ["Black Seed", "Black Seed Oil"],
      "Carom Seed": ["Carom Seed"],
      "Basil Seed": ["Basil Seed"],
      "Chia Seed": ["Chia Seed"],
      Saffron: ["Saffron"],
      Asafoetida: ["Asafoetida"],
    },
  },
  Kiryana: {
    icon: "kiryana",
    urdu: "کریانہ",
    products: {
      Wheat: ["Wheat", "Fine Flour", "Flour", "Semolina", "Special Flour"],
      Rice: [
        "1121 Basmati-1",
        "1121 Basmati-2",
        "Irri 6",
        "Irri 9",
        "C-9 Basmati",
        "C-9 Steam",
        "Rice Polish",
        "Supri New",
        "1509 Steam",
        "1121 Steam",
      ],
      Maize: ["Maize Grade A"],
      Millet: ["Millet Grade A"],
      Sugar: ["Sugar", "Jaggery"],
      Mustard: ["Mustard Oil"],
      Pulses: [
        "Red Lentil",
        "Black Chickpea Large",
        "Kabuli Chickpea 7mm",
        "Split Green Gram Washed",
      ],
      Spices: [
        "Red Chilli",
        "White Cumin",
        "Turmeric",
        "Black Pepper",
        "Coriander Seed",
        "Cinnamon",
        "Clove",
      ],
      Eggs: ["Eggs"],
    },
  },
};

//  PRODUCT DIVISIONS

type ProdDiv = {
  name: string;
  type: "product" | "vertical";
  img?: string;
  byproducts?: string[];
  products?: Record<string, string[]>;
};

const SUBSCRIBED_PRODUCTS = new Set<string>([
  "Wheat", "Rice", "Cotton", "Maize", "Sugar", "Pulses", "Mustard", "Sesame",
  "Millet", "Paddy", "Dates", "Spices", "Dry Fruit", "Live Market", "Fruits",
  "Vegetable", "Livestock", "Fertilizer", "Edible Oil", "Kiryana", "Herbs"
]);

export type AppProps = {
  initialUserData?: {
    name?: string;
    phone?: string;
    profession?: string;
    contact?: string;
    role?: "customer" | "representative";
    products?: string[];
    city?: string;
    district?: string;
    province?: string;
  };
  activeRole?: "customer" | "representative";
  hasRepAccount?: boolean;
  onSwitchRole?: (role: "customer" | "representative") => void;
  onStartRepOnboarding?: () => void;
  onRestartOnboarding?: (mode?: "register" | "signin") => void;
};

const TODAY_ONLY_PRODUCTS = new Set<string>([]);

function isProductSubscribed(name: string): boolean {
  return true; // Unlocked for 2-day Free Trial
}

function isProductTodayOnly(name: string): boolean {
  return false;
}

function isProductAccessible(name: string): boolean {
  return true; // All products accessible during Free Trial
}

const PRODUCT_ID_TO_NAME: Record<string, string> = {
  wheat: "Wheat",
  rice: "Rice",
  cotton: "Cotton",
  maize: "Maize",
  sugar: "Sugar",
  pulses: "Pulses",
  mustard: "Mustard",
  sesame: "Sesame",
  millet: "Millet",
  paddy: "Paddy",
  dates: "Dates",
  spices: "Spices",
  dryfruit: "Dry Fruit",
  livemarket: "Live Market",
  fruits: "Fruits",
  vegetables: "Vegetable",
  vegetable: "Vegetable",
  livestock: "Livestock",
  fertilizer: "Fertilizer",
  edibleoil: "Edible Oil",
  kiryana: "Kiryana",
  herbs: "Herbs",
};

const PRODUCT_DIVISIONS: ProdDiv[] = [
  {
    name: "Wheat",
    type: "product",
    byproducts: VERTICALS.Grains.products.Wheat,
  },
  {
    name: "Maize",
    type: "product",
    byproducts: VERTICALS.Grains.products.Maize,
  },
  {
    name: "Sesame",
    type: "product",
    byproducts: VERTICALS.Grains.products.Sesame,
  },
  {
    name: "Millet",
    type: "product",
    byproducts: VERTICALS.Grains.products.Millet,
  },
  {
    name: "Cotton",
    type: "product",
    byproducts: VERTICALS.Grains.products.Cotton,
  },
  {
    name: "Paddy",
    type: "product",
    byproducts: VERTICALS.Grains.products.Paddy,
  },
  {
    name: "Rice",
    type: "product",
    byproducts: VERTICALS.Grains.products.Rice,
  },
  {
    name: "Edible Oil",
    type: "vertical",
    products: {
      Canola: VERTICALS.Grains.products.Canola,
      Soybean: VERTICALS.Grains.products.Soybean,
      Sunflower: VERTICALS.Grains.products.Sunflower,
      Arugula: ["Arugula Seed", "Arugula Oil"],
      Castor: ["Castor Bean", "Castor Oil"],
    },
  },
  {
    name: "Fertilizer",
    type: "product",
    byproducts: VERTICALS["Agri Inputs"].products.Fertilizer,
  },
  {
    name: "Livestock",
    type: "vertical",
    products: VERTICALS.Livestock.products,
  },
  {
    name: "Dates",
    type: "product",
    byproducts: VERTICALS.Grains.products.Dates,
  },
  {
    name: "Mustard",
    type: "product",
    byproducts: VERTICALS.Grains.products.Mustard,
  },
  {
    name: "Spices",
    type: "product",
    byproducts: VERTICALS.Grains.products.Spices,
  },
  {
    name: "Pulses",
    type: "product",
    byproducts: VERTICALS.Grains.products.Pulses,
  },
  {
    name: "Kiryana",
    type: "vertical",
    products: VERTICALS.Kiryana.products,
  },
  {
    name: "Sugar",
    type: "product",
    byproducts: VERTICALS.Grains.products.Sugar,
  },
  { name: "Fruits", type: "vertical", products: VERTICALS.Fruits.products },
  {
    name: "Vegetable",
    type: "vertical",
    products: VERTICALS.Vegetables.products,
  },
  {
    name: "Dry Fruit",
    type: "vertical",
    products: VERTICALS["Dry Fruits"].products,
  },
  { name: "Herbs", type: "vertical", products: VERTICALS.Herbals.products },
];

const ALL_RATE_TYPES = [
  "Farm Rate",
  "Broker Rate",
  "Mill Rate",
  "Stock Rate",
  "Dealer Rate",
  "Mandi Rate",
  "Export Rate",
  "Retail Rate",
  "Wholesale Rate",
];
const RATE_TYPE_URDU: Record<string, string> = {
  "Farm Rate": "فارم ریٹ",
  "Broker Rate": "بروکر ریٹ",
  "Mill Rate": "مل ریٹ",
  "Stock Rate": "اسٹاک ریٹ",
  "Dealer Rate": "ڈیلر ریٹ",
  "Mandi Rate": "منڈی ریٹ",
  "Export Rate": "برآمد ریٹ",
  "Retail Rate": "خردہ ریٹ",
  "Wholesale Rate": "ہول سیل ریٹ",
};
const RATE_COLORS: Record<string, string> = {
  "Mill Rate": "#2FAE68",
  "Farm Rate": "#D79A2B",
  "Broker Rate": "#249985",
  "Mandi Rate": "#2A9D87",
  "Dealer Rate": "#D95A51",
  "Wholesale Rate": "#0891b2",
  "Stock Rate": "#A96F18",
  "Export Rate": "#0A8F73",
  "Retail Rate": "#52635F",
};
const RATE_MULTS: Record<string, number> = {
  "Farm Rate": 0.88,
  "Broker Rate": 0.95,
  "Mill Rate": 1.0,
  "Stock Rate": 1.08,
  "Dealer Rate": 1.05,
  "Mandi Rate": 1.0,
  "Export Rate": 1.12,
  "Retail Rate": 1.18,
  "Wholesale Rate": 1.02,
};

//  MANDI ATTRIBUTE AVAILABILITY
// Which attribute options are physically available per mandi (for visual graying)
const MANDI_ATTR_AVAILABLE: Record<
  string,
  {
    color: string[];
    variety: string[];
    spec: string[];
    condition: string[];
    newold: string[];
  }
> = {
  "Pakpattan Mandi": {
    color: ["Golden", "White"],
    variety: ["Sona Moti", "TD-1", "SurSabz", "Akbar"],
    spec: ["Seed Quality", "Retail"],
    condition: ["Dry", "Mix"],
    newold: ["New", "Old"],
  },
  "Lahore Mandi": {
    color: ["Golden", "White", "Yellow"],
    variety: ["Sona Moti", "TD-1", "Akbar", "Ujala", "Galaxy"],
    spec: ["Seed Quality", "Retail", "Damage"],
    condition: ["Wet", "Dry", "Mix"],
    newold: ["New", "Old"],
  },
  "Multan Mandi": {
    color: ["Golden", "Yellow"],
    variety: ["Sona Moti", "SurSabz", "Anaj", "Dilkush"],
    spec: ["Retail", "Damage"],
    condition: ["Dry", "Mix"],
    newold: ["New", "Old"],
  },
  "Faisalabad Grain Market": {
    color: ["Golden", "White"],
    variety: ["TD-1", "Ujala", "Arooj", "Subham"],
    spec: ["Seed Quality", "Retail"],
    condition: ["Wet", "Dry"],
    newold: ["New", "Old"],
  },
  "Rawalpindi Sabzi Mandi": {
    color: ["White", "Yellow"],
    variety: ["Akbar", "Anaj", "Galaxy"],
    spec: ["Retail"],
    condition: ["Dry"],
    newold: ["New", "Old"],
  },
  "Karachi Mandi": {
    color: ["Golden", "White", "Yellow"],
    variety: ["Sona Moti", "TD-1", "Akbar", "Anaj"],
    spec: ["Retail", "Seed Quality", "Damage"],
    condition: ["Dry", "Mix"],
    newold: ["New", "Old"],
  },
  "Sukkur Mandi": {
    color: ["Golden", "White"],
    variety: ["Sona Moti", "Anaj", "Dilkush"],
    spec: ["Retail", "Seed Quality"],
    condition: ["Dry", "Mix"],
    newold: ["New", "Old"],
  },
  "Hyderabad Mandi": {
    color: ["Golden", "White"],
    variety: ["Sona Moti", "TD-1", "Anaj"],
    spec: ["Retail", "Seed Quality"],
    condition: ["Dry", "Mix"],
    newold: ["New", "Old"],
  },
  "Peshawar Mandi": {
    color: ["Golden", "White", "Yellow"],
    variety: ["Sona Moti", "TD-1", "Akbar", "Anaj"],
    spec: ["Retail", "Seed Quality"],
    condition: ["Dry", "Mix"],
    newold: ["New", "Old"],
  },
  "Quetta Mandi": {
    color: ["Golden", "White"],
    variety: ["Sona Moti", "Anaj", "TD-1"],
    spec: ["Retail", "Damage"],
    condition: ["Dry"],
    newold: ["New", "Old"],
  },
  "Siranwali Mandi": {
    color: ["Golden", "White"],
    variety: ["Sona Moti", "TD-1", "Arooj", "Ujala"],
    spec: ["Seed Quality", "Retail"],
    condition: ["Wet", "Dry", "Mix"],
    newold: ["New", "Old"],
  },
  "Sargodha Mandi": {
    color: ["Golden", "White"],
    variety: ["Sona Moti", "TD-1", "Ujala", "Subham"],
    spec: ["Seed Quality", "Retail"],
    condition: ["Wet", "Dry"],
    newold: ["New", "Old"],
  },
};

// Attribute price multiplier — shared by cards and the deeper view
function computeAttrMult(
  variety?: string | null,
  color?: string | null,
  newOld?: string | null,
  spec?: string | null,
  condition?: string | null,
): number {
  let m = 1;
  if (variety)
    m *=
      {
        "Sona Moti": 1.06,
        "TD-1": 1.0,
        SurSabz: 0.97,
        Akbar: 1.02,
        Anaj: 0.99,
        Ujala: 1.04,
        Galaxy: 1.03,
        Dilkush: 0.98,
        Arooj: 1.05,
        Subham: 1.01,
      }[variety] || 1;
  if (color) m *= { Golden: 1.08, White: 1.0, Yellow: 0.95 }[color] || 1;
  if (newOld) m *= { New: 1.1, Old: 0.95 }[newOld] || 1;
  if (spec) m *= { "Seed Quality": 1.15, Retail: 1.0, Damage: 0.8 }[spec] || 1;
  if (condition) m *= { Wet: 0.92, Dry: 1.0, Mix: 0.96 }[condition] || 1;
  return m;
}

// Deterministic canonical attributes for any mandi — known mandis use explicit data, others use name hash
function getMandiCanonicalAttrs(mandiName: string): {
  variety: string;
  color: string;
  newOld: string;
  spec: string;
  condition: string;
} {
  const ma = MANDI_ATTR_AVAILABLE[mandiName];
  if (ma)
    return {
      variety: ma.variety[0],
      color: ma.color[0],
      newOld: ma.newold[0],
      spec: ma.spec[0],
      condition: ma.condition[0],
    };
  // Hash mandi name to pick consistent attributes for every other mandi
  const h = mandiName
    .split("")
    .reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
  const abs = Math.abs(h);
  const varieties = [
    "Sona Moti",
    "TD-1",
    "SurSabz",
    "Akbar",
    "Anaj",
    "Ujala",
    "Galaxy",
    "Dilkush",
    "Arooj",
    "Subham",
  ];
  const colors = ["Golden", "White", "Yellow"];
  const newOlds = ["New", "Old"];
  const specs = ["Seed Quality", "Retail", "Damage"];
  const conditions = ["Dry", "Mix", "Wet"];
  return {
    variety: varieties[abs % varieties.length],
    color: colors[(abs >> 3) % colors.length],
    newOld: newOlds[(abs >> 5) % newOlds.length],
    spec: specs[(abs >> 2) % specs.length],
    condition: conditions[(abs >> 4) % conditions.length],
  };
}

// Attach canonical attributes for a mandi and bake their price effect into min/max
function enrichRowWithAttrs(row: {
  product: string;
  byproduct: string;
  emoji: string;
  rateType: string;
  arrival: string;
  min: number;
  max: number;
  trend: "up" | "down" | "stable";
  trendPct: number;
  mandiName: string;
  mandiCity: string;
  province: string;
  vertical?: string;
}): RichRow {
  const { variety, color, newOld, spec, condition } = getMandiCanonicalAttrs(
    row.mandiName,
  );
  const mult = computeAttrMult(variety, color, newOld, spec, condition);
  return {
    ...row,
    variety,
    color,
    newOld,
    spec,
    condition,
    min: Math.round(row.min * mult),
    max: Math.round(row.max * mult),
  };
}

//  COMPLETE LOCATIONS

const LOCATIONS: Record<string, Record<string, string[]>> = {
  Punjab: {
    Okara: ["Okara Mandi", "Depalpur Mandi"],
    Pakpattan: ["Pakpattan Mandi", "Arifwala Mandi"],
    Kasur: ["Patoki Mandi"],
    Sahiwal: ["Sahiwal Mandi", "Chichawatni Mandi"],
    Vehari: ["Burewala Mandi", "Mailsi Mandi", "Vehari Mandi"],
    Khanewal: ["Khanewal Mandi", "Mian Channu Mandi"],
    Bahawalpur: ["Bahawalpur Mandi", "Yazman Mandi"],
    Bahawalnagar: [
      "Bahawalnagar Mandi",
      "Haroonabad Mandi",
      "Fort Abbas Mandi",
      "Chishtian Mandi",
      "Minchinabad Mandi",
    ],
    "Rahim Yar Khan": [
      "Rahim Yar Khan Mandi",
      "Sadiqabad Mandi",
      "Liaquatpur Mandi",
    ],
    Lodhran: ["Lodhran Mandi", "Dunyapur Mandi"],
    Multan: ["Multan Mandi"],
    Muzaffargarh: ["Muzaffargarh Mandi"],
    Layyah: ["Chowk Azam Mandi"],
    Rajanpur: ["Rajanpur Mandi"],
    "Dera Ghazi Khan": ["DG Khan Mandi"],
    Bhakkar: ["Bhakkar Mandi"],
    Mianwali: ["Mianwali Mandi"],
    Khushab: ["Khushab Mandi", "Quaidabad Mandi"],
    Jhang: ["Jhang Mandi", "Shorkot Mandi"],
    Chiniot: ["Chiniot Mandi"],
    Faisalabad: ["Faisalabad Mandi", "Samundri Mandi", "Jaranwala Mandi"],
    "Toba Tek Singh": ["Toba Tek Singh Mandi", "Gojra Mandi", "Kamalia Mandi"],
    Sargodha: ["Sargodha Mandi"],
    Gujranwala: ["Siranwali Mandi"],
    Sialkot: ["Sialkot Mandi", "Daska Mandi", "Pasrur Mandi"],
    Sheikhupura: [
      "Sheikhupura Mandi",
      "Muridke Mandi",
      "Sharqpur Mandi",
      "Faqirwali Mandi",
    ],
    "Nankana Sahib": ["Nankana Sahib Mandi", "Bucheki Mandi"],
    Hafizabad: ["Hafizabad Mandi", "Jalalpur Bhattian Mandi"],
    Lahore: ["Lahore Mandi"],
    "Mandi Bahauddin": ["Mandi Bahauddin Mandi"],
    Hasilpur: ["Hasilpur Mandi"],
    "Kahror Pacca": ["Kahror Pacca Mandi"],
    Ellahabad: ["Ellahabad Mandi"],
    "Haveli Lakha": ["Haveli Lakha Mandi"],
    "Dunga Bunga": ["Dunga Bunga Mandi"],
    Luddan: ["Luddan Mandi"],
    Qabula: ["Qabula Mandi"],
  },
  Sindh: {
    Ghotki: ["Ghotki Mandi"],
    "Shaheed Benazirabad": ["Nawabshah Mandi"],
    Sukkur: ["Sukkur Mandi", "Pano Aqil Mandi"],
    Shikarpur: ["Shikarpur Mandi"],
    Hyderabad: ["Hyderabad Mandi"],
    Mirpurkhas: ["Digri Mandi"],
    "Naushahro Feroze": ["Naushahro Feroze Mandi"],
    Khairpur: ["Khairpur Mandi"],
    Karachi: ["Karachi Mandi"],
    Umerkot: ["Kunri Mandi"],
    Thatta: ["Mirpur Sakro Mandi", "Gharo Mandi"],
    Sanghar: ["Sanghar Mandi", "Sinjhoro Mandi"],
  },
  KPK: {
    Khyber: ["Landi Kotal Mandi"],
    Peshawar: ["Peshawar Mandi"],
    Mansehra: ["Mansehra Mandi"],
    "Dera Ismail Khan": ["Dera Ismail Khan Mandi"],
    Buner: ["Buner Mandi"],
    Mardan: ["Mardan Mandi"],
  },
  Balochistan: {
    Quetta: ["Quetta Mandi"],
  },
};

const ALL_MANDI_NAMES: string[] = Object.values(LOCATIONS).flatMap((d) =>
  Object.values(d).flat(),
);

//  FEED MESSAGES

const FEED_MESSAGES: FeedMsg[] = [
  {
    id: 1,
    time: "7:15 AM",
    vertical: "Grains",
    productUrdu: "گندم",
    product: "Wheat",
    byproduct: "Wheat",
    stationUrdu: "پاکپتن",
    station: "Pakpattan Mandi",
    province: "Punjab",
    priceMin: 2750,
    priceMax: 2950,
    unit: "40 kg",
    arrivalCount: "12,400",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سنہری",
    color: "Golden",
    rateType: "Mill Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "ملنگی کوالٹی",
    qualityType: "Malangi Quality",
    trend: "up",
    trendPct: 1.8,
  },
  {
    id: 2,
    time: "7:30 AM",
    vertical: "Grains",
    productUrdu: "گندم",
    product: "Wheat",
    byproduct: "Fine Flour",
    stationUrdu: "لاہور",
    station: "Lahore Mandi",
    province: "Punjab",
    priceMin: 4300,
    priceMax: 4500,
    unit: "40 kg",
    arrivalCount: "9,800",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Mill Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "فلور کوالٹی",
    qualityType: "Flour Quality",
    trend: "up",
    trendPct: 1.2,
  },
  {
    id: 3,
    time: "7:45 AM",
    vertical: "Grains",
    productUrdu: "گندم",
    product: "Wheat",
    byproduct: "Bran",
    stationUrdu: "فیصل آباد",
    station: "Faisalabad Mandi",
    province: "Punjab",
    priceMin: 1400,
    priceMax: 1600,
    unit: "40 kg",
    arrivalCount: "5,200",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "بھورا",
    color: "Brown",
    rateType: "Wholesale Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "عام",
    quality: "Standard",
    qualityTypeUrdu: "چوکر کوالٹی",
    qualityType: "Bran Quality",
    trend: "stable",
    trendPct: 0.3,
  },
  {
    id: 4,
    time: "8:00 AM",
    vertical: "Grains",
    productUrdu: "گندم",
    product: "Wheat",
    byproduct: "Wheat",
    stationUrdu: "ملتان",
    station: "Multan Mandi",
    province: "Punjab",
    priceMin: 2770,
    priceMax: 2960,
    unit: "40 kg",
    arrivalCount: "7,100",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سنہری",
    color: "Golden",
    rateType: "Farm Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "پرانی",
    quality: "Old",
    qualityTypeUrdu: "اے کوالٹی",
    qualityType: "A Quality",
    trend: "up",
    trendPct: 1.6,
  },
  {
    id: 5,
    time: "8:10 AM",
    vertical: "Grains",
    productUrdu: "گندم",
    product: "Wheat",
    byproduct: "Wheat",
    stationUrdu: "ساہیوال",
    station: "Sahiwal Mandi",
    province: "Punjab",
    priceMin: 2700,
    priceMax: 2900,
    unit: "40 kg",
    arrivalCount: "8,800",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سنہری",
    color: "Golden",
    rateType: "Mill Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "بی کوالٹی",
    qualityType: "B Quality",
    trend: "stable",
    trendPct: 0.2,
  },
  {
    id: 6,
    time: "8:20 AM",
    vertical: "Grains",
    productUrdu: "گندم",
    product: "Wheat",
    byproduct: "Wheat",
    stationUrdu: "بہاولپور",
    station: "Bahawalpur Mandi",
    province: "Punjab",
    priceMin: 2720,
    priceMax: 2880,
    unit: "40 kg",
    arrivalCount: "6,300",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سنہری",
    color: "Golden",
    rateType: "Mandi Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "سی کوالٹی",
    qualityType: "C Quality",
    trend: "up",
    trendPct: 0.9,
  },
  {
    id: 7,
    time: "8:30 AM",
    vertical: "Grains",
    productUrdu: "گندم",
    product: "Wheat",
    byproduct: "Wheat",
    stationUrdu: "سرگودھا",
    station: "Sargodha Mandi",
    province: "Punjab",
    priceMin: 2800,
    priceMax: 2980,
    unit: "40 kg",
    arrivalCount: "11,400",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سنہری",
    color: "Golden",
    rateType: "Mill Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "اے کوالٹی",
    qualityType: "A Quality",
    trend: "up",
    trendPct: 1.9,
  },
  {
    id: 8,
    time: "8:40 AM",
    vertical: "Grains",
    productUrdu: "گندم",
    product: "Wheat",
    byproduct: "Wheat",
    stationUrdu: "کوئٹہ",
    station: "Quetta Mandi",
    province: "Balochistan",
    priceMin: 2900,
    priceMax: 3100,
    unit: "40 kg",
    arrivalCount: "3,200",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سنہری",
    color: "Golden",
    rateType: "Mandi Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "پرانی",
    quality: "Old",
    qualityTypeUrdu: "درآمد کوالٹی",
    qualityType: "Import Quality",
    trend: "up",
    trendPct: 2.1,
  },
  {
    id: 9,
    time: "8:50 AM",
    vertical: "Grains",
    productUrdu: "باسمتی چاول",
    product: "Rice",
    byproduct: "1121 Basmati-1",
    stationUrdu: "سیرانوالی",
    station: "Siranwali Mandi",
    province: "Punjab",
    priceMin: 5100,
    priceMax: 5500,
    unit: "40 kg",
    arrivalCount: "18,400",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Mill Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "پرانی",
    quality: "Old",
    qualityTypeUrdu: "ایکسپورٹ کوالٹی",
    qualityType: "Export Quality",
    trend: "up",
    trendPct: 3.2,
  },
  {
    id: 10,
    time: "9:00 AM",
    vertical: "Grains",
    productUrdu: "چاول",
    product: "Rice",
    byproduct: "Irri 6",
    stationUrdu: "لاہور",
    station: "Lahore Mandi",
    province: "Punjab",
    priceMin: 2100,
    priceMax: 2400,
    unit: "40 kg",
    arrivalCount: "5,800",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Mandi Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "عام کوالٹی",
    qualityType: "Standard Quality",
    trend: "stable",
    trendPct: 0.4,
  },
  {
    id: 11,
    time: "9:10 AM",
    vertical: "Grains",
    productUrdu: "چاول",
    product: "Rice",
    byproduct: "Sella 1121-1",
    stationUrdu: "فیصل آباد",
    station: "Faisalabad Mandi",
    province: "Punjab",
    priceMin: 4950,
    priceMax: 5350,
    unit: "40 kg",
    arrivalCount: "8,800",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Export Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "ایکسپورٹ",
    quality: "Export",
    qualityTypeUrdu: "ایکسپورٹ کوالٹی",
    qualityType: "Export Quality",
    trend: "up",
    trendPct: 2.4,
  },
  {
    id: 12,
    time: "9:20 AM",
    vertical: "Grains",
    productUrdu: "چاول",
    product: "Rice",
    byproduct: "1509 Steam",
    stationUrdu: "سکھر",
    station: "Sukkur Mandi",
    province: "Sindh",
    priceMin: 4200,
    priceMax: 4600,
    unit: "40 kg",
    arrivalCount: "6,400",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Mill Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "مل کوالٹی",
    qualityType: "Mill Quality",
    trend: "up",
    trendPct: 1.8,
  },
  {
    id: 13,
    time: "9:30 AM",
    vertical: "Grains",
    productUrdu: "دھان",
    product: "Paddy",
    byproduct: "Paddy Irri 6",
    stationUrdu: "سیرانوالی",
    station: "Siranwali Mandi",
    province: "Punjab",
    priceMin: 1800,
    priceMax: 2000,
    unit: "40 kg",
    arrivalCount: "14,200",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سبز",
    color: "Green",
    rateType: "Farm Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "فارم کوالٹی",
    qualityType: "Farm Quality",
    trend: "down",
    trendPct: 0.8,
  },
  {
    id: 14,
    time: "9:40 AM",
    vertical: "Grains",
    productUrdu: "دھان",
    product: "Paddy",
    byproduct: "Paddy Kainat-1121",
    stationUrdu: "حافظ آباد",
    station: "Hafizabad Mandi",
    province: "Punjab",
    priceMin: 3200,
    priceMax: 3600,
    unit: "40 kg",
    arrivalCount: "9,100",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سنہری",
    color: "Golden",
    rateType: "Mandi Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "پرانی",
    quality: "Old",
    qualityTypeUrdu: "اے کوالٹی",
    qualityType: "A Quality",
    trend: "up",
    trendPct: 2.6,
  },
  {
    id: 15,
    time: "9:50 AM",
    vertical: "Grains",
    productUrdu: "کپاس",
    product: "Cotton",
    byproduct: "Cotton Grade A",
    stationUrdu: "ملتان",
    station: "Multan Mandi",
    province: "Punjab",
    priceMin: 8300,
    priceMax: 8700,
    unit: "40 kg",
    arrivalCount: "7,800",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Mill Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "اے کوالٹی",
    qualityType: "A Quality",
    trend: "up",
    trendPct: 1.5,
  },
  {
    id: 16,
    time: "10:00 AM",
    vertical: "Grains",
    productUrdu: "کپاس",
    product: "Cotton",
    byproduct: "Cotton Seed",
    stationUrdu: "بہاولپور",
    station: "Bahawalpur Mandi",
    province: "Punjab",
    priceMin: 1800,
    priceMax: 2100,
    unit: "40 kg",
    arrivalCount: "3,400",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سبز",
    color: "Green",
    rateType: "Mill Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "مل کوالٹی",
    qualityType: "Mill Quality",
    trend: "stable",
    trendPct: 0.5,
  },
  {
    id: 17,
    time: "10:10 AM",
    vertical: "Grains",
    productUrdu: "کپاس",
    product: "Cotton",
    byproduct: "Cotton Grade A",
    stationUrdu: "نوابشاہ",
    station: "Nawabshah Mandi",
    province: "Sindh",
    priceMin: 8100,
    priceMax: 8500,
    unit: "40 kg",
    arrivalCount: "4,200",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Farm Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "فارم کوالٹی",
    qualityType: "Farm Quality",
    trend: "up",
    trendPct: 1.2,
  },
  {
    id: 18,
    time: "10:20 AM",
    vertical: "Grains",
    productUrdu: "گنا",
    product: "Sugar",
    byproduct: "Sugarcane",
    stationUrdu: "رحیم یار خان",
    station: "Rahim Yar Khan Mandi",
    province: "Punjab",
    priceMin: 420,
    priceMax: 480,
    unit: "40 kg",
    arrivalCount: "22,000",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سبز",
    color: "Green",
    rateType: "Mill Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "مل کوالٹی",
    qualityType: "Mill Quality",
    trend: "stable",
    trendPct: 0.5,
  },
  {
    id: 19,
    time: "10:30 AM",
    vertical: "Grains",
    productUrdu: "چینی",
    product: "Sugar",
    byproduct: "Sugar (Mill)",
    stationUrdu: "ملتان",
    station: "Multan Mandi",
    province: "Punjab",
    priceMin: 8500,
    priceMax: 8800,
    unit: "50 kg",
    arrivalCount: "6,200",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Wholesale Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "معیاری",
    quality: "Standard",
    qualityTypeUrdu: "ہول سیل کوالٹی",
    qualityType: "Wholesale Quality",
    trend: "up",
    trendPct: 0.7,
  },
  {
    id: 20,
    time: "10:40 AM",
    vertical: "Grains",
    productUrdu: "مکئی",
    product: "Maize",
    byproduct: "Maize Grade A",
    stationUrdu: "فیصل آباد",
    station: "Faisalabad Mandi",
    province: "Punjab",
    priceMin: 2100,
    priceMax: 2300,
    unit: "40 kg",
    arrivalCount: "11,000",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "پیلا",
    color: "Yellow",
    rateType: "Mandi Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "فیڈ کوالٹی",
    qualityType: "Feed Quality",
    trend: "down",
    trendPct: 0.9,
  },
  {
    id: 21,
    time: "10:50 AM",
    vertical: "Grains",
    productUrdu: "مکئی",
    product: "Maize",
    byproduct: "Maize Grade A",
    stationUrdu: "پشاور",
    station: "Peshawar Mandi",
    province: "KPK",
    priceMin: 2200,
    priceMax: 2450,
    unit: "40 kg",
    arrivalCount: "8,400",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "پیلا",
    color: "Yellow",
    rateType: "Farm Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "فیڈ کوالٹی",
    qualityType: "Feed Quality",
    trend: "up",
    trendPct: 1.3,
  },
  {
    id: 22,
    time: "11:00 AM",
    vertical: "Grains",
    productUrdu: "سرسوں",
    product: "Mustard",
    byproduct: "Mustard Seed",
    stationUrdu: "چیچہ وطنی",
    station: "Chichawatni Mandi",
    province: "Punjab",
    priceMin: 5800,
    priceMax: 6100,
    unit: "40 kg",
    arrivalCount: "3,400",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سیاہ",
    color: "Black",
    rateType: "Mill Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "پرانی",
    quality: "Old",
    qualityTypeUrdu: "تیل کوالٹی",
    qualityType: "Oil Quality",
    trend: "up",
    trendPct: 1.1,
  },
  {
    id: 23,
    time: "11:10 AM",
    vertical: "Grains",
    productUrdu: "کینولا",
    product: "Canola",
    byproduct: "Canola Seed",
    stationUrdu: "ساہیوال",
    station: "Sahiwal Mandi",
    province: "Punjab",
    priceMin: 5200,
    priceMax: 5600,
    unit: "40 kg",
    arrivalCount: "2,100",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "پیلا",
    color: "Yellow",
    rateType: "Farm Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "فارم کوالٹی",
    qualityType: "Farm Quality",
    trend: "up",
    trendPct: 0.8,
  },
  {
    id: 24,
    time: "11:20 AM",
    vertical: "Grains",
    productUrdu: "باجرہ",
    product: "Millet",
    byproduct: "Millet Grade A",
    stationUrdu: "بہاولپور",
    station: "Bahawalpur Mandi",
    province: "Punjab",
    priceMin: 1800,
    priceMax: 1950,
    unit: "40 kg",
    arrivalCount: "2,100",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سنہری",
    color: "Golden",
    rateType: "Mandi Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "فیڈ کوالٹی",
    qualityType: "Feed Quality",
    trend: "down",
    trendPct: 0.7,
  },
  {
    id: 25,
    time: "11:30 AM",
    vertical: "Grains",
    productUrdu: "دال",
    product: "Pulses",
    byproduct: "Red Lentil",
    stationUrdu: "لاہور",
    station: "Lahore Mandi",
    province: "Punjab",
    priceMin: 3800,
    priceMax: 4200,
    unit: "40 kg",
    arrivalCount: "4,100",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سرخ",
    color: "Red",
    rateType: "Wholesale Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "درآمد",
    quality: "Imported",
    qualityTypeUrdu: "کینیڈین کوالٹی",
    qualityType: "Canadian Quality",
    trend: "stable",
    trendPct: 0.3,
  },
  {
    id: 26,
    time: "11:40 AM",
    vertical: "Grains",
    productUrdu: "لال مرچ",
    product: "Spices",
    byproduct: "Red Chilli",
    stationUrdu: "کراچی",
    station: "Karachi Mandi",
    province: "Sindh",
    priceMin: 16000,
    priceMax: 18000,
    unit: "40 kg",
    arrivalCount: "2,800",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سرخ",
    color: "Red",
    rateType: "Wholesale Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "پرانی",
    quality: "Old",
    qualityTypeUrdu: "درآمد کوالٹی",
    qualityType: "Import Quality",
    trend: "down",
    trendPct: 2.1,
  },
  {
    id: 27,
    time: "11:50 AM",
    vertical: "Vegetables",
    productUrdu: "ٹماٹر",
    product: "Tomato",
    byproduct: "Tomato (Grade A)",
    stationUrdu: "لاہور",
    station: "Lahore Mandi",
    province: "Punjab",
    priceMin: 800,
    priceMax: 900,
    unit: "40 kg",
    arrivalCount: "12,000",
    arrivalUnit: "Crates",
    arrivalUnitUrdu: "کریٹ",
    colorUrdu: "سرخ",
    color: "Red",
    rateType: "Mandi Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "منڈی کوالٹی",
    qualityType: "Mandi Quality",
    trend: "up",
    trendPct: 4.2,
  },
  {
    id: 28,
    time: "12:00 PM",
    vertical: "Vegetables",
    productUrdu: "پیاز",
    product: "Onion",
    byproduct: "Onion (Grade A)",
    stationUrdu: "کراچی",
    station: "Karachi Mandi",
    province: "Sindh",
    priceMin: 620,
    priceMax: 720,
    unit: "40 kg",
    arrivalCount: "8,400",
    arrivalUnit: "Crates",
    arrivalUnitUrdu: "کریٹ",
    colorUrdu: "سرخ",
    color: "Red",
    rateType: "Wholesale Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "منڈی کوالٹی",
    qualityType: "Mandi Quality",
    trend: "down",
    trendPct: 1.5,
  },
  {
    id: 29,
    time: "12:10 PM",
    vertical: "Vegetables",
    productUrdu: "آلو",
    product: "Potato",
    byproduct: "Potato (Mozika)",
    stationUrdu: "اوکاڑہ",
    station: "Okara Mandi",
    province: "Punjab",
    priceMin: 500,
    priceMax: 600,
    unit: "40 kg",
    arrivalCount: "9,100",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "پیلا",
    color: "Yellow",
    rateType: "Mandi Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "ذخیرہ کوالٹی",
    qualityType: "Storage Quality",
    trend: "stable",
    trendPct: 0.6,
  },
  {
    id: 30,
    time: "12:20 PM",
    vertical: "Vegetables",
    productUrdu: "لہسن",
    product: "Garlic",
    byproduct: "Garlic Desi",
    stationUrdu: "لاہور",
    station: "Lahore Mandi",
    province: "Punjab",
    priceMin: 9000,
    priceMax: 11000,
    unit: "40 kg",
    arrivalCount: "3,200",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Mandi Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "دیسی",
    quality: "Desi",
    qualityTypeUrdu: "منڈی کوالٹی",
    qualityType: "Mandi Quality",
    trend: "down",
    trendPct: 2.8,
  },
  {
    id: 31,
    time: "12:30 PM",
    vertical: "Vegetables",
    productUrdu: "مرچ",
    product: "Chilli",
    byproduct: "Green Chilli - Large",
    stationUrdu: "پشاور",
    station: "Peshawar Mandi",
    province: "KPK",
    priceMin: 1200,
    priceMax: 1600,
    unit: "40 kg",
    arrivalCount: "4,100",
    arrivalUnit: "Crates",
    arrivalUnitUrdu: "کریٹ",
    colorUrdu: "سبز",
    color: "Green",
    rateType: "Mandi Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "منڈی کوالٹی",
    qualityType: "Mandi Quality",
    trend: "up",
    trendPct: 3.1,
  },
  {
    id: 32,
    time: "12:40 PM",
    vertical: "Vegetables",
    productUrdu: "گوبھی",
    product: "Cauliflower",
    byproduct: "Cauliflower",
    stationUrdu: "لاہور",
    station: "Lahore Mandi",
    province: "Punjab",
    priceMin: 400,
    priceMax: 600,
    unit: "40 kg",
    arrivalCount: "6,800",
    arrivalUnit: "Crates",
    arrivalUnitUrdu: "کریٹ",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Mandi Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "منڈی کوالٹی",
    qualityType: "Mandi Quality",
    trend: "down",
    trendPct: 1.4,
  },
  {
    id: 33,
    time: "12:50 PM",
    vertical: "Vegetables",
    productUrdu: "آلو",
    product: "Potato",
    byproduct: "Potato (Red)",
    stationUrdu: "حیدرآباد",
    station: "Hyderabad Mandi",
    province: "Sindh",
    priceMin: 480,
    priceMax: 580,
    unit: "40 kg",
    arrivalCount: "7,200",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سرخ",
    color: "Red",
    rateType: "Mandi Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "ذخیرہ کوالٹی",
    qualityType: "Storage Quality",
    trend: "stable",
    trendPct: 0.4,
  },
  {
    id: 34,
    time: "1:00 PM",
    vertical: "Fruits",
    productUrdu: "آم",
    product: "Mango",
    byproduct: "Mango Sindhri",
    stationUrdu: "ملتان",
    station: "Multan Mandi",
    province: "Punjab",
    priceMin: 1050,
    priceMax: 1350,
    unit: "40 kg",
    arrivalCount: "15,000",
    arrivalUnit: "Crates",
    arrivalUnitUrdu: "کریٹ",
    colorUrdu: "زرد",
    color: "Yellow",
    rateType: "Export Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "برآمد کوالٹی",
    qualityType: "Export Quality",
    trend: "down",
    trendPct: 2.3,
  },
  {
    id: 35,
    time: "1:10 PM",
    vertical: "Fruits",
    productUrdu: "آم",
    product: "Mango",
    byproduct: "Mango Anwer Ratul",
    stationUrdu: "لاہور",
    station: "Lahore Mandi",
    province: "Punjab",
    priceMin: 1200,
    priceMax: 1600,
    unit: "40 kg",
    arrivalCount: "9,200",
    arrivalUnit: "Crates",
    arrivalUnitUrdu: "کریٹ",
    colorUrdu: "زرد",
    color: "Yellow",
    rateType: "Mandi Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "منڈی کوالٹی",
    qualityType: "Mandi Quality",
    trend: "down",
    trendPct: 1.8,
  },
  {
    id: 36,
    time: "1:20 PM",
    vertical: "Fruits",
    productUrdu: "کیلا",
    product: "Banana",
    byproduct: "Banana",
    stationUrdu: "کراچی",
    station: "Karachi Mandi",
    province: "Sindh",
    priceMin: 900,
    priceMax: 1100,
    unit: "40 kg",
    arrivalCount: "3,200",
    arrivalUnit: "Crates",
    arrivalUnitUrdu: "کریٹ",
    colorUrdu: "زرد",
    color: "Yellow",
    rateType: "Wholesale Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "درآمد کوالٹی",
    qualityType: "Import Quality",
    trend: "stable",
    trendPct: 0.4,
  },
  {
    id: 37,
    time: "1:30 PM",
    vertical: "Fruits",
    productUrdu: "کینو",
    product: "Citrus",
    byproduct: "Orange",
    stationUrdu: "سرگودھا",
    station: "Sargodha Mandi",
    province: "Punjab",
    priceMin: 1800,
    priceMax: 2200,
    unit: "40 kg",
    arrivalCount: "8,600",
    arrivalUnit: "Crates",
    arrivalUnitUrdu: "کریٹ",
    colorUrdu: "نارنجی",
    color: "Orange",
    rateType: "Farm Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "فارم کوالٹی",
    qualityType: "Farm Quality",
    trend: "stable",
    trendPct: 0.2,
  },
  {
    id: 38,
    time: "1:40 PM",
    vertical: "Fruits",
    productUrdu: "سیب",
    product: "Apple",
    byproduct: "Apple Kala Kullu",
    stationUrdu: "پشاور",
    station: "Peshawar Mandi",
    province: "KPK",
    priceMin: 3200,
    priceMax: 4000,
    unit: "40 kg",
    arrivalCount: "5,400",
    arrivalUnit: "Crates",
    arrivalUnitUrdu: "کریٹ",
    colorUrdu: "سرخ",
    color: "Red",
    rateType: "Mandi Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "منڈی کوالٹی",
    qualityType: "Mandi Quality",
    trend: "up",
    trendPct: 2.4,
  },
  {
    id: 39,
    time: "1:50 PM",
    vertical: "Livestock",
    productUrdu: "مرغی",
    product: "Poultry",
    byproduct: "Broiler",
    stationUrdu: "لاہور",
    station: "Lahore Mandi",
    province: "Punjab",
    priceMin: 480,
    priceMax: 520,
    unit: "Per KG",
    arrivalCount: "8,200",
    arrivalUnit: "Birds",
    arrivalUnitUrdu: "پرندے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Farm Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "فارم کوالٹی",
    qualityType: "Farm Quality",
    trend: "up",
    trendPct: 2.1,
  },
  {
    id: 40,
    time: "2:00 PM",
    vertical: "Livestock",
    productUrdu: "بھینس",
    product: "Cattle Market",
    byproduct: "Buffalo",
    stationUrdu: "بہاولپور",
    station: "Bahawalpur Mandi",
    province: "Punjab",
    priceMin: 180000,
    priceMax: 320000,
    unit: "Per Head",
    arrivalCount: "420",
    arrivalUnit: "Heads",
    arrivalUnitUrdu: "سر",
    colorUrdu: "کالا",
    color: "Black",
    rateType: "Mandi Rate",
    specUrdu: "تازہ",
    spec: "Live",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "منڈی کوالٹی",
    qualityType: "Mandi Quality",
    trend: "up",
    trendPct: 1.6,
  },
  {
    id: 41,
    time: "2:10 PM",
    vertical: "Livestock",
    productUrdu: "دودھ",
    product: "Dairy",
    byproduct: "Milk",
    stationUrdu: "فیصل آباد",
    station: "Faisalabad Mandi",
    province: "Punjab",
    priceMin: 140,
    priceMax: 160,
    unit: "Per Litre",
    arrivalCount: "12,000",
    arrivalUnit: "Litres",
    arrivalUnitUrdu: "لیٹر",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Farm Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "فارم کوالٹی",
    qualityType: "Farm Quality",
    trend: "stable",
    trendPct: 0.5,
  },
  {
    id: 42,
    time: "2:20 PM",
    vertical: "Agri Inputs",
    productUrdu: "یوریا",
    product: "Fertilizer",
    byproduct: "Urea",
    stationUrdu: "پاکپتن",
    station: "Pakpattan Mandi",
    province: "Punjab",
    priceMin: 3100,
    priceMax: 3300,
    unit: "50 kg",
    arrivalCount: "2,800",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Dealer Rate",
    specUrdu: "گرینولر",
    spec: "Granular",
    qualityUrdu: "پاک عرب",
    quality: "Pak Arab",
    qualityTypeUrdu: "معیاری",
    qualityType: "Standard",
    trend: "stable",
    trendPct: 0.2,
  },
  {
    id: 43,
    time: "2:30 PM",
    vertical: "Agri Inputs",
    productUrdu: "ڈی اے پی",
    product: "Fertilizer",
    byproduct: "DAP",
    stationUrdu: "ملتان",
    station: "Multan Mandi",
    province: "Punjab",
    priceMin: 7800,
    priceMax: 8200,
    unit: "50 kg",
    arrivalCount: "1,200",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سیاہ",
    color: "Dark",
    rateType: "Dealer Rate",
    specUrdu: "دانے دار",
    spec: "Granular",
    qualityUrdu: "فینگ ڈی اے پی",
    quality: "Fung DAP",
    qualityTypeUrdu: "معیاری",
    qualityType: "Standard",
    trend: "stable",
    trendPct: 0.2,
  },
  {
    id: 44,
    time: "2:40 PM",
    vertical: "Agri Inputs",
    productUrdu: "این پی",
    product: "Fertilizer",
    byproduct: "NP",
    stationUrdu: "ساہیوال",
    station: "Sahiwal Mandi",
    province: "Punjab",
    priceMin: 4200,
    priceMax: 4600,
    unit: "50 kg",
    arrivalCount: "980",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سبز",
    color: "Green",
    rateType: "Dealer Rate",
    specUrdu: "دانے دار",
    spec: "Granular",
    qualityUrdu: "معیاری",
    quality: "Standard",
    qualityTypeUrdu: "معیاری",
    qualityType: "Standard",
    trend: "up",
    trendPct: 0.6,
  },
  {
    id: 45,
    time: "2:50 PM",
    vertical: "Dry Fruits",
    productUrdu: "بادام",
    product: "Almonds",
    byproduct: "Almond (American)",
    stationUrdu: "کراچی",
    station: "Karachi Mandi",
    province: "Sindh",
    priceMin: 3200,
    priceMax: 3800,
    unit: "Per KG",
    arrivalCount: "1,400",
    arrivalUnit: "KG",
    arrivalUnitUrdu: "کلو",
    colorUrdu: "بھورا",
    color: "Brown",
    rateType: "Wholesale Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "درآمد کوالٹی",
    qualityType: "Import Quality",
    trend: "stable",
    trendPct: 0.3,
  },
  {
    id: 46,
    time: "3:00 PM",
    vertical: "Dry Fruits",
    productUrdu: "اخروٹ",
    product: "Walnut",
    byproduct: "Walnut",
    stationUrdu: "پشاور",
    station: "Peshawar Mandi",
    province: "KPK",
    priceMin: 2800,
    priceMax: 3400,
    unit: "Per KG",
    arrivalCount: "800",
    arrivalUnit: "KG",
    arrivalUnitUrdu: "کلو",
    colorUrdu: "بھورا",
    color: "Brown",
    rateType: "Wholesale Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "دیسی",
    quality: "Local",
    qualityTypeUrdu: "کے پی کے کوالٹی",
    qualityType: "KPK Quality",
    trend: "up",
    trendPct: 1.2,
  },
  {
    id: 47,
    time: "3:10 PM",
    vertical: "Herbals",
    productUrdu: "شہد",
    product: "Honey",
    byproduct: "Honey",
    stationUrdu: "پشاور",
    station: "Peshawar Mandi",
    province: "KPK",
    priceMin: 2200,
    priceMax: 3000,
    unit: "Per KG",
    arrivalCount: "360",
    arrivalUnit: "KG",
    arrivalUnitUrdu: "کلو",
    colorUrdu: "سنہری",
    color: "Golden",
    rateType: "Retail Rate",
    specUrdu: "خالص",
    spec: "Pure",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "پہاڑی کوالٹی",
    qualityType: "Mountain Quality",
    trend: "up",
    trendPct: 3.2,
  },
  {
    id: 48,
    time: "3:20 PM",
    vertical: "Herbals",
    productUrdu: "کلونجی",
    product: "Black Seed",
    byproduct: "Black Seed",
    stationUrdu: "کراچی",
    station: "Karachi Mandi",
    province: "Sindh",
    priceMin: 1200,
    priceMax: 1600,
    unit: "Per KG",
    arrivalCount: "480",
    arrivalUnit: "KG",
    arrivalUnitUrdu: "کلو",
    colorUrdu: "سیاہ",
    color: "Black",
    rateType: "Wholesale Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "ایتھوپیا",
    quality: "Ethiopian",
    qualityTypeUrdu: "درآمد کوالٹی",
    qualityType: "Import Quality",
    trend: "stable",
    trendPct: 0.4,
  },
  {
    id: 49,
    time: "3:30 PM",
    vertical: "Kiryana",
    productUrdu: "باسمتی چاول",
    product: "Rice",
    byproduct: "1121 Basmati-1",
    stationUrdu: "لاہور",
    station: "Lahore Mandi",
    province: "Punjab",
    priceMin: 7200,
    priceMax: 7800,
    unit: "40 kg",
    arrivalCount: "4,200",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Retail Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "اے گریڈ",
    quality: "A Grade",
    qualityTypeUrdu: "خوردہ کوالٹی",
    qualityType: "Retail Quality",
    trend: "stable",
    trendPct: 0.1,
  },
  {
    id: 50,
    time: "3:40 PM",
    vertical: "Kiryana",
    productUrdu: "چینی",
    product: "Sugar",
    byproduct: "Sugar",
    stationUrdu: "ملتان",
    station: "Multan Mandi",
    province: "Punjab",
    priceMin: 9200,
    priceMax: 9600,
    unit: "50 kg",
    arrivalCount: "3,800",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Retail Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "معیاری",
    quality: "Standard",
    qualityTypeUrdu: "خوردہ کوالٹی",
    qualityType: "Retail Quality",
    trend: "up",
    trendPct: 0.5,
  },
  {
    id: 51,
    time: "3:50 PM",
    vertical: "Kiryana",
    productUrdu: "لال مرچ",
    product: "Spices",
    byproduct: "Red Chilli",
    stationUrdu: "کراچی",
    station: "Karachi Mandi",
    province: "Sindh",
    priceMin: 18000,
    priceMax: 21000,
    unit: "40 kg",
    arrivalCount: "1,600",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سرخ",
    color: "Red",
    rateType: "Wholesale Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "پرانی",
    quality: "Old",
    qualityTypeUrdu: "منڈی کوالٹی",
    qualityType: "Mandi Quality",
    trend: "down",
    trendPct: 1.8,
  },
  {
    id: 52,
    time: "4:00 PM",
    vertical: "Grains",
    productUrdu: "کپاس",
    product: "Cotton",
    byproduct: "Cotton Grade A",
    stationUrdu: "گھوٹکی",
    station: "Ghotki Mandi",
    province: "Sindh",
    priceMin: 8200,
    priceMax: 8650,
    unit: "40 kg",
    arrivalCount: "5,400",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Farm Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "فارم کوالٹی",
    qualityType: "Farm Quality",
    trend: "up",
    trendPct: 1.0,
  },
  {
    id: 53,
    time: "4:10 PM",
    vertical: "Grains",
    productUrdu: "دھان",
    product: "Paddy",
    byproduct: "Paddy Irri 6",
    stationUrdu: "حیدرآباد",
    station: "Hyderabad Mandi",
    province: "Sindh",
    priceMin: 1750,
    priceMax: 1950,
    unit: "40 kg",
    arrivalCount: "10,200",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سبز",
    color: "Green",
    rateType: "Mandi Rate",
    specUrdu: "تازہ",
    spec: "Fresh",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "مل کوالٹی",
    qualityType: "Mill Quality",
    trend: "stable",
    trendPct: 0.6,
  },
  {
    id: 54,
    time: "4:20 PM",
    vertical: "Grains",
    productUrdu: "چاول",
    product: "Rice",
    byproduct: "Super Kernel",
    stationUrdu: "سکھر",
    station: "Sukkur Mandi",
    province: "Sindh",
    priceMin: 5600,
    priceMax: 6100,
    unit: "40 kg",
    arrivalCount: "7,800",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سفید",
    color: "White",
    rateType: "Export Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "ایکسپورٹ",
    quality: "Export",
    qualityTypeUrdu: "برآمد کوالٹی",
    qualityType: "Export Quality",
    trend: "up",
    trendPct: 2.8,
  },
  {
    id: 55,
    time: "4:30 PM",
    vertical: "Grains",
    productUrdu: "گندم",
    product: "Wheat",
    byproduct: "Wheat",
    stationUrdu: "دیرہ اسماعیل خان",
    station: "Dera Ismail Khan Mandi",
    province: "KPK",
    priceMin: 2850,
    priceMax: 3050,
    unit: "40 kg",
    arrivalCount: "4,100",
    arrivalUnit: "Bags",
    arrivalUnitUrdu: "تھیلے",
    colorUrdu: "سنہری",
    color: "Golden",
    rateType: "Mill Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "نئی",
    quality: "New",
    qualityTypeUrdu: "اے کوالٹی",
    qualityType: "A Quality",
    trend: "up",
    trendPct: 1.4,
  },
  {
    id: 56,
    time: "4:40 PM",
    vertical: "Vegetables",
    productUrdu: "پیاز",
    product: "Onion",
    byproduct: "Onion (Grade B)",
    stationUrdu: "سکھر",
    station: "Sukkur Mandi",
    province: "Sindh",
    priceMin: 580,
    priceMax: 680,
    unit: "40 kg",
    arrivalCount: "6,200",
    arrivalUnit: "Crates",
    arrivalUnitUrdu: "کریٹ",
    colorUrdu: "سرخ",
    color: "Red",
    rateType: "Mandi Rate",
    specUrdu: "خشک",
    spec: "Dry",
    qualityUrdu: "بی گریڈ",
    quality: "B Grade",
    qualityTypeUrdu: "منڈی کوالٹی",
    qualityType: "Mandi Quality",
    trend: "down",
    trendPct: 0.9,
  },
];

//  INITIAL MANDIS

const INITIAL_MANDIS = [
  {
    id: "pakpattan",
    name: "Pakpattan Mandi",
    city: "Pakpattan",
    province: "Punjab",
    distance: "2.5 km",
    open: true,
    fav: true,
  },
  {
    id: "arifwala",
    name: "Arifwala Mandi",
    city: "Arifwala",
    province: "Punjab",
    distance: "18 km",
    open: true,
    fav: false,
  },
  {
    id: "sahiwal",
    name: "Sahiwal Mandi",
    city: "Sahiwal",
    province: "Punjab",
    distance: "38 km",
    open: true,
    fav: false,
  },
  {
    id: "lahore",
    name: "Lahore Mandi",
    city: "Lahore",
    province: "Punjab",
    distance: "112 km",
    open: true,
    fav: true,
  },
  {
    id: "multan",
    name: "Multan Mandi",
    city: "Multan",
    province: "Punjab",
    distance: "95 km",
    open: false,
    fav: false,
  },
  {
    id: "faisalabad",
    name: "Faisalabad Mandi",
    city: "Faisalabad",
    province: "Punjab",
    distance: "65 km",
    open: true,
    fav: false,
  },
  {
    id: "okara",
    name: "Okara Mandi",
    city: "Okara",
    province: "Punjab",
    distance: "52 km",
    open: true,
    fav: false,
  },
  {
    id: "ryk",
    name: "Rahim Yar Khan Mandi",
    city: "Rahim Yar Khan",
    province: "Punjab",
    distance: "140 km",
    open: false,
    fav: false,
  },
  {
    id: "chichawatni",
    name: "Chichawatni Mandi",
    city: "Chichawatni",
    province: "Punjab",
    distance: "44 km",
    open: true,
    fav: false,
  },
  {
    id: "bahawalpur",
    name: "Bahawalpur Mandi",
    city: "Bahawalpur",
    province: "Punjab",
    distance: "118 km",
    open: true,
    fav: false,
  },
  {
    id: "karachi",
    name: "Karachi Mandi",
    city: "Karachi",
    province: "Sindh",
    distance: "980 km",
    open: true,
    fav: false,
  },
  {
    id: "sukkur",
    name: "Sukkur Mandi",
    city: "Sukkur",
    province: "Sindh",
    distance: "540 km",
    open: true,
    fav: false,
  },
  {
    id: "hyderabad",
    name: "Hyderabad Mandi",
    city: "Hyderabad",
    province: "Sindh",
    distance: "860 km",
    open: true,
    fav: false,
  },
  {
    id: "peshawar",
    name: "Peshawar Mandi",
    city: "Peshawar",
    province: "KPK",
    distance: "420 km",
    open: true,
    fav: false,
  },
  {
    id: "quetta",
    name: "Quetta Mandi",
    city: "Quetta",
    province: "Balochistan",
    distance: "620 km",
    open: true,
    fav: false,
  },
  {
    id: "siranwali",
    name: "Siranwali Mandi",
    city: "Siranwali",
    province: "Punjab",
    distance: "180 km",
    open: true,
    fav: false,
  },
  {
    id: "sargodha",
    name: "Sargodha Mandi",
    city: "Sargodha",
    province: "Punjab",
    distance: "200 km",
    open: true,
    fav: false,
  },
  {
    id: "multan",
    name: "Multan Mandi",
    city: "Multan",
    province: "Punjab",
    distance: "95 km",
    open: false,
    fav: false,
  },
];
type MandiItem = (typeof INITIAL_MANDIS)[0];

const MANDI_ROWS: Record<
  string,
  {
    product: string;
    byproduct: string;
    emoji: string;
    rateType: string;
    arrival: string;
    min: number;
    max: number;
    trend: "up" | "down" | "stable";
    trendPct: number;
  }[]
> = {
  pakpattan: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "12,400 Bags",
      min: 2750,
      max: 2950,
      trend: "up",
      trendPct: 1.8,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "8,200 Bags",
      min: 4200,
      max: 4340,
      trend: "up",
      trendPct: 1.2,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "3,100 Bags",
      min: 1400,
      max: 1600,
      trend: "stable",
      trendPct: 0.4,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "5,600 Bags",
      min: 3800,
      max: 4100,
      trend: "up",
      trendPct: 0.9,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "1,200 Bags",
      min: 5200,
      max: 5600,
      trend: "up",
      trendPct: 1.4,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "7,800 Bags",
      min: 420,
      max: 520,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Wheat",
      byproduct: "Special Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "2,400 Bags",
      min: 4800,
      max: 5200,
      trend: "up",
      trendPct: 0.7,
    },
    {
      product: "Rice",
      byproduct: "1121 Basmati-1",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "6,200 Bags",
      min: 5000,
      max: 5400,
      trend: "up",
      trendPct: 3.2,
    },
    {
      product: "Maize",
      byproduct: "Maize Grade A",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "4,800 Bags",
      min: 2050,
      max: 2250,
      trend: "down",
      trendPct: 0.9,
    },
    {
      product: "Cotton",
      byproduct: "Cotton Grade A",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "3,400 Bags",
      min: 8200,
      max: 8600,
      trend: "up",
      trendPct: 1.5,
    },
    {
      product: "Fertilizer",
      byproduct: "Urea",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "2,800 Bags",
      min: 3100,
      max: 3300,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Onion",
      byproduct: "Onion (Grade A)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "7,200 Crates",
      min: 600,
      max: 700,
      trend: "down",
      trendPct: 1.5,
    },
    {
      product: "Tomato",
      byproduct: "Tomato (Grade A)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "5,400 Crates",
      min: 750,
      max: 850,
      trend: "up",
      trendPct: 4.2,
    },
    {
      product: "Potato",
      byproduct: "Potato (Mozika)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "9,100 Bags",
      min: 500,
      max: 600,
      trend: "stable",
      trendPct: 0.6,
    },
    {
      product: "Mustard",
      byproduct: "Mustard Seed",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "2,100 Bags",
      min: 5700,
      max: 6000,
      trend: "up",
      trendPct: 1.4,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,800 Bags",
      min: 2200,
      max: 2450,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Barley",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,400 Bags",
      min: 1900,
      max: 2100,
      trend: "up",
      trendPct: 0.8,
    },
    {
      product: "Wheat",
      byproduct: "Oat",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "600 Bags",
      min: 1600,
      max: 1850,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Broker Rate",
      arrival: "8,700 Bags",
      min: 2620,
      max: 2800,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Stock Rate",
      arrival: "11,200 Bags",
      min: 2900,
      max: 3100,
      trend: "up",
      trendPct: 2.2,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Export Rate",
      arrival: "4,100 Bags",
      min: 4600,
      max: 4900,
      trend: "up",
      trendPct: 3.1,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Broker Rate",
      arrival: "2,800 Bags",
      min: 1320,
      max: 1520,
      trend: "down",
      trendPct: 0.8,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Stock Rate",
      arrival: "3,900 Bags",
      min: 3900,
      max: 4200,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Broker Rate",
      arrival: "1,700 Bags",
      min: 5200,
      max: 5600,
      trend: "up",
      trendPct: 1.5,
    },
  ],
  sahiwal: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "9,200 Bags",
      min: 2700,
      max: 2900,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Rice",
      byproduct: "1121 Basmati-1",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "4,400 Bags",
      min: 4900,
      max: 5300,
      trend: "up",
      trendPct: 2.8,
    },
    {
      product: "Cotton",
      byproduct: "Cotton Grade A",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "2,800 Bags",
      min: 8100,
      max: 8500,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Canola",
      byproduct: "Canola Seed",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "2,100 Bags",
      min: 5200,
      max: 5600,
      trend: "up",
      trendPct: 0.8,
    },
    {
      product: "Fertilizer",
      byproduct: "NP",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "980 Bags",
      min: 4200,
      max: 4600,
      trend: "up",
      trendPct: 0.6,
    },
  ],
  lahore: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "28,000 Bags",
      min: 2820,
      max: 3000,
      trend: "up",
      trendPct: 2.1,
    },
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "14,500 Bags",
      min: 2480,
      max: 2640,
      trend: "up",
      trendPct: 1.4,
    },
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Broker Rate",
      arrival: "9,200 Bags",
      min: 2680,
      max: 2850,
      trend: "stable",
      trendPct: 0.6,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "12,000 Bags",
      min: 4300,
      max: 4500,
      trend: "up",
      trendPct: 1.8,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "7,800 Bags",
      min: 4380,
      max: 4580,
      trend: "up",
      trendPct: 1.2,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "6,100 Bags",
      min: 3900,
      max: 4200,
      trend: "up",
      trendPct: 0.8,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "4,400 Bags",
      min: 1350,
      max: 1550,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "1,800 Bags",
      min: 5100,
      max: 5500,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "9,600 Bags",
      min: 400,
      max: 490,
      trend: "stable",
      trendPct: 0.1,
    },
    {
      product: "Tomato",
      byproduct: "Tomato (Grade A)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "12,000 Crates",
      min: 800,
      max: 900,
      trend: "up",
      trendPct: 3.8,
    },
    {
      product: "Onion",
      byproduct: "Onion (Grade A)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "8,400 Crates",
      min: 620,
      max: 720,
      trend: "down",
      trendPct: 2.1,
    },
    {
      product: "Potato",
      byproduct: "Potato (Mozika)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "9,100 Bags",
      min: 500,
      max: 600,
      trend: "stable",
      trendPct: 0.6,
    },
    {
      product: "Poultry",
      byproduct: "Broiler",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "8,200 Birds",
      min: 480,
      max: 520,
      trend: "up",
      trendPct: 2.1,
    },
    {
      product: "Rice",
      byproduct: "Irri 6",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "5,800 Bags",
      min: 2100,
      max: 2400,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Mango",
      byproduct: "Mango Sindhri",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "6,000 Crates",
      min: 1100,
      max: 1300,
      trend: "down",
      trendPct: 1.8,
    },
    {
      product: "Garlic",
      byproduct: "Garlic Desi",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "3,200 Bags",
      min: 9000,
      max: 11000,
      trend: "down",
      trendPct: 2.8,
    },
    {
      product: "Pulses",
      byproduct: "Red Lentil",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "4,100 Bags",
      min: 3800,
      max: 4200,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "2,200 Bags",
      min: 2280,
      max: 2520,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Wheat",
      byproduct: "Barley",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,800 Bags",
      min: 1980,
      max: 2180,
      trend: "stable",
      trendPct: 0.4,
    },
    {
      product: "Wheat",
      byproduct: "Oat",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "880 Bags",
      min: 1700,
      max: 1920,
      trend: "up",
      trendPct: 0.6,
    },
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Stock Rate",
      arrival: "14,300 Bags",
      min: 2950,
      max: 3150,
      trend: "up",
      trendPct: 1.9,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Broker Rate",
      arrival: "6,200 Bags",
      min: 4350,
      max: 4600,
      trend: "up",
      trendPct: 1.4,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Export Rate",
      arrival: "3,400 Bags",
      min: 1500,
      max: 1720,
      trend: "up",
      trendPct: 2.0,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Broker Rate",
      arrival: "5,100 Bags",
      min: 4050,
      max: 4380,
      trend: "stable",
      trendPct: 0.5,
    },
  ],
  multan: [
    {
      product: "Cotton",
      byproduct: "Cotton Grade A",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "7,800 Bags",
      min: 8300,
      max: 8700,
      trend: "up",
      trendPct: 1.2,
    },
    {
      product: "Cotton",
      byproduct: "Cotton Seed",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "3,200 Bags",
      min: 1800,
      max: 2100,
      trend: "stable",
      trendPct: 0.5,
    },
    {
      product: "Mango",
      byproduct: "Mango Sindhri",
      emoji: "",
      rateType: "Export Rate",
      arrival: "15,000 Crates",
      min: 1050,
      max: 1350,
      trend: "down",
      trendPct: 3.1,
    },
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "7,100 Bags",
      min: 2770,
      max: 2950,
      trend: "up",
      trendPct: 1.6,
    },
    {
      product: "Fertilizer",
      byproduct: "DAP",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "1,200 Bags",
      min: 7800,
      max: 8200,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Sugar",
      byproduct: "Sugar (Mill)",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "6,200 Bags",
      min: 8500,
      max: 8800,
      trend: "up",
      trendPct: 0.7,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "6,800 Bags",
      min: 4220,
      max: 4460,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "4,400 Bags",
      min: 3840,
      max: 4120,
      trend: "up",
      trendPct: 0.7,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "2,800 Bags",
      min: 1410,
      max: 1610,
      trend: "stable",
      trendPct: 0.4,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "1,100 Bags",
      min: 5120,
      max: 5520,
      trend: "up",
      trendPct: 1.0,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "6,200 Bags",
      min: 415,
      max: 515,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Wheat",
      byproduct: "Special Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "2,200 Bags",
      min: 4780,
      max: 5240,
      trend: "up",
      trendPct: 0.6,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,000 Bags",
      min: 2190,
      max: 2430,
      trend: "stable",
      trendPct: 0.5,
    },
    {
      product: "Wheat",
      byproduct: "Barley",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "800 Bags",
      min: 1930,
      max: 2130,
      trend: "up",
      trendPct: 0.6,
    },
    {
      product: "Wheat",
      byproduct: "Oat",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "480 Bags",
      min: 1640,
      max: 1860,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Export Rate",
      arrival: "9,800 Bags",
      min: 2880,
      max: 3060,
      trend: "up",
      trendPct: 2.4,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Stock Rate",
      arrival: "2,300 Bags",
      min: 5400,
      max: 5800,
      trend: "up",
      trendPct: 1.8,
    },
  ],
  faisalabad: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "15,200 Bags",
      min: 2800,
      max: 2980,
      trend: "up",
      trendPct: 1.9,
    },
    {
      product: "Rice",
      byproduct: "1121 Basmati-1",
      emoji: "",
      rateType: "Export Rate",
      arrival: "8,800 Bags",
      min: 4950,
      max: 5350,
      trend: "up",
      trendPct: 2.4,
    },
    {
      product: "Maize",
      byproduct: "Maize Grade A",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "5,600 Bags",
      min: 2100,
      max: 2300,
      trend: "down",
      trendPct: 0.7,
    },
    {
      product: "Mustard",
      byproduct: "Mustard Seed",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "2,100 Bags",
      min: 5700,
      max: 6000,
      trend: "up",
      trendPct: 1.4,
    },
    {
      product: "Dairy",
      byproduct: "Milk",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "12,000 L",
      min: 140,
      max: 160,
      trend: "stable",
      trendPct: 0.5,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "10,400 Bags",
      min: 4300,
      max: 4500,
      trend: "up",
      trendPct: 1.8,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "7,200 Bags",
      min: 3900,
      max: 4200,
      trend: "up",
      trendPct: 0.8,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "4,800 Bags",
      min: 1400,
      max: 1600,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "2,200 Bags",
      min: 5100,
      max: 5500,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "9,600 Bags",
      min: 400,
      max: 490,
      trend: "stable",
      trendPct: 0.1,
    },
    {
      product: "Wheat",
      byproduct: "Special Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "3,400 Bags",
      min: 4850,
      max: 5320,
      trend: "up",
      trendPct: 0.9,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,800 Bags",
      min: 2240,
      max: 2480,
      trend: "up",
      trendPct: 1.0,
    },
    {
      product: "Wheat",
      byproduct: "Barley",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,600 Bags",
      min: 1990,
      max: 2190,
      trend: "stable",
      trendPct: 0.6,
    },
    {
      product: "Wheat",
      byproduct: "Oat",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "820 Bags",
      min: 1680,
      max: 1900,
      trend: "up",
      trendPct: 0.8,
    },
  ],
  okara: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "6,400 Bags",
      min: 2720,
      max: 2900,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Potato",
      byproduct: "Potato (Mozika)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "9,100 Bags",
      min: 500,
      max: 600,
      trend: "stable",
      trendPct: 0.6,
    },
    {
      product: "Maize",
      byproduct: "Maize Grade A",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "3,800 Bags",
      min: 2080,
      max: 2260,
      trend: "down",
      trendPct: 0.5,
    },
  ],
  ryk: [
    {
      product: "Sugar",
      byproduct: "Sugarcane",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "22,000 Bags",
      min: 420,
      max: 480,
      trend: "stable",
      trendPct: 0.5,
    },
    {
      product: "Cotton",
      byproduct: "Cotton Grade A",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "4,200 Bags",
      min: 8200,
      max: 8600,
      trend: "up",
      trendPct: 1.0,
    },
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "5,100 Bags",
      min: 2740,
      max: 2920,
      trend: "up",
      trendPct: 1.4,
    },
    {
      product: "Millet",
      byproduct: "Millet Grade A",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,800 Bags",
      min: 1780,
      max: 1940,
      trend: "down",
      trendPct: 0.6,
    },
    {
      product: "Fertilizer",
      byproduct: "Urea",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "1,600 Bags",
      min: 3100,
      max: 3300,
      trend: "stable",
      trendPct: 0.2,
    },
  ],
  bahawalpur: [
    {
      product: "Cotton",
      byproduct: "Cotton Grade A",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "6,100 Bags",
      min: 8100,
      max: 8600,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Cotton",
      byproduct: "Cotton Seed",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "2,400 Bags",
      min: 1800,
      max: 2050,
      trend: "stable",
      trendPct: 0.4,
    },
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "6,300 Bags",
      min: 2720,
      max: 2880,
      trend: "up",
      trendPct: 0.9,
    },
    {
      product: "Millet",
      byproduct: "Millet Grade A",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,400 Bags",
      min: 1800,
      max: 1950,
      trend: "down",
      trendPct: 0.7,
    },
    {
      product: "Cattle Market",
      byproduct: "Buffalo",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "420 Heads",
      min: 180000,
      max: 320000,
      trend: "up",
      trendPct: 1.6,
    },
  ],
  chichawatni: [
    {
      product: "Mustard",
      byproduct: "Mustard Seed",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "3,400 Bags",
      min: 5800,
      max: 6100,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "8,200 Bags",
      min: 2710,
      max: 2880,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Rice",
      byproduct: "1121 Basmati-1",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "3,800 Bags",
      min: 4800,
      max: 5200,
      trend: "up",
      trendPct: 2.1,
    },
    {
      product: "Fertilizer",
      byproduct: "Urea",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "1,100 Bags",
      min: 3100,
      max: 3300,
      trend: "stable",
      trendPct: 0.2,
    },
  ],
  karachi: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "18,400 Bags",
      min: 2920,
      max: 3100,
      trend: "up",
      trendPct: 1.6,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "14,200 Bags",
      min: 4450,
      max: 4700,
      trend: "up",
      trendPct: 1.4,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "9,800 Bags",
      min: 4000,
      max: 4300,
      trend: "up",
      trendPct: 0.9,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "6,400 Bags",
      min: 1500,
      max: 1750,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "3,200 Bags",
      min: 5300,
      max: 5800,
      trend: "up",
      trendPct: 1.2,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "4,100 Bags",
      min: 480,
      max: 580,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "2,600 Bags",
      min: 2350,
      max: 2600,
      trend: "up",
      trendPct: 0.8,
    },
    {
      product: "Wheat",
      byproduct: "Barley",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,900 Bags",
      min: 2100,
      max: 2300,
      trend: "stable",
      trendPct: 0.4,
    },
    {
      product: "Wheat",
      byproduct: "Oat",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "1,100 Bags",
      min: 1750,
      max: 1980,
      trend: "up",
      trendPct: 0.7,
    },
    {
      product: "Wheat",
      byproduct: "Special Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "4,800 Bags",
      min: 5100,
      max: 5600,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Spices",
      byproduct: "Red Chilli",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "2,800 Bags",
      min: 16000,
      max: 18000,
      trend: "down",
      trendPct: 2.1,
    },
    {
      product: "Spices",
      byproduct: "White Cumin",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "1,200 Bags",
      min: 22000,
      max: 26000,
      trend: "stable",
      trendPct: 0.5,
    },
    {
      product: "Spices",
      byproduct: "Turmeric",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "1,800 Bags",
      min: 8500,
      max: 9500,
      trend: "down",
      trendPct: 1.4,
    },
    {
      product: "Spices",
      byproduct: "Black Pepper",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "800 Bags",
      min: 35000,
      max: 42000,
      trend: "up",
      trendPct: 2.8,
    },
    {
      product: "Almonds",
      byproduct: "Almond (American)",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "1,400 KG",
      min: 3200,
      max: 3800,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Onion",
      byproduct: "Onion (Grade A)",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "8,400 Crates",
      min: 620,
      max: 720,
      trend: "down",
      trendPct: 1.5,
    },
    {
      product: "Garlic",
      byproduct: "Garlic Chinese",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "3,200 Bags",
      min: 7000,
      max: 9000,
      trend: "down",
      trendPct: 3.2,
    },
    {
      product: "Sugar",
      byproduct: "Sugar (Wholesale)",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "12,000 Bags",
      min: 8800,
      max: 9200,
      trend: "up",
      trendPct: 0.6,
    },
  ],
  sukkur: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "8,200 Bags",
      min: 2880,
      max: 3060,
      trend: "up",
      trendPct: 1.4,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "5,400 Bags",
      min: 4320,
      max: 4560,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "3,800 Bags",
      min: 3950,
      max: 4200,
      trend: "stable",
      trendPct: 0.5,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "2,600 Bags",
      min: 1420,
      max: 1620,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "1,100 Bags",
      min: 5100,
      max: 5500,
      trend: "up",
      trendPct: 1.0,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "3,200 Bags",
      min: 440,
      max: 540,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,400 Bags",
      min: 2180,
      max: 2420,
      trend: "stable",
      trendPct: 0.6,
    },
    {
      product: "Wheat",
      byproduct: "Special Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "2,100 Bags",
      min: 4900,
      max: 5400,
      trend: "up",
      trendPct: 0.8,
    },
    {
      product: "Rice",
      byproduct: "1509 Steam",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "6,400 Bags",
      min: 4200,
      max: 4600,
      trend: "up",
      trendPct: 1.8,
    },
    {
      product: "Rice",
      byproduct: "Super Kernel",
      emoji: "",
      rateType: "Export Rate",
      arrival: "7,800 Bags",
      min: 5600,
      max: 6100,
      trend: "up",
      trendPct: 2.8,
    },
    {
      product: "Paddy",
      byproduct: "Paddy Irri 6",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "9,200 Bags",
      min: 1750,
      max: 1950,
      trend: "stable",
      trendPct: 0.6,
    },
    {
      product: "Onion",
      byproduct: "Onion (Grade B)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "6,200 Crates",
      min: 580,
      max: 680,
      trend: "down",
      trendPct: 0.9,
    },
    {
      product: "Tomato",
      byproduct: "Tomato (Grade A)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "4,800 Crates",
      min: 750,
      max: 880,
      trend: "up",
      trendPct: 3.2,
    },
    {
      product: "Sugar",
      byproduct: "Sugarcane",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "18,000 Bags",
      min: 440,
      max: 500,
      trend: "stable",
      trendPct: 0.4,
    },
  ],
  hyderabad: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "6,800 Bags",
      min: 2860,
      max: 3040,
      trend: "up",
      trendPct: 1.2,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "4,200 Bags",
      min: 4280,
      max: 4520,
      trend: "up",
      trendPct: 1.0,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "2,900 Bags",
      min: 3920,
      max: 4180,
      trend: "up",
      trendPct: 0.7,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,800 Bags",
      min: 1380,
      max: 1580,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "900 Bags",
      min: 5050,
      max: 5450,
      trend: "up",
      trendPct: 0.9,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "2,400 Bags",
      min: 430,
      max: 530,
      trend: "stable",
      trendPct: 0.1,
    },
    {
      product: "Wheat",
      byproduct: "Special Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "1,600 Bags",
      min: 4850,
      max: 5320,
      trend: "up",
      trendPct: 0.6,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,100 Bags",
      min: 2150,
      max: 2380,
      trend: "stable",
      trendPct: 0.5,
    },
    {
      product: "Paddy",
      byproduct: "Paddy Irri 6",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "10,200 Bags",
      min: 1750,
      max: 1950,
      trend: "stable",
      trendPct: 0.6,
    },
    {
      product: "Tomato",
      byproduct: "Tomato (Grade A)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "6,800 Crates",
      min: 820,
      max: 960,
      trend: "up",
      trendPct: 2.8,
    },
    {
      product: "Onion",
      byproduct: "Onion (Grade A)",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "5,400 Crates",
      min: 640,
      max: 740,
      trend: "down",
      trendPct: 1.2,
    },
    {
      product: "Cotton",
      byproduct: "Cotton Grade A",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "5,400 Bags",
      min: 8100,
      max: 8500,
      trend: "up",
      trendPct: 1.2,
    },
  ],
  peshawar: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "9,600 Bags",
      min: 2880,
      max: 3080,
      trend: "up",
      trendPct: 1.5,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "6,200 Bags",
      min: 4380,
      max: 4620,
      trend: "up",
      trendPct: 1.2,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "4,100 Bags",
      min: 3980,
      max: 4240,
      trend: "up",
      trendPct: 0.8,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "2,800 Bags",
      min: 1460,
      max: 1660,
      trend: "stable",
      trendPct: 0.4,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "1,400 Bags",
      min: 5180,
      max: 5580,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "5,200 Bags",
      min: 460,
      max: 560,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,800 Bags",
      min: 2240,
      max: 2480,
      trend: "stable",
      trendPct: 0.7,
    },
    {
      product: "Wheat",
      byproduct: "Barley",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "2,200 Bags",
      min: 2050,
      max: 2250,
      trend: "up",
      trendPct: 0.9,
    },
    {
      product: "Wheat",
      byproduct: "Oat",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "1,400 Bags",
      min: 1780,
      max: 2020,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Wheat",
      byproduct: "Special Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "2,800 Bags",
      min: 4950,
      max: 5450,
      trend: "up",
      trendPct: 0.9,
    },
    {
      product: "Maize",
      byproduct: "Maize Grade A",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "8,400 Bags",
      min: 2200,
      max: 2450,
      trend: "up",
      trendPct: 1.3,
    },
    {
      product: "Apple",
      byproduct: "Apple Kala Kullu",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "5,400 Crates",
      min: 3200,
      max: 4000,
      trend: "up",
      trendPct: 2.4,
    },
    {
      product: "Walnut",
      byproduct: "Walnut",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "800 KG",
      min: 2800,
      max: 3400,
      trend: "up",
      trendPct: 1.2,
    },
    {
      product: "Honey",
      byproduct: "Honey",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "360 KG",
      min: 2200,
      max: 3000,
      trend: "up",
      trendPct: 3.2,
    },
    {
      product: "Dairy",
      byproduct: "Milk",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "8,500 L",
      min: 150,
      max: 170,
      trend: "stable",
      trendPct: 0.4,
    },
    {
      product: "Poultry",
      byproduct: "Broiler",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "6,200 Birds",
      min: 490,
      max: 530,
      trend: "up",
      trendPct: 1.8,
    },
  ],
  quetta: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "3,200 Bags",
      min: 2900,
      max: 3100,
      trend: "up",
      trendPct: 2.1,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "2,400 Bags",
      min: 4500,
      max: 4800,
      trend: "up",
      trendPct: 1.8,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "1,600 Bags",
      min: 4100,
      max: 4400,
      trend: "up",
      trendPct: 1.2,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,100 Bags",
      min: 1500,
      max: 1700,
      trend: "stable",
      trendPct: 0.5,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "600 Bags",
      min: 5400,
      max: 5900,
      trend: "up",
      trendPct: 1.4,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "2,100 Bags",
      min: 500,
      max: 620,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Special Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "1,200 Bags",
      min: 5200,
      max: 5800,
      trend: "up",
      trendPct: 1.1,
    },
    {
      product: "Wheat",
      byproduct: "Barley",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "900 Bags",
      min: 2200,
      max: 2450,
      trend: "up",
      trendPct: 1.0,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "700 Bags",
      min: 2400,
      max: 2680,
      trend: "up",
      trendPct: 1.2,
    },
    {
      product: "Dates",
      byproduct: "Ajwa Dates",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "480 Bags",
      min: 4500,
      max: 6000,
      trend: "stable",
      trendPct: 0.4,
    },
    {
      product: "Dates",
      byproduct: "Aseel Dates",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "1,200 Bags",
      min: 1800,
      max: 2400,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Almonds",
      byproduct: "Almond (Desi)",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "600 KG",
      min: 2800,
      max: 3400,
      trend: "up",
      trendPct: 1.5,
    },
    {
      product: "Pistachio",
      byproduct: "Pistachio",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "420 KG",
      min: 6500,
      max: 8000,
      trend: "stable",
      trendPct: 0.6,
    },
  ],
  siranwali: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "14,200 Bags",
      min: 2780,
      max: 2960,
      trend: "up",
      trendPct: 1.7,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "9,400 Bags",
      min: 4240,
      max: 4460,
      trend: "up",
      trendPct: 1.3,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "6,600 Bags",
      min: 3860,
      max: 4140,
      trend: "up",
      trendPct: 0.8,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "4,200 Bags",
      min: 1430,
      max: 1630,
      trend: "stable",
      trendPct: 0.3,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "1,600 Bags",
      min: 5150,
      max: 5550,
      trend: "up",
      trendPct: 1.2,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "8,400 Bags",
      min: 430,
      max: 530,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Wheat",
      byproduct: "Special Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "2,800 Bags",
      min: 4820,
      max: 5280,
      trend: "up",
      trendPct: 0.7,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,200 Bags",
      min: 2210,
      max: 2450,
      trend: "stable",
      trendPct: 0.6,
    },
    {
      product: "Wheat",
      byproduct: "Barley",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,400 Bags",
      min: 1950,
      max: 2150,
      trend: "up",
      trendPct: 0.7,
    },
    {
      product: "Wheat",
      byproduct: "Oat",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "720 Bags",
      min: 1650,
      max: 1880,
      trend: "stable",
      trendPct: 0.4,
    },
    {
      product: "Rice",
      byproduct: "1121 Basmati-1",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "18,400 Bags",
      min: 5100,
      max: 5500,
      trend: "up",
      trendPct: 3.2,
    },
    {
      product: "Paddy",
      byproduct: "Paddy Irri 6",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "14,200 Bags",
      min: 1800,
      max: 2000,
      trend: "down",
      trendPct: 0.8,
    },
    {
      product: "Paddy",
      byproduct: "Paddy Kainat-1121",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "9,100 Bags",
      min: 3200,
      max: 3600,
      trend: "up",
      trendPct: 2.6,
    },
  ],
  sargodha: [
    {
      product: "Wheat",
      byproduct: "Wheat",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "11,400 Bags",
      min: 2800,
      max: 2980,
      trend: "up",
      trendPct: 1.9,
    },
    {
      product: "Wheat",
      byproduct: "Fine Flour",
      emoji: "",
      rateType: "Wholesale Rate",
      arrival: "7,200 Bags",
      min: 4260,
      max: 4480,
      trend: "up",
      trendPct: 1.4,
    },
    {
      product: "Wheat",
      byproduct: "Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "5,100 Bags",
      min: 3880,
      max: 4160,
      trend: "up",
      trendPct: 0.9,
    },
    {
      product: "Wheat",
      byproduct: "Bran",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "3,400 Bags",
      min: 1440,
      max: 1640,
      trend: "stable",
      trendPct: 0.4,
    },
    {
      product: "Wheat",
      byproduct: "Semolina",
      emoji: "",
      rateType: "Dealer Rate",
      arrival: "1,300 Bags",
      min: 5160,
      max: 5560,
      trend: "up",
      trendPct: 1.3,
    },
    {
      product: "Wheat",
      byproduct: "Straw",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "7,200 Bags",
      min: 425,
      max: 525,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Wheat",
      byproduct: "Special Flour",
      emoji: "",
      rateType: "Retail Rate",
      arrival: "2,600 Bags",
      min: 4840,
      max: 5300,
      trend: "up",
      trendPct: 0.8,
    },
    {
      product: "Wheat",
      byproduct: "Sorghum",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,600 Bags",
      min: 2230,
      max: 2470,
      trend: "up",
      trendPct: 0.9,
    },
    {
      product: "Wheat",
      byproduct: "Barley",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "1,200 Bags",
      min: 1960,
      max: 2160,
      trend: "stable",
      trendPct: 0.5,
    },
    {
      product: "Wheat",
      byproduct: "Oat",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "600 Bags",
      min: 1660,
      max: 1890,
      trend: "up",
      trendPct: 0.6,
    },
    {
      product: "Citrus",
      byproduct: "Orange",
      emoji: "",
      rateType: "Farm Rate",
      arrival: "8,600 Crates",
      min: 1800,
      max: 2200,
      trend: "stable",
      trendPct: 0.2,
    },
    {
      product: "Citrus",
      byproduct: "Musambi",
      emoji: "",
      rateType: "Mandi Rate",
      arrival: "4,200 Crates",
      min: 2200,
      max: 2800,
      trend: "up",
      trendPct: 1.6,
    },
    {
      product: "Canola",
      byproduct: "Canola Seed",
      emoji: "",
      rateType: "Mill Rate",
      arrival: "2,400 Bags",
      min: 5300,
      max: 5700,
      trend: "up",
      trendPct: 1.0,
    },
  ],
};

//  UTILITY

const fmt = (n: number) =>
  n >= 100000
    ? `Rs.${(n / 100000).toFixed(1)}L`
    : `Rs.${n.toLocaleString("en-PK")}`;

//  CORRECTED IMAGE PATHS
// These match the actual Figma/project file structure:
//   src/icons/products/wheat200.png
//   src/icons/by-products/cotton/Cotton-A.png

const PRODUCTS_PATH = "/src/icons/products";
const BYPRODUCTS_PATH = "/src/icons/by-products";

const HOME_ICONS = {
  products: "/src/icons/products.png",
  liveMarket: "/src/icons/liveMarket.png",
  mandi: "/src/icons/mandi.png",
  homeHeader: "/src/icons/farm.png",
};

const ICON_PATHS: Record<string, string> = {
  //  Vertical / product-level icons
  grains: `${PRODUCTS_PATH}/wheat200.png`,
  Grains: `${PRODUCTS_PATH}/wheat200.png`,
  fruits: `${PRODUCTS_PATH}/fruits200.png`,
  vegetables: `${PRODUCTS_PATH}/vegetables200.png`,
  livestock: `${PRODUCTS_PATH}/wheat200.png`,
  "agri-inputs": `${PRODUCTS_PATH}/fertilizers.png`,
  "dry-fruits": `${PRODUCTS_PATH}/dryfruits200.png`,
  herbals: `${PRODUCTS_PATH}/herbals200.png`,
  kiryana: `${PRODUCTS_PATH}/wheat200.png`,
  wheat: `${PRODUCTS_PATH}/wheat200.png`,
  rice: `${PRODUCTS_PATH}/rice200.png`,
  paddy: `${PRODUCTS_PATH}/paddy200.png`,
  maize: `${PRODUCTS_PATH}/maize200.png`,
  cotton: `${PRODUCTS_PATH}/cotton200.png`,
  sugar: `${PRODUCTS_PATH}/sugar200.png`,
  mustard: `${PRODUCTS_PATH}/mustard200.png`,
  canola: `${PRODUCTS_PATH}/edible200.png`,
  sunflower: `${PRODUCTS_PATH}/edible200.png`,
  millet: `${PRODUCTS_PATH}/millet200.png`,
  sesame: `${PRODUCTS_PATH}/sesame200.png`,
  pulses: `${PRODUCTS_PATH}/pulses200.png`,
  spices: `${PRODUCTS_PATH}/spices200.png`,
  mango: `${PRODUCTS_PATH}/fruits200.png`,
  banana: `${PRODUCTS_PATH}/fruits200.png`,
  citrus: `${PRODUCTS_PATH}/fruits200.png`,
  melon: `${PRODUCTS_PATH}/fruits200.png`,
  apple: `${PRODUCTS_PATH}/fruits200.png`,
  pomegranate: `${PRODUCTS_PATH}/fruits200.png`,
  grape: `${PRODUCTS_PATH}/fruits200.png`,
  peach: `${PRODUCTS_PATH}/fruits200.png`,
  apricot: `${PRODUCTS_PATH}/fruits200.png`,
  papaya: `${PRODUCTS_PATH}/fruits200.png`,
  cherry: `${PRODUCTS_PATH}/fruits200.png`,
  plum: `${PRODUCTS_PATH}/fruits200.png`,
  falsa: `${PRODUCTS_PATH}/fruits200.png`,
  potato: `${PRODUCTS_PATH}/vegetables200.png`,
  tomato: `${PRODUCTS_PATH}/vegetables200.png`,
  onion: `${PRODUCTS_PATH}/vegetables200.png`,
  garlic: `${PRODUCTS_PATH}/vegetables200.png`,
  chilli: `${PRODUCTS_PATH}/chillies200.png`,
  brinjal: `${PRODUCTS_PATH}/vegetables200.png`,
  guar: `${PRODUCTS_PATH}/vegetables200.png`,
  lemon: `${PRODUCTS_PATH}/vegetables200.png`,
  "bitter-gourd": `${PRODUCTS_PATH}/vegetables200.png`,
  gourd: `${PRODUCTS_PATH}/vegetables200.png`,
  ginger: `${PRODUCTS_PATH}/vegetables200.png`,
  "sweet-potato": `${PRODUCTS_PATH}/vegetables200.png`,
  "salad-leaves": `${PRODUCTS_PATH}/vegetables200.png`,
  "cattle-market": `${PRODUCTS_PATH}/wheat200.png`,
  "slaughter-house": `${PRODUCTS_PATH}/wheat200.png`,
  slaughter: `${PRODUCTS_PATH}/wheat200.png`,
  poultry: `${PRODUCTS_PATH}/wheat200.png`,
  dairy: `${PRODUCTS_PATH}/wheat200.png`,
  fisheries: `${PRODUCTS_PATH}/wheat200.png`,
  feed: `${PRODUCTS_PATH}/wheat200.png`,
  cattle: `${PRODUCTS_PATH}/wheat200.png`,
  buffalo: `${PRODUCTS_PATH}/wheat200.png`,
  goat: `${PRODUCTS_PATH}/wheat200.png`,
  camel: `${PRODUCTS_PATH}/wheat200.png`,
  chicken: `${PRODUCTS_PATH}/wheat200.png`,
  milk: `${PRODUCTS_PATH}/wheat200.png`,
  eggs: `${PRODUCTS_PATH}/wheat200.png`,
  alfalfa: `${PRODUCTS_PATH}/wheat200.png`,
  "rhode-grass": `${PRODUCTS_PATH}/wheat200.png`,
  fertilizer: `${PRODUCTS_PATH}/fertilizers.png`,
  pesticide: `${PRODUCTS_PATH}/fertilizers.png`,
  herbicide: `${PRODUCTS_PATH}/fertilizers.png`,
  weedicide: `${PRODUCTS_PATH}/fertilizers.png`,
  almond: `${PRODUCTS_PATH}/dryfruits200.png`,
  cashew: `${PRODUCTS_PATH}/dryfruits200.png`,
  walnut: `${PRODUCTS_PATH}/dryfruits200.png`,
  fig: `${PRODUCTS_PATH}/dryfruits200.png`,
  pistachio: `${PRODUCTS_PATH}/dryfruits200.png`,
  raisin: `${PRODUCTS_PATH}/dryfruits200.png`,
  honey: `${PRODUCTS_PATH}/herbals200.png`,
  psyllium: `${PRODUCTS_PATH}/herbals200.png`,
  "black-seed": `${PRODUCTS_PATH}/herbals200.png`,
  "basil-seed": `${PRODUCTS_PATH}/herbals200.png`,
  "chia-seed": `${PRODUCTS_PATH}/herbals200.png`,
  saffron: `${PRODUCTS_PATH}/herbals200.png`,
  asafoetida: `${PRODUCTS_PATH}/herbals200.png`,
  "corom-seed": `${PRODUCTS_PATH}/herbals200.png`,
  "dry-lemon": `${PRODUCTS_PATH}/herbals200.png`,
  arugula: `${PRODUCTS_PATH}/edible200.png`,
  castor: `${PRODUCTS_PATH}/edible200.png`,
  soybean: `${PRODUCTS_PATH}/edible200.png`,
  Plum: `${PRODUCTS_PATH}/fruits200.png`,
  Grapes: `${PRODUCTS_PATH}/fruits200.png`,
  seed: `${PRODUCTS_PATH}/wheat200.png`,
  "2": `${PRODUCTS_PATH}/wheat200.png`,

  //  By-product icons – Cotton
  "Cotton-A": `${BYPRODUCTS_PATH}/cotton/Cotton-A.png`,
  "Cotton-B": `${BYPRODUCTS_PATH}/cotton/Cotton-B.png`,
  "Cotton-C": `${BYPRODUCTS_PATH}/cotton/Cotton-C.png`,
  "Cotton-Seed": `${BYPRODUCTS_PATH}/cotton/Cotton-Seed.png`,
  "Cotton-Seed-Oil": `${BYPRODUCTS_PATH}/cotton/Cotton-Seed-Oil.png`,
  "Cotton-Seed-Cake": `${BYPRODUCTS_PATH}/cotton/Cotton-Seed-Cake.png`,
  "Lint-Cotton": `${BYPRODUCTS_PATH}/cotton/Lint-Cotton.png`,

  //  By-product icons – Wheat
  Bran: `${BYPRODUCTS_PATH}/wheat/Bran.png`,
  "Fine-Flour": `${BYPRODUCTS_PATH}/wheat/Fine-Flour.png`,
  Flour: `${BYPRODUCTS_PATH}/wheat/Flour.png`,
  Semolina: `${BYPRODUCTS_PATH}/wheat/Semolina.png`,
  Straw: `${BYPRODUCTS_PATH}/wheat/Straw.png`,
  Sorghum: `${BYPRODUCTS_PATH}/wheat/Sorghum.png`,
  Barley: `${BYPRODUCTS_PATH}/wheat/Barley.png`,
  Oat: `${BYPRODUCTS_PATH}/wheat/Oat.png`,
  "Special-Flour": `${BYPRODUCTS_PATH}/wheat/Special-Flour.png`,
  Wheat: `${BYPRODUCTS_PATH}/wheat/Wheat.png`,

  //  By-product icons – Maize
  "Corn-Silage": `${BYPRODUCTS_PATH}/maize/Corn-Silage.png`,
  Popcorn: `${BYPRODUCTS_PATH}/maize/Popcorn.png`,
  "Maize-A": `${BYPRODUCTS_PATH}/maize/Maize-A.png`,
  "Maize-B": `${BYPRODUCTS_PATH}/maize/Maize-B.png`,
  "Maize-C": `${BYPRODUCTS_PATH}/maize/Maize-C.png`,
  "Maize-D": `${BYPRODUCTS_PATH}/maize/Maize-D.png`,
  "Corn-Starch": `${BYPRODUCTS_PATH}/maize/Corn-Starch.png`,
  "Popcorn-2": `${BYPRODUCTS_PATH}/maize/Popcorn.png`,

  //  By-product icons – Sugar
  Sugarcane: `${BYPRODUCTS_PATH}/sugar/Sugarcane.png`,
  Jaggery: `${BYPRODUCTS_PATH}/sugar/Jaggery.png`,
  "Brown-Sugar": `${BYPRODUCTS_PATH}/sugar/Brown-Sugar.png`,
  Sugar: `${BYPRODUCTS_PATH}/sugar/Sugar.png`,

  //  By-product icons – Mustard
  "Mustard-Seed": `${BYPRODUCTS_PATH}/mustard/Mustard-Seed.png`,
  "Mustard-Oil": `${BYPRODUCTS_PATH}/mustard/Mustard-Oil.png`,
  "Mustard-Cake": `${BYPRODUCTS_PATH}/mustard/Mustard-Cake.png`,

  //  By-product icons – Edible Oils (folder = edibleoils, no space)
  "Canola-Seed": `${BYPRODUCTS_PATH}/edibleoils/Canola-Seed.png`,
  "Canola-Oil": `${BYPRODUCTS_PATH}/edibleoils/Canola-Oil.png`,
  "Canola-Meal": `${BYPRODUCTS_PATH}/edibleoils/Canola-Meal.png`,
  "Sunflower-Seed": `${BYPRODUCTS_PATH}/edibleoils/Sunflower-Seed.png`,
  "Sunflower-Oil": `${BYPRODUCTS_PATH}/edibleoils/Sunflower-Oil.png`,
  "Sunflower-Meal": `${BYPRODUCTS_PATH}/edibleoils/Sunflower-Meal.png`,
  Arugula: `${BYPRODUCTS_PATH}/edibleoils/Arugula.png`,
  Castor: `${BYPRODUCTS_PATH}/edibleoils/Castor.png`,
  Soybean: `${BYPRODUCTS_PATH}/edibleoils/Soybean.png`,

  //  By-product icons – Pulses (no pulses/ subfolder — fall back to products)
  "Red-Lentils": `${PRODUCTS_PATH}/pulses200.png`,
  "Red-Lentils-Whole": `${PRODUCTS_PATH}/pulses200.png`,
  "Gram-Black": `${PRODUCTS_PATH}/pulses200.png`,
  "Gram-Pulse": `${PRODUCTS_PATH}/pulses200.png`,
  "Gram-White": `${PRODUCTS_PATH}/pulses200.png`,
  "Mung-Whole": `${PRODUCTS_PATH}/pulses200.png`,
  "Mung-Washed": `${PRODUCTS_PATH}/pulses200.png`,
  "Mash-Whole": `${PRODUCTS_PATH}/pulses200.png`,
  "Mash-Washed": `${PRODUCTS_PATH}/pulses200.png`,
  "Mash-Shell": `${PRODUCTS_PATH}/pulses200.png`,
  "Mung-Shell": `${PRODUCTS_PATH}/pulses200.png`,
  "Red-Kidney-Bean": `${PRODUCTS_PATH}/pulses200.png`,
  "White-Kidney-Bean": `${PRODUCTS_PATH}/pulses200.png`,
  Pigeon: `${PRODUCTS_PATH}/pulses200.png`,

  //  By-product icons – Spices (no spices/ subfolder — fall back to products)
  "Red-Chilli": `${PRODUCTS_PATH}/chillies200.png`,
  "Red-Chilli-Powder": `${PRODUCTS_PATH}/chillies200.png`,
  "Green-Chilli": `${PRODUCTS_PATH}/chillies200.png`,
  "White-Cumin": `${PRODUCTS_PATH}/spices200.png`,
  "Black-Cumin": `${PRODUCTS_PATH}/spices200.png`,
  Turmeric: `${PRODUCTS_PATH}/spices200.png`,
  "Black-Pepper": `${PRODUCTS_PATH}/spices200.png`,
  "Black-Pepper-Powder": `${PRODUCTS_PATH}/spices200.png`,
  Fennel: `${PRODUCTS_PATH}/spices200.png`,
  Cinnamon: `${PRODUCTS_PATH}/spices200.png`,
  Clove: `${PRODUCTS_PATH}/spices200.png`,
  "Small-Cardamom": `${PRODUCTS_PATH}/spices200.png`,
  "Large-Cardamom": `${PRODUCTS_PATH}/spices200.png`,
  Coriander: `${PRODUCTS_PATH}/spices200.png`,
  "Coriander-Powder": `${PRODUCTS_PATH}/spices200.png`,

  //  By-product icons – Dates
  Ajwa: `${BYPRODUCTS_PATH}/dates/Ajwa.png`,
  Aseel: `${BYPRODUCTS_PATH}/dates/Aseel.png`,
  "Aseel-Dried": `${BYPRODUCTS_PATH}/dates/Aseel-Dried.png`,
  Mazafati: `${BYPRODUCTS_PATH}/dates/Mazafati.png`,
  "Rabbi-Dates": `${BYPRODUCTS_PATH}/dates/Rabbi-Dates.png`,
  Amber: `${BYPRODUCTS_PATH}/dates/Amber.png`,
  "Begum-Jangi": `${BYPRODUCTS_PATH}/dates/Begum-Jangi.png`,
  "Dhaki-Dried": `${BYPRODUCTS_PATH}/dates/Dhaki-Dried.png`,
  "Zahidi-Dates": `${BYPRODUCTS_PATH}/dates/Zahidi-Dates.png`,
  "Sharifa-Dates": `${BYPRODUCTS_PATH}/dates/Sharifa-Dates.png`,
  Karbala: `${BYPRODUCTS_PATH}/dates/Karbala.png`,
  "Black-Aseel-Dried": `${BYPRODUCTS_PATH}/dates/Black-Aseel-Dried.png`,
  "Rangkat-Aseel-Dried": `${BYPRODUCTS_PATH}/dates/Rangkat-Aseel-Dried.png`,
  "Rangkat-Black-Aseel-Dried": `${BYPRODUCTS_PATH}/dates/Rangkat-Black-Aseel-Dried.png`,
  "Rangkat-Dhaki-Dried": `${BYPRODUCTS_PATH}/dates/Rangkat-Dhaki-Dried.png`,
  "Nar-Dried": `${BYPRODUCTS_PATH}/dates/Nar-Dried.png`,
  Jaifal: `${PRODUCTS_PATH}/dryfruits200.png`, // not in dates/ folder, fallback
  Jamsor: `${BYPRODUCTS_PATH}/dates/Jamsor.png`,
  Kupra: `${BYPRODUCTS_PATH}/dates/Kupra.png`,

  //  By-product icons – Fruits (no fruits/ subfolder — use products/fruits200.png)
  "Mango-Sindhri": `${PRODUCTS_PATH}/fruits200.png`,
  "Mango-White-Chaunsa": `${PRODUCTS_PATH}/fruits200.png`,
  "Mango-Black-Chaunsa": `${PRODUCTS_PATH}/fruits200.png`,
  "Mango-Anwar-Ratul": `${PRODUCTS_PATH}/fruits200.png`,
  "Mango-Fajri": `${PRODUCTS_PATH}/fruits200.png`,
  Oranges: `${PRODUCTS_PATH}/fruits200.png`,
  Mausambi: `${PRODUCTS_PATH}/fruits200.png`,
  Grapefruit: `${PRODUCTS_PATH}/fruits200.png`,
  "Sweet-Lime": `${PRODUCTS_PATH}/fruits200.png`,
  Fruiter: `${PRODUCTS_PATH}/fruits200.png`,
  Watermelon: `${PRODUCTS_PATH}/fruits200.png`,
  Apple: `${PRODUCTS_PATH}/fruits200.png`,
  Apricot: `${PRODUCTS_PATH}/fruits200.png`,
  Banana: `${PRODUCTS_PATH}/fruits200.png`,
  Cherry: `${PRODUCTS_PATH}/fruits200.png`,
  Falsa: `${PRODUCTS_PATH}/fruits200.png`,
  Melon: `${PRODUCTS_PATH}/fruits200.png`,
  Papaya: `${PRODUCTS_PATH}/fruits200.png`,
  Peach: `${PRODUCTS_PATH}/fruits200.png`,
  Pomegranate: `${PRODUCTS_PATH}/fruits200.png`,

  //  By-product icons – Vegetables
  Capsicum: `${BYPRODUCTS_PATH}/vegetables/Capsicum.png`,
  Cauliflower: `${BYPRODUCTS_PATH}/vegetables/Cauliflower.png`,
  cabbage: `${BYPRODUCTS_PATH}/vegetables/Cabbage.png`,
  "Brinjal-Round": `${BYPRODUCTS_PATH}/vegetables/Brinjal-Round.png`,
  "Brinjal-Long": `${BYPRODUCTS_PATH}/vegetables/Brinjal-Long.png`,
  carrot: `${BYPRODUCTS_PATH}/vegetables/Carrot.png`,
  spinach: `${BYPRODUCTS_PATH}/vegetables/Spinach.png`,
  peas: `${BYPRODUCTS_PATH}/vegetables/Peas.png`,
  okra: `${BYPRODUCTS_PATH}/vegetables/Okra.png`,
  cucumber: `${BYPRODUCTS_PATH}/vegetables/Cucumber.png`,
  "Bottle-Gourd": `${BYPRODUCTS_PATH}/vegetables/Bottle-Gourd.png`,
  "Ridge-Gourd": `${BYPRODUCTS_PATH}/vegetables/Ridge-Gourd.png`,
  "Round-Gourd": `${BYPRODUCTS_PATH}/vegetables/Round-Gourd.png`,
  turnip: `${BYPRODUCTS_PATH}/vegetables/Turnip.png`,
  Broccoli: `${BYPRODUCTS_PATH}/vegetables/Broccoli.png`,
  Onion: `${BYPRODUCTS_PATH}/vegetables/Onion.png`,
  Tomato: `${BYPRODUCTS_PATH}/vegetables/Tomato.png`,
  "Garlic-Desi": `${BYPRODUCTS_PATH}/vegetables/Garlic-Desi.png`,
  "Garlic-Chinese": `${BYPRODUCTS_PATH}/vegetables/Garlic-Chinese.png`,
  Ginger: `${BYPRODUCTS_PATH}/vegetables/Ginger.png`,
  Spinach: `${BYPRODUCTS_PATH}/vegetables/Spinach.png`,
  // Potato variants
  "Potato-Goli": `${BYPRODUCTS_PATH}/vegetables/Potato-Goli.png`,
  "Potato-Santa": `${BYPRODUCTS_PATH}/vegetables/Potato-Santa.png`,
  "Potato-Red": `${BYPRODUCTS_PATH}/vegetables/Potato-Red.png`,
  "Potato-White": `${BYPRODUCTS_PATH}/vegetables/Potato-White.png`,
  "Potato-Raveera": `${BYPRODUCTS_PATH}/vegetables/Potato-Raveera.png`,
  "Potato-Seed": `${BYPRODUCTS_PATH}/vegetables/Potato-Seed.png`,
  "Potato-Mozika": `${BYPRODUCTS_PATH}/vegetables/Potato-Mozika.png`,
  "Potato-LR": `${BYPRODUCTS_PATH}/vegetables/Potato-LR.png`,
  "Potato-Stone": `${BYPRODUCTS_PATH}/vegetables/Potato-Stone.png`,

  //  By-product icons – Fertilizers (actual folder = fertilizers)
  Urea: `${BYPRODUCTS_PATH}/fertilizers/Urea.png`,
  "Zabardast-Urea": `${BYPRODUCTS_PATH}/fertilizers/Zabardast-Urea.png`,
  DAP: `${BYPRODUCTS_PATH}/fertilizers/DAP.png`,
  NP: `${BYPRODUCTS_PATH}/fertilizers/NP.png`,
  NPK: `${BYPRODUCTS_PATH}/fertilizers/NPK.png`,
  SSP: `${BYPRODUCTS_PATH}/fertilizers/SSP.png`,
  MOP: `${BYPRODUCTS_PATH}/fertilizers/MOP.png`,
  TSP: `${BYPRODUCTS_PATH}/fertilizers/TSP.png`,
  CAN: `${BYPRODUCTS_PATH}/fertilizers/CAN.png`,
  "SOP-G": `${BYPRODUCTS_PATH}/fertilizers/SOP-G.png`,
  "Ammonium-Nitrate": `${BYPRODUCTS_PATH}/fertilizers/Ammonium-Nitrate.png`,
  "Ammonium-Sulphate": `${BYPRODUCTS_PATH}/fertilizers/Ammonium-Sulphate.png`,
  "Pak-Arab-Guara": `${BYPRODUCTS_PATH}/fertilizers/Pak-Arab-Guara.png`,
  Enrich: `${BYPRODUCTS_PATH}/fertilizers/Enrich.png`,

  //  Weedicides/Pesticides (no weedicides/ subfolder — fall back to fertilizers product icon)
  "Chlorfenapyr-36SC": `${PRODUCTS_PATH}/fertilizers.png`,
  "Clothianidin-20EC": `${PRODUCTS_PATH}/fertilizers.png`,
  "Mesotrione-Atrazine-50WP": `${PRODUCTS_PATH}/fertilizers.png`,
  "Mesotrione-Atrazine-55WP": `${PRODUCTS_PATH}/fertilizers.png`,
  "S-metolachlor": `${PRODUCTS_PATH}/fertilizers.png`,
  cigarete: `${PRODUCTS_PATH}/fertilizers.png`,

  //  By-product icons – Dry Fruits
  "Almond-American": `${BYPRODUCTS_PATH}/dryfruits/Almond-American.png`,
  "Almond-Australian": `${BYPRODUCTS_PATH}/dryfruits/Almond-Australian.png`,
  "Almond-Desi": `${BYPRODUCTS_PATH}/dryfruits/Almond-Desi.png`,
  "Dried-Raisins": `${BYPRODUCTS_PATH}/dryfruits/Dried-Raisins.png`,
  Cashew: `${BYPRODUCTS_PATH}/dryfruits/Cashew.png`,
  Walnut: `${BYPRODUCTS_PATH}/dryfruits/Walnut.png`,
  Fig: `${BYPRODUCTS_PATH}/dryfruits/Fig.png`,
  Pistachio: `${BYPRODUCTS_PATH}/dryfruits/Pistachio.png`,

  //  Livestock (no livestock/ subfolder — fall back to products/wheat200.png)
  alfalfa2: `${PRODUCTS_PATH}/wheat200.png`,
  buffalo2: `${PRODUCTS_PATH}/wheat200.png`,
  camel2: `${PRODUCTS_PATH}/wheat200.png`,
  cattle2: `${PRODUCTS_PATH}/wheat200.png`,
  chicken2: `${PRODUCTS_PATH}/wheat200.png`,
  goat2: `${PRODUCTS_PATH}/wheat200.png`,
  milk2: `${PRODUCTS_PATH}/wheat200.png`,
  "rhode-grass2": `${PRODUCTS_PATH}/wheat200.png`,
  slaughter2: `${PRODUCTS_PATH}/wheat200.png`,
};

// Map friendly product names to sprite keys
const product_SPRITE_KEY: Record<string, string> = {
  // Verticals
  Grains: "grains",
  Fruits: "fruits",
  Vegetables: "vegetables",
  Livestock: "livestock",
  "Agri Inputs": "agri-inputs",
  "Dry Fruits": "dry-fruits",
  Herbals: "herbals",
  Kiryana: "kiryana",
  // Wheat & byproducts
  Wheat: "wheat",
  Bran: "Bran",
  "Fine Flour": "Fine-Flour",
  Flour: "Flour",
  Semolina: "Semolina",
  Straw: "Straw",
  Sorghum: "Sorghum",
  Barley: "Barley",
  Oat: "Oat",
  "Special Flour": "Special-Flour",
  // Rice / Paddy / Maize
  Rice: "rice",
  Paddy: "paddy",
  Maize: "maize",
  "Corn Silage": "Corn-Silage",
  Popcorn: "Popcorn",
  "Maize Grade A": "Maize-A",
  "Maize Grade B": "Maize-B",
  "Maize Grade C": "Maize-C",
  // Cotton
  Cotton: "cotton",
  "Cotton Grade A": "Cotton-A",
  "Cotton Grade B": "Cotton-B",
  "Cotton Grade C": "Cotton-C",
  "Cotton Seed": "Cotton-Seed",
  "Cotton Seed Oil": "Cotton-Seed-Oil",
  "Cotton Seed Cake": "Cotton-Seed-Cake",
  "Lint Cotton": "Lint-Cotton",
  // Sugar
  Sugar: "sugar",
  "Sugar (Mill)": "sugar",
  "Sugar (Wholesale)": "sugar",
  "Sugar (Retail)": "sugar",
  Sugarcane: "Sugarcane",
  Jaggery: "Jaggery",
  "Brown Sugar": "Brown-Sugar",
  // Mustard
  Mustard: "mustard",
  "Mustard Seed": "Mustard-Seed",
  "Mustard Oil": "Mustard-Oil",
  "Mustard Cake": "Mustard-Cake",
  // Canola
  Canola: "canola",
  "Canola Seed": "Canola-Seed",
  "Canola Oil": "Canola-Oil",
  "Canola Meal": "Canola-Meal",
  // Sunflower
  Sunflower: "sunflower",
  "Sunflower Seed": "Sunflower-Seed",
  "Sunflower Oil": "Sunflower-Oil",
  "Sunflower Meal": "Sunflower-Meal",
  // Millet / Sesame
  Millet: "millet",
  "Millet Grade A": "millet",
  "Millet Grade B": "millet",
  "Millet Grade C": "millet",
  Sesame: "sesame",
  "Sesame Grade A": "sesame",
  "Sesame Grade B": "sesame",
  "Sesame Grade C": "sesame",
  // Pulses
  Pulses: "pulses",
  "Red Lentil": "Red-Lentils",
  "Whole Red Lentil Large": "Red-Lentils",
  "Whole Red Lentil Small": "Red-Lentils",
  "Black Chickpea Large": "Gram-Black",
  "Black Chickpea Small": "Gram-Black",
  "Split Chickpea Large": "Gram-Pulse",
  "Kabuli Chickpea 7mm": "Gram-White",
  "Kabuli Chickpea 9mm": "Gram-White",
  "Whole Green Gram Large": "Mung-Whole",
  "Split Green Gram Washed": "Mung-Washed",
  "Whole Black Gram Small": "Mash-Whole",
  "Pigeon Pea Large": "Gram-Pulse",
  "Red Kidney Bean Large": "Red-Kidney-Bean",
  "White Kidney Bean Large": "White-Kidney-Bean",
  // Spices
  Spices: "spices",
  "Red Chilli": "Red-Chilli",
  "Red Chilli Powder": "Red-Chilli-Powder",
  "Coriander Seed": "Coriander",
  "Coriander Seed Powder": "Coriander-Powder",
  "White Cumin": "White-Cumin",
  "Black Cumin": "Black-Cumin",
  Turmeric: "Turmeric",
  "Black Pepper": "Black-Pepper",
  "Black Pepper Powder": "Black-Pepper-Powder",
  Fennel: "Fennel",
  Cinnamon: "Cinnamon",
  Clove: "Clove",
  "Small Cardamom": "Small-Cardamom",
  "Large Black Cardamom": "Large-Cardamom",
  "Longi Chilli": "chilli",
  "Hybrid Chilli": "chilli",
  // Dates
  Dates: "Aseel",
  "Ajwa Dates": "Ajwa",
  "Aseel Dates": "Aseel",
  "Mazafati Dates": "Mazafati",
  "Rabbi Dates": "Rabbi-Dates",
  "Amber Dates": "Amber",
  "Begum Jangi Dates": "Begum-Jangi",
  "Aseel Dry Dates": "Aseel-Dried",
  "Dhaki Dry Dates": "Dhaki-Dried",
  // Soybean
  Soybean: "soybean",
  "Soybean Seed": "soybean",
  "Soybean Oil": "soybean",
  "Soybean Meal": "soybean",
  // Edible Oils
  "Edible Oil": "canola",
  Arugula: "Arugula",
  "Arugula Seed": "Arugula",
  "Arugula Oil": "Arugula",
  Castor: "Castor",
  "Castor Bean": "Castor",
  "Castor Oil": "Castor",
  // Fruits
  Mango: "mango",
  "Mango Sindhri": "Mango-Sindhri",
  "Mango White Chunsa": "Mango-White-Chaunsa",
  "Mango Black Chunsa": "Mango-Black-Chaunsa",
  "Mango Anwer Ratul": "Mango-Anwar-Ratul",
  "Mango Fajri": "Mango-Fajri",
  "Mango Dasheri": "mango",
  "Mango Almas": "mango",
  "Mango Saroli": "mango",
  Banana: "Banana",
  Citrus: "citrus",
  Orange: "Oranges",
  Musambi: "Mausambi",
  Grapefruit: "Grapefruit",
  Mandarin: "Oranges",
  "Sweet Lime": "Sweet-Lime",
  Fruiter: "Fruiter",
  Melon: "melon",
  Watermelon: "Watermelon",
  Apple: "Apple",
  "Apple Kala Kullu": "Apple",
  "Apple Golden": "Apple",
  Pomegranate: "Pomegranate",
  Grapes: "Grapes",
  Peach: "Peach",
  Apricot: "Apricot",
  Papaya: "Papaya",
  Cherry: "Cherry",
  Plum: "Plum",
  Falsa: "Falsa",
  // Vegetables
  Potato: "potato",
  "Potato (Mozika)": "Potato-Mozika",
  "Potato (Santa)": "Potato-Santa",
  "Potato (Red)": "Potato-Red",
  "Potato (White)": "Potato-White",
  "Potato (Goli)": "Potato-Goli",
  "Potato (Raveera)": "Potato-Raveera",
  "Potato (Seed)": "Potato-Seed",
  Tomato: "Tomato",
  "Tomato (Grade A)": "Tomato",
  "Tomato (Grade B)": "Tomato",
  "Tomato (Grade C)": "Tomato",
  Onion: "Onion",
  "Onion (Grade A)": "Onion",
  "Onion (Grade B)": "Onion",
  "Onion (Grade C)": "Onion",
  Garlic: "garlic",
  "Garlic Desi": "Garlic-Desi",
  "Garlic Chinese": "Garlic-Chinese",
  "Garlic G1": "garlic",
  "Garlic Harnai": "garlic",
  Chilli: "chilli",
  "Desi Chilli": "chilli",
  "Green Chilli - Small": "Green-Chilli",
  "Green Chilli - Medium": "Green-Chilli",
  "Green Chilli - Large": "Green-Chilli",
  Capsicum: "Capsicum",
  Cauliflower: "Cauliflower",
  Cabbage: "cabbage",
  Brinjal: "brinjal",
  "Brinjal Round": "Brinjal-Round",
  "Brinjal Long": "Brinjal-Long",
  Carrot: "carrot",
  Spinach: "spinach",
  Peas: "peas",
  Guar: "guar",
  Okra: "okra",
  Cucumber: "cucumber",
  "Bitter Gourd": "bitter-gourd",
  "Bottle Gourd": "Bottle-Gourd",
  "Round Gourd": "Round-Gourd",
  "Ridge Gourd": "Ridge-Gourd",
  Ginger: "Ginger",
  "Lemon Desi": "lemon",
  "Lemon China": "lemon",
  Lemon: "lemon",
  Turnip: "turnip",
  "Sweet Potato": "sweet-potato",
  Broccoli: "Broccoli",
  // Livestock
  "Cattle Market": "cattle-market",
  "Slaughter House": "slaughter-house",
  Poultry: "poultry",
  Dairy: "dairy",
  Fisheries: "fisheries",
  Feed: "feed",
  Cow: "cattle",
  Buffalo: "buffalo",
  Goat: "goat",
  Camel: "camel",
  Broiler: "chicken",
  Layer: "chicken",
  Milk: "milk",
  Yogurt: "milk",
  Butter: "dairy",
  Rohu: "fisheries",
  Catla: "fisheries",
  Tilapia: "fisheries",
  Alfalfa: "alfalfa",
  "Rhode Grass": "rhode-grass",
  "Wheat Bran": "Bran",
  "Wheat Straw": "Straw",
  "Canola Meal Feed": "Canola-Meal",
  "Mustard Seed Cake": "Mustard-Cake",
  "Cotton Seed Cake Feed": "Cotton-Seed-Cake",
  Eggs: "eggs",
  // Agri Inputs
  Fertilizer: "fertilizer",
  Pesticide: "pesticide",
  Weedicide: "weedicide",
  Herbicide: "herbicide",
  Urea: "Urea",
  "Zabardast Urea": "Zabardast-Urea",
  DAP: "DAP",
  NP: "NP",
  NPK: "NPK",
  SSP: "SSP",
  MOP: "MOP",
  TSP: "TSP",
  CAN: "CAN",
  "SOP-G": "SOP-G",
  "Ammonium Nitrate": "Ammonium-Nitrate",
  "Ammonium Sulphate": "Ammonium-Sulphate",
  "Pak Arab Guara": "Pak-Arab-Guara",
  "Chlorphenapyr 36% SC": "Chlorfenapyr-36SC",
  "Clothianidin 20% EC": "Clothianidin-20EC",
  "Mesotrione + Atrazine 50% WP": "Mesotrione-Atrazine-50WP",
  "Mesotrione + Atrazine 55% WP": "Mesotrione-Atrazine-55WP",
  "S-Metolachlor 960EC 800ML": "S-metolachlor",
  Glyphosate: "weedicide",
  // Dry Fruits
  Almonds: "almond",
  "Almond (American)": "Almond-American",
  "Almond (Australian)": "Almond-Australian",
  "Almond (Desi)": "Almond-Desi",
  Cashew: "Cashew",
  Walnut: "Walnut",
  Fig: "Fig",
  Pistachio: "Pistachio",
  Raisins: "raisin",
  "Dried Raisins": "Dried-Raisins",
  // Herbals
  Honey: "honey",
  Psyllium: "psyllium",
  "Psyllium Seed": "psyllium",
  "Psyllium Husk": "psyllium",
  "Black Seed": "black-seed",
  "Black Seed Oil": "black-seed",
  "Carom Seed": "corom-seed",
  "Basil Seed": "basil-seed",
  "Chia Seed": "chia-seed",
  Saffron: "saffron",
  Asafoetida: "asafoetida",
  // Kiryana specific
  "Rice Polish": "rice",
  "Broken Irri 6": "rice",
};

function getproductIconSrc(
  name?: string | null,
  vertical?: string | null,
): string {
  if (!name && !vertical)
    return ICON_PATHS.wheat || `${PRODUCTS_PATH}/wheat200.png`;

  const n = (name || "").trim();

  // 1. Direct lookup in ICON_PATHS
  if (ICON_PATHS[n]) return ICON_PATHS[n];

  // 2. Hyphenated lookup (e.g. "Cotton A" -> "Cotton-A", "Fine Flour" -> "Fine-Flour")
  const hyphenated = n.replace(/\s+/g, "-");
  if (ICON_PATHS[hyphenated]) return ICON_PATHS[hyphenated];

  // 3. product_SPRITE_KEY mapping
  const spriteKey = product_SPRITE_KEY[n] || product_SPRITE_KEY[hyphenated];
  if (spriteKey) {
    if (ICON_PATHS[spriteKey]) return ICON_PATHS[spriteKey];
    const spriteHyphen = spriteKey.replace(/\s+/g, "-");
    if (ICON_PATHS[spriteHyphen]) return ICON_PATHS[spriteHyphen];
  }

  // 4. Lowercase lookup
  const lower = n.toLowerCase();
  if (ICON_PATHS[lower]) return ICON_PATHS[lower];

  // 5. Case-insensitive key match in ICON_PATHS
  const foundKey = Object.keys(ICON_PATHS).find(
    (k) =>
      k.toLowerCase() === lower || k.toLowerCase() === hyphenated.toLowerCase(),
  );
  if (foundKey && ICON_PATHS[foundKey]) return ICON_PATHS[foundKey];

  // 6. Vertical fallback
  if (vertical) {
    const vTrim = vertical.trim();
    const vSprite = product_SPRITE_KEY[vTrim];
    if (vSprite && ICON_PATHS[vSprite]) return ICON_PATHS[vSprite];
    const vLower = vTrim.toLowerCase();
    if (ICON_PATHS[vLower]) return ICON_PATHS[vLower];
  }

  // 7. Default
  return ICON_PATHS.wheat || `${PRODUCTS_PATH}/wheat200.png`;
}

function getVerticalForProduct(productName: string): string {
  return (
    Object.entries(VERTICALS).find(([, vd]) => vd.products[productName])?.[0] ||
    "Grains"
  );
}

const REAL_product_IMAGES: Record<string, string> = new Proxy(
  {},
  {
    get: (_, prop: string) => getproductIconSrc(prop),
  },
) as Record<string, string>;

// Clean Bell Icon with notification badge
function BellIconSVG({
  size = 20,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// Clean Lock Icon
function LockIconSVG({
  size = 18,
  color = "#4A6258",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16" r="1.5" fill={color} />
    </svg>
  );
}

// Clean Voice Off / Voice On Badge Icon
function VoiceBadgeIconSVG({
  active = false,
  size = 14,
}: {
  active?: boolean;
  size?: number;
}) {
  return (
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: active ? "#2FAE68" : "#E24D44",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {active ? (
        <svg
          width={size - 4}
          height={size - 4}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
        </svg>
      ) : (
        <svg
          width={size - 4}
          height={size - 4}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a6.97 6.97 0 0 1-.7 3" />
          <line x1="12" y1="19" x2="12" y2="23" />
        </svg>
      )}
    </span>
  );
}

// Clean Pin Icon
function PinIconSVG({
  size = 13,
  color = "#85E2B8",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size + 3}
      viewBox="0 0 10 13"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M5 0C2.794 0 1 1.794 1 4c0 3 4 9 4 9s4-6 4-9c0-2.206-1.794-4-4-4z"
        fill={color}
      />
      <circle cx="5" cy="4" r="1.5" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
}

function AgriAmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: 16 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.45) * 0.3,
      vy: -Math.random() * 0.4 - 0.15,
      alpha: Math.random() * 0.35 + 0.15,
    }));

    let tick = 0;
    const render = () => {
      tick += 0.012;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(tick + p.y * 0.02) * 0.2;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 220, 200, ${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7, zIndex: 0 }}
    />
  );
}

function AgriForegroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = agriForegroundImg;

    let animId: number = 0;
    const render = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) return;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      if (img.complete && img.naturalWidth > 0) {
        // Draw the curved sagging foreground graphic maintaining aspect ratio, anchored to bottom
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const drawHeight = Math.max(height, width / imgAspect);
        const drawWidth = drawHeight * imgAspect;
        const drawX = (width - drawWidth) / 2;
        const drawY = height - drawHeight;

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      }
      ctx.restore();
    };

    img.onload = () => {
      render();
    };

    const ro = new ResizeObserver(() => {
      render();
    });

    if (canvas.parentElement) {
      ro.observe(canvas.parentElement);
    }

    render();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none select-none"
      style={{
        height: "clamp(55px, 8vh, 72px)",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function getSpriteKey(name: string, vertical?: string): string | null {
  return (
    product_SPRITE_KEY[name] ||
    (vertical ? product_SPRITE_KEY[vertical] : null) ||
    null
  );
}

function SpriteIcon({
  spriteKey,
  size = 44,
  className,
  style,
}: {
  spriteKey: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const src = getproductIconSrc(spriteKey);
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      <img
        src={src}
        alt={spriteKey}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          display: "block",
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function ProductIcon({
  name,
  vertical,
  size = 44,
  className,
  style,
}: {
  name: string;
  vertical?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const src = getproductIconSrc(name, vertical);
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          display: "block",
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

const getVerticalIcon = (v: string) => VERTICALS[v]?.icon || "grains";

function ScrollRow({
  children,
  bg = "#F4FAF7",
  style,
}: {
  children: React.ReactNode;
  bg?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const isRtl = lang === "ur";

  const scrollLeft = () =>
    ref.current?.scrollBy({ left: isRtl ? 160 : -160, behavior: "smooth" });
  const scrollRight = () =>
    ref.current?.scrollBy({ left: isRtl ? -160 : 160, behavior: "smooth" });

  return (
    <div className="relative flex-shrink-0 w-full" style={style}>
      <div
        ref={ref}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          touchAction: "pan-x",
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 7,
          paddingBottom: 10,
          scrollbarWidth: "none",
        }}
      >
        {children}
      </div>
      <button
        onClick={scrollLeft}
        className="tap-target absolute left-0 top-0 bottom-0 flex items-center justify-start pl-1 z-10 opacity-70 hover:opacity-100"
        style={{
          width: 24,
          background: `linear-gradient(to right, ${bg} 70%, transparent)`,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#087F63",
            lineHeight: 1,
          }}
        >
          ‹
        </span>
      </button>
      <button
        onClick={scrollRight}
        className="tap-target absolute right-0 top-0 bottom-0 flex items-center justify-end pr-1 z-10 opacity-70 hover:opacity-100"
        style={{
          width: 24,
          background: `linear-gradient(to left, ${bg} 70%, transparent)`,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#087F63",
            lineHeight: 1,
          }}
        >
          ›
        </span>
      </button>
    </div>
  );
}

function TrendBadge({
  trend,
  pct,
  compact,
}: {
  trend: "up" | "down" | "stable";
  pct: number;
  compact?: boolean;
}) {
  const displayPct = Math.abs(pct || 2.4).toFixed(1);
  if (trend === "up")
    return (
      <span
        style={{
          background: "#E4F2EC",
          color: "#087F63",
          border: "1px solid #B8DCCF",
        }}
        className={
          compact
            ? "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex-shrink-0 inline-flex items-center gap-0.5"
            : "text-xs font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 inline-flex items-center gap-0.5"
        }
      >
        <span>▲</span>
        <span>+{displayPct}%</span>
      </span>
    );
  if (trend === "down")
    return (
      <span
        style={{
          background: "#FCE8E6",
          color: "#C94A43",
          border: "1px solid #F5C2BE",
        }}
        className={
          compact
            ? "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex-shrink-0 inline-flex items-center gap-0.5"
            : "text-xs font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 inline-flex items-center gap-0.5"
        }
      >
        <span>▼</span>
        <span>-{displayPct}%</span>
      </span>
    );
  return (
    <span
      style={{
        background: "#EDF2EF",
        color: "#52635F",
        border: "1px solid #D5E2DD",
      }}
      className={
        compact
          ? "text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
          : "text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
      }
    >
      0.0%
    </span>
  );
}

//  ZM MESSAGE CARD & MODAL

function ZMMessageCard({ msg }: { msg: FeedMsg }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#F4FAF7",
        border: "1px solid #D5E2DD",
        maxWidth: 340,
      }}
    >
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{ background: "#075E4F" }}
      >
        <SpriteIcon
          spriteKey="herbals"
          size={22}
          style={{ filter: "brightness(0) invert(1)", flexShrink: 0 }}
        />
        <div className="flex-1">
          <p className="text-white text-xs font-bold">
            زرعی منڈی ڈیلی ریٹس سروس
          </p>
          <p className="text-green-200 text-[10px]">
            Zarai Mandi Daily Rates Service
          </p>
        </div>
        <span className="text-green-200 text-[10px] flex-shrink-0">
          {msg.time}
        </span>
      </div>
      <div className="px-4 py-3">
        <div
          className="urdu text-sm mb-3 leading-loose border-b border-[#DCE8E3] pb-2"
          style={{ color: "#17352F", fontSize: 13 }}
        >
          <p>تاریخ : 03-08-2026</p>
          <p>
            اجناس : <strong>{msg.productUrdu}</strong> ({msg.byproduct})
          </p>
          <p>
            مقام : <strong>{msg.stationUrdu}</strong>، ({msg.province})
          </p>
          <p>
            ریٹ : {msg.priceMin.toLocaleString("en-PK")}–
            {msg.priceMax.toLocaleString("en-PK")} روپے / ({msg.unit})
          </p>
          <p>
            آمد : {msg.arrivalCount} {msg.arrivalUnitUrdu}
          </p>
          <p>رنگت : {msg.colorUrdu}</p>
          <p>قیمت کی قسم : {RATE_TYPE_URDU[msg.rateType] || msg.rateType}</p>
        </div>
        <div className="text-xs leading-relaxed" style={{ color: "#183B34" }}>
          <p>
            product : <strong>{msg.product}</strong> · {msg.byproduct}
          </p>
          <p>
            Station : <strong>{msg.station}</strong> ({msg.province})
          </p>
          <p className="font-semibold" style={{ color: "#087F63" }}>
            Rate : Rs {msg.priceMin.toLocaleString()}–
            {msg.priceMax.toLocaleString()} / {msg.unit}
          </p>
          <p>
            Arrival : {msg.arrivalCount} {msg.arrivalUnit} · {msg.rateType}
          </p>
          <p>
            Color : {msg.color} · {msg.spec} · {msg.quality}
          </p>
        </div>
      </div>
    </div>
  );
}

function ZMMessageModal({
  msg,
  onClose,
}: {
  msg: FeedMsg;
  onClose: () => void;
}) {
  return (
    <div className="zm-sheet-overlay" style={{ zIndex: 300 }} onClick={onClose}>
      <div className="zm-sheet" onClick={(e) => e.stopPropagation()}>
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: "#075E4F" }}
        >
          <div>
            <p className="text-white font-bold">ZM Rate Report</p>
            <p className="text-green-200 text-xs">
              {msg.product} · {msg.byproduct} · {msg.station}
            </p>
          </div>
          <button
            onClick={onClose}
            className="tap-target text-white text-xl w-10 h-10 flex items-center justify-center"
          ></button>
        </div>
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "78vh", background: "#e5ddd5" }}
        >
          <div className="p-4">
            <ZMMessageCard msg={msg} />
          </div>
        </div>
      </div>
    </div>
  );
}

//  SHEETS

function PriceTypeSheet({
  selected,
  onApply,
  onClose,
}: {
  selected: string[];
  onApply: (v: string[]) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<string[]>(selected);
  const toggle = (rt: string) =>
    setLocal((p) => (p.includes(rt) ? p.filter((x) => x !== rt) : [...p, rt]));
  return (
    <div className="zm-sheet-overlay" style={{ zIndex: 200 }} onClick={onClose}>
      <div
        className="zm-sheet-high"
        style={{ maxHeight: "82vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 border-b border-[#DCE8E3] flex-shrink-0">
          <div className="zm-drag-handle" />
          <p className="font-bold text-lg">Price Types</p>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0 p-4 flex flex-col gap-2">
          <button
            onClick={() => {
              if (local.length === ALL_RATE_TYPES.length) setLocal([]);
              else setLocal([...ALL_RATE_TYPES]);
            }}
            className="tap-target rounded-2xl px-4 py-3.5 flex items-center gap-3"
            style={{
              background:
                local.length === ALL_RATE_TYPES.length ? "#168A76" : "#F1F7F4",
              color:
                local.length === ALL_RATE_TYPES.length ? "#fff" : "#183B34",
              border: `1.5px solid ${
                local.length === ALL_RATE_TYPES.length ? "#168A76" : "#D5E2DD"
              }`,
            }}
          >
            <div
              className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center"
              style={{
                background:
                  local.length === ALL_RATE_TYPES.length
                    ? "rgba(255,255,255,0.3)"
                    : "#E8EFEC",
                border:
                  local.length === ALL_RATE_TYPES.length
                    ? "none"
                    : "1.5px solid #168A76",
              }}
            >
              {local.length === ALL_RATE_TYPES.length && (
                <span
                  style={{
                    fontSize: 9,
                    color: "#fff",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                ></span>
              )}
            </div>
            <span className="font-bold text-sm flex-1">All Price Types</span>
            {local.length === ALL_RATE_TYPES.length && (
              <span className="text-xs opacity-80">
                ({ALL_RATE_TYPES.length})
              </span>
            )}
          </button>
          {ALL_RATE_TYPES.map((rt) => (
            <button
              key={rt}
              onClick={() => toggle(rt)}
              className="tap-target rounded-2xl px-4 flex items-center gap-3"
              style={{
                background: local.includes(rt) ? "#EAF5F1" : "#F1F7F4",
                border: `1.5px solid ${
                  local.includes(rt) ? "#168A76" : "#D5E2DD"
                }`,
                minHeight: 52,
              }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: RATE_COLORS[rt] }}
              />
              <span className="flex-1 font-semibold text-sm">{rt}</span>
              {local.includes(rt) && (
                <span
                  className="text-xs font-bold"
                  style={{ color: "#168A76" }}
                ></span>
              )}
            </button>
          ))}
        </div>
        <div className="px-4 pb-6 pt-3 border-t border-[#DCE8E3] flex-shrink-0">
          <button
            onClick={() => {
              onApply(local);
              onClose();
            }}
            className="tap-target w-full rounded-2xl py-4 font-bold text-white text-base"
            style={{ background: "#168A76" }}
          >
            {local.length === ALL_RATE_TYPES.length
              ? "Show All Price Types"
              : local.length > 0
                ? `Apply ${local.length} Type${local.length > 1 ? "s" : ""}`
                : "Show All Price Types"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MandiPickerSheet({
  selected,
  onApply,
  onClose,
}: {
  selected: string[];
  onApply: (names: string[]) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<string[]>(selected);
  const [province, setProvince] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState("");

  const toggle = (name: string) =>
    setLocal((p) =>
      p.includes(name) ? p.filter((x) => x !== name) : [...p, name],
    );
  const searchResults =
    searchQ.length >= 2
      ? ALL_MANDI_NAMES.filter((n) =>
          n.toLowerCase().includes(searchQ.toLowerCase()),
        )
      : [];
  const back = () => {
    if (district) setDistrict(null);
    else if (province) setProvince(null);
  };

  return (
    <div className="zm-sheet-overlay" style={{ zIndex: 200 }} onClick={onClose}>
      <div
        className="zm-sheet-high"
        style={{ maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 border-b border-[#DCE8E3] flex-shrink-0">
          <div className="zm-drag-handle" />
          <div className="flex items-center gap-3 mb-3">
            {(province || district) && (
              <button
                className="tap-target text-xl w-9 h-9 flex items-center justify-center rounded-xl"
                style={{ background: "#E8EFEC" }}
                onClick={back}
              >
                ←
              </button>
            )}
            <div className="flex-1">
              <p className="font-bold text-lg">
                {!province
                  ? "Select Mandi"
                  : !district
                    ? province
                    : `${province} › ${district}`}
              </p>
              <p className="text-xs" style={{ color: "#52635F" }}>
                {!province
                  ? "Province or search"
                  : !district
                    ? "Select district"
                    : "Select mandi"}
              </p>
            </div>
            {local.length > 0 && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#087F63", color: "#fff" }}
              >
                {local.length}
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-2 rounded-2xl px-3"
            style={{ background: "#E8EFEC", height: 44 }}
          >
            <span></span>
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search mandi name…"
              className="flex-1 text-sm bg-transparent outline-none"
              style={{ fontFamily: "Poppins,sans-serif" }}
            />
            {searchQ && (
              <button
                onClick={() => setSearchQ("")}
                className="tap-target text-[#80918B]"
              ></button>
            )}
          </div>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0 p-4 flex flex-col gap-2">
          {searchQ.length >= 2 ? (
            searchResults.length > 0 ? (
              searchResults.map((name) => (
                <button
                  key={name}
                  onClick={() => toggle(name)}
                  className="tap-target flex-shrink-0 rounded-2xl px-4 flex items-center gap-3"
                  style={{
                    background: local.includes(name) ? "#F1F7F4" : "#F1F7F4",
                    border: `1.5px solid ${
                      local.includes(name) ? "#087F63" : "#D5E2DD"
                    }`,
                    height: 60,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      background: local.includes(name) ? "#087F63" : "#E8EFEC",
                    }}
                  >
                    {local.includes(name) && (
                      <span
                        className="text-white font-bold"
                        style={{ fontSize: 10 }}
                      ></span>
                    )}
                  </div>
                  <span className="font-semibold text-sm flex-1 text-left">
                    {name}
                  </span>
                </button>
              ))
            ) : (
              <div className="text-center py-10 opacity-40">
                <span style={{ fontSize: 36 }}></span>
                <p className="text-sm mt-2">No mandi found</p>
              </div>
            )
          ) : !province ? (
            Object.keys(LOCATIONS).map((p) => {
              const allProvMandis = Object.values(LOCATIONS[p]).flat();
              const provSelCount = allProvMandis.filter((m) =>
                local.includes(m),
              ).length;
              const provAllSel = provSelCount === allProvMandis.length;
              const toggleProv = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (provAllSel)
                  setLocal((l) => l.filter((x) => !allProvMandis.includes(x)));
                else
                  setLocal((l) => [
                    ...l.filter((x) => !allProvMandis.includes(x)),
                    ...allProvMandis,
                  ]);
              };
              return (
                <div
                  key={p}
                  className="flex-shrink-0 rounded-2xl overflow-hidden"
                  style={{
                    border: `1.5px solid ${
                      provSelCount > 0 ? "#087F63" : "#D5E2DD"
                    }`,
                  }}
                >
                  <button
                    onClick={() => {
                      setProvince(p);
                      setDistrict(null);
                    }}
                    className="tap-target w-full px-4 flex items-center justify-between"
                    style={{
                      background: provSelCount > 0 ? "#F1F7F4" : "#F1F7F4",
                      height: 64,
                    }}
                  >
                    <div className="text-left">
                      <p className="font-bold text-base">{p}</p>
                      <p className="text-xs" style={{ color: "#52635F" }}>
                        {Object.keys(LOCATIONS[p]).length} districts ·{" "}
                        {allProvMandis.length} mandis
                        {provSelCount > 0 ? ` · ${provSelCount} selected` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleProv}
                        className="tap-target flex items-center gap-1 rounded-xl px-2 py-1.5"
                        style={{
                          background: provAllSel ? "#087F63" : "#fff",
                          border: `1.5px solid #087F63`,
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center"
                          style={{
                            background: provAllSel ? "#fff" : "transparent",
                            border: provAllSel ? "none" : "1.5px solid #087F63",
                          }}
                        >
                          {provAllSel && (
                            <span
                              style={{
                                fontSize: 9,
                                color: "#087F63",
                                fontWeight: 700,
                                lineHeight: 1,
                              }}
                            ></span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: provAllSel ? "#fff" : "#087F63",
                          }}
                        >
                          All
                        </span>
                      </button>
                      <span style={{ color: "#52635F" }}>›</span>
                    </div>
                  </button>
                </div>
              );
            })
          ) : !district ? (
            Object.keys(LOCATIONS[province]).map((d) => {
              const distMandis = LOCATIONS[province][d];
              const distSelCount = distMandis.filter((m) =>
                local.includes(m),
              ).length;
              const distAllSel = distSelCount === distMandis.length;
              const toggleDist = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (distAllSel)
                  setLocal((l) => l.filter((x) => !distMandis.includes(x)));
                else
                  setLocal((l) => [
                    ...l.filter((x) => !distMandis.includes(x)),
                    ...distMandis,
                  ]);
              };
              return (
                <div
                  key={d}
                  className="flex-shrink-0 rounded-2xl overflow-hidden"
                  style={{
                    border: `1.5px solid ${
                      distSelCount > 0 ? "#087F63" : "#D5E2DD"
                    }`,
                  }}
                >
                  <button
                    onClick={() => setDistrict(d)}
                    className="tap-target w-full px-4 flex items-center justify-between"
                    style={{
                      background: distSelCount > 0 ? "#F1F7F4" : "#F1F7F4",
                      height: 60,
                    }}
                  >
                    <div className="text-left">
                      <p className="font-semibold text-sm">{d}</p>
                      <p className="text-xs" style={{ color: "#52635F" }}>
                        {distMandis.length} mandis
                        {distSelCount > 0 ? ` · ${distSelCount} selected` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleDist}
                        className="tap-target flex items-center gap-1 rounded-xl px-2 py-1.5"
                        style={{
                          background: distAllSel ? "#087F63" : "#fff",
                          border: `1.5px solid #087F63`,
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center"
                          style={{
                            background: distAllSel ? "#fff" : "transparent",
                            border: distAllSel ? "none" : "1.5px solid #087F63",
                          }}
                        >
                          {distAllSel && (
                            <span
                              style={{
                                fontSize: 9,
                                color: "#087F63",
                                fontWeight: 700,
                                lineHeight: 1,
                              }}
                            ></span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: distAllSel ? "#fff" : "#087F63",
                          }}
                        >
                          All
                        </span>
                      </button>
                      <span style={{ color: "#52635F" }}>›</span>
                    </div>
                  </button>
                </div>
              );
            })
          ) : (
            LOCATIONS[province][district].map((name) => (
              <button
                key={name}
                onClick={() => toggle(name)}
                className="tap-target flex-shrink-0 rounded-2xl px-4 flex items-center gap-3"
                style={{
                  background: local.includes(name) ? "#F1F7F4" : "#F1F7F4",
                  border: `1.5px solid ${
                    local.includes(name) ? "#087F63" : "#D5E2DD"
                  }`,
                  height: 60,
                }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{
                    background: local.includes(name) ? "#087F63" : "#E8EFEC",
                  }}
                >
                  {local.includes(name) && (
                    <span
                      className="text-white font-bold"
                      style={{ fontSize: 10 }}
                    ></span>
                  )}
                </div>
                <span className="font-semibold text-sm flex-1 text-left">
                  {name}
                </span>
              </button>
            ))
          )}
        </div>
        {local.length > 0 && (
          <div className="px-4 py-2 overflow-x-auto flex gap-2 flex-shrink-0 border-t border-[#DCE8E3]">
            {local.map((n) => (
              <span
                key={n}
                className="flex-shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#087F63", color: "#fff" }}
              >
                {n}{" "}
                <button
                  onClick={() => toggle(n)}
                  className="opacity-70 tap-target"
                ></button>
              </span>
            ))}
          </div>
        )}
        <div
          className="px-4 pb-6 pt-3 flex-shrink-0"
          style={{ background: "#F4FAF7", borderTop: "1px solid #D5E2DD" }}
        >
          <button
            onClick={() => {
              onApply(local);
              onClose();
            }}
            className="tap-target w-full rounded-2xl py-4 font-bold text-white text-base"
            style={{ background: "#087F63" }}
          >
            {local.length > 0
              ? `Show Rates · ${local.length} Mandi${
                  local.length > 1 ? "s" : ""
                }`
              : "Show All Mandis"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LocationSheet({
  onSelect,
  onClose,
  districtOnly = false,
}: {
  onSelect: (p: string, d?: string, s?: string) => void;
  onClose: () => void;
  districtOnly?: boolean;
}) {
  const [province, setProvince] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  return (
    <div className="zm-sheet-overlay" style={{ zIndex: 200 }} onClick={onClose}>
      <div
        className="zm-sheet"
        style={{ background: "#F4FAF7", maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-[#DCE8E3]">
          {(province || district) && (
            <button
              className="tap-target text-xl w-8"
              onClick={() => {
                if (district) setDistrict(null);
                else setProvince(null);
              }}
            >
              ←
            </button>
          )}
          <p className="font-bold text-base">
            {!province
              ? "Province"
              : !district
                ? province
                : `${province} › ${district}`}
          </p>
        </div>
        <div
          className="overflow-y-auto p-4 flex flex-col gap-2"
          style={{ maxHeight: "calc(80vh - 64px)" }}
        >
          {!province &&
            Object.keys(LOCATIONS).map((p) => (
              <button
                key={p}
                onClick={() => setProvince(p)}
                className="tap-target rounded-2xl px-4 flex items-center justify-between"
                style={{
                  background: "#F1F7F4",
                  border: "1px solid #D5E2DD",
                  minHeight: 52,
                }}
              >
                <span className="font-bold text-base">{p}</span>
                <span style={{ color: "#52635F" }}>›</span>
              </button>
            ))}
          {province &&
            !district &&
            Object.keys(LOCATIONS[province]).map((d) => (
              <button
                key={d}
                onClick={() =>
                  districtOnly
                    ? (onSelect(province, d), onClose())
                    : setDistrict(d)
                }
                className="tap-target rounded-2xl px-4 flex items-center justify-between"
                style={{
                  background: "#F1F7F4",
                  border: "1px solid #D5E2DD",
                  minHeight: 48,
                }}
              >
                <span className="font-semibold text-sm">{d}</span>
                <span style={{ color: "#52635F" }}>›</span>
              </button>
            ))}
          {province &&
            district &&
            LOCATIONS[province][district].map((s) => (
              <button
                key={s}
                onClick={() => {
                  onSelect(province, district, s);
                  onClose();
                }}
                className="tap-target rounded-2xl px-4 flex flex-col justify-center"
                style={{
                  background: "#F1F7F4",
                  border: "1px solid #D5E2DD",
                  minHeight: 48,
                }}
              >
                <p className="font-semibold text-sm">{s}</p>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

//  LOCATION SCOPE SHEET — contextual chip (District/Province/Pakistan/Mandi)

function LocationScopeSheet({
  scope,
  onSelect,
  onClose,
}: {
  scope: LocationScope;
  onSelect: (s: LocationScope) => void;
  onClose: () => void;
}) {
  const [mandiPicker, setMandiPicker] = useState(false);
  const rows: {
    kind: LocationScope["kind"];
    label: string;
    sub: string;
    icon: string;
  }[] = [
    { kind: "pakistan", label: "Pakistan", sub: "My Country", icon: "" },
    { kind: "province", label: "Punjab", sub: "My Province", icon: "" },
    { kind: "district", label: "Pakpattan", sub: "My District", icon: "" },
  ];

  if (mandiPicker) {
    return (
      <LocationSheet
        onSelect={(p, d, s) => onSelect({ kind: "mandi", label: s || d || p })}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="zm-sheet-overlay" style={{ zIndex: 200 }} onClick={onClose}>
      <div
        className="zm-sheet"
        style={{ background: "#F4FAF7", maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 border-b border-[#DCE8E3]">
          <p className="font-bold text-base">Show rates for</p>
          <p className="text-xs" style={{ color: "#52635F" }}>
            Your default area is applied automatically
          </p>
        </div>
        <div className="p-4 flex flex-col gap-2">
          {rows.map((r) => {
            const on = scope.kind === r.kind;
            return (
              <button
                key={r.kind}
                onClick={() => {
                  onSelect({ kind: r.kind, label: r.label });
                }}
                className="tap-target rounded-2xl px-4 flex items-center gap-3"
                style={{
                  background: on ? "#E4F2EC" : "#F1F7F4",
                  border: on ? "2px solid #087F63" : "1px solid #D5E2DD",
                  minHeight: 56,
                }}
              >
                <span style={{ fontSize: 22 }}>{r.icon}</span>
                <div className="flex-1 text-left">
                  <p
                    className="font-bold text-sm"
                    style={{ color: on ? "#075E4F" : "#183B34" }}
                  >
                    {r.label}
                  </p>
                  <p className="text-xs" style={{ color: "#52635F" }}>
                    {r.sub}
                  </p>
                </div>
                {on && (
                  <span style={{ color: "#087F63", fontWeight: 800 }}></span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => setMandiPicker(true)}
            className="tap-target rounded-2xl px-4 flex items-center gap-3"
            style={{
              background: "#F1F7F4",
              border: "1px solid #D5E2DD",
              minHeight: 56,
            }}
          >
            <span style={{ fontSize: 22 }}></span>
            <div className="flex-1 text-left">
              <p className="font-bold text-sm">Select Mandi</p>
              <p className="text-xs" style={{ color: "#52635F" }}>
                Pick a specific market
              </p>
            </div>
            <span style={{ color: "#52635F" }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

//  FEED MODAL — 4-dimension filter

type FeedFilter = {
  products: string[];
  byproducts: string[];
  stations: string[];
  rateTypes: string[];
};

function FeedModal({
  initialFilter,
  onClose,
}: {
  initialFilter?: Partial<FeedFilter>;
  onClose: () => void;
}) {
  const [filter, setFilter] = useState<FeedFilter>({
    products: initialFilter?.products || [],
    byproducts: initialFilter?.byproducts || [],
    stations: initialFilter?.stations || [],
    rateTypes: initialFilter?.rateTypes || [],
  });
  const [sheet, setSheet] = useState<
    "product" | "byproduct" | "location" | "price" | null
  >(null);
  const [comVertical, setComVertical] = useState<string | null>(null);

  const displayed = FEED_MESSAGES.filter(
    (m) =>
      (filter.products.length === 0 || filter.products.includes(m.product)) &&
      (filter.byproducts.length === 0 ||
        filter.byproducts.includes(m.byproduct)) &&
      (filter.stations.length === 0 ||
        filter.stations.includes(m.station) ||
        filter.stations.some((s) => m.province === s)) &&
      (filter.rateTypes.length === 0 || filter.rateTypes.includes(m.rateType)),
  );

  const totalActive =
    filter.products.length +
    filter.byproducts.length +
    filter.stations.length +
    filter.rateTypes.length;

  const uniqueBPs = [
    ...new Set(
      Object.entries(VERTICALS).flatMap(([, vd]) =>
        Object.entries(vd.products)
          .filter(
            ([c]) =>
              filter.products.length === 0 || filter.products.includes(c),
          )
          .flatMap(([, bps]) => bps),
      ),
    ),
  ];

  const chipLabel = (items: string[], placeholder: string) =>
    items.length === 0
      ? placeholder
      : items.length === 1
        ? items[0]
        : `${items.length} ${placeholder}s`;

  return (
    <div
      className="fixed inset-0 z-[150] flex flex-col"
      style={{ background: "#e5ddd5" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-10 pb-3 flex-shrink-0"
        style={{ background: "#075E4F" }}
      >
        <button
          onClick={onClose}
          className="tap-target text-white text-2xl w-10 h-10 flex items-center justify-center"
        >
          ←
        </button>
        <div className="flex-1">
          <p className="text-white font-bold text-base">ZM Rates Feed</p>
          <p className="text-green-200 text-xs">
            {displayed.length} of {FEED_MESSAGES.length} messages
            {totalActive > 0
              ? ` · ${totalActive} filter${totalActive > 1 ? "s" : ""} active`
              : ""}
          </p>
        </div>
        {totalActive > 0 && (
          <button
            onClick={() =>
              setFilter({
                products: [],
                byproducts: [],
                stations: [],
                rateTypes: [],
              })
            }
            className="tap-target px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(239,68,68,0.8)", color: "#fff" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* 4 Filter picker buttons — horizontally scrollable with clickable arrow */}
      <ScrollRow bg="#0B7F70" style={{ background: "#0B7F70" }}>
        <button
          onClick={() => setSheet("product")}
          className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-bold"
          style={{
            fontSize: 13,
            padding: "10px 14px",
            background: filter.products.length > 0 ? "#087F63" : "#E8EFEC",
            color: filter.products.length > 0 ? "#fff" : "#183B34",
          }}
        >
          {chipLabel(filter.products, "product")}
          {filter.products.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFilter((f) => ({ ...f, products: [], byproducts: [] }));
              }}
              className="tap-target opacity-70 ml-1"
            ></button>
          )}
        </button>
        <button
          onClick={() => {
            if (filter.products.length > 0) setSheet("byproduct");
          }}
          className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-bold"
          style={{
            fontSize: 13,
            padding: "10px 14px",
            background:
              filter.byproducts.length > 0
                ? "#147D72"
                : filter.products.length === 0
                  ? "rgba(255,255,255,0.18)"
                  : "#E8EFEC",
            color:
              filter.byproducts.length > 0
                ? "#fff"
                : filter.products.length === 0
                  ? "rgba(255,255,255,0.45)"
                  : "#183B34",
            opacity: filter.products.length === 0 ? 0.6 : 1,
          }}
        >
          {chipLabel(filter.byproducts, "Byproduct")}
          {filter.byproducts.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFilter((f) => ({ ...f, byproducts: [] }));
              }}
              className="tap-target opacity-70 ml-1"
            ></button>
          )}
        </button>
        <button
          onClick={() => setSheet("location")}
          className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-bold"
          style={{
            fontSize: 13,
            padding: "10px 14px",
            background: filter.stations.length > 0 ? "#168A76" : "#E8EFEC",
            color: filter.stations.length > 0 ? "#fff" : "#183B34",
          }}
        >
          {chipLabel(filter.stations, "Location")}
          {filter.stations.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFilter((f) => ({ ...f, stations: [] }));
              }}
              className="tap-target opacity-70 ml-1"
            ></button>
          )}
        </button>
        <button
          onClick={() => setSheet("price")}
          className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-bold"
          style={{
            fontSize: 13,
            padding: "10px 14px",
            background: filter.rateTypes.length > 0 ? "#A96F18" : "#E8EFEC",
            color: filter.rateTypes.length > 0 ? "#fff" : "#183B34",
          }}
        >
          {chipLabel(filter.rateTypes, "Price Type")}
          {filter.rateTypes.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFilter((f) => ({ ...f, rateTypes: [] }));
              }}
              className="tap-target opacity-70 ml-1"
            ></button>
          )}
        </button>
      </ScrollRow>

      {/* Active filter pills row — horizontally scrollable, each removable */}
      {totalActive > 0 && (
        <ScrollRow bg="transparent" style={{ background: "rgba(0,0,0,0.18)" }}>
          {filter.products.map((c) => (
            <span
              key={c}
              className="flex-shrink-0 flex items-center gap-1 font-bold rounded-full"
              style={{
                fontSize: 12,
                padding: "7px 11px",
                background: "#087F63",
                color: "#fff",
              }}
            >
              {c}{" "}
              <button
                onClick={() =>
                  setFilter((f) => ({
                    ...f,
                    products: f.products.filter((x) => x !== c),
                  }))
                }
                className="tap-target opacity-70"
              ></button>
            </span>
          ))}
          {filter.byproducts.map((b) => (
            <span
              key={b}
              className="flex-shrink-0 flex items-center gap-1 font-bold rounded-full"
              style={{
                fontSize: 12,
                padding: "7px 11px",
                background: "#147D72",
                color: "#fff",
              }}
            >
              {b}{" "}
              <button
                onClick={() =>
                  setFilter((f) => ({
                    ...f,
                    byproducts: f.byproducts.filter((x) => x !== b),
                  }))
                }
                className="tap-target opacity-70"
              ></button>
            </span>
          ))}
          {filter.stations.map((s) => (
            <span
              key={s}
              className="flex-shrink-0 flex items-center gap-1 font-bold rounded-full"
              style={{
                fontSize: 12,
                padding: "7px 11px",
                background: "#168A76",
                color: "#fff",
              }}
            >
              {s}{" "}
              <button
                onClick={() =>
                  setFilter((f) => ({
                    ...f,
                    stations: f.stations.filter((x) => x !== s),
                  }))
                }
                className="tap-target opacity-70"
              ></button>
            </span>
          ))}
          {filter.rateTypes.map((rt) => (
            <span
              key={rt}
              className="flex-shrink-0 flex items-center gap-1 font-bold rounded-full"
              style={{
                fontSize: 12,
                padding: "7px 11px",
                background: "#A96F18",
                color: "#fff",
              }}
            >
              {rt}{" "}
              <button
                onClick={() =>
                  setFilter((f) => ({
                    ...f,
                    rateTypes: f.rateTypes.filter((x) => x !== rt),
                  }))
                }
                className="tap-target opacity-70"
              ></button>
            </span>
          ))}
        </ScrollRow>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <span style={{ fontSize: 48 }}></span>
            <p className="font-semibold mt-2 text-center">
              No messages match these filters
            </p>
            <button
              onClick={() =>
                setFilter({
                  products: [],
                  byproducts: [],
                  stations: [],
                  rateTypes: [],
                })
              }
              className="tap-target mt-4 px-4 py-2 rounded-2xl text-sm font-bold"
              style={{ background: "#087F63", color: "#fff" }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          displayed.map((msg) => (
            <div key={msg.id} className="flex justify-start">
              <ZMMessageCard msg={msg} />
            </div>
          ))
        )}
      </div>

      {/* product sheet — multi-select with vertical drill + Select All per vertical */}
      {sheet === "product" && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 210 }}
          onClick={() => setSheet(null)}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 border-b border-[#DCE8E3] flex-shrink-0 flex items-center gap-3">
              <div
                className="w-10 h-1 rounded-full mx-auto mb-3 absolute top-3 left-1/2 -translate-x-1/2"
                style={{ background: "#C7D6D0" }}
              />
              {comVertical && (
                <button
                  className="tap-target text-xl w-8 flex-shrink-0"
                  onClick={() => setComVertical(null)}
                >
                  ←
                </button>
              )}
              <p className="font-bold text-lg flex-1">
                {comVertical || "product"}
              </p>
              {filter.products.length > 0 && (
                <button
                  onClick={() =>
                    setFilter((f) => ({
                      ...f,
                      products: [],
                      byproducts: [],
                    }))
                  }
                  className="tap-target text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#F9E1DE", color: "#A83B37" }}
                >
                  Clear {filter.products.length}
                </button>
              )}
            </div>
            <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
              {!comVertical ? (
                Object.entries(VERTICALS).map(([v, vd]) => {
                  const comms = Object.keys(vd.products);
                  const selCount = comms.filter((c) =>
                    filter.products.includes(c),
                  ).length;
                  const allSel = selCount === comms.length && comms.length > 0;
                  return (
                    <div
                      key={v}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        border: `1.5px solid ${
                          selCount > 0 ? "#087F63" : "#D5E2DD"
                        }`,
                      }}
                    >
                      <button
                        onClick={() => setComVertical(v)}
                        className="tap-target w-full px-4 flex items-center gap-3"
                        style={{
                          background: selCount > 0 ? "#F1F7F4" : "#F1F7F4",
                          minHeight: 58,
                        }}
                      >
                        <SpriteIcon
                          spriteKey={VERTICALS[v]?.icon || "grains"}
                          size={30}
                          style={{ flexShrink: 0 }}
                        />
                        <div className="flex-1 text-left">
                          <p className="font-bold text-sm">{v}</p>
                          <p className="text-xs" style={{ color: "#52635F" }}>
                            {comms.length} products
                            {selCount > 0 ? ` · ${selCount} selected` : ""}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (allSel)
                              setFilter((f) => ({
                                ...f,
                                products: f.products.filter(
                                  (c) => !comms.includes(c),
                                ),
                              }));
                            else
                              setFilter((f) => ({
                                ...f,
                                products: [
                                  ...f.products.filter(
                                    (c) => !comms.includes(c),
                                  ),
                                  ...comms,
                                ],
                              }));
                          }}
                          className="tap-target flex items-center gap-1.5 rounded-xl px-2.5 py-1.5"
                          style={{
                            background: allSel ? "#087F63" : "#fff",
                            border: "1.5px solid #087F63",
                            marginRight: 6,
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center"
                            style={{
                              background: allSel ? "#fff" : "transparent",
                              border: allSel ? "none" : "1.5px solid #087F63",
                            }}
                          >
                            {allSel && (
                              <span
                                style={{
                                  fontSize: 9,
                                  color: "#087F63",
                                  fontWeight: 700,
                                  lineHeight: 1,
                                }}
                              ></span>
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: allSel ? "#fff" : "#087F63",
                            }}
                          >
                            All
                          </span>
                        </button>
                        <span style={{ color: "#52635F" }}>›</span>
                      </button>
                    </div>
                  );
                })
              ) : (
                <>
                  {(() => {
                    const comms = Object.keys(VERTICALS[comVertical].products);
                    const selCount = comms.filter((c) =>
                      filter.products.includes(c),
                    ).length;
                    const allSel =
                      selCount === comms.length && comms.length > 0;
                    return (
                      <button
                        onClick={() => {
                          if (allSel)
                            setFilter((f) => ({
                              ...f,
                              products: f.products.filter(
                                (c) => !comms.includes(c),
                              ),
                            }));
                          else
                            setFilter((f) => ({
                              ...f,
                              products: [
                                ...f.products.filter((c) => !comms.includes(c)),
                                ...comms,
                              ],
                            }));
                        }}
                        className="tap-target w-full rounded-2xl px-4 py-3 flex items-center justify-center gap-2 mb-1"
                        style={{
                          background: allSel ? "#087F63" : "#F1F7F4",
                          border: "1.5px solid #087F63",
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center"
                          style={{
                            background: allSel ? "#fff" : "transparent",
                            border: allSel ? "none" : "1.5px solid #087F63",
                          }}
                        >
                          {allSel && (
                            <span
                              style={{
                                fontSize: 9,
                                color: "#087F63",
                                fontWeight: 700,
                                lineHeight: 1,
                              }}
                            ></span>
                          )}
                        </div>
                        <span
                          className="font-bold text-sm"
                          style={{ color: allSel ? "#fff" : "#087F63" }}
                        >
                          {allSel
                            ? `Deselect All ${comms.length}`
                            : `Select All ${comms.length} in ${comVertical}`}
                        </span>
                      </button>
                    );
                  })()}
                  {Object.keys(VERTICALS[comVertical].products).map((c) => {
                    const sel = filter.products.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() =>
                          setFilter((f) => ({
                            ...f,
                            products: sel
                              ? f.products.filter((x) => x !== c)
                              : [...f.products, c],
                          }))
                        }
                        className="tap-target rounded-2xl px-4 flex items-center gap-3"
                        style={{
                          background: sel ? "#F1F7F4" : "#F1F7F4",
                          border: `1.5px solid ${sel ? "#087F63" : "#D5E2DD"}`,
                          minHeight: 48,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                          style={{ background: sel ? "#087F63" : "#E8EFEC" }}
                        >
                          {sel && (
                            <span
                              className="text-white font-bold"
                              style={{ fontSize: 10 }}
                            ></span>
                          )}
                        </div>
                        <span className="font-semibold text-sm flex-1 text-left">
                          {c}
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
            <div className="px-4 pb-6 pt-3 flex-shrink-0 border-t border-[#DCE8E3]">
              <button
                onClick={() => setSheet(null)}
                className="tap-target w-full rounded-2xl py-4 font-bold text-white text-base"
                style={{ background: "#087F63" }}
              >
                {filter.products.length > 0
                  ? `Done · ${filter.products.length} selected`
                  : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Byproduct sheet — multi-select with Select All */}
      {sheet === "byproduct" && filter.products.length > 0 && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 210 }}
          onClick={() => setSheet(null)}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "82vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 border-b border-[#DCE8E3] flex-shrink-0 flex items-center gap-3">
              <p className="font-bold text-lg flex-1">Byproduct</p>
              {filter.byproducts.length > 0 && (
                <button
                  onClick={() => setFilter((f) => ({ ...f, byproducts: [] }))}
                  className="tap-target text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: "#F9E1DE", color: "#A83B37" }}
                >
                  Clear {filter.byproducts.length}
                </button>
              )}
            </div>
            <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
              {uniqueBPs.length > 0 &&
                (() => {
                  const allSel =
                    uniqueBPs.length > 0 &&
                    uniqueBPs.every((b) => filter.byproducts.includes(b));
                  return (
                    <button
                      onClick={() => {
                        if (allSel)
                          setFilter((f) => ({ ...f, byproducts: [] }));
                        else
                          setFilter((f) => ({
                            ...f,
                            byproducts: [...uniqueBPs],
                          }));
                      }}
                      className="tap-target w-full rounded-2xl px-4 py-3 flex items-center justify-center gap-2 mb-1"
                      style={{
                        background: allSel ? "#147D72" : "#EAF5F1",
                        border: "1.5px solid #249985",
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center"
                        style={{
                          background: allSel ? "#fff" : "transparent",
                          border: allSel ? "none" : "1.5px solid #249985",
                        }}
                      >
                        {allSel && (
                          <span
                            style={{
                              fontSize: 9,
                              color: "#249985",
                              fontWeight: 700,
                              lineHeight: 1,
                            }}
                          ></span>
                        )}
                      </div>
                      <span
                        className="font-bold text-sm"
                        style={{ color: allSel ? "#fff" : "#147D72" }}
                      >
                        {allSel
                          ? "Deselect All"
                          : `Select All ${uniqueBPs.length} Byproducts`}
                      </span>
                    </button>
                  );
                })()}
              {uniqueBPs.map((b) => {
                const sel = filter.byproducts.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() =>
                      setFilter((f) => ({
                        ...f,
                        byproducts: sel
                          ? f.byproducts.filter((x) => x !== b)
                          : [...f.byproducts, b],
                      }))
                    }
                    className="tap-target rounded-2xl px-4 flex items-center gap-3"
                    style={{
                      background: sel ? "#EAF5F1" : "#F1F7F4",
                      border: `1.5px solid ${sel ? "#147D72" : "#D5E2DD"}`,
                      minHeight: 48,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: sel ? "#147D72" : "#E8EFEC" }}
                    >
                      {sel && (
                        <span
                          className="text-white font-bold"
                          style={{ fontSize: 10 }}
                        ></span>
                      )}
                    </div>
                    <span className="font-semibold text-sm flex-1 text-left">
                      {b}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="px-4 pb-6 pt-3 flex-shrink-0 border-t border-[#DCE8E3]">
              <button
                onClick={() => setSheet(null)}
                className="tap-target w-full rounded-2xl py-4 font-bold text-white text-base"
                style={{ background: "#147D72" }}
              >
                {filter.byproducts.length > 0
                  ? `Done · ${filter.byproducts.length} selected`
                  : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location sheet — MandiPickerSheet: province → district → multi-mandi with Select All */}
      {sheet === "location" && (
        <MandiPickerSheet
          selected={filter.stations}
          onApply={(s) => {
            setFilter((f) => ({ ...f, stations: s }));
          }}
          onClose={() => setSheet(null)}
        />
      )}

      {/* Price type sheet */}
      {sheet === "price" && (
        <PriceTypeSheet
          selected={filter.rateTypes}
          onApply={(ts) => {
            setFilter((f) => ({ ...f, rateTypes: ts }));
            setSheet(null);
          }}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  );
}

//  CIRCLE TILE

function CircleTile({
  src,
  product,
  vertical,
  alt,
  label,
  selected,
  onPress,
  size = 72,
  starred,
  onStar,
}: {
  src?: string;
  product?: string;
  vertical?: string;
  alt: string;
  label: string;
  selected?: boolean;
  onPress: () => void;
  size?: number;
  starred?: boolean;
  onStar?: () => void;
}) {
  const iconSize = Math.round(size * 0.65);
  const spriteKey = product ? getSpriteKey(product, vertical) : null;
  return (
    <button
      onClick={onPress}
      className="tap-target flex flex-col items-center gap-1.5"
      style={{ minWidth: size + 16 }}
    >
      <div
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          background: selected ? "#E4F2EC" : "#F1F7F4",
          border: selected ? `3px solid #087F63` : "2px solid #D5E2DD",
          flexShrink: 0,
        }}
      >
        {spriteKey ? (
          <SpriteIcon spriteKey={spriteKey} size={iconSize} />
        ) : src ? (
          <img
            src={src}
            alt={alt}
            style={{ width: iconSize, height: iconSize, objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              width: iconSize,
              height: iconSize,
              background: "#D5E2DD",
              borderRadius: 4,
            }}
          />
        )}
        {selected && (
          <div className="absolute inset-0 flex items-end justify-end pb-1 pr-1">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#087F63" }}
            >
              <span
                className="text-white font-bold"
                style={{ fontSize: 10 }}
              ></span>
            </div>
          </div>
        )}
        {onStar && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
            className="absolute top-0 left-0 w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              fontSize: 13,
              background: starred ? "#087F63" : "rgba(255,255,255,0.92)",
              border: "1.5px solid " + (starred ? "#087F63" : "#D5E2DD"),
              color: starred ? "#fff" : "#B9822E",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            {starred ? "" : ""}
          </span>
        )}
      </div>
      <span
        className="text-center leading-tight"
        style={{
          fontSize: 11,
          fontFamily: "'Inter', sans-serif",
          fontWeight: selected ? 700 : 500,
          color: selected ? "#087F63" : "#183B34",
          maxWidth: size + 16,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {label}
      </span>
    </button>
  );
}

//  SEARCH SCREEN

function SearchScreen({
  push,
  onBack,
}: {
  push: (s: Screen) => void;
  onBack: () => void;
}) {
  const { lang, t, tc } = useLang();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Build flat search index: all products + byproducts
  const allItems = Object.entries(VERTICALS).flatMap(([vertical, vd]) =>
    Object.entries(vd.products).flatMap(([product, byproducts]) => [
      {
        vertical,
        product,
        byproduct: product,
        label: product,
        isComm: true,
      },
      ...byproducts
        .filter((bp) => bp !== product)
        .map((bp) => ({
          vertical,
          product,
          byproduct: bp,
          label: bp,
          isComm: false,
        })),
    ]),
  );

  const results =
    q.length >= 1
      ? allItems
          .filter((it) => it.label.toLowerCase().includes(q.toLowerCase()))
          .slice(0, 30)
      : [];

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: "#F1F7F4" }}
    >
      <div
        className="px-4 pt-12 pb-3 flex-shrink-0"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="tap-target w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "#E8EFEC" }}
          >
            {lang === "ur" ? "→" : "←"}
          </button>
          <div
            className="flex-1 flex items-center gap-2 rounded-2xl px-4"
            style={{
              height: lang === "ur" ? 60 : 52,
              background: "#F1F7F4",
              border: "1.5px solid #D5E2DD",
            }}
          >
            {" "}
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("home.search")}
              className="flex-1 bg-transparent outline-none font-bold"
              style={{
                color: "#183B34",
                fontSize: lang === "ur" ? 19 : 14,
                fontFamily:
                  lang === "ur"
                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                    : "'Inter', sans-serif",
                direction: lang === "ur" ? "rtl" : "ltr",
              }}
            />
            {q ? (
              <button
                onClick={() => setQ("")}
                className="tap-target font-bold flex-shrink-0"
                style={{ color: "#52635F", fontSize: 16 }}
              >
                ✕
              </button>
            ) : (
              <span
                className="flex-shrink-0"
                style={{ fontSize: 16, opacity: 0.5 }}
              ></span>
            )}
          </div>
        </div>
      </div>

      {results.length === 0 && q.length < 1 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <p
            className="text-center font-bold"
            style={{
              color: "#52635F",
              fontSize: lang === "ur" ? 20 : 14,
              lineHeight: 1.5,
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            {lang === "ur"
              ? "کوئی بھی جنس یا ضمنی مصنوع تلاش کریں — گندم، باسمتی، چوکر…"
              : "Search for any product or byproduct — wheat, basmati, bran, tomato…"}
          </p>
        </div>
      )}

      {q.length >= 1 && results.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-60">
          <span style={{ fontSize: 48 }}>🔎</span>
          <p
            className="font-bold"
            style={{
              fontSize: lang === "ur" ? 20 : 14,
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            {lang === "ur"
              ? `"${q}" کا کوئی نتیجہ نہیں ملا`
              : `No results for "${q}"`}
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-5 pb-6">
          <div className="flex flex-wrap gap-x-4 gap-y-5 justify-start">
            {results.map((it, i) => (
              <CircleTile
                key={i}
                product={it.byproduct}
                vertical={it.vertical}
                alt={it.label}
                label={tc(it.label)}
                size={72}
                onPress={() =>
                  push({
                    id: "product-rates",
                    vertical: it.vertical,
                    product: it.product,
                    byproduct: it.byproduct,
                  })
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

//  PRODUCT BYPRODUCT RESOLVER
// Given a product selection captured from PRODUCT_DIVISIONS ({vertical:div.name,
// product:product}), return its byproduct list. Falls back to VERTICALS.
function productByproducts(vertical: string, product: string): string[] {
  const div = PRODUCT_DIVISIONS.find((d) => d.name === vertical);
  if (div) {
    if (div.type === "product") return div.byproducts ?? [];
    const p = div.products?.[product];
    if (p) return p;
  }
  return VERTICALS[vertical]?.products[product] ?? [];
}

//  product (PRODUCT) SELECT

type ProductSel = { vertical: string; product: string };

function ProductSelectScreen({
  push,
  onBack,
}: {
  push: (s: Screen) => void;
  onBack: () => void;
}) {
  // null = divisions grid; a vertical-type ProdDiv = its products grid
  const [openDiv, setOpenDiv] = useState<ProdDiv | null>(null);
  const [selected, setSelected] = useState<ProductSel[]>([]);
  const { lang, voiceEnabled, t: tl, tc } = useLang();

  const goBack = () => {
    if (openDiv) {
      setOpenDiv(null);
      return;
    }
    onBack();
  };

  const keyOf = (s: ProductSel) => `${s.vertical}|${s.product}`;
  const isProductSelected = (vertical: string, product: string) =>
    selected.some((s) => keyOf(s) === `${vertical}|${product}`);
  const toggleProduct = (vertical: string, product: string) => {
    const k = `${vertical}|${product}`;
    setSelected((prev) =>
      prev.some((s) => keyOf(s) === k)
        ? prev.filter((s) => keyOf(s) !== k)
        : [...prev, { vertical, product }],
    );
  };

  const handleProductTap = (
    onSelect: () => void,
    speakLabel: string,
    subscribed: boolean,
    productName?: string,
    verticalName?: string,
  ) => {
    if (!subscribed) {
      if (voiceEnabled) speakText(tl("voice.locked"));
      push({
        id: "billing",
        product: productName || speakLabel,
        vertical: verticalName,
      });
      return;
    }
    if (voiceEnabled) speakText(tc(speakLabel));
    onSelect();
  };

  const currentProducts: string[] =
    openDiv && openDiv.type === "vertical"
      ? Object.keys(openDiv.products ?? {})
      : [];

  const title = openDiv ? tc(openDiv.name) : tl("prodsel.title");
  const breadcrumb = openDiv
    ? lang === "ur"
      ? "دیکھنے کے لیے مصنوعات منتخب کریں"
      : "Select products to watch"
    : null;

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: "#F1F7F4" }}
    >
      {/* Header */}
      <header
        className="px-4 pt-10 pb-3 flex-shrink-0"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="tap-target w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#E8EFEC" }}
          >
            <span style={{ fontSize: 20 }}>{lang === "ur" ? "→" : "←"}</span>
          </button>
          <div className="flex-1 min-w-0">
            <h1
              className="font-extrabold text-xl truncate"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#183B34" }}
            >
              {title}
            </h1>
            <p
              className="text-xs truncate"
              style={{ color: "#52635F", fontFamily: "'Inter', sans-serif" }}
            >
              {breadcrumb ??
                (lang === "ur"
                  ? "مصنوعات کا انتخاب کریں"
                  : "Tap products you want to follow")}
            </p>
          </div>
          {selected.length > 0 && (
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white text-xs"
              style={{
                minWidth: 26,
                height: 26,
                background: "#087F63",
                padding: "0 7px",
              }}
            >
              {selected.length}
            </span>
          )}
        </div>
      </header>

      {/* Selected product chips */}
      {selected.length > 0 && (
        <ScrollRow
          bg="#E4F2EC"
          style={{
            background: "#E4F2EC",
            borderBottom: "1px solid #C7E8D8",
            flexShrink: 0,
          }}
        >
          <span
            className="flex-shrink-0 text-xs font-semibold"
            style={{ color: "#075E4F" }}
          >
            {lang === "ur" ? "مصنوعات:" : "Products:"}
          </span>
          {selected.map((s, i) => (
            <button
              key={i}
              onClick={() => setSelected((p) => p.filter((_, j) => j !== i))}
              className="tap-target flex-shrink-0 flex items-center gap-1 rounded-full text-xs font-bold px-3 py-1"
              style={{ background: "#087F63", color: "#fff" }}
            >
              {tc(s.product)}
            </button>
          ))}
        </ScrollRow>
      )}

      {/* Content grid */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-5 pb-4">
        {/* Divisions grid */}
        {!openDiv && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px 12px",
              alignItems: "end",
            }}
          >
            {[...PRODUCT_DIVISIONS]
              .sort((a, b) => {
                const as_ = SUBSCRIBED_PRODUCTS.has(a.name) ? 0 : 1;
                const bs_ = SUBSCRIBED_PRODUCTS.has(b.name) ? 0 : 1;
                return as_ - bs_;
              })
              .map((div) => {
                const subscribed = SUBSCRIBED_PRODUCTS.has(div.name);
                const sel =
                  div.type === "product"
                    ? isProductSelected(div.name, div.name)
                    : selected.some((s) => s.vertical === div.name);
                const btnSize = subscribed ? 96 : 72;
                const iconSize = subscribed ? 58 : 42;
                return (
                  <div key={div.name} className="flex flex-col items-center">
                    <button
                      onClick={() =>
                        handleProductTap(
                          () =>
                            div.type === "product"
                              ? toggleProduct(div.name, div.name)
                              : setOpenDiv(div),
                          div.name,
                          subscribed,
                          div.name,
                          div.type === "vertical" ? div.name : undefined,
                        )
                      }
                      className="tap-target relative flex items-center justify-center rounded-full overflow-hidden"
                      style={{
                        width: btnSize,
                        height: btnSize,
                        flexShrink: 0,
                        background: !subscribed
                          ? "#E2EFE9"
                          : sel
                            ? "#E4F2EC"
                            : "#F1F7F4",
                        border: sel
                          ? "3px solid #087F63"
                          : subscribed
                            ? "2.5px solid #087F63"
                            : "1.5px solid #BDD9CD",
                        boxShadow: subscribed
                          ? "0 4px 14px rgba(8,127,99,0.18)"
                          : "0 2px 8px rgba(18,65,48,0.06)",
                      }}
                    >
                      <ProductIcon
                        name={div.name}
                        size={iconSize}
                        style={{
                          filter: !subscribed
                            ? "blur(2.2px) grayscale(20%) opacity(0.55)"
                            : undefined,
                        }}
                      />
                      {!subscribed && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ zIndex: 2 }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(3px)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid rgba(255,255,255,0.9)",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                            }}
                          >
                            <LockIconSVG size={14} color="#183B34" />
                          </div>
                        </div>
                      )}
                      {sel && subscribed && (
                        <div
                          className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: "#087F63" }}
                        >
                          <span
                            style={{
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          >
                            ✓
                          </span>
                        </div>
                      )}
                    </button>
                    <span
                      className="mt-1.5 text-center leading-tight font-semibold"
                      style={{
                        fontSize: 12,
                        fontFamily:
                          lang === "ur"
                            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                            : "'Inter', sans-serif",
                        color: !subscribed
                          ? "#475F57"
                          : sel
                            ? "#087F63"
                            : "#183B34",
                        maxWidth: 80,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {tc(div.name)}
                    </span>
                    {!subscribed && (
                      <span className="mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E4F0EA] text-[#087F63] border border-[#C6DFD4]">
                        {lang === "ur" ? "سبسکرائب" : "Subscribe"}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* Products within a vertical-type division — multi-select in place */}
        {openDiv && (
          <div className="flex flex-wrap gap-x-3 gap-y-5 justify-start">
            {currentProducts.map((p) => {
              const label = p.replace(/_/g, " ");
              return (
                <CircleTile
                  key={p}
                  product={label}
                  vertical={openDiv.name}
                  alt={label}
                  label={tc(label)}
                  selected={isProductSelected(openDiv.name, p)}
                  onPress={() =>
                    handleProductTap(
                      () => toggleProduct(openDiv.name, p),
                      label,
                      true,
                    )
                  }
                  size={72}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div
        className="flex-shrink-0 px-4 pb-6 pt-3"
        style={{ borderTop: "1px solid #D5E2DD", background: "#F4FAF7" }}
      >
        {selected.length > 0 ? (
          <button
            onClick={() =>
              push({ id: "byproduct-combined", products: selected, active: 0 })
            }
            className="tap-target w-full rounded-2xl py-4 font-bold text-white text-base"
            style={{
              background: "#087F63",
              boxShadow: "0 4px 20px rgba(15,138,95,0.3)",
            }}
          >
            {lang === "ur"
              ? `مصنوعات دیکھیں (${selected.length}) ←`
              : `View ${selected.length} ${selected.length === 1 ? "Product" : "Products"} →`}
          </button>
        ) : (
          <div
            className="w-full rounded-2xl py-4 font-semibold text-center text-sm"
            style={{ background: "#D5E2DD", color: "#52635F" }}
          >
            {openDiv
              ? lang === "ur"
                ? "شامل کرنے کے لیے مصنوعات ٹیپ کریں"
                : "Tap products to add them"
              : lang === "ur"
                ? "ٹیپ کریں · + مزید شامل کریں"
                : "Tap a product · + add more"}
          </div>
        )}
      </div>
    </div>
  );
}

//  DATE PICKER SHEET

function DatePickerSheet({
  selected,
  onSelect,
  onClose,
}: {
  selected: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const fmt2 = (d: Date) =>
    d.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const quick = ["Today", "Yesterday"];

  return (
    <div className="zm-sheet-overlay" style={{ zIndex: 200 }} onClick={onClose}>
      <div
        className="zm-sheet"
        style={{ background: "#F4FAF7", maxHeight: "60vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 border-b border-[#DCE8E3]">
          <div
            className="w-10 h-1 rounded-full mx-auto mb-3"
            style={{ background: "#C7D6D0" }}
          />
          <p className="font-bold text-lg">Select Date</p>
          <p className="text-xs" style={{ color: "#52635F" }}>
            Choose the date for price data
          </p>
        </div>
        <div className="p-4 flex flex-col gap-2">
          {quick.map((label) => (
            <button
              key={label}
              onClick={() => onSelect(label)}
              className="tap-target rounded-2xl px-4 flex items-center gap-3"
              style={{
                background: selected === label ? "#E4F2EC" : "#F1F7F4",
                border:
                  selected === label
                    ? "2px solid #087F63"
                    : "1px solid #D5E2DD",
                minHeight: 52,
              }}
            >
              <span style={{ fontSize: 20 }}></span>
              <span
                className="flex-1 text-left font-bold text-sm"
                style={{ color: selected === label ? "#075E4F" : "#183B34" }}
              >
                {label}
              </span>
              {selected === label && (
                <span style={{ color: "#087F63", fontWeight: 800 }}></span>
              )}
            </button>
          ))}
          <button
            onClick={() => {
              const d = prompt("Enter date (DD/MM/YYYY)");
              if (d) onSelect(d);
            }}
            className="tap-target rounded-2xl px-4 flex items-center gap-3"
            style={{
              background: "#F1F7F4",
              border: "1px solid #D5E2DD",
              minHeight: 52,
            }}
          >
            <span style={{ fontSize: 20 }}></span>
            <div className="flex-1 text-left">
              <p className="font-bold text-sm">Select Date</p>
              <p className="text-xs" style={{ color: "#52635F" }}>
                Pick a specific date
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

//  BY-PRODUCT COMBINED (product chip-tabs → byproducts)

function ByProductCombinedScreen({
  products,
  active,
  push,
  replace,
  onBack,
  isPickedBP,
  togglePickBP,
  locationScope,
  onOpenLocation,
  profileCompleted = false,
  onOpenSubscribe,
}: {
  products: ProductSel[];
  active: number;
  push: (s: Screen) => void;
  replace: (s: Screen) => void;
  onBack: () => void;
  isPickedBP: (item: RateItem) => boolean;
  togglePickBP: (item: RateItem) => void;
  locationScope?: LocationScope;
  onOpenLocation?: () => void;
  profileCompleted?: boolean;
  onOpenSubscribe?: () => void;
}) {
  const [showAllProducts, setShowAllProducts] = useState(true);
  const idx = Math.min(active, products.length - 1);
  const activeProduct = showAllProducts ? null : (products[idx] ?? products[0]);
  const setActive = (i: number) => {
    setShowAllProducts(false);
    replace({ id: "byproduct-combined", products, active: i });
  };
  const byproducts = activeProduct
    ? productByproducts(activeProduct.vertical, activeProduct.product)
    : products
        .flatMap((p) => productByproducts(p.vertical, p.product))
        .filter((b, i, a) => a.indexOf(b) === i);

  // Date scroll system - restricted to 2 days (Today & Yesterday) for non-subscribers
  const [visibleDateLabel, setVisibleDateLabel] = useState<{
    d: number;
    month: string;
  }>({ d: 21, month: "AUG" });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const dateSectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const BASE_DATE = new Date(2026, 7, 21); // Aug 21 2026 = today
  const NUM_DAYS = profileCompleted ? 7 : 2;

  const dateForOffset = (offset: number) => {
    const d = new Date(BASE_DATE);
    d.setDate(d.getDate() - offset);
    return d;
  };
  const dateLabel = (d: Date) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return { d: d.getDate(), month: months[d.getMonth()] };
  };
  const dateLabelStr = (d: Date) =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const dateDisplayStr = (d: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleScrollArea = useCallback(() => {
    const container = scrollAreaRef.current;
    if (!container) return;
    const containerTop = container.getBoundingClientRect().top;
    let found = {
      d: dateForOffset(0).getDate(),
      month: [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ][dateForOffset(0).getMonth()],
    };
    dateSectionRefs.current.forEach((el, key) => {
      const rect = el.getBoundingClientRect();
      if (rect.top - containerTop <= 60) {
        const parts = key.split("-");
        const dObj = new Date(
          parseInt(parts[0]),
          parseInt(parts[1]),
          parseInt(parts[2]),
        );
        found = dateLabel(dObj);
      }
    });
    setVisibleDateLabel(found);
  }, []);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScrollArea, { passive: true });
    return () => el.removeEventListener("scroll", handleScrollArea);
  }, [handleScrollArea]);

  //  Filter state
  const [selectedBP, setSelectedBP] = useState<string | null>(null);
  const [selectedRateTypes, setSelectedRateTypes] = useState<string[]>([]);
  // Location: multi-select — array of selected location labels (empty = All Pakistan)
  const [selectedLocs, setSelectedLocs] = useState<
    {
      kind: LocationScope["kind"];
      label: string;
    }[]
  >([]);
  const [locSheet, setLocSheet] = useState(false);
  // Derive single locScope for inLocScope fn — if multi selected, show all matching
  const locScope: LocationScope =
    selectedLocs.length === 0
      ? { kind: "pakistan", label: "All Pakistan" }
      : selectedLocs[0];

  // Reset byproduct filter when active product changes
  const prevIdx = useRef(idx);
  useEffect(() => {
    if (prevIdx.current !== idx) {
      setSelectedBP(null);
      prevIdx.current = idx;
    }
  }, [idx]);

  const { voiceEnabled, lang, t: tL, tc: tcL, tm: tmL, tr: trL } = useLang();

  const handleCardTap = (r: RichRow, bp: string, navigateFn: () => void) => {
    if (voiceEnabled) {
      const bpName = tcL(bp);
      const commName = tcL(r.product);
      const mandiName = tmL(r.mandiName);
      const rateTypeName = trL(r.rateType);
      const text =
        lang === "ur"
          ? r.min > 0
            ? `${commName} ${bpName}۔ قیمت ${r.min.toLocaleString()} سے ${r.max.toLocaleString()} روپے۔ ${mandiName} میں آمد ${r.arrival}۔ ${rateTypeName}۔`
            : `${commName} ${bpName}۔ ${mandiName} میں آج کا ڈیٹا موجود نہیں۔`
          : r.min > 0
            ? `${r.product} ${bp}. Rs ${r.min.toLocaleString()} to ${r.max.toLocaleString()}. ${r.arrival} arrived in ${r.mandiName}. ${r.rateType}.`
            : `${r.product} ${bp}. No data in ${r.mandiName} today.`;
      speakText(text);
    }
    navigateFn();
  };

  const activeBPs = selectedBP ? [selectedBP] : byproducts;

  // Check if a mandi row is in the current location scope (multi-select aware)
  const inLocScope = (
    mandiName: string,
    mandiCity: string,
    province: string,
  ) => {
    if (selectedLocs.length === 0) return true;
    return selectedLocs.some((loc) => {
      switch (loc.kind) {
        case "pakistan":
          return true;
        case "province":
          return province === loc.label;
        case "district":
          return mandiCity === loc.label || mandiName.includes(loc.label);
        case "mandi":
          return mandiName === loc.label || mandiCity === loc.label;
      }
    });
  };

  // Build best representative rate row for a byproduct — returns null if no real data
  const buildRepRow = (bp: string): { row: RichRow; hasData: boolean } => {
    const noData: RichRow = {
      product: activeProduct?.product || "",
      byproduct: bp,
      emoji: "",
      rateType: "—",
      arrival: "—",
      min: 0,
      max: 0,
      trend: "stable",
      trendPct: 0,
      mandiName: "—",
      mandiCity: "—",
      province: "Punjab",
      vertical: activeProduct?.vertical || "Grains",
    };

    const fromMandi = Object.entries(MANDI_ROWS).flatMap(([mandiId, rows]) => {
      const mandi = INITIAL_MANDIS.find((m) => m.id === mandiId);
      if (!mandi) return [];
      if (!inLocScope(mandi.name, mandi.city, mandi.province)) return [];
      return rows
        .filter(
          (r) =>
            activeproducts.includes(r.product) &&
            (!bp || r.byproduct === bp) &&
            (selectedRateTypes.length === 0 ||
              selectedRateTypes.includes(r.rateType)),
        )
        .map((r) => {
          const vEntry = showAllProducts
            ? products.find((p) => p.product === r.product)
            : null;
          return enrichRowWithAttrs({
            ...r,
            mandiName: mandi.name,
            mandiCity: mandi.city,
            province: mandi.province,
            vertical: vEntry?.vertical || activeProduct?.vertical || "Grains",
          });
        });
    });
    if (fromMandi.length > 0) return { row: fromMandi[0], hasData: true };

    const fromFeed = FEED_MESSAGES.filter(
      (m) =>
        activeproducts.includes(m.product) &&
        (!bp || m.byproduct === bp) &&
        (selectedRateTypes.length === 0 ||
          selectedRateTypes.includes(m.rateType)) &&
        inLocScope(m.station, m.station, m.province),
    );
    if (fromFeed.length > 0) {
      const m = fromFeed[0];
      return {
        hasData: true,
        row: {
          product: m.product,
          byproduct: m.byproduct,
          emoji: "",
          rateType: m.rateType,
          arrival: `${m.arrivalCount} ${m.arrivalUnit}`,
          min: m.priceMin,
          max: m.priceMax,
          trend: (m.trend || "stable") as "up" | "down" | "stable",
          trendPct: m.trendPct || 0,
          mandiName: m.station,
          mandiCity: m.station,
          province: m.province,
          vertical: m.vertical,
        },
      };
    }
    return { row: noData, hasData: false };
  };

  const activeproducts = showAllProducts
    ? products.map((p) => p.product)
    : [activeProduct?.product || ""];

  const buildAllRows = (bp: string): RichRow[] => {
    const rows: RichRow[] = [];
    const seen = new Set<string>(); // deduplicate by mandi+rateType
    Object.entries(MANDI_ROWS).forEach(([mandiId, mandiRows]) => {
      const mandi = INITIAL_MANDIS.find((m) => m.id === mandiId);
      if (!mandi) return;
      if (!inLocScope(mandi.name, mandi.city, mandi.province)) return;
      mandiRows
        .filter(
          (r) =>
            activeproducts.includes(r.product) &&
            (!bp || r.byproduct === bp) &&
            (selectedRateTypes.length === 0 ||
              selectedRateTypes.includes(r.rateType)),
        )
        .forEach((r) => {
          const key = `${mandi.name}|${r.rateType}`;
          if (seen.has(key)) return;
          seen.add(key);
          const vEntry = showAllProducts
            ? products.find((p) => p.product === r.product)
            : null;
          rows.push(
            enrichRowWithAttrs({
              ...r,
              mandiName: mandi.name,
              mandiCity: mandi.city,
              province: mandi.province,
              vertical: vEntry?.vertical || activeProduct?.vertical || "Grains",
            }),
          );
        });
    });
    return rows;
  };

  const handlePriceChipTap = (rateType: string) => {
    const isCurrentlyOn = selectedRateTypes.includes(rateType);
    setSelectedRateTypes((p) =>
      p.includes(rateType) ? p.filter((x) => x !== rateType) : [...p, rateType],
    );
    if (voiceEnabled) {
      if (lang === "ur") {
        speakText(
          isCurrentlyOn
            ? "تمام ریٹس دکھائے جا رہے ہیں۔"
            : `تمام ${trL(rateType)} کے ریٹس دکھائے جا رہے ہیں۔`,
        );
      } else {
        speakText(
          isCurrentlyOn
            ? "All price types are shown."
            : `All ${rateType} rates are shown.`,
        );
      }
    }
  };

  const handleMandiChipTap = (mandiName: string) => {
    if (voiceEnabled) {
      speakText(
        lang === "ur"
          ? `${tmL(mandiName)} کی قیمتیں دکھائی جا رہی ہیں۔`
          : `Prices of ${mandiName} are shown.`,
      );
    }
  };

  const locLabel =
    selectedLocs.length === 0
      ? lang === "ur"
        ? "پاکستان"
        : "Pakistan"
      : selectedLocs.length === 1
        ? tmL(selectedLocs[0].label)
        : lang === "ur"
          ? `${selectedLocs.length} مقامات`
          : `${selectedLocs.length} Locations`;

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: "#F1F7F4" }}
    >
      {/*  Header  */}
      <header
        className="flex-shrink-0"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        {/* Title row with location top-right and Free Trial chip */}
        <div className="px-4 pt-10 pb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onBack}
              className="tap-target w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "#E8EFEC" }}
            >
              {lang === "ur" ? "→" : "←"}
            </button>
            <div className="min-w-0">
              <h1
                className="font-extrabold text-lg truncate"
                style={{
                  color: "#183B34",
                  fontFamily:
                    lang === "ur"
                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                      : "'Poppins', sans-serif",
                }}
              >
                {activeProduct
                  ? tcL(activeProduct.product)
                  : lang === "ur"
                    ? "مصنوعات"
                    : "Products"}
              </h1>
            </div>
          </div>

          {/* Top Right: Free Trial Badge + Date flip indicator + Location selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Free Trial Badge Chip */}
            {!profileCompleted ? (
              <button
                type="button"
                onClick={() => onOpenSubscribe?.()}
                className="tap-target flex items-center gap-1 px-2.5 py-1 rounded-full font-extrabold text-xs"
                style={{
                  background: "linear-gradient(135deg, #FFF0C7, #FDE68A)",
                  border: "1.2px solid #F59E0B",
                  color: "#92400E",
                  boxShadow: "0 2px 6px rgba(245, 158, 11, 0.2)",
                  cursor: "pointer",
                }}
                title="Tap to Complete Profile & Unlock All Rates"
              >
                <span style={{ fontSize: 10 }}>
                  {lang === "ur" ? "ٹرائل: ۲ دن" : "Trial: 2d"}
                </span>
              </button>
            ) : (
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-xs"
                style={{
                  background: "#E8F5E9",
                  color: "#1B5E20",
                  border: "1px solid #81C784",
                }}
              >
                {/* <span style={{ fontSize: 10 }}>💎</span> */}
                <span style={{ fontSize: 9.5 }}>VIP</span>
              </div>
            )}

            {/* Flip calendar date indicator */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                if (voiceEnabled) {
                  speakText(
                    lang === "ur"
                      ? "گزشتہ تاریخوں کی قیمتیں دکھائی جا رہی ہیں۔"
                      : "Showing historical dates and prices.",
                  );
                }
              }}
              style={{
                display: "flex",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                flexShrink: 0,
                border: "1px solid #C7E8D8",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  background: "#087F63",
                  padding: "4px 7px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 8.5,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                  }}
                >
                  {visibleDateLabel.month}
                </span>
              </div>
              <div
                style={{
                  background: "#F4FAF7",
                  padding: "4px 7px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeft: "1px solid #D5E2DD",
                }}
              >
                <span
                  style={{
                    color: "#183B34",
                    fontSize: 15,
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {visibleDateLabel.d}
                </span>
              </div>
            </div>

            {/* Location selector button */}
            <button
              onClick={() => {
                setLocSheet(true);
                if (voiceEnabled) {
                  speakText(
                    lang === "ur" ? "مقام منتخب کریں" : "Select location",
                  );
                }
              }}
              className="tap-target flex-shrink-0 flex items-center gap-1 rounded-2xl font-bold text-xs px-2.5"
              style={{
                height: 34,
                background: "#E4F2EC",
                color: "#075E4F",
                border: "1px solid #C7E8D8",
                maxWidth: 110,
              }}
            >
              <span className="truncate" style={{ fontSize: 11 }}>{locLabel}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.85, flexShrink: 0 }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Row 1: Product chips */}
        <ScrollRow bg="#fff" style={{ borderTop: "1px solid #E8EFEC" }}>
          <span
            className="flex-shrink-0 font-extrabold mr-1"
            style={{
              color: "#80918B",
              minWidth: lang === "ur" ? 48 : 32,
              fontSize: lang === "ur" ? 15 : 10,
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            {lang === "ur" ? "مصنوعات" : "Prod"}
          </span>
          <button
            onClick={() => {
              setShowAllProducts(true);
              if (voiceEnabled)
                speakText(
                  lang === "ur"
                    ? "تمام مصنوعات منتخب ہیں۔ تمام قیمتیں دکھائی جا رہی ہیں۔"
                    : "All products selected. All prices are shown.",
                );
            }}
            className="tap-target flex-shrink-0 rounded-full font-bold flex items-center justify-center"
            style={{
              background: showAllProducts ? "#087F63" : "#E8EFEC",
              color: showAllProducts ? "#fff" : "#52635F",
              border: showAllProducts ? "none" : "1px solid #D5E2DD",
              fontSize: lang === "ur" ? 17 : 12,
              minHeight: lang === "ur" ? 42 : 32,
              padding: lang === "ur" ? "6px 16px" : "4px 12px",
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            {lang === "ur" ? "سب" : "All"}
          </button>
          {products.map((p, i) => {
            const on = !showAllProducts && i === idx;
            return (
              <button
                key={`${p.vertical}|${p.product}`}
                onClick={() => {
                  setActive(i);
                  if (voiceEnabled)
                    speakText(
                      lang === "ur"
                        ? `${tcL(p.product)} کی تمام ضمنی مصنوعات کے ریٹس دکھائے جا رہے ہیں۔`
                        : `All ${p.product} byproduct prices are shown.`,
                    );
                }}
                className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-bold"
                style={{
                  background: on ? "#087F63" : "#E8EFEC",
                  color: on ? "#fff" : "#52635F",
                  border: on ? "none" : "1px solid #D5E2DD",
                  fontSize: lang === "ur" ? 17 : 12,
                  minHeight: lang === "ur" ? 42 : 32,
                  padding: lang === "ur" ? "6px 14px" : "4px 12px",
                  fontFamily:
                    lang === "ur"
                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                      : "inherit",
                }}
              >
                <ProductIcon
                  name={p.product}
                  vertical={p.vertical}
                  size={lang === "ur" ? 18 : 14}
                  style={{
                    filter: on ? "brightness(0) invert(1)" : "none",
                    flexShrink: 0,
                  }}
                />
                {tcL(p.product)}
              </button>
            );
          })}
        </ScrollRow>

        {/* Row 2: By Product chips */}
        <ScrollRow bg="#fff" style={{ borderTop: "1px solid #E8EFEC" }}>
          <span
            className="flex-shrink-0 font-extrabold mr-1"
            style={{
              color: "#80918B",
              minWidth: lang === "ur" ? 48 : 32,
              fontSize: lang === "ur" ? 15 : 10,
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            {lang === "ur" ? "ضمنی" : "ByP"}
          </span>
          <button
            onClick={() => {
              setSelectedBP(null);
              const prodName =
                activeProduct?.product ||
                (lang === "ur" ? "تمام مصنوعات" : "all products");
              if (voiceEnabled)
                speakText(
                  lang === "ur"
                    ? `${tcL(prodName)} کی تمام ضمنی مصنوعات دکھائی جا رہی ہیں۔`
                    : `All byproducts of ${prodName} shown.`,
                );
            }}
            className="tap-target flex-shrink-0 rounded-full font-bold flex items-center justify-center"
            style={{
              background: !selectedBP ? "#087F63" : "#E8EFEC",
              color: !selectedBP ? "#fff" : "#52635F",
              border: !selectedBP ? "none" : "1px solid #D5E2DD",
              fontSize: lang === "ur" ? 17 : 12,
              minHeight: lang === "ur" ? 42 : 32,
              padding: lang === "ur" ? "6px 16px" : "4px 12px",
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            {lang === "ur" ? "سب" : "All"}
          </button>
          {byproducts.map((bp) => {
            const on = selectedBP === bp;
            return (
              <button
                key={bp}
                onClick={() => {
                  setSelectedBP(on ? null : bp);
                  if (voiceEnabled)
                    speakText(
                      on
                        ? lang === "ur"
                          ? "تمام ضمنی مصنوعات دکھائی جا رہی ہیں۔"
                          : "All byproducts shown."
                        : lang === "ur"
                          ? `${tcL(bp)} کی قیمتیں دکھائی جا رہی ہیں۔`
                          : `Prices of ${bp} are shown.`,
                    );
                }}
                className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-bold"
                style={{
                  background: on ? "#087F63" : "#E8EFEC",
                  color: on ? "#fff" : "#52635F",
                  border: on ? "none" : "1px solid #D5E2DD",
                  fontSize: lang === "ur" ? 17 : 12,
                  minHeight: lang === "ur" ? 42 : 32,
                  padding: lang === "ur" ? "6px 14px" : "4px 12px",
                  fontFamily:
                    lang === "ur"
                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                      : "inherit",
                }}
              >
                <ProductIcon
                  name={bp}
                  vertical={activeProduct?.vertical}
                  size={lang === "ur" ? 17 : 13}
                  style={{
                    filter: on ? "brightness(0) invert(1)" : "none",
                    flexShrink: 0,
                  }}
                />
                {tcL(bp)}
              </button>
            );
          })}
        </ScrollRow>

        {/* Row 3: Price Type chips */}
        <ScrollRow bg="#fff" style={{ borderTop: "1px solid #E8EFEC" }}>
          <span
            className="flex-shrink-0 font-extrabold mr-1"
            style={{
              color: "#80918B",
              minWidth: lang === "ur" ? 48 : 32,
              fontSize: lang === "ur" ? 15 : 10,
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            {lang === "ur" ? "ریٹ" : "Price"}
          </span>
          <button
            onClick={() => {
              setSelectedRateTypes([]);
              if (voiceEnabled)
                speakText(
                  lang === "ur"
                    ? "تمام ریٹس دکھائے جا رہے ہیں۔"
                    : "All price types are shown.",
                );
            }}
            className="tap-target flex-shrink-0 rounded-full font-bold flex items-center justify-center"
            style={{
              background:
                selectedRateTypes.length === 0 ? "#087F63" : "#E8EFEC",
              color: selectedRateTypes.length === 0 ? "#fff" : "#52635F",
              border:
                selectedRateTypes.length === 0 ? "none" : "1px solid #D5E2DD",
              fontSize: lang === "ur" ? 17 : 12,
              minHeight: lang === "ur" ? 42 : 32,
              padding: lang === "ur" ? "6px 16px" : "4px 12px",
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            {lang === "ur" ? "سب" : "All"}
          </button>
          {ALL_RATE_TYPES.map((rt) => {
            const on = selectedRateTypes.includes(rt);
            return (
              <button
                key={rt}
                onClick={() => handlePriceChipTap(rt)}
                className="tap-target flex-shrink-0 rounded-full font-bold"
                style={{
                  background: on ? "#087F63" : "#E8EFEC",
                  color: on ? "#fff" : "#183B34",
                  border: on ? "none" : "1px solid #D5E2DD",
                  fontSize: lang === "ur" ? 17 : 12,
                  minHeight: lang === "ur" ? 42 : 32,
                  padding: lang === "ur" ? "6px 14px" : "4px 12px",
                  fontFamily:
                    lang === "ur"
                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                      : "inherit",
                }}
              >
                {trL(rt).replace(" ریٹ", "").replace(" Rate", "")}
              </button>
            );
          })}
        </ScrollRow>

        {/* Reset bar */}
        {selectedRateTypes.length > 0 && (
          <div
            className="px-4 py-2 flex items-center gap-2 flex-shrink-0"
            style={{ borderTop: "1px solid #E8EFEC" }}
          >
            <button
              onClick={() => {
                setSelectedRateTypes([]);
                if (voiceEnabled) {
                  speakText(
                    lang === "ur"
                      ? "قیمت کا فلٹر ہٹا دیا گیا۔ تمام ریٹس دکھائے جا رہے ہیں۔"
                      : "Price filter reset. All price types are shown.",
                  );
                }
              }}
              className="tap-target flex items-center gap-1.5 rounded-full font-bold"
              style={{
                background: "#F9E1DE",
                color: "#A83B37",
                border: "1.5px solid #E7AAA4",
                fontSize: lang === "ur" ? 16 : 12,
                minHeight: lang === "ur" ? 40 : 32,
                padding: lang === "ur" ? "6px 16px" : "4px 12px",
                fontFamily:
                  lang === "ur"
                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                    : "inherit",
              }}
            >
              {lang === "ur"
                ? "↺ قیمت کا فلٹر ری سیٹ کریں"
                : "↺ Reset Price Filter"}
            </button>
          </div>
        )}
      </header>

      {/*  By-Product Rate Cards — date grouped  */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto pb-6"
        style={{ scrollbarWidth: "none" }}
      >
        {activeBPs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 opacity-50 px-4">
            <span style={{ fontSize: 48 }}></span>
            <p className="font-semibold mt-2">No by-products found</p>
          </div>
        )}
        {activeBPs.length > 0 &&
          Array.from({ length: NUM_DAYS }, (_, offset) => {
            const dateObj = dateForOffset(offset);
            const dKey = dateLabelStr(dateObj);
            const dDisplay = dateDisplayStr(dateObj);
            const isToday = offset === 0;
            const priceVariation = 1 - offset * 0.012;

            const sortedBPs = [...activeBPs].sort((a, b) => {
              const aHas = buildRepRow(a).hasData;
              const bHas = buildRepRow(b).hasData;
              if (aHas && !bHas) return -1;
              if (!aHas && bHas) return 1;
              return 0;
            });

            // Progressive filter-based reveal calculation
            const isCountryFilter =
              selectedLocs.length === 0 ||
              selectedLocs.some((l) => l.kind === "pakistan");
            const isProvinceFilter = selectedLocs.some(
              (l) => l.kind === "province",
            );
            const isDistrictFilter = selectedLocs.some(
              (l) => l.kind === "district",
            );

            const revealRatio = isCountryFilter
              ? 0.45 // Whole country: ~45% cards visible
              : isProvinceFilter
                ? 0.35 // Province: ~35% cards visible
                : isDistrictFilter
                  ? 0.25 // District: ~25% cards visible
                  : 0.15; // Specific Mandi: ~15% cards visible

            // Flatten all rows for this date to track cardIndex
            let totalCardCountInDate = 0;
            const allDateItems: {
              bp: string;
              r: RichRow;
              hasData: boolean;
            }[] = [];

            sortedBPs.forEach((bp) => {
              const allR = buildAllRows(bp);
              const { row: repRow, hasData } = buildRepRow(bp);
              const dataRows = allR.slice(0, 3);
              const showRows =
                dataRows.length > 0
                  ? dataRows.map((r) => ({
                      r: {
                        ...r,
                        min: Math.round(r.min * priceVariation),
                        max: Math.round(r.max * priceVariation),
                      },
                      hasData: true,
                    }))
                  : [
                      {
                        r: {
                          ...repRow,
                          byproduct: bp,
                          min: Math.round(repRow.min * priceVariation),
                          max: Math.round(repRow.max * priceVariation),
                        },
                        hasData: false,
                      },
                    ];

              showRows.forEach((item) => {
                allDateItems.push({ bp, ...item });
              });
            });

            totalCardCountInDate = allDateItems.length;
            const visibleThreshold = Math.max(
              1,
              Math.ceil(totalCardCountInDate * revealRatio),
            );

            return (
              <div
                key={dKey}
                ref={(el) => {
                  if (el) dateSectionRefs.current.set(dKey, el);
                  else dateSectionRefs.current.delete(dKey);
                }}
              >
                {/* Date section separator */}
                <div
                  className="px-4 pt-4 pb-2 flex items-center gap-3"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "#F1F7F4",
                  }}
                >
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#D5E2DD" }}
                  />
                  <span
                    className="font-extrabold text-xs px-3 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: isToday ? "#087F63" : "#fff",
                      color: isToday ? "#fff" : "#52635F",
                      border: isToday ? "none" : "1px solid #D5E2DD",
                    }}
                  >
                    {isToday ? "Today · " : ""}
                    {dDisplay}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#D5E2DD" }}
                  />
                </div>

                {/* Historical Date Locked Notice for Non-Subscribers */}
                {!isToday && !profileCompleted && (
                  <div
                    className="mx-4 my-2 px-3 py-2.5 rounded-2xl flex items-center justify-between gap-2"
                    style={{
                      background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
                      border: "1.2px solid #F59E0B",
                      boxShadow: "0 2px 8px rgba(245, 158, 11, 0.1)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 16 }}>🔒</span>
                      <div>
                        <div
                          style={{
                            fontSize: 11.5,
                            fontWeight: 800,
                            color: "#92400E",
                          }}
                        >
                          {lang === "ur"
                            ? `${dDisplay} کے ریٹس لاک ہیں`
                            : `Rates for ${dDisplay} are locked`}
                        </div>
                        <div style={{ fontSize: 10, color: "#B45309" }}>
                          {lang === "ur"
                            ? "پچھلی تاریخوں کا ریکارڈ دیکھنے کے لیے پروفائل مکمل کریں۔"
                            : "Complete your profile to unlock historical price data."}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenSubscribe?.()}
                      className="tap-target px-2.5 py-1.5 rounded-xl font-extrabold text-xs text-white flex-shrink-0"
                      style={{
                        background: "#087F63",
                        boxShadow: "0 2px 6px rgba(8,127,99,0.25)",
                      }}
                    >
                      {lang === "ur" ? "انلاک ➔" : "Unlock ➔"}
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-3 px-4 pb-2">
                  {allDateItems.map(({ bp, r, hasData: hd }, cardIdx) => {
                    // Determine if card is blurred
                    const isCardBlurred =
                      !profileCompleted &&
                      (!isToday || cardIdx >= visibleThreshold);

                    return (
                      <div
                        key={`${dKey}-${bp}-${cardIdx}`}
                        className="relative"
                        style={{ overflow: "hidden", borderRadius: 18 }}
                      >
                        {/* If no data */}
                        {!hd && !isCardBlurred && (
                          <div className="absolute inset-0 z-20 rounded-2xl flex flex-col items-center justify-center pointer-events-none overflow-hidden">
                            <div
                              className="absolute inset-0"
                              style={{
                                background: "rgba(255,255,255,0.72)",
                                borderRadius: "inherit",
                              }}
                            />
                            <div
                              className="relative z-10 flex flex-col items-center gap-1 px-4 py-2 rounded-xl"
                              style={{
                                background: "rgba(243,244,246,0.95)",
                                border: "1px solid #D5E2DD",
                              }}
                            >
                              <span
                                className="font-bold text-xs"
                                style={{ color: "#52635F" }}
                              >
                                No data for {isToday ? "today" : dDisplay}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Card Content (blurred if locked) */}
                        <div
                          style={{
                            filter: isCardBlurred ? "blur(5px)" : "none",
                            opacity: isCardBlurred ? 0.6 : 1,
                            pointerEvents: isCardBlurred ? "none" : "auto",
                            userSelect: isCardBlurred ? "none" : "auto",
                            transition: "filter 0.3s, opacity 0.3s",
                          }}
                        >
                          <RateCard
                            r={{ ...r, byproduct: bp }}
                            dateText={isToday ? "TODAY" : dDisplay}
                            isToday={isToday}
                            onClick={() =>
                              handleCardTap(r, bp, () => {
                                const rowVertical =
                                  r.vertical ||
                                  activeProduct?.vertical ||
                                  "Grains";
                                const rowproduct =
                                  r.product || activeProduct?.product || bp;
                                const baseItem = {
                                  vertical: rowVertical,
                                  product: rowproduct,
                                  byproduct: bp,
                                };
                                if (!hd) {
                                  push({ id: "product-rates", ...baseItem });
                                  return;
                                }
                                push({
                                  id: "product-rates",
                                  ...baseItem,
                                  initialRateType: r.rateType,
                                  initialMandi: r.mandiName,
                                  initialVariety: r.variety || undefined,
                                  initialNewOld: r.newOld || undefined,
                                  initialColor: r.color || undefined,
                                  initialSpec: r.spec || undefined,
                                  initialCondition: r.condition || undefined,
                                  initialStatDate:
                                    offset > 0
                                      ? dateObj.toISOString()
                                      : undefined,
                                });
                              })
                            }
                            onPriceChipTap={hd ? handlePriceChipTap : undefined}
                            onMandiChipTap={hd ? handleMandiChipTap : undefined}
                          />
                        </div>

                        {/* Blurred Locked Card Overlay */}
                        {isCardBlurred && (
                          <div
                            onClick={() => onOpenSubscribe?.()}
                            className="tap-target absolute inset-0 z-20 flex flex-col items-center justify-center p-3 cursor-pointer"
                            style={{
                              background: "rgba(244, 250, 247, 0.72)",
                              backdropFilter: "blur(2px)",
                              borderRadius: 18,
                            }}
                          >
                            <div
                              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full"
                              style={{
                                background: "#FFFFFF",
                                border: "1.5px solid #087F63",
                                boxShadow: "0 4px 14px rgba(8,127,99,0.18)",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 800,
                                  color: "#087F63",
                                }}
                              >
                                {lang === "ur"
                                  ? "ریٹ دیکھنے کے لیے پروفائل مکمل کریں"
                                  : "Complete Profile to Unlock Rate"}
                              </span>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 900,
                                  color: "#087F63",
                                }}
                              >
                                ➔
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {locSheet && (
        <MultiLocSheet
          selected={selectedLocs}
          onApply={(locs) => {
            setSelectedLocs(locs);
            setLocSheet(false);
            if (voiceEnabled) {
              if (locs.length === 0 || locs.some((l) => l.kind === "pakistan")) {
                speakText("Prices of my country shown.");
              } else if (locs.length === 1) {
                const loc = locs[0];
                if (loc.kind === "pakistan")
                  speakText("Prices of my country shown.");
                else if (loc.kind === "province")
                  speakText(`Prices of ${loc.label} are shown.`);
                else if (loc.kind === "district")
                  speakText(`Prices of ${loc.label} district are shown.`);
                else speakText(`Prices of ${loc.label} are shown.`);
              } else {
                speakText(`Prices of ${locs.length} locations are shown.`);
              }
            }
          }}
          onClose={() => setLocSheet(false)}
        />
      )}
    </div>
  );
}

// ─── MULTI-LOCATION SHEET WITH ACCORDION LAYOUT & WHOLE COUNTRY OPTION ──────
function MultiLocSheet({
  selected,
  onApply,
  onClose,
}: {
  selected: { kind: LocationScope["kind"]; label: string }[];
  onApply: (locs: { kind: LocationScope["kind"]; label: string }[]) => void;
  onClose: () => void;
}) {
  const { lang, voiceEnabled, tm: tmL } = useLang();
  const [draft, setDraft] = useState(selected);
  const [selectedProvince, setSelectedProvince] = useState<string>("Punjab");
  const [distSearch, setDistSearch] = useState("");
  const [expandedDistricts, setExpandedDistricts] = useState<
    Record<string, boolean>
  >({
    Lahore: true,
    Multan: true,
    Faisalabad: true,
  });

  const isWholeCountrySelected =
    draft.length === 0 || draft.some((x) => x.kind === "pakistan");

  const provinces = Object.keys(LOCATIONS);
  const availableDistricts = Object.keys(LOCATIONS[selectedProvince] || {});
  const filteredDistricts = availableDistricts.filter((d) => {
    if (!distSearch) return true;
    const q = distSearch.toLowerCase();
    if (d.toLowerCase().includes(q)) return true;
    const mandis = LOCATIONS[selectedProvince]?.[d] || [];
    return mandis.some((m) => m.toLowerCase().includes(q));
  });

  const toggleWholeCountry = () => {
    setDraft([{ kind: "pakistan", label: "All Pakistan" }]);
    if (voiceEnabled) {
      speakText(
        lang === "ur"
          ? "پورا پاکستان منتخب کیا گیا۔"
          : "Whole country selected.",
      );
    }
  };

  const toggleProvince = (p: string) => {
    const isAlready = draft.some(
      (x) => x.kind === "province" && x.label === p,
    );
    if (isAlready) {
      setDraft((prev) =>
        prev.filter((x) => !(x.kind === "province" && x.label === p)),
      );
    } else {
      setDraft((prev) => [
        ...prev.filter((x) => x.kind !== "pakistan"),
        { kind: "province", label: p },
      ]);
    }
    setSelectedProvince(p);
  };

  const toggleDistrictAccordion = (d: string) => {
    setExpandedDistricts((prev) => ({ ...prev, [d]: !prev[d] }));
  };

  const toggleMandi = (mName: string, distName: string) => {
    const isAlready = draft.some((x) => x.label === mName);
    if (isAlready) {
      setDraft((prev) => prev.filter((x) => x.label !== mName));
    } else {
      setDraft((prev) => [
        ...prev.filter((x) => x.kind !== "pakistan"),
        { kind: "mandi", label: mName },
      ]);
    }
  };

  const toggleSelectAllInDistrict = (
    distName: string,
    mandiList: string[],
  ) => {
    const allSelected = mandiList.every((m) =>
      draft.some((x) => x.label === m),
    );
    if (allSelected) {
      setDraft((prev) => prev.filter((x) => !mandiList.includes(x.label)));
    } else {
      const toAdd = mandiList
        .filter((m) => !draft.some((x) => x.label === m))
        .map((m) => ({ kind: "mandi" as const, label: m }));
      setDraft((prev) => [
        ...prev.filter((x) => x.kind !== "pakistan"),
        ...toAdd,
      ]);
    }
  };

  const isMandiSelected = (mName: string) =>
    draft.some((x) => x.label === mName);
  const isProvSelected = (p: string) =>
    draft.some((x) => x.kind === "province" && x.label === p);

  return (
    <div
      className="zm-sheet-overlay"
      style={{ zIndex: 350 }}
      onClick={onClose}
    >
      <div
        className="zm-sheet-high"
        style={{
          background: "#F4FAF7",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "28px 28px 0 0",
          boxShadow: "0 -10px 40px rgba(6,77,64,0.22)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + title */}
        <div
          className="px-5 pt-4 pb-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #D5E2DD" }}
        >
          <div
            className="w-10 h-1 rounded-full mx-auto mb-3"
            style={{ background: "#C7D6D0" }}
          />
          <div className="flex items-center justify-between">
            <div>
              <p
                className="font-extrabold text-lg"
                style={{ color: "#183B34" }}
              >
                {lang === "ur" ? "مقام کا فلٹر" : "Location Filter"}
              </p>
            </div>
            {draft.length > 0 && !isWholeCountrySelected && (
              <button
                onClick={() => {
                  toggleWholeCountry();
                }}
                className="tap-target text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "#E8EFEC", color: "#087F63" }}
              >
                {lang === "ur" ? "ری سیٹ" : "Reset"}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Universal Search Bar at TOP */}
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "#52635F",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {lang === "ur"
                ? "منڈی یا ضلع تلاش کریں"
                : "Search Any Mandi or District"}
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                border: "1.5px solid #D5E2DD",
                borderRadius: 12,
                padding: "9px 12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
              }}
            >
              <span style={{ fontSize: 16, color: "#087F63" }}>⌕</span>
              <input
                type="text"
                placeholder={
                  lang === "ur"
                    ? "مثال: جڑانوالہ، بادامی باغ، فیصل آباد..."
                    : "e.g. Badami Bagh, Faisalabad, Multan..."
                }
                value={distSearch}
                onChange={(e) => setDistSearch(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: 13,
                  color: "#183B34",
                  background: "transparent",
                }}
              />
              {distSearch && (
                <button
                  type="button"
                  onClick={() => setDistSearch("")}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#80918B",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Select: Whole Country (All Pakistan) Card */}
          <div style={{ marginBottom: 12 }}>
            <button
              type="button"
              onClick={toggleWholeCountry}
              className="tap-target w-full"
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: isWholeCountrySelected
                  ? "2px solid #087F63"
                  : "1.5px solid #D5E2DD",
                background: isWholeCountrySelected
                  ? "linear-gradient(135deg, #E4F2EC, #D1ECE2)"
                  : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: isWholeCountrySelected
                  ? "0 3px 12px rgba(8,127,99,0.14)"
                  : "none",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: isWholeCountrySelected ? "#087F63" : "#183B34",
                    }}
                  >
                    {lang === "ur"
                      ? "پورا پاکستان"
                      : "All Pakistan"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: isWholeCountrySelected
                    ? "2px solid #087F63"
                    : "1.5px solid #C7D6D0",
                  background: isWholeCountrySelected ? "#087F63" : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 900,
                }}
              >
                {isWholeCountrySelected ? "✓" : ""}
              </div>
            </button>
          </div>

          {/* Unified Container Box for Province Tabs & Mandis/Districts */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #D5E2DD",
              borderRadius: 16,
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              boxShadow: "0 3px 12px rgba(6,77,64,0.04)",
              marginBottom: 12,
            }}
          >
            {/* Province Tabs Header inside Box */}
            <div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: "#52635F",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                }}
              >
                {lang === "ur" ? "صوبہ منتخب کریں" : "Select Province"}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  overflowX: "auto",
                  paddingBottom: 2,
                  scrollbarWidth: "none",
                }}
              >
                {provinces.map((p) => {
                  const isCurrentTab = selectedProvince === p;
                  const isSelectedInDraft = isProvSelected(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleProvince(p)}
                      className="tap-target px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap"
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
                      {tmL(p)} {isSelectedInDraft ? "✓" : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ height: 1, background: "#E8EFEC" }} />

            {/* Districts & Mandis inside Unified Box */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: "#52635F",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {lang === "ur"
                    ? "اضلاع اور منڈیاں"
                    : "Districts & Mandis"}
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    color: "#087F63",
                    fontWeight: 700,
                  }}
                >
                  {draft.length} filter{draft.length !== 1 ? "s" : ""} active
                </span>
              </div>

              <div
                style={{
                  maxHeight: 280,
                  minHeight: 160,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  scrollbarWidth: "thin",
                  paddingRight: 2,
                }}
              >
                {filteredDistricts.map((d) => {
                  const isDistExpanded = !!expandedDistricts[d];
                  const mandiList = LOCATIONS[selectedProvince]?.[d] || [];
                  const selectedInDistrictCount = mandiList.filter((m) =>
                    isMandiSelected(m),
                  ).length;
                  const allInDistrictSelected =
                    mandiList.length > 0 &&
                    selectedInDistrictCount === mandiList.length;

                  return (
                    <div
                      key={d}
                      style={{
                        flexShrink: 0,
                        background: "#F9FBFB",
                        border:
                          selectedInDistrictCount > 0
                            ? "1.5px solid #087F63"
                            : "1px solid #E2EFE9",
                        borderRadius: 12,
                        overflow: "hidden",
                      }}
                    >
                      {/* District Accordion Header */}
                      <div
                        onClick={() => toggleDistrictAccordion(d)}
                        style={{
                          padding: "10px 12px",
                          background:
                            selectedInDistrictCount > 0
                              ? "#F0F8F4"
                              : "#FFFFFF",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          userSelect: "none",
                          borderBottom:
                            isDistExpanded && mandiList.length > 0
                              ? "1px solid #E2EFE9"
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 800,
                                color:
                                  selectedInDistrictCount > 0
                                    ? "#087F63"
                                    : "#183B34",
                              }}
                            >
                              {d}
                            </div>
                            <div
                              style={{
                                fontSize: 10.5,
                                color: "#52635F",
                                marginTop: 1,
                              }}
                            >
                              {mandiList.length}{" "}
                              {mandiList.length === 1 ? "Mandi" : "Mandis"}
                              {selectedInDistrictCount > 0 &&
                                ` · ${selectedInDistrictCount} Selected`}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {/* Select All in District Button */}
                          {mandiList.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectAllInDistrict(d, mandiList);
                              }}
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                color: allInDistrictSelected
                                  ? "#FFFFFF"
                                  : "#087F63",
                                background: allInDistrictSelected
                                  ? "#087F63"
                                  : "#E4F2EC",
                                border: "1px solid #087F63",
                                padding: "3px 8px",
                                borderRadius: 6,
                                cursor: "pointer",
                              }}
                            >
                              {allInDistrictSelected
                                ? "✓ All Selected"
                                : "Select All"}
                            </button>
                          )}

                          {/* Accordion Expand / Collapse Indicator */}
                          <span
                            style={{
                              color: isDistExpanded ? "#087F63" : "#80918B",
                              fontSize: 12,
                              fontWeight: 800,
                              transform: isDistExpanded
                                ? "rotate(0deg)"
                                : "rotate(-90deg)",
                              transition: "transform 0.2s",
                            }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>

                      {/* Mandis List for this District */}
                      {isDistExpanded && mandiList.length > 0 && (
                        <div
                          style={{
                            padding: "8px 10px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            background: "#FFFFFF",
                          }}
                        >
                          {mandiList.map((mName) => {
                            const isSelected = isMandiSelected(mName);
                            return (
                              <button
                                key={mName}
                                type="button"
                                onClick={() => toggleMandi(mName, d)}
                                className="tap-target"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "8px 10px",
                                  borderRadius: 8,
                                  border: isSelected
                                    ? "1.5px solid #087F63"
                                    : "1px solid #E2EFE9",
                                  background: isSelected
                                    ? "#E4F2EC"
                                    : "#FAFCFB",
                                  textAlign: "left",
                                  cursor: "pointer",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: isSelected ? 800 : 600,
                                    color: isSelected ? "#087F63" : "#183B34",
                                  }}
                                >
                                  {mName}
                                </span>
                                <div
                                  style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 4,
                                    border: isSelected
                                      ? "1.5px solid #087F63"
                                      : "1.5px solid #C7D6D0",
                                    background: isSelected
                                      ? "#087F63"
                                      : "#FFFFFF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#FFFFFF",
                                    fontSize: 11,
                                    fontWeight: 900,
                                  }}
                                >
                                  {isSelected ? "✓" : ""}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredDistricts.length === 0 && (
                  <div
                    style={{
                      padding: "20px 14px",
                      textAlign: "center",
                      background: "#FAFCFB",
                      borderRadius: 12,
                      border: "1.5px dashed #D5E2DD",
                      color: "#52635F",
                      fontSize: 12.5,
                    }}
                  >
                    <div>🔍 No locations matching "{distSearch}"</div>
                    <button
                      type="button"
                      onClick={() => setDistSearch("")}
                      className="tap-target px-3 py-1 rounded-lg text-xs font-bold mt-2"
                      style={{ background: "#087F63", color: "#fff" }}
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Apply Button */}
        <div
          className="px-4 pb-6 pt-3 flex-shrink-0"
          style={{ borderTop: "1px solid #D5E2DD" }}
        >
          <button
            onClick={() => onApply(draft)}
            className="tap-target w-full rounded-2xl font-extrabold text-white"
            style={{
              background: "#087F63",
              minHeight: 48,
              padding: "13px 16px",
              fontSize: 15,
              boxShadow: "0 4px 14px rgba(8,127,99,0.3)",
            }}
          >
            {isWholeCountrySelected
              ? lang === "ur"
                ? "پورا پاکستان لاگو کریں"
                : "Apply All Pakistan"
              : draft.length > 0
                ? lang === "ur"
                  ? `${draft.length} مقامات لاگو کریں`
                  : `Apply ${draft.length} Selected Location${draft.length > 1 ? "s" : ""}`
                : lang === "ur"
                  ? "پورا پاکستان لاگو کریں"
                  : "Apply All Pakistan"}
          </button>
        </div>
      </div>
    </div>
  );
}

//  BY-PRODUCT SELECT

function ByProductSelectScreen({
  push,
  onBack,
}: {
  push: (s: Screen) => void;
  onBack: () => void;
}) {
  const verticals = Object.keys(VERTICALS);
  const [activeV, setActiveV] = useState(verticals[0]);
  const [activeComm, setActiveComm] = useState<string | null>(null);
  const [selected, setSelected] = useState<RateItem[]>([]);

  const products = Object.keys(VERTICALS[activeV]?.products || {});
  const byproducts = activeComm
    ? VERTICALS[activeV]?.products[activeComm] || []
    : [];

  const toggleBP = (bp: string) => {
    if (!activeComm) return;
    const item: RateItem = {
      vertical: activeV,
      product: activeComm,
      byproduct: bp,
    };
    const key = `${activeV}|${activeComm}|${bp}`;
    setSelected((prev) =>
      prev.some((p) => `${p.vertical}|${p.product}|${p.byproduct}` === key)
        ? prev.filter(
            (p) => `${p.vertical}|${p.product}|${p.byproduct}` !== key,
          )
        : [...prev, item],
    );
  };

  const isBPSelected = (bp: string) =>
    selected.some(
      (p) =>
        p.vertical === activeV &&
        p.product === activeComm &&
        p.byproduct === bp,
    );

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: "#F1F7F4" }}
    >
      {/* Header */}
      <header
        className="px-4 pt-10 pb-3 flex-shrink-0"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="tap-target w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "#E8EFEC" }}
          >
            <span style={{ fontSize: 20 }}>←</span>
          </button>
          <div className="flex-1">
            <h1
              className="font-extrabold text-xl"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#183B34" }}
            >
              Live Market
            </h1>
            <p
              className="text-xs"
              style={{ color: "#52635F", fontFamily: "'Inter', sans-serif" }}
            >
              {activeComm
                ? `${activeComm} · select byproducts`
                : "Choose a category and product"}
            </p>
          </div>
          {selected.length > 0 && (
            <span
              className="flex items-center justify-center rounded-full font-bold text-white text-xs"
              style={{
                minWidth: 24,
                height: 24,
                background: "#087F63",
                padding: "0 7px",
              }}
            >
              {selected.length}
            </span>
          )}
        </div>
      </header>

      {/* Selected chips */}
      {selected.length > 0 && (
        <ScrollRow
          bg="#E4F2EC"
          style={{ background: "#E4F2EC", borderBottom: "1px solid #C7E8D8" }}
        >
          <span
            className="flex-shrink-0 text-xs font-semibold"
            style={{ color: "#075E4F" }}
          >
            Selected:
          </span>
          {selected.map((s, i) => (
            <button
              key={i}
              onClick={() => setSelected((p) => p.filter((_, j) => j !== i))}
              className="tap-target flex-shrink-0 flex items-center gap-1 rounded-full text-xs font-bold px-3 py-1"
              style={{ background: "#087F63", color: "#fff" }}
            >
              {s.byproduct}
            </button>
          ))}
        </ScrollRow>
      )}

      {/* Vertical tabs */}
      <ScrollRow
        bg="#fff"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        {verticals.map((v) => (
          <button
            key={v}
            onClick={() => {
              setActiveV(v);
              setActiveComm(null);
            }}
            className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-semibold text-xs px-3 py-2"
            style={{
              background: activeV === v ? "#087F63" : "#E8EFEC",
              color: activeV === v ? "#fff" : "#52635F",
              border: activeV === v ? "none" : "1px solid #D5E2DD",
            }}
          >
            <SpriteIcon
              spriteKey={VERTICALS[v]?.icon || "grains"}
              size={16}
              style={{
                flexShrink: 0,
                filter: activeV === v ? "brightness(0) invert(1)" : "none",
              }}
            />
            {v}
          </button>
        ))}
      </ScrollRow>

      {/* product row — if no product selected, show product tiles */}
      {!activeComm ? (
        <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-5 pb-4">
          <p
            className="text-xs font-semibold mb-4"
            style={{ color: "#52635F" }}
          >
            Pick a product to see its byproducts
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-5 justify-start">
            {products.map((c) => (
              <CircleTile
                key={c}
                product={c}
                vertical={activeV}
                alt={c}
                label={c}
                selected={false}
                onPress={() => setActiveComm(c)}
                size={72}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Back to product list + product name */}
          <div
            className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
            style={{ background: "#F1F7F4", borderBottom: "1px solid #D5E2DD" }}
          >
            <button
              onClick={() => setActiveComm(null)}
              className="tap-target flex items-center gap-1 text-xs font-semibold"
              style={{ color: "#087F63" }}
            >
              ← Products
            </button>
            <span style={{ color: "#D5E2DD" }}>|</span>
            <span className="font-bold text-sm" style={{ color: "#183B34" }}>
              {activeComm}
            </span>
          </div>

          {/* Byproduct tiles */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-5 pb-4">
            <div className="flex flex-wrap gap-x-3 gap-y-5 justify-start">
              {byproducts.map((bp) => (
                <CircleTile
                  key={bp}
                  product={bp}
                  vertical={activeV}
                  alt={bp}
                  label={bp}
                  selected={isBPSelected(bp)}
                  onPress={() => toggleBP(bp)}
                  size={72}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer CTA */}
      <div
        className="flex-shrink-0 px-4 pb-6 pt-3"
        style={{ borderTop: "1px solid #D5E2DD", background: "#F4FAF7" }}
      >
        {selected.length > 0 ? (
          <button
            onClick={() =>
              push({ id: "rates-result", items: selected, source: "byproduct" })
            }
            className="tap-target w-full rounded-2xl py-4 font-bold text-white text-base"
            style={{
              background: "#087F63",
              boxShadow: "0 4px 20px rgba(15,138,95,0.3)",
            }}
          >
            Show Rates · {selected.length} By-Product
            {selected.length > 1 ? "s" : ""} →
          </button>
        ) : (
          <div
            className="w-full rounded-2xl py-4 font-semibold text-center text-sm"
            style={{ background: "#D5E2DD", color: "#52635F" }}
          >
            {activeComm
              ? "Tap a byproduct to select"
              : "Choose a product first"}
          </div>
        )}
      </div>
    </div>
  );
}

//  RICH RATE CARD (matches screenshot aesthetic)

const VERTICAL_BG: Record<string, string> = {
  Grains: "#075E4F",
  Fruits: "#B9822E",
  Vegetables: "#087F63",
  Livestock: "#9C4426",
  "Agri Inputs": "#256F8C",
  "Dry Fruits": "#B9822E",
  Herbals: "#2C86A8",
  Kiryana: "#52635F",
};

type RichRow = {
  product: string;
  byproduct: string;
  emoji: string;
  rateType: string;
  arrival: string;
  min: number;
  max: number;
  trend: "up" | "down" | "stable";
  trendPct: number;
  mandiName: string;
  mandiCity: string;
  province: string;
  vertical?: string;
  variety?: string;
  color?: string;
  spec?: string;
  condition?: string;
  newOld?: string;
};

function RateCard({
  r,
  onClick,
  onPriceChipTap,
  onMandiChipTap,
  dateText,
  isToday = true,
}: {
  r: RichRow;
  onClick: () => void;
  onPriceChipTap?: (rateType: string) => void;
  onMandiChipTap?: (mandiName: string) => void;
  dateText?: string;
  isToday?: boolean;
}) {
  const { lang, tc: tcL, tm: tmL, tr: trL } = useLang();
  const vKey =
    r.vertical ||
    Object.entries(VERTICALS).find(([, vd]) => vd.products[r.product])?.[0] ||
    "Grains";
  const bg = VERTICAL_BG[vKey] || "#087F63";

  return (
    <button
      onClick={onClick}
      className={`tap-target w-full h-full rounded-2xl overflow-hidden ${lang === "ur" ? "text-right" : "text-left"}`}
      style={{
        background: "#F4FAF7",
        border: "1.5px solid #D5E2DD",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex h-full">
        {/* Left icon column */}
        <div
          className="flex flex-col items-center justify-center flex-shrink-0"
          style={{
            width: lang === "ur" ? 76 : 64,
            background: "#F4FAF7",
            minHeight: 120,
            borderRight: lang === "ur" ? undefined : "1px solid #D5E2DD",
            borderLeft: lang === "ur" ? "1px solid #D5E2DD" : undefined,
          }}
        >
          <ProductIcon
            name={r.byproduct || vKey}
            vertical={vKey}
            size={lang === "ur" ? 54 : 48}
          />
        </div>
        {/* Main content */}
        <div className="flex-1 p-3 flex flex-col gap-2">
          {/* Row 1: by-product name + trend percentage + today/date badge all in 1 line */}
          <div className="flex items-center justify-between gap-2">
            <p
              className="font-black leading-tight truncate flex-1 min-w-0"
              style={{
                color: "#183B34",
                fontSize: lang === "ur" ? 22 : 18,
                fontWeight: 900,
                letterSpacing: "-0.01em",
                fontFamily:
                  lang === "ur"
                    ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                    : "'Poppins', sans-serif",
              }}
            >
              {tcL(r.byproduct || r.product)}
            </p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <TrendBadge trend={r.trend} pct={r.trendPct} />
              {dateText && (
                <span
                  style={{
                    background: isToday ? "#087F63" : "#52635F",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    borderRadius: 6,
                    padding: "2.5px 7px",
                    letterSpacing: 0.3,
                    whiteSpace: "nowrap",
                    display: "inline-block",
                  }}
                >
                  {dateText}
                </span>
              )}
            </div>
          </div>
          {/* Row 2: arrival */}
          <p
            style={{
              color: "#52635F",
              fontSize: lang === "ur" ? 16 : 12,
              fontFamily:
                lang === "ur"
                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                  : "inherit",
            }}
          >
            <span className="font-bold">
              {lang === "ur" ? "آمد:" : "Arrival:"}
            </span>{" "}
            {r.arrival}
          </p>
          {/* Row 3: Min left, Max pushed to right end */}
          <div className="flex items-end justify-between">
            <div>
              {lang === "ur" ? (
                <>
                  <p
                    className="font-bold leading-tight"
                    style={{
                      color: "#2F4A43",
                      fontSize: 18,
                      fontFamily:
                        "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif",
                    }}
                  >
                    کم سے کم
                  </p>
                  <p
                    className="font-semibold"
                    style={{
                      color: "#52635F",
                      fontSize: 14,
                      fontFamily:
                        "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif",
                      lineHeight: 1.1,
                      marginTop: -2,
                    }}
                  >
                    فی ۴۰ کلو
                  </p>
                </>
              ) : (
                <p
                  className="font-bold uppercase tracking-wide"
                  style={{
                    color: "#52635F",
                    fontSize: 9,
                  }}
                >
                  Min / 40 kg
                </p>
              )}
              <p
                className="font-extrabold mt-0.5"
                style={{
                  color: "#183B34",
                  fontSize: lang === "ur" ? 28 : 18,
                  lineHeight: 1.2,
                }}
              >
                {fmt(r.min)}
              </p>
            </div>
            <div className={lang === "ur" ? "text-left" : "text-right"}>
              {lang === "ur" ? (
                <>
                  <p
                    className="font-bold leading-tight"
                    style={{
                      color: bg,
                      fontSize: 18,
                      fontFamily:
                        "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif",
                    }}
                  >
                    زیادہ سے زیادہ
                  </p>
                  <p
                    className="font-semibold"
                    style={{
                      color: "#52635F",
                      fontSize: 14,
                      fontFamily:
                        "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif",
                      lineHeight: 1.1,
                      marginTop: -2,
                    }}
                  >
                    فی ۴۰ کلو
                  </p>
                </>
              ) : (
                <p
                  className="font-bold uppercase tracking-wide"
                  style={{
                    color: "#52635F",
                    fontSize: 9,
                  }}
                >
                  Max / 40 kg
                </p>
              )}
              <p
                className="font-extrabold mt-0.5"
                style={{
                  color: bg,
                  fontSize: lang === "ur" ? 28 : 18,
                  lineHeight: 1.2,
                }}
              >
                {fmt(r.max)}
              </p>
            </div>
          </div>
          {/* Row 4: Rate type + Mandi chip on one line */}
          <div className="flex items-center gap-2 flex-nowrap overflow-hidden pt-1">
            <div
              role="button"
              tabIndex={0}
              onClick={
                onPriceChipTap
                  ? (e) => {
                      e.stopPropagation();
                      onPriceChipTap(r.rateType);
                    }
                  : undefined
              }
              onKeyDown={
                onPriceChipTap
                  ? (e) => e.key === "Enter" && onPriceChipTap(r.rateType)
                  : undefined
              }
              className={
                onPriceChipTap
                  ? "tap-target font-bold rounded-full flex-shrink-0"
                  : "font-bold rounded-full flex-shrink-0"
              }
              style={{
                background: bg + "22",
                color: bg,
                fontSize: lang === "ur" ? 15 : 11,
                padding: lang === "ur" ? "5px 12px" : "4px 10px",
                cursor: onPriceChipTap ? "pointer" : "default",
                whiteSpace: "nowrap",
                fontFamily:
                  lang === "ur"
                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                    : "inherit",
              }}
            >
              {trL(r.rateType)}
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={
                onMandiChipTap
                  ? (e) => {
                      e.stopPropagation();
                      onMandiChipTap(r.mandiName);
                    }
                  : undefined
              }
              onKeyDown={
                onMandiChipTap
                  ? (e) => e.key === "Enter" && onMandiChipTap(r.mandiName)
                  : undefined
              }
              className={
                onMandiChipTap
                  ? "tap-target flex items-center gap-1 font-semibold rounded-full"
                  : "flex items-center gap-1 font-semibold rounded-full"
              }
              style={{
                background: "#EAF5F1",
                color: "#147D72",
                fontSize: lang === "ur" ? 15 : 11,
                padding: lang === "ur" ? "5px 12px" : "4px 10px",
                border: "1px solid #C8E5DD",
                cursor: onMandiChipTap ? "pointer" : "default",
                maxWidth: 160,
                fontFamily:
                  lang === "ur"
                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                    : "inherit",
              }}
            >
              <span className="truncate">{tmL(r.mandiName)}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

//  RATES RESULT

function RatesResultScreen({
  items,
  source,
  onBack,
}: {
  items: RateItem[];
  source: "product" | "byproduct";
  onBack: () => void;
}) {
  const [selectedMandis, setSelectedMandis] = useState<string[]>([]);
  const [selectedRateTypes, setSelectedRateTypes] = useState<string[]>([]);
  const [mandiSheet, setMandiSheet] = useState(false);
  const [rateSheet, setRateSheet] = useState(false);
  const [msgModal, setMsgModal] = useState<FeedMsg | null>(null);

  //  Spotlight: tap a chip in any row to "focus" on just that value
  // null = show all selected; set = show only rows matching that spotlight
  const [spotproduct, setSpotproduct] = useState<string | null>(null);
  const [spotMandi, setSpotMandi] = useState<string | null>(null);
  const [spotRateType, setSpotRateType] = useState<string | null>(null);

  // unique product labels from items
  const itemproducts = [...new Set(items.map((i) => i.product))];
  // active mandi set — if none selected show all from MANDI_ROWS
  const activeMandis =
    selectedMandis.length > 0
      ? selectedMandis
      : INITIAL_MANDIS.map((m) => m.name);

  const baseRows: RichRow[] = Object.entries(MANDI_ROWS).flatMap(
    ([mandiId, rows]) => {
      const mandi = INITIAL_MANDIS.find((m) => m.id === mandiId);
      if (!mandi) return [];
      if (selectedMandis.length > 0 && !selectedMandis.includes(mandi.name))
        return [];
      return rows
        .filter((r) => {
          const matchItem = items.some(
            (item) =>
              r.product === item.product &&
              (item.byproduct === "" || r.byproduct === item.byproduct),
          );
          const matchRate =
            selectedRateTypes.length === 0 ||
            selectedRateTypes.includes(r.rateType);
          return matchItem && matchRate;
        })
        .map((r) => ({
          ...r,
          mandiName: mandi.name,
          mandiCity: mandi.city,
          province: mandi.province,
          vertical: items.find((i) => i.product === r.product)?.vertical || "",
        }));
    },
  );

  const feedAsFallback: RichRow[] = FEED_MESSAGES.filter((m) => {
    const matchItem = items.some(
      (item) =>
        m.product === item.product &&
        (item.byproduct === "" || m.byproduct === item.byproduct),
    );
    const matchRate =
      selectedRateTypes.length === 0 || selectedRateTypes.includes(m.rateType);
    return matchItem && matchRate;
  }).map((m) => ({
    product: m.product,
    byproduct: m.byproduct,
    emoji: getVerticalIcon(m.vertical),
    rateType: m.rateType,
    arrival: `${m.arrivalCount} ${m.arrivalUnit}`,
    min: m.priceMin,
    max: m.priceMax,
    trend: m.trend || "stable",
    trendPct: m.trendPct || 0,
    mandiName: m.station,
    mandiCity: m.station,
    province: m.province,
    vertical: m.vertical,
  }));

  const sourceRows = baseRows.length > 0 ? baseRows : feedAsFallback;

  // Apply spotlight filters on top
  const displayed = sourceRows.filter((r) => {
    if (spotproduct && r.product !== spotproduct) return false;
    if (spotMandi && r.mandiName !== spotMandi) return false;
    if (spotRateType && r.rateType !== spotRateType) return false;
    return true;
  });

  const rowToMsg = (r: RichRow): FeedMsg => {
    const ex = FEED_MESSAGES.find(
      (m) => m.product === r.product && m.station === r.mandiName,
    );
    if (ex) return ex;
    return {
      id: Date.now(),
      time: "Today",
      vertical: r.vertical || "Grains",
      productUrdu: r.product,
      product: r.product,
      byproduct: r.byproduct,
      stationUrdu: r.mandiCity,
      station: r.mandiName,
      province: r.province,
      priceMin: r.min,
      priceMax: r.max,
      unit: "40 kg",
      arrivalCount: r.arrival,
      arrivalUnit: "",
      arrivalUnitUrdu: "",
      colorUrdu: "سفید",
      color: "White",
      rateType: r.rateType,
      specUrdu: "خشک",
      spec: "Dry",
      qualityUrdu: "نئی",
      quality: "New",
      qualityTypeUrdu: "تجارتی",
      qualityType: "Trade",
      trend: r.trend,
      trendPct: r.trendPct,
    };
  };

  const anySpotlight = !!(spotproduct || spotMandi || spotRateType);

  // Distinct values available in base rows for spotlight
  const availRateTypes = [...new Set(sourceRows.map((r) => r.rateType))];

  // SpotChip: tap = spotlight, tap again = deselect spotlight
  function SpotChip({
    label,
    active,
    color,
    onToggle,
  }: {
    label: string;
    active: boolean;
    color: string;
    onToggle: () => void;
  }) {
    return (
      <button
        onClick={onToggle}
        className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-bold"
        style={{
          padding: "9px 15px",
          fontSize: 13,
          background: active ? color : "#fff",
          color: active ? "#fff" : color,
          border: `1.5px solid ${color}`,
          transition: "all 0.15s",
        }}
      >
        {label}
        {active && <span style={{ fontSize: 11, opacity: 0.75 }}></span>}
      </button>
    );
  }

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: "#F1F7F4" }}
    >
      {/*  Header  */}
      <div
        className="flex-shrink-0"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        {/* Title bar */}
        <div className="px-4 pt-10 pb-2 flex items-center gap-3">
          <button
            onClick={onBack}
            className="tap-target w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: "#E8EFEC" }}
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="font-extrabold text-xl">Rates</h1>
            <p className="text-xs" style={{ color: "#52635F" }}>
              {displayed.length} results · tap a chip to compare
            </p>
          </div>
          {anySpotlight && (
            <button
              onClick={() => {
                setSpotproduct(null);
                setSpotMandi(null);
                setSpotRateType(null);
              }}
              className="tap-target flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: "#F9E1DE",
                color: "#A83B37",
                border: "1.5px solid #E7AAA4",
              }}
            >
              ↺ Show All
            </button>
          )}
        </div>

        {/*  Picker row (Row 1): always visible — add/change Mandi & Price Type  */}
        <div
          className="flex gap-2 px-4 pb-2 pt-1"
          style={{ borderTop: "1px solid #E8EFEC" }}
        >
          <button
            onClick={() => setMandiSheet(true)}
            className="tap-target flex-1 flex items-center justify-center gap-1.5 rounded-2xl font-bold text-xs"
            style={{
              height: 38,
              background: selectedMandis.length > 0 ? "#147D72" : "#EAF5F1",
              color: selectedMandis.length > 0 ? "#fff" : "#147D72",
              border: "1.5px solid #C8E5DD",
            }}
          >
            {selectedMandis.length === 0
              ? "All Mandis"
              : selectedMandis.length === 1
                ? selectedMandis[0]
                : `${selectedMandis.length} Mandis`}

            {selectedMandis.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMandis([]);
                  setSpotMandi(null);
                }}
                style={{ opacity: 0.7, marginLeft: 2 }}
              ></button>
            )}
          </button>
          <button
            onClick={() => setRateSheet(true)}
            className="tap-target flex-1 flex items-center justify-center gap-1.5 rounded-2xl font-bold text-xs"
            style={{
              height: 38,
              background: selectedRateTypes.length > 0 ? "#168A76" : "#EAF5F1",
              color: selectedRateTypes.length > 0 ? "#fff" : "#168A76",
              border: "1.5px solid #C8E3DA",
            }}
          >
            {selectedRateTypes.length === 0
              ? "All Price Types"
              : selectedRateTypes.length === 1
                ? selectedRateTypes[0]
                : `${selectedRateTypes.length} Types`}

            {selectedRateTypes.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRateTypes([]);
                  setSpotRateType(null);
                }}
                style={{ opacity: 0.7, marginLeft: 2 }}
              ></button>
            )}
          </button>
        </div>

        {/*  Row 2: Items — always shown, each chip spotlights  */}
        <ScrollRow bg="#fff" style={{ borderTop: "1px solid #EFF8F3" }}>
          <span
            className="flex-shrink-0 text-[11px] font-extrabold uppercase tracking-wider"
            style={{ color: "#52635F", minWidth: 30 }}
          >
            Item
          </span>
          {itemproducts.map((c) => {
            const v = items.find((i) => i.product === c)?.vertical || "";
            const bps = items.filter((i) => i.product === c && i.byproduct);
            return bps.length > 0 ? (
              bps.map((bp) => (
                <SpotChip
                  key={`${c}-${bp.byproduct}`}
                  label={bp.byproduct}
                  active={spotproduct === c}
                  color="#087F63"
                  onToggle={() => setSpotproduct((p) => (p === c ? null : c))}
                />
              ))
            ) : (
              <SpotChip
                key={c}
                label={c}
                active={spotproduct === c}
                color="#087F63"
                onToggle={() => setSpotproduct((p) => (p === c ? null : c))}
              />
            );
          })}
        </ScrollRow>

        {/*  Row 3: Mandis — shown when mandis are selected  */}
        {selectedMandis.length > 0 && (
          <ScrollRow bg="#EAF5F1" style={{ borderTop: "1px solid #EAF5F1" }}>
            <span
              className="flex-shrink-0 text-[11px] font-extrabold uppercase tracking-wider"
              style={{ color: "#52635F", minWidth: 38 }}
            >
              Mandi
            </span>
            {selectedMandis.map((m) => (
              <SpotChip
                key={m}
                label={m}
                active={spotMandi === m}
                color="#147D72"
                onToggle={() => setSpotMandi((p) => (p === m ? null : m))}
              />
            ))}
          </ScrollRow>
        )}

        {/*  Row 4: Price Types — shown when price types are selected  */}
        {selectedRateTypes.length > 0 && (
          <ScrollRow bg="#EAF5F1" style={{ borderTop: "1px solid #EAF5F1" }}>
            <span
              className="flex-shrink-0 text-[11px] font-extrabold uppercase tracking-wider"
              style={{ color: "#52635F", minWidth: 36 }}
            >
              Price
            </span>
            {selectedRateTypes.map((rt) => (
              <SpotChip
                key={rt}
                label={rt}
                active={spotRateType === rt}
                color="#168A76"
                onToggle={() => setSpotRateType((p) => (p === rt ? null : rt))}
              />
            ))}
          </ScrollRow>
        )}
      </div>

      {/*  Results  */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
        <div className="flex flex-col gap-3">
          {displayed.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 opacity-50">
              <span style={{ fontSize: 48 }}></span>
              <p className="font-semibold mt-2">
                No results for this combination
              </p>
              <button
                onClick={() => {
                  setSpotproduct(null);
                  setSpotMandi(null);
                  setSpotRateType(null);
                }}
                className="tap-target mt-3 px-4 py-2 rounded-2xl text-sm font-bold"
                style={{ background: "#087F63", color: "#fff" }}
              >
                Show All
              </button>
            </div>
          )}
          {displayed.map((r, i) => (
            <RateCard key={i} r={r} onClick={() => setMsgModal(rowToMsg(r))} />
          ))}
        </div>
      </div>

      {mandiSheet && (
        <MandiPickerSheet
          selected={selectedMandis}
          onApply={(s) => {
            setSelectedMandis(s);
            setSpotMandi(null);
          }}
          onClose={() => setMandiSheet(false)}
        />
      )}
      {rateSheet && (
        <PriceTypeSheet
          selected={selectedRateTypes}
          onApply={(s) => {
            setSelectedRateTypes(s);
            setSpotRateType(null);
          }}
          onClose={() => setRateSheet(false)}
        />
      )}
      {msgModal && (
        <ZMMessageModal msg={msgModal} onClose={() => setMsgModal(null)} />
      )}
    </div>
  );
}

//  product RATES

//  HISTORICAL DATA REQUEST SHEET

function HistoricalRequestSheet({
  subject,
  onClose,
}: {
  subject: string;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="zm-sheet-overlay" style={{ zIndex: 200 }} onClick={onClose}>
      <div
        className="zm-sheet"
        style={{ background: "#F4FAF7", maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 border-b border-[#DCE8E3] flex items-center justify-between">
          <div>
            <p className="font-bold text-base">Request Historical Data</p>
            <p className="text-xs" style={{ color: "#52635F" }}>
              Our team will send it to you
            </p>
          </div>
          <button
            onClick={onClose}
            className="tap-target text-xl w-8"
            style={{ color: "#52635F" }}
          ></button>
        </div>
        {sent ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <span style={{ fontSize: 52 }}></span>
            <p className="font-bold text-lg" style={{ color: "#075E4F" }}>
              Request sent
            </p>
            <p className="text-sm" style={{ color: "#52635F" }}>
              Our sales team will get back to you with the data you asked for.
            </p>
            <button
              onClick={onClose}
              className="tap-target mt-2 rounded-2xl px-6 py-3 font-bold text-white"
              style={{ background: "#087F63" }}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-3">
            <p className="text-sm font-semibold" style={{ color: "#183B34" }}>
              What would you like to know?
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder={`e.g. "Show me ${subject} rates for Lahore for the last 6 months"`}
              className="w-full rounded-2xl p-4 text-sm outline-none"
              style={{
                background: "#F1F7F4",
                border: "1.5px solid #D5E2DD",
                resize: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setText(
                    (t) =>
                      t || `Show me ${subject} rates for the last 6 months`,
                  )
                }
                className="tap-target flex-shrink-0 rounded-2xl px-4 py-3 font-bold text-sm flex items-center gap-2"
                style={{
                  background: "#E4F2EC",
                  color: "#075E4F",
                  border: "1px solid #C7E8D8",
                }}
              >
                Speak
              </button>
              <button
                onClick={() => setSent(true)}
                disabled={!text.trim()}
                className="tap-target flex-1 rounded-2xl py-3 font-bold text-white text-sm"
                style={{
                  background: text.trim() ? "#087F63" : "#C7D6D0",
                  boxShadow: text.trim()
                    ? "0 4px 16px rgba(15,138,95,0.25)"
                    : "none",
                }}
              >
                Send Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

//  DEEP VIEW LOCATION SHEET

function DeepViewLocationSheet({
  current,
  onSelect,
  onClose,
  validMandis,
}: {
  current: LocationScope;
  onSelect: (scope: LocationScope) => void;
  onClose: () => void;
  validMandis?: string[];
}) {
  const { tm } = useLang();
  const USER_DISTRICT = "Sahiwal";
  const USER_PROVINCE = "Punjab";

  type Level = "province" | "district" | "mandi";
  const [level, setLevel] = useState<Level>("province");
  const [province, setProvince] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const provinces = Object.keys(LOCATIONS);
  const districts = province ? Object.keys(LOCATIONS[province] || {}) : [];
  const allMandis =
    province && district ? LOCATIONS[province]?.[district] || [] : [];
  // If validMandis provided, only show mandis that have data
  const mandis = validMandis
    ? allMandis.filter((m) => validMandis.includes(m))
    : allMandis;

  // Flat search results across all levels
  const searchResults = useMemo(() => {
    if (search.length < 2) return [];
    const q = search.toLowerCase();
    const out: { kind: LocationScope["kind"]; label: string; hint: string }[] =
      [];
    provinces.forEach((p) => {
      if (p.toLowerCase().includes(q))
        out.push({ kind: "province", label: p, hint: "Province" });
      Object.keys(LOCATIONS[p] || {}).forEach((d) => {
        if (d.toLowerCase().includes(q))
          out.push({ kind: "district", label: d, hint: `${p}` });
        (LOCATIONS[p]?.[d] || []).forEach((m) => {
          if (m.toLowerCase().includes(q)) {
            if (!validMandis || validMandis.includes(m))
              out.push({ kind: "mandi", label: m, hint: `${p} › ${d}` });
          }
        });
      });
    });
    return out.slice(0, 12);
  }, [search, validMandis]);

  const goBack = () => {
    if (level === "mandi") {
      setLevel("district");
      return;
    }
    if (level === "district") {
      setLevel("province");
      setDistrict(null);
      return;
    }
    onClose();
  };

  const breadcrumb =
    level === "province"
      ? ""
      : level === "district"
        ? province || ""
        : `${province} › ${district}`;

  return (
    <div className="zm-sheet-overlay" style={{ zIndex: 200 }} onClick={onClose}>
      <div
        className="zm-sheet-high"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div
          className="px-5 pt-4 pb-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #D5E2DD" }}
        >
          <div className="zm-drag-handle" />
          <div className="flex items-center gap-2 mb-3">
            {level !== "province" && (
              <button
                onClick={goBack}
                className="tap-target w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#E8EFEC" }}
              >
                ←
              </button>
            )}
            <div className="flex-1">
              <p className="font-bold text-lg">Select Location</p>
              {breadcrumb && (
                <p className="text-xs" style={{ color: "#52635F" }}>
                  {breadcrumb}
                </p>
              )}
            </div>
          </div>
          {/* Quick-select options */}
          {level === "province" && (
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onSelect({ kind: "district", label: USER_DISTRICT })
                  }
                  className="tap-target flex-1 rounded-2xl flex items-center gap-2 px-3"
                  style={{
                    height: 48,
                    background:
                      current.kind === "district" &&
                      current.label === USER_DISTRICT
                        ? "#E4F2EC"
                        : "#F1F7F4",
                    border:
                      current.kind === "district" &&
                      current.label === USER_DISTRICT
                        ? "2px solid #087F63"
                        : "1px solid #D5E2DD",
                  }}
                >
                  <span style={{ fontSize: 18 }}></span>
                  <div className="text-left">
                    <p
                      className="font-bold text-xs"
                      style={{ color: "#075E4F" }}
                    >
                      My District
                    </p>
                    <p className="text-[10px]" style={{ color: "#52635F" }}>
                      {USER_DISTRICT}
                    </p>
                  </div>
                  {current.kind === "district" &&
                    current.label === USER_DISTRICT && (
                      <span
                        className="ml-auto"
                        style={{ color: "#087F63" }}
                      ></span>
                    )}
                </button>
                <button
                  onClick={() =>
                    onSelect({ kind: "province", label: USER_PROVINCE })
                  }
                  className="tap-target flex-1 rounded-2xl flex items-center gap-2 px-3"
                  style={{
                    height: 48,
                    background:
                      current.kind === "province" &&
                      current.label === USER_PROVINCE
                        ? "#E4F2EC"
                        : "#F1F7F4",
                    border:
                      current.kind === "province" &&
                      current.label === USER_PROVINCE
                        ? "2px solid #087F63"
                        : "1px solid #D5E2DD",
                  }}
                >
                  <span style={{ fontSize: 18 }}></span>
                  <div className="text-left">
                    <p
                      className="font-bold text-xs"
                      style={{ color: "#075E4F" }}
                    >
                      My Province
                    </p>
                    <p className="text-[10px]" style={{ color: "#52635F" }}>
                      {USER_PROVINCE}
                    </p>
                  </div>
                  {current.kind === "province" &&
                    current.label === USER_PROVINCE && (
                      <span
                        className="ml-auto"
                        style={{ color: "#087F63" }}
                      ></span>
                    )}
                </button>
              </div>
              <button
                onClick={() => {
                  onSelect({ kind: "pakistan", label: "All Pakistan" });
                  onClose();
                }}
                className="tap-target w-full rounded-2xl flex items-center justify-center gap-2"
                style={{
                  height: 44,
                  background:
                    current.kind === "pakistan" ? "#E4F2EC" : "#F1F7F4",
                  border:
                    current.kind === "pakistan"
                      ? "2px solid #087F63"
                      : "1px solid #D5E2DD",
                }}
              >
                <span style={{ fontSize: 18 }}></span>
                <span
                  className="font-bold text-sm"
                  style={{ color: "#075E4F" }}
                >
                  All Pakistan
                </span>
                {current.kind === "pakistan" && (
                  <span style={{ color: "#087F63" }}></span>
                )}
              </button>
            </div>
          )}
          {/* Search */}
          <div
            className="flex items-center gap-2 rounded-2xl px-3"
            style={{ background: "#E8EFEC", height: 40 }}
          >
            <span style={{ fontSize: 14, opacity: 0.5 }}></span>
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Search province, district or mandi…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ color: "#183B34" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="tap-target"
                style={{ fontSize: 14, opacity: 0.5 }}
              ></button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {/* Search results */}
          {search.length >= 2 ? (
            searchResults.length === 0 ? (
              <div
                className="p-6 text-center text-sm"
                style={{ color: "#80918B" }}
              >
                No results for "{search}"
              </div>
            ) : (
              searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelect({ kind: r.kind, label: r.label });
                    onClose();
                  }}
                  className="tap-target w-full flex items-center gap-3 px-5 py-3.5 text-left"
                  style={{ borderBottom: "1px solid #E8EFEC" }}
                >
                  <span style={{ fontSize: 16 }}>
                    {r.kind === "province"
                      ? ""
                      : r.kind === "district"
                        ? ""
                        : ""}
                  </span>
                  <div className="flex-1">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "#183B34" }}
                    >
                      {r.label}
                    </p>
                    <p className="text-[10px]" style={{ color: "#80918B" }}>
                      {r.hint}
                    </p>
                  </div>
                  {current.kind === r.kind && current.label === r.label && (
                    <span style={{ color: "#087F63" }}></span>
                  )}
                </button>
              ))
            )
          ) : level === "province" ? (
            <>
              <div className="px-5 pt-3 pb-1">
                <p
                  className="text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ color: "#80918B" }}
                >
                  All Provinces
                </p>
              </div>
              {provinces.map((p) => {
                const on = current.kind === "province" && current.label === p;
                return (
                  <button
                    key={p}
                    onClick={() => {
                      setProvince(p);
                      setLevel("district");
                    }}
                    className="tap-target w-full flex items-center gap-3 px-5 py-4 text-left"
                    style={{
                      borderBottom: "1px solid #E8EFEC",
                      background: on ? "#E4F2EC" : "transparent",
                    }}
                  >
                    <span
                      className="flex-1 font-semibold text-base"
                      style={{ color: on ? "#075E4F" : "#183B34" }}
                    >
                      {p}
                    </span>
                    <span style={{ color: "#80918B", fontSize: 18 }}>›</span>
                  </button>
                );
              })}
            </>
          ) : level === "district" ? (
            <>
              {province && (
                <button
                  onClick={() => {
                    onSelect({ kind: "province", label: province });
                    onClose();
                  }}
                  className="tap-target w-full flex items-center gap-2 px-5 py-3 text-left"
                  style={{
                    background:
                      current.kind === "province" && current.label === province
                        ? "#E4F2EC"
                        : "#F1F7F4",
                    borderBottom: "1px solid #D5E2DD",
                  }}
                >
                  <span style={{ fontSize: 16 }}></span>
                  <span
                    className="font-bold text-sm"
                    style={{ color: "#075E4F" }}
                  >
                    All of {tm(province || "")}
                  </span>
                  {current.kind === "province" &&
                    current.label === province && (
                      <span
                        className="ml-auto"
                        style={{ color: "#087F63" }}
                      ></span>
                    )}
                </button>
              )}
              {districts.map((d) => {
                const on = current.kind === "district" && current.label === d;
                return (
                  <button
                    key={d}
                    onClick={() => {
                      setDistrict(d);
                      setLevel("mandi");
                    }}
                    className="tap-target w-full flex items-center gap-3 px-5 py-4 text-left"
                    style={{
                      borderBottom: "1px solid #E8EFEC",
                      background: on ? "#EAF5F1" : "transparent",
                    }}
                  >
                    <span
                      className="flex-1 font-semibold text-sm"
                      style={{ color: on ? "#147D72" : "#183B34" }}
                    >
                      {d}
                    </span>
                    <span style={{ color: "#80918B", fontSize: 18 }}>›</span>
                  </button>
                );
              })}
            </>
          ) : (
            <>
              {district && (
                <button
                  onClick={() => {
                    onSelect({ kind: "district", label: district });
                    onClose();
                  }}
                  className="tap-target w-full flex items-center gap-2 px-5 py-3 text-left"
                  style={{
                    background:
                      current.kind === "district" && current.label === district
                        ? "#EAF5F1"
                        : "#F1F7F4",
                    borderBottom: "1px solid #D5E2DD",
                  }}
                >
                  <span style={{ fontSize: 16 }}></span>
                  <span
                    className="font-bold text-sm"
                    style={{ color: "#147D72" }}
                  >
                    All of {tm(district || "")} District
                  </span>
                  {current.kind === "district" &&
                    current.label === district && (
                      <span
                        className="ml-auto"
                        style={{ color: "#147D72" }}
                      ></span>
                    )}
                </button>
              )}
              {mandis.map((m) => {
                const on = current.kind === "mandi" && current.label === m;
                return (
                  <button
                    key={m}
                    onClick={() => {
                      onSelect({ kind: "mandi", label: m });
                      onClose();
                    }}
                    className="tap-target w-full flex items-center gap-3 px-5 py-4 text-left"
                    style={{
                      borderBottom: "1px solid #E8EFEC",
                      background: on ? "#EAF5F1" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: 16 }}></span>
                    <span
                      className="flex-1 font-semibold text-sm"
                      style={{ color: on ? "#168A76" : "#183B34" }}
                    >
                      {m}
                    </span>
                    {on && <span style={{ color: "#168A76" }}></span>}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

//  BY PRODUCT DETAIL (Overview | Trends)

// Geo-aggregated comparison row type
type CompRow = {
  key: string;
  rateType: string;
  min: number;
  max: number;
  arrival: string;
  trend: "up" | "down" | "stable";
  trendPct: number;
};

function ProductRatesScreen({
  vertical,
  product,
  byproduct,
  onBack,
  push,
  isPickedBP,
  togglePickBP,
  locationScope: initialScope,
  onOpenLocation,
  initialRateType,
  initialMandi,
  initialVariety,
  initialNewOld,
  initialColor,
  initialSpec,
  initialCondition,
  initialStatDate,
}: {
  vertical: string;
  product: string;
  byproduct: string;
  onBack: () => void;
  push?: (s: Screen) => void;
  isPickedBP: (item: RateItem) => boolean;
  togglePickBP: (item: RateItem) => void;
  locationScope: LocationScope;
  onOpenLocation: () => void;
  initialRateType?: string;
  initialMandi?: string;
  initialVariety?: string;
  initialNewOld?: string;
  initialColor?: string;
  initialSpec?: string;
  initialCondition?: string;
  initialStatDate?: string;
}) {
  const { lang, t, tc, tm, tr, voiceEnabled } = useLang();
  const [tab, setTab] = useState<"overview" | "trends">("overview");
  const [msgModal, setMsgModal] = useState<FeedMsg | null>(null);
  const [activeTypes, setActiveTypes] = useState<string[]>(
    initialRateType ? [initialRateType] : ["Retail"],
  );
  const [trendMode, setTrendMode] = useState<"price" | "arrival">("price");
  const [range, setRange] = useState<"week" | "month" | "quarter">("week");
  const [histOpen, setHistOpen] = useState(false);
  // Local location scope — starts from initialMandi if provided, else from parent
  const [locScope, setLocScope] = useState<LocationScope>(
    initialMandi ? { kind: "mandi", label: initialMandi } : initialScope,
  );
  const [locSheet, setLocSheet] = useState(false);
  // Date filter
  const [dateMode, setDateMode] = useState<"today" | "date" | "range">("today");
  const [dateSheet, setDateSheet] = useState(false);
  // Geographic view for comparison table
  const [geoView, setGeoView] = useState<
    "mandi" | "district" | "province" | "pakistan"
  >("mandi");
  // Rate type filter for table (empty = all)
  const [tableRateTypes, setTableRateTypes] = useState<string[]>([]);
  // Chart hover state
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [arrivalHoverIdx, setArrivalHoverIdx] = useState<number | null>(null);
  // Attribute filters — pre-filled from card when entering from by-product screen
  const [attrVariety, setAttrVariety] = useState<string | null>(
    initialVariety || null,
  );
  const [attrNewOld, setAttrNewOld] = useState<string | null>(
    initialNewOld || null,
  );
  const [attrColor, setAttrColor] = useState<string | null>(
    initialColor || null,
  );
  const [attrSpec, setAttrSpec] = useState<string | null>(initialSpec || null);
  const [attrCondition, setAttrCondition] = useState<string | null>(
    initialCondition || null,
  );
  const [attrRateType, setAttrRateType] = useState<string | null>(
    initialRateType || null,
  );
  const [attrSheet, setAttrSheet] = useState<
    "variety" | "newold" | "color" | "spec" | "condition" | "ratetype" | null
  >(null);
  // Overview stat date filter — pre-filled when navigating from a historical card
  const [statDateFilter, setStatDateFilter] = useState<Date | null>(
    initialStatDate ? new Date(initialStatDate) : null,
  );
  const [statDateCalOpen, setStatDateCalOpen] = useState(false);
  const [statDateCalMonth, setStatDateCalMonth] = useState<Date>(
    initialStatDate ? new Date(initialStatDate) : new Date(2026, 7, 21),
  );
  // Mandi table province + date filter
  const [tableProvinceFilter, setTableProvinceFilter] = useState<string | null>(
    null,
  );
  const [tableDateFilter, setTableDateFilter] = useState<Date | null>(null);
  const [tableDateCalOpen, setTableDateCalOpen] = useState(false);
  const [tableDateCalMonth, setTableDateCalMonth] = useState<Date>(
    new Date(2026, 7, 21),
  );
  // Date table + its filters
  const [dateTableOpen, setDateTableOpen] = useState(false);
  const [dtSelDate, setDtSelDate] = useState<Date>(new Date());
  const [dtCalMonth, setDtCalMonth] = useState<Date>(new Date());
  const [dtCalOpen, setDtCalOpen] = useState(false);
  const [dtQuality, setDtQuality] = useState<string | null>(null);
  const [dtPriceType, setDtPriceType] = useState<string | null>(null);
  const [dtSpec, setDtSpec] = useState<string | null>(null);
  const [dtCondition, setDtCondition] = useState<string | null>(null);
  const [dtOpenCol, setDtOpenCol] = useState<string | null>(null);

  const title = byproduct || product;
  const pickItem: RateItem = {
    vertical,
    product,
    byproduct: byproduct || product,
  };
  const picked = isPickedBP(pickItem);

  const allRows = useMemo(
    () =>
      Object.entries(MANDI_ROWS).flatMap(([mandiId, rows]) => {
        const mandi = INITIAL_MANDIS.find((m) => m.id === mandiId);
        return rows
          .filter(
            (r) =>
              r.product === product &&
              (!byproduct || r.byproduct === byproduct),
          )
          .map((r) => ({
            ...r,
            mandiName: mandi?.name || mandiId,
            mandiCity: mandi?.city || mandiId,
            province: mandi?.province || "Punjab",
          }));
      }),
    [product, byproduct],
  );

  const inLocScope = (r: (typeof allRows)[0]) => {
    switch (locScope.kind) {
      case "pakistan":
        return true;
      case "province":
        return r.province === locScope.label;
      case "district":
        return (
          r.mandiCity === locScope.label || r.mandiName.includes(locScope.label)
        );
      case "mandi":
        return r.mandiName === locScope.label || r.mandiCity === locScope.label;
      default:
        return true;
    }
  };
  const scopedRows = allRows.filter(inLocScope);
  const rows = (scopedRows.length > 0 ? scopedRows : allRows).filter(
    (r) => !attrRateType || r.rateType === attrRateType,
  );

  const parseArrival = (a: string) =>
    parseInt(String(a).replace(/[^0-9]/g, "")) || 0;

  // Attribute adjustment multipliers applied to min/max display
  const attrMultiplier = computeAttrMult(
    attrVariety,
    attrColor,
    attrNewOld,
    attrSpec,
    attrCondition,
  );

  // Date variation for overview stats
  const STAT_BASE_DATE = new Date(2026, 7, 21);
  const statDateVariation = statDateFilter
    ? Math.max(
        0.88,
        1 -
          Math.round(
            Math.abs(STAT_BASE_DATE.getTime() - statDateFilter.getTime()) /
              86400000,
          ) *
            0.012,
      )
    : 1;

  const baseMax = rows.length ? Math.max(...rows.map((r) => r.max)) : 0;
  const baseMin = rows.length ? Math.min(...rows.map((r) => r.min)) : 0;
  const statMax = Math.round(baseMax * attrMultiplier * statDateVariation);
  const statMin = Math.round(baseMin * attrMultiplier * statDateVariation);
  const statArrival = Math.round(
    rows.reduce((s, r) => s + parseArrival(r.arrival), 0) * statDateVariation,
  );
  const statMandis = new Set(rows.map((r) => r.mandiName)).size;

  // Build comparison rows by geoView
  const compRows = useMemo((): CompRow[] => {
    type R = (typeof allRows)[0];
    const src: R[] =
      tableRateTypes.length > 0
        ? rows.filter((r) => tableRateTypes.includes(r.rateType))
        : rows;
    const agg = (grp: R[]) => ({
      min: Math.min(...grp.map((r) => r.min)),
      max: Math.max(...grp.map((r) => r.max)),
      arrival:
        grp.reduce((s, r) => s + parseArrival(r.arrival), 0).toLocaleString() +
        " MT",
      trend: grp[0].trend,
      trendPct: grp[0].trendPct,
    });
    const groupBy = (arr: R[], keyFn: (r: R) => string) => {
      const map = new Map<string, R[]>();
      arr.forEach((r) => {
        const k = keyFn(r);
        map.set(k, [...(map.get(k) || []), r]);
      });
      return map;
    };
    const byRateType = (grp: R[]) => [
      ...groupBy(grp, (r) => r.rateType).entries(),
    ];
    if (geoView === "mandi")
      return src.map((r) => ({
        key: r.mandiName,
        rateType: r.rateType,
        ...agg([r]),
      }));
    if (geoView === "district") {
      return [...groupBy(src, (r) => r.mandiCity).entries()].flatMap(
        ([city, grp]) =>
          byRateType(grp).map(([rt, rg]) => ({
            key: city,
            rateType: rt,
            ...agg(rg),
          })),
      );
    }
    if (geoView === "province") {
      return [...groupBy(src, (r) => r.province).entries()].flatMap(
        ([prov, grp]) =>
          byRateType(grp).map(([rt, rg]) => ({
            key: prov,
            rateType: rt,
            ...agg(rg),
          })),
      );
    }
    return byRateType(src).map(([rt, rg]) => ({
      key: "Pakistan",
      rateType: rt,
      ...agg(rg),
    }));
  }, [rows, geoView, tableRateTypes]);

  const rowToMsg = (r: (typeof allRows)[0]): FeedMsg => {
    const ex = FEED_MESSAGES.find(
      (m) => m.product === r.product && m.station === r.mandiName,
    );
    if (ex) return ex;
    return {
      id: Date.now(),
      time: "Today",
      vertical,
      productUrdu: product,
      product,
      byproduct: r.byproduct,
      stationUrdu: r.mandiCity,
      station: r.mandiName,
      province: r.province,
      priceMin: r.min,
      priceMax: r.max,
      unit: "40 kg",
      arrivalCount: r.arrival,
      arrivalUnit: "Bags",
      arrivalUnitUrdu: "تھیلے",
      colorUrdu: "سفید",
      color: "White",
      rateType: r.rateType,
      specUrdu: "خشک",
      spec: "Dry",
      qualityUrdu: "نئی",
      quality: "New",
      qualityTypeUrdu: "تجارتی",
      qualityType: "Trade",
      trend: r.trend,
      trendPct: r.trendPct,
    };
  };

  // Chart data
  const len = range === "week" ? 7 : range === "month" ? 30 : 90;
  const base = rows[0]?.min || allRows[0]?.min || 2850;
  const priceSeries = useMemo(
    () =>
      ALL_RATE_TYPES.map((rt) => ({
        label: rt,
        color: RATE_COLORS[rt],
        data: genPts(base * (RATE_MULTS[rt] || 1), len, 0.025),
      })),
    [base, len, product, byproduct, locScope.label],
  );
  const arrivalBase = Math.max(statArrival / Math.max(statMandis, 1), 400);
  const arrivalData = useMemo(
    () => genPts(arrivalBase, len, 0.06),
    [arrivalBase, len, product, byproduct, locScope.label],
  );
  const shownSeries = priceSeries.filter((s) => activeTypes.includes(s.label));
  const toggleType = (tKey: string) =>
    setActiveTypes((p) =>
      p.includes(tKey) ? p.filter((x) => x !== tKey) : [...p, tKey],
    );

  // X-axis date labels
  const today = new Date(2026, 7, 17); // Aug 17 2026
  const xLabels = useMemo(() => {
    const labels: string[] = [];
    const urDays = ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"];
    const enDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = len - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (range === "week")
        labels.push(lang === "ur" ? urDays[d.getDay()] : enDays[d.getDay()]);
      else if (range === "month")
        labels.push(i % 7 === 0 ? `${d.getDate()}/${d.getMonth() + 1}` : "");
      else
        labels.push(i % 15 === 0 ? `${d.getDate()}/${d.getMonth() + 1}` : "");
    }
    return labels;
  }, [len, range, lang]);

  // Chart SVG helpers
  const CH = 300,
    CW = 320,
    PL = 54,
    PR = 12,
    PT = 20,
    PB = 44;
  const chartW = CW - PL - PR;
  const chartH = CH - PT - PB;

  const xOf = (i: number, total: number) => PL + (i / (total - 1)) * chartW;
  const yOf = (v: number, mn: number, mx: number) =>
    PT + ((mx - v) / (mx - mn || 1)) * chartH;

  const priceFlat = shownSeries.flatMap((s) => s.data);
  const pMin = priceFlat.length ? Math.min(...priceFlat) : 0;
  const pMax = priceFlat.length ? Math.max(...priceFlat) : 1;
  const aMin = Math.min(...arrivalData);
  const aMax = Math.max(...arrivalData);

  const yPriceTicks = [pMin, (pMin + pMax) / 2, pMax].map((v) => Math.round(v));
  const yArrivalTicks = [aMin, (aMin + aMax) / 2, aMax].map((v) =>
    Math.round(v),
  );

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: "#F1F7F4" }}
    >
      {/*  Header  */}
      <header
        className="flex-shrink-0"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        <div
          className="px-4 pb-2 flex items-center gap-3"
          style={{ paddingTop: "max(52px, env(safe-area-inset-top, 52px))" }}
        >
          <button
            onClick={onBack}
            className="tap-target flex-shrink-0 flex items-center justify-center rounded-2xl font-bold text-sm"
            style={{
              width: 44,
              height: 44,
              background: "#E8EFEC",
              color: "#183B34",
              fontSize: 18,
            }}
          >
            {lang === "ur" ? "→" : "←"}
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <ProductIcon
              name={byproduct || product}
              vertical={vertical}
              size={36}
            />
            <div className="min-w-0">
              <h1
                className="font-extrabold truncate leading-tight"
                style={{
                  fontSize: lang === "ur" ? 22 : 20,
                  fontFamily:
                    lang === "ur"
                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                      : "inherit",
                  color: "#183B34",
                }}
              >
                {tc(title)}
              </h1>
            </div>
          </div>
          <button
            onClick={() => togglePickBP(pickItem)}
            className="tap-target w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              fontSize: 20,
              background: picked ? "#087F63" : "#E8EFEC",
              color: picked ? "#fff" : "#B9822E",
            }}
          >
            {picked ? "★" : "☆"}
          </button>
        </div>
        <div className="px-4 pb-2 flex gap-1.5">
          {(
            [
              ["overview", lang === "ur" ? "جائزہ" : "Overview"],
              ["trends", lang === "ur" ? "رجحانات" : "Trends"],
            ] as ["overview" | "trends", string][]
          ).map(([tTab, label]) => (
            <button
              key={tTab}
              onClick={() => setTab(tTab)}
              className="tap-target flex-1 rounded-xl font-bold text-sm"
              style={{
                height: lang === "ur" ? 44 : 40,
                background: tab === tTab ? "#087F63" : "#E8EFEC",
                color: tab === tTab ? "#fff" : "#183B34",
                fontSize: lang === "ur" ? 18 : 14,
                fontFamily:
                  lang === "ur"
                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                    : "inherit",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-4">
        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 opacity-50">
            {/* <span style={{ fontSize: 48 }}></span> */}
            <p
              className="font-semibold mt-2"
              style={{
                fontSize: lang === "ur" ? 18 : 14,
                fontFamily:
                  lang === "ur"
                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                    : "inherit",
              }}
            >
              {lang === "ur" ? "ڈیٹا دستیاب نہیں ہے۔" : "No data available."}
            </p>
          </div>
        )}

        {/* Today-Only Free Preview Notice Banner */}
        {isProductTodayOnly(product) && (
          <div
            style={{
              background: "linear-gradient(135deg, #E6F7F0, #D1EFE4)",
              border: "1.5px solid #2FAE68",
              borderRadius: 16,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              boxShadow: "0 2px 10px rgba(8,127,99,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>⭐</span>
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 800, color: "#064D40" }}
                >
                  {lang === "ur"
                    ? "صرف آج کا ڈیٹا فعال ہے"
                    : "Today's Free Data Preview"}
                </div>
                <div style={{ fontSize: 11.5, color: "#2E5C4E" }}>
                  {lang === "ur"
                    ? "ماضی کا مکمل ڈیٹا دیکھنے کے لیے سبسکرائب کریں۔"
                    : "Data before today is locked. Subscribe to unlock history."}
                </div>
              </div>
            </div>
            <button
              onClick={() => push?.({ id: "billing", product, vertical })}
              style={{
                background: "#087F63",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "6px 12px",
                fontSize: 11.5,
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(8,127,99,0.2)",
              }}
            >
              {lang === "ur" ? "سبسکرائب" : "Subscribe"}
            </button>
          </div>
        )}

        {tab === "overview" && rows.length > 0 && (
          <>
            {/*  Overview header row: label + date flipper + location filter  */}
            <div className="flex items-center gap-2">
              <p
                className="text-xs font-bold uppercase tracking-wide flex-1"
                style={{
                  color: "#52635F",
                  letterSpacing: "0.05em",
                  fontSize: lang === "ur" ? 17 : 12,
                  fontFamily:
                    lang === "ur"
                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                      : "inherit",
                }}
              >
                {statDateFilter
                  ? (() => {
                      const mn = [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ];
                      const mnUr = [
                        "جنوری",
                        "فروری",
                        "مارچ",
                        "اپریل",
                        "مئی",
                        "جون",
                        "جولائی",
                        "اگست",
                        "ستمبر",
                        "اکتوبر",
                        "نومبر",
                        "دسمبر",
                      ];
                      return lang === "ur"
                        ? `${statDateFilter.getDate()} ${mnUr[statDateFilter.getMonth()]} کا جائزہ`
                        : `${statDateFilter.getDate()} ${mn[statDateFilter.getMonth()]} Overview`;
                    })()
                  : lang === "ur"
                    ? "آج کا جائزہ"
                    : "Today's Overview"}
              </p>
              {/* Date flipper button */}
              {(() => {
                const mn = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                const mnUr = [
                  "جنوری",
                  "فروری",
                  "مارچ",
                  "اپریل",
                  "مئی",
                  "جون",
                  "جولائی",
                  "اگست",
                  "ستمبر",
                  "اکتوبر",
                  "نومبر",
                  "دسمبر",
                ];
                const sdYear = statDateCalMonth.getFullYear();
                const sdMonthIdx = statDateCalMonth.getMonth();
                const sdMonthName =
                  lang === "ur"
                    ? `${mnUr[sdMonthIdx]} ${sdYear}`
                    : statDateCalMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      });
                const sdFirstDow = new Date(sdYear, sdMonthIdx, 1).getDay();
                const sdDaysInMonth = new Date(
                  sdYear,
                  sdMonthIdx + 1,
                  0,
                ).getDate();
                const sdCalDays: (number | null)[] = [
                  ...Array(sdFirstDow).fill(null),
                  ...Array.from({ length: sdDaysInMonth }, (_, i) => i + 1),
                ];
                while (sdCalDays.length % 7 !== 0) sdCalDays.push(null);
                const sdIsSame = (a: Date, b: Date) =>
                  a.getFullYear() === b.getFullYear() &&
                  a.getMonth() === b.getMonth() &&
                  a.getDate() === b.getDate();
                const sdIsRef = (d: Date) => sdIsSame(d, new Date(2026, 7, 21));
                return (
                  <div className="relative">
                    {/* Flip-calendar style button */}
                    <button
                      onClick={() => setStatDateCalOpen((o) => !o)}
                      className="tap-target flex-shrink-0 overflow-hidden"
                      style={{
                        display: "flex",
                        borderRadius: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
                        border: "1px solid #C7E8D8",
                        padding: 0,
                      }}
                    >
                      <div
                        style={{
                          background: "#087F63",
                          padding: "5px 8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: lang === "ur" ? 11 : 9,
                            fontWeight: 800,
                            letterSpacing: 1,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {statDateFilter
                            ? lang === "ur"
                              ? mnUr[statDateFilter.getMonth()]
                              : mn[statDateFilter.getMonth()]
                            : lang === "ur"
                              ? mnUr[7]
                              : mn[7]}
                        </span>
                      </div>
                      <div
                        style={{
                          background: "#F4FAF7",
                          padding: "5px 8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderLeft: "1px solid #D5E2DD",
                        }}
                      >
                        <span
                          style={{
                            color: "#183B34",
                            fontSize: 16,
                            fontWeight: 900,
                            lineHeight: 1,
                          }}
                        >
                          {statDateFilter ? statDateFilter.getDate() : 21}
                        </span>
                      </div>
                    </button>
                    {/* Dropdown calendar */}
                    {statDateCalOpen && (
                      <div
                        className="absolute right-0 z-[100] rounded-2xl overflow-hidden"
                        style={{
                          top: 48,
                          width: 260,
                          background: "#F4FAF7",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                          border: "1px solid #D5E2DD",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-4 pt-3 pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <button
                              onClick={() =>
                                setStatDateCalMonth(
                                  new Date(sdYear, sdMonthIdx - 1, 1),
                                )
                              }
                              className="tap-target w-8 h-8 rounded-full flex items-center justify-center font-bold"
                              style={{
                                background: "#E8EFEC",
                                color: "#2F4A43",
                                fontSize: 16,
                              }}
                            >
                              ‹
                            </button>
                            <p
                              className="font-bold text-sm"
                              style={{
                                color: "#183B34",
                                fontSize: lang === "ur" ? 16 : 14,
                                fontFamily:
                                  lang === "ur"
                                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                    : "inherit",
                              }}
                            >
                              {sdMonthName}
                            </p>
                            <button
                              onClick={() =>
                                setStatDateCalMonth(
                                  new Date(sdYear, sdMonthIdx + 1, 1),
                                )
                              }
                              className="tap-target w-8 h-8 rounded-full flex items-center justify-center font-bold"
                              style={{
                                background: "#E8EFEC",
                                color: "#2F4A43",
                                fontSize: 16,
                              }}
                            >
                              ›
                            </button>
                          </div>
                          {statDateFilter && (
                            <div className="flex justify-end mb-1">
                              <button
                                onClick={() => {
                                  setStatDateFilter(null);
                                  setStatDateCalOpen(false);
                                }}
                                className="font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  background: "#F9E1DE",
                                  color: "#A83B37",
                                  fontSize: lang === "ur" ? 12 : 10,
                                  fontFamily:
                                    lang === "ur"
                                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                      : "inherit",
                                }}
                              >
                                {lang === "ur"
                                  ? "ہٹائیں (آج)"
                                  : "Clear (Today)"}
                              </button>
                            </div>
                          )}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(7,1fr)",
                              marginBottom: 4,
                            }}
                          >
                            {(lang === "ur"
                              ? ["ات", "پی", "من", "بد", "جم", "جم", "ہف"]
                              : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                            ).map((d) => (
                              <div
                                key={d}
                                className="text-center font-bold text-[10px]"
                                style={{
                                  color: "#80918B",
                                  paddingBottom: 2,
                                  fontFamily:
                                    lang === "ur"
                                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                      : "inherit",
                                }}
                              >
                                {d}
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(7,1fr)",
                              gap: 2,
                            }}
                          >
                            {sdCalDays.map((day, idx) => {
                              if (!day) return <div key={idx} />;
                              const d = new Date(sdYear, sdMonthIdx, day);
                              const selected = statDateFilter
                                ? sdIsSame(d, statDateFilter)
                                : false;
                              const isRef = sdIsRef(d);
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setStatDateFilter(d);
                                    setStatDateCalOpen(false);
                                  }}
                                  className="tap-target flex items-center justify-center rounded-full font-semibold text-xs mx-auto"
                                  style={{
                                    width: 30,
                                    height: 30,
                                    background: selected
                                      ? "#087F63"
                                      : isRef
                                        ? "#E4F2EC"
                                        : "transparent",
                                    color: selected
                                      ? "#fff"
                                      : isRef
                                        ? "#075E4F"
                                        : "#2F4A43",
                                    border:
                                      isRef && !selected
                                        ? "1.5px solid #087F63"
                                        : "none",
                                  }}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
              {/* Location filter */}
              <button
                onClick={() => setLocSheet(true)}
                className="tap-target flex items-center gap-1.5 rounded-xl font-semibold text-xs px-2.5 py-1.5"
                style={{
                  background: locScope.kind === "mandi" ? "#087F63" : "#E4F2EC",
                  color: locScope.kind === "mandi" ? "#fff" : "#075E4F",
                  border:
                    locScope.kind === "mandi" ? "none" : "1px solid #C7E8D8",
                  fontSize: lang === "ur" ? 14 : 12,
                  fontFamily:
                    lang === "ur"
                      ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                      : "inherit",
                }}
              >
                <span>
                  {locScope.kind === "mandi"
                    ? tm(locScope.label.replace(" Mandi", ""))
                    : locScope.kind === "province"
                      ? tm(locScope.label)
                      : lang === "ur"
                        ? "پورا پاکستان"
                        : "Overview"}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: 0.85, flexShrink: 0 }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            {/* Dismiss stat date calendar on outside click */}
            {statDateCalOpen && (
              <div
                className="fixed inset-0 z-[99]"
                onClick={() => setStatDateCalOpen(false)}
              />
            )}

            {/*  9 stat tiles (compact 3-col) + inline rates table  */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
              }}
            >
              {/* MAX */}
              <div
                className="rounded-xl p-3"
                style={{
                  background: "#E4F2EC",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <p
                  className="font-bold tracking-wide"
                  style={{
                    color: "#075E4F",
                    opacity: 0.85,
                    fontSize: lang === "ur" ? 14 : 9,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "زیادہ سے زیادہ" : "MAX"}
                </p>
                <p
                  className="font-extrabold mt-0.5"
                  style={{
                    fontSize: lang === "ur" ? 22 : 16,
                    color: "#075E4F",
                    lineHeight: 1.2,
                  }}
                >
                  {fmt(statMax)}
                </p>
              </div>
              {/* MIN */}
              <div
                className="rounded-xl p-3"
                style={{
                  background: "#FFF0C7",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <p
                  className="font-bold tracking-wide"
                  style={{
                    color: "#9A6817",
                    opacity: 0.85,
                    fontSize: lang === "ur" ? 14 : 9,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "کم سے کم" : "MIN"}
                </p>
                <p
                  className="font-extrabold mt-0.5"
                  style={{
                    fontSize: lang === "ur" ? 22 : 16,
                    color: "#9A6817",
                    lineHeight: 1.2,
                  }}
                >
                  {fmt(statMin)}
                </p>
              </div>
              {/* ARRIVAL */}
              <div
                className="rounded-xl p-3"
                style={{
                  background: "#EAF5F1",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <p
                  className="font-bold tracking-wide"
                  style={{
                    color: "#147D72",
                    opacity: 0.85,
                    fontSize: lang === "ur" ? 14 : 9,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "آمد" : "ARRIVAL"}
                </p>
                <p
                  className="font-extrabold mt-0.5"
                  style={{
                    fontSize: lang === "ur" ? 17 : 13,
                    color: "#147D72",
                    lineHeight: 1.2,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {statArrival > 0
                    ? lang === "ur"
                      ? `${statArrival.toLocaleString()} بوری`
                      : statArrival.toLocaleString()
                    : "—"}
                </p>
              </div>
              {/* RATE TYPE */}
              <button
                onClick={() => setAttrSheet("ratetype")}
                className="tap-target rounded-xl p-3 text-left"
                style={{
                  background: attrRateType ? "#E4F2EC" : "#F1F7F4",
                  border: attrRateType
                    ? "1.5px solid #087F63"
                    : "1px solid #D5E2DD",
                }}
              >
                <p
                  className="font-bold tracking-wide"
                  style={{
                    color: attrRateType ? "#075E4F" : "#80918B",
                    fontSize: lang === "ur" ? 13 : 9,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "نرخ کی قسم" : "RATE TYPE"}
                </p>
                <p
                  className="font-extrabold mt-0.5"
                  style={{
                    fontSize: lang === "ur" ? 15 : 11,
                    color: attrRateType ? "#087F63" : "#C7D6D0",
                    lineHeight: 1.2,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {attrRateType
                    ? tr(attrRateType).replace(" ریٹ", "").replace(" Rate", "")
                    : "—"}
                </p>
              </button>
              {/* VARIETY */}
              <button
                onClick={() => setAttrSheet("variety")}
                className="tap-target rounded-xl p-3 text-left"
                style={{
                  background: attrVariety ? "#EFF8F3" : "#F1F7F4",
                  border: attrVariety
                    ? "1.5px solid #16A34A"
                    : "1px solid #D5E2DD",
                }}
              >
                <p
                  className="font-bold tracking-wide"
                  style={{
                    color: attrVariety ? "#147A3F" : "#80918B",
                    fontSize: lang === "ur" ? 13 : 9,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "قسم" : "VARIETY"}
                </p>
                <p
                  className="font-extrabold mt-0.5"
                  style={{
                    fontSize: lang === "ur" ? 15 : 11,
                    color: attrVariety ? "#16A34A" : "#C7D6D0",
                    lineHeight: 1.2,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {attrVariety ? tc(attrVariety) : "—"}
                </p>
              </button>
              {/* NEW / OLD */}
              <button
                onClick={() => setAttrSheet("newold")}
                className="tap-target rounded-xl p-3 text-left"
                style={{
                  background: attrNewOld ? "#FFF8E8" : "#F1F7F4",
                  border: attrNewOld
                    ? "1.5px solid #9A6817"
                    : "1px solid #D5E2DD",
                }}
              >
                <p
                  className="font-bold tracking-wide"
                  style={{
                    color: attrNewOld ? "#92400E" : "#80918B",
                    fontSize: lang === "ur" ? 13 : 9,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "نیا / پرانا" : "NEW/OLD"}
                </p>
                <p
                  className="font-extrabold mt-0.5"
                  style={{
                    fontSize: lang === "ur" ? 15 : 12,
                    color: attrNewOld ? "#9A6817" : "#C7D6D0",
                    lineHeight: 1.2,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {attrNewOld ? t(attrNewOld) : "—"}
                </p>
              </button>
              {/* COLOR */}
              <button
                onClick={() => setAttrSheet("color")}
                className="tap-target rounded-xl p-3 text-left"
                style={{
                  background: attrColor ? "#E8F5EF" : "#F1F7F4",
                  border: attrColor
                    ? "1.5px solid #0A8F73"
                    : "1px solid #D5E2DD",
                }}
              >
                <p
                  className="font-bold tracking-wide"
                  style={{
                    color: attrColor ? "#075E4F" : "#80918B",
                    fontSize: lang === "ur" ? 13 : 9,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "رنگ" : "COLOR"}
                </p>
                <p
                  className="font-extrabold mt-0.5"
                  style={{
                    fontSize: lang === "ur" ? 15 : 12,
                    color: attrColor ? "#0A8F73" : "#C7D6D0",
                    lineHeight: 1.2,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {attrColor ? t(attrColor) : "—"}
                </p>
              </button>
              {/* SPEC */}
              <button
                onClick={() => setAttrSheet("spec")}
                className="tap-target rounded-xl p-3 text-left"
                style={{
                  background: attrSpec ? "#FFF0C7" : "#F1F7F4",
                  border: attrSpec
                    ? "1.5px solid #A96F18"
                    : "1px solid #D5E2DD",
                }}
              >
                <p
                  className="font-bold tracking-wide"
                  style={{
                    color: attrSpec ? "#92400E" : "#80918B",
                    fontSize: lang === "ur" ? 13 : 9,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "خصوصیت" : "SPEC"}
                </p>
                <p
                  className="font-extrabold mt-0.5"
                  style={{
                    fontSize: lang === "ur" ? 14 : 11,
                    color: attrSpec ? "#A96F18" : "#C7D6D0",
                    lineHeight: 1.2,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {attrSpec ? t(attrSpec) : "—"}
                </p>
              </button>
              {/* CONDITION */}
              <button
                onClick={() => setAttrSheet("condition")}
                className="tap-target rounded-xl p-3 text-left"
                style={{
                  background: attrCondition ? "#DDF3E7" : "#F1F7F4",
                  border: attrCondition
                    ? "1.5px solid #075E4F"
                    : "1px solid #D5E2DD",
                }}
              >
                <p
                  className="font-bold tracking-wide"
                  style={{
                    color: attrCondition ? "#075E4F" : "#80918B",
                    fontSize: lang === "ur" ? 13 : 9,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "حالت" : "CONDITION"}
                </p>
                <p
                  className="font-extrabold mt-0.5"
                  style={{
                    fontSize: lang === "ur" ? 15 : 12,
                    color: attrCondition ? "#075E4F" : "#C7D6D0",
                    lineHeight: 1.2,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {attrCondition ? t(attrCondition) : "—"}
                </p>
              </button>
            </div>

            {/* Inline Mandi Rates Table — all Pakistan mandis for this byproduct */}
            {(() => {
              const PROVINCES = ["Punjab", "Sindh", "KPK", "Balochistan"];
              // Always source from allRows (all Pakistan), independent of locScope
              const tableSourceRows = allRows.filter(
                (r) => !attrRateType || r.rateType === attrRateType,
              );
              const tableRows = tableSourceRows.filter(
                (r) =>
                  !tableProvinceFilter || r.province === tableProvinceFilter,
              );
              const BASE_DATE = new Date(2026, 7, 21);
              const tableDateVariation = tableDateFilter
                ? (() => {
                    const diffMs =
                      BASE_DATE.getTime() - tableDateFilter.getTime();
                    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
                    return Math.max(0.88, 1 - diffDays * 0.012);
                  })()
                : 1;
              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              const monthNamesUr = [
                "جنوری",
                "فروری",
                "مارچ",
                "اپریل",
                "مئی",
                "جون",
                "جولائی",
                "اگست",
                "ستمبر",
                "اکتوبر",
                "نومبر",
                "دسمبر",
              ];
              const dateLabel = tableDateFilter
                ? lang === "ur"
                  ? `${tableDateFilter.getDate()} ${monthNamesUr[tableDateFilter.getMonth()]}`
                  : `${tableDateFilter.getDate()} ${monthNames[tableDateFilter.getMonth()]}`
                : lang === "ur"
                  ? "آج"
                  : "Today";
              // Calendar helpers for table date picker
              const tcYear = tableDateCalMonth.getFullYear();
              const tcMonthIdx = tableDateCalMonth.getMonth();
              const tcMonthName =
                lang === "ur"
                  ? `${monthNamesUr[tcMonthIdx]} ${tcYear}`
                  : tableDateCalMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
              const tcFirstDow = new Date(tcYear, tcMonthIdx, 1).getDay();
              const tcDaysInMonth = new Date(
                tcYear,
                tcMonthIdx + 1,
                0,
              ).getDate();
              const tcCalDays: (number | null)[] = [
                ...Array(tcFirstDow).fill(null),
                ...Array.from({ length: tcDaysInMonth }, (_, i) => i + 1),
              ];
              while (tcCalDays.length % 7 !== 0) tcCalDays.push(null);
              const tcIsSameDay = (a: Date, b: Date) =>
                a.getFullYear() === b.getFullYear() &&
                a.getMonth() === b.getMonth() &&
                a.getDate() === b.getDate();
              const tcIsToday = (d: Date) =>
                tcIsSameDay(d, new Date(2026, 7, 21));
              return (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid #D5E2DD", background: "#F4FAF7" }}
                >
                  {/* Table header with title, date button, province chips */}
                  <div
                    className="px-4 pt-3 pb-2"
                    style={{
                      borderBottom: "1px solid #E8EFEC",
                      background: "#F1F7F4",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p
                          className="font-extrabold text-sm"
                          style={{
                            color: "#183B34",
                            fontSize: lang === "ur" ? 17 : 14,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {lang === "ur"
                            ? `${tm(tableProvinceFilter || "پاکستان")} میں ${tc(title)}`
                            : `${title} in ${tableProvinceFilter || "Pakistan"}`}
                        </p>
                        <p
                          className="text-[10px] mt-0.5"
                          style={{
                            color: "#52635F",
                            fontSize: lang === "ur" ? 13 : 10,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {lang === "ur"
                            ? `${tableRows.length} منڈیاں · تفصیل کے لیے منتخب کریں`
                            : `${tableRows.length} mandi${tableRows.length !== 1 ? "s" : ""} · tap row to view details`}
                        </p>
                      </div>
                      {/* Date picker button */}
                      <button
                        onClick={() => setTableDateCalOpen((o) => !o)}
                        className="tap-target flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-xs flex-shrink-0"
                        style={{
                          background: tableDateFilter ? "#087F63" : "#E4F2EC",
                          color: tableDateFilter ? "#fff" : "#075E4F",
                          border: tableDateFilter
                            ? "none"
                            : "1px solid #C7E8D8",
                          fontSize: lang === "ur" ? 14 : 12,
                          fontFamily:
                            lang === "ur"
                              ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                              : "inherit",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {dateLabel}
                      </button>
                    </div>
                    {/* Province filter chips */}
                    <div
                      className="flex gap-1.5 overflow-x-auto pb-0.5"
                      style={{ scrollbarWidth: "none" }}
                    >
                      {[null, ...PROVINCES].map((p) => (
                        <button
                          key={p || "all"}
                          onClick={() => setTableProvinceFilter(p)}
                          className="flex-shrink-0 px-2.5 py-1 rounded-full font-bold text-[10px]"
                          style={{
                            background:
                              tableProvinceFilter === p ? "#087F63" : "#fff",
                            color:
                              tableProvinceFilter === p ? "#fff" : "#52635F",
                            border: `1px solid ${
                              tableProvinceFilter === p ? "#087F63" : "#D5E2DD"
                            }`,
                            fontSize: lang === "ur" ? 13 : 10,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {p
                            ? tm(p)
                            : lang === "ur"
                              ? "تمام صوبے"
                              : "All Provinces"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inline calendar for table date picker */}
                  {tableDateCalOpen && (
                    <div
                      className="px-4 pt-3 pb-2"
                      style={{
                        borderBottom: "1px solid #D5E2DD",
                        background: "#F4FAF7",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() =>
                            setTableDateCalMonth(
                              new Date(tcYear, tcMonthIdx - 1, 1),
                            )
                          }
                          className="tap-target w-8 h-8 rounded-full flex items-center justify-center font-bold"
                          style={{
                            background: "#E8EFEC",
                            color: "#2F4A43",
                            fontSize: 16,
                          }}
                        >
                          ‹
                        </button>
                        <p
                          className="font-bold text-sm"
                          style={{
                            color: "#183B34",
                            fontSize: lang === "ur" ? 16 : 14,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {tcMonthName}
                        </p>
                        <button
                          onClick={() =>
                            setTableDateCalMonth(
                              new Date(tcYear, tcMonthIdx + 1, 1),
                            )
                          }
                          className="tap-target w-8 h-8 rounded-full flex items-center justify-center font-bold"
                          style={{
                            background: "#E8EFEC",
                            color: "#2F4A43",
                            fontSize: 16,
                          }}
                        >
                          ›
                        </button>
                      </div>
                      {tableDateFilter && (
                        <div className="flex justify-end mb-1">
                          <button
                            onClick={() => {
                              setTableDateFilter(null);
                              setTableDateCalOpen(false);
                            }}
                            className="font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: "#F9E1DE",
                              color: "#A83B37",
                              fontSize: lang === "ur" ? 12 : 10,
                              fontFamily:
                                lang === "ur"
                                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                  : "inherit",
                            }}
                          >
                            {lang === "ur" ? "تاریخ ہٹائیں" : "Clear date"}
                          </button>
                        </div>
                      )}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(7,1fr)",
                          marginBottom: 4,
                        }}
                      >
                        {(lang === "ur"
                          ? ["ات", "پی", "من", "بد", "جم", "جم", "ہف"]
                          : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                        ).map((d) => (
                          <div
                            key={d}
                            className="text-center font-bold text-[10px]"
                            style={{
                              color: "#80918B",
                              paddingBottom: 2,
                              fontFamily:
                                lang === "ur"
                                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                  : "inherit",
                            }}
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(7,1fr)",
                          gap: 2,
                        }}
                      >
                        {tcCalDays.map((day, idx) => {
                          if (!day) return <div key={idx} />;
                          const d = new Date(tcYear, tcMonthIdx, day);
                          const selected = tableDateFilter
                            ? tcIsSameDay(d, tableDateFilter)
                            : false;
                          const isRef = tcIsToday(d);
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setTableDateFilter(d);
                                setTableDateCalOpen(false);
                              }}
                              className="tap-target flex items-center justify-center rounded-full font-semibold text-xs mx-auto"
                              style={{
                                width: 30,
                                height: 30,
                                background: selected
                                  ? "#087F63"
                                  : isRef
                                    ? "#E4F2EC"
                                    : "transparent",
                                color: selected
                                  ? "#fff"
                                  : isRef
                                    ? "#075E4F"
                                    : "#2F4A43",
                                border:
                                  isRef && !selected
                                    ? "1.5px solid #087F63"
                                    : "none",
                              }}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Column header row */}
                  <div
                    className="px-3 py-2"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.35fr 1.15fr 1.15fr 0.75fr 0.95fr",
                      columnGap: 8,
                      borderBottom: "1px solid #E8EFEC",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="font-extrabold uppercase tracking-wide"
                      style={{
                        color: "#80918B",
                        fontSize: lang === "ur" ? 13 : 9,
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                        textAlign: lang === "ur" ? "right" : "left",
                      }}
                    >
                      {lang === "ur" ? "منڈی" : "Mandi"}
                    </span>
                    <span
                      className="font-extrabold uppercase tracking-wide text-right"
                      style={{
                        color: "#80918B",
                        fontSize: lang === "ur" ? 13 : 9,
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                      }}
                    >
                      {lang === "ur" ? "کم سے کم" : "Min"}
                    </span>
                    <span
                      className="font-extrabold uppercase tracking-wide text-right"
                      style={{
                        color: "#80918B",
                        fontSize: lang === "ur" ? 13 : 9,
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                      }}
                    >
                      {lang === "ur" ? "زیادہ سے زیادہ" : "Max"}
                    </span>
                    <span
                      className="font-extrabold uppercase tracking-wide text-center"
                      style={{
                        color: "#80918B",
                        fontSize: lang === "ur" ? 13 : 9,
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                      }}
                    >
                      {lang === "ur" ? "قسم" : "Type"}
                    </span>
                    <span
                      className="font-extrabold uppercase tracking-wide text-right"
                      style={{
                        color: "#80918B",
                        fontSize: lang === "ur" ? 13 : 9,
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                      }}
                    >
                      {lang === "ur" ? "رجحان" : "Trend"}
                    </span>
                  </div>
                  {/* Scrollable table body — keeps the deep-view card compact */}
                  <div
                    className="flex flex-col overflow-y-auto"
                    style={{
                      maxHeight: 300,
                      scrollbarWidth: "thin",
                      scrollbarColor: "#A9CFC2 transparent",
                    }}
                  >
                    {tableRows.length === 0 && (
                      <div className="flex items-center justify-center py-8 opacity-50">
                        <p
                          className="font-semibold"
                          style={{
                            fontSize: lang === "ur" ? 16 : 14,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {lang === "ur"
                            ? `کوئی منڈی ڈیٹا دستیاب نہیں${tableProvinceFilter ? ` (${tm(tableProvinceFilter)})` : ""}`
                            : `No mandi data${tableProvinceFilter ? ` in ${tableProvinceFilter}` : ""}`}
                        </p>
                      </div>
                    )}
                    {tableRows.map((r, ci) => {
                      const trendArrow =
                        r.trend === "up" ? "▲" : r.trend === "down" ? "▼" : "—";
                      const trendColor =
                        r.trend === "up"
                          ? "#16A34A"
                          : r.trend === "down"
                            ? "#C94A43"
                            : "#52635F";
                      const rtColor = RATE_COLORS[r.rateType] || "#52635F";
                      const isSelected =
                        locScope.kind === "mandi" &&
                        locScope.label === r.mandiName;
                      // Each row uses ITS OWN canonical attrs so prices match the byproduct list cards
                      const rowCanon = getMandiCanonicalAttrs(r.mandiName);
                      const rowAttrMult = computeAttrMult(
                        rowCanon.variety,
                        rowCanon.color,
                        rowCanon.newOld,
                        rowCanon.spec,
                        rowCanon.condition,
                      );
                      const effMult = rowAttrMult * tableDateVariation;
                      return (
                        <button
                          key={`${r.mandiName}-${r.rateType}-${ci}`}
                          onClick={() => {
                            if (!push) return;
                            push({
                              id: "product-rates",
                              vertical,
                              product,
                              byproduct,
                              initialMandi: r.mandiName,
                              initialRateType: r.rateType,
                              initialVariety: rowCanon.variety,
                              initialNewOld: rowCanon.newOld,
                              initialColor: rowCanon.color,
                              initialSpec: rowCanon.spec,
                              initialCondition: rowCanon.condition,
                              initialStatDate:
                                tableDateFilter?.toISOString() || undefined,
                            });
                          }}
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "1.35fr 1.15fr 1.15fr 0.75fr 0.95fr",
                            columnGap: 8,
                            padding: "10px 12px",
                            borderBottom:
                              ci < tableRows.length - 1
                                ? "1px solid #F2F7F5"
                                : "none",
                            background: isSelected ? "#E4F2EC" : "transparent",
                            alignItems: "center",
                            textAlign: lang === "ur" ? "right" : "left",
                            width: "100%",
                            cursor: "pointer",
                          }}
                        >
                          <span
                            className="font-semibold truncate"
                            style={{
                              color: "#183B34",
                              fontSize: lang === "ur" ? 15 : 12,
                              fontFamily:
                                lang === "ur"
                                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                  : "inherit",
                            }}
                          >
                            {tm(r.mandiName.replace(" Mandi", ""))}
                          </span>
                          <span
                            className="text-xs font-bold"
                            style={{
                              color: "#52635F",
                              textAlign: "right",
                              fontSize: lang === "ur" ? 13 : 11.5,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {fmt(Math.round(r.min * effMult))}
                          </span>
                          <span
                            className="text-xs font-extrabold"
                            style={{
                              color: "#087F63",
                              textAlign: "right",
                              fontSize: lang === "ur" ? 13 : 11.5,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {fmt(Math.round(r.max * effMult))}
                          </span>
                          <span
                            className="font-bold px-1.5 py-0.5 rounded-full"
                            style={{
                              background: rtColor + "22",
                              color: rtColor,
                              whiteSpace: "nowrap",
                              textAlign: "center",
                              justifySelf: "center",
                              fontSize: lang === "ur" ? 12 : 9,
                              fontFamily:
                                lang === "ur"
                                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                  : "inherit",
                            }}
                          >
                            {tr(r.rateType)
                              .replace(" ریٹ", "")
                              .replace(" Rate", "")}
                          </span>
                          <span
                            className="text-xs font-bold"
                            style={{
                              color: trendColor,
                              textAlign: "right",
                              whiteSpace: "nowrap",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              gap: 2,
                            }}
                          >
                            <span>{trendArrow}</span>
                            {r.trendPct > 0 && <span>{r.trendPct}%</span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/*  Attribute picker sheet  */}
            {attrSheet &&
              (() => {
                const opts: Record<string, string[]> = {
                  variety: [
                    "Sona Moti",
                    "TD-1",
                    "SurSabz",
                    "Akbar",
                    "Anaj",
                    "Ujala",
                    "Galaxy",
                    "Dilkush",
                    "Arooj",
                    "Subham",
                  ],
                  newold: ["New", "Old"],
                  color: ["Golden", "White", "Yellow"],
                  spec: ["Seed Quality", "Retail", "Damage"],
                  condition: ["Wet", "Dry", "Mix"],
                  ratetype: ALL_RATE_TYPES,
                };
                const labels: Record<string, string> = {
                  variety: lang === "ur" ? "قسم منتخب کریں" : "Variety",
                  newold:
                    lang === "ur" ? "نیا / پرانا منتخب کریں" : "New / Old",
                  color: lang === "ur" ? "رنگ منتخب کریں" : "Color",
                  spec: lang === "ur" ? "خصوصیت منتخب کریں" : "Specifications",
                  condition: lang === "ur" ? "حالت منتخب کریں" : "Condition",
                  ratetype:
                    lang === "ur" ? "نرخ کی قسم منتخب کریں" : "Rate Type",
                };
                const currVal =
                  attrSheet === "variety"
                    ? attrVariety
                    : attrSheet === "newold"
                      ? attrNewOld
                      : attrSheet === "color"
                        ? attrColor
                        : attrSheet === "spec"
                          ? attrSpec
                          : attrSheet === "ratetype"
                            ? attrRateType
                            : attrCondition;
                const setter = (v: string | null) => {
                  if (attrSheet === "variety") setAttrVariety(v);
                  else if (attrSheet === "newold") setAttrNewOld(v);
                  else if (attrSheet === "color") setAttrColor(v);
                  else if (attrSheet === "spec") setAttrSpec(v);
                  else if (attrSheet === "ratetype") setAttrRateType(v);
                  else setAttrCondition(v);
                  setAttrSheet(null);
                };
                return (
                  <div
                    className="zm-sheet-overlay"
                    style={{ zIndex: 250 }}
                    onClick={() => setAttrSheet(null)}
                  >
                    <div
                      className="zm-sheet"
                      style={{
                        maxHeight: "60vh",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-5 pt-4 pb-3 border-b border-[#DCE8E3] flex-shrink-0">
                        <div className="zm-drag-handle" />
                        <p
                          className="font-bold text-lg"
                          style={{
                            fontSize: lang === "ur" ? 20 : 18,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {labels[attrSheet]}
                        </p>
                      </div>
                      <div
                        className="p-4 flex flex-col gap-2 overflow-y-auto flex-1"
                        style={{ minHeight: 0 }}
                      >
                        {currVal && (
                          <button
                            onClick={() => setter(null)}
                            className="tap-target rounded-2xl px-4 flex items-center gap-3"
                            style={{
                              background: "#FFF0C7",
                              border: "1.5px solid #F2D58A",
                              minHeight: 48,
                            }}
                          >
                            <span
                              className="font-semibold text-sm"
                              style={{
                                color: "#9A6817",
                                fontSize: lang === "ur" ? 16 : 14,
                                fontFamily:
                                  lang === "ur"
                                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                    : "inherit",
                              }}
                            >
                              {lang === "ur"
                                ? "انتخاب ہٹائیں"
                                : "Clear selection"}
                            </span>
                          </button>
                        )}
                        {opts[attrSheet].map((opt) => {
                          // Check if this attribute option is available in selected mandi
                          const mandiAttrs =
                            locScope.kind === "mandi"
                              ? MANDI_ATTR_AVAILABLE[locScope.label]
                              : null;
                          const attrKey =
                            attrSheet === "newold"
                              ? "newold"
                              : (attrSheet as
                                  | "color"
                                  | "variety"
                                  | "spec"
                                  | "condition"
                                  | "newold");
                          const available =
                            !mandiAttrs ||
                            !mandiAttrs[attrKey] ||
                            mandiAttrs[attrKey].includes(opt);
                          const optLabel =
                            attrSheet === "variety"
                              ? tc(opt)
                              : attrSheet === "ratetype"
                                ? tr(opt)
                                : t(opt);
                          return (
                            <button
                              key={opt}
                              onClick={() =>
                                available ? setter(opt) : undefined
                              }
                              className="tap-target rounded-2xl px-4 flex items-center gap-3"
                              style={{
                                background: !available
                                  ? "#F2F7F5"
                                  : currVal === opt
                                    ? "#E4F2EC"
                                    : "#F1F7F4",
                                border: !available
                                  ? "1px dashed #C7D6D0"
                                  : currVal === opt
                                    ? "2px solid #087F63"
                                    : "1px solid #D5E2DD",
                                minHeight: 48,
                                opacity: available ? 1 : 0.45,
                              }}
                            >
                              <span
                                className={`flex-1 ${lang === "ur" ? "text-right" : "text-left"} font-semibold text-sm`}
                                style={{
                                  color: !available
                                    ? "#80918B"
                                    : currVal === opt
                                      ? "#075E4F"
                                      : "#183B34",
                                  fontSize: lang === "ur" ? 17 : 14,
                                  fontFamily:
                                    lang === "ur"
                                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                      : "inherit",
                                }}
                              >
                                {optLabel}
                              </span>
                              {!available && (
                                <span
                                  style={{
                                    fontSize: lang === "ur" ? 13 : 10,
                                    color: "#80918B",
                                    fontFamily:
                                      lang === "ur"
                                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                        : "inherit",
                                  }}
                                >
                                  {lang === "ur"
                                    ? "منڈی میں نہیں"
                                    : "Not in mandi"}
                                </span>
                              )}
                              {available && currVal === opt && (
                                <span
                                  style={{ color: "#087F63", fontWeight: 800 }}
                                >
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

            {/* Date table sheet */}
            {dateTableOpen &&
              (() => {
                const allTableRows = Object.entries(MANDI_ROWS).flatMap(
                  ([mandiId, mrows]) => {
                    const mandi = INITIAL_MANDIS.find((m) => m.id === mandiId);
                    if (!mandi) return [];
                    return mrows
                      .filter(
                        (r) =>
                          r.product === product &&
                          (!byproduct || r.byproduct === byproduct),
                      )
                      .map((r) => ({
                        ...r,
                        mandiName: mandi.name,
                        province: mandi.province,
                      }));
                  },
                );

                // Apply column filters
                // Date-seeded variance: different days show slightly different prices
                const dateSeed =
                  dtSelDate.getFullYear() * 10000 +
                  (dtSelDate.getMonth() + 1) * 100 +
                  dtSelDate.getDate();
                const dateVariance = (base: number) => {
                  const hash = ((dateSeed * 2654435761) >>> 0) % 1000;
                  const pct = (hash / 1000 - 0.5) * 0.08; // ±4% variance
                  return Math.round(base * (1 + pct));
                };

                const filteredTableRows = allTableRows
                  .filter((r) => {
                    if (dtPriceType && r.rateType !== dtPriceType) return false;
                    return true;
                  })
                  .map((r) => ({
                    ...r,
                    min: dateVariance(r.min),
                    max: dateVariance(r.max),
                  }));

                const allPriceTypes = [
                  ...new Set(allTableRows.map((r) => r.rateType)),
                ];
                const specs = [
                  "Seed Quality",
                  "Retail",
                  "Damage",
                  "Export Grade",
                ];
                const conditions = ["Dry", "Wet", "Mix"];
                const qualities = ["New", "Old", "Cleaned", "Uncleaned"];

                // Calendar helpers
                const selD = dtSelDate;
                const calM = dtCalMonth;
                const calYear = calM.getFullYear();
                const calMonthIdx = calM.getMonth();
                const monthNamesUr = [
                  "جنوری",
                  "فروری",
                  "مارچ",
                  "اپریل",
                  "مئی",
                  "جون",
                  "جولائی",
                  "اگست",
                  "ستمبر",
                  "اکتوبر",
                  "نومبر",
                  "دسمبر",
                ];
                const monthName =
                  lang === "ur"
                    ? `${monthNamesUr[calMonthIdx]} ${calYear}`
                    : calM.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      });
                const firstDow = new Date(calYear, calMonthIdx, 1).getDay(); // 0=Sun
                const daysInMonth = new Date(
                  calYear,
                  calMonthIdx + 1,
                  0,
                ).getDate();
                const prevMonth = () =>
                  setDtCalMonth(new Date(calYear, calMonthIdx - 1, 1));
                const nextMonth = () =>
                  setDtCalMonth(new Date(calYear, calMonthIdx + 1, 1));
                const isSameDay = (a: Date, b: Date) =>
                  a.getFullYear() === b.getFullYear() &&
                  a.getMonth() === b.getMonth() &&
                  a.getDate() === b.getDate();
                const isToday = (d: Date) => isSameDay(d, new Date());
                const calDays: (number | null)[] = [
                  ...Array(firstDow).fill(null),
                  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
                ];
                while (calDays.length % 7 !== 0) calDays.push(null);

                const urDaysFull = [
                  "اتوار",
                  "پیر",
                  "منگل",
                  "بدھ",
                  "جمعرات",
                  "جمعہ",
                  "ہفتہ",
                ];
                const selDateStr =
                  lang === "ur"
                    ? `${urDaysFull[selD.getDay()]}، ${selD.getDate()} ${monthNamesUr[selD.getMonth()]} ${selD.getFullYear()}`
                    : selD.toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });

                // Column header dropdown opts
                const colOpts: Record<string, string[]> = {
                  Quality: qualities,
                  "Price Type": allPriceTypes.map((tPt) =>
                    tPt.replace(" Rate", ""),
                  ),
                  Specification: specs,
                  Condition: conditions,
                };
                const colLabels: Record<string, string> = {
                  Station: lang === "ur" ? "منڈی" : "Station",
                  Quality: lang === "ur" ? "معیار" : "Quality",
                  "Min – Max": lang === "ur" ? "کم – زیادہ" : "Min – Max",
                  "Price Type": lang === "ur" ? "نرخ کی قسم" : "Price Type",
                  Trend: lang === "ur" ? "رجحان" : "Trend",
                  Arrivals: lang === "ur" ? "آمد" : "Arrivals",
                  Unit: lang === "ur" ? "یونٹ" : "Unit",
                  Specification: lang === "ur" ? "خصوصیت" : "Specification",
                  Condition: lang === "ur" ? "حالت" : "Condition",
                };
                const colState: Record<string, string | null> = {
                  Quality: dtQuality,
                  "Price Type": dtPriceType,
                  Specification: dtSpec,
                  Condition: dtCondition,
                };
                const colSetter: Record<string, (v: string | null) => void> = {
                  Quality: setDtQuality,
                  "Price Type": (v) => setDtPriceType(v ? v + " Rate" : null),
                  Specification: setDtSpec,
                  Condition: setDtCondition,
                };

                return (
                  <div
                    className="zm-sheet-overlay"
                    style={{ zIndex: 250 }}
                    onClick={() => {
                      setDateTableOpen(false);
                      setDtOpenCol(null);
                    }}
                  >
                    <div
                      className="zm-sheet-high"
                      style={{ background: "#F4FAF7", maxHeight: "96vh" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Drag handle + title + calendar icon button */}
                      <div
                        className="px-5 pt-4 pb-3 flex-shrink-0"
                        style={{
                          borderBottom: "1px solid #D5E2DD",
                          background: "#F1F7F4",
                        }}
                      >
                        <div
                          className="w-10 h-1 rounded-full mx-auto mb-3"
                          style={{ background: "#C7D6D0" }}
                        />
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className="font-extrabold text-base"
                              style={{
                                color: "#075E4F",
                                fontSize: lang === "ur" ? 18 : 16,
                                fontFamily:
                                  lang === "ur"
                                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                    : "inherit",
                              }}
                            >
                              {lang === "ur"
                                ? `${tc(title)} ریٹ پنجاب`
                                : `${title} Rate Punjab`}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{
                                color: "#52635F",
                                fontSize: lang === "ur" ? 13 : 12,
                                fontFamily:
                                  lang === "ur"
                                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                    : "inherit",
                              }}
                            >
                              {selDateStr}
                            </p>
                          </div>
                          {/* Calendar icon button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDtCalOpen((o) => !o);
                            }}
                            className="tap-target flex items-center gap-1.5 rounded-xl px-3 py-2 font-semibold text-xs"
                            style={{
                              background: dtCalOpen ? "#087F63" : "#E4F2EC",
                              color: dtCalOpen ? "#fff" : "#075E4F",
                              border: "1px solid #C7E8D8",
                              fontSize: lang === "ur" ? 14 : 12,
                              fontFamily:
                                lang === "ur"
                                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                  : "inherit",
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {lang === "ur" ? "تاریخ منتخب کریں" : "Pick Date"}
                          </button>
                        </div>
                      </div>

                      {/* Expandable calendar */}
                      {dtCalOpen && (
                        <div
                          className="px-4 pt-3 pb-2 flex-shrink-0"
                          style={{
                            borderBottom: "1px solid #D5E2DD",
                            background: "#F4FAF7",
                          }}
                        >
                          {/* Month nav */}
                          <div className="flex items-center justify-between mb-2">
                            <button
                              onClick={prevMonth}
                              className="tap-target w-8 h-8 rounded-full flex items-center justify-center font-bold text-base"
                              style={{
                                background: "#E8EFEC",
                                color: "#2F4A43",
                              }}
                            >
                              ‹
                            </button>
                            <p
                              className="font-bold text-sm"
                              style={{
                                color: "#183B34",
                                fontSize: lang === "ur" ? 16 : 14,
                                fontFamily:
                                  lang === "ur"
                                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                    : "inherit",
                              }}
                            >
                              {monthName}
                            </p>
                            <button
                              onClick={nextMonth}
                              className="tap-target w-8 h-8 rounded-full flex items-center justify-center font-bold text-base"
                              style={{
                                background: "#E8EFEC",
                                color: "#2F4A43",
                              }}
                            >
                              ›
                            </button>
                          </div>
                          {/* Day headers */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(7,1fr)",
                              marginBottom: 4,
                            }}
                          >
                            {(lang === "ur"
                              ? ["ات", "پی", "من", "بد", "جم", "جم", "ہف"]
                              : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                            ).map((d) => (
                              <div
                                key={d}
                                className="text-center font-bold text-[10px]"
                                style={{
                                  color: "#80918B",
                                  paddingBottom: 2,
                                  fontFamily:
                                    lang === "ur"
                                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                      : "inherit",
                                }}
                              >
                                {d}
                              </div>
                            ))}
                          </div>
                          {/* Day grid */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(7,1fr)",
                              gap: 2,
                            }}
                          >
                            {calDays.map((day, idx) => {
                              if (!day) return <div key={idx} />;
                              const d = new Date(calYear, calMonthIdx, day);
                              const selected = isSameDay(d, selD);
                              const today = isToday(d);
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setDtSelDate(d);
                                    setDtCalOpen(false);
                                  }}
                                  className="tap-target flex items-center justify-center rounded-full font-semibold text-xs mx-auto"
                                  style={{
                                    width: 32,
                                    height: 32,
                                    background: selected
                                      ? "#087F63"
                                      : today
                                        ? "#E4F2EC"
                                        : "transparent",
                                    color: selected
                                      ? "#fff"
                                      : today
                                        ? "#075E4F"
                                        : "#2F4A43",
                                    border:
                                      today && !selected
                                        ? "1.5px solid #087F63"
                                        : "none",
                                  }}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Table with column-header dropdowns */}
                      <div
                        className="flex-1 overflow-auto"
                        onClick={() => setDtOpenCol(null)}
                      >
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: lang === "ur" ? 12 : 10.5,
                          }}
                        >
                          <thead
                            style={{ position: "sticky", top: 0, zIndex: 10 }}
                          >
                            <tr
                              style={{ background: "#075E4F", color: "#fff" }}
                            >
                              {[
                                "Station",
                                "Quality",
                                "Min – Max",
                                "Price Type",
                                "Trend",
                                "Arrivals",
                                "Unit",
                                "Specification",
                                "Condition",
                              ].map((col) => {
                                const hasFilter = col in colOpts;
                                const activeVal = colState[col];
                                const displayVal =
                                  col === "Price Type" && dtPriceType
                                    ? tr(dtPriceType)
                                        .replace(" ریٹ", "")
                                        .replace(" Rate", "")
                                    : activeVal
                                      ? col === "Specification" ||
                                        col === "Condition" ||
                                        col === "Quality"
                                        ? t(activeVal)
                                        : activeVal
                                      : null;
                                const colTitle = colLabels[col] || col;
                                return (
                                  <th
                                    key={col}
                                    style={{
                                      padding: "7px 5px",
                                      textAlign:
                                        lang === "ur" ? "right" : "left",
                                      fontWeight: 700,
                                      whiteSpace: "nowrap",
                                      borderRight:
                                        "1px solid rgba(255,255,255,0.15)",
                                      position: "relative",
                                      fontSize: lang === "ur" ? 13 : 10.5,
                                      fontFamily:
                                        lang === "ur"
                                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                          : "inherit",
                                    }}
                                  >
                                    {hasFilter ? (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDtOpenCol(
                                            dtOpenCol === col ? null : col,
                                          );
                                        }}
                                        className="flex items-center gap-0.5 font-bold text-white"
                                        style={{
                                          fontSize: lang === "ur" ? 13 : 10.5,
                                          fontFamily:
                                            lang === "ur"
                                              ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                              : "inherit",
                                        }}
                                      >
                                        {displayVal ? (
                                          <span
                                            style={{
                                              background:
                                                "rgba(255,255,255,0.25)",
                                              borderRadius: 4,
                                              padding: "1px 4px",
                                            }}
                                          >
                                            {displayVal}
                                          </span>
                                        ) : (
                                          colTitle
                                        )}
                                        <span
                                          style={{ fontSize: 8, opacity: 0.8 }}
                                        >
                                          ▾
                                        </span>
                                      </button>
                                    ) : (
                                      colTitle
                                    )}
                                    {/* Dropdown */}
                                    {dtOpenCol === col && (
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                          position: "absolute",
                                          top: "100%",
                                          left: lang === "ur" ? "auto" : 0,
                                          right: lang === "ur" ? 0 : "auto",
                                          zIndex: 100,
                                          background: "#F4FAF7",
                                          borderRadius: 10,
                                          boxShadow:
                                            "0 8px 24px rgba(0,0,0,0.18)",
                                          minWidth: 140,
                                          overflow: "hidden",
                                          border: "1px solid #D5E2DD",
                                        }}
                                      >
                                        <button
                                          onClick={() => {
                                            colSetter[col](null);
                                            setDtOpenCol(null);
                                          }}
                                          className={`tap-target w-full ${lang === "ur" ? "text-right" : "text-left"} px-3 py-2 text-xs font-semibold`}
                                          style={{
                                            color:
                                              !activeVal &&
                                              !(
                                                col === "Price Type" &&
                                                dtPriceType
                                              )
                                                ? "#075E4F"
                                                : "#2F4A43",
                                            background:
                                              !activeVal &&
                                              !(
                                                col === "Price Type" &&
                                                dtPriceType
                                              )
                                                ? "#E4F2EC"
                                                : "#fff",
                                            fontSize: lang === "ur" ? 14 : 12,
                                            fontFamily:
                                              lang === "ur"
                                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                                : "inherit",
                                          }}
                                        >
                                          {lang === "ur" ? "تمام" : "All"}
                                        </button>
                                        {colOpts[col].map((opt) => {
                                          const isActive =
                                            col === "Price Type"
                                              ? dtPriceType === opt + " Rate"
                                              : activeVal === opt;
                                          const optText =
                                            col === "Price Type"
                                              ? tr(opt + " Rate")
                                                  .replace(" ریٹ", "")
                                                  .replace(" Rate", "")
                                              : t(opt);
                                          return (
                                            <button
                                              key={opt}
                                              onClick={() => {
                                                colSetter[col](
                                                  isActive ? null : opt,
                                                );
                                                setDtOpenCol(null);
                                              }}
                                              className={`tap-target w-full ${lang === "ur" ? "text-right" : "text-left"} px-3 py-2 text-xs font-semibold`}
                                              style={{
                                                color: isActive
                                                  ? "#075E4F"
                                                  : "#2F4A43",
                                                background: isActive
                                                  ? "#E4F2EC"
                                                  : "#fff",
                                                fontSize:
                                                  lang === "ur" ? 14 : 12,
                                                fontFamily:
                                                  lang === "ur"
                                                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                                    : "inherit",
                                              }}
                                            >
                                              {optText}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTableRows.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={9}
                                  style={{
                                    padding: "24px",
                                    textAlign: "center",
                                    color: "#80918B",
                                    fontSize: lang === "ur" ? 16 : 13,
                                    fontFamily:
                                      lang === "ur"
                                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                        : "inherit",
                                  }}
                                >
                                  {lang === "ur"
                                    ? "کوئی ریکارڈ موجود نہیں ہے"
                                    : "No matching rows"}
                                </td>
                              </tr>
                            ) : (
                              filteredTableRows.map((r, i) => {
                                const trendIcon =
                                  r.trend === "up"
                                    ? "▲"
                                    : r.trend === "down"
                                      ? "▼"
                                      : "–";
                                const trendColor =
                                  r.trend === "up"
                                    ? "#159447"
                                    : r.trend === "down"
                                      ? "#C94A43"
                                      : "#80918B";
                                const rowQuality =
                                  dtQuality || attrNewOld || "New";
                                const rowSpec = dtSpec || attrSpec || "Retail";
                                const rowCond =
                                  dtCondition || attrCondition || "Dry";
                                return (
                                  <tr
                                    key={i}
                                    style={{
                                      background:
                                        i % 2 === 0 ? "#fff" : "#F1F7F4",
                                      borderBottom: "1px solid #E6EFEB",
                                    }}
                                  >
                                    <td
                                      style={{
                                        padding: "7px 5px",
                                        fontWeight: 700,
                                        color: "#183B34",
                                        whiteSpace: "nowrap",
                                        fontSize: lang === "ur" ? 14 : 11,
                                        fontFamily:
                                          lang === "ur"
                                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                            : "inherit",
                                      }}
                                    >
                                      {tm(r.mandiName.replace(" Mandi", ""))}
                                    </td>
                                    <td
                                      style={{
                                        padding: "7px 5px",
                                        color: "#2F4A43",
                                        fontSize: lang === "ur" ? 13 : 10.5,
                                        fontFamily:
                                          lang === "ur"
                                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                            : "inherit",
                                      }}
                                    >
                                      {t(rowQuality)}
                                    </td>
                                    <td
                                      style={{
                                        padding: "7px 5px",
                                        fontWeight: 700,
                                        color: "#075E4F",
                                        whiteSpace: "nowrap",
                                        fontSize: lang === "ur" ? 13 : 11,
                                      }}
                                    >
                                      {fmt(r.min)} – {fmt(r.max)}
                                    </td>
                                    <td
                                      style={{
                                        padding: "7px 5px",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      <span
                                        className="rounded-full px-1.5 py-0.5 font-semibold"
                                        style={{
                                          background:
                                            (RATE_COLORS[r.rateType] ||
                                              "#999") + "18",
                                          color:
                                            RATE_COLORS[r.rateType] || "#999",
                                          fontSize: lang === "ur" ? 11 : 10,
                                          fontFamily:
                                            lang === "ur"
                                              ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                              : "inherit",
                                        }}
                                      >
                                        {tr(r.rateType)
                                          .replace(" ریٹ", "")
                                          .replace(" Rate", "")}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        padding: "7px 5px",
                                        color: trendColor,
                                        fontWeight: 700,
                                        fontSize: 11,
                                      }}
                                    >
                                      {trendIcon}{" "}
                                      {r.trendPct > 0 ? r.trendPct + "%" : ""}
                                    </td>
                                    <td
                                      style={{
                                        padding: "7px 5px",
                                        color: "#2F4A43",
                                        whiteSpace: "nowrap",
                                        fontSize: lang === "ur" ? 13 : 10.5,
                                      }}
                                    >
                                      {r.arrival}
                                    </td>
                                    <td
                                      style={{
                                        padding: "7px 5px",
                                        color: "#2F4A43",
                                        fontSize: lang === "ur" ? 13 : 10.5,
                                        fontFamily:
                                          lang === "ur"
                                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                            : "inherit",
                                      }}
                                    >
                                      {lang === "ur" ? "۴۰ کلو" : "40 kg"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "7px 5px",
                                        color: "#2F4A43",
                                        fontSize: lang === "ur" ? 13 : 10.5,
                                        fontFamily:
                                          lang === "ur"
                                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                            : "inherit",
                                      }}
                                    >
                                      {t(rowSpec)}
                                    </td>
                                    <td
                                      style={{
                                        padding: "7px 5px",
                                        color: "#2F4A43",
                                        fontSize: lang === "ur" ? 13 : 10.5,
                                        fontFamily:
                                          lang === "ur"
                                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                            : "inherit",
                                      }}
                                    >
                                      {t(rowCond)}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div
                        className="flex justify-between items-center px-4 py-2 flex-shrink-0"
                        style={{
                          borderTop: "1px solid #D5E2DD",
                          background: "#F1F7F4",
                        }}
                      >
                        <span
                          className="text-[10px]"
                          style={{
                            color: "#80918B",
                            fontSize: lang === "ur" ? 13 : 10,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {lang === "ur"
                            ? "یونٹ = روپے · فی ۴۰ کلو"
                            : "Unit = Rs. · Unit = (40 kg)"}
                        </span>
                        <button
                          onClick={() => setDateTableOpen(false)}
                          className="tap-target font-bold"
                          style={{
                            color: "#075E4F",
                            fontSize: lang === "ur" ? 15 : 12,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {lang === "ur" ? "بند کریں" : "Close"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </>
        )}

        {tab === "trends" && rows.length > 0 && isProductTodayOnly(product) && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #D5E2DD",
              borderRadius: 20,
              padding: "28px 20px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(6,77,64,0.06)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#FFF4E5",
                color: "#D97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                margin: "0 auto 16px",
              }}
            >
              🔒
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#183B34",
                marginBottom: 8,
                fontFamily:
                  lang === "ur"
                    ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                    : "inherit",
              }}
            >
              {lang === "ur"
                ? "ماضی کے رجحانات اور گراف لاک ہیں"
                : "Historical Trends & Charts Locked"}
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#52635F",
                lineHeight: 1.5,
                marginBottom: 22,
                fontFamily:
                  lang === "ur"
                    ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                    : "inherit",
              }}
            >
              {lang === "ur"
                ? `${tc(product)} کے 7 دن، 30 دن اور 90 دن کے تاریخی نرخ، تجزیات اور آمد کے رجحانات دیکھنے کے لیے سبسکرائب کریں۔`
                : `Subscribe to unlock full 7-day, 30-day and 90-day price trend graphs, arrival patterns and historical market intelligence for ${product}.`}
            </p>
            <button
              onClick={() => push?.({ id: "billing", product, vertical })}
              className="tap-target w-full py-3.5 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #087F63, #064D40)",
                boxShadow: "0 4px 14px rgba(8,127,99,0.35)",
              }}
            >
              <span>
                {lang === "ur"
                  ? "ماضی کا ڈیٹا ان لاک کریں (PKR 3,000/ماہ) →"
                  : "Subscribe to Unlock Past History (PKR 3,000/mo) →"}
              </span>
            </button>
          </div>
        )}

        {tab === "trends" &&
          rows.length > 0 &&
          !isProductTodayOnly(product) && (
            <>
              {/* Location filter row — same as overview tab */}
              <div className="flex items-center justify-between">
                <p
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{
                    color: "#52635F",
                    fontSize: lang === "ur" ? 16 : 12,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "قیمتوں کے رجحانات" : "Price Trends"}
                </p>
                <button
                  onClick={() => setLocSheet(true)}
                  className="tap-target flex items-center gap-1 rounded-xl font-semibold text-xs px-2.5 py-1.5"
                  style={{
                    background:
                      locScope.kind === "mandi" ? "#087F63" : "#E4F2EC",
                    color: locScope.kind === "mandi" ? "#fff" : "#075E4F",
                    border:
                      locScope.kind === "mandi" ? "none" : "1px solid #C7E8D8",
                    fontSize: lang === "ur" ? 14 : 12,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {locScope.kind === "mandi"
                    ? tm(locScope.label.replace(" Mandi", ""))
                    : locScope.kind === "province"
                      ? tm(locScope.label)
                      : locScope.kind === "district"
                        ? tm(locScope.label)
                        : lang === "ur"
                          ? "قومی سطح"
                          : "National"}
                </button>
              </div>
              <div className="flex gap-2">
                {(
                  [
                    ["week", lang === "ur" ? "ہفتہ" : "Week"],
                    ["month", lang === "ur" ? "مہینہ" : "Month"],
                    ["quarter", lang === "ur" ? "تین ماہ" : "Quarter"],
                  ] as ["week" | "month" | "quarter", string][]
                ).map(([rKey, label]) => (
                  <button
                    key={rKey}
                    onClick={() => setRange(rKey)}
                    className="tap-target flex-1 rounded-xl font-bold text-xs capitalize"
                    style={{
                      height: lang === "ur" ? 42 : 38,
                      background: range === rKey ? "#087F63" : "#fff",
                      color: range === rKey ? "#fff" : "#183B34",
                      border: range === rKey ? "none" : "1px solid #D5E2DD",
                      fontSize: lang === "ur" ? 16 : 12,
                      fontFamily:
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {(
                  [
                    ["price", lang === "ur" ? "قیمت کا رجحان" : "Price Trend"],
                    [
                      "arrival",
                      lang === "ur" ? "آمد کا رجحان" : "Arrival Trend",
                    ],
                  ] as ["price" | "arrival", string][]
                ).map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => setTrendMode(m)}
                    className="tap-target flex-1 rounded-xl font-bold text-xs"
                    style={{
                      height: lang === "ur" ? 42 : 38,
                      background: trendMode === m ? "#075E4F" : "#E8EFEC",
                      color: trendMode === m ? "#fff" : "#183B34",
                      fontSize: lang === "ur" ? 16 : 12,
                      fontFamily:
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {trendMode === "price" ? (
                <>
                  {/* Interactive price chart */}
                  <div
                    className="rounded-2xl px-3 pt-3 pb-2"
                    style={{
                      background: "#F4FAF7",
                      border: "1px solid #D5E2DD",
                    }}
                  >
                    {/* Hover tooltip */}
                    {hoverIdx !== null && shownSeries.length > 0 && (
                      <div
                        className="rounded-xl px-3 py-2 mb-2 flex flex-wrap gap-2"
                        style={{
                          background: "#F1F7F4",
                          border: "1px solid #D5E2DD",
                        }}
                      >
                        <span
                          className="text-[11px] font-bold"
                          style={{
                            color: "#2F4A43",
                            fontSize: lang === "ur" ? 14 : 11,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {xLabels[hoverIdx] ||
                            (lang === "ur"
                              ? `دن ${hoverIdx + 1}`
                              : `Day ${hoverIdx + 1}`)}
                        </span>
                        {shownSeries.map((s) => (
                          <span
                            key={s.label}
                            className="text-[11px] font-semibold"
                            style={{
                              color: s.color,
                              fontSize: lang === "ur" ? 13 : 11,
                              fontFamily:
                                lang === "ur"
                                  ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                  : "inherit",
                            }}
                          >
                            {tr(s.label)
                              .replace(" ریٹ", "")
                              .replace(" Rate", "")}{" "}
                            {lang === "ur" ? "روپے" : "Rs."}{" "}
                            {Math.round(s.data[hoverIdx]).toLocaleString()}
                          </span>
                        ))}
                      </div>
                    )}
                    <svg
                      viewBox={`0 0 ${CW} ${CH}`}
                      className="w-full"
                      style={{ height: CH, display: "block" }}
                      onMouseMove={(e) => {
                        const rect = (
                          e.currentTarget as SVGSVGElement
                        ).getBoundingClientRect();
                        const relX =
                          ((e.clientX - rect.left) / rect.width) * CW - PL;
                        const i = Math.round((relX / chartW) * (len - 1));
                        setHoverIdx(Math.max(0, Math.min(len - 1, i)));
                      }}
                      onMouseLeave={() => setHoverIdx(null)}
                      onTouchMove={(e) => {
                        const rect = (
                          e.currentTarget as SVGSVGElement
                        ).getBoundingClientRect();
                        const touch = e.touches[0];
                        const relX =
                          ((touch.clientX - rect.left) / rect.width) * CW - PL;
                        const i = Math.round((relX / chartW) * (len - 1));
                        setHoverIdx(Math.max(0, Math.min(len - 1, i)));
                      }}
                      onTouchEnd={() => setHoverIdx(null)}
                    >
                      {/* Y-axis gridlines + labels */}
                      {yPriceTicks.map((tick, ti) => {
                        const y = yOf(tick, pMin, pMax);
                        return (
                          <g key={ti}>
                            <line
                              x1={PL}
                              y1={y}
                              x2={CW - PR}
                              y2={y}
                              stroke="#E8EFEC"
                              strokeWidth="1"
                            />
                            <text
                              x={PL - 4}
                              y={y + 4}
                              textAnchor="end"
                              fontSize="9"
                              fill="#80918B"
                            >
                              {tick >= 1000
                                ? (tick / 1000).toFixed(1) + "k"
                                : tick}
                            </text>
                          </g>
                        );
                      })}
                      {/* X-axis labels */}
                      {xLabels.map((lbl, i) =>
                        lbl ? (
                          <text
                            key={i}
                            x={xOf(i, len)}
                            y={CH - 4}
                            textAnchor="middle"
                            fontSize={lang === "ur" ? "10" : "9"}
                            fill="#80918B"
                            fontFamily={
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit"
                            }
                          >
                            {lbl}
                          </text>
                        ) : null,
                      )}
                      {/* Lines */}
                      {shownSeries.map((s) => {
                        const pts = s.data
                          .map(
                            (v, i) =>
                              `${
                                i === 0 ? "M" : "L"
                              }${xOf(i, len).toFixed(1)},${yOf(v, pMin, pMax).toFixed(1)}`,
                          )
                          .join(" ");
                        return (
                          <path
                            key={s.label}
                            d={pts}
                            stroke={s.color}
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                          />
                        );
                      })}
                      {/* Hover crosshair */}
                      {hoverIdx !== null && (
                        <>
                          <line
                            x1={xOf(hoverIdx, len)}
                            y1={PT}
                            x2={xOf(hoverIdx, len)}
                            y2={CH - PB}
                            stroke="#2F4A43"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                          />
                          {shownSeries.map((s) => (
                            <circle
                              key={s.label}
                              cx={xOf(hoverIdx!, len)}
                              cy={yOf(s.data[hoverIdx!], pMin, pMax)}
                              r="4"
                              fill={s.color}
                              stroke="#fff"
                              strokeWidth="1.5"
                            />
                          ))}
                        </>
                      )}
                      {/* Axes */}
                      <line
                        x1={PL}
                        y1={PT}
                        x2={PL}
                        y2={CH - PB}
                        stroke="#C7D6D0"
                        strokeWidth="1"
                      />
                      <line
                        x1={PL}
                        y1={CH - PB}
                        x2={CW - PR}
                        y2={CH - PB}
                        stroke="#C7D6D0"
                        strokeWidth="1"
                      />
                      {/* X-axis label */}
                      <text
                        x={(PL + CW - PR) / 2}
                        y={CH - 4}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        fill="#52635F"
                        fontFamily={
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit"
                        }
                      >
                        {lang === "ur" ? "دن" : "Days"}
                      </text>
                      {/* Y-axis label */}
                      <text
                        x={12}
                        y={(PT + CH - PB) / 2}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        fill="#52635F"
                        transform={`rotate(-90, 12, ${(PT + CH - PB) / 2})`}
                        fontFamily={
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit"
                        }
                      >
                        {lang === "ur"
                          ? "قیمت (روپے/۴۰ کلو)"
                          : "Price (Rs/40kg)"}
                      </text>
                    </svg>
                  </div>
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{
                      color: "#52635F",
                      letterSpacing: "0.05em",
                      fontSize: lang === "ur" ? 15 : 12,
                      fontFamily:
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit",
                    }}
                  >
                    {lang === "ur" ? "نرخ کی اقسام" : "Price Types"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* All / سب Button */}
                    <button
                      onClick={() => {
                        if (activeTypes.length === ALL_RATE_TYPES.length) {
                          setActiveTypes([initialRateType || "Retail"]);
                        } else {
                          setActiveTypes([...ALL_RATE_TYPES]);
                        }
                      }}
                      className="tap-target flex items-center gap-1 rounded-full font-bold"
                      style={{
                        fontSize: lang === "ur" ? 14 : 11,
                        padding: "4px 10px",
                        background:
                          activeTypes.length === ALL_RATE_TYPES.length
                            ? "#087F63"
                            : "#E8EFEC",
                        border:
                          "1.5px solid " +
                          (activeTypes.length === ALL_RATE_TYPES.length
                            ? "#087F63"
                            : "#D5E2DD"),
                        color:
                          activeTypes.length === ALL_RATE_TYPES.length
                            ? "#fff"
                            : "#52635F",
                        fontFamily:
                          lang === "ur"
                            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                            : "inherit",
                      }}
                    >
                      {lang === "ur" ? "سب" : "All"}
                    </button>

                    {ALL_RATE_TYPES.map((tRt) => {
                      const on = activeTypes.includes(tRt);
                      return (
                        <button
                          key={tRt}
                          onClick={() => toggleType(tRt)}
                          className="tap-target flex items-center gap-1 rounded-full font-semibold"
                          style={{
                            fontSize: lang === "ur" ? 14 : 10,
                            padding: "4px 8px",
                            background: on ? "#fff" : "#E8EFEC",
                            border: `1.5px solid ${
                              on ? RATE_COLORS[tRt] : "#D5E2DD"
                            }`,
                            color: on ? "#183B34" : "#80918B",
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          <span
                            className="rounded-full flex-shrink-0"
                            style={{
                              width: 7,
                              height: 7,
                              background: on ? RATE_COLORS[tRt] : "#C7D6D0",
                            }}
                          />
                          {on ? " " : ""}
                          {tr(tRt).replace(" ریٹ", "").replace(" Rate", "")}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Interactive arrival chart */
                <div
                  className="rounded-2xl px-3 pt-3 pb-2"
                  style={{ background: "#F4FAF7", border: "1px solid #D5E2DD" }}
                >
                  {arrivalHoverIdx !== null && (
                    <div
                      className="rounded-xl px-3 py-2 mb-2"
                      style={{
                        background: "#FFF0C7",
                        border: "1px solid #F2D58A",
                      }}
                    >
                      <span
                        className="text-[11px] font-bold"
                        style={{
                          color: "#9A6817",
                          fontSize: lang === "ur" ? 14 : 11,
                          fontFamily:
                            lang === "ur"
                              ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                              : "inherit",
                        }}
                      >
                        {xLabels[arrivalHoverIdx] ||
                          (lang === "ur"
                            ? `دن ${arrivalHoverIdx + 1}`
                            : `Day ${arrivalHoverIdx + 1}`)}
                      </span>
                      <span
                        className="text-[11px] font-semibold ml-2"
                        style={{
                          color: "#9A6817",
                          fontSize: lang === "ur" ? 14 : 11,
                          fontFamily:
                            lang === "ur"
                              ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                              : "inherit",
                        }}
                      >
                        {Math.round(
                          arrivalData[arrivalHoverIdx],
                        ).toLocaleString()}{" "}
                        {lang === "ur" ? "میٹرک ٹن" : "MT"}
                      </span>
                    </div>
                  )}
                  <svg
                    viewBox={`0 0 ${CW} ${CH}`}
                    className="w-full"
                    style={{ height: CH, display: "block" }}
                    onMouseMove={(e) => {
                      const rect = (
                        e.currentTarget as SVGSVGElement
                      ).getBoundingClientRect();
                      const relX =
                        ((e.clientX - rect.left) / rect.width) * CW - PL;
                      const i = Math.round((relX / chartW) * (len - 1));
                      setArrivalHoverIdx(Math.max(0, Math.min(len - 1, i)));
                    }}
                    onMouseLeave={() => setArrivalHoverIdx(null)}
                    onTouchMove={(e) => {
                      const rect = (
                        e.currentTarget as SVGSVGElement
                      ).getBoundingClientRect();
                      const touch = e.touches[0];
                      const relX =
                        ((touch.clientX - rect.left) / rect.width) * CW - PL;
                      const i = Math.round((relX / chartW) * (len - 1));
                      setArrivalHoverIdx(Math.max(0, Math.min(len - 1, i)));
                    }}
                    onPointerLeave={() => setArrivalHoverIdx(null)}
                  >
                    {yArrivalTicks.map((tick, ti) => {
                      const y = yOf(tick, aMin, aMax);
                      return (
                        <g key={ti}>
                          <line
                            x1={PL}
                            y1={y}
                            x2={CW - PR}
                            y2={y}
                            stroke="#E8EFEC"
                            strokeWidth="1"
                          />
                          <text
                            x={PL - 4}
                            y={y + 4}
                            textAnchor="end"
                            fontSize="9"
                            fill="#80918B"
                          >
                            {tick >= 1000
                              ? (tick / 1000).toFixed(1) + "k"
                              : Math.round(tick)}
                          </text>
                        </g>
                      );
                    })}
                    {xLabels.map((lbl, i) =>
                      lbl ? (
                        <text
                          key={i}
                          x={xOf(i, len)}
                          y={CH - 4}
                          textAnchor="middle"
                          fontSize={lang === "ur" ? "10" : "9"}
                          fill="#80918B"
                          fontFamily={
                            lang === "ur"
                              ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                              : "inherit"
                          }
                        >
                          {lbl}
                        </text>
                      ) : null,
                    )}
                    {/* Area fill */}
                    <path
                      d={[
                        ...arrivalData.map(
                          (v, i) =>
                            `${
                              i === 0 ? "M" : "L"
                            }${xOf(i, len).toFixed(1)},${yOf(v, aMin, aMax).toFixed(1)}`,
                        ),
                        `L${xOf(len - 1, len)},${CH - PB}`,
                        `L${PL},${CH - PB}`,
                        "Z",
                      ].join(" ")}
                      fill="#B9822E"
                      fillOpacity="0.12"
                    />
                    <path
                      d={arrivalData
                        .map(
                          (v, i) =>
                            `${
                              i === 0 ? "M" : "L"
                            }${xOf(i, len).toFixed(1)},${yOf(v, aMin, aMax).toFixed(1)}`,
                        )
                        .join(" ")}
                      stroke="#B9822E"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {arrivalHoverIdx !== null && (
                      <>
                        <line
                          x1={xOf(arrivalHoverIdx, len)}
                          y1={PT}
                          x2={xOf(arrivalHoverIdx, len)}
                          y2={CH - PB}
                          stroke="#9A6817"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                        <circle
                          cx={xOf(arrivalHoverIdx, len)}
                          cy={yOf(arrivalData[arrivalHoverIdx], aMin, aMax)}
                          r="4.5"
                          fill="#B9822E"
                          stroke="#fff"
                          strokeWidth="1.5"
                        />
                      </>
                    )}
                    <line
                      x1={PL}
                      y1={PT}
                      x2={PL}
                      y2={CH - PB}
                      stroke="#C7D6D0"
                      strokeWidth="1"
                    />
                    <line
                      x1={PL}
                      y1={CH - PB}
                      x2={CW - PR}
                      y2={CH - PB}
                      stroke="#C7D6D0"
                      strokeWidth="1"
                    />
                    {/* X-axis label */}
                    <text
                      x={(PL + CW - PR) / 2}
                      y={CH - 4}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill="#52635F"
                      fontFamily={
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit"
                      }
                    >
                      {lang === "ur" ? "دن" : "Days"}
                    </text>
                    {/* Y-axis label */}
                    <text
                      x={12}
                      y={(PT + CH - PB) / 2}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill="#52635F"
                      transform={`rotate(-90, 12, ${(PT + CH - PB) / 2})`}
                      fontFamily={
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit"
                      }
                    >
                      {lang === "ur" ? "آمد (میٹرک ٹن)" : "Arrivals (MT)"}
                    </text>
                  </svg>
                </div>
              )}

              <div
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "#F1F7F4", border: "1px dashed #C7E8D8" }}
              >
                <div className="flex-1">
                  <p
                    className="font-bold text-sm"
                    style={{
                      fontSize: lang === "ur" ? 17 : 14,
                      fontFamily:
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit",
                    }}
                  >
                    {lang === "ur"
                      ? "پرانا ریکارڈ درکار ہے؟"
                      : "Need older data?"}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: "#52635F",
                      fontSize: lang === "ur" ? 13 : 12,
                      fontFamily:
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit",
                    }}
                  >
                    {lang === "ur"
                      ? "ہماری ٹیم سے رابطہ کریں۔"
                      : "Ask our team for history beyond what's shown."}
                  </p>
                </div>
                <button
                  onClick={() => setHistOpen(true)}
                  className="tap-target flex-shrink-0 rounded-xl px-3 py-2.5 font-bold text-xs text-white"
                  style={{
                    background: "#087F63",
                    fontSize: lang === "ur" ? 15 : 12,
                    fontFamily:
                      lang === "ur"
                        ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "درخواست کریں ←" : "Request →"}
                </button>
              </div>
            </>
          )}
      </div>

      {msgModal && (
        <ZMMessageModal msg={msgModal} onClose={() => setMsgModal(null)} />
      )}
      {histOpen && (
        <HistoricalRequestSheet
          subject={title}
          onClose={() => setHistOpen(false)}
        />
      )}
      {locSheet &&
        (() => {
          // Only show mandis that have data under current filters (rate type aware)
          const filteredForMandis = allRows.filter(
            (r) => !attrRateType || r.rateType === attrRateType,
          );
          const availMandis = [
            ...new Set(filteredForMandis.map((r) => r.mandiName)),
          ];
          return (
            <div
              className="zm-sheet-overlay"
              style={{ zIndex: 250 }}
              onClick={() => setLocSheet(false)}
            >
              <div
                className="zm-sheet-high"
                style={{ background: "#F4FAF7", maxHeight: "70vh" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="px-5 pt-4 pb-3 flex-shrink-0"
                  style={{ borderBottom: "1px solid #D5E2DD" }}
                >
                  <div
                    className="w-10 h-1 rounded-full mx-auto mb-3"
                    style={{ background: "#C7D6D0" }}
                  />
                  <p
                    className="font-bold text-lg"
                    style={{
                      fontSize: lang === "ur" ? 20 : 18,
                      fontFamily:
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit",
                    }}
                  >
                    {lang === "ur" ? "منڈی منتخب کریں" : "Select Mandi"}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color: "#52635F",
                      fontSize: lang === "ur" ? 14 : 12,
                      fontFamily:
                        lang === "ur"
                          ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                          : "inherit",
                    }}
                  >
                    {lang === "ur"
                      ? `وہ منڈیاں جہاں ${tc(title)} دستیاب ہے`
                      : `Mandis where ${title} is available`}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
                  {/* All Pakistan option */}
                  <button
                    onClick={() => {
                      setLocScope({ kind: "pakistan", label: "All Pakistan" });
                      setLocSheet(false);
                    }}
                    className="tap-target flex items-center gap-3 rounded-2xl px-4"
                    style={{
                      background:
                        locScope.kind === "pakistan" ? "#E4F2EC" : "#F1F7F4",
                      border:
                        locScope.kind === "pakistan"
                          ? "1.5px solid #087F63"
                          : "1px solid #D5E2DD",
                      minHeight: 48,
                    }}
                  >
                    <span
                      className={`flex-1 ${lang === "ur" ? "text-right" : "text-left"} font-semibold text-sm`}
                      style={{
                        color:
                          locScope.kind === "pakistan" ? "#075E4F" : "#183B34",
                        fontSize: lang === "ur" ? 17 : 14,
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                      }}
                    >
                      {lang === "ur" ? "پورا پاکستان" : "All Pakistan"}
                    </span>
                    {locScope.kind === "pakistan" && (
                      <span style={{ color: "#087F63", fontWeight: 800 }}>
                        ✓
                      </span>
                    )}
                  </button>
                  {availMandis.map((mandiName) => {
                    const isActive =
                      locScope.kind === "mandi" && locScope.label === mandiName;
                    return (
                      <button
                        key={mandiName}
                        onClick={() => {
                          setLocScope({ kind: "mandi", label: mandiName });
                          setLocSheet(false);
                        }}
                        className="tap-target flex items-center gap-3 rounded-2xl px-4"
                        style={{
                          background: isActive ? "#E4F2EC" : "#F1F7F4",
                          border: isActive
                            ? "1.5px solid #087F63"
                            : "1px solid #D5E2DD",
                          minHeight: 48,
                        }}
                      >
                        <span
                          className={`flex-1 ${lang === "ur" ? "text-right" : "text-left"} font-semibold text-sm`}
                          style={{
                            color: isActive ? "#075E4F" : "#183B34",
                            fontSize: lang === "ur" ? 17 : 14,
                            fontFamily:
                              lang === "ur"
                                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                : "inherit",
                          }}
                        >
                          {tm(mandiName)}
                        </span>
                        {isActive && (
                          <span style={{ color: "#087F63", fontWeight: 800 }}>
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      {dateSheet && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 200 }}
          onClick={() => setDateSheet(false)}
        >
          <div
            className="zm-sheet"
            style={{ background: "#F4FAF7" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-5 pt-4 pb-3"
              style={{ borderBottom: "1px solid #D5E2DD" }}
            >
              <div
                className="w-10 h-1 rounded-full mx-auto mb-3"
                style={{ background: "#C7D6D0" }}
              />
              <p
                className="font-bold text-lg"
                style={{
                  fontSize: lang === "ur" ? 20 : 18,
                  fontFamily:
                    lang === "ur"
                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                      : "inherit",
                }}
              >
                {lang === "ur" ? "تاریخ منتخب کریں" : "Select Date"}
              </p>
              <p
                className="text-xs"
                style={{
                  color: "#52635F",
                  fontSize: lang === "ur" ? 14 : 12,
                  fontFamily:
                    lang === "ur"
                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                      : "inherit",
                }}
              >
                {lang === "ur"
                  ? "تاریخ کے مطابق موازنہ کریں"
                  : "Filter comparison by date or range"}
              </p>
            </div>
            <div className="p-4 flex flex-col gap-2 pb-8">
              {[
                {
                  id: "today" as const,
                  label: lang === "ur" ? "آج" : "Today",
                  dateLabel:
                    lang === "ur"
                      ? "۱۷ اگست ۲۰۲۶ · منگل"
                      : "17 Aug 2026 · Tuesday",
                  sub:
                    lang === "ur"
                      ? "تازہ ترین دستیاب نرخ"
                      : "Latest available rates",
                  icon: "",
                },
                {
                  id: "date" as const,
                  label: lang === "ur" ? "گزشتہ کل" : "Yesterday",
                  dateLabel:
                    lang === "ur"
                      ? "۱۶ اگست ۲۰۲۶ · پیر"
                      : "16 Aug 2026 · Monday",
                  sub: lang === "ur" ? "پچھلے دن کے نرخ" : "Previous day rates",
                  icon: "",
                },
                {
                  id: "range" as const,
                  label: lang === "ur" ? "اس ہفتے" : "This Week",
                  dateLabel:
                    lang === "ur" ? "۱۱ تا ۱۷ اگست ۲۰۲۶" : "11 – 17 Aug 2026",
                  sub:
                    lang === "ur"
                      ? "متعدد دنوں کا موازنہ"
                      : "Compare across multiple days",
                  icon: "",
                },
              ].map(({ id, label, dateLabel, sub, icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setDateMode(id);
                    setDateSheet(false);
                  }}
                  className="tap-target rounded-2xl px-4 flex items-center gap-3"
                  style={{
                    background: dateMode === id ? "#E4F2EC" : "#F1F7F4",
                    border:
                      dateMode === id
                        ? "2px solid #087F63"
                        : "1px solid #D5E2DD",
                    minHeight: 56,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <div
                    className={`flex-1 ${lang === "ur" ? "text-right" : "text-left"}`}
                  >
                    <p
                      className="font-bold text-sm"
                      style={{
                        color: dateMode === id ? "#075E4F" : "#183B34",
                        fontSize: lang === "ur" ? 17 : 14,
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-[11px] font-semibold"
                      style={{
                        color: dateMode === id ? "#087F63" : "#2F4A43",
                        fontSize: lang === "ur" ? 13 : 11,
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                      }}
                    >
                      {dateLabel}
                    </p>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{
                        color: "#80918B",
                        fontSize: lang === "ur" ? 12 : 10,
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                            : "inherit",
                      }}
                    >
                      {sub}
                    </p>
                  </div>
                  {dateMode === id && (
                    <span style={{ color: "#087F63", fontWeight: 800 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

//  MANDI LIST

function MandiListScreen({
  push,
  onBack,
}: {
  push: (s: Screen) => void;
  onBack: () => void;
}) {
  const { lang, tm } = useLang();
  const [tab, setTab] = useState<"fav" | "nearby" | "browse">("fav");
  const [mandis, setMandis] = useState<MandiItem[]>(INITIAL_MANDIS);
  const [locPickerOpen, setLocPickerOpen] = useState(false);
  const [locSelections, setLocSelections] = useState<
    {
      kind: LocationScope["kind"];
      label: string;
    }[]
  >([]);

  const toggleFav = (id: string) =>
    setMandis((p) => p.map((m) => (m.id === id ? { ...m, fav: !m.fav } : m)));
  const favMandis = mandis.filter((m) => m.fav);
  const nearbyMandis = [...mandis].sort(
    (a, b) => parseFloat(a.distance) - parseFloat(b.distance),
  );

  const MandiCard = ({ m }: { m: MandiItem }) => (
    <div
      className="flex-shrink-0 rounded-2xl overflow-hidden"
      style={{
        background: "#F4FAF7",
        border: `1.5px solid ${m.fav ? "#E4F2EC" : "#D5E2DD"}`,
      }}
    >
      <div
        className="w-full flex items-center gap-3 p-4 text-left"
        style={{ height: 76, cursor: "pointer" }}
        onClick={() => push({ id: "mandi-detail", mandiId: m.id })}
      >
        <img
          src={HOME_ICONS.mandi}
          alt="Mandi"
          style={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }}
        />
        <div className="flex-1">
          <p className="font-bold text-base">{tm(m.name)}</p>
          <p className="text-xs mt-0.5" style={{ color: "#52635F" }}>
            {tm(m.province)} · {m.distance}
          </p>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(m.id);
          }}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.stopPropagation(), toggleFav(m.id))
          }
          className="tap-target text-xl"
          style={{ color: m.fav ? "#D79A2B" : "#C7D6D0", cursor: "pointer" }}
        >
          {m.fav ? "" : ""}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: "#F1F7F4" }}
    >
      <header
        className="px-4 pt-10 pb-3 flex-shrink-0"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="tap-target w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "#E8EFEC" }}
          >
            {lang === "ur" ? "→" : "←"}
          </button>
          <div>
            <h1 className="font-extrabold text-xl">
              {lang === "ur" ? "منڈیاں" : "Mandis"}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          {(["fav", "nearby", "browse"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="tap-target flex-1 rounded-2xl font-bold text-xs"
              style={{
                height: 44,
                background: tab === t ? "#087F63" : "#E8EFEC",
                color: tab === t ? "#fff" : "#183B34",
              }}
            >
              {t === "fav"
                ? lang === "ur"
                  ? "پسندیدہ"
                  : " Favourites"
                : t === "nearby"
                  ? lang === "ur"
                    ? "قریب"
                    : " Nearby"
                  : lang === "ur"
                    ? "براؤز"
                    : " Browse"}
            </button>
          ))}
        </div>
      </header>
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-3 pb-4 flex flex-col gap-2">
        {tab === "fav" &&
          (favMandis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-50">
              <span style={{ fontSize: 48 }}></span>
              <p className="font-semibold text-center">
                {lang === "ur" ? "کوئی پسندیدہ نہیں۔" : "No favourites yet."}
                <br />
                {lang === "ur"
                  ? "منڈی پن کرنے کے لیے ٹیپ کریں۔"
                  : "Tap to pin a mandi."}
              </p>
            </div>
          ) : (
            favMandis.map((m) => <MandiCard key={m.id} m={m} />)
          ))}
        {tab === "nearby" &&
          nearbyMandis.map((m) => <MandiCard key={m.id} m={m} />)}
        {tab === "browse" && (
          <>
            <button
              onClick={() => setLocPickerOpen(true)}
              className="tap-target rounded-2xl flex items-center gap-3 px-4"
              style={{
                height: 56,
                background: "#F4FAF7",
                border: "1.5px dashed #C7D6D0",
              }}
            >
              <span className="text-xl"></span>
              <span
                className="font-semibold text-sm"
                style={{ color: "#52635F" }}
              >
                {locSelections.length > 0
                  ? locSelections.map((s) => s.label).join(", ")
                  : "Select Location — Province · District · Mandi"}
              </span>
              {locSelections.length > 0 && (
                <span
                  className="ml-auto text-xs font-bold rounded-full px-2 py-0.5"
                  style={{ background: "#E4F2EC", color: "#087F63" }}
                >
                  {locSelections.length}
                </span>
              )}
            </button>
            {(() => {
              const browseMandis =
                locSelections.length === 0
                  ? INITIAL_MANDIS
                  : INITIAL_MANDIS.filter((m) =>
                      locSelections.some((sel) => {
                        if (sel.kind === "pakistan") return true;
                        if (sel.kind === "province")
                          return m.province === sel.label;
                        if (sel.kind === "district")
                          return m.city === sel.label;
                        if (sel.kind === "mandi") return m.name === sel.label;
                        return false;
                      }),
                    );
              return browseMandis.map((m) => <MandiCard key={m.id} m={m} />);
            })()}
          </>
        )}
      </div>
      {locPickerOpen && (
        <MultiLocSheet
          selected={locSelections}
          onApply={(locs) => {
            setLocSelections(locs);
            setLocPickerOpen(false);
          }}
          onClose={() => setLocPickerOpen(false)}
        />
      )}
    </div>
  );
}

function MandiDetailScreen({
  mandiId,
  onBack,
  push,
}: {
  mandiId: string;
  onBack: () => void;
  push: (s: Screen) => void;
}) {
  const mandi = INITIAL_MANDIS.find((m) => m.id === mandiId)!;
  const rows = MANDI_ROWS[mandiId] || [];
  const [rateFilter, setRateFilter] = useState("");
  const [rateSheet, setRateSheet] = useState(false);
  const [msgModal, setMsgModal] = useState<FeedMsg | null>(null);
  const [selectedproduct, setSelectedproduct] = useState<string | null>(null);
  const [selectedBP, setSelectedBP] = useState<string | null>(null);
  const [selectedRateTypes, setSelectedRateTypes] = useState<string[]>([]);

  const mandiproducts = [...new Set(rows.map((r) => r.product))];
  const mandiByproducts = [
    ...new Set(
      rows
        .filter((r) => !selectedproduct || r.product === selectedproduct)
        .map((r) => r.byproduct),
    ),
  ];

  const displayed = rows.filter((r) => {
    if (selectedproduct && r.product !== selectedproduct) return false;
    if (selectedBP && r.byproduct !== selectedBP) return false;
    if (selectedRateTypes.length > 0 && !selectedRateTypes.includes(r.rateType))
      return false;
    if (rateFilter && r.rateType !== rateFilter) return false;
    return true;
  });

  // Find vertical for a product
  const getVertical = (product: string): string => {
    for (const [v, vData] of Object.entries(VERTICALS)) {
      if (Object.keys(vData.products || {}).includes(product)) return v;
    }
    return "Grains";
  };

  const rowToMsg = (r: (typeof rows)[0]): FeedMsg => {
    const ex = FEED_MESSAGES.find(
      (m) => m.product === r.product && m.station === mandi.name,
    );
    if (ex) return ex;
    return {
      id: Date.now(),
      time: "Today",
      vertical: "Grains",
      productUrdu: r.product,
      product: r.product,
      byproduct: r.byproduct,
      stationUrdu: mandi.city,
      station: mandi.name,
      province: mandi.province,
      priceMin: r.min,
      priceMax: r.max,
      unit: "40 kg",
      arrivalCount: r.arrival,
      arrivalUnit: "",
      arrivalUnitUrdu: "",
      colorUrdu: "—",
      color: "—",
      rateType: r.rateType,
      specUrdu: "خشک",
      spec: "Dry",
      qualityUrdu: "نئی",
      quality: "New",
      qualityTypeUrdu: "تجارتی",
      qualityType: "Trade",
      trend: r.trend,
      trendPct: r.trendPct,
    };
  };

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: "#F1F7F4" }}
    >
      <header
        className="px-4 pt-10 pb-3 flex-shrink-0"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="tap-target w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "#E8EFEC" }}
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="font-extrabold text-xl">{mandi.name}</h1>
            <p className="text-xs" style={{ color: "#52635F" }}>
              {mandi.province}
            </p>
          </div>
        </div>
        {/* Row 1: Product chips */}
        <ScrollRow bg="#fff" style={{ borderTop: "1px solid #E8EFEC" }}>
          <span
            className="flex-shrink-0 text-[10px] font-extrabold uppercase tracking-wider mr-1"
            style={{ color: "#80918B", minWidth: 32 }}
          >
            Prod
          </span>
          <button
            onClick={() => {
              setSelectedproduct(null);
              setSelectedBP(null);
            }}
            className="tap-target flex-shrink-0 rounded-full font-semibold text-xs px-3 py-2"
            style={{
              background: !selectedproduct ? "#087F63" : "#E8EFEC",
              color: !selectedproduct ? "#fff" : "#52635F",
              border: !selectedproduct ? "none" : "1px solid #D5E2DD",
            }}
          >
            All
          </button>
          {mandiproducts.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedproduct(selectedproduct === c ? null : c);
                setSelectedBP(null);
              }}
              className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-semibold text-xs px-3 py-2"
              style={{
                background: selectedproduct === c ? "#087F63" : "#E8EFEC",
                color: selectedproduct === c ? "#fff" : "#52635F",
                border: selectedproduct === c ? "none" : "1px solid #D5E2DD",
              }}
            >
              <ProductIcon
                name={c}
                vertical={
                  Object.entries(VERTICALS).find(
                    ([, vd]) => vd.products[c],
                  )?.[0]
                }
                size={13}
                style={{
                  filter:
                    selectedproduct === c ? "brightness(0) invert(1)" : "none",
                  flexShrink: 0,
                }}
              />
              {c}
            </button>
          ))}
        </ScrollRow>
        {/* Row 2: By-product chips */}
        <ScrollRow bg="#fff" style={{ borderTop: "1px solid #E8EFEC" }}>
          <span
            className="flex-shrink-0 text-[10px] font-extrabold uppercase tracking-wider mr-1"
            style={{ color: "#80918B", minWidth: 32 }}
          >
            ByP
          </span>
          <button
            onClick={() => setSelectedBP(null)}
            className="tap-target flex-shrink-0 rounded-full font-semibold text-xs px-3 py-2"
            style={{
              background: !selectedBP ? "#087F63" : "#E8EFEC",
              color: !selectedBP ? "#fff" : "#52635F",
              border: !selectedBP ? "none" : "1px solid #D5E2DD",
            }}
          >
            All
          </button>
          {mandiByproducts.map((bp) => (
            <button
              key={bp}
              onClick={() => setSelectedBP(selectedBP === bp ? null : bp)}
              className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-semibold text-xs px-3 py-2"
              style={{
                background: selectedBP === bp ? "#087F63" : "#E8EFEC",
                color: selectedBP === bp ? "#fff" : "#52635F",
                border: selectedBP === bp ? "none" : "1px solid #D5E2DD",
              }}
            >
              <ProductIcon
                name={bp}
                vertical={
                  selectedproduct
                    ? Object.entries(VERTICALS).find(
                        ([, vd]) => vd.products[selectedproduct],
                      )?.[0]
                    : undefined
                }
                size={13}
                style={{
                  filter:
                    selectedBP === bp ? "brightness(0) invert(1)" : "none",
                  flexShrink: 0,
                }}
              />
              {bp}
            </button>
          ))}
        </ScrollRow>
        {/* Row 3: Price type chips */}
        <ScrollRow bg="#fff" style={{ borderTop: "1px solid #E8EFEC" }}>
          <span
            className="flex-shrink-0 text-[10px] font-extrabold uppercase tracking-wider mr-1"
            style={{ color: "#80918B", minWidth: 32 }}
          >
            Price
          </span>
          <button
            onClick={() => setSelectedRateTypes([])}
            className="tap-target flex-shrink-0 rounded-full font-semibold text-xs px-3 py-2"
            style={{
              background:
                selectedRateTypes.length === 0 ? "#087F63" : "#E8EFEC",
              color: selectedRateTypes.length === 0 ? "#fff" : "#52635F",
              border:
                selectedRateTypes.length === 0 ? "none" : "1px solid #D5E2DD",
            }}
          >
            All
          </button>
          {ALL_RATE_TYPES.map((rt) => {
            const on = selectedRateTypes.includes(rt);
            return (
              <button
                key={rt}
                onClick={() =>
                  setSelectedRateTypes((p) =>
                    p.includes(rt) ? p.filter((x) => x !== rt) : [...p, rt],
                  )
                }
                className="tap-target flex-shrink-0 rounded-full font-semibold text-xs px-3 py-2"
                style={{
                  background: on ? "#087F63" : "#E8EFEC",
                  color: on ? "#fff" : "#80918B",
                  border: on ? "none" : "1px solid #D5E2DD",
                }}
              >
                {rt.replace(" Rate", "")}
              </button>
            );
          })}
        </ScrollRow>
      </header>
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-3 pb-4 flex flex-col gap-3">
        {displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 opacity-50">
            <span style={{ fontSize: 40 }}></span>
            <p className="font-semibold mt-2">No results</p>
          </div>
        )}
        {displayed.map((r, i) => (
          <div key={i} className="flex-shrink-0">
            <RateCard
              r={{
                ...r,
                mandiName: mandi.name,
                mandiCity: mandi.city,
                province: mandi.province,
              }}
              onClick={() => {
                const ma = MANDI_ATTR_AVAILABLE[mandi.name];
                push({
                  id: "product-rates",
                  vertical: getVertical(r.product),
                  product: r.product,
                  byproduct: r.byproduct,
                  initialRateType: r.rateType,
                  initialMandi: mandi.name,
                  initialVariety: ma?.variety?.[0],
                  initialNewOld: ma?.newold?.[0],
                  initialColor: ma?.color?.[0],
                  initialSpec: ma?.spec?.[0],
                  initialCondition: ma?.condition?.[0],
                });
              }}
            />
          </div>
        ))}
      </div>
      {rateSheet && (
        <PriceTypeSheet
          selected={rateFilter ? [rateFilter] : []}
          onApply={(ts) => setRateFilter(ts[0] || "")}
          onClose={() => setRateSheet(false)}
        />
      )}
      {msgModal && (
        <ZMMessageModal msg={msgModal} onClose={() => setMsgModal(null)} />
      )}
    </div>
  );
}

//  ANALYTICS

function genPts(base: number, len: number, vol = 0.035) {
  const pts: number[] = [];
  let c = base;
  for (let i = 0; i < len; i++) {
    c = c * (1 + (Math.random() - 0.47) * vol);
    pts.push(Math.round(c));
  }
  return pts;
}
function LineChart({
  data,
  color = "#2FAE68",
  height = 110,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  if (!data.length) return null;
  const w = 320,
    pd = 4,
    mn = Math.min(...data),
    mx = Math.max(...data),
    rng = mx - mn || 1;
  const pts = data.map((v, i) => [
    (pd + (i / (data.length - 1)) * (w - pd * 2)).toFixed(1),
    (pd + ((mx - v) / rng) * (height - pd * 2)).toFixed(1),
  ]);
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient
          id={`g${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={path + ` L${w - pd},${height} L${pd},${height} Z`}
        fill={`url(#g${color.replace("#", "")})`}
      />
      <path
        d={path}
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.length > 0 && (
        <circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r="4"
          fill={color}
          stroke="#fff"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
function MiniSparkline({
  data,
  color = "#2FAE68",
}: {
  data: number[];
  color?: string;
}) {
  if (data.length < 2) return null;
  const w = 60,
    h = 24,
    mn = Math.min(...data),
    mx = Math.max(...data),
    rng = mx - mn || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - mn) / rng) * h,
  ]);
  const path = pts
    .map(
      (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={60} height={24}>
      <path
        d={path}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

const A_MANDIS_LIST = [
  "Pakpattan",
  "Sahiwal",
  "Lahore",
  "Multan",
  "Faisalabad",
];
const MANDI_COLORS = ["#2FAE68", "#249985", "#D95A51", "#D79A2B", "#2A9D87"];

function AnalyticsScreen() {
  const { lang, t, tc, tr } = useLang();
  const [subTab, setSubTab] = useState<AnalyticsTab>("trends");
  const [product, setproduct] = useState("Wheat");
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [priceType, setPriceType] = useState("Mill Rate");
  const [compareSel, setCompareSel] = useState<string[]>([
    "Pakpattan",
    "Lahore",
  ]);
  const [regionProvince, setRegionProvince] = useState("Punjab");
  const [regionDistrict, setRegionDistrict] = useState("Rahim Yar Khan");
  const [comSheet, setComSheet] = useState(false);
  const [rateSheet, setRateSheet] = useState(false);
  const [locSheet, setLocSheet] = useState(false);
  const [analyticsSelectedBP, setAnalyticsSelectedBP] = useState<string | null>(
    null,
  );
  const [analyticsSelectedRateTypes, setAnalyticsSelectedRateTypes] = useState<
    string[]
  >([]);

  const BASE: Record<string, number> = {
    Wheat: 2850,
    Cotton: 8400,
    Rice: 5200,
    Maize: 2150,
    Mustard: 5900,
    Sugar: 460,
  };
  const base = BASE[product] || 2850;
  const LEN: Record<TimeRange, number> = {
    day: 24,
    week: 7,
    month: 30,
    year: 12,
  };
  const XL: Record<TimeRange, string[]> = {
    day: Array.from({ length: 24 }, (_, i) => `${i}h`),
    week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    month: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    year: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };
  const len = LEN[timeRange],
    xl = XL[timeRange];
  const mainData = genPts(base, len);
  const cur = mainData[mainData.length - 1],
    prev = mainData[mainData.length - 2] || cur;
  const trend = cur >= prev ? "up" : "down";
  const trendPct = Math.abs(((cur - prev) / prev) * 100).toFixed(1);
  const RATE_MULTS: Record<string, number> = {
    "Farm Rate": 0.88,
    "Broker Rate": 0.95,
    "Mill Rate": 1.0,
    "Stock Rate": 1.08,
    "Dealer Rate": 1.05,
    "Mandi Rate": 1.0,
    "Export Rate": 1.12,
    "Retail Rate": 1.18,
    "Wholesale Rate": 1.02,
  };
  const allRateSeries = ALL_RATE_TYPES.map((rt) => ({
    label: rt,
    color: RATE_COLORS[rt],
    data: genPts(base * (RATE_MULTS[rt] || 1), len, 0.025),
  }));
  const MANDI_MULT: Record<string, number> = {
    Pakpattan: 1.0,
    Sahiwal: 0.98,
    Lahore: 1.02,
    Multan: 1.01,
    Faisalabad: 1.015,
  };
  const compareSeries = compareSel.map((m) => ({
    label: m,
    color: MANDI_COLORS[A_MANDIS_LIST.indexOf(m) % MANDI_COLORS.length],
    data: genPts(base * (MANDI_MULT[m] || 1), len, 0.03),
  }));
  const regionStations = LOCATIONS[regionProvince]?.[regionDistrict] || [];
  const regionData = regionStations.map((s, i) => ({
    station: s,
    price: Math.round(base * (0.96 + i * 0.015 + Math.random() * 0.02)),
    spark: genPts(base * (0.96 + i * 0.015), 8, 0.02),
    trend: Math.random() > 0.5 ? ("up" as const) : ("down" as const),
  }));
  const decision =
    trend === "up"
      ? ` ${product} rising at ${priceType} level. Selling recommended next 2–3 days.`
      : ` ${product} softening at ${priceType} level. Hold stock 3–5 days.`;

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: "#F1F7F4" }}
    >
      <header
        className="pt-10 pb-0 flex-shrink-0"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        <h1 className="font-extrabold text-xl mb-3 px-4">
          {lang === "ur" ? "تجزیات" : " Analytics"}
        </h1>
        <div className="flex gap-2 overflow-x-auto mb-3 px-4">
          <button
            onClick={() => setComSheet(true)}
            className="tap-target flex-shrink-0 flex items-center gap-1 px-3 rounded-2xl font-semibold text-sm"
            style={{
              height: 44,
              background: "#F1F7F4",
              color: "#087F63",
              border: "1px solid #E4F2EC",
            }}
          >
            {tc(product)}
          </button>
          <button
            onClick={() => setLocSheet(true)}
            className="tap-target flex-shrink-0 flex items-center gap-1 px-3 rounded-2xl font-semibold text-sm"
            style={{
              height: 44,
              background: "#EAF5F1",
              color: "#147D72",
              border: "1px solid #DDEFE9",
            }}
          >
            {regionDistrict}
          </button>
          <button
            onClick={() => setRateSheet(true)}
            className="tap-target flex-shrink-0 flex items-center gap-1 px-3 rounded-2xl font-semibold text-sm"
            style={{
              height: 44,
              background: "#EAF5F1",
              color: "#168A76",
              border: "1px solid #E3F1EC",
            }}
          >
            {priceType}
          </button>
        </div>
        {/* Row 1: By-product chips for current product */}
        {(() => {
          const analyticsBPs = (() => {
            for (const [, vd] of Object.entries(VERTICALS)) {
              const cd = vd.products[product];
              if (cd) return Array.isArray(cd) ? cd : [];
            }
            return [];
          })();
          return analyticsBPs.length > 0 ? (
            <ScrollRow bg="#fff" style={{ borderTop: "1px solid #E8EFEC" }}>
              <span
                className="flex-shrink-0 text-[10px] font-extrabold uppercase tracking-wider mr-1"
                style={{ color: "#80918B", minWidth: 32 }}
              >
                ByP
              </span>
              <button
                onClick={() => setAnalyticsSelectedBP(null)}
                className="tap-target flex-shrink-0 rounded-full font-semibold text-xs px-3 py-2"
                style={{
                  background: !analyticsSelectedBP ? "#087F63" : "#E8EFEC",
                  color: !analyticsSelectedBP ? "#fff" : "#52635F",
                  border: !analyticsSelectedBP ? "none" : "1px solid #D5E2DD",
                }}
              >
                All
              </button>
              {analyticsBPs.map((bp: string) => (
                <button
                  key={bp}
                  onClick={() =>
                    setAnalyticsSelectedBP(
                      analyticsSelectedBP === bp ? null : bp,
                    )
                  }
                  className="tap-target flex-shrink-0 flex items-center gap-1.5 rounded-full font-semibold text-xs px-3 py-2"
                  style={{
                    background:
                      analyticsSelectedBP === bp ? "#087F63" : "#E8EFEC",
                    color: analyticsSelectedBP === bp ? "#fff" : "#52635F",
                    border:
                      analyticsSelectedBP === bp ? "none" : "1px solid #D5E2DD",
                  }}
                >
                  {bp}
                </button>
              ))}
            </ScrollRow>
          ) : null;
        })()}
        {/* Row 2: Price type chips */}
        <ScrollRow bg="#fff" style={{ borderTop: "1px solid #E8EFEC" }}>
          <span
            className="flex-shrink-0 text-[10px] font-extrabold uppercase tracking-wider mr-1"
            style={{ color: "#80918B", minWidth: 32 }}
          >
            Price
          </span>
          <button
            onClick={() => setAnalyticsSelectedRateTypes([])}
            className="tap-target flex-shrink-0 rounded-full font-semibold text-xs px-3 py-2"
            style={{
              background:
                analyticsSelectedRateTypes.length === 0 ? "#087F63" : "#E8EFEC",
              color:
                analyticsSelectedRateTypes.length === 0 ? "#fff" : "#52635F",
              border:
                analyticsSelectedRateTypes.length === 0
                  ? "none"
                  : "1px solid #D5E2DD",
            }}
          >
            All
          </button>
          {ALL_RATE_TYPES.map((rt) => {
            const on = analyticsSelectedRateTypes.includes(rt);
            return (
              <button
                key={rt}
                onClick={() =>
                  setAnalyticsSelectedRateTypes((p) =>
                    p.includes(rt) ? p.filter((x) => x !== rt) : [...p, rt],
                  )
                }
                className="tap-target flex-shrink-0 rounded-full font-semibold text-xs px-3 py-2"
                style={{
                  background: on ? "#087F63" : "#E8EFEC",
                  color: on ? "#fff" : "#80918B",
                  border: on ? "none" : "1px solid #D5E2DD",
                }}
              >
                {rt.replace(" Rate", "")}
              </button>
            );
          })}
        </ScrollRow>
        <div className="flex gap-1.5 overflow-x-auto px-4 py-3">
          {(
            [
              ["trends", lang === "ur" ? "رجحانات" : " Trends"],
              ["allrates", lang === "ur" ? "تمام نرخ" : " All Rates"],
              ["compare", lang === "ur" ? "موازنہ" : " Compare"],
              ["regional", lang === "ur" ? "علاقائی" : " Regional"],
            ] as [AnalyticsTab, string][]
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className="tap-target flex-shrink-0 px-3 rounded-xl font-bold text-xs"
              style={{
                height: 36,
                background: subTab === t ? "#087F63" : "#E8EFEC",
                color: subTab === t ? "#fff" : "#183B34",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-4">
        {subTab === "trends" && (
          <>
            <div className="rounded-2xl p-5" style={{ background: "#087F63" }}>
              <p className="text-green-200 text-xs">
                {priceType} · {product}
              </p>
              <p className="text-4xl font-extrabold mt-1 text-white">
                {fmt(cur)}
              </p>
              <p className="text-green-200 text-sm">/40 KG</p>
              <div className="flex gap-4 mt-3">
                <div>
                  <p className="text-green-200 text-xs">Low</p>
                  <p className="font-bold text-sm text-white">
                    {fmt(Math.min(...mainData))}
                  </p>
                </div>
                <div>
                  <p className="text-green-200 text-xs">High</p>
                  <p className="font-bold text-sm text-white">
                    {fmt(Math.max(...mainData))}
                  </p>
                </div>
                <div>
                  <p className="text-green-200 text-xs">Trend</p>
                  <p className="font-bold text-sm text-white">
                    {trend === "up" ? "" : ""} {trendPct}%
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {(["day", "week", "month", "year"] as TimeRange[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className="tap-target flex-1 rounded-2xl font-bold text-sm capitalize"
                  style={{
                    height: 44,
                    background: timeRange === t ? "#087F63" : "#fff",
                    color: timeRange === t ? "#fff" : "#183B34",
                    border: timeRange === t ? "none" : "1px solid #D5E2DD",
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div
              className="rounded-2xl p-4"
              style={{ background: "#F4FAF7", border: "1px solid #D5E2DD" }}
            >
              <p
                className="text-xs font-semibold mb-3"
                style={{ color: "#52635F" }}
              >
                Rate Trend · {priceType}
              </p>
              <LineChart data={mainData} height={130} />
              <div className="flex justify-between mt-1">
                {[xl[0], xl[Math.floor(xl.length / 2)], xl[xl.length - 1]].map(
                  (l, i) => (
                    <span
                      key={i}
                      className="text-[10px]"
                      style={{ color: "#52635F" }}
                    >
                      {l}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div
              className="rounded-2xl p-4"
              style={{ background: "#FFF8E1", border: "1.5px solid #F2D58A" }}
            >
              <p className="font-bold text-sm mb-2"> AI Decision Estimate</p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#92400e" }}
              >
                {decision}
              </p>
            </div>
          </>
        )}
        {subTab === "allrates" && (
          <>
            <div
              className="rounded-2xl p-4"
              style={{ background: "#F4FAF7", border: "1px solid #D5E2DD" }}
            >
              <p className="text-sm font-bold mb-3">
                {product} · All 9 Price Types
              </p>
              <svg
                viewBox="0 0 320 160"
                className="w-full"
                style={{ height: 160 }}
              >
                {allRateSeries.map((s) => {
                  const w2 = 320,
                    pd2 = 8,
                    allV = s.data,
                    mn2 = Math.min(...allRateSeries.flatMap((x) => x.data)),
                    mx2 = Math.max(...allRateSeries.flatMap((x) => x.data)),
                    rng2 = mx2 - mn2 || 1;
                  const pts = allV.map((v, i) => [
                    (pd2 + (i / (allV.length - 1)) * (w2 - pd2 * 2)).toFixed(1),
                    (pd2 + ((mx2 - v) / rng2) * (160 - pd2 * 2)).toFixed(1),
                  ]);
                  return (
                    <path
                      key={s.label}
                      d={pts
                        .map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`)
                        .join(" ")}
                      stroke={s.color}
                      strokeWidth="1.8"
                      fill="none"
                      strokeLinecap="round"
                      strokeOpacity="0.85"
                    />
                  );
                })}
              </svg>
            </div>
            {allRateSeries.map((s) => (
              <div
                key={s.label}
                className="rounded-xl px-4 py-2.5 flex items-center gap-3"
                style={{ background: "#F4FAF7", border: "1px solid #D5E2DD" }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: s.color }}
                />
                <p className="flex-1 font-semibold text-sm">{s.label}</p>
                <p className="font-bold text-sm" style={{ color: s.color }}>
                  {fmt(s.data[s.data.length - 1])}
                </p>
                <MiniSparkline data={s.data.slice(-8)} color={s.color} />
              </div>
            ))}
          </>
        )}
        {subTab === "compare" && (
          <>
            <div className="flex gap-2 flex-wrap mb-1">
              {A_MANDIS_LIST.map((m, i) => (
                <button
                  key={m}
                  onClick={() =>
                    setCompareSel((p) =>
                      p.includes(m) ? p.filter((x) => x !== m) : [...p, m],
                    )
                  }
                  className="tap-target flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-sm"
                  style={{
                    background: compareSel.includes(m)
                      ? MANDI_COLORS[i]
                      : "#E8EFEC",
                    color: compareSel.includes(m) ? "#fff" : "#183B34",
                  }}
                >
                  {compareSel.includes(m) ? " " : ""}
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(["day", "week", "month", "year"] as TimeRange[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className="tap-target flex-1 rounded-2xl font-bold text-sm capitalize"
                  style={{
                    height: 44,
                    background: timeRange === t ? "#087F63" : "#fff",
                    color: timeRange === t ? "#fff" : "#183B34",
                    border: timeRange === t ? "none" : "1px solid #D5E2DD",
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            {compareSeries.length > 0 && (
              <>
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "#F4FAF7", border: "1px solid #D5E2DD" }}
                >
                  <svg
                    viewBox="0 0 320 160"
                    className="w-full"
                    style={{ height: 160 }}
                  >
                    {compareSeries.map((s) => {
                      const w2 = 320,
                        pd2 = 8,
                        allV2 = compareSeries.flatMap((x) => x.data),
                        mn2 = Math.min(...allV2),
                        mx2 = Math.max(...allV2),
                        rng2 = mx2 - mn2 || 1;
                      const pts = s.data.map((v, i) => [
                        (
                          pd2 +
                          (i / (s.data.length - 1)) * (w2 - pd2 * 2)
                        ).toFixed(1),
                        (pd2 + ((mx2 - v) / rng2) * (160 - pd2 * 2)).toFixed(1),
                      ]);
                      return (
                        <path
                          key={s.label}
                          d={pts
                            .map(
                              (p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`,
                            )
                            .join(" ")}
                          stroke={s.color}
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {compareSeries.map((s) => (
                      <div key={s.label} className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: s.color }}
                        />
                        <span className="text-xs font-semibold">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {compareSeries.map((s) => {
                  const cur2 = s.data[s.data.length - 1],
                    base2 =
                      compareSeries[0].data[compareSeries[0].data.length - 1];
                  const diff = (((cur2 - base2) / base2) * 100).toFixed(1);
                  return (
                    <div
                      key={s.label}
                      className="rounded-2xl px-4 py-3 flex items-center gap-3"
                      style={{
                        background: "#F4FAF7",
                        border: "1px solid #D5E2DD",
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: s.color }}
                      />
                      <p className="flex-1 font-semibold text-sm">{s.label}</p>
                      <p
                        className="font-bold text-base"
                        style={{ color: s.color }}
                      >
                        {fmt(cur2)}
                      </p>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: Number(diff) >= 0 ? "#E4F2EC" : "#F9E1DE",
                          color: Number(diff) >= 0 ? "#147A3F" : "#A83B37",
                        }}
                      >
                        {Number(diff) >= 0 ? "+" : ""}
                        {diff}%
                      </span>
                      <MiniSparkline data={s.data.slice(-8)} color={s.color} />
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
        {subTab === "regional" && (
          <>
            <div
              className="rounded-2xl p-4"
              style={{ background: "#F4FAF7", border: "1px solid #D5E2DD" }}
            >
              <p className="font-bold text-sm mb-2">
                Regional · {regionProvince} · {product}
              </p>
              <div className="flex gap-2 overflow-x-auto">
                {Object.keys(LOCATIONS[regionProvince] || {}).map((d) => (
                  <button
                    key={d}
                    onClick={() => setRegionDistrict(d)}
                    className="tap-target flex-shrink-0 px-3 rounded-xl font-bold text-xs whitespace-nowrap"
                    style={{
                      height: 36,
                      background: regionDistrict === d ? "#087F63" : "#E8EFEC",
                      color: regionDistrict === d ? "#fff" : "#183B34",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            {regionData.map((rd, i) => {
              const maxP = Math.max(...regionData.map((r) => r.price));
              return (
                <div
                  key={i}
                  className="rounded-2xl p-4"
                  style={{ background: "#F4FAF7", border: "1px solid #D5E2DD" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm">{rd.station}</p>
                    <div className="flex items-center gap-2">
                      <p
                        className="font-extrabold text-base"
                        style={{ color: "#087F63" }}
                      >
                        {fmt(rd.price)}
                      </p>
                      <TrendBadge
                        trend={rd.trend}
                        pct={Number((Math.random() * 2 + 0.2).toFixed(1))}
                      />
                    </div>
                  </div>
                  <div
                    className="h-2 rounded-full mb-2"
                    style={{ background: "#E8EFEC" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: MANDI_COLORS[i % MANDI_COLORS.length],
                        width: `${(rd.price / maxP) * 100}%`,
                      }}
                    />
                  </div>
                  <MiniSparkline
                    data={rd.spark}
                    color={rd.trend === "up" ? "#2FAE68" : "#D95A51"}
                  />
                </div>
              );
            })}
            {regionData.length === 0 && (
              <div className="text-center py-8 opacity-40">
                <p className="text-sm">No stations for this district</p>
              </div>
            )}
            <div
              className="rounded-2xl p-4"
              style={{ background: "#F1F7F4", border: "1.5px solid #bbf7d0" }}
            >
              <p className="font-bold text-sm mb-2"> Exporter Insight</p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#14532d" }}
              >
                Best price for {product} in {regionDistrict} is at{" "}
                {regionData[0]?.station || "—"} (
                {fmt(regionData[0]?.price || 0)}). Change district above to
                compare.
              </p>
            </div>
          </>
        )}
      </div>
      {comSheet && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 200 }}
          onClick={() => setComSheet(false)}
        >
          <div
            className="zm-sheet"
            style={{ background: "#F4FAF7", maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 border-b border-[#DCE8E3]">
              <p className="font-bold text-lg">Select product</p>
            </div>
            <div
              className="overflow-y-auto p-4 flex flex-col gap-2"
              style={{ maxHeight: "calc(80vh-68px)" }}
            >
              {Object.entries(VERTICALS).map(([v, vd]) =>
                Object.keys(vd.products).map((c) => (
                  <button
                    key={`${v}${c}`}
                    onClick={() => {
                      setproduct(c);
                      setComSheet(false);
                    }}
                    className="tap-target rounded-2xl px-4 flex items-center gap-3"
                    style={{
                      background: product === c ? "#F1F7F4" : "#F1F7F4",
                      border: `1.5px solid ${
                        product === c ? "#087F63" : "#D5E2DD"
                      }`,
                      minHeight: 48,
                    }}
                  >
                    <SpriteIcon
                      spriteKey={VERTICALS[v]?.icon || "grains"}
                      size={26}
                      style={{ flexShrink: 0 }}
                    />
                    <span className="font-semibold text-sm flex-1">{c}</span>
                    {product === c && (
                      <span
                        className="text-xs font-bold"
                        style={{ color: "#087F63" }}
                      ></span>
                    )}
                  </button>
                )),
              )}
            </div>
          </div>
        </div>
      )}
      {rateSheet && (
        <PriceTypeSheet
          selected={priceType ? [priceType] : []}
          onApply={(ts) => setPriceType(ts[0] || "Mill Rate")}
          onClose={() => setRateSheet(false)}
        />
      )}
      {locSheet && (
        <LocationSheet
          districtOnly
          onSelect={(_p, d) => {
            if (d) {
              setRegionProvince(_p);
              setRegionDistrict(d);
            }
            setLocSheet(false);
          }}
          onClose={() => setLocSheet(false)}
        />
      )}
    </div>
  );
}

// ─── NEWS & VIDEOS ────────────────────────────────────────────────────────────

const NEWS_ITEMS = [
  {
    tag: "Government",
    title: "Wheat Support Price Maintained at Rs. 2,600 for Kharif 2026",
    date: "3 Aug 2026",
    icon: "🌾",
    bg: "#EAF5F1",
    tc: "#147D72",
  },
  {
    tag: "Market",
    title: "Cotton prices hit 3-month high on strong mill demand",
    date: "2 Aug 2026",
    icon: "📈",
    bg: "#F1F7F4",
    tc: "#147A3F",
  },
  {
    tag: "Weather",
    title:
      "Monsoon Advisory: Heavy rains in Sindh — onion supply disruption expected",
    date: "2 Aug 2026",
    icon: "🌧️",
    bg: "#FFF8E1",
    tc: "#92400e",
  },
  {
    tag: "Export",
    title:
      "Pakistan rice exports up 18% YoY — Basmati demand surges in Middle East",
    date: "1 Aug 2026",
    icon: "🚢",
    bg: "#EAF5F1",
    tc: "#168A76",
  },
  {
    tag: "Alert",
    title:
      "Locust threat in south Punjab — spray advisory by Dept. of Agriculture",
    date: "31 Jul 2026",
    icon: "⚠️",
    bg: "#FAE9E6",
    tc: "#A83B37",
  },
];

const VIDEO_ITEMS = [
  {
    title: "Zarai Mandi Weekly Market Review — Jul 28–Aug 3",
    dur: "8:24",
    views: "12.4K",
    bg: "#087F63",
  },
  {
    title: "How to Read Mill Rates vs Mandi Rates",
    dur: "5:12",
    views: "8.1K",
    bg: "#147D72",
  },
  {
    title: "Cotton Season 2026 — Price Outlook",
    dur: "11:40",
    views: "6.3K",
    bg: "#168A76",
  },
  {
    title: "Badami Bagh Lahore Mandi — Live Tour",
    dur: "14:05",
    views: "19.7K",
    bg: "#9A6817",
  },
];

function NewsVideosScreen() {
  const { lang } = useLang();
  const [tab, setTab] = useState<"news" | "videos">("news");
  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: "#F1F7F4" }}
    >
      <header
        className="px-4 pt-10 pb-3 flex-shrink-0"
        style={{ background: "#F4FAF7", borderBottom: "1px solid #D5E2DD" }}
      >
        <h1 className="font-extrabold text-xl mb-3">
          {lang === "ur" ? "خبریں اور ویڈیوز" : "News & Videos"}
        </h1>
        <div className="flex gap-2">
          {(["news", "videos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="tap-target flex-1 rounded-2xl font-bold text-sm"
              style={{
                height: 48,
                background: tab === t ? "#087F63" : "#E8EFEC",
                color: tab === t ? "#fff" : "#183B34",
              }}
            >
              {t === "news"
                ? lang === "ur"
                  ? "خبریں"
                  : " News"
                : lang === "ur"
                  ? "ویڈیوز"
                  : " Videos"}
            </button>
          ))}
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 flex flex-col gap-3">
        {tab === "news" &&
          NEWS_ITEMS.map((n, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{ background: n.bg, border: "1px solid #D5E2DD" }}
            >
              <div className="flex gap-3">
                <span style={{ fontSize: 32, flexShrink: 0 }}>{n.icon}</span>
                <div>
                  <div className="flex gap-2 mb-1 flex-wrap">
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: "#F4FAF7", color: n.tc }}
                    >
                      {n.tag}
                    </span>
                    <span className="text-xs" style={{ color: "#52635F" }}>
                      {n.date}
                    </span>
                  </div>
                  <p className="font-bold text-sm leading-snug">{n.title}</p>
                </div>
              </div>
            </div>
          ))}
        {tab === "videos" &&
          VIDEO_ITEMS.map((v, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: "#F4FAF7", border: "1px solid #D5E2DD" }}
            >
              <div
                className="relative flex items-center justify-center h-36"
                style={{ background: v.bg }}
              >
                <span style={{ fontSize: 56 }}>🎥</span>
                <div
                  className="absolute flex items-center justify-center w-14 h-14 rounded-full"
                  style={{ background: "rgba(255,255,255,0.9)" }}
                >
                  <span
                    className="text-2xl"
                    style={{ color: "#087F63", marginLeft: 4 }}
                  >
                    ▶
                  </span>
                </div>
                <span className="absolute bottom-2 right-2 text-xs font-bold text-white bg-black bg-opacity-60 px-2 py-0.5 rounded">
                  {v.dur}
                </span>
              </div>
              <div className="p-4">
                <p className="font-bold text-sm leading-snug mb-2">{v.title}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "#52635F" }}>
                    {v.views} {lang === "ur" ? "ویوز" : "views"}
                  </span>
                  <span
                    className="text-xs font-semibold ml-auto"
                    style={{ color: "#087F63" }}
                  >
                    ZM Official
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── VOICE ────────────────────────────────────────────────────────────────────

function VoiceScreen({
  onResult,
}: {
  onResult: (v: string, c: string) => void;
}) {
  const [phase, setPhase] = useState<
    "idle" | "recording" | "processing" | "result"
  >("idle");
  const [transcript, setTranscript] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = () => {
    if (phase === "recording") return;
    setPhase("recording");
    setTranscript("");
    timer.current = setTimeout(
      () => setTranscript("آج گندم کا ملتان میں ریٹ کیا ہے؟"),
      1000,
    );
  };
  const stop = () => {
    if (phase !== "recording") return;
    if (timer.current) clearTimeout(timer.current);
    setTranscript("آج گندم کا ملتان میں ریٹ کیا ہے؟");
    setPhase("processing");
    setTimeout(() => setPhase("result"), 1200);
  };

  return (
    <div
      className="flex flex-col h-full screen-enter items-center pt-16 px-6"
      style={{ background: "#F1F7F4" }}
    >
      <h1 className="font-extrabold text-2xl mb-1 text-center">Voice Search</h1>
      <p className="text-sm text-center mb-8" style={{ color: "#52635F" }}>
        Press &amp; hold · Urdu or English
      </p>
      <button
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        className="tap-target flex items-center justify-center rounded-full mb-6 select-none"
        style={{
          width: 112,
          height: 112,
          touchAction: "none",
          background: phase === "recording" ? "#C94A43" : "#087F63",
          boxShadow:
            phase === "recording"
              ? "0 0 0 20px rgba(220,38,38,0.15),0 0 0 40px rgba(220,38,38,0.07)"
              : "0 8px 32px rgba(15,138,95,0.35)",
          transition: "all 0.2s ease",
        }}
      >
        <span style={{ fontSize: 48 }}>🎙️</span>
      </button>
      {phase === "idle" && (
        <p className="text-sm text-center" style={{ color: "#52635F" }}>
          Hold mic and speak
        </p>
      )}
      {phase === "recording" && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1 items-end h-8">
            {[4, 7, 5, 10, 6, 8, 4, 9, 5, 7].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full animate-pulse"
                style={{
                  height: h * 3,
                  background: "#C94A43",
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
          <p className="font-semibold text-red-600">Listening…</p>
          {transcript && (
            <p className="urdu text-lg font-bold text-center mt-2">
              {transcript}
            </p>
          )}
        </div>
      )}
      {phase === "processing" && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
          <p className="font-semibold" style={{ color: "#087F63" }}>
            Processing…
          </p>
        </div>
      )}
      {phase === "result" && (
        <div className="w-full screen-enter flex flex-col gap-4">
          <p className="urdu text-lg font-bold text-center">{transcript}</p>
          <ZMMessageCard msg={FEED_MESSAGES[0]} />
          <button
            onClick={() => onResult("Grains", "Wheat")}
            className="tap-target w-full rounded-2xl py-4 font-bold text-white text-base"
            style={{ background: "#087F63" }}
          >
            See All Mandi Rates for Wheat →
          </button>
          <button
            onClick={() => {
              setPhase("idle");
              setTranscript("");
            }}
            className="tap-target w-full rounded-2xl py-4 font-bold text-base"
            style={{ background: "#E8EFEC", color: "#183B34" }}
          >
            Search Again
          </button>
        </div>
      )}
    </div>
  );
}

// ─── COMPLETE YOUR PROFILE MODAL & STATE ──────────────────────────────────────

export interface ProfileSetupData {
  step: number;
  furthestStep: number;
  province: string;
  district: string;
  city: string;
  selectedMandis?: string[];
  selectedProds: string[];
  dur: number;
  customMode: boolean;
  customMonths: number;
  paymentType: "card" | "wallet" | "direct";
  walletProvider: "jazzcash" | "easypaisa" | "sadapay" | "nayapay" | "upaisa";
  walletNumber: string;
  walletCnic: string;
  walletPromptSent?: boolean;
  directMethod: "jazzcash" | "easypaisa" | "bank";
  hasReceipt: boolean;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardHolder: string;
}

function getMonthlyDiscount(months: number): number {
  if (months <= 1) return 0;
  if (months === 2) return 0.05; // 5% for 2 months
  if (months === 3) return 0.1; // 10% for 3 months
  if (months === 4 || months === 5) return 0.125; // 12.5% for 4 and 5 months
  if (months === 6) return 0.15; // 15% for 6 months
  if (months === 7 || months === 8) return 0.175; // 17.5% for 7 and 8 months
  if (months >= 9 && months <= 11) return 0.2; // 20% for 9, 10, 11 months
  if (months >= 12) return 0.25; // 25% for 12 months
  return 0;
}

function CompleteProfileModal({
  data,
  onUpdateData,
  onClose,
  onComplete,
  initialUserData,
}: {
  data: ProfileSetupData;
  onUpdateData: (partial: Partial<ProfileSetupData>) => void;
  onClose: () => void;
  onComplete: (
    selectedProducts: string[],
    locationData?: { province: string; district: string; city: string },
  ) => void;
  initialUserData?: AppProps["initialUserData"];
}) {
  const { lang, tc, tm } = useLang();

  // Step mapping: 3 steps (1: Interested Products, 2: Choose Plan, 3: Payment)
  const totalSteps = 3;
  const currentStep = Math.min(Math.max(data.step || 1, 1), totalSteps);

  const activeStepKey: "products" | "plan" | "payment" =
    currentStep === 1
      ? "products"
      : currentStep === 2
        ? "plan"
        : "payment";

  // MPIN Dialog State for Mobile Wallet
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [mpinError, setMpinError] = useState("");
  const [isProcessingMpin, setIsProcessingMpin] = useState(false);
  const [mpinSuccess, setMpinSuccess] = useState(false);

  const monthlyTotal = data.selectedProds.reduce(
    (sum, p) => sum + getproductBasePrice(p),
    0,
  );

  const { months, discount, regularTotal, discountAmt, finalTotal } =
    data.customMode
      ? (() => {
          const m = data.customMonths || 1;
          const d = getMonthlyDiscount(m);
          const reg = monthlyTotal * m;
          const da = Math.round(reg * d);
          return {
            months: m,
            discount: d,
            regularTotal: reg,
            discountAmt: da,
            finalTotal: reg - da,
          };
        })()
      : (() => {
          const m = DURATION_MONTHS_BILLING[data.dur] || 1;
          const d = getMonthlyDiscount(m);
          const reg = monthlyTotal * m;
          const da = Math.round(reg * d);
          return {
            months: m,
            discount: d,
            regularTotal: reg,
            discountAmt: da,
            finalTotal: reg - da,
          };
        })();

  const walletProviders = [
    {
      id: "jazzcash",
      label: "JazzCash",
      color: "#E83D2B",
      iconSrc: "/src/icons/jazz.png",
      sub: "Instant mobile MPIN prompt",
    },
    {
      id: "easypaisa",
      label: "EasyPaisa",
      color: "#4CAF50",
      iconSrc: "/src/icons/easypaisa.png",
      sub: "Instant approval MPIN",
    },
    {
      id: "sadapay",
      label: "SadaPay",
      color: "#00A389",
      iconSrc: "/src/icons/sadapay.png",
      sub: "In-app transfer request",
    },
    {
      id: "nayapay",
      label: "NayaPay",
      color: "#FF6F00",
      iconSrc: "/src/icons/nayapay.png",
      sub: "Fast wallet checkout",
    },
    {
      id: "upaisa",
      label: "UPaisa",
      color: "#F57F17",
      iconSrc: "/src/icons/upaisa.png",
      sub: "USSD / Mobile prompt",
    },
  ] as const;

  const directMethods = [
    {
      id: "jazzcash",
      label: "JazzCash Manual",
      color: "#E83D2B",
      iconSrc: "/src/icons/jazz.png",
      sub: "Send to Till / Account",
    },
    {
      id: "easypaisa",
      label: "EasyPaisa Manual",
      color: "#4CAF50",
      iconSrc: "/src/icons/easypaisa.png",
      sub: "Send to EasyPaisa Account",
    },
    {
      id: "bank",
      label: "Bank Transfer",
      color: "#1565C0",
      iconSrc: "/src/icons/banktransfer.png",
      sub: "Direct IBFT transfer",
    },
  ] as const;

  const directDetails: Record<string, { rows: [string, string][] }> = {
    jazzcash: {
      rows: [
        ["Account", "03058107777"],
        ["Account Name", "Muhammad Ghasharib Ali Shaukat"],
        ["Amount", `PKR ${finalTotal.toLocaleString()}`],
      ],
    },
    easypaisa: {
      rows: [
        ["Account", "03048107777"],
        ["Account Name", "Abdul Raafey Shaukat"],
        ["Amount", `PKR ${finalTotal.toLocaleString()}`],
      ],
    },
    bank: {
      rows: [
        ["Bank", "HBL"],
        ["Account Title", "Zarai Mandi Private Limited"],
        ["Account No.", "5000-7909-9814-03"],
        ["IBAN", "PK04HABB05000079089814030"],
        ["Amount", `PKR ${finalTotal.toLocaleString()}`],
      ],
    },
  };

  function formatCardNumber(v: string) {
    return v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }
  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2
      ? digits.slice(0, 2) + "/" + digits.slice(2)
      : digits;
  }
  function formatPhoneInput(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    return digits.slice(0, 4) + " " + digits.slice(4);
  }

  const toggleProd = (name: string) => {
    const updated = data.selectedProds.includes(name)
      ? data.selectedProds.filter((p) => p !== name)
      : [...data.selectedProds, name];
    // Keep at least 1 product
    onUpdateData({ selectedProds: updated.length > 0 ? updated : [name] });
  };

  const getVerticalForModalProduct = (productName: string) => {
    return (
      Object.entries(VERTICALS).find(
        ([, vd]) => vd.products[productName],
      )?.[0] || "Grains"
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      onUpdateData({
        step: nextStep,
        furthestStep: Math.max(data.furthestStep || 1, nextStep),
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      onUpdateData({ step: currentStep - 1 });
    }
  };

  const handleFinish = () => {
    onComplete(data.selectedProds, {
      province: data.province || "Punjab",
      district: data.district || "Pakpattan",
      city: data.city || "Pakpattan Mandi",
    });
  };

  const handlePaymentConfirmClick = () => {
    if (data.paymentType === "wallet") {
      setMpin(["", "", "", ""]);
      setMpinError("");
      setMpinSuccess(false);
      setMpinModalOpen(true);
    } else {
      handleFinish();
    }
  };

  const handleMpinSubmit = () => {
    const pinStr = mpin.join("");
    if (pinStr.length < 4) {
      setMpinError("Please enter complete 4-digit MPIN");
      return;
    }
    setMpinError("");
    setIsProcessingMpin(true);
    setTimeout(() => {
      setIsProcessingMpin(false);
      setMpinSuccess(true);
      setTimeout(() => {
        setMpinModalOpen(false);
        handleFinish();
      }, 700);
    }, 800);
  };

  const selectedWp = walletProviders.find(
    (wp) => wp.id === (data.walletProvider || "jazzcash"),
  ) || walletProviders[0];

  return (
    <div
      className="zm-sheet-overlay"
      style={{
        zIndex: 350,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="zm-sheet-high"
        style={{
          background: "#F4FAF7",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "28px 28px 0 0",
          boxShadow: "0 -10px 40px rgba(6,77,64,0.22)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-5 pt-4 pb-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #D5E2DD" }}
        >
          <div
            className="w-10 h-1 rounded-full mx-auto mb-3"
            style={{ background: "#C7D6D0" }}
          />
          <div className="flex items-center justify-between">
            <div>
              <p
                className="font-extrabold text-lg"
                style={{ color: "#183B34" }}
              >
                {lang === "ur"
                  ? "پروفائل سیٹ اپ مکمل کریں"
                  : "Complete Your Profile"}
              </p>
              <p className="text-xs font-semibold" style={{ color: "#52635F" }}>
                {lang === "ur"
                  ? `مرحلہ ${currentStep} از ${totalSteps}: ${
                      activeStepKey === "products"
                        ? "دلچسپی کی مصنوعات"
                        : activeStepKey === "plan"
                          ? "سبسکرپشن پلان"
                          : "ادائیگی کی تفصیلات"
                    }`
                  : `Step ${currentStep} of ${totalSteps}: ${
                      activeStepKey === "products"
                        ? "Interested Products"
                        : activeStepKey === "plan"
                          ? "Subscription Plan"
                          : "Card & Payment"
                    }`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="tap-target text-sm font-semibold px-3 py-1 rounded-full"
              style={{ background: "#E8EFEC", color: "#52635F" }}
              title="Close & Explore"
            >
              ✕
            </button>
          </div>

          {/* Stepper Dots */}
          <div className="flex gap-2 mt-3">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 999,
                  background: s <= currentStep ? "#087F63" : "#D5E2DD",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* STEP 1: INTERESTED PRODUCTS */}
          {activeStepKey === "products" && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#183B34" }}>
                  {lang === "ur"
                    ? "اپنی دلچسپی کی مصنوعات منتخب کریں"
                    : "Select Your Interested Products"}
                </h2>
                <p style={{ fontSize: 11.5, color: "#52635F", marginTop: 2 }}>
                  {lang === "ur"
                    ? "گندم پہلے سے منتخب ہے، مزید مصنوعات شامل کریں"
                    : "Wheat is selected by default. Tap to add or remove commodities."}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px 10px",
                }}
              >
                {PRODUCT_DIVISIONS.map((div) => {
                  const sel = data.selectedProds.includes(div.name);
                  const iconSrc = getproductIconSrc(
                    div.name,
                    getVerticalForModalProduct(div.name),
                  );

                  return (
                    <button
                      key={div.name}
                      type="button"
                      onClick={() => toggleProd(div.name)}
                      className="tap-target flex flex-col items-center p-2 rounded-2xl relative"
                      style={{
                        background: sel ? "#E4F2EC" : "#FFFFFF",
                        border: sel
                          ? "2px solid #087F63"
                          : "1.5px solid #D5E2DD",
                        boxShadow: sel
                          ? "0 4px 12px rgba(8,127,99,0.14)"
                          : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {sel && (
                        <span
                          style={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "#087F63",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 900,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ✓
                        </span>
                      )}
                      <img
                        src={iconSrc}
                        alt={div.name}
                        style={{
                          width: 44,
                          height: 44,
                          objectFit: "contain",
                          marginBottom: 6,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: sel ? "#087F63" : "#183B34",
                          textAlign: "center",
                          lineHeight: 1.2,
                        }}
                      >
                        {tc(div.name)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SUBSCRIPTION PLAN */}
          {activeStepKey === "plan" && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#183B34" }}>
                  {lang === "ur"
                    ? "اپنا سبسکرپشن پلان منتخب کریں"
                    : "Choose Your ZM Plan"}
                </h2>
              </div>

              {/* Standard Duration Tabs */}
              <div
                style={{
                  display: "flex",
                  background: "rgba(15,138,95,0.07)",
                  borderRadius: 12,
                  padding: 4,
                  gap: 3,
                  marginBottom: 10,
                }}
              >
                {[
                  { label: "1 Mo", durIdx: 0, badge: "Standard" },
                  { label: "3 Mos", durIdx: 1, badge: "10% off" },
                  { label: "6 Mos", durIdx: 2, badge: "15% off" },
                  { label: "12 Mos", durIdx: 3, badge: "25% off" },
                ].map((item) => {
                  const active = !data.customMode && data.dur === item.durIdx;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className={`dur-tab${active ? " active" : ""}`}
                      onClick={() => {
                        onUpdateData({ customMode: false, dur: item.durIdx });
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 2px",
                        borderRadius: 10,
                        border: "none",
                        background: active ? "#087F63" : "transparent",
                        color: active ? "#fff" : "#183B34",
                        fontWeight: 700,
                        fontSize: 11,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <span>{item.label}</span>
                      <span
                        style={{
                          fontSize: 8.5,
                          opacity: active ? 0.95 : 0.65,
                          fontWeight: 800,
                        }}
                      >
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Customize Mode Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  onUpdateData({
                    customMode: !data.customMode,
                    customMonths: data.customMonths || 3,
                  });
                }}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: data.customMode
                    ? "2px solid #087F63"
                    : "1.5px dashed #D5E2DD",
                  background: data.customMode ? "#E4F2EC" : "#fff",
                  color: data.customMode ? "#087F63" : "#52635F",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span>
                    {lang === "ur"
                      ? "اپنی مرضی کے مہینے منتخب کریں (1 تا 12)"
                      : "Customize Specific Months"}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: data.customMode ? "#087F63" : "#80918B",
                  }}
                >
                  {data.customMode ? "Hide Picker ▴" : "Show Picker ▾"}
                </span>
              </button>

              {/* Custom Duration Fluid Month Picker */}
              {data.customMode && (
                <div
                  style={{
                    border: "1.5px solid #087F63",
                    borderRadius: 16,
                    padding: "14px",
                    marginBottom: 12,
                    background: "#fff",
                    boxShadow: "0 2px 10px rgba(8,127,99,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#183B34",
                      }}
                    >
                      {data.customMonths} Month
                      {data.customMonths > 1 ? "s" : ""} Plan
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#16A34A",
                        background: "rgba(22,163,74,0.12)",
                        borderRadius: 20,
                        padding: "2px 9px",
                      }}
                    >
                      {getMonthlyDiscount(data.customMonths) > 0
                        ? `${Math.round(getMonthlyDiscount(data.customMonths) * 100)}% Discount`
                        : "Regular Rate"}
                    </span>
                  </div>

                  {/* 12 Months Grid Chips */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 6,
                      marginBottom: 12,
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                      const sel = data.customMonths === m;
                      const disc = getMonthlyDiscount(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => onUpdateData({ customMonths: m })}
                          style={{
                            padding: "6px 2px",
                            borderRadius: 8,
                            border: sel
                              ? "2px solid #087F63"
                              : "1.5px solid #D5E2DD",
                            background: sel ? "#087F63" : "#F4FAF7",
                            color: sel ? "#fff" : "#183B34",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <span style={{ fontSize: 11.5, fontWeight: 800 }}>
                            {m} mo
                          </span>
                          <span
                            style={{
                              fontSize: 8.5,
                              fontWeight: 700,
                              color: sel
                                ? "#D1FAE5"
                                : disc > 0
                                  ? "#16A34A"
                                  : "#80918B",
                            }}
                          >
                            {disc > 0 ? `-${disc * 100}%` : "0%"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Pricing Breakdown Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  border: "1.4px solid #D5E2DD",
                  marginBottom: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "8px 14px 6px",
                    borderBottom: "1px solid #D5E2DD",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#B9822E",
                    fontWeight: 700,
                  }}
                >
                  Selected products ({data.selectedProds.length} items)
                </div>
                <div style={{ maxHeight: 110, overflowY: "auto" }}>
                  {data.selectedProds.map((pName) => {
                    const iconSrc = getproductIconSrc(
                      pName,
                      getVerticalForModalProduct(pName),
                    );
                    const price = getproductBasePrice(pName);
                    return (
                      <div
                        key={pName}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "6px 14px",
                          borderBottom: "1px solid rgba(15,138,95,0.06)",
                          fontSize: 12,
                          color: "#52635F",
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
                            src={iconSrc}
                            alt=""
                            style={{
                              width: 20,
                              height: 20,
                              objectFit: "contain",
                            }}
                          />
                          {tc(pName)}
                        </span>
                        <span style={{ fontWeight: 600, color: "#183B34" }}>
                          PKR {price.toLocaleString()}/mo
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    borderTop: "1.5px solid rgba(15,138,95,0.1)",
                    background: "#E4F2EC",
                    padding: "10px 14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "#52635F",
                      marginBottom: 4,
                    }}
                  >
                    <span>
                      Total/mo × {months} month{months > 1 ? "s" : ""}
                    </span>
                    <span>PKR {regularTotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        color: "#16A34A",
                        fontWeight: 700,
                        marginBottom: 6,
                      }}
                    >
                      <span>Discount ({discount * 100}% off)</span>
                      <span>− PKR {discountAmt.toLocaleString()}</span>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 6,
                      borderTop: "1px solid rgba(15,138,95,0.1)",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13.5,
                        color: "#183B34",
                      }}
                    >
                      Your Total
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 900,
                          color: "#087F63",
                        }}
                      >
                        PKR {finalTotal.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 10.5, color: "#52635F" }}>
                        PKR {Math.round(finalTotal / months).toLocaleString()}
                        /mo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT SCREEN */}
          {activeStepKey === "payment" && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#183B34" }}>
                  {lang === "ur"
                    ? "ادائیگی مکمل کریں"
                    : "Complete Your Payment"}
                </h2>

              </div>

              {/* 3 Payment Type Selector Buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {[
                  {
                    id: "wallet",
                    iconSrc: "/src/icons/mobilewallet.png",
                    label: "Mobile Wallet",
                    sub: "JazzCash, EasyPaisa",
                  },
                  {
                    id: "card",
                    iconSrc: "/src/icons/cardpayment.png",
                    label: "Card Payment",
                    sub: "Debit / Credit",
                  },
                  {
                    id: "direct",
                    iconSrc: "/src/icons/directtransfer.png",
                    label: "Direct Transfer",
                    sub: "Bank IBFT",
                  },
                ].map((opt) => {
                  const active = (data.paymentType || "wallet") === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        onUpdateData({ paymentType: opt.id as any })
                      }
                      style={{
                        padding: "10px 6px",
                        borderRadius: 14,
                        border: active
                          ? "2px solid #087F63"
                          : "1.5px solid #D5E2DD",
                        background: active ? "#E4F2EC" : "#fff",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 24,
                          marginBottom: 4,
                        }}
                      >
                        <img
                          src={opt.iconSrc}
                          alt=""
                          style={{
                            width: 22,
                            height: 22,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: active ? "#087F63" : "#183B34",
                          lineHeight: 1.2,
                        }}
                      >
                        {opt.label}
                      </div>
                      <div
                        style={{
                          fontSize: 8.5,
                          color: "#52635F",
                          marginTop: 2,
                        }}
                      >
                        {opt.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Option 1: Mobile Wallet Form */}
              {(data.paymentType || "wallet") === "wallet" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#52635F",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      Select Wallet Provider
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 6,
                        marginBottom: 8,
                      }}
                    >
                      {walletProviders.map((wp) => {
                        const sel =
                          (data.walletProvider || "jazzcash") === wp.id;
                        return (
                          <button
                            key={wp.id}
                            type="button"
                            onClick={() =>
                              onUpdateData({
                                walletProvider: wp.id as any,
                              })
                            }
                            style={{
                              padding: "8px 4px",
                              borderRadius: 10,
                              border: sel
                                ? `2px solid ${wp.color}`
                                : "1.5px solid #D5E2DD",
                              background: sel ? `${wp.color}15` : "#FFFFFF",
                              cursor: "pointer",
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <img
                              src={wp.iconSrc}
                              alt=""
                              style={{
                                width: 20,
                                height: 20,
                                objectFit: "contain",
                              }}
                            />
                            <div
                              style={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                color: sel ? wp.color : "#183B34",
                              }}
                            >
                              {wp.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#52635F",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Mobile Wallet Number *
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="0300 1234567"
                      value={data.walletNumber || "0300 1234567"}
                      onChange={(e) =>
                        onUpdateData({
                          walletNumber: formatPhoneInput(e.target.value),
                        })
                      }
                      style={{
                        width: "100%",
                        height: 42,
                        padding: "0 12px",
                        border: "1.5px solid #D5E2DD",
                        borderRadius: 10,
                        fontSize: 13.5,
                        color: "#183B34",
                        background: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#52635F",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Arif / 123456"
                      value={data.walletCnic || ""}
                      onChange={(e) =>
                        onUpdateData({ walletCnic: e.target.value })
                      }
                      style={{
                        width: "100%",
                        height: 42,
                        padding: "0 12px",
                        border: "1.5px solid #D5E2DD",
                        borderRadius: 10,
                        fontSize: 13.5,
                        color: "#183B34",
                        background: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Option 2: Card Form */}
              {data.paymentType === "card" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 9 }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#52635F",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Card Number
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={data.cardNumber}
                      onChange={(e) =>
                        onUpdateData({
                          cardNumber: formatCardNumber(e.target.value),
                        })
                      }
                      style={{
                        width: "100%",
                        height: 42,
                        padding: "0 12px",
                        border: "1.5px solid #D5E2DD",
                        borderRadius: 10,
                        fontSize: 13.5,
                        color: "#183B34",
                        background: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#52635F",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        Expiry Date
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={data.cardExpiry}
                        onChange={(e) =>
                          onUpdateData({
                            cardExpiry: formatExpiry(e.target.value),
                          })
                        }
                        style={{
                          width: "100%",
                          height: 42,
                          padding: "0 12px",
                          border: "1.5px solid #D5E2DD",
                          borderRadius: 10,
                          fontSize: 13.5,
                          color: "#183B34",
                          background: "#fff",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#52635F",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        Security Code
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="CVV"
                        maxLength={4}
                        value={data.cardCvv}
                        onChange={(e) =>
                          onUpdateData({
                            cardCvv: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4),
                          })
                        }
                        style={{
                          width: "100%",
                          height: 42,
                          padding: "0 12px",
                          border: "1.5px solid #D5E2DD",
                          borderRadius: 10,
                          fontSize: 13.5,
                          color: "#183B34",
                          background: "#fff",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#52635F",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={data.cardHolder}
                      onChange={(e) =>
                        onUpdateData({ cardHolder: e.target.value })
                      }
                      style={{
                        width: "100%",
                        height: 42,
                        padding: "0 12px",
                        border: "1.5px solid #D5E2DD",
                        borderRadius: 10,
                        fontSize: 13.5,
                        color: "#183B34",
                        background: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 10px",
                      background: "#E4F2EC",
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ fontSize: 12 }}>🔒</span>
                    <span style={{ fontSize: 11, color: "#52635F" }}>
                      Your card details are encrypted and never stored.
                    </span>
                  </div>
                </div>
              )}

              {/* Option 3: Direct Transfer */}
              {data.paymentType === "direct" && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#52635F",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Choose Method
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 7,
                      marginBottom: 10,
                    }}
                  >
                    {directMethods.map((m) => (
                      <div
                        key={m.id}
                        onClick={() =>
                          onUpdateData({ directMethod: m.id as any })
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 12px",
                          borderRadius: 12,
                          border:
                            data.directMethod === m.id
                              ? "2px solid #087F63"
                              : "1.5px solid #D5E2DD",
                          background:
                            data.directMethod === m.id ? "#E4F2EC" : "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            background: `${m.color}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={m.iconSrc}
                            alt={m.label}
                            style={{
                              width: 24,
                              height: 24,
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 12.5,
                              fontWeight: 700,
                              color: "#183B34",
                            }}
                          >
                            {m.label}
                          </div>
                          <div style={{ fontSize: 10.5, color: "#52635F" }}>
                            {m.sub}
                          </div>
                        </div>
                        {data.directMethod === m.id && (
                          <span
                            style={{
                              color: "#087F63",
                              fontWeight: 900,
                              fontSize: 13,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Direct Details Box */}
                  <div
                    style={{
                      background: "#fff",
                      border: "1.5px solid #D5E2DD",
                      borderRadius: 12,
                      padding: "10px 12px",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        color: "#B9822E",
                        fontWeight: 700,
                        marginBottom: 6,
                      }}
                    >
                      Payment Details
                    </div>
                    {directDetails[data.directMethod]?.rows.map(([k, v]) => (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 11.5,
                          padding: "3px 0",
                          borderBottom: "1px solid #F1F7F4",
                        }}
                      >
                        <span style={{ color: "#52635F" }}>{k}</span>
                        <strong
                          style={{
                            color: "#183B34",
                            fontFamily:
                              k === "IBAN" || k === "Account No."
                                ? "monospace"
                                : "inherit",
                          }}
                        >
                          {v}
                        </strong>
                      </div>
                    ))}
                  </div>

                  {/* Upload Screenshot */}
                  <div
                    onClick={() =>
                      onUpdateData({ hasReceipt: !data.hasReceipt })
                    }
                    style={{
                      padding: "10px",
                      borderRadius: 12,
                      border: "1.5px dashed #087F63",
                      background: data.hasReceipt ? "#E4F2EC" : "#fff",
                      textAlign: "center",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "#087F63",
                    }}
                  >
                    <span>{data.hasReceipt ? "✅" : "📎"}</span>
                    <span>
                      {data.hasReceipt
                        ? "Screenshot attached (Tap to change)"
                        : "Tap to upload payment screenshot"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className="px-5 pt-3 pb-5 flex-shrink-0"
          style={{ borderTop: "1px solid #D5E2DD" }}
        >
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="tap-target py-3 px-4 rounded-2xl font-bold text-xs"
                style={{ background: "#E8EFEC", color: "#183B34" }}
              >
                ← {lang === "ur" ? "پیچھے" : "Back"}
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="tap-target flex-1 py-3 rounded-2xl font-extrabold text-sm text-white"
                style={{
                  background: "#087F63",
                  boxShadow: "0 4px 14px rgba(8,127,99,0.3)",
                }}
              >
                {activeStepKey === "products"
                  ? lang === "ur"
                    ? "پلان منتخب کریں →"
                    : "Choose Plan →"
                  : lang === "ur"
                    ? `ادائیگی کی طرف جائیں`
                    : `Subscribe`}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaymentConfirmClick}
                className="tap-target flex-1 py-3 rounded-2xl font-extrabold text-sm text-white flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #087F63, #064D40)",
                  boxShadow: "0 4px 16px rgba(8,127,99,0.4)",
                }}
              >
                <span>
                  {lang === "ur"
                    ? `ادائیگی کی تصدیق کریں — PKR ${finalTotal.toLocaleString()}`
                    : `Confirm Payment — PKR ${finalTotal.toLocaleString()}`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MPIN Entry Modal for Mobile Wallet */}
      {mpinModalOpen && (
        <div
          className="zm-sheet-overlay"
          style={{
            zIndex: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(6, 45, 36, 0.75)",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => {
            if (!isProcessingMpin) setMpinModalOpen(false);
          }}
        >
          <div
            className="screen-enter"
            style={{
              width: "100%",
              maxWidth: 360,
              background: "#FFFFFF",
              borderRadius: 24,
              padding: "24px 20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              textAlign: "center",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Wallet Icon Badge */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `${selectedWp.color}15`,
                border: `2px solid ${selectedWp.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <img
                src={selectedWp.iconSrc}
                alt=""
                style={{ width: 34, height: 34, objectFit: "contain" }}
              />
            </div>

            <h3
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#183B34",
                marginBottom: 4,
              }}
            >
              {lang === "ur"
                ? `${selectedWp.label} کا MPIN درج کریں`
                : `Enter ${selectedWp.label} MPIN`}
            </h3>
            <p
              style={{
                fontSize: 12,
                color: "#52635F",
                marginBottom: 16,
                lineHeight: 1.4,
              }}
            >
              Authorize payment of{" "}
              <strong style={{ color: "#087F63" }}>
                PKR {finalTotal.toLocaleString()}
              </strong>{" "}
              for Zarai Mandi subscription.
            </p>

            {/* 4 Digit PIN Inputs */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  id={`mpin-box-${idx}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={mpin[idx]}
                  autoFocus={idx === 0}
                  disabled={isProcessingMpin || mpinSuccess}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const updated = [...mpin];
                    updated[idx] = val ? val.slice(-1) : "";
                    setMpin(updated);
                    setMpinError("");
                    if (val && idx < 3) {
                      const nextInput = document.getElementById(
                        `mpin-box-${idx + 1}`,
                      );
                      nextInput?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !mpin[idx] && idx > 0) {
                      const prevInput = document.getElementById(
                        `mpin-box-${idx - 1}`,
                      );
                      prevInput?.focus();
                    }
                  }}
                  style={{
                    width: 48,
                    height: 52,
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: 900,
                    color: "#183B34",
                    border: mpin[idx]
                      ? "2px solid #087F63"
                      : "1.5px solid #D5E2DD",
                    borderRadius: 12,
                    background: mpin[idx] ? "#E4F2EC" : "#FAFCFB",
                    outline: "none",
                    boxShadow: mpin[idx]
                      ? "0 2px 8px rgba(8,127,99,0.15)"
                      : "none",
                  }}
                />
              ))}
            </div>

            {mpinError && (
              <div
                style={{
                  fontSize: 11.5,
                  color: "#D95A51",
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {mpinError}
              </div>
            )}

            {mpinSuccess ? (
              <div
                style={{
                  background: "#E8F5E9",
                  border: "1.5px solid #81C784",
                  borderRadius: 14,
                  padding: "12px",
                  color: "#1B5E20",
                  fontWeight: 800,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span>✅</span>
                <span>Payment Authorized Successfully!</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  type="button"
                  onClick={handleMpinSubmit}
                  disabled={isProcessingMpin}
                  className="tap-target w-full py-3 rounded-2xl font-extrabold text-sm text-white"
                  style={{
                    background: isProcessingMpin
                      ? "#80918B"
                      : "linear-gradient(135deg, #087F63, #064D40)",
                    boxShadow: "0 4px 14px rgba(8,127,99,0.3)",
                    cursor: isProcessingMpin ? "not-allowed" : "pointer",
                  }}
                >
                  {isProcessingMpin
                    ? "Authorizing Payment..."
                    : `Authorize PKR ${finalTotal.toLocaleString()}`}
                </button>
                <button
                  type="button"
                  onClick={() => setMpinModalOpen(false)}
                  disabled={isProcessingMpin}
                  className="tap-target py-2 text-xs font-bold"
                  style={{ color: "#80918B", background: "none", border: "none" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────

function HomeScreen({
  push,
  setFeedOpen,
  pickedByproducts,
  togglePickBP,
  isPickedBP,
  setPickedByproducts,
  voiceGuideActive = false,
  onVoiceGuideClose,
  initialUserData,
  activeRole = "customer",
  hasRepAccount = false,
  onSwitchRole,
  onStartRepOnboarding,
  onRestartOnboarding,
  profileCompleted: parentProfileCompleted = false,
  setProfileCompleted: parentSetProfileCompleted,
  completeProfileOpen: parentCompleteProfileOpen = false,
  setCompleteProfileOpen: parentSetCompleteProfileOpen,
  profileSetupData: parentProfileSetupData,
  updateProfileSetupData: parentUpdateProfileSetupData,
  onCompleteProfileSubmit: parentOnCompleteProfileSubmit,
}: {
  push: (s: Screen) => void;
  setFeedOpen: (v: boolean) => void;
  pickedByproducts: RateItem[];
  togglePickBP: (item: RateItem) => void;
  isPickedBP: (item: RateItem) => boolean;
  setPickedByproducts: React.Dispatch<React.SetStateAction<RateItem[]>>;
  voiceGuideActive?: boolean;
  onVoiceGuideClose?: () => void;
  initialUserData?: AppProps["initialUserData"];
  activeRole?: "customer" | "representative";
  hasRepAccount?: boolean;
  onSwitchRole?: (role: "customer" | "representative") => void;
  onStartRepOnboarding?: () => void;
  onRestartOnboarding?: (mode?: "register" | "signin") => void;
  profileCompleted?: boolean;
  setProfileCompleted?: React.Dispatch<React.SetStateAction<boolean>>;
  completeProfileOpen?: boolean;
  setCompleteProfileOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  profileSetupData?: ProfileSetupData;
  updateProfileSetupData?: (partial: Partial<ProfileSetupData>) => void;
  onCompleteProfileSubmit?: (
    selected: string[],
    locationData?: { province: string; district: string; city: string },
  ) => void;
}) {
  const {
    lang,
    setLang,
    t,
    tc,
    voiceEnabled: homeVoiceEnabled,
    setVoiceEnabled: homeSetVoiceEnabled,
  } = useLang();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [localProfileCompleted, setLocalProfileCompleted] = useState(false);
  const profileCompleted = parentProfileCompleted ?? localProfileCompleted;
  const setProfileCompleted =
    parentSetProfileCompleted || setLocalProfileCompleted;

  const [localCompleteProfileOpen, setLocalCompleteProfileOpen] =
    useState(false);
  const completeProfileOpen =
    parentCompleteProfileOpen ?? localCompleteProfileOpen;
  const setCompleteProfileOpen =
    parentSetCompleteProfileOpen || setLocalCompleteProfileOpen;

  const [favLockModalOpen, setFavLockModalOpen] = useState(false);
  const [todayOnlyUnlocked, setTodayOnlyUnlocked] = useState<string[]>([]);

  // Persistent Profile Setup Data
  const totalSteps = 3;

  const [localProfileSetupData, setLocalProfileSetupData] =
    useState<ProfileSetupData>(() => ({
      step: 1,
      furthestStep: 1,
      province: initialUserData?.province || "Punjab",
      district:
        initialUserData?.district || initialUserData?.city || "Pakpattan",
      city: initialUserData?.city || "Pakpattan Mandi",
      selectedMandis: [initialUserData?.city || "Pakpattan Mandi"],
      selectedProds: ["Wheat"],
      dur: 0,
      customMode: false,
      customMonths: 3,
      paymentType: "wallet",
      walletProvider: "jazzcash",
      walletNumber: initialUserData?.phone || "0300 1234567",
      walletCnic: "",
      walletPromptSent: false,
      directMethod: "jazzcash",
      hasReceipt: false,
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      cardHolder: initialUserData?.name || "Muhammad Arif",
    }));

  const profileSetupData = parentProfileSetupData || localProfileSetupData;
  const updateProfileSetupData = (partial: Partial<ProfileSetupData>) => {
    if (parentUpdateProfileSetupData) parentUpdateProfileSetupData(partial);
    else setLocalProfileSetupData((prev) => ({ ...prev, ...partial }));
  };

  // User Profile State (allows interactive editing and reflects across the screen)
  const [profileName, setProfileName] = useState(
    initialUserData?.name || (lang === "ur" ? "محمد عارف" : "Muhammad Arif"),
  );
  const [profilePhone, setProfilePhone] = useState(
    initialUserData?.phone || "0300 1234567",
  );
  const [profileRole, setProfileRole] = useState("Trader / بیوپاری");
  const [profileBusiness, setProfileBusiness] = useState(
    "Arif Grain Trading Co.",
  );
  const [profileProvince, setProfileProvince] = useState(
    initialUserData?.province || "Punjab",
  );
  const [profileDistrict, setProfileDistrict] = useState(
    initialUserData?.district || initialUserData?.city || "Pakpattan",
  );
  const [profileCity, setProfileCity] = useState(
    initialUserData?.city || "Pakpattan Mandi",
  );

  // Edit Profile Form State & OTP Verification
  const [editName, setEditName] = useState(profileName);
  const [editPhone, setEditPhone] = useState(profilePhone);
  const [showContactVerify, setShowContactVerify] = useState(false);
  const [contactOtp, setContactOtp] = useState(["", "", "", ""]);
  const [contactOtpError, setContactOtpError] = useState("");
  const [contactOtpSuccess, setContactOtpSuccess] = useState(false);

  // Account Modals State
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [locationPrefOpen, setLocationPrefOpen] = useState(false);
  const [subsModalOpen, setSubsModalOpen] = useState(false);
  const [voiceLangModalOpen, setVoiceLangModalOpen] = useState(false);
  const [repModalOpen, setRepModalOpen] = useState(false);
  const [repConfirmModalOpen, setRepConfirmModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [showSwitchToast, setShowSwitchToast] = useState<string | null>(null);
  const lastProfileTapRef = useRef<number>(0);

  // Settings & Preferences State
  const [weightUnit, setWeightUnit] = useState<"maund" | "kg100" | "ton">(
    "maund",
  );
  const [alertSms, setAlertSms] = useState(true);
  const [alertWhatsApp, setAlertWhatsApp] = useState(true);
  const [alertMorningBell, setAlertMorningBell] = useState(true);
  const [autoRefreshRates, setAutoRefreshRates] = useState(true);
  const [speechRate, setSpeechRate] = useState<"1.0x" | "0.8x" | "1.2x">(
    "1.0x",
  );

  // Representative Form State
  const [repFullName, setRepFullName] = useState(profileName);
  const [repPhone, setRepPhone] = useState(profilePhone);
  const [repMandi, setRepMandi] = useState(profileCity);
  const [repExperience, setRepExperience] = useState(
    "5+ Years (تجربہ کار)",
  );
  const [repSubmitted, setRepSubmitted] = useState(false);

  // Feedback form state
  const [supportFeedback, setSupportFeedback] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [faqExpanded, setFaqExpanded] = useState<number | null>(0);

  // Calculate dynamic progress percentage
  const currentStepNum = profileSetupData.step;
  const furthestStepNum = profileSetupData.furthestStep;
  const progressPct = profileCompleted
    ? 100
    : Math.min(Math.round(((furthestStepNum) / totalSteps) * 100), 99);

  // Your Picks sheet
  const [picksFavSheet, setPicksFavSheet] = useState(false);
  const [picksSearch, setPicksSearch] = useState("");
  const [picksVertical, setPicksVertical] = useState<string>(
    Object.keys(VERTICALS)[0],
  );

  // ---------------------------------------------------------
  // ORIENTATION / VOICE
  // ---------------------------------------------------------

  const handleOrientationTap = (
    _key: string,
    speakMsg: string,
    navigateFn: () => void,
  ) => {
    if (voiceGuideActive) {
      speakText(speakMsg);
      return;
    }

    if (homeVoiceEnabled) {
      speakText(speakMsg);
    }

    navigateFn();
  };

  // ---------------------------------------------------------
  // MANDI DATA FOR NOTIFICATIONS
  // ---------------------------------------------------------

  const allMandiRows: RichRow[] = Object.entries(MANDI_ROWS).flatMap(
    ([mandiId, rows]) => {
      const mandi = INITIAL_MANDIS.find((m) => m.id === mandiId);
      const mandiName = mandi?.name || mandiId;

      return rows.map((r) =>
        enrichRowWithAttrs({
          ...r,
          vertical:
            Object.entries(VERTICALS).find(
              ([, vd]) => vd.products[r.product],
            )?.[0] || "Grains",
          mandiName,
          mandiCity: mandi?.city || "",
          province: mandi?.province || "",
        }),
      );
    },
  );

  // ---------------------------------------------------------
  // PRODUCT HELPERS
  // ---------------------------------------------------------

  const getVerticalForProduct = (productName: string) => {
    return (
      Object.entries(VERTICALS).find(
        ([, vd]) => vd.products[productName],
      )?.[0] || "Grains"
    );
  };

  const isAccessible = (name: string) =>
    SUBSCRIBED_PRODUCTS.has(name) ||
    TODAY_ONLY_PRODUCTS.has(name) ||
    todayOnlyUnlocked.includes(name);

  const isTodayOnly = (name: string) =>
    (TODAY_ONLY_PRODUCTS.has(name) || todayOnlyUnlocked.includes(name)) &&
    !SUBSCRIBED_PRODUCTS.has(name);

  const activeProducts = PRODUCT_DIVISIONS.filter((d) => isAccessible(d.name));
  const lockedProducts = PRODUCT_DIVISIONS.filter(
    (d) => !isAccessible(d.name),
  ).slice(0, 10);

  const handleLockedProductClick = (divName: string, verticalFor: string) => {
    if (divName === "Maize") {
      TODAY_ONLY_PRODUCTS.add("Maize");
      setTodayOnlyUnlocked((prev) => [...prev, "Maize"]);
      push({
        id: "byproduct-combined",
        products: [{ vertical: verticalFor, product: "Maize" }],
        active: 0,
      });
    } else {
      push({
        id: "billing",
        product: divName,
        vertical: verticalFor,
      });
    }
  };

  const handleCompleteProfileSubmit = (
    selected: string[],
    locationData?: { province: string; district: string; city: string },
  ) => {
    selected.forEach((p) => {
      const mapped = PRODUCT_ID_TO_NAME[p.toLowerCase()] || p;
      SUBSCRIBED_PRODUCTS.add(mapped);
      TODAY_ONLY_PRODUCTS.add(mapped);
    });
    if (locationData && initialUserData) {
      initialUserData.province = locationData.province;
      initialUserData.district = locationData.district;
      initialUserData.city = locationData.city;
    }
    setProfileCompleted(true);
    setCompleteProfileOpen(false);
  };

  // ---------------------------------------------------------
  // FAVORITES
  // ---------------------------------------------------------

  const FAVE_BPS = [
    "Wheat",
    "Fine Flour",
    "Flour",
    "Bran",
    "Semolina",
    "Straw",
    "Sorghum",
  ];

  const getFavoriteImage = (bp: string) => {
    return getproductIconSrc(bp, "Grains");
  };

  // ---------------------------------------------------------
  // PICKED BYPRODUCT DATA
  // ---------------------------------------------------------

  const picksRowsRaw: RichRow[] =
    pickedByproducts.length > 0
      ? pickedByproducts.map((item) => {
          const found = allMandiRows.find(
            (r) => r.product === item.product && r.byproduct === item.byproduct,
          );

          return (
            found || {
              vertical: item.vertical,
              product: item.product,
              byproduct: item.byproduct,
              emoji: "",
              rateType: "Mill Rate",
              arrival: "—",
              min: 0,
              max: 0,
              trend: "stable" as const,
              trendPct: 0,
              mandiName: "—",
              mandiCity: "—",
              province: "—",
            }
          );
        })
      : allMandiRows.slice(0, 8);

  const seenPickKeys = new Set<string>();

  const picksRows: RichRow[] = picksRowsRaw.filter((r) => {
    const key = `${r.product}|${r.byproduct}`;

    if (seenPickKeys.has(key)) return false;

    seenPickKeys.add(key);
    return true;
  });

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "#F1F7F4",
      }}
    >
      {/* =====================================================
          HERO BANNER (Optimized compact height)
          ===================================================== */}

      <div
        className="relative flex-shrink-0"
        style={{
          height: 175,
          background: "linear-gradient(135deg, #064D40 0%, #087F63 100%)",
        }}
      >
        <img
          src={farmHeroBg}
          alt="Agriculture"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.38 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,77,64,0.3) 0%, rgba(6,77,64,0.85) 100%)",
          }}
        />

        <div className="relative h-full flex flex-col justify-between px-4 pt-4 pb-9 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === "ur" ? "en" : "ur")}
                className="tap-target flex items-center justify-center rounded-full px-2.5 py-1"
                style={{
                  background: "rgba(255,255,255,0.22)",
                  border: "1.2px solid rgba(255,255,255,0.4)",
                  color: "#fff",
                  fontSize: lang === "ur" ? 14 : 11.5,
                  fontWeight: 800,
                  backdropFilter: "blur(8px)",
                }}
              >
                {lang === "ur" ? "English" : "اردو"}
              </button>

              <button
                onClick={() => homeSetVoiceEnabled(!homeVoiceEnabled)}
                className="tap-target flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{
                  background: "rgba(255,255,255,0.22)",
                  border: "1.2px solid rgba(255,255,255,0.4)",
                  color: "#fff",
                  fontSize: lang === "ur" ? 15 : 12,
                  fontWeight: 800,
                  backdropFilter: "blur(8px)",
                }}
              >
                <VoiceBadgeIconSVG
                  active={homeVoiceEnabled}
                  size={lang === "ur" ? 16 : 13}
                />
                <span>{homeVoiceEnabled ? t("Voice On") : t("Voice Off")}</span>
              </button>
            </div>

            {/* Top Right: Free Trial Chip + Profile */}
            <div className="flex items-center gap-2">
              {!profileCompleted && (
                <button
                  type="button"
                  onClick={() => setCompleteProfileOpen(true)}
                  className="tap-target flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-xs"
                  style={{
                    background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                    border: "1.3px solid #F59E0B",
                    color: "#92400E",
                    boxShadow: "0 2px 8px rgba(245, 158, 11, 0.35)",
                    cursor: "pointer",
                    backdropFilter: "blur(8px)",
                  }}
                  title="Tap to Complete Profile & Unlock Full App"
                >
                  <span style={{ fontSize: 11, fontWeight: 800 }}>
                    {lang === "ur" ? "مفت ٹرائل: ۲ دن باقی" : "Free Trial: 2 Days Left"}
                  </span>
                </button>
              )}

              {/* Profile Avatar Button with Double-Tap Switching */}
              <button
                onClick={() => {
                  const now = Date.now();
                  if (now - lastProfileTapRef.current < 350 && hasRepAccount) {
                    const targetRole = activeRole === "representative" ? "customer" : "representative";
                    onSwitchRole?.(targetRole);
                    setShowSwitchToast(
                      targetRole === "representative"
                        ? (lang === "ur" ? "نمائندہ ڈیش بورڈ پر تبدیل ہو گئے" : "Switched to Rep Dashboard")
                        : (lang === "ur" ? "کسٹمر ڈیش بورڈ پر تبدیل ہو گئے" : "Switched to Customer App")
                    );
                    setTimeout(() => setShowSwitchToast(null), 2500);
                  } else {
                    setProfileOpen(true);
                  }
                  lastProfileTapRef.current = now;
                }}
                className="tap-target relative flex items-center justify-center rounded-full"
                style={{
                  width: 38,
                  height: 38,
                  background: activeRole === "representative" ? "rgba(15, 138, 95, 0.45)" : "rgba(255,255,255,0.22)",
                  border: activeRole === "representative" ? "1.5px solid #2FAE68" : "1.2px solid rgba(255,255,255,0.4)",
                  backdropFilter: "blur(8px)",
                  zIndex: voiceGuideActive ? 45 : undefined,
                }}
                title={hasRepAccount ? "Tap for Profile • Double tap to switch dashboard" : "Tap for Profile"}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                {hasRepAccount && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
                      background: "#2FAE68",
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 900,
                      padding: "1px 3px",
                      borderRadius: 6,
                      border: "1px solid #fff",
                      lineHeight: 1,
                    }}
                  >
                    {activeRole === "representative" ? "REP" : "CUST"}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Switch Toast Notification */}
          {showSwitchToast && (
            <div
              style={{
                position: "absolute",
                top: 54,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(6, 45, 36, 0.95)",
                color: "#B4E6D2",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 800,
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                zIndex: 999,
                border: "1px solid #2FAE68",
                animation: "screenEnter 0.2s ease-out",
                whiteSpace: "nowrap",
              }}
            >
              ✓ {showSwitchToast}
            </div>
          )}

          {/* User information */}
          <div className="mt-auto" style={{ paddingBottom: 6 }}>
            <h1
              style={{
                color: "#fff",
                fontSize: 20,
                lineHeight: 1.2,
                fontWeight: 800,
                fontFamily:
                  lang === "ur"
                    ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                    : "'Poppins', sans-serif",
                textShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            >
              {profileName || (lang === "ur" ? "محمد عارف" : "Muhammad Arif")}
            </h1>
            <p
              style={{
                color: "#B4E6D2",
                fontSize: 12,
                fontWeight: 600,
                marginTop: 2,
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }}
            >
              📍 {profileCity} {profileProvince ? `(${profileProvince})` : ""}
            </p>
          </div>
        </div>

        {/* Floating Search Bar */}
        <button
          onClick={() =>
            handleOrientationTap("search", t("orient.search"), () =>
              push({ id: "search" }),
            )
          }
          className={`tap-target flex items-center gap-2.5 ${
            lang === "ur" ? "text-right" : "text-left"
          }`}
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: -22,
            height: 46,
            paddingLeft: 18,
            paddingRight: 18,
            borderRadius: 9999,
            background: "#FFFFFF",
            border: "1.5px solid rgba(8,127,99,0.18)",
            boxShadow: "0 6px 20px rgba(6,77,64,0.14)",
            zIndex: 30,
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <circle
              cx="11"
              cy="11"
              r="6.5"
              stroke="#087F63"
              strokeWidth="2.4"
            />
            <path
              d="M16 16L21 21"
              stroke="#087F63"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="flex-1"
            style={{
              fontSize: 13.5,
              color: "#6B7C77",
              fontFamily:
                lang === "ur"
                  ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                  : "'Inter', sans-serif",
              fontWeight: 600,
            }}
          >
            {t("home.search")}
          </span>
        </button>
      </div>

      {/* =====================================================
          MAIN HOME CONTENT (Non-scrollable, responsive to iPhone 15 & 15 Pro Max)
          ===================================================== */}

      <div
        className="flex-1 min-h-0 overflow-hidden relative flex flex-col justify-between"
        style={{
          background:
            "linear-gradient(180deg,#EAF7F1 0%,#F2F8F5 45%,#EEF7F2 100%)",
        }}
      >
        <AgriAmbientCanvas />

        <div
          className={`relative z-10 flex-1 flex flex-col ${
            profileCompleted ? "justify-around" : "justify-between"
          }`}
          style={{
            paddingBottom: profileCompleted
              ? "clamp(8px, 1.6vh, 16px)"
              : "clamp(8px, 1.8vh, 20px)",
          }}
        >
          {/* ===================================================
              COMPLETE YOUR PROFILE PROGRESS CARD
              (Only visible when profile is NOT yet completed)
              =================================================== */}
          {!profileCompleted && (
            <div className="px-4 pt-7">
              <div
                style={{
                  background: "linear-gradient(135deg, #FFFFFF, #F6FBF8)",
                  border: "1.5px solid #B8DCCF",
                  borderRadius: 16,
                  padding: "clamp(10px, 1.4vh, 14px) 14px",
                  boxShadow: "0 3px 12px rgba(6,77,64,0.06)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#183B34",
                        fontFamily:
                          lang === "ur"
                            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                            : "inherit",
                      }}
                    >
                      {lang === "ur"
                        ? "پروفائل سیٹ اپ"
                        : "Complete Your Profile"}
                    </span>
                  </div>
                  <span
                    style={{
                      background: "#E8F5E9",
                      color: "#087F63",
                      borderRadius: 999,
                      padding: "2px 8px",
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    {progressPct}%
                  </span>
                </div>

                {/* Progress bar track */}
                <div
                  style={{
                    width: "100%",
                    height: 5,
                    background: "#E2EFE9",
                    borderRadius: 999,
                    overflow: "hidden",
                    margin: "4px 0 6px",
                  }}
                >
                  <div
                    style={{
                      width: `${progressPct}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #F59E0B, #2FAE68)",
                      borderRadius: 999,
                      transition: "width 0.4s ease-in-out",
                    }}
                  />
                </div>

                <p
                  style={{
                    fontSize: 11,
                    color: "#52635F",
                    lineHeight: 1.35,
                    marginBottom: 8,
                    fontFamily:
                      lang === "ur"
                        ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur"
                    ? `مرحلہ ${currentStepNum} از ${totalSteps} — اپنی پسند کی مصنوعات اور پلان مکمل کریں۔`
                    : `Step ${currentStepNum} of ${totalSteps} — Resume where you left off.`}
                </p>

                <button
                  onClick={() => setCompleteProfileOpen(true)}
                  className="tap-target w-full py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5"
                  style={{
                    background: "#087F63",
                    color: "#fff",
                    boxShadow: "0 2px 8px rgba(8,127,99,0.2)",
                    fontFamily:
                      lang === "ur"
                        ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                        : "inherit",
                    fontSize: lang === "ur" ? 13 : 11.5,
                  }}
                >
                  <span>
                    {lang === "ur"
                      ? `سیٹ اپ جاری رکھیں (مرحلہ ${currentStepNum})`
                      : `Continue Setup`}
                  </span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* ===================================================
              MY PRODUCTS (Harmoniously spaced below search bar)
              =================================================== */}

          <section
            style={{
              paddingTop: profileCompleted
                ? "clamp(42px, 5.5vh, 58px)"
                : "clamp(4px, 1.2vh, 12px)",
            }}
          >
            <div className="px-4 flex items-center justify-between mb-2">
              <p
                style={{
                  fontSize: profileCompleted ? 15 : 13,
                  fontWeight: 800,
                  color: "#183B34",
                  letterSpacing: lang === "ur" ? "0" : "0.05em",
                  textTransform: lang === "ur" ? "none" : "uppercase",
                  fontFamily:
                    lang === "ur"
                      ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                      : "inherit",
                }}
              >
                {t("My Products")}
              </p>
            </div>

            <div
              className="flex items-start overflow-x-auto px-4 pb-1"
              style={{
                scrollbarWidth: "none",
                gap: profileCompleted
                  ? "clamp(16px, 4.5vw, 22px)"
                  : "clamp(12px, 3.5vw, 16px)",
              }}
            >
              {activeProducts.map((div) => {
                const verticalFor = getVerticalForProduct(div.name);

                return (
                  <button
                    key={div.name}
                    onClick={() =>
                      handleOrientationTap("product", t("orient.product"), () =>
                        push({
                          id: "byproduct-combined",
                          products: [
                            {
                              vertical: verticalFor,
                              product: div.name,
                            },
                          ],
                          active: 0,
                        }),
                      )
                    }
                    className="flex-shrink-0 flex flex-col items-center tap-target"
                    style={{
                      width: profileCompleted
                        ? "clamp(96px, 25vw, 116px)"
                        : "clamp(82px, 20vw, 92px)",
                      zIndex: voiceGuideActive ? 45 : undefined,
                    }}
                  >
                    {/* Active Circle */}
                    <div
                      style={{
                        width: profileCompleted
                          ? "clamp(92px, 12vh, 108px)"
                          : "clamp(76px, 9.2vh, 84px)",
                        height: profileCompleted
                          ? "clamp(92px, 12vh, 108px)"
                          : "clamp(76px, 9.2vh, 84px)",
                        borderRadius: "50%",
                        border: "3px solid #087F63",
                        background: "#F4FAF7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        boxShadow: "0 5px 16px rgba(8,127,99,0.2)",
                      }}
                    >
                      <img
                        src={getproductIconSrc(div.name, verticalFor)}
                        alt={div.name}
                        style={{
                          width: profileCompleted ? "78%" : "74%",
                          height: profileCompleted ? "78%" : "74%",
                          objectFit: "contain",
                        }}
                      />

                      {/* Active check badge */}
                      <span
                        style={{
                          position: "absolute",
                          bottom: 1,
                          right: 1,
                          width: profileCompleted ? 22 : 18,
                          height: profileCompleted ? 22 : 18,
                          borderRadius: "50%",
                          background: "#087F63",
                          color: "#fff",
                          border: "2px solid #EEF7F2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: profileCompleted ? 12 : 10,
                          fontWeight: 900,
                        }}
                      >
                        ✓
                      </span>
                    </div>

                    {/* Name */}
                    <span
                      style={{
                        marginTop: profileCompleted ? 6 : 4,
                        fontSize: profileCompleted ? 14.5 : 13,
                        fontWeight: 800,
                        color: "#183B34",
                        fontFamily:
                          lang === "ur"
                            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                            : "inherit",
                        lineHeight: 1.15,
                      }}
                    >
                      {tc(div.name)}
                    </span>

                    {/* Active Badge */}
                    <span
                      style={{
                        marginTop: 2,
                        padding: profileCompleted ? "2.5px 11px" : "1.5px 8px",
                        borderRadius: 9999,
                        background: "#087F63",
                        color: "#fff",
                        fontSize: profileCompleted ? 9.5 : 8.5,
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                        fontFamily:
                          lang === "ur"
                            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                            : "inherit",
                      }}
                    >
                      {t("ACTIVE")}
                    </span>
                  </button>
                );
              })}

              {/* Locked Products */}
              {lockedProducts.map((div) => {
                const verticalFor = getVerticalForProduct(div.name);
                const iconSrc = getproductIconSrc(div.name, verticalFor);

                return (
                  <button
                    key={div.name}
                    onClick={() =>
                      push({
                        id: "billing",
                        product: div.name,
                        vertical: verticalFor,
                      })
                    }
                    className="flex-shrink-0 flex flex-col items-center tap-target"
                    style={{
                      width: profileCompleted
                        ? "clamp(66px, 17vw, 78px)"
                        : "clamp(54px, 14vw, 62px)",
                    }}
                  >
                    {/* Locked circle */}
                    <div
                      style={{
                        width: profileCompleted
                          ? "clamp(58px, 7.5vh, 68px)"
                          : "clamp(48px, 5.8vh, 54px)",
                        height: profileCompleted
                          ? "clamp(58px, 7.5vh, 68px)"
                          : "clamp(48px, 5.8vh, 54px)",
                        marginTop: profileCompleted ? 18 : 14,
                        borderRadius: "50%",
                        background: "#E4EFE9",
                        border: "1.5px solid #BDD9CD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 2px 6px rgba(18,65,48,0.06)",
                      }}
                    >
                      <img
                        src={iconSrc}
                        alt={div.name}
                        style={{
                          width: "75%",
                          height: "75%",
                          objectFit: "contain",
                          filter: "blur(2px) grayscale(20%)",
                          opacity: 0.55,
                          position: "absolute",
                        }}
                      />

                      <div
                        style={{
                          width: profileCompleted ? 24 : 20,
                          height: profileCompleted ? 24 : 20,
                          borderRadius: "50%",
                          background: "rgba(255, 255, 255, 0.85)",
                          backdropFilter: "blur(2px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          zIndex: 2,
                          border: "1px solid rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        <LockIconSVG
                          size={profileCompleted ? 12 : 10}
                          color="#2A483E"
                        />
                      </div>
                    </div>

                    <span
                      style={{
                        marginTop: 4,
                        fontSize: profileCompleted ? 12 : 10.5,
                        color: "#475F57",
                        fontWeight: 700,
                        textAlign: "center",
                        lineHeight: 1.15,
                        maxWidth: 72,
                        fontFamily:
                          lang === "ur"
                            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                            : "inherit",
                      }}
                    >
                      {tc(div.name)}
                    </span>

                    <span
                      style={{
                        marginTop: 2,
                        padding: "1.5px 6px",
                        borderRadius: 9999,
                        background: "#E4F0EA",
                        border: "1px solid #C6DFD4",
                        color: "#35594C",
                        fontSize: profileCompleted ? 8.5 : 8,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        fontFamily:
                          lang === "ur"
                            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                            : "inherit",
                      }}
                    >
                      {t("Subscribe")}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ===================================================
              FAVORITES (Balanced vertical spacing)
              =================================================== */}

          <section
            className="px-4"
            style={{
              position: "relative",
              zIndex: voiceGuideActive ? 45 : 10,
              paddingTop: profileCompleted ? "8px" : "0px",
            }}
          >
            {/* Favorites heading */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p
                    style={{
                      fontSize: profileCompleted
                        ? "clamp(18px, 2.5vh, 22px)"
                        : "clamp(16px, 2.2vh, 19px)",
                      fontWeight: 800,
                      color: "#183B34",
                      lineHeight: 1.2,
                      fontFamily:
                        lang === "ur"
                          ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                          : "inherit",
                    }}
                  >
                    {t("Favorites")}
                  </p>
                  {!profileCompleted && (
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        color: "#2A483E",
                        background: "#E4F0EA",
                        padding: "2px 8px",
                        borderRadius: 999,
                        border: "1px solid #C6DFD4",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow Button */}
              <button
                onClick={() => {
                  push({
                    id: "byproduct-combined",
                    products: [
                      {
                        vertical: "Grains",
                        product: "Wheat",
                      },
                    ],
                    active: 0,
                  });
                }}
                className="tap-target flex items-center justify-center rounded-full"
                style={{
                  width: "clamp(38px, 4.8vh, 44px)",
                  height: "clamp(38px, 4.8vh, 44px)",
                  background: "#E3F1EB",
                  border: "1.2px solid #A0CEBC",
                  color: "#087F63",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(18px, 2.5vh, 22px)",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {lang === "ur" ? "←" : "→"}
                </span>
              </button>
            </div>

            {/* Favorite cards — Unlocked for Free Trial */}
            <div
              className="flex gap-3 overflow-x-auto pb-1"
              style={{
                scrollbarWidth: "none",
                scrollSnapType: "x mandatory",
              }}
            >
              {FAVE_BPS.map((bp) => {
                const imgSrc = getFavoriteImage(bp);

                return (
                  <button
                    key={bp}
                    onClick={() => {
                      push({
                        id: "product-rates",
                        vertical: "Grains",
                        product: "Wheat",
                        byproduct: bp,
                      });
                    }}
                    className="flex-shrink-0 flex flex-col items-center relative tap-target"
                    style={{
                      width: "clamp(136px, 34vw, 160px)",
                      minWidth: "clamp(130px, 33vw, 154px)",
                      height: "clamp(185px, 24vh, 215px)",
                      padding: "clamp(10px, 1.5vh, 14px) 10px clamp(12px, 1.7vh, 16px)",
                      borderRadius: 20,
                      background: "#FFFFFF",
                      border: "1.5px solid #D5E5DE",
                      boxShadow: "0 4px 14px rgba(18,65,48,0.07)",
                      scrollSnapAlign: "start",
                    }}
                  >
                    {/* Star indicator */}
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 3,
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="#087F63"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>

                    {/* Image */}
                    <div
                      style={{
                        width: "clamp(74px, 9.5vh, 88px)",
                        height: "clamp(74px, 9.5vh, 88px)",
                        marginTop: 4,
                        marginBottom: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={bp}
                          loading="lazy"
                          style={{
                            width: "90%",
                            height: "90%",
                            objectFit: "contain",
                            display: "block",
                            filter: "none",
                            opacity: 1,
                          }}
                        />
                      ) : (
                        <ProductIcon
                          name={bp}
                          vertical="Grains"
                          size={56}
                          style={{
                            filter: "none",
                            opacity: 1,
                          }}
                        />
                      )}
                    </div>

                    {/* Name */}
                    <span
                      style={{
                        marginTop: "auto",
                        fontSize: "clamp(14px, 1.9vh, 16px)",
                        fontWeight: 800,
                        color: "#183B34",
                        textAlign: "center",
                        lineHeight: 1.15,
                        fontFamily:
                          lang === "ur"
                            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                            : "inherit",
                      }}
                    >
                      {tc(bp)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* ===================================================
            AGRICULTURAL FOREGROUND CANVAS LAYER (Leaves anchored above Nav)
            =================================================== */}

        <AgriForegroundCanvas />

        {/* ===================================================
            YOUR PICKS SHEET
            =================================================== */}

        {picksFavSheet && (
          <div
            className="zm-sheet-overlay"
            style={{ zIndex: 200 }}
            onClick={() => setPicksFavSheet(false)}
          >
            <div
              className="zm-sheet-high"
              style={{
                background: "#F4FAF7",
                height: "88vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="px-5 pt-5 pb-3 flex-shrink-0"
                style={{
                  borderBottom: "1px solid #D5E2DD",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg">Select Your Picks</p>

                    <p
                      className="text-xs mt-0.5"
                      style={{
                        color: "#52635F",
                      }}
                    >
                      Choose byproducts to track on your home screen
                    </p>
                  </div>

                  {pickedByproducts.length > 0 && (
                    <button
                      onClick={() => setPickedByproducts([])}
                      className="tap-target text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{
                        background: "#F9E1DE",
                        color: "#A83B37",
                      }}
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Search */}
                <div
                  className="flex items-center gap-2 rounded-xl px-3"
                  style={{
                    height: 40,
                    background: "#F1F7F4",
                    border: "1px solid #D5E2DD",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                    }}
                  >
                    ⌕
                  </span>

                  <input
                    value={picksSearch}
                    onChange={(e) => setPicksSearch(e.target.value)}
                    placeholder="Search byproducts…"
                    className="flex-1 text-sm bg-transparent outline-none"
                    style={{
                      color: "#183B34",
                    }}
                  />
                </div>

                {/* Vertical tabs */}
                <div
                  className="flex gap-2 mt-2 overflow-x-auto pb-1"
                  style={{
                    scrollbarWidth: "none",
                  }}
                >
                  {Object.entries(VERTICALS).map(([v, vd]) => (
                    <button
                      key={v}
                      onClick={() => setPicksVertical(v)}
                      className="tap-target flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                      style={{
                        background: picksVertical === v ? "#087F63" : "#F1F7F4",
                        color: picksVertical === v ? "#fff" : "#52635F",
                        border: `1px solid ${
                          picksVertical === v ? "#087F63" : "#D5E2DD"
                        }`,
                      }}
                    >
                      <SpriteIcon
                        spriteKey={vd.icon}
                        size={14}
                        style={{
                          filter:
                            picksVertical === v
                              ? "brightness(0) invert(1)"
                              : "none",
                        }}
                      />

                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Byproducts */}
              <div className="overflow-y-auto flex-1 min-h-0 px-4 pt-3 pb-2 flex flex-col gap-2">
                {Object.entries(
                  VERTICALS[picksVertical]?.products || {},
                ).flatMap(([product, byproducts]) =>
                  byproducts
                    .filter(
                      (bp) =>
                        !picksSearch ||
                        bp.toLowerCase().includes(picksSearch.toLowerCase()) ||
                        product
                          .toLowerCase()
                          .includes(picksSearch.toLowerCase()),
                    )
                    .map((bp) => {
                      const item: RateItem = {
                        vertical: picksVertical,
                        product,
                        byproduct: bp,
                      };

                      const selected = isPickedBP(item);

                      return (
                        <button
                          key={`${product}|${bp}`}
                          onClick={() => togglePickBP(item)}
                          className="tap-target flex-shrink-0 rounded-2xl overflow-hidden flex items-center"
                          style={{
                            height: 64,
                            background: selected ? "#E4F2EC" : "#fff",
                            border: `1.5px solid ${
                              selected ? "#087F63" : "#D5E2DD"
                            }`,
                          }}
                        >
                          <div
                            className="flex-shrink-0 flex items-center justify-center"
                            style={{
                              width: 56,
                              height: 64,
                              background: selected ? "#D9EEE4" : "#F1F7F4",
                            }}
                          >
                            <ProductIcon
                              name={bp}
                              vertical={picksVertical}
                              size={36}
                            />
                          </div>

                          <div className="flex-1 px-3 text-left">
                            <p
                              className="font-bold text-sm"
                              style={{
                                color: selected ? "#087F63" : "#183B34",
                              }}
                            >
                              {bp}
                            </p>

                            <p
                              className="text-[10px]"
                              style={{
                                color: "#52635F",
                              }}
                            >
                              {product} · {picksVertical}
                            </p>
                          </div>

                          <div
                            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mr-3"
                            style={{
                              background: selected ? "#087F63" : "#D5E2DD",
                            }}
                          >
                            <span
                              style={{
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 800,
                              }}
                            >
                              {selected ? "✓" : "+"}
                            </span>
                          </div>
                        </button>
                      );
                    }),
                )}
              </div>

              {/* Footer */}
              <div
                className="px-4 pb-6 pt-3 flex-shrink-0"
                style={{
                  borderTop: "1px solid #D5E2DD",
                }}
              >
                <button
                  onClick={() => setPicksFavSheet(false)}
                  className="tap-target w-full rounded-2xl py-4 font-bold text-white text-base"
                  style={{
                    background: "#087F63",
                  }}
                >
                  {pickedByproducts.length > 0
                    ? `Show ${pickedByproducts.length} Pick${
                        pickedByproducts.length > 1 ? "s" : ""
                      }`
                    : "Done · Show All"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom breathing space */}
        <div style={{ height: 8 }} />
      </div>

      {/* =====================================================
          NOTIFICATIONS
          ===================================================== */}

      {/* =====================================================
          PROFILE MODAL (DRAWER & ACCOUNT MANAGEMENT)
          ===================================================== */}
      {profileOpen && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 310 }}
          onClick={() => setProfileOpen(false)}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "92vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-5 pt-4 pb-3 flex-shrink-0"
              style={{ borderBottom: "1px solid #D5E2DD" }}
            >
              <div
                className="w-10 h-1 rounded-full mx-auto mb-3"
                style={{ background: "#C7D6D0" }}
              />
              <div className="flex items-center justify-between">
                <p
                  className="font-bold text-lg"
                  style={{
                    color: "#183B34",
                    fontFamily:
                      lang === "ur"
                        ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                        : "inherit",
                  }}
                >
                  {lang === "ur" ? "اکاؤنٹ اور پروفائل" : "Account & Profile"}
                </p>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="tap-target text-sm font-semibold px-3.5 py-1.5 rounded-full"
                  style={{ background: "#E8EFEC", color: "#52635F" }}
                >
                  {lang === "ur" ? "بند کریں" : "Done"}
                </button>
              </div>
            </div>

            {/* Profile content */}
            <div className="flex-1 overflow-y-auto">
              {/* Avatar + name */}
              <div
                className="flex flex-col items-center py-5 px-5"
                style={{ borderBottom: "1px solid #E8EFEC" }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-md relative"
                  style={{
                    background: "linear-gradient(135deg, #087F63, #064D40)",
                  }}
                >
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setEditName(profileName);
                      setEditPhone(profilePhone);
                      setShowContactVerify(false);
                      setContactOtp(["", "", "", ""]);
                      setContactOtpError("");
                      setContactOtpSuccess(false);
                      setEditProfileOpen(true);
                    }}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#2FAE68] text-white flex items-center justify-center border-2 border-white shadow"
                    title="Edit Profile"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                </div>
                <p
                  className="font-extrabold text-xl"
                  style={{
                    color: "#183B34",
                    fontFamily:
                      lang === "ur"
                        ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
                        : "inherit",
                  }}
                >
                  {profileName}
                </p>
                {profilePhone && (
                  <p className="text-xs font-semibold mt-1 text-[#52635F]">
                    {profilePhone}
                  </p>
                )}
              </div>

              {/* Profile Completion Bar in Drawer */}
              <div
                style={{
                  margin: "14px 18px 8px",
                  padding: "14px 16px",
                  background: profileCompleted ? "#E8F8F0" : "#FFF8EB",
                  border: profileCompleted
                    ? "1.5px solid #2FAE68"
                    : "1.5px solid #F59E0B",
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: profileCompleted ? "#064D40" : "#92400E",
                    }}
                  >
                    {profileCompleted
                      ? lang === "ur"
                        ? "پروفائل 100% مکمل ہے ✓"
                        : "Profile 100% Complete ✓"
                      : lang === "ur"
                        ? `پروفائل مکمل کریں`
                        : `Complete Profile`}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: profileCompleted ? "#087F63" : "#D97706",
                    }}
                  >
                    {profileCompleted ? "100%" : `${progressPct}%`}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 8,
                    background: "#E5E7EB",
                    borderRadius: 999,
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: profileCompleted ? "100%" : `${progressPct}%`,
                      height: "100%",
                      background: profileCompleted ? "#2FAE68" : "#F59E0B",
                      borderRadius: 999,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                {!profileCompleted && (
                  <button
                    onClick={() => {
                    setProfileOpen(false);
                      setCompleteProfileOpen(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#087F63",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      marginTop: 4,
                    }}
                  >
                    {lang === "ur"
                      ? `سیٹ اپ جاری رکھیں (مرحلہ ${currentStepNum}) →`
                      : `Continue Setup (Step ${currentStepNum} of ${totalSteps}) →`}
                  </button>
                )}
              </div>

              {/* Menu items */}
              {[
                {
                  id: "edit",
                  label: lang === "ur" ? "پروفائل ترمیم کریں" : "Edit Profile",
                  sub: lang === "ur" ? "نام، فون نمبر / ای میل" : "Name, phone number / email",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#087F63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  ),
                  action: () => {
                    setProfileOpen(false);
                    setEditName(profileName);
                    setEditPhone(profilePhone);
                    setShowContactVerify(false);
                    setContactOtp(["", "", "", ""]);
                    setContactOtpError("");
                    setContactOtpSuccess(false);
                    setEditProfileOpen(true);
                  },
                },
                {
                  id: "subs",
                  label: lang === "ur" ? "میری سبسکرپشنز" : "My Subscriptions",
                  sub: profileCompleted
                    ? (lang === "ur" ? "فعال زرعی منڈی پرو پلان" : "Active Zarai Mandi Pro Plan")
                    : (lang === "ur" ? "مفت ٹرائل جاری ہے (۲ دن)" : "Free Trial Active (2 Days)"),
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#087F63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  ),
                  action: () => {
                    setProfileOpen(false);
                    setSubsModalOpen(true);
                  },
                },
                {
                  id: "voice",
                  label: lang === "ur" ? "آواز اور زبان" : "Voice & Language",
                  sub: `${lang === "ur" ? "اردو" : "English"} · ${homeVoiceEnabled ? (lang === "ur" ? "آواز فعال" : "Voice On") : (lang === "ur" ? "آواز بند" : "Voice Off")}`,
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#087F63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  ),
                  action: () => {
                    setProfileOpen(false);
                    setVoiceLangModalOpen(true);
                  },
                },
                {
                  id: "rep",
                  label: hasRepAccount
                    ? (lang === "ur" ? "نمائندہ ڈیش بورڈ پر جائیں" : "Switch to Representative Dashboard")
                    : (lang === "ur" ? "نمائندہ بنیں (پارٹنر)" : "Become a Representative"),
                  sub: hasRepAccount
                    ? (lang === "ur" ? "اکاؤنٹ تبدیل کریں" : "Switch accounts")
                    : (lang === "ur" ? "منڈی کے لیے نمائندہ اکاؤنٹ بنائیں" : "Set up your representative account"),
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#087F63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                  action: () => {
                    setProfileOpen(false);
                    if (hasRepAccount) {
                      onSwitchRole?.("representative");
                    } else {
                      setRepConfirmModalOpen(true);
                    }
                  },
                },
                {
                  id: "help",
                  label: lang === "ur" ? "مدد اور کسٹمر سپورٹ" : "Help & Support",
                  sub: lang === "ur" ? "24/7 واٹس ایپ اور ہیلپ لائن" : "24/7 WhatsApp & Helpline",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#087F63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  ),
                  action: () => {
                    setProfileOpen(false);
                    setHelpModalOpen(true);
                  },
                },
                {
                  id: "logout",
                  label: lang === "ur" ? "لاگ آؤٹ" : "Log Out",
                  sub: lang === "ur" ? "سائن آؤٹ کریں اور محفوظ رہیں" : "Sign out of your account",
                  danger: true,
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  ),
                  action: () => {
                    setProfileOpen(false);
                    setLogoutModalOpen(true);
                  },
                },
              ].map((item, i) => (
                <button
                  key={i}
                  className="tap-target w-full flex items-center gap-3.5 px-5 py-3.5"
                  style={{
                    borderBottom: "1px solid #F1F7F4",
                    background: "#fff",
                    textAlign: lang === "ur" ? "right" : "left",
                  }}
                  onClick={item.action}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: item.danger ? "#FEE2E2" : "#E8F5EF",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-bold text-sm leading-tight"
                      style={{
                        color: item.danger ? "#DC2626" : "#183B34",
                        fontFamily:
                          lang === "ur"
                            ? "'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif"
                            : "inherit",
                        fontSize: lang === "ur" ? 16 : 14,
                      }}
                    >
                      {item.label}
                    </p>
                    {item.sub && (
                      <p className="text-xs text-[#52635F] mt-0.5 truncate">
                        {item.sub}
                      </p>
                    )}
                  </div>
                  <span style={{ color: "#A0CEBC", fontSize: 18 }}>
                    {lang === "ur" ? "‹" : "›"}
                  </span>
                </button>
              ))}
              <div style={{ height: 24 }} />
            </div>
          </div>
        </div>
      )}

      {/* ─── 1. EDIT PROFILE MODAL ────────────────────────────────────── */}
      {editProfileOpen && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 350 }}
          onClick={() => {
            if (!showContactVerify) setEditProfileOpen(false);
          }}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "92vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#D5E2DD]">
              <h3 className="font-bold text-lg text-[#183B34]">
                {lang === "ur" ? "پروفائل ترمیم کریں" : "Edit Profile"}
              </h3>
              <button
                onClick={() => setEditProfileOpen(false)}
                className="text-sm font-semibold px-3 py-1 rounded-full bg-[#E8EFEC] text-[#52635F]"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {!showContactVerify ? (
                <>
                  <div>
                    <label className="block text-xs font-extrabold text-[#183B34] mb-1.5">
                      {lang === "ur" ? "نام" : "Name"}
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-[#C7D6D0] bg-white text-sm font-semibold text-[#183B34] focus:border-[#087F63] outline-none"
                      placeholder="e.g. Muhammad Arif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#183B34] mb-1.5">
                      {lang === "ur" ? "فون نمبر / ای میل" : "Phone Number / Email"}
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-[#C7D6D0] bg-white text-sm font-semibold text-[#183B34] focus:border-[#087F63] outline-none"
                      placeholder="0300 1234567 or email@domain.com"
                    />
                    <p className="text-[11px] text-[#52635F] mt-1.5">
                      {lang === "ur"
                        ? "فون یا ای میل تبدیل کرنے کی صورت میں OTP تصدیق ضروری ہوگی۔"
                        : "Changing phone or email will require OTP verification."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (editPhone.trim() !== profilePhone.trim()) {
                        setShowContactVerify(true);
                        setContactOtp(["", "", "", ""]);
                        setContactOtpError("");
                        setContactOtpSuccess(false);
                      } else {
                        setProfileName(editName);
                        if (initialUserData) {
                          initialUserData.name = editName;
                        }
                        setEditProfileOpen(false);
                      }
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[#087F63] text-white font-extrabold text-sm shadow-md mt-4"
                  >
                    {lang === "ur" ? "تبدیلیاں محفوظ کریں" : "Save Changes"}
                  </button>
                </>
              ) : (
                /* OTP Verification Step when Phone/Email is changed */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#D5E2DD] space-y-2.5">
                    <h4 className="text-xs font-extrabold text-[#183B34] uppercase tracking-wider">
                      {lang === "ur" ? "فون نمبر / ای میل کی تبدیلی کی تصدیق" : "Verify Contact Change"}
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-[#F1F7F4]">
                        <span className="text-[#52635F] font-medium">
                          {lang === "ur" ? "سابقہ نمبر / ای میل:" : "Current Contact:"}
                        </span>
                        <span className="font-bold text-[#183B34]">{profilePhone}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-[#087F63] font-medium">
                          {lang === "ur" ? "نیا نمبر / ای میل:" : "New Contact:"}
                        </span>
                        <span className="font-extrabold text-[#087F63]">{editPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#183B34] mb-2 text-center">
                      {lang === "ur" ? "۴ ہندسوں کا OTP کوڈ درج کریں" : "Enter 4-Digit Verification OTP"}
                    </label>
                    <div className="flex justify-center gap-3">
                      {[0, 1, 2, 3].map((idx) => (
                        <input
                          key={idx}
                          id={`otp-box-${idx}`}
                          type="text"
                          maxLength={1}
                          value={contactOtp[idx] || ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            const next = [...contactOtp];
                            next[idx] = val;
                            setContactOtp(next);
                            if (val && idx < 3) {
                              const nextInput = document.getElementById(`otp-box-${idx + 1}`);
                              nextInput?.focus();
                            }
                          }}
                          className="w-12 h-12 text-center text-lg font-black rounded-xl border border-[#C7D6D0] bg-white text-[#183B34] focus:border-[#087F63] outline-none"
                        />
                      ))}
                    </div>
                    {contactOtpError && (
                      <p className="text-xs text-red-600 font-bold text-center mt-2">
                        {contactOtpError}
                      </p>
                    )}
                    {contactOtpSuccess && (
                      <p className="text-xs text-[#087F63] font-bold text-center mt-2">
                        ✓ {lang === "ur" ? "کامیابی سے تصدیق ہو گئی!" : "Verified successfully!"}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const entered = contactOtp.join("");
                      if (entered.length < 4) {
                        setContactOtpError(
                          lang === "ur"
                            ? "براہ کرم مکمل ۴ ہندسوں کا کوڈ درج کریں (جیسے ۱۲۳۴)"
                            : "Please enter the full 4-digit code (e.g. 1234)"
                        );
                        return;
                      }
                      setContactOtpSuccess(true);
                      setTimeout(() => {
                        setProfileName(editName);
                        setProfilePhone(editPhone);
                        if (initialUserData) {
                          initialUserData.name = editName;
                          initialUserData.phone = editPhone;
                          initialUserData.contact = editPhone;
                        }
                        setShowContactVerify(false);
                        setEditProfileOpen(false);
                      }, 500);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[#087F63] text-white font-extrabold text-sm shadow-md"
                  >
                    {lang === "ur" ? "OTP تصدیق اور محفوظ کریں" : "Verify OTP & Save"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowContactVerify(false)}
                    className="w-full py-2.5 rounded-xl bg-[#E8EFEC] text-[#52635F] font-bold text-xs"
                  >
                    {lang === "ur" ? "← واپس جائیں" : "← Back"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. LOCATION PREFERENCES MODAL ────────────────────────────── */}
      {locationPrefOpen && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 350 }}
          onClick={() => setLocationPrefOpen(false)}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#D5E2DD]">
              <h3 className="font-bold text-lg text-[#183B34]">
                {lang === "ur" ? "مقام اور منڈی کا انتخاب" : "Location & Mandi Preferences"}
              </h3>
              <button
                onClick={() => setLocationPrefOpen(false)}
                className="text-sm font-semibold px-3 py-1 rounded-full bg-[#E8EFEC] text-[#52635F]"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#183B34] mb-1.5">
                  {lang === "ur" ? "صوبہ منتخب کریں" : "Select Province"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(LOCATIONS).map((p) => (
                    <button
                      key={p}
                      onClick={() => setProfileProvince(p)}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold border transition text-left"
                      style={{
                        background: profileProvince === p ? "#087F63" : "#fff",
                        color: profileProvince === p ? "#fff" : "#183B34",
                        borderColor: profileProvince === p ? "#087F63" : "#D5E2DD",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#183B34] mb-1.5">
                  {lang === "ur" ? "بنیادی منڈی منتخب کریں" : "Primary Mandi"}
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {(
                    LOCATIONS[profileProvince]?.[profileDistrict] || [
                      "Pakpattan Mandi",
                      "Lahore Grain Market",
                      "Multan Grain Market",
                      "Faisalabad Mandi",
                      "Bahawalpur Mandi",
                      "Okara Mandi",
                    ]
                  ).map((mandi) => (
                    <button
                      key={mandi}
                      onClick={() => setProfileCity(mandi)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border transition text-left bg-white"
                      style={{
                        borderColor: profileCity === mandi ? "#087F63" : "#D5E2DD",
                        background: profileCity === mandi ? "#E8F5EF" : "#fff",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-[#183B34]">
                          {mandi}
                        </span>
                      </div>
                      {profileCity === mandi && (
                        <span className="text-xs font-extrabold text-[#087F63]">
                          ✓ Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLocationPrefOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-[#087F63] text-white font-extrabold text-sm shadow-md mt-4"
              >
                {lang === "ur" ? "منڈی محفوظ کریں" : "Apply Mandi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. MY SUBSCRIPTIONS MODAL ────────────────────────────────── */}
      {subsModalOpen && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 350 }}
          onClick={() => setSubsModalOpen(false)}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "92vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#D5E2DD]">
              <h3 className="font-bold text-lg text-[#183B34]">
                {lang === "ur" ? "میری سبسکرپشنز" : "My Subscriptions"}
              </h3>
              <button
                onClick={() => setSubsModalOpen(false)}
                className="text-sm font-semibold px-3 py-1 rounded-full bg-[#E8EFEC] text-[#52635F]"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {!profileCompleted ? (
                /* FREE TRIAL STATE */
                <>
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#064D40] to-[#087F63] text-white shadow-md space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-[#B4E6D2]">
                        FREE TRIAL
                      </span>
                      <span className="text-xs bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full font-extrabold shadow-sm">
                        {lang === "ur" ? "۲ دن باقی" : "2 Days Left"}
                      </span>
                    </div>
                    <h4 className="text-lg font-black">
                      {lang === "ur" ? "مفت ٹرائل ایکسپلوریشن پاس" : "Free Trial Exploration Pass"}
                    </h4>
                  </div>

                  <div>
                    <h5 className="text-xs font-extrabold text-[#183B34] uppercase tracking-wider mb-2.5">
                      {lang === "ur" ? "سبسکرائب شدہ اجناس (ٹرائل ایکسس)" : "Subscribed Commodities (Trial Access)"}
                    </h5>
                    <div className="grid grid-cols-2 gap-2.5">
                      {Array.from(SUBSCRIBED_PRODUCTS).slice(0, 8).map((p) => (
                        <div
                          key={p}
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#D5E2DD] shadow-sm"
                        >
                          <ProductIcon name={p} vertical="Grains" size={26} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#183B34] truncate">
                              {tc(p)}
                            </p>
                            <span className="inline-block text-[9.5px] text-[#087F63] font-bold bg-[#E4F2EC] px-1.5 py-0.5 rounded-md mt-0.5">
                              {lang === "ur" ? "ٹرائل میں فعال" : "Trial Unlocked"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSubsModalOpen(false);
                        setCompleteProfileOpen(true);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-[#087F63] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{lang === "ur" ? "پروفائل مکمل کریں اور مستقل سبسکرائب کریں →" : "Complete Profile & Subscribe →"}</span>
                    </button>
                  </div>
                </>
              ) : (
                /* SUBSCRIBED STATE (profileCompleted = true) */
                <>
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#064D40] to-[#087F63] text-white shadow-md space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-[#B4E6D2]">
                        ZARAI MANDI PRO
                      </span>
                      <span className="text-xs bg-[#2FAE68] text-white px-2.5 py-0.5 rounded-full font-extrabold shadow-sm">
                        {lang === "ur" ? "فعال ممبر" : "Active Member"}
                      </span>
                    </div>
                    <h4 className="text-lg font-black">
                      {lang === "ur" ? "فعال زرعی منڈی پرو پلان" : "Active Pro Subscription"}
                    </h4>
                    <p className="text-xs text-[#E4F2EC]">
                      {lang === "ur"
                        ? "تمام فعال اجناس کے لائیو اور تاریخی ریٹس تک رسائی"
                        : "Live mandi rates, full historical archives & daily SMS alerts"}
                    </p>
                  </div>

                  {/* Subscribed Commodities with Reg and Expiry Date */}
                  <div>
                    <h5 className="text-xs font-extrabold text-[#183B34] uppercase tracking-wider mb-2.5">
                      {lang === "ur" ? "آپ کی فعال سبسکرائب شدہ اجناس" : "Your Subscribed Commodities"}
                    </h5>
                    <div className="space-y-2">
                      {Array.from(SUBSCRIBED_PRODUCTS).slice(0, 3).map((p) => (
                        <div
                          key={p}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#D5E2DD] shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <ProductIcon name={p} vertical="Grains" size={32} />
                            <div>
                              <p className="text-xs font-extrabold text-[#183B34]">
                                {tc(p)}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10.5px] text-[#52635F]">
                                <span>{lang === "ur" ? "رجسٹریشن:" : "Reg:"} 21 Aug 2026</span>
                                <span>•</span>
                                <span className="text-[#087F63] font-semibold">
                                  {lang === "ur" ? "تجدید:" : "Expires:"} 21 Sep 2026
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-extrabold text-[#087F63] bg-[#E8F5EF] px-2.5 py-1 rounded-full border border-[#A0CEBC]">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unlock Other Commodities (Primary Single Unlock + Secondary Multi Unlock) */}
                  <div className="pt-1">
                    <h5 className="text-xs font-extrabold text-[#183B34] uppercase tracking-wider mb-2.5">
                      {lang === "ur" ? "دیگر اجناس ان لاک کریں" : "Unlock Other Commodities"}
                    </h5>
                    <div className="space-y-2">
                      {[
                        { name: "Cotton", category: "Cash Crops", price: "PKR 3,000 / mo" },
                        { name: "Rice", category: "Grains & Paddy", price: "PKR 3,000 / mo" },
                        { name: "Maize", category: "Grains & Feeds", price: "PKR 3,000 / mo" },
                        { name: "Sugar", category: "Sugar & Sweeteners", price: "PKR 3,000 / mo" },
                        { name: "Pulses", category: "Lentils & Pulses", price: "PKR 3,000 / mo" },
                        { name: "Mustard", category: "Oilseeds & Mustard", price: "PKR 3,000 / mo" },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#D5E2DD] shadow-sm"
                        >
                          <div className="flex items-center gap-2.5">
                            <ProductIcon name={item.name} vertical="Grains" size={28} />
                            <div>
                              <p className="text-xs font-bold text-[#183B34]">{tc(item.name)}</p>
                              <p className="text-[10.5px] text-[#52635F]">{item.price}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSubsModalOpen(false);
                              push({
                                id: "billing",
                                product: item.name,
                                vertical: "Grains",
                              });
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#087F63] text-white font-extrabold text-xs shadow-sm hover:bg-[#064D40] transition"
                          >
                            {lang === "ur" ? `ان لاک کریں →` : `Unlock →`}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Subtle Multiple Commodities Unlock Link */}
                    <div className="mt-4 pt-3 border-t border-[#D5E2DD] text-center">
                      <button
                        onClick={() => {
                          setSubsModalOpen(false);
                          setCompleteProfileOpen(true);
                        }}
                        className="text-xs font-bold text-[#087F63] hover:underline px-3 py-1.5 rounded-lg bg-[#E8F5EF] border border-[#A0CEBC]"
                      >
                        {lang === "ur" ? "ایک ساتھ متعدد اجناس ان لاک کریں →" : "Unlock Multiple Commodities at Once →"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── 4. VOICE & LANGUAGE MODAL ───────────────────────────────── */}
      {voiceLangModalOpen && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 350 }}
          onClick={() => setVoiceLangModalOpen(false)}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#D5E2DD]">
              <h3 className="font-bold text-lg text-[#183B34]">
                {lang === "ur" ? "آواز اور زبان کی سیٹنگز" : "Voice & Language Settings"}
              </h3>
              <button
                onClick={() => setVoiceLangModalOpen(false)}
                className="text-sm font-semibold px-3 py-1 rounded-full bg-[#E8EFEC] text-[#52635F]"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#183B34] mb-2">
                  {lang === "ur" ? "ایپ کی زبان منتخب کریں" : "Select Language"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLang("ur")}
                    className="p-4 rounded-2xl border text-center transition font-bold"
                    style={{
                      background: lang === "ur" ? "#087F63" : "#fff",
                      color: lang === "ur" ? "#fff" : "#183B34",
                      borderColor: lang === "ur" ? "#087F63" : "#D5E2DD",
                      fontFamily: "'Noto Nastaliq Urdu', serif",
                    }}
                  >
                    اردو (Urdu)
                  </button>
                  <button
                    onClick={() => setLang("en")}
                    className="p-4 rounded-2xl border text-center transition font-bold"
                    style={{
                      background: lang === "en" ? "#087F63" : "#fff",
                      color: lang === "en" ? "#fff" : "#183B34",
                      borderColor: lang === "en" ? "#087F63" : "#D5E2DD",
                    }}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#D5E2DD] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-[#183B34]">
                      {lang === "ur" ? "آواز کا معاون (Voice Assistant)" : "Voice Assistance"}
                    </p>
                    <p className="text-xs text-[#52635F]">
                      {lang === "ur"
                        ? "منڈی کے ریٹس پر کلک کرنے پر بول کر بتائیں"
                        : "Read out rates when tapping cards"}
                    </p>
                  </div>
                  <button
                    onClick={() => homeSetVoiceEnabled(!homeVoiceEnabled)}
                    className="w-12 h-6 rounded-full transition relative"
                    style={{ background: homeVoiceEnabled ? "#087F63" : "#D1D5DB" }}
                  >
                    <span
                      className="w-5 h-5 rounded-full bg-white block absolute top-0.5 transition"
                      style={{ left: homeVoiceEnabled ? "26px" : "2px" }}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#52635F] mb-1.5">
                    {lang === "ur" ? "بولنے کی رفتار" : "Speech Speed"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["0.8x", "1.0x", "1.2x"] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setSpeechRate(spd)}
                        className="py-1.5 rounded-lg text-xs font-bold border"
                        style={{
                          background: speechRate === spd ? "#087F63" : "#F4FAF7",
                          color: speechRate === spd ? "#fff" : "#183B34",
                          borderColor: speechRate === spd ? "#087F63" : "#D5E2DD",
                        }}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    speakText(
                      lang === "ur"
                        ? "زرعی منڈی میں خوش آمدید۔ آواز کا نظام بالکل ٹھیک کام کر رہا ہے۔"
                        : "Welcome to ZaraiMandi. The voice assistance system is functioning properly.",
                    );
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#E8F5EF] text-[#087F63] font-bold text-xs flex items-center justify-center gap-2 border border-[#A0CEBC]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#087F63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <span>{lang === "ur" ? "آواز کا نمونہ سنیں" : "Test Voice Audio"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setVoiceLangModalOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-[#087F63] text-white font-extrabold text-sm shadow-md"
              >
                {lang === "ur" ? "سیٹنگز محفوظ کریں" : "Save Preferences"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. BECOME A REPRESENTATIVE CONFIRMATION DIALOGUE MODAL ─ */}
      {repConfirmModalOpen && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 350 }}
          onClick={() => setRepConfirmModalOpen(false)}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#D5E2DD]">
              <h3 className="font-bold text-lg text-[#183B34]">
                {lang === "ur" ? "زرعی منڈی کے باضابطہ نمائندہ بنیں" : "Become a Representative"}
              </h3>
              <button
                onClick={() => setRepConfirmModalOpen(false)}
                className="text-sm font-semibold px-3 py-1 rounded-full bg-[#E8EFEC] text-[#52635F]"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5EF] text-[#087F63] flex items-center justify-center mx-auto border border-[#A0CEBC]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#087F63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base font-black text-[#183B34]">
                  {lang === "ur" ? "منڈی پارٹنر اور نمائندہ اکاؤنٹ" : "Mandi Representative Account"}
                </h4>
                <p className="text-xs text-[#52635F] leading-relaxed max-w-sm mx-auto">
                  {lang === "ur"
                    ? "اپنے علاقے کی منڈی کے لیے نمائندہ اکاؤنٹ رجسٹر کریں۔ رجسٹریشن کے بعد آپ ایک ہی اکاؤنٹ سے کسٹمر اور نمائندہ ڈیش بورڈ کے درمیان کسی بھی وقت سوئچ کر سکتے ہیں۔"
                    : "Register as an authorized representative for your local mandi. Once set up under this phone/email, you can seamlessly switch between Customer and Representative dashboards anytime."}
                </p>
              </div>

              {/* <div className="p-3.5 rounded-xl bg-white border border-[#D5E2DD] text-xs text-[#183B34] font-semibold text-left space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[#087F63] font-bold">✓</span>
                  <span>15% recurring mandi commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#087F63] font-bold">✓</span>
                  <span>Dual account switching with double-tap on profile icon</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#087F63] font-bold">✓</span>
                  <span>Direct mandi daily rate submissions</span>
                </div>
              </div> */}

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setRepConfirmModalOpen(false);
                    onStartRepOnboarding?.();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#087F63] text-white font-extrabold text-sm shadow-md"
                >
                  {lang === "ur" ? "رجسٹریشن شروع کریں →" : "Continue to Registration →"}
                </button>
                <button
                  type="button"
                  onClick={() => setRepConfirmModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#E8EFEC] text-[#52635F] font-bold text-xs"
                >
                  {lang === "ur" ? "منسوخ کریں" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. SETTINGS MODAL ───────────────────────────────────────── */}
      {settingsModalOpen && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 350 }}
          onClick={() => setSettingsModalOpen(false)}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#D5E2DD]">
              <h3 className="font-bold text-lg text-[#183B34]">
                {lang === "ur" ? "ایپ سیٹنگز اور الرٹس" : "App Settings & Alerts"}
              </h3>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="text-sm font-semibold px-3 py-1 rounded-full bg-[#E8EFEC] text-[#52635F]"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#183B34] mb-2">
                  {lang === "ur" ? "وزن اور قیمت کی اکائی" : "Rate & Weight Unit"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "maund", label: lang === "ur" ? "من (40kg)" : "40kg Maund" },
                    { id: "kg100", label: "100 kg" },
                    { id: "ton", label: lang === "ur" ? "ٹن (Metric Ton)" : "Metric Ton" },
                  ].map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setWeightUnit(u.id as any)}
                      className="py-2 px-2 rounded-xl text-xs font-bold border text-center transition"
                      style={{
                        background: weightUnit === u.id ? "#087F63" : "#fff",
                        color: weightUnit === u.id ? "#fff" : "#183B34",
                        borderColor: weightUnit === u.id ? "#087F63" : "#D5E2DD",
                      }}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#D5E2DD] space-y-3">
                <h4 className="text-xs font-extrabold text-[#183B34] uppercase tracking-wider">
                  {lang === "ur" ? "الرٹس اور اطلاعات" : "Alert Channels"}
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#183B34]">WhatsApp Rate Alerts</p>
                    <p className="text-[11px] text-[#52635F]">
                      {lang === "ur" ? "صبح اور شام واٹس ایپ پر ریٹس حاصل کریں" : "Daily rates on WhatsApp"}
                    </p>
                  </div>
                  <button
                    onClick={() => setAlertWhatsApp(!alertWhatsApp)}
                    className="w-10 h-5 rounded-full transition relative"
                    style={{ background: alertWhatsApp ? "#087F63" : "#D1D5DB" }}
                  >
                    <span
                      className="w-4 h-4 rounded-full bg-white block absolute top-0.5 transition"
                      style={{ left: alertWhatsApp ? "22px" : "2px" }}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between border-t border-[#F1F7F4] pt-2">
                  <div>
                    <p className="text-xs font-bold text-[#183B34]">SMS Summary Alerts</p>
                    <p className="text-[11px] text-[#52635F]">
                      {lang === "ur" ? "بغیر انٹرنیٹ ایس ایم ایس ریٹس" : "Offline SMS daily closing"}
                    </p>
                  </div>
                  <button
                    onClick={() => setAlertSms(!alertSms)}
                    className="w-10 h-5 rounded-full transition relative"
                    style={{ background: alertSms ? "#087F63" : "#D1D5DB" }}
                  >
                    <span
                      className="w-4 h-4 rounded-full bg-white block absolute top-0.5 transition"
                      style={{ left: alertSms ? "22px" : "2px" }}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between border-t border-[#F1F7F4] pt-2">
                  <div>
                    <p className="text-xs font-bold text-[#183B34]">Morning Mandi Bell</p>
                    <p className="text-[11px] text-[#52635F]">
                      {lang === "ur" ? "صبح منڈی کھلنے پر نوٹیفکیشن" : "Notify when trading begins"}
                    </p>
                  </div>
                  <button
                    onClick={() => setAlertMorningBell(!alertMorningBell)}
                    className="w-10 h-5 rounded-full transition relative"
                    style={{ background: alertMorningBell ? "#087F63" : "#D1D5DB" }}
                  >
                    <span
                      className="w-4 h-4 rounded-full bg-white block absolute top-0.5 transition"
                      style={{ left: alertMorningBell ? "22px" : "2px" }}
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSettingsModalOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-[#087F63] text-white font-extrabold text-sm shadow-md"
              >
                {lang === "ur" ? "سیٹنگز محفوظ کریں" : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 7. HELP & SUPPORT MODAL ─────────────────────────────────── */}
      {helpModalOpen && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 350 }}
          onClick={() => setHelpModalOpen(false)}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "92vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#D5E2DD]">
              <h3 className="font-bold text-lg text-[#183B34]">
                {lang === "ur" ? "مدد اور کسٹمر سپورٹ" : "Help & Customer Support"}
              </h3>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="text-sm font-semibold px-3 py-1 rounded-full bg-[#E8EFEC] text-[#52635F]"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-xs flex flex-col items-center justify-center text-center shadow gap-1"
                >
                  <span className="text-xl">💬</span>
                  <span>{lang === "ur" ? "واٹس ایپ سپورٹ" : "WhatsApp Chat"}</span>
                  <span className="text-[10px] opacity-90">0300 1234567</span>
                </a>
                <a
                  href="tel:080092724"
                  className="p-3.5 rounded-2xl bg-[#087F63] text-white font-bold text-xs flex flex-col items-center justify-center text-center shadow gap-1"
                >
                  <span className="text-xl">📞</span>
                  <span>{lang === "ur" ? "ٹول فری ہیلپ لائن" : "Toll-Free Call"}</span>
                  <span className="text-[10px] opacity-90">0800-ZARAI (92724)</span>
                </a>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-[#183B34] uppercase tracking-wider mb-2">
                  {lang === "ur" ? "اکثر پوچھے گئے سوالات (FAQ)" : "Frequently Asked Questions"}
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      q: lang === "ur" ? "منڈی کے ریٹس کتنی بار اپ ڈیٹ ہوتے ہیں؟" : "How often are mandi rates updated?",
                      a: lang === "ur" ? "صبح 8 بجے سے شام 6 بجے تک ہر 15 منٹ بعد لائیو ریٹس منڈیوں سے براہ راست اپ ڈیٹ کیے جاتے ہیں۔" : "Rates are updated live every 15 minutes during active trading hours (8:00 AM to 6:00 PM).",
                    },
                    {
                      q: lang === "ur" ? "کیا میں اپنے پسندیدہ اجناس منتخب کر سکتا ہوں؟" : "Can I customize my favorite commodities?",
                      a: lang === "ur" ? "جی ہاں، آپ کسی بھی وقت اپنی پسندیدہ اجناس اور منڈیاں تبدیل کر سکتے ہیں۔" : "Yes, you can customize your tracked commodities and mandis in the app anytime.",
                    },
                    {
                      q: lang === "ur" ? "ادائیگی کے کون سے طریقے دستیاب ہیں؟" : "What payment methods are supported?",
                      a: lang === "ur" ? "JazzCash، EasyPaisa، SadaPay، NayaPay اور تمام پاکستانی بینک ٹرانسفرز دستیاب ہیں۔" : "JazzCash, EasyPaisa, SadaPay, NayaPay, and direct 1Link Bank Transfers are supported.",
                    },
                  ].map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#D5E2DD] bg-white overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setFaqExpanded(faqExpanded === idx ? null : idx)
                        }
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left font-bold text-xs text-[#183B34]"
                      >
                        <span>{faq.q}</span>
                        <span>{faqExpanded === idx ? "▲" : "▼"}</span>
                      </button>
                      {faqExpanded === idx && (
                        <p className="px-3.5 pb-3 text-xs text-[#52635F] leading-relaxed border-t border-[#F1F7F4] pt-2">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-[#183B34] uppercase tracking-wider mb-1.5">
                  {lang === "ur" ? "رائے یا شکایت درج کریں" : "Send Feedback / Report Issue"}
                </h4>
                {supportSent ? (
                  <div className="p-3 rounded-xl bg-[#E8F5EF] text-[#087F63] text-xs font-bold text-center">
                    {lang === "ur" ? "شکریہ! آپ کا پیغام موصول ہو گیا ہے۔" : "Thank you! Your feedback has been sent."}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={supportFeedback}
                      onChange={(e) => setSupportFeedback(e.target.value)}
                      placeholder={lang === "ur" ? "اپنا پیغام یہاں لکھیں..." : "Type your message or issue..."}
                      className="w-full p-3 rounded-xl border border-[#C7D6D0] bg-white text-xs text-[#183B34] outline-none resize-none"
                    />
                    <button
                      onClick={() => {
                        if (supportFeedback.trim()) {
                          setSupportSent(true);
                          setSupportFeedback("");
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#087F63] text-white font-bold text-xs shadow"
                    >
                      {lang === "ur" ? "پیغام بھیجیں" : "Submit Feedback"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 8. ABOUT ZARAIMANDI MODAL ──────────────────────────────── */}
      {aboutModalOpen && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 350 }}
          onClick={() => setAboutModalOpen(false)}
        >
          <div
            className="zm-sheet-high"
            style={{ background: "#F4FAF7", maxHeight: "88vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#D5E2DD]">
              <h3 className="font-bold text-lg text-[#183B34]">
                {lang === "ur" ? "زرعی منڈی کے بارے میں" : "About ZaraiMandi"}
              </h3>
              <button
                onClick={() => setAboutModalOpen(false)}
                className="text-sm font-semibold px-3 py-1 rounded-full bg-[#E8EFEC] text-[#52635F]"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#064D40] to-[#2FAE68] text-white flex items-center justify-center text-3xl mx-auto shadow-md">
                🌾
              </div>
              <div>
                <h4 className="text-xl font-black text-[#183B34]">ZaraiMandi</h4>
                <p className="text-xs font-bold text-[#087F63]">
                  v2.4.0 (Live Mandi Network Engine)
                </p>
              </div>
              <p className="text-xs text-[#52635F] leading-relaxed max-w-sm mx-auto">
                {lang === "ur"
                  ? "زرعی منڈی پاکستان کے تمام کسانوں، بیوپاریوں، آڑھتیوں اور مل مالکان کے لیے ایک جدید ترین ڈیجیٹل مارکیٹ پلیٹ فارم ہے جہاں روزانہ کے ریٹس، آمد کے اعداد و شمار اور منڈی رپورٹس براہ راست دستیاب ہیں۔"
                  : "ZaraiMandi is Pakistan's premier digital grain & agri-product market network, providing live mandi rates, transparent price discovery, and trade analytics for farmers, traders, and millers."}
              </p>
              <div className="p-3.5 rounded-xl bg-white border border-[#D5E2DD] text-xs text-[#52635F] space-y-1 text-left">
                <p>• <strong>{lang === "ur" ? "ڈیٹا سورس" : "Data Coverage"}:</strong> 120+ Mandis across Punjab, Sindh, KPK, Balochistan</p>
                <p>• <strong>{lang === "ur" ? "سپورٹڈ اجناس" : "Commodities"}:</strong> Wheat, Rice, Maize, Cotton, Pulses, Mustard, Oilseeds</p>
                <p>• <strong>{lang === "ur" ? "لائسنس" : "License"}:</strong> ZaraiMandi Technologies Pakistan</p>
              </div>
              <button
                onClick={() => setAboutModalOpen(false)}
                className="w-full py-3 rounded-xl bg-[#087F63] text-white font-bold text-xs"
              >
                {lang === "ur" ? "بند کریں" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 9. LOG OUT CONFIRMATION MODAL ──────────────────────────── */}
      {logoutModalOpen && (
        <div
          className="zm-sheet-overlay"
          style={{
            zIndex: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center"
            style={{
              animation: "screenEnter 0.2s ease-out",
              border: "1.5px solid #D5E2DD",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-extrabold text-[#183B34] mb-1.5">
              {lang === "ur" ? "کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟" : "Are you sure you want to log out?"}
            </h3> 
            <div className="flex gap-2.5">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#F1F7F4] text-[#52635F] font-bold text-xs"
              >
                {lang === "ur" ? "منسوخ کریں" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  setLogoutModalOpen(false);
                  if (onRestartOnboarding) onRestartOnboarding("signin");
                }}
                className="flex-1 py-3 rounded-xl bg-[#DC2626] text-white font-extrabold text-xs shadow"
              >
                {lang === "ur" ? "لاگ آؤٹ کریں" : "Yes, Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {completeProfileOpen && (
        <CompleteProfileModal
          data={profileSetupData}
          onUpdateData={updateProfileSetupData}
          onClose={() => setCompleteProfileOpen(false)}
          onComplete={handleCompleteProfileSubmit}
          initialUserData={initialUserData}
        />
      )}

      {/* Favorites Subscription Prompt Modal */}
      {favLockModalOpen && (
        <div
          className="zm-sheet-overlay"
          style={{
            zIndex: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setFavLockModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center"
            style={{
              animation: "screenEnter 0.2s ease-out",
              border: "1.5px solid #D5E2DD",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#E4F2EC",
                color: "#087F63",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                margin: "0 auto 12px",
              }}
            >
              🔒
            </div>
            <h3
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#183B34",
                marginBottom: 6,
              }}
            >
              {lang === "ur"
                ? "پسندیدہ اشیاء شامل کرنے کے لیے سبسکرائب کریں"
                : "Subscribe to Add Favorites"}
            </h3>
            <p
              style={{
                fontSize: 12.5,
                color: "#52635F",
                lineHeight: 1.5,
                marginBottom: 18,
              }}
            >
              {lang === "ur"
                ? "اپنی پسندیدہ زرعی اجناس کو محفوظ کرنے، لائیو منڈی ریٹ الرٹس اور روزانہ تجزیاتی رپورٹس حاصل کرنے کے لیے اپنا پروفائل سیٹ اپ یا سبسکرپشن پلان مکمل کریں۔"
                : "Complete your profile setup and subscribe to customize your favorite products."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  setFavLockModalOpen(false);
                  setCompleteProfileOpen(true);
                }}
                className="tap-target w-full py-3 rounded-2xl font-extrabold text-sm text-white"
                style={{
                  background: "#087F63",
                  boxShadow: "0 4px 14px rgba(8,127,99,0.3)",
                }}
              >
                {lang === "ur"
                  ? "پروفائل مکمل کریں اور سبسکرائب کریں →"
                  : "Complete Profile →"}
              </button>
              <button
                type="button"
                onClick={() => setFavLockModalOpen(false)}
                className="tap-target w-full py-2.5 rounded-2xl font-bold text-xs"
                style={{ background: "#F1F7F4", color: "#52635F" }}
              >
                {lang === "ur" ? "بعد میں" : "Not Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {notifOpen && (
        <div
          className="zm-sheet-overlay"
          style={{ zIndex: 300 }}
          onClick={() => setNotifOpen(false)}
        >
          <div
            className="zm-sheet-high"
            style={{
              background: "#F4FAF7",
              maxHeight: "80vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-5 pt-4 pb-3 flex-shrink-0"
              style={{
                borderBottom: "1px solid #D5E2DD",
              }}
            >
              <div
                className="w-10 h-1 rounded-full mx-auto mb-3"
                style={{
                  background: "#C7D6D0",
                }}
              />

              <div className="flex items-center justify-between">
                <p className="font-bold text-lg">Notifications</p>

                <button
                  onClick={() => setNotifOpen(false)}
                  className="tap-target text-sm font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: "#E8EFEC",
                    color: "#52635F",
                  }}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto">
              {pickedByproducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <span
                    style={{
                      fontSize: 36,
                    }}
                  >
                    🔔
                  </span>

                  <p
                    className="font-bold mt-3"
                    style={{
                      color: "#183B34",
                    }}
                  >
                    No Picks Yet
                  </p>

                  <p
                    className="text-sm mt-1"
                    style={{
                      color: "#52635F",
                    }}
                  >
                    Star a by-product to get rate alerts here.
                  </p>
                </div>
              ) : (
                pickedByproducts.map((item, i) => {
                  const row = allMandiRows.find(
                    (r) =>
                      r.product === item.product &&
                      r.byproduct === item.byproduct,
                  );

                  const hoursAgo = [2, 5, 1, 8, 3, 6, 12, 4][i % 8];

                  const trendRow = row?.trend || "stable";

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-5 py-3.5"
                      style={{
                        borderBottom: "1px solid #E8EFEC",
                      }}
                    >
                      {/* Trend icon */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            trendRow === "up"
                              ? "#E4F2EC"
                              : trendRow === "down"
                                ? "#F9E1DE"
                                : "#E8EFEC",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 18,
                            color:
                              trendRow === "up"
                                ? "#087F63"
                                : trendRow === "down"
                                  ? "#A83B37"
                                  : "#52635F",
                          }}
                        >
                          {trendRow === "up"
                            ? "↗"
                            : trendRow === "down"
                              ? "↘"
                              : "→"}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-bold text-sm truncate"
                          style={{
                            color: "#183B34",
                          }}
                        >
                          {item.byproduct || item.product}
                        </p>

                        <p
                          className="text-xs"
                          style={{
                            color:
                              trendRow === "up"
                                ? "#075E4F"
                                : trendRow === "down"
                                  ? "#A83B37"
                                  : "#52635F",
                          }}
                        >
                          {row
                            ? `Rate updated · Rs.${row.min.toLocaleString()}–${row.max.toLocaleString()} / 40 kg`
                            : "Rate updated"}
                        </p>
                      </div>

                      <span
                        className="text-[11px] flex-shrink-0"
                        style={{
                          color: "#80918B",
                        }}
                      >
                        {hoursAgo}h ago
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// VOICE ASSISTANT SYSTEM

function MicSVG({
  size = 24,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="11" rx="3" fill={color} />
      <path
        d="M5 11a7 7 0 0014 0"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <line
        x1="12"
        y1="18"
        x2="12"
        y2="22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="22"
        x2="16"
        y2="22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VoiceWaveform({
  color = "#2FAE68",
  count = 10,
}: {
  color?: string;
  count?: number;
}) {
  const hs = [4, 7, 5, 10, 6, 9, 4, 8, 5, 7];
  return (
    <div className="flex gap-[3px] items-end" style={{ height: 32 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-full animate-pulse"
          style={{
            width: 4,
            height: (hs[i % hs.length] ?? 6) * 2.8,
            background: color,
            animationDelay: `${i * 0.07}s`,
            animationDuration: "0.75s",
          }}
        />
      ))}
    </div>
  );
}

// Orientation overlay — dims home screen, shows tooltip cards anchored near each button.
// z-[45] keeps it BELOW the nav bar (z-50) so the user can always use nav or hold the mic.
// backdrop is pointer-events:none so tapping underlying buttons still works;
// individual cards are pointer-events:auto.

const ORIENT_CARDS = [
  {
    key: "search",
    label: "Search",
    labelUr: "تلاش",
    desc: "Type in your byproduct to see its detail",
    descUr: "کسی بھی جنس یا ضمنی مصنوع کا نام بول کر یا لکھ کر ریٹ دیکھیں",
    pos: { top: 218, left: 16, right: 16 } as React.CSSProperties,
  },
  {
    key: "product",
    label: "Product",
    labelUr: "مصنوعات",
    desc: "Discover your bought product prices",
    descUr: "اپنی فصل منتخب کریں اور تمام ضمنی مصنوعات کے ریٹ معلوم کریں",
    pos: { top: 316, left: 18, width: 186 } as React.CSSProperties,
  },
  {
    key: "livemarket",
    label: "Live Market",
    labelUr: "لائیو مارکیٹ",
    desc: "Discover live market interaction",
    descUr: "پاکستان بھر کی فعال منڈیوں کے تازہ ترین براہ راست ریٹس",
    pos: { top: 240, right: 18, width: 138 } as React.CSSProperties,
  },
  {
    key: "mandi",
    label: "Mandi",
    labelUr: "منڈیاں",
    desc: "See what is available in the mandis",
    descUr: "پاکستان کی تمام منڈیاں دیکھیں اور آج کے تازہ ریٹس جانیں",
    pos: { top: 330, right: 18, width: 138 } as React.CSSProperties,
  },
  {
    key: "yourpicks",
    label: "Your Picks",
    labelUr: "پسندیدہ",
    desc: "Your favourites are shown here",
    descUr: "آپ کے منتخب کردہ پسندیدہ آئٹمز کے ریٹس یہاں ملیں گے",
    pos: { top: 418, left: 16, right: 16 } as React.CSSProperties,
  },
];

function translateVoiceUrdu(text: string): string {
  if (!text) return "";
  // If text already contains Urdu characters, return as is
  if (/[\u0600-\u06FF]/.test(text)) return text;

  const trimmed = text.trim();
  if (AUTO_URDU_DICT[trimmed]) return AUTO_URDU_DICT[trimmed];

  const PHRASES: Record<string, string> = {
    "All products selected. All prices are shown.":
      "تمام مصنوعات منتخب ہیں۔ تمام قیمتیں دکھائی جا رہی ہیں۔",
    "All byproducts shown.": "تمام ضمنی مصنوعات دکھائی جا رہی ہیں۔",
    "All price types are shown.": "تمام ریٹس دکھائے جا رہے ہیں۔",
    "Prices of my country shown.": "پورے ملک کی قیمتیں دکھائی جا رہی ہیں۔",
    "Search. Find any product or byproduct by name to see its prices.":
      "تلاش۔ کسی بھی اجناس یا ضمنی مصنوع کا نام بول کر یا لکھ کر قیمت دیکھیں۔",
    "Product. Select a crop or product to discover its byproduct prices.":
      "مصنوعات۔ اپنی فصل منتخب کریں اور اس کی تمام ضمنی مصنوعات کے ریٹ دیکھیں۔",
    "Live Market. See real-time prices from active mandis across Pakistan.":
      "لائیو مارکیٹ۔ پاکستان کی تمام فعال منڈیوں کے تازہ ترین براہ راست ریٹس دیکھیں۔",
    "Mandi. Browse all markets across Pakistan and see today's rates.":
      "منڈی۔ پاکستان کی منڈیاں دیکھیں اور آج کے تازہ ریٹس جانیں۔",
    "Notification bell. All market updates and alerts are shown here.":
      "اطلاعات۔ تمام مارکیٹ اپڈیٹس اور اہم اعلانات یہاں ملیں گے۔",
    "Your Picks. Your favourite byproducts are shown here on your homescreen.":
      "آپ کی پسند۔ آپ کی پسندیدہ ضمنی مصنوعات یہاں دکھائی دیتی ہیں۔",
    "This product is locked. Please upgrade to access it.":
      "یہ مصنوع لاک ہے۔ رسائی کے لیے اکاؤنٹ اپگریڈ کریں۔",
  };
  if (PHRASES[trimmed]) return PHRASES[trimmed];

  // Dynamic patterns
  let m = trimmed.match(/^All (.*?) byproduct prices are shown\.$/i);
  if (m) {
    const c = AUTO_URDU_DICT[m[1]] || m[1];
    return `${c} کی تمام ضمنی مصنوعات کے ریٹس دکھائے جا رہے ہیں۔`;
  }

  m = trimmed.match(/^All byproducts of (.*?) shown\.$/i);
  if (m) {
    const c = AUTO_URDU_DICT[m[1]] || m[1];
    return `${c} کی تمام ضمنی مصنوعات دکھائی جا رہی ہیں۔`;
  }

  m = trimmed.match(/^Prices of (.*?) are shown\.$/i);
  if (m) {
    const item = AUTO_URDU_DICT[m[1]] || m[1];
    return `${item} کی قیمتیں دکھائی جا رہی ہیں۔`;
  }

  m = trimmed.match(/^All (.*?) rates are shown\.$/i);
  if (m) {
    const rt = AUTO_URDU_DICT[m[1]] || m[1];
    return `تمام ${rt} دکھائے جا رہے ہیں۔`;
  }

  m = trimmed.match(/^Prices of (.*?) district are shown\.$/i);
  if (m) {
    const d = AUTO_URDU_DICT[m[1]] || m[1];
    return `ضلع ${d} کی قیمتیں دکھائی جا رہی ہیں۔`;
  }

  m = trimmed.match(/^Prices of (\d+) locations are shown\.$/i);
  if (m) {
    return `${m[1]} مقامات کی قیمتیں دکھائی جا رہی ہیں۔`;
  }

  return AUTO_URDU_DICT[trimmed] || trimmed;
}

function speakText(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();

    let textToSpeak = text;
    if (appLang === "ur") {
      textToSpeak = translateVoiceUrdu(text);
    }

    const u = new SpeechSynthesisUtterance(textToSpeak);
    u.lang = appLang === "ur" ? "ur-PK" : "en-US";
    u.rate = appLang === "ur" ? 0.85 : 0.95;

    if (appLang === "ur") {
      const voices = window.speechSynthesis.getVoices();
      const urVoice =
        voices.find(
          (v) =>
            v.lang === "ur-PK" || v.lang === "ur" || v.lang.startsWith("ur-"),
        ) ||
        voices.find(
          (v) =>
            v.name.toLowerCase().includes("urdu") ||
            v.lang.toLowerCase().includes("ur"),
        ) ||
        voices.find((v) => v.lang.startsWith("hi") || v.lang.startsWith("ar"));
      if (urVoice) {
        u.voice = urVoice;
      }
    }

    window.speechSynthesis.speak(u);
  }
}

function VoiceOrientationOverlay({ onClose }: { onClose: () => void }) {
  const { lang, t } = useLang();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleCardTap = (
    key: string,
    labelEn: string,
    labelUr: string,
    descEn: string,
    descUr: string,
  ) => {
    const next = activeCard === key ? null : key;
    setActiveCard(next);
    if (next) {
      if (lang === "ur") {
        speakText(`${labelUr}۔ ${descUr}`);
      } else {
        speakText(`${labelEn}. ${descEn}`);
      }
    } else {
      window.speechSynthesis?.cancel();
    }
  };

  return (
    // pointer-events:none on backdrop so home-screen buttons remain tappable
    <div
      className="absolute inset-0"
      dir={lang === "ur" ? "rtl" : "ltr"}
      style={{
        background: "rgba(5,25,15,0.55)",
        zIndex: 45,
        pointerEvents: "none",
        fontFamily:
          lang === "ur"
            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
            : "'Inter', sans-serif",
      }}
    >
      {/* Close pill — pointer-events:auto */}
      <button
        onClick={onClose}
        className="absolute flex items-center justify-center rounded-full text-white font-bold"
        style={{
          top: 48,
          [lang === "ur" ? "right" : "left"]: 16,
          height: 32,
          paddingLeft: 14,
          paddingRight: 14,
          background: "rgba(255,255,255,0.22)",
          fontSize: 12,
          letterSpacing: "0.02em",
          pointerEvents: "auto",
          zIndex: 46,
          border: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(6px)",
        }}
      >
        {lang === "ur" ? "✕ رہنمائی بند کریں" : "✕ Close guide"}
      </button>

      {/* Tap-to-hear hint pill */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
        style={{
          top: 48,
          pointerEvents: "none",
          width: "max-content",
          maxWidth: "90%",
        }}
      >
        <span
          className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full text-center"
          style={{
            background: "rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(6px)",
          }}
        >
          {lang === "ur"
            ? "سننے کے لیے کارڈ دبائیں · بولنے کے لیے مائیک دبا کر رکھیں"
            : "Tap a card to hear it · Hold mic to speak"}
        </span>
      </div>

      {/* Tooltip cards — individually pointer-events:auto, positioned near their button */}
      {ORIENT_CARDS.map((card) => {
        const isActive = activeCard === card.key;
        const titleText = lang === "ur" ? card.labelUr : card.label;
        const descText = lang === "ur" ? card.descUr : card.desc;

        return (
          <button
            key={card.key}
            onClick={() =>
              handleCardTap(
                card.key,
                card.label,
                card.labelUr,
                card.desc,
                card.descUr,
              )
            }
            className={`absolute flex items-center gap-2 rounded-xl ${lang === "ur" ? "text-right" : "text-left"}`}
            style={{
              ...card.pos,
              pointerEvents: "auto",
              background: isActive ? "#087F63" : "rgba(255,255,255,0.96)",
              borderLeft:
                lang === "ur"
                  ? undefined
                  : `3.5px solid ${isActive ? "#2FAE68" : "#087F63"}`,
              borderRight:
                lang === "ur"
                  ? `3.5px solid ${isActive ? "#2FAE68" : "#087F63"}`
                  : undefined,
              boxShadow: isActive
                ? "0 4px 18px rgba(15,138,95,0.55)"
                : "0 2px 12px rgba(0,0,0,0.22)",
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 10,
              paddingRight: 10,
              transition: "all 0.15s ease",
              zIndex: 46,
            }}
          >
            {/* Speaker icon */}
            <div
              className="flex-shrink-0 rounded-full flex items-center justify-center"
              style={{
                width: 26,
                height: 26,
                background: isActive ? "rgba(255,255,255,0.22)" : "#E4F2EC",
                flexShrink: 0,
              }}
            >
              <MicSVG size={13} color={isActive ? "#fff" : "#087F63"} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="font-bold text-[12px] leading-tight"
                style={{
                  color: isActive ? "#fff" : "#16352F",
                  fontFamily:
                    lang === "ur"
                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                      : "'Poppins', sans-serif",
                }}
              >
                {titleText}
              </p>
              <p
                className="text-[11px] leading-tight mt-0.5"
                style={{
                  color: isActive ? "rgba(255,255,255,0.85)" : "#52635F",
                  fontFamily:
                    lang === "ur"
                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                      : "'Inter', sans-serif",
                }}
              >
                {descText}
              </p>
            </div>
            {isActive && (
              <span style={{ fontSize: 13, flexShrink: 0 }}>🔊</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Voice listening / processing / speaking overlay
function VoiceQueryOverlay({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (s: Screen) => void;
}) {
  const { lang, t } = useLang();
  const [phase, setPhase] = useState<"listening" | "processing" | "speaking">(
    "listening",
  );
  const [transcript, setTranscript] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearT = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    // Speak initial listening cue
    if (lang === "ur") {
      speakText("فرمائیے، میں سن رہا ہوں");
    }

    // Simulate: after 2.5s user finishes speaking
    timerRef.current = setTimeout(() => {
      const userSpoken =
        lang === "ur"
          ? "پاکپتن منڈی میں گندم کا مل ریٹ"
          : "Wheat in Pakpattan Mandi, Mill Rate";
      setTranscript(userSpoken);
      setPhase("processing");

      timerRef.current = setTimeout(() => {
        setPhase("speaking");
        if (lang === "ur") {
          speakText("پاکپتن منڈی میں گندم کا مل ریٹ ۲۸۵۰ روپے ہے۔");
        } else {
          speakText("Wheat Mill Rate in Pakpattan Mandi is 2850 rupees.");
        }

        timerRef.current = setTimeout(() => {
          onClose();
          onNavigate({
            id: "product-rates",
            vertical: "Grains",
            product: "Wheat",
            byproduct: "Wheat",
            initialRateType: "Mill Rate",
            initialMandi: "Pakpattan Mandi",
            initialVariety: "Sona Moti",
            initialNewOld: "New",
            initialColor: "Golden",
            initialSpec: "Seed Quality",
            initialCondition: "Dry",
          });
        }, 2200);
      }, 1400);
    }, 2500);
    return clearT;
  }, [lang]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      dir={lang === "ur" ? "rtl" : "ltr"}
      style={{
        background: "rgba(5,25,15,0.82)",
        zIndex: 500,
        backdropFilter: "blur(4px)",
        fontFamily:
          lang === "ur"
            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
            : "'Inter', sans-serif",
      }}
    >
      <button
        onClick={() => {
          clearT();
          window.speechSynthesis?.cancel();
          onClose();
        }}
        className="absolute flex items-center justify-center rounded-full text-white font-bold"
        style={{
          top: 52,
          [lang === "ur" ? "left" : "right"]: 16,
          width: 32,
          height: 32,
          background: "rgba(255,255,255,0.18)",
          fontSize: 16,
        }}
      >
        ✕
      </button>

      {phase === "listening" && (
        <div className="flex flex-col items-center gap-5 px-8">
          {/* Pulsing mic ring */}
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg,#C94A43,#D95A51)",
              boxShadow:
                "0 0 0 14px rgba(220,38,38,0.18),0 0 0 28px rgba(220,38,38,0.08)",
              animation: "pulse 1.2s ease-in-out infinite",
            }}
          >
            <MicSVG size={32} color="#fff" />
          </div>
          <VoiceWaveform color="#2FAE68" count={12} />
          <p className="font-bold text-white text-xl">
            {lang === "ur" ? "سن رہے ہیں…" : "Listening…"}
          </p>
          <p
            className="text-sm text-center"
            style={{ color: "rgba(255,255,255,0.7)", maxWidth: 260 }}
          >
            {lang === "ur"
              ? 'مثال کے طور پر کہیں: "پاکپتن منڈی میں گندم، مل ریٹ"'
              : 'Say something like: "Wheat in Pakpattan Mandi, Mill Rate"'}
          </p>
        </div>
      )}

      {phase === "processing" && (
        <div className="flex flex-col items-center gap-5 px-8">
          <div className="w-12 h-12 rounded-full border-4 border-green-300 border-t-transparent animate-spin" />
          <p className="font-bold text-white text-xl">
            {lang === "ur" ? "سمجھ رہے ہیں…" : "Understanding…"}
          </p>
          {transcript && (
            <div
              className="rounded-xl px-4 py-3 text-center text-sm"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#D5E2DD",
                maxWidth: 280,
              }}
            >
              "{transcript}"
            </div>
          )}
        </div>
      )}

      {phase === "speaking" && (
        <div className="flex flex-col items-center gap-5 px-8">
          <VoiceWaveform color="#2FAE68" count={10} />
          <div
            className="rounded-2xl px-6 py-5 text-center"
            style={{
              background: "rgba(255,255,255,0.97)",
              border: "2px solid #087F63",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              maxWidth: 320,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div
                className="rounded-full flex items-center justify-center"
                style={{ width: 28, height: 28, background: "#087F63" }}
              >
                <MicSVG size={14} color="#fff" />
              </div>
              <span className="text-xs font-bold" style={{ color: "#087F63" }}>
                {lang === "ur" ? "آواز کا اسسٹنٹ" : "Voice Assistant"}
              </span>
            </div>
            <p className="font-semibold text-base" style={{ color: "#16352F" }}>
              {lang === "ur"
                ? "آپ کا مطلوبہ ریٹ تلاش کر لیا گیا ہے۔"
                : "Let me bring you the data."}
            </p>
            <p className="text-sm mt-1 font-bold" style={{ color: "#087F63" }}>
              {lang === "ur"
                ? "گندم · پاکپتن منڈی · مل ریٹ"
                : "Wheat · Pakpattan Mandi · Mill Rate"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

//  BOTTOM NAV

function BottomNav({
  active,
  onNav,
  onVoiceTap,
  onVoiceHold,
  voiceActive,
}: {
  active: NavTab;
  onNav: (t: NavTab) => void;
  onVoiceTap: () => void;
  onVoiceHold: () => void;
  voiceActive: boolean;
}) {
  const NAV_ICONS: Record<string, (active: boolean) => React.ReactNode> = {
    home: (on) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={on ? "#087F63" : "#52635F"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" fill="white" />
      </svg>
    ),
    analytics: (on) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="12"
          width="4"
          height="9"
          rx="1"
          fill={on ? "#087F63" : "#52635F"}
        />
        <rect
          x="10"
          y="7"
          width="4"
          height="14"
          rx="1"
          fill={on ? "#087F63" : "#52635F"}
        />
        <rect
          x="17"
          y="3"
          width="4"
          height="18"
          rx="1"
          fill={on ? "#087F63" : "#52635F"}
        />
      </svg>
    ),
    news: (on) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
          stroke={on ? "#087F63" : "#52635F"}
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="7"
          y1="9"
          x2="17"
          y2="9"
          stroke={on ? "#087F63" : "#52635F"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="7"
          y1="13"
          x2="14"
          y2="13"
          stroke={on ? "#087F63" : "#52635F"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  };
  const { t, lang } = useLang();
  const regularTabs: { id: NavTab; label: string }[] = [
    { id: "home", label: t("nav.home") },
    { id: "analytics", label: t("nav.analytics") },
    { id: "news", label: t("nav.news") },
  ];

  // Tap = orientation, Hold (≥380ms) = voice query
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didHoldRef = useRef(false);
  const pointerDownRef = useRef(false); // guards against spurious onPointerLeave after release

  const handleVoiceDown = () => {
    pointerDownRef.current = true;
    didHoldRef.current = false;
    holdTimerRef.current = setTimeout(() => {
      didHoldRef.current = true;
      pointerDownRef.current = false;
      onVoiceHold();
    }, 380);
  };
  const handleVoiceUp = () => {
    if (!pointerDownRef.current) return; // already released — ignore spurious leave events
    pointerDownRef.current = false;
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (!didHoldRef.current) onVoiceTap();
  };

  return (
    <nav
      className="flex-shrink-0 flex items-center justify-around px-2 relative z-50 ltr-only"
      style={{
        height: "clamp(64px, 8.5vh, 76px)",
        background: "#F4FAF7",
        borderTop: "1px solid #D5E2DD",
        paddingTop: 4,
        paddingBottom: "max(8px, env(safe-area-inset-bottom, 8px))",
        direction: "ltr", // constant button placements across both EN and UR
      }}
    >
      {regularTabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onNav(t.id)}
            className="tap-target flex flex-col items-center justify-center gap-0.5 flex-1 relative py-1"
            style={{ color: isActive ? "#087F63" : "#52635F" }}
          >
            {NAV_ICONS[t.id]?.(isActive)}
            <span
              style={{
                fontSize: lang === "ur" ? 16 : 12,
                fontWeight: isActive ? 800 : 700,
                color: isActive ? "#087F63" : "#52635F",
                fontFamily:
                  lang === "ur"
                    ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                    : "inherit",
                lineHeight: lang === "ur" ? 1.2 : 1.1,
              }}
            >
              {t.label}
            </span>
            {isActive && t.id === "home" && (
              <span
                style={{
                  position: "absolute",
                  bottom: -1,
                  width: 22,
                  height: 3,
                  borderRadius: 2,
                  background: "#087F63",
                }}
              />
            )}
          </button>
        );
      })}

      {/* Voice button — rightmost, tap=orientation, hold=listen */}
      <button
        onPointerDown={handleVoiceDown}
        onPointerUp={handleVoiceUp}
        onPointerLeave={handleVoiceUp}
        className="tap-target flex flex-col items-center gap-0.5 flex-1 select-none py-1"
        style={{ touchAction: "none" }}
      >
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            width: lang === "ur" ? 38 : 36,
            height: lang === "ur" ? 38 : 36,
            background: voiceActive
              ? "linear-gradient(135deg,#C94A43,#D95A51)"
              : "linear-gradient(135deg,#087F63,#2FAE68)",
            boxShadow: voiceActive
              ? "0 0 0 5px rgba(220,38,38,0.18)"
              : "0 3px 12px rgba(15,138,95,0.35)",
            transition: "all 0.2s ease",
          }}
        >
          <MicSVG size={18} color="#fff" />
        </span>
        <span
          style={{
            fontSize: lang === "ur" ? 16 : 10,
            fontWeight: 800,
            color: voiceActive ? "#C94A43" : "#52635F",
            fontFamily:
              lang === "ur"
                ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                : "inherit",
            lineHeight: lang === "ur" ? 1.2 : 1,
          }}
        >
          {t("nav.voice")}
        </span>
      </button>
    </nav>
  );
}

//  ROOT APP

//  LIVE MARKET

type LMproductRow = {
  name: string;
  change: number;
  lTrade: string;
  dir: "up" | "down" | "flat";
  high: number;
  low: number;
  volume: number;
  oInt: number;
};

type LMForexRow = {
  name: string;
  change: number;
  lTrade: number;
  dir: "up" | "down" | "flat";
  high: number;
  low: number;
  ask: number;
  bid: number;
};

const LM_product_DATA: LMproductRow[] = [
  {
    name: "CT 2610",
    change: +0.37,
    lTrade: "83.09B",
    dir: "flat",
    high: 82.95,
    low: 82.53,
    volume: 9,
    oInt: 161,
  },
  {
    name: "CT 2612",
    change: +0.17,
    lTrade: "84.56A",
    dir: "down",
    high: 84.6,
    low: 84.0,
    volume: 22372,
    oInt: 199813,
  },
  {
    name: "CT 2703",
    change: +0.22,
    lTrade: "86.46",
    dir: "up",
    high: 86.5,
    low: 85.97,
    volume: 9779,
    oInt: 75046,
  },
  {
    name: "CT 2705",
    change: +0.18,
    lTrade: "87.55",
    dir: "up",
    high: 87.59,
    low: 87.1,
    volume: 3586,
    oInt: 29123,
  },
  {
    name: "CT 2707",
    change: +0.15,
    lTrade: "86.89",
    dir: "up",
    high: 86.94,
    low: 86.57,
    volume: 2559,
    oInt: 16259,
  },
  {
    name: "KPO 2608",
    change: -62,
    lTrade: "4500",
    dir: "down",
    high: 4530,
    low: 4500,
    volume: 77,
    oInt: 1607,
  },
  {
    name: "KPO 2609",
    change: -57,
    lTrade: "4591",
    dir: "up",
    high: 4632,
    low: 4588,
    volume: 4305,
    oInt: 27742,
  },
  {
    name: "KPO 2610",
    change: -53,
    lTrade: "4695",
    dir: "down",
    high: 4734,
    low: 4691,
    volume: 18243,
    oInt: 91172,
  },
  {
    name: "KPO 2611",
    change: -45,
    lTrade: "4775A",
    dir: "up",
    high: 4807,
    low: 4768,
    volume: 12844,
    oInt: 60510,
  },
  {
    name: "WHITE SUGAR 2610",
    change: 0,
    lTrade: "511.90",
    dir: "flat",
    high: 512.0,
    low: 504.0,
    volume: 0,
    oInt: 78924,
  },
  {
    name: "WHITE SUGAR 2612",
    change: 0,
    lTrade: "509.90",
    dir: "flat",
    high: 511.0,
    low: 504.3,
    volume: 0,
    oInt: 48592,
  },
  {
    name: "WHITE SUGAR 2703",
    change: 0,
    lTrade: "510.70",
    dir: "flat",
    high: 513.0,
    low: 507.0,
    volume: 0,
    oInt: 29826,
  },
  {
    name: "SE 2607",
    change: +0.05,
    lTrade: "14.34",
    dir: "flat",
    high: 14.34,
    low: 14.34,
    volume: 1809,
    oInt: 15678,
  },
  {
    name: "SE 2610",
    change: +0.26,
    lTrade: "16.73",
    dir: "flat",
    high: 16.75,
    low: 16.33,
    volume: 150591,
    oInt: 507630,
  },
  {
    name: "SE 2703",
    change: +0.27,
    lTrade: "17.71B",
    dir: "flat",
    high: 17.73,
    low: 17.31,
    volume: 95182,
    oInt: 317463,
  },
  {
    name: "WHEAT 2607",
    change: +11.6,
    lTrade: "687.00",
    dir: "down",
    high: 687.2,
    low: 675.0,
    volume: 301,
    oInt: 24556,
  },
  {
    name: "WHEAT 2609",
    change: +13.6,
    lTrade: "644.00",
    dir: "down",
    high: 644.4,
    low: 631.4,
    volume: 8993,
    oInt: 138216,
  },
  {
    name: "WHEAT 2612",
    change: +13.2,
    lTrade: "661.40",
    dir: "down",
    high: 662.0,
    low: 649.0,
    volume: 7874,
    oInt: 202702,
  },
  {
    name: "WHEAT 2703",
    change: +13,
    lTrade: "678.40",
    dir: "down",
    high: 679.0,
    low: 666.0,
    volume: 2777,
    oInt: 78735,
  },
  {
    name: "CORN 2607",
    change: +2.75,
    lTrade: "493.50",
    dir: "up",
    high: 493.5,
    low: 490.25,
    volume: 1210,
    oInt: 83621,
  },
  {
    name: "CORN 2609",
    change: +3,
    lTrade: "439.75",
    dir: "up",
    high: 439.75,
    low: 436.0,
    volume: 3018,
    oInt: 354650,
  },
  {
    name: "CORN 2612",
    change: +2.75,
    lTrade: "463.25",
    dir: "up",
    high: 463.5,
    low: 459.5,
    volume: 9782,
    oInt: 827726,
  },
  {
    name: "CORN 2703",
    change: +3.25,
    lTrade: "479.25",
    dir: "up",
    high: 479.25,
    low: 475.5,
    volume: 2023,
    oInt: 219084,
  },
  {
    name: "SOYBEANS 2607",
    change: +6.75,
    lTrade: "1214.0",
    dir: "down",
    high: 1214.75,
    low: 1206.25,
    volume: 865,
    oInt: 46227,
  },
  {
    name: "SOYBEANS 2609",
    change: +6.75,
    lTrade: "1158.2",
    dir: "up",
    high: 1159.25,
    low: 1150.25,
    volume: 1313,
    oInt: 53729,
  },
  {
    name: "SOY OIL 2607",
    change: +0.24,
    lTrade: "67.89A",
    dir: "up",
    high: 67.89,
    low: 67.62,
    volume: 91,
    oInt: 25354,
  },
  {
    name: "SOY OIL 2609",
    change: +0.39,
    lTrade: "68.96B",
    dir: "up",
    high: 69.1,
    low: 68.6,
    volume: 865,
    oInt: 106241,
  },
  {
    name: "SOY MEAL 2607",
    change: +1.4,
    lTrade: "325.00",
    dir: "down",
    high: 325.0,
    low: 323.6,
    volume: 119,
    oInt: 17531,
  },
  {
    name: "SOY MEAL 2609",
    change: +2.1,
    lTrade: "307.10",
    dir: "down",
    high: 307.1,
    low: 305.3,
    volume: 1067,
    oInt: 74529,
  },
];

const LM_FOREX_DATA: LMForexRow[] = [
  {
    name: "PAKISTANI RUPEE",
    change: +0.0,
    lTrade: 277.75,
    dir: "flat",
    high: 277.75,
    low: 277.75,
    ask: 282.0,
    bid: 277.75,
  },
  {
    name: "JAPAN YEN",
    change: +0.11,
    lTrade: 159.36,
    dir: "down",
    high: 159.46,
    low: 159.19,
    ask: 159.38,
    bid: 159.36,
  },
  {
    name: "E.U.R.",
    change: -0.0005,
    lTrade: 1.1535,
    dir: "down",
    high: 1.1545,
    low: 1.1532,
    ask: 1.1535,
    bid: 1.1535,
  },
  {
    name: "GB POUND",
    change: -0.0003,
    lTrade: 1.3502,
    dir: "down",
    high: 1.3511,
    low: 1.3497,
    ask: 1.3509,
    bid: 1.3502,
  },
  {
    name: "CNY SPOT",
    change: +0.0007,
    lTrade: 6.7463,
    dir: "up",
    high: 6.747,
    low: 6.7454,
    ask: 6.7464,
    bid: 6.7463,
  },
  {
    name: "L.CRUDE OIL 1ST",
    change: +0.73,
    lTrade: 83.93,
    dir: "down",
    high: 84.35,
    low: 83.35,
    ask: 83.93,
    bid: 83.92,
  },
  {
    name: "LOCO GOLD",
    change: +19.45,
    lTrade: 4389.2,
    dir: "down",
    high: 4415.25,
    low: 4362.05,
    ask: 4389.85,
    bid: 4389.25,
  },
  {
    name: "LOCOSILVER",
    change: +0.692,
    lTrade: 65.353,
    dir: "up",
    high: 65.75,
    low: 64.659,
    ask: 65.398,
    bid: 65.353,
  },
];

function LiveMarketScreen({ onBack }: { onBack: () => void }) {
  const { lang } = useLang();
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString("en-GB").replace(/\//g, "/");
  const dayStr = now.toLocaleDateString("en-US", { weekday: "long" });
  const timestamp = `${timeStr} · ${dateStr} · ${dayStr}`;

  const fmtNum = (n: number, decimals = 2) =>
    n === 0
      ? "—"
      : n.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });

  const fmtChange = (n: number) => {
    const s = n > 0 ? `+${n}` : `${n}`;
    return s;
  };

  const DirArrow = ({ dir }: { dir: "up" | "down" | "flat" }) => {
    if (dir === "up")
      return <span style={{ color: "#159447", fontSize: 11 }}></span>;
    if (dir === "down")
      return <span style={{ color: "#C94A43", fontSize: 11 }}></span>;
    return null;
  };

  const changeColor = (n: number) =>
    n > 0 ? "#159447" : n < 0 ? "#C94A43" : "#52635F";

  const TH_STYLE: React.CSSProperties = {
    padding: "8px 10px",
    fontSize: 11,
    fontWeight: 700,
    color: "#fff",
    textAlign: "right",
    whiteSpace: "nowrap",
    background: "#075E4F",
  };
  const TD_STYLE: React.CSSProperties = {
    padding: "7px 10px",
    fontSize: 11,
    textAlign: "right",
    whiteSpace: "nowrap",
    color: "#183B34",
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#EFF8F3" }}>
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center gap-3 px-4 py-3"
        style={{
          background: "#075E4F",
          paddingTop: "max(52px, env(safe-area-inset-top, 52px))",
        }}
      >
        <button
          onClick={onBack}
          className="tap-target w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
        >
          <span style={{ fontSize: 20 }}>{lang === "ur" ? "→" : "←"}</span>
        </button>
        <div className="flex-1 min-w-0">
          <h1
            className="font-extrabold text-base text-white leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {lang === "ur"
              ? "لائیو مارکیٹ انٹرنیشنل ریٹ"
              : "Live Market International Rate"}
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            {timestamp}
          </p>
        </div>
        {/* Live badge */}
        <span
          className="flex-shrink-0 rounded-full font-bold text-[10px] px-2.5 py-1 flex items-center gap-1"
          style={{
            background: "#C94A43",
            color: "#fff",
            letterSpacing: "0.04em",
          }}
        >
          <span
            className="inline-block rounded-full"
            style={{
              width: 6,
              height: 6,
              background: "#F4FAF7",
              opacity: 0.9,
              animation: "pulse 1.5s infinite",
            }}
          />
          LIVE
        </span>
      </header>

      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 16 }}>
        {/*  Section 1: product Futures  */}
        <div className="px-3 pt-4 pb-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-extrabold text-sm"
              style={{ color: "#075E4F", fontFamily: "'Poppins', sans-serif" }}
            >
              product Futures
            </span>
            <span
              className="text-[10px] font-semibold rounded-full px-2 py-0.5"
              style={{ background: "#DDF3E7", color: "#147A3F" }}
            >
              {LM_product_DATA.length} instruments
            </span>
          </div>
        </div>

        <div className="px-3">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid #C7E8D8",
              boxShadow: "0 2px 8px rgba(10,94,67,0.08)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  minWidth: 520,
                }}
              >
                <thead>
                  <tr>
                    {/* Sticky Name header */}
                    <th
                      style={{
                        ...TH_STYLE,
                        textAlign: "left",
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                        minWidth: 130,
                        background: "#075E4F",
                      }}
                    >
                      Name
                    </th>
                    <th style={{ ...TH_STYLE, color: "#8AD7B1" }}>+/- $</th>
                    <th style={TH_STYLE}>L.Trade</th>
                    <th style={TH_STYLE}>High</th>
                    <th style={TH_STYLE}>Low</th>
                    <th style={TH_STYLE}>Volume</th>
                    <th style={TH_STYLE}>O.Int</th>
                  </tr>
                </thead>
                <tbody>
                  {LM_product_DATA.map((row, i) => (
                    <tr
                      key={row.name}
                      style={{ background: i % 2 === 0 ? "#fff" : "#EFF8F3" }}
                    >
                      <td
                        style={{
                          ...TD_STYLE,
                          textAlign: "left",
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          fontWeight: 700,
                          color: "#075E4F",
                          background: i % 2 === 0 ? "#fff" : "#EFF8F3",
                          borderRight: "1px solid #C7E8D8",
                        }}
                      >
                        {row.name}
                      </td>
                      <td
                        style={{
                          ...TD_STYLE,
                          fontWeight: 700,
                          color: changeColor(row.change),
                        }}
                      >
                        {fmtChange(row.change)}
                      </td>
                      <td style={{ ...TD_STYLE, fontWeight: 600 }}>
                        <span style={{ marginRight: 3 }}>{row.lTrade}</span>
                        <DirArrow dir={row.dir} />
                      </td>
                      <td style={TD_STYLE}>{row.high}</td>
                      <td style={TD_STYLE}>{row.low}</td>
                      <td style={{ ...TD_STYLE, color: "#52635F" }}>
                        {row.volume === 0 ? "—" : row.volume.toLocaleString()}
                      </td>
                      <td style={{ ...TD_STYLE, color: "#52635F" }}>
                        {row.oInt === 0 ? "—" : row.oInt.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/*  Section 2: Global / Forex  */}
        <div className="px-3 pt-5 pb-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-extrabold text-sm"
              style={{ color: "#075E4F", fontFamily: "'Poppins', sans-serif" }}
            >
              Global / International Markets
            </span>
            <span
              className="text-[10px] font-semibold rounded-full px-2 py-0.5"
              style={{ background: "#DDF3E7", color: "#147A3F" }}
            >
              {LM_FOREX_DATA.length} instruments
            </span>
          </div>
        </div>

        <div className="px-3">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid #C7E8D8",
              boxShadow: "0 2px 8px rgba(10,94,67,0.08)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  minWidth: 520,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        ...TH_STYLE,
                        textAlign: "left",
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                        minWidth: 150,
                        background: "#075E4F",
                      }}
                    >
                      Name
                    </th>
                    <th style={{ ...TH_STYLE, color: "#8AD7B1" }}>+/- $</th>
                    <th style={TH_STYLE}>L.Trade</th>
                    <th style={TH_STYLE}>High</th>
                    <th style={TH_STYLE}>Low</th>
                    <th style={TH_STYLE}>Ask</th>
                    <th style={TH_STYLE}>Bid</th>
                  </tr>
                </thead>
                <tbody>
                  {LM_FOREX_DATA.map((row, i) => (
                    <tr
                      key={row.name}
                      style={{ background: i % 2 === 0 ? "#fff" : "#EFF8F3" }}
                    >
                      <td
                        style={{
                          ...TD_STYLE,
                          textAlign: "left",
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          fontWeight: 700,
                          color: "#075E4F",
                          background: i % 2 === 0 ? "#fff" : "#EFF8F3",
                          borderRight: "1px solid #C7E8D8",
                        }}
                      >
                        {row.name}
                      </td>
                      <td
                        style={{
                          ...TD_STYLE,
                          fontWeight: 700,
                          color: changeColor(row.change),
                        }}
                      >
                        {fmtChange(row.change)}
                      </td>
                      <td style={{ ...TD_STYLE, fontWeight: 600 }}>
                        <span style={{ marginRight: 3 }}>{row.lTrade}</span>
                        <DirArrow dir={row.dir} />
                      </td>
                      <td style={TD_STYLE}>{fmtNum(row.high, 3)}</td>
                      <td style={TD_STYLE}>{fmtNum(row.low, 3)}</td>
                      <td
                        style={{
                          ...TD_STYLE,
                          color: "#159447",
                          fontWeight: 600,
                        }}
                      >
                        {fmtNum(row.ask, 3)}
                        {row.dir === "up" && (
                          <span
                            style={{
                              color: "#159447",
                              marginLeft: 2,
                              fontSize: 10,
                            }}
                          ></span>
                        )}
                      </td>
                      <td
                        style={{
                          ...TD_STYLE,
                          color: row.change < 0 ? "#C94A43" : "#183B34",
                          fontWeight: 600,
                        }}
                      >
                        {fmtNum(row.bid, 3)}
                        {row.dir === "down" && (
                          <span
                            style={{
                              color: "#C94A43",
                              marginLeft: 2,
                              fontSize: 10,
                            }}
                          ></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p
          className="text-center text-[10px] px-6 mt-4"
          style={{ color: "#80918B" }}
        >
          Data reflects the latest update received from the external market
          feed. Last updated: {timestamp}
        </p>
      </div>
    </div>
  );
}

// CustomerFaceProps alias
export type CustomerFaceProps = AppProps;



// ─── BILLING / SUBSCRIPTION SCREEN (MATCHING ONBOARDING) ─────────────────────
const DURATION_MONTHS_BILLING = [1, 3, 6, 12];
const DURATION_LABELS_BILLING = ["1 Month", "3 Months", "6 Months", "1 Year"];
const DISCOUNTS_BILLING = [0, 0.1, 0.15, 0.25];

const product_BASE_PRICES: Record<string, number> = {
  wheat: 3000,
  maize: 3000,
  sesame: 3000,
  millet: 3000,
  cotton: 3000,
  paddy: 3000,
  rice: 3000,
  edibleoil: 5000,
  "edible oil": 5000,
  fertilizer: 5000,
  livestock: 5000,
  livemarket: 3000,
  "live market": 3000,
  dates: 3000,
  mustard: 3000,
  spices: 3000,
  pulses: 3000,
  kiryana: 5000,
  sugar: 3000,
  sugarcane: 3000,
  fruits: 5000,
  fruit: 5000,
  vegetables: 5000,
  vegetable: 5000,
  dryfruit: 3000,
  "dry fruit": 3000,
  herbs: 3000,
  herbals: 3000,
};

function getproductBasePrice(product: string): number {
  const k = (product || "").toLowerCase().trim();
  if (product_BASE_PRICES[k] !== undefined) return product_BASE_PRICES[k];
  for (const [key, price] of Object.entries(product_BASE_PRICES)) {
    if (k.includes(key) || key.includes(k)) return price;
  }
  return 3000;
}

function BillingScreen({
  product,
  vertical,
  onBack,
  push,
}: {
  product: string;
  vertical?: string;
  onBack: () => void;
  push: (s: Screen) => void;
}) {
  const { lang, tc, tm } = useLang();
  const [step, setStep] = useState<"plan" | "pay">("plan");
  const [dur, setDur] = useState(0); // 0: 1 Month, 1: 3 Months, 2: 6 Months, 3: 1 Year
  const [customMode, setCustomMode] = useState(false);
  const [customMonths, setCustomMonths] = useState<number>(3);

  // Payment method state
  const [paymentType, setPaymentType] = useState<"wallet" | "card" | "direct">(
    "wallet",
  );
  const [walletProvider, setWalletProvider] = useState<
    "jazzcash" | "easypaisa" | "sadapay" | "nayapay" | "upaisa"
  >("jazzcash");
  const [walletNumber, setWalletNumber] = useState("0300 1234567");
  const [walletCnic, setWalletCnic] = useState("");
  const [walletPromptSent, setWalletPromptSent] = useState(false);
  const [walletPromptSending, setWalletPromptSending] = useState(false);

  const [directMethod, setDirectMethod] = useState<
    "jazzcash" | "easypaisa" | "bank"
  >("jazzcash");
  const [hasReceipt, setHasReceipt] = useState(false);
  const [subscribedModal, setSubscribedModal] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("Muhammad Arif");

  const v = vertical || getVerticalForProduct(product) || "Grains";
  const iconSrc = getproductIconSrc(product, v);
  const basePrice = getproductBasePrice(product);

  const { months, discount, regularTotal, discountAmt, finalTotal } = customMode
    ? (() => {
        const m = customMonths || 1;
        const d = getMonthlyDiscount(m);
        const reg = basePrice * m;
        const da = Math.round(reg * d);
        return {
          months: m,
          discount: d,
          regularTotal: reg,
          discountAmt: da,
          finalTotal: reg - da,
        };
      })()
    : (() => {
        const m = DURATION_MONTHS_BILLING[dur] || 1;
        const d = getMonthlyDiscount(m);
        const reg = basePrice * m;
        const da = Math.round(reg * d);
        return {
          months: m,
          discount: d,
          regularTotal: reg,
          discountAmt: da,
          finalTotal: reg - da,
        };
      })();

  const walletProviders = [
    {
      id: "jazzcash",
      label: "JazzCash",
      color: "#E83D2B",
      iconSrc: "/src/icons/jazz.png",
      sub: "Instant mobile prompt",
    },
    {
      id: "easypaisa",
      label: "EasyPaisa",
      color: "#4CAF50",
      iconSrc: "/src/icons/easypaisa.png",
      sub: "Instant approval OTP",
    },
    {
      id: "sadapay",
      label: "SadaPay",
      color: "#00A389",
      iconSrc: "/src/icons/sadapay.png",
      sub: "In-app transfer request",
    },
    {
      id: "nayapay",
      label: "NayaPay",
      color: "#FF6F00",
      iconSrc: "/src/icons/nayapay.png",
      sub: "Fast wallet checkout",
    },
    {
      id: "upaisa",
      label: "UPaisa",
      color: "#F57F17",
      iconSrc: "/src/icons/upaisa.png",
      sub: "USSD / Mobile prompt",
    },
  ] as const;

  const directMethods = [
    {
      id: "jazzcash",
      label: "JazzCash Manual",
      color: "#E83D2B",
      iconSrc: "/src/icons/jazz.png",
      sub: "Send via JazzCash mobile wallet",
    },
    {
      id: "easypaisa",
      label: "EasyPaisa Manual",
      color: "#4CAF50",
      iconSrc: "/src/icons/easypaisa.png",
      sub: "Send via EasyPaisa mobile wallet",
    },
    {
      id: "bank",
      label: "Bank Transfer",
      color: "#1565C0",
      iconSrc: "/src/icons/banktransfer.png",
      sub: "Direct bank / IBFT transfer",
    },
  ] as const;

  const directDetails: Record<string, { rows: [string, string][] }> = {
    jazzcash: {
      rows: [
        ["Account", "03058107777"],
        ["Account Name", "Muhammad Ghasharib Ali Shaukat"],
        ["Amount", `PKR ${finalTotal.toLocaleString()}`],
      ],
    },
    easypaisa: {
      rows: [
        ["Account", "03048107777"],
        ["Account Name", "Abdul Raafey Shaukat"],
        ["Amount", `PKR ${finalTotal.toLocaleString()}`],
      ],
    },
    bank: {
      rows: [
        ["Bank", "HBL"],
        ["Account Title", "Zarai Mandi Private Limited"],
        ["Account No.", "5000-7909-9814-03"],
        ["IBAN", "PK04HABB05000079089814030"],
        ["Amount", `PKR ${finalTotal.toLocaleString()}`],
      ],
    },
  };

  function formatCardNumber(v: string) {
    return v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }
  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2
      ? digits.slice(0, 2) + "/" + digits.slice(2)
      : digits;
  }
  function formatPhoneInput(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    return digits.slice(0, 4) + " " + digits.slice(4);
  }

  const handleActivate = () => {
    SUBSCRIBED_PRODUCTS.add(product);
    const mapped = PRODUCT_ID_TO_NAME[product.toLowerCase()] || product;
    SUBSCRIBED_PRODUCTS.add(mapped);
    setSubscribedModal(true);
  };

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{
        background: "#F8FAF8",
        overflowY: "auto",
        fontFamily:
          lang === "ur"
            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', sans-serif"
            : "'Inter', sans-serif",
      }}
    >
      {/* Top Header */}
      <header
        className="px-4 pb-3 flex-shrink-0 flex items-center gap-3 sticky top-0 z-20"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #E5E7EB",
          paddingTop: "max(12px, env(safe-area-inset-top, 12px))",
        }}
      >
        <button
          onClick={step === "pay" ? () => setStep("plan") : onBack}
          className="tap-target w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#EAF8F2", border: "1px solid #B8DCCF" }}
        >
          <span style={{ fontSize: 18, color: "#0A5E43", fontWeight: "bold" }}>
            {lang === "ur" ? "→" : "←"}
          </span>
        </button>
        <div className="flex-1 min-w-0">
          <h1
            className="font-extrabold text-base truncate"
            style={{ color: "#0A5E43" }}
          >
            {lang === "ur"
              ? tc(product) + " سبسکرپشن"
              : product + " Subscription"}
          </h1>
          <p className="text-[11px] truncate" style={{ color: "#6B7280" }}>
            {lang === "ur"
              ? "تمام منڈی ریٹس اور تجزیات تک رسائی حاصل کریں"
              : "Unlock Live Mandi Rates & Analytics"}
          </p>
        </div>
      </header>

      {/* Main Card Content */}
      <div className="p-4 flex-1 flex flex-col items-center justify-start max-w-md mx-auto w-full">
        {step === "plan" ? (
          <div
            className="w-full bg-white rounded-3xl p-5 shadow-sm border border-[#E5E7EB]"
            style={{ animation: "screenEnter 0.25s ease-out" }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#0F8A5F",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              {lang === "ur" ? "پلان منتخب کریں" : "Step 1 of 2"}
            </div>
            <div
              style={{
                fontSize: lang === "ur" ? 22 : 19,
                fontWeight: 800,
                color: "#0A5E43",
                marginBottom: 4,
              }}
            >
              {lang === "ur"
                ? "زرعی منڈی سبسکرپشن پلان"
                : "Choose your ZM plan"}
            </div>
            {/* Standard Duration Tabs */}
            <div
              style={{
                display: "flex",
                background: "rgba(15,138,95,0.07)",
                borderRadius: 12,
                padding: 4,
                gap: 3,
                marginBottom: 10,
              }}
            >
              {[
                { label: "1 Mo", durIdx: 0, badge: "Standard" },
                { label: "3 Mos", durIdx: 1, badge: "10% off" },
                { label: "6 Mos", durIdx: 2, badge: "15% off" },
                { label: "12 Mos", durIdx: 3, badge: "25% off" },
              ].map((item) => {
                const active = !customMode && dur === item.durIdx;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`dur-tab${active ? " active" : ""}`}
                    onClick={() => {
                      setCustomMode(false);
                      setDur(item.durIdx);
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 2px",
                      borderRadius: 10,
                      border: "none",
                      background: active ? "#087F63" : "transparent",
                      color: active ? "#fff" : "#183B34",
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <span>{item.label}</span>
                    <span
                      style={{
                        fontSize: 8.5,
                        opacity: active ? 0.95 : 0.65,
                        fontWeight: 800,
                      }}
                    >
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Customize Mode Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setCustomMode(!customMode);
                if (!customMode) setCustomMonths(3);
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 12,
                border: customMode
                  ? "2px solid #087F63"
                  : "1.5px dashed #D5E2DD",
                background: customMode ? "#E4F2EC" : "#fff",
                color: customMode ? "#087F63" : "#52635F",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span>
                  {lang === "ur"
                    ? "اپنی مرضی کے مہینے منتخب کریں (1 تا 12)"
                    : "Customize Specific Months"}
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: customMode ? "#087F63" : "#80918B",
                }}
              >
                {customMode ? "Hide Picker ▴" : "Show Picker ▾"}
              </span>
            </button>

            {/* Custom 1-12 Month Picker */}
            {customMode && (
              <div
                style={{
                  border: "1.5px solid #087F63",
                  borderRadius: 16,
                  padding: "14px",
                  marginBottom: 14,
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(8,127,99,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#183B34",
                    }}
                  >
                    {customMonths} Month{customMonths > 1 ? "s" : ""} Plan
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#16A34A",
                      background: "rgba(22,163,74,0.12)",
                      borderRadius: 20,
                      padding: "2px 9px",
                    }}
                  >
                    {getMonthlyDiscount(customMonths) > 0
                      ? `${Math.round(getMonthlyDiscount(customMonths) * 100)}% Discount`
                      : "Regular Rate"}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 6,
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                    const sel = customMonths === m;
                    const disc = getMonthlyDiscount(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setCustomMonths(m)}
                        style={{
                          padding: "6px 2px",
                          borderRadius: 8,
                          border: sel
                            ? "2px solid #087F63"
                            : "1.5px solid #D5E2DD",
                          background: sel ? "#087F63" : "#F4FAF7",
                          color: sel ? "#fff" : "#183B34",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <span style={{ fontSize: 11.5, fontWeight: 800 }}>
                          {m} mo
                        </span>
                        <span
                          style={{
                            fontSize: 8.5,
                            fontWeight: 700,
                            color: sel
                              ? "#D1FAE5"
                              : disc > 0
                                ? "#16A34A"
                                : "#80918B",
                          }}
                        >
                          {disc > 0 ? `-${disc * 100}%` : "0%"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pricing Breakdown Card */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 18,
                border: "1.5px solid #E5E7EB",
                marginBottom: 16,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  padding: "10px 16px 8px",
                  borderBottom: "1px solid #E5E7EB",
                  background: "#F8FAF8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#0F8A5F",
                    fontWeight: 800,
                  }}
                >
                  {lang === "ur" ? "پروڈکٹ کی تفصیل" : "Product Pricing"}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-extrabold"
                  style={{ background: "#EAF8F2", color: "#0F8A5F" }}
                >
                  PRO ACCESS
                </span>
              </div>

              {/* product Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  fontSize: 13,
                  color: "#1F2937",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    fontWeight: 700,
                  }}
                >
                  <img
                    src={iconSrc}
                    alt=""
                    style={{ width: 28, height: 28, objectFit: "contain" }}
                  />
                  {tc(product)}
                </span>
                <span style={{ fontWeight: 800, color: "#0A5E43" }}>
                  PKR {basePrice.toLocaleString()}/mo
                </span>
              </div>

              {/* Calculations Box */}
              <div
                style={{
                  borderTop: "1.5px solid rgba(15,138,95,0.1)",
                  background: "#EAF8F2",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 16px",
                    fontSize: 12,
                    color: "#52635F",
                  }}
                >
                  <span>
                    {lang === "ur"
                      ? "کل رقم (" + months + " ماہ)"
                      : "Total/mo × " +
                        months +
                        " month" +
                        (months > 1 ? "s" : "")}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    PKR {regularTotal.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 16px",
                      fontSize: 12,
                      color: "#16A34A",
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>
                      {lang === "ur"
                        ? "ڈسکاؤنٹ (" + discount * 100 + "% بچت)"
                        : "Discount (" + discount * 100 + "% off)"}
                    </span>
                    <span style={{ fontWeight: 800 }}>
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
                    borderTop: "1px solid rgba(15,138,95,0.15)",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      color: "#0A5E43",
                    }}
                  >
                    {lang === "ur" ? "آپ کی قیمت" : "Your Price"}
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#0A5E43",
                      }}
                    >
                      PKR {finalTotal.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#52635F",
                        fontWeight: 600,
                      }}
                    >
                      PKR {Math.round(finalTotal / months).toLocaleString()}/mo
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setStep("pay")}
              className="tap-target w-full py-3.5 rounded-2xl font-extrabold text-sm mb-2 flex items-center justify-center gap-2"
              style={{
                background: "#0A5E43",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(10,94,67,0.3)",
              }}
            >
              {lang === "ur"
                ? "ادائیگی کی طرف جائیں — PKR " + finalTotal.toLocaleString()
                : "Proceed to Payment — PKR " + finalTotal.toLocaleString()}
            </button>
          </div>
        ) : (
          /* Step 2: Payment Confirmation (Mobile Wallet, Card, Direct Transfer) */
          <div
            className="w-full bg-white rounded-3xl p-5 shadow-sm border border-[#E5E7EB]"
            style={{ animation: "screenEnter 0.25s ease-out" }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#0F8A5F",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              {lang === "ur" ? "ادائیگی کی تصدیق" : "Step 2 of 2"}
            </div>
            <div
              style={{
                fontSize: lang === "ur" ? 22 : 19,
                fontWeight: 800,
                color: "#0A5E43",
                marginBottom: 4,
              }}
            >
              {lang === "ur" ? "ادائیگی مکمل کریں" : "Complete your payment"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginBottom: 16,
              }}
            >
              Pay{" "}
              <strong style={{ color: "#0A5E43" }}>
                PKR {finalTotal.toLocaleString()}
              </strong>{" "}
              for the{" "}
              <strong style={{ color: "#0A5E43" }}>
                {months} Month{months > 1 ? "s" : ""}
              </strong>{" "}
              plan.
            </div>

            {/* 3 Payment Type Selector Buttons */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                marginBottom: 14,
              }}
            >
              {[
                {
                  id: "wallet",
                  iconSrc: "/src/icons/mobilewallet.png",
                  label: "Mobile Wallet",
                  sub: "JazzCash, EasyPaisa",
                },
                {
                  id: "card",
                  iconSrc: "/src/icons/cardpayment.png",
                  label: "Card Payment",
                  sub: "Debit or credit",
                },
                {
                  id: "direct",
                  iconSrc: "/src/icons/directtransfer.png",
                  label: "Direct Transfer",
                  sub: "IBFT / Manual",
                },
              ].map((opt) => {
                const active = paymentType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentType(opt.id as any)}
                    style={{
                      padding: "10px 6px",
                      borderRadius: 14,
                      border: active
                        ? "2px solid #087F63"
                        : "1.5px solid #D5E2DD",
                      background: active ? "#E4F2EC" : "#fff",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 24,
                        marginBottom: 4,
                      }}
                    >
                      <img
                        src={opt.iconSrc}
                        alt=""
                        style={{
                          width: 22,
                          height: 22,
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: active ? "#087F63" : "#183B34",
                        lineHeight: 1.2,
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{
                        fontSize: 8.5,
                        color: "#52635F",
                        marginTop: 2,
                      }}
                    >
                      {opt.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Option 1: Mobile Wallet */}
            {paymentType === "wallet" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#52635F",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Select Wallet Provider
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 6,
                      marginBottom: 8,
                    }}
                  >
                    {walletProviders.map((wp) => {
                      const sel = walletProvider === wp.id;
                      return (
                        <button
                          key={wp.id}
                          type="button"
                          onClick={() => {
                            setWalletProvider(wp.id as any);
                            setWalletPromptSent(false);
                          }}
                          style={{
                            padding: "8px 4px",
                            borderRadius: 10,
                            border: sel
                              ? `2px solid ${wp.color}`
                              : "1.5px solid #D5E2DD",
                            background: sel ? `${wp.color}15` : "#FFFFFF",
                            cursor: "pointer",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <img
                            src={wp.iconSrc}
                            alt=""
                            style={{
                              width: 20,
                              height: 20,
                              objectFit: "contain",
                            }}
                          />
                          <div
                            style={{
                              fontSize: 10.5,
                              fontWeight: 800,
                              color: sel ? wp.color : "#183B34",
                            }}
                          >
                            {wp.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#52635F",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Mobile Wallet Number *
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="0300 1234567"
                    value={walletNumber}
                    onChange={(e) =>
                      setWalletNumber(formatPhoneInput(e.target.value))
                    }
                    style={{
                      width: "100%",
                      height: 42,
                      padding: "0 12px",
                      border: "1.5px solid #D5E2DD",
                      borderRadius: 10,
                      fontSize: 13.5,
                      color: "#183B34",
                      background: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#52635F",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Muhammad Arif / 123456"
                    value={walletCnic}
                    onChange={(e) => setWalletCnic(e.target.value)}
                    style={{
                      width: "100%",
                      height: 42,
                      padding: "0 12px",
                      border: "1.5px solid #D5E2DD",
                      borderRadius: 10,
                      fontSize: 13.5,
                      color: "#183B34",
                      background: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                {!walletPromptSent ? (
                  <button
                    type="button"
                    onClick={() => {
                      setWalletPromptSending(true);
                      setTimeout(() => {
                        setWalletPromptSending(false);
                        setWalletPromptSent(true);
                      }, 800);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#087F63",
                      color: "#fff",
                      borderRadius: 10,
                      border: "none",
                      fontWeight: 700,
                      fontSize: 12.5,
                      cursor: "pointer",
                    }}
                  >
                    {walletPromptSending
                      ? "Sending Authorization Request..."
                      : "Send Approval Prompt to Mobile Phone"}
                  </button>
                ) : (
                  <div
                    style={{
                      background: "#E8F5E9",
                      border: "1.5px solid #81C784",
                      borderRadius: 10,
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11.5,
                        color: "#1B5E20",
                        fontWeight: 700,
                      }}
                    >
                      Approval prompt sent to {walletNumber}. Please enter your
                      MPIN in your wallet app to complete.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Option 2: Card Payment */}
            {paymentType === "card" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#52635F",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Card Number
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    style={{
                      width: "100%",
                      height: 44,
                      padding: "0 12px",
                      border: "1.5px solid #D5E2DD",
                      borderRadius: 10,
                      fontSize: 13.5,
                      color: "#183B34",
                      background: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#52635F",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Expiry Date
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      style={{
                        width: "100%",
                        height: 44,
                        padding: "0 12px",
                        border: "1.5px solid #D5E2DD",
                        borderRadius: 10,
                        fontSize: 13.5,
                        color: "#183B34",
                        background: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#52635F",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Security Code
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="CVV"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      style={{
                        width: "100%",
                        height: 44,
                        padding: "0 12px",
                        border: "1.5px solid #D5E2DD",
                        borderRadius: 10,
                        fontSize: 13.5,
                        color: "#183B34",
                        background: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#52635F",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    style={{
                      width: "100%",
                      height: 44,
                      padding: "0 12px",
                      border: "1.5px solid #D5E2DD",
                      borderRadius: 10,
                      fontSize: 13.5,
                      color: "#183B34",
                      background: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 10px",
                    background: "#E4F2EC",
                    borderRadius: 8,
                  }}
                >
                  <span style={{ fontSize: 13 }}>🔒</span>
                  <span style={{ fontSize: 11, color: "#52635F" }}>
                    Your card details are encrypted and never stored.
                  </span>
                </div>
              </div>
            )}

            {/* Option 3: Direct Transfer */}
            {paymentType === "direct" && (
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#52635F",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Choose Method
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  {directMethods.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setDirectMethod(m.id as any)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 12,
                        border:
                          directMethod === m.id
                            ? "2px solid #087F63"
                            : "1.5px solid #D5E2DD",
                        background: directMethod === m.id ? "#E4F2EC" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          background: `${m.color}18`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={m.iconSrc}
                          alt={m.label}
                          style={{
                            width: 26,
                            height: 26,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#183B34",
                          }}
                        >
                          {m.label}
                        </div>
                        <div style={{ fontSize: 11, color: "#52635F" }}>
                          {m.sub}
                        </div>
                      </div>
                      {directMethod === m.id && (
                        <span
                          style={{
                            color: "#087F63",
                            fontWeight: 900,
                            fontSize: 14,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Direct Details Box */}
                <div
                  style={{
                    background: "#fff",
                    border: "1.5px solid #D5E2DD",
                    borderRadius: 12,
                    padding: "12px",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10.5,
                      textTransform: "uppercase",
                      color: "#B9822E",
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    Payment Details
                  </div>
                  {directDetails[directMethod]?.rows.map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        padding: "4px 0",
                        borderBottom: "1px solid #F1F7F4",
                      }}
                    >
                      <span style={{ color: "#52635F" }}>{k}</span>
                      <strong
                        style={{
                          color: "#183B34",
                          fontFamily:
                            k === "IBAN" || k === "Account No."
                              ? "monospace"
                              : "inherit",
                        }}
                      >
                        {v}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Upload Screenshot */}
                <div
                  onClick={() => setHasReceipt(!hasReceipt)}
                  style={{
                    padding: "12px",
                    borderRadius: 12,
                    border: "1.5px dashed #087F63",
                    background: hasReceipt ? "#E4F2EC" : "#fff",
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#087F63",
                  }}
                >
                  <span>{hasReceipt ? "✅" : "📎"}</span>
                  <span>
                    {hasReceipt
                      ? "Screenshot attached (Tap to change)"
                      : "Tap to upload payment screenshot"}
                  </span>
                </div>
              </div>
            )}

            {/* Confirm Payment Button */}
            <button
              onClick={handleActivate}
              className="tap-target w-full py-3.5 rounded-2xl text-white font-extrabold text-sm mt-4 mb-2.5 shadow-lg flex items-center justify-center gap-2"
              style={{
                background: "#0F8A5F",
                boxShadow: "0 4px 14px rgba(15,138,95,0.35)",
              }}
            >
              {lang === "ur"
                ? `ادائیگی کی تصدیق اور ایکٹیویشن (PKR ${finalTotal.toLocaleString()}) ✓`
                : `Confirm Payment & Activate (PKR ${finalTotal.toLocaleString()}) ✓`}
            </button>

            <button
              onClick={() => setStep("plan")}
              className="tap-target w-full py-2.5 text-xs font-bold text-[#6B7280] hover:text-[#0A5E43]"
            >
              {lang === "ur" ? "← پلان تبدیل کریں" : "← Change Plan"}
            </button>
          </div>
        )}
      </div>

      {/* Subscription Success Modal */}
      {subscribedModal && (
        <div
          className="zm-sheet-overlay"
          style={{
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-[#E5E7EB]"
            style={{ animation: "screenEnter 0.25s ease-out" }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#EAF8F2",
                color: "#0F8A5F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 900,
                margin: "0 auto 16px",
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#0A5E43",
                marginBottom: 6,
              }}
            >
              {lang === "ur"
                ? "سبسکرپشن فعال ہو گئی!"
                : "Subscription Activated!"}
            </h2>
            <p style={{ fontSize: 12.5, color: "#52635F", marginBottom: 20 }}>
              {lang === "ur"
                ? "آپ کے پاس اب " +
                  tc(product) +
                  " کے تمام منڈی ریٹس اور تجزیات تک مکمل رسائی ہے۔"
                : "You now have full active access to " +
                  product +
                  " live rates, analytics & market alerts."}
            </p>
            <button
              onClick={() => {
                setSubscribedModal(false);
                onBack();
              }}
              className="tap-target w-full py-3.5 rounded-2xl text-white font-extrabold text-sm"
              style={{
                background: "#0F8A5F",
                boxShadow: "0 4px 14px rgba(15,138,95,0.35)",
              }}
            >
              {lang === "ur"
                ? "منڈی ڈیش بورڈ پر جائیں"
                : "Go to Mandi Dashboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

{/* ─── REPRESENTATIVE DASHBOARD SCREEN ─────────────────────────────────── */}
function RepDashboardScreen({
  push,
  initialUserData,
  onSwitchRole,
  hasRepAccount,
}: {
  push: (s: Screen) => void;
  initialUserData?: AppProps["initialUserData"];
  onSwitchRole?: (role: "customer" | "representative") => void;
  hasRepAccount?: boolean;
}) {
  const { lang, setLang, t, voiceEnabled, setVoiceEnabled } = useLang();
  const [showSwitchToast, setShowSwitchToast] = useState<string | null>(null);
  const lastProfileTapRef = useRef<number>(0);
  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);

  const repName = initialUserData?.name || (lang === "ur" ? "محمد عارف" : "Muhammad Arif");
  const repCity = initialUserData?.city || "Pakpattan Mandi";
  const repProvince = initialUserData?.province || "Punjab";

  return (
    <div className="flex-1 overflow-y-auto bg-[#F1F7F4] flex flex-col">
      {/* ─── Identical Top Header ─── */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{
          background: "linear-gradient(170deg, #04362C 0%, #064D40 50%, #087F63 100%)",
          padding: "16px 16px 36px",
          minHeight: 180,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          boxShadow: "0 8px 30px rgba(4,54,44,0.3)",
        }}
      >
        {/* Background farm hero */}
        <img
          src={farmHeroBg}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.18,
            pointerEvents: "none",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between" style={{ minHeight: 140 }}>
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            {/* Lang & Voice buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLang(lang === "ur" ? "en" : "ur")}
                className="tap-target px-2.5 py-1 rounded-full text-white font-extrabold text-xs"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {lang === "ur" ? "English" : "اردو"}
              </button>
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="tap-target flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white font-extrabold text-xs"
                style={{
                  background: voiceEnabled ? "rgba(47, 174, 104, 0.45)" : "rgba(255,255,255,0.18)",
                  border: voiceEnabled ? "1.2px solid #2FAE68" : "1px solid rgba(255,255,255,0.35)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                <span>{voiceEnabled ? t("Voice On") : t("Voice Off")}</span>
              </button>
            </div>

            {/* Profile Avatar with double tap and REP badge */}
            <button
              onClick={() => {
                const now = Date.now();
                if (now - lastProfileTapRef.current < 350) {
                  onSwitchRole?.("customer");
                  setShowSwitchToast(lang === "ur" ? "کسٹمر ڈیش بورڈ پر تبدیل ہو گئے" : "Switched to Customer App");
                  setTimeout(() => setShowSwitchToast(null), 2500);
                } else {
                  onSwitchRole?.("customer");
                }
                lastProfileTapRef.current = now;
              }}
              className="tap-target relative flex items-center justify-center rounded-full"
              style={{
                width: 38,
                height: 38,
                background: "rgba(15, 138, 95, 0.45)",
                border: "1.5px solid #2FAE68",
                backdropFilter: "blur(8px)",
              }}
              title="Tap or double tap to switch to Customer face"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <span
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  background: "#2FAE68",
                  color: "#fff",
                  fontSize: 8,
                  fontWeight: 900,
                  padding: "1px 3px",
                  borderRadius: 6,
                  border: "1px solid #fff",
                  lineHeight: 1,
                }}
              >
                REP
              </span>
            </button>
          </div>

          {/* Switch Toast */}
          {showSwitchToast && (
            <div
              style={{
                position: "absolute",
                top: 54,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(6, 45, 36, 0.95)",
                color: "#B4E6D2",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 800,
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                zIndex: 999,
                border: "1px solid #2FAE68",
                whiteSpace: "nowrap",
              }}
            >
              ✓ {showSwitchToast}
            </div>
          )}

          {/* Rep Greeting */}
          <div className="mt-auto" style={{ paddingBottom: 6 }}>
            <h1
              style={{
                color: "#fff",
                fontSize: 20,
                lineHeight: 1.2,
                fontWeight: 800,
                fontFamily: lang === "ur" ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" : "'Poppins', sans-serif",
                textShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            >
              {repName}
            </h1>
            <p
              style={{
                color: "#B4E6D2",
                fontSize: 12,
                fontWeight: 600,
                marginTop: 2,
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }}
            >
              📍 {repCity} ({repProvince}) · {lang === "ur" ? "باضابطہ منڈی نمائندہ" : "Verified Mandi Representative"}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Representative Workspace Body ─── */}
      <div className="p-4 space-y-4 flex-1">
        {/* Switch to Customer Face Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#D5E2DD] shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#E4F2EC] text-[#087F63] px-2 py-0.5 rounded-md">
              {lang === "ur" ? "نمائندہ موڈ فعال" : "Representative Mode Active"}
            </span>
            <p className="text-xs font-bold text-[#183B34] mt-1">
              {lang === "ur" ? "کسٹمر ایپ پر واپس جائیں" : "Switch to Customer Face"}
            </p>
          </div>
          <button
            onClick={() => onSwitchRole?.("customer")}
            className="px-3.5 py-2 rounded-xl bg-[#087F63] text-white font-extrabold text-xs shadow hover:bg-[#064D40] transition"
          >
            {lang === "ur" ? "کسٹمر ایپ ➔" : "Customer App ➔"}
          </button>
        </div>

        {/* Mandi KPI Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[#D5E2DD] shadow-sm space-y-1">
            <span className="text-[10.5px] font-bold text-[#52635F]">
              {lang === "ur" ? "منسلک ممبران" : "Active Members"}
            </span>
            <h3 className="text-xl font-black text-[#183B34]">18</h3>
            <span className="text-[10px] text-[#087F63] font-bold bg-[#E8F5EF] px-1.5 py-0.5 rounded">
              {lang === "ur" ? "کسان اور بیوپاری" : "Farmers & Traders"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#D5E2DD] shadow-sm space-y-1">
            <span className="text-[10.5px] font-bold text-[#52635F]">
              {lang === "ur" ? "ماہانہ کمیشن" : "Monthly Commission"}
            </span>
            <h3 className="text-xl font-black text-[#087F63]">PKR 14,200</h3>
            <span className="text-[10px] text-[#52635F] font-semibold">
              {lang === "ur" ? "۱۵ فیصد ریونیو شیئر" : "15% Revenue Share"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#D5E2DD] shadow-sm space-y-1">
            <span className="text-[10.5px] font-bold text-[#52635F]">
              {lang === "ur" ? "بنیادی منڈی" : "Assigned Mandi"}
            </span>
            <h3 className="text-sm font-black text-[#183B34] truncate">{repCity}</h3>
            <span className="text-[10px] text-[#52635F] font-semibold">{repProvince}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#D5E2DD] shadow-sm space-y-1">
            <span className="text-[10.5px] font-bold text-[#52635F]">
              {lang === "ur" ? "ریٹس رپورٹنگ" : "Rates Reporting"}
            </span>
            <h3 className="text-sm font-black text-[#2FAE68]">
              {lang === "ur" ? "آج فعال ہے" : "Active Today"}
            </h3>
            <span className="text-[10px] text-[#52635F] font-semibold">21 Aug 2026</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold text-[#183B34] uppercase tracking-wider">
            {lang === "ur" ? "نمائندہ فوری اقدامات" : "Representative Actions"}
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setSubmittedModalOpen(true)}
              className="p-3 rounded-xl bg-white border border-[#D5E2DD] text-left hover:border-[#087F63] transition shadow-sm space-y-1"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E8F5EF] flex items-center justify-center text-[#087F63]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <p className="text-xs font-bold text-[#183B34]">
                {lang === "ur" ? "منڈی ریٹ جمع کروائیں" : "Submit Mandi Rate"}
              </p>
              <p className="text-[10px] text-[#52635F]">
                {lang === "ur" ? "آج کی آمد اور ریٹ" : "Daily arrivals & rate"}
              </p>
            </button>

            <button
              onClick={() => setSubmittedModalOpen(true)}
              className="p-3 rounded-xl bg-white border border-[#D5E2DD] text-left hover:border-[#087F63] transition shadow-sm space-y-1"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E8F5EF] flex items-center justify-center text-[#087F63]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-xs font-bold text-[#183B34]">
                {lang === "ur" ? "نیا ممبر شامل کریں" : "Onboard Member"}
              </p>
              <p className="text-[10px] text-[#52635F]">
                {lang === "ur" ? "۱۵ فیصد کمیشن کمائیں" : "Earn 15% commission"}
              </p>
            </button>
          </div>
        </div>

        {/* Recent Rate Submissions */}
        <div className="p-4 rounded-2xl bg-white border border-[#D5E2DD] shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold text-[#183B34] uppercase tracking-wider">
              {lang === "ur" ? "حالیہ تصدیق شدہ ریٹس" : "Recent Rate Submissions"}
            </h4>
            <span className="text-[10px] text-[#087F63] font-extrabold">21 Aug 2026</span>
          </div>
          <div className="space-y-2">
            {[
              { crop: "Wheat (گندم)", mandi: "Pakpattan Mandi", rate: "PKR 4,100", arrival: "1,200 Bags" },
              { crop: "Rice (باسمتی)", mandi: "Pakpattan Mandi", rate: "PKR 9,500", arrival: "450 Bags" },
              { crop: "Maize (مکئی)", mandi: "Pakpattan Mandi", rate: "PKR 2,850", arrival: "800 Bags" },
            ].map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-[#F1F7F4] last:border-b-0 text-xs">
                <div>
                  <p className="font-bold text-[#183B34]">{sub.crop}</p>
                  <p className="text-[10.5px] text-[#52635F]">{sub.mandi} · {sub.arrival}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[#087F63]">{sub.rate}</p>
                  <span className="text-[9.5px] font-bold text-[#2FAE68] bg-[#E8F5EF] px-1.5 py-0.5 rounded">
                    Verified ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {submittedModalOpen && (
        <div className="zm-sheet-overlay" style={{ zIndex: 400 }} onClick={() => setSubmittedModalOpen(false)}>
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-[#E4F2EC] text-[#087F63] flex items-center justify-center text-2xl mx-auto mb-3">
              ✓
            </div>
            <h3 className="text-base font-black text-[#183B34] mb-1">
              {lang === "ur" ? "نمائندہ پورٹل فعال ہے" : "Representative Workspace Active"}
            </h3>
            <p className="text-xs text-[#52635F] mb-4 leading-relaxed">
              {lang === "ur"
                ? "آپ کا نمائندہ اکاؤنٹ کامیابی سے کام کر رہا ہے۔ آپ کسی بھی وقت ڈبل ٹیپ کر کے کسٹمر فیس پر سوئچ کر سکتے ہیں۔"
                : "Your mandi representative workspace is fully synchronized. Double tap your profile icon anytime to toggle to Customer face."}
            </p>
            <button
              onClick={() => setSubmittedModalOpen(false)}
              className="w-full py-3 rounded-xl bg-[#087F63] text-white font-bold text-xs"
            >
              {lang === "ur" ? "ٹھیک ہے" : "Done"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AppInner({
  initialUserData,
  activeRole = "customer",
  hasRepAccount = false,
  onSwitchRole,
  onStartRepOnboarding,
  onRestartOnboarding,
}: AppProps) {
  useEffect(() => {
    if (initialUserData?.products && Array.isArray(initialUserData.products)) {
      initialUserData.products.forEach((p) => {
        const mapped = PRODUCT_ID_TO_NAME[p.toLowerCase()] || p;
        SUBSCRIBED_PRODUCTS.add(mapped);
      });
    }
  }, [initialUserData]);

  const { lang } = useLang();
  const [stack, setStack] = useState<Screen[]>([{ id: "home" }]);
  const [activeNav, setActiveNav] = useState<NavTab>("home");
  const [feedOpen, setFeedOpen] = useState(false);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>({
    products: [],
    byproducts: [],
    stations: [],
    rateTypes: [],
  });

  // Lifted Profile & Subscription state shared across screens
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [completeProfileOpen, setCompleteProfileOpen] = useState(false);
  const [profileSetupData, setProfileSetupData] = useState<ProfileSetupData>(
    () => ({
      step: 1,
      furthestStep: 1,
      province: initialUserData?.province || "Punjab",
      district:
        initialUserData?.district || initialUserData?.city || "Pakpattan",
      city: initialUserData?.city || "Pakpattan Mandi",
      selectedMandis: [initialUserData?.city || "Pakpattan Mandi"],
      selectedProds: ["Wheat"],
      dur: 0,
      customMode: false,
      customMonths: 3,
      paymentType: "wallet",
      walletProvider: "jazzcash",
      walletNumber: initialUserData?.phone || "0300 1234567",
      walletCnic: "",
      walletPromptSent: false,
      directMethod: "jazzcash",
      hasReceipt: false,
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      cardHolder: initialUserData?.name || "Muhammad Arif",
    }),
  );

  const updateProfileSetupData = (partial: Partial<ProfileSetupData>) => {
    setProfileSetupData((prev) => ({ ...prev, ...partial }));
  };

  const handleCompleteProfileSubmit = (
    selected: string[],
    locationData?: { province: string; district: string; city: string },
  ) => {
    selected.forEach((p) => {
      const mapped = PRODUCT_ID_TO_NAME[p.toLowerCase()] || p;
      SUBSCRIBED_PRODUCTS.add(mapped);
      TODAY_ONLY_PRODUCTS.add(mapped);
    });
    if (locationData && initialUserData) {
      initialUserData.province = locationData.province;
      initialUserData.district = locationData.district;
      initialUserData.city = locationData.city;
    }
    setProfileCompleted(true);
    setCompleteProfileOpen(false);
  };

  // Your Picks — user-favourited byproducts, shared app-wide
  const [pickedByproducts, setPickedByproducts] = useState<RateItem[]>([]);
  const togglePickBP = (item: RateItem) =>
    setPickedByproducts((prev) => {
      const key = `${item.vertical}|${item.product}|${item.byproduct}`;
      const exists = prev.some(
        (p) => `${p.vertical}|${p.product}|${p.byproduct}` === key,
      );
      return exists
        ? prev.filter(
            (p) => `${p.vertical}|${p.product}|${p.byproduct}` !== key,
          )
        : [...prev, item];
    });
  const isPickedBP = (item: RateItem) =>
    pickedByproducts.some(
      (p) =>
        p.vertical === item.vertical &&
        p.product === item.product &&
        p.byproduct === item.byproduct,
    );

  // Contextual location scope, shared across the product/detail flow
  const [locationScope, setLocationScope] = useState<LocationScope>({
    kind: "province",
    label: "Punjab",
  });
  const [locSheet, setLocSheet] = useState(false);

  const current = stack[stack.length - 1];
  const push = (s: Screen) => setStack((p) => [...p, s]);
  const pop = () => setStack((p) => (p.length > 1 ? p.slice(0, -1) : p));
  const replace = (s: Screen) => setStack((p) => [...p.slice(0, -1), s]);

  const handleNav = (tab: NavTab) => {
    setVoicePhase("idle");
    setActiveNav(tab);
    if (tab === "home" || tab === "analytics" || tab === "news") {
      setStack([{ id: tab }]);
    }
  };

  const openFeed = (filter?: Partial<FeedFilter>) => {
    setFeedFilter({
      products: [],
      byproducts: [],
      stations: [],
      rateTypes: [],
      ...filter,
    });
    setFeedOpen(true);
  };

  type RatesScr = Extract<Screen, { id: "rates-result" }>;
  type MandiScr = Extract<Screen, { id: "mandi-detail" }>;
  type ComRatesScr = Extract<Screen, { id: "product-rates" }>;
  type CombinedScr = Extract<Screen, { id: "byproduct-combined" }>;
  type BillingScr = Extract<Screen, { id: "billing" }>;

  const [voicePhase, setVoicePhase] = useState<
    "idle" | "orientation" | "query"
  >("idle");

  const handleVoiceTap = () => {
    if (voicePhase !== "idle") {
      setVoicePhase("idle");
      return;
    }
    // Orientation guide only makes sense on home screen
    if (current.id === "home") setVoicePhase("orientation");
  };
  const handleVoiceHold = () => {
    setVoicePhase("query");
  };

  const navActive: NavTab =
    (["analytics", "news"] as NavTab[]).includes(activeNav) &&
    stack.length === 1
      ? activeNav
      : "home";

  return (
    <div
      className={`flex justify-center items-stretch ${lang === "ur" ? "lang-ur" : ""}`}
      dir={lang === "ur" ? "rtl" : "ltr"}
      style={{
        background: "#C7D6D0",
        height: "100dvh",
        fontFamily:
          lang === "ur"
            ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', -apple-system, sans-serif"
            : "'Inter', 'Poppins', sans-serif",
      }}
    >
      <div
        className="relative flex flex-col w-full max-w-md overflow-hidden"
        style={{
          height: "100dvh",
          background: "#F1F7F4",
          boxShadow: "0 0 80px rgba(0,0,0,0.18)",
        }}
      >
        <div
          className="flex-1 overflow-hidden flex flex-col"
          style={{ minHeight: 0 }}
        >
          {current.id === "home" && (
            activeRole === "representative" ? (
              <RepDashboardScreen
                push={push}
                initialUserData={initialUserData}
                onSwitchRole={onSwitchRole}
                hasRepAccount={hasRepAccount}
              />
            ) : (
              <HomeScreen
                push={push}
                setFeedOpen={(v) => {
                  if (v) openFeed({});
                  else setFeedOpen(false);
                }}
                pickedByproducts={pickedByproducts}
                togglePickBP={togglePickBP}
                isPickedBP={isPickedBP}
                setPickedByproducts={setPickedByproducts}
                voiceGuideActive={voicePhase === "orientation"}
                onVoiceGuideClose={() => setVoicePhase("idle")}
                initialUserData={initialUserData}
                activeRole={activeRole}
                hasRepAccount={hasRepAccount}
                onSwitchRole={onSwitchRole}
                onStartRepOnboarding={onStartRepOnboarding}
                onRestartOnboarding={onRestartOnboarding}
                profileCompleted={profileCompleted}
                setProfileCompleted={setProfileCompleted}
                completeProfileOpen={completeProfileOpen}
                setCompleteProfileOpen={setCompleteProfileOpen}
                profileSetupData={profileSetupData}
                updateProfileSetupData={updateProfileSetupData}
                onCompleteProfileSubmit={handleCompleteProfileSubmit}
              />
            )
          )}
          {current.id === "search" && <SearchScreen push={push} onBack={pop} />}
          {current.id === "product-select" && (
            <ProductSelectScreen push={push} onBack={pop} />
          )}
          {current.id === "byproduct-select" && (
            <ByProductSelectScreen push={push} onBack={pop} />
          )}
          {current.id === "byproduct-combined" && (
            <ByProductCombinedScreen
              products={(current as CombinedScr).products}
              active={(current as CombinedScr).active}
              push={push}
              replace={replace}
              onBack={pop}
              isPickedBP={isPickedBP}
              togglePickBP={togglePickBP}
              locationScope={locationScope}
              onOpenLocation={() => setLocSheet(true)}
              profileCompleted={profileCompleted}
              onOpenSubscribe={() => setCompleteProfileOpen(true)}
            />
          )}
          {current.id === "rates-result" && (
            <RatesResultScreen
              items={(current as RatesScr).items}
              source={(current as RatesScr).source}
              onBack={pop}
            />
          )}
          {current.id === "mandi-list" && (
            <MandiListScreen push={push} onBack={pop} />
          )}
          {current.id === "mandi-detail" && (
            <MandiDetailScreen
              mandiId={(current as MandiScr).mandiId}
              onBack={pop}
              push={push}
            />
          )}
          {current.id === "product-rates" && (
            <ProductRatesScreen
              vertical={(current as ComRatesScr).vertical}
              product={(current as ComRatesScr).product}
              byproduct={(current as ComRatesScr).byproduct}
              onBack={pop}
              push={push}
              isPickedBP={isPickedBP}
              togglePickBP={togglePickBP}
              locationScope={locationScope}
              onOpenLocation={() => setLocSheet(true)}
              initialRateType={(current as ComRatesScr).initialRateType}
              initialMandi={(current as ComRatesScr).initialMandi}
              initialVariety={(current as ComRatesScr).initialVariety}
              initialNewOld={(current as ComRatesScr).initialNewOld}
              initialColor={(current as ComRatesScr).initialColor}
              initialSpec={(current as ComRatesScr).initialSpec}
              initialCondition={(current as ComRatesScr).initialCondition}
              initialStatDate={(current as ComRatesScr).initialStatDate}
            />
          )}
          {current.id === "live-market" && <LiveMarketScreen onBack={pop} />}
          {current.id === "analytics" && <AnalyticsScreen />}
          {current.id === "news" && <NewsVideosScreen />}
          {current.id === "billing" && (
            <BillingScreen
              product={(current as BillingScr).product}
              vertical={(current as BillingScr).vertical}
              onBack={pop}
              push={push}
            />
          )}
        </div>
        <BottomNav
          active={navActive}
          onNav={handleNav}
          onVoiceTap={handleVoiceTap}
          onVoiceHold={handleVoiceHold}
          voiceActive={voicePhase !== "idle"}
        />
        {voicePhase === "query" && (
          <VoiceQueryOverlay
            onClose={() => setVoicePhase("idle")}
            onNavigate={(s) => {
              setVoicePhase("idle");
              setActiveNav("home");
              setStack([{ id: "home" }, s]);
            }}
          />
        )}
        {feedOpen && (
          <FeedModal
            initialFilter={feedFilter}
            onClose={() => setFeedOpen(false)}
          />
        )}
        {locSheet && (
          <LocationScopeSheet
            scope={locationScope}
            onSelect={(s) => {
              setLocationScope(s);
              setLocSheet(false);
            }}
            onClose={() => setLocSheet(false)}
          />
        )}
        {completeProfileOpen && (
          <CompleteProfileModal
            data={profileSetupData}
            onUpdateData={updateProfileSetupData}
            onClose={() => setCompleteProfileOpen(false)}
            onComplete={handleCompleteProfileSubmit}
            initialUserData={initialUserData}
          />
        )}
      </div>
    </div>
  );
}

export default function CustomerFaceApp(props: AppProps) {
  return (
    <LangProvider>
      <AppInner {...props} />
    </LangProvider>
  );
}

