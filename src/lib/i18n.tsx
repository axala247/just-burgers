import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { Text } from "@/data/menu"

export type Lang = "ka" | "en"

const en = {
  address: "2 Roman Miminoshvili St, Tbilisi",
  addressShort: "2 Miminoshvili St · Tbilisi",
  tagline: "Smash burgers. The beef is ground after you order.",
  seeMenu: "See the menu",
  signOpen: "OPEN",
  openUntil: "Open until 01:00",
  closesIn: "Open · closes in {n} min",
  closedOpensAt: "Closed · opens at 14:00",
  prevBurger: "Previous burger",
  nextBurger: "Next burger",
  addToOrder: "Add to order",
  add: "Add {name}",
  remove: "Remove one {name}",
  popular: "Popular",
  menu: "Menu",
  order: "Order",
  orderCount: "Your order, {n} items",

  comboTitle: "Build a combo",
  stepBurger: "Burger",
  stepSoda: "Soda",
  stepSauce: "Sauce",
  friesIncluded: "Fries, 200 g — included",
  separately: "Bought separately",
  comboPrice: "As a combo",
  youSave: "You save {n} ₾",
  addCombo: "Add combo · {n} ₾",
  comboAdded: "Combo added",

  trayTitle: "Your order",
  trayHelp: "Put it together here, then order on Wolt or call us.",
  trayEmpty: "Your order is empty. Add something from the menu.",
  total: "Total",
  orderOnWolt: "Order on Wolt",
  call: "Call 591 55 35 35",
  copyOrder: "Copy order",
  copied: "Copied",
  clear: "Clear",
  close: "Close",
  trayNote: "Prices from our Wolt menu. Delivery fee not included.",
  viewOrder: "View order",
  itemsN: "{n} items",
  itemsOne: "1 item",

  reviewsTitle: "4.6 on Google",
  reviewsCount: "338 reviews",
  reviewSource: "Google review",

  visitTitle: "Come by",
  hours: "Hours",
  addressLabel: "Address",
  everyDay: "Every day",
  phone: "Phone",
  directions: "Get directions",
  perPerson: "20–30 ₾ per person",
  dineIn: "Dine-in",
  delivery: "No-contact delivery",
  lgbt: "LGBTQ+ friendly",
  facebook: "Facebook",
  language: "Language",
}

type Strings = typeof en

const ka: Strings = {
  address: "რომან მიმინოშვილის ქ. 2, თბილისი",
  addressShort: "მიმინოშვილის ქ. 2 · თბილისი",
  tagline: "სმეშ ბურგერები. ხორცს შეკვეთის შემდეგ ვფქვავთ.",
  seeMenu: "მენიუს ნახვა",
  signOpen: "ღიაა",
  openUntil: "ღიაა 01:00-მდე",
  closesIn: "ღიაა · იკეტება {n} წუთში",
  closedOpensAt: "დაკეტილია · გაიხსნება 14:00-ზე",
  prevBurger: "წინა ბურგერი",
  nextBurger: "შემდეგი ბურგერი",
  addToOrder: "შეკვეთაში დამატება",
  add: "დაამატე: {name}",
  remove: "მოაკელი: {name}",
  popular: "პოპულარული",
  menu: "მენიუ",
  order: "შეკვეთა",
  orderCount: "შენი შეკვეთა, {n} ერთეული",

  comboTitle: "ააწყვე კომბო",
  stepBurger: "ბურგერი",
  stepSoda: "სასმელი",
  stepSauce: "სოუსი",
  friesIncluded: "ფრი, 200 გ — შედის",
  separately: "ცალ-ცალკე",
  comboPrice: "კომბოდ",
  youSave: "დაზოგავ {n} ₾-ს",
  addCombo: "კომბოს დამატება · {n} ₾",
  comboAdded: "კომბო დაემატა",

  trayTitle: "შენი შეკვეთა",
  trayHelp: "ააწყვე აქ, შემდეგ შეუკვეთე Wolt-ზე ან დაგვირეკე.",
  trayEmpty: "შეკვეთა ცარიელია. დაამატე რამე მენიუდან.",
  total: "ჯამი",
  orderOnWolt: "შეკვეთა Wolt-ზე",
  call: "დარეკვა 591 55 35 35",
  copyOrder: "შეკვეთის კოპირება",
  copied: "დაკოპირდა",
  clear: "გასუფთავება",
  close: "დახურვა",
  trayNote: "ფასები ჩვენი Wolt-ის მენიუდანაა. მიწოდების საფასური არ შედის.",
  viewOrder: "შეკვეთის ნახვა",
  itemsN: "{n} ერთეული",
  itemsOne: "1 ერთეული",

  reviewsTitle: "4.6 Google-ზე",
  reviewsCount: "338 შეფასება",
  reviewSource: "შეფასება Google-ზე",

  visitTitle: "გვესტუმრე",
  hours: "სამუშაო საათები",
  addressLabel: "მისამართი",
  everyDay: "ყოველდღე",
  phone: "ტელეფონი",
  directions: "მარშრუტი",
  perPerson: "20–30 ₾ ერთ ადამიანზე",
  dineIn: "ადგილზე მირთმევა",
  delivery: "უკონტაქტო მიწოდება",
  lgbt: "LGBTQ+ მეგობრული",
  facebook: "Facebook",
  language: "ენა",
}

const strings: Record<Lang, Strings> = { en, ka }

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: keyof Strings, vars?: Record<string, string | number>) => string
  pick: (text: Text) => string
}

const LangContext = createContext<Ctx | null>(null)

const STORAGE_KEY = "jb-lang"

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "ka" || saved === "en") return saved
  } catch {
    // storage unavailable
  }
  return navigator.language?.toLowerCase().startsWith("ka") ? "ka" : "en"
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // storage unavailable
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => {
        let s = strings[lang][key]
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
        return s
      },
      pick: (text) => text[lang],
    }),
    [lang, setLang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error("useLang must be used inside LangProvider")
  return ctx
}
