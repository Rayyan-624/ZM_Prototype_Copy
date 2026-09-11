import React, { useState, useCallback, useRef, useEffect } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

export interface SpeakOptions {
  voice?: string;
  lang?: "ur-PK" | "en-US" | "ur" | "en";
}

let activeAudioElement: HTMLAudioElement | null = null;

// Comprehensive Urdu phonetic transliteration map for 100% reliable browser speech
const URDU_TO_ROMAN_MAP: Record<string, string> = {
  "گندم": "Gandum",
  "پھٹی": "Phutti",
  "کپاس": "Kapaas",
  "چاول": "Chaawal",
  "مکئی": "Makai",
  "تل": "Till",
  "سرسوں": "Sarson",
  "باجرہ": "Baajra",
  "گنا": "Ganna",
  "چینی": "Cheeni",
  "کریانہ": "Kiryana",
  "مویشی": "Maweshi",
  "کھاد": "Khaad",
  "سبزیاں": "Sabziyaan",
  "پھل": "Phall",
  "خشک میوہ جات": "Khushk Mewa Jaat",
  "جڑی بوٹیاں": "Jari Bootiyaan",
  "خوردنی تیل": "Khordani Tail",
  "پورا پاکستان": "Poora Pakistan",
  "پورے پاکستان کی قیمتیں": "Pooray Pakistan ki qeematein",
  "پورے ملک کے ریٹس دکھائے جا رہے ہیں۔": "Pooray mulk kay rates dikhaye ja rahe hain",
  "مقام منتخب کریں": "Maqaam muntakhib karein",
  "مقام کا انتخاب": "Maqaam ka intikhaab",
  "آواز فعال ہے": "Awaaz on hai",
  "آواز آن": "Awaaz on",
  "آواز بند": "Awaaz band",
  "اردو": "Urdu",
  "English": "English",
  "تمام مصنوعات": "Tamaam masnooaat",
  "تمام ریٹس دکھائے جا رہے ہیں۔": "Tamaam rates dikhaye ja rahe hain",
  "تمام ضمنی مصنوعات": "Tamaam zimni masnooaat",
  "اطلاعات اور پیغامات": "Ittilaat aur paighamaat",
  "اطلاعات": "Ittilaat",
  "پروفائل": "Profile",
  "پروفائل میں ترمیم": "Profile mein tarmeem",
  "منڈی کا نقشہ": "Mandi ka naqsha",
  "نقشہ دیکھیں": "Naqsha dekhein",
  "نقشہ کھولا گیا": "Naqsha khola gaya",
  "قریبی منڈیاں دیکھیں": "Qareebi mandiyaan dekhein",
  "آج کا جائزہ": "Aaj ka jaiza",
  "روزانہ ریٹس": "Rozana rates",
  "قیمتوں کا رجحان": "Qeemton ka rujhaan",
  "آمد کا رجحان": "Aamad ka rujhaan",
  "جائزہ": "Jaiza",
  "فصلیں اور منڈیاں": "Faslein aur mandiyaan",
  "کاروباری اوقات": "Karobari auqaat",
  "فعال لاٹس": "Fa-aal lots",
  "مارکیٹ کی صورتحال": "Market ki soorathal",
  "مارکیٹ کھلی ہے": "Market khuli hai",
  "مارکیٹ بند ہے": "Market band hai",
  "ورائٹی": "Variety",
  "نئی پرانی فصل": "Nayi puraani fasal",
  "رنگت": "Rangat",
  "گریڈ اور معیار": "Grade aur mayaar",
  "حالت": "Haalat",
  "ریٹ کی قسم": "Rate ki qisam",
  "ریٹیل ریٹ": "Retail rate",
  "ہول سیل ریٹ": "Wholesale rate",
  "مل ریٹ": "Mill rate",
  "ڈیلیوری ریٹ": "Delivery rate",
  "خشک": "Khushk",
  "نمی دار": "Nami daar",
  "نیا مال": "Naya maal",
  "پرانا مال": "Puraana maal",
  "محفوظ شدہ": "Mehfooz shuda",
  "محفوظ کریں": "Mehfooz karein",
  "راستہ معلوم کریں": "Raasta maaloom karein",
  "شیئر کریں": "Share karein",
  "واپس": "Wapas",
  "تمام فلٹرز صاف کریں": "Tamaam filters saaf karein",
  "آج کی تاریخ": "Aaj ki tareekh",
  "چوبیس گھنٹے": "Chaubees ghantay",
  "بہتر گھنٹے": "Bahattar ghantay",
  "ہفتہ وار": "Hafta waar",
  "ماہانہ": "Maahana",
  "پنجاب": "Punjab",
  "سندھ": "Sindh",
  "خیبر پختونخوا": "Khyber Pakhtunkhwa",
  "بلوچستان": "Balochistan",
  "پاکپتن": "Pakpattan",
  "اوکاڑہ": "Okara",
  "ساہیوال": "Sahiwal",
  "فیصل آباد": "Faisalabad",
  "ملتان": "Multan",
  "لاہور": "Lahore",
  "بہاولپور": "Bahawalpur",
  "رحیم یار خان": "Rahim Yar Khan",
  "گھوٹکی": "Ghotki",
  "سکھر": "Sukkur",
  "نوابشاہ": "Nawabshah",
  "حیدرآباد": "Hyderabad",
  "کراچی": "Karachi",
  "پشاور": "Peshawar",
  "کوئٹہ": "Quetta",
  "منڈی": "Mandi",
  "کم سے کم": "Kam se kam",
  "زیادہ سے زیادہ": "Zyaada se zyaada",
  "روپے": "Rupay",
  "روپیہ": "Rupiya",
  "نقشہ": "Naqsha",
  "صوبہ": "Sooba",
  "ضلع": "Zila",
  "کی قیمتیں دکھائی جا رہی ہیں": "ki qeematein dikhayi ja rahi hain",
  "منتخب کیا گیا": "muntakhib kiya gaya",
  "منتخب ہیں": "muntakhib hain",
  "ہٹا دی گئی": "hata di gayi",
};

/**
 * Transliterate Urdu text to romanized phonetic text for native speech engines
 */
export function getRomanUrdu(urduText: string): string {
  let res = urduText;
  for (const [k, v] of Object.entries(URDU_TO_ROMAN_MAP)) {
    res = res.split(k).join(v);
  }
  return res;
}

/**
 * Clean text of non-pronounceable glyphs
 */
export function cleanSpokenText(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/[•★✓›‹→←▲▼🌾·۔]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * High-performance Universal Urdu & English Text-to-Speech Engine
 * Automatically plays real audio voice-overs for every interaction.
 */
export async function speakUrdu(
  text: string,
  options: SpeakOptions = {}
): Promise<HTMLAudioElement> {
  // Stop existing playback
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch {}
    activeAudioElement = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }

  const cleaned = cleanSpokenText(text);
  if (!cleaned) return new Audio();

  const isUrdu = options.lang !== "en-US" && options.lang !== "en";

  // 1. Direct Online Native Audio Stream
  try {
    const encoded = encodeURIComponent(cleaned);
    const streamUrl = isUrdu
      ? `https://translate.google.com/translate_tts?ie=UTF-8&tl=ur&client=tw-ob&q=${encoded}`
      : `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encoded}`;

    const audio = new Audio(streamUrl);
    audio.volume = 1.0;
    activeAudioElement = audio;

    let played = false;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      await playPromise
        .then(() => {
          played = true;
        })
        .catch(() => {
          played = false;
        });
    }

    if (played) {
      audio.onended = () => {
        if (activeAudioElement === audio) activeAudioElement = null;
      };
      return audio;
    }
  } catch (e) {}

  // 2. Universal Browser SpeechSynthesis Engine with Subcontinent / Native Voice
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const speechText = isUrdu ? getRomanUrdu(cleaned) : cleaned;
    const utterance = new SpeechSynthesisUtterance(speechText);

    utterance.rate = isUrdu ? 0.90 : 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (isUrdu) {
        const targetVoice =
          voices.find((v) => v.lang.toLowerCase().includes("ur")) ||
          voices.find((v) => v.name.toLowerCase().includes("uzma")) ||
          voices.find((v) => v.lang.toLowerCase().includes("hi") || v.name.toLowerCase().includes("swara") || v.name.toLowerCase().includes("madhur") || v.name.toLowerCase().includes("lekh")) ||
          voices.find((v) => v.lang.toLowerCase() === "en-in" || v.name.toLowerCase().includes("india") || v.name.toLowerCase().includes("rishi") || v.name.toLowerCase().includes("sangeeta")) ||
          voices.find((v) => v.lang.toLowerCase().startsWith("ar")) ||
          voices.find((v) => v.lang.toLowerCase().startsWith("en"));

        if (targetVoice) {
          utterance.voice = targetVoice;
          utterance.lang = targetVoice.lang;
        } else {
          utterance.lang = "en-US";
        }
      } else {
        const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
        if (enVoice) utterance.voice = enVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  }

  return new Audio();
}

export interface VoiceAssistantProps {
  text?: string;
  urduText?: string;
  englishText?: string;
  currentLang?: "ur" | "en";
  className?: string;
  size?: number;
  color?: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  text,
  urduText,
  englishText,
  currentLang = "ur",
  className = "",
  size = 18,
  color = "#166534",
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSpeak = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.stopPropagation();

    const textToSpeak = currentLang === "ur" ? urduText || text || "" : englishText || text || "";
    if (!textToSpeak.trim()) return;

    setLoading(true);
    setIsPlaying(true);

    try {
      const audio = await speakUrdu(textToSpeak, {
        lang: currentLang === "ur" ? "ur-PK" : "en-US",
      });

      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
    } catch (err) {
      console.warn("TTS Error:", err);
      setIsPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      disabled={loading}
      className={`tap-target inline-flex items-center justify-center rounded-full p-1.5 transition-colors ${className}`}
      style={{
        background: isPlaying ? "#DCFCE7" : "rgba(240, 253, 244, 0.9)",
        border: `1px solid ${isPlaying ? "#16A34A" : "#D5E2DD"}`,
        cursor: loading ? "wait" : "pointer",
      }}
      title={currentLang === "ur" ? "آواز سنیں" : "Listen to audio"}
    >
      {loading ? (
        <Loader2 size={size} className="animate-spin text-green-700" color={color} />
      ) : isPlaying ? (
        <VolumeX size={size} color="#166534" />
      ) : (
        <Volume2 size={size} color={color} />
      )}
    </button>
  );
};

export default VoiceAssistant;
