// Menu, prices and photos from the Just Burgers listing on Wolt (September 2026).
// English copy is written from the Georgian originals.

export type Text = { ka: string; en: string }

export type CategoryId = "burgers" | "combos" | "bowls" | "sides" | "sauces" | "drinks" | "extras"

export type Item = {
  id: string
  cat: CategoryId
  name: Text
  desc?: Text
  /** Short size note, e.g. "50 g" or "0.33 L" */
  size?: Text
  price: number
  img?: string
  popular?: boolean
  /** Combos point at the burger they are built on */
  comboOf?: string
}

export const categories: { id: CategoryId; name: Text; note?: Text }[] = [
  { id: "burgers", name: { ka: "ბურგერები", en: "Burgers" } },
  {
    id: "combos",
    name: { ka: "კომბო", en: "Combos" },
    note: {
      ka: "ბურგერი, 200 გ ფრი, გაზიანი სასმელი და სასურველი სოუსი.",
      en: "A burger, 200 g of fries, a soda and a sauce of your choice.",
    },
  },
  {
    id: "bowls",
    name: { ka: "ბოულები", en: "Bowls" },
    note: {
      ka: "ქვეშ ფრი, ზემოდან ბურგერის შიგთავსი. ფუნთუშის გარეშე.",
      en: "Fries underneath, burger fillings on top. No bun.",
    },
  },
  { id: "sides", name: { ka: "გარნირი", en: "Sides" } },
  { id: "sauces", name: { ka: "სოუსები", en: "Sauces" } },
  { id: "drinks", name: { ka: "სასმელები", en: "Drinks" } },
  { id: "extras", name: { ka: "სხვა", en: "Extras" } },
]

const burgers: Item[] = [
  {
    id: "smash",
    cat: "burgers",
    name: { ka: "სმეშ ბურგერი", en: "Smash Burger" },
    desc: {
      ka: "ფუნთუშა, საქონლის ხორცი, ამერიკული ჩედარი, პომიდორი, კარამელიზირებული ხახვი, მჟავე კიტრის პიკული, აისბერგის სალათი, ბეკონი, სპეც სოუსი",
      en: "Bun, beef, American cheddar, tomato, caramelized onion, pickles, iceberg lettuce, bacon, special sauce",
    },
    price: 22,
    img: "/menu/smash.jpg",
    popular: true,
  },
  {
    id: "juicy-lucy",
    cat: "burgers",
    name: { ka: "ჯუსი ლუსი", en: "Juicy Lucy" },
    desc: {
      ka: "ფუნთუშა, საქონლის ხორცი 2×100 გ, ხორცში ჩამდნარი ჩედარი, კიტრის პიკული, აისბერგი, სპეც სოუსი",
      en: "Bun, two 100 g beef patties with cheddar melted inside, pickles, iceberg lettuce, special sauce",
    },
    price: 27,
    img: "/menu/juicy-lucy.jpg",
    popular: true,
  },
  {
    id: "blue-cheese",
    cat: "burgers",
    name: { ka: "ბლუ ჩიზ ბურგერი", en: "Blue Cheese Burger" },
    desc: {
      ka: "ფუნთუშა, საქონლის ხორცი, ლურჯი ობიანი ყველი, ნივრის სპეც სოუსი, კარამელიზირებული ხახვი, ამერიკული ჩედარი",
      en: "Bun, beef, blue cheese, garlic special sauce, caramelized onion, American cheddar",
    },
    price: 22,
    img: "/menu/blue-cheese.jpg",
  },
  {
    id: "chili",
    cat: "burgers",
    name: { ka: "ჩილი ბურგერი", en: "Chili Burger" },
    desc: {
      ka: "ფუნთუშა, ჩილი საქონლის ხორცი, ამერიკული ჩედარი, ქოსლა სალათი, კიტრის პიკული, სპეც სოუსი",
      en: "Bun, chili beef, American cheddar, coleslaw, pickles, special sauce",
    },
    price: 22,
    img: "/menu/chili.jpg",
  },
  {
    id: "texas-bbq",
    cat: "burgers",
    name: { ka: "ტეხას ბარბექიუ ბურგერი", en: "Texas BBQ Burger" },
    desc: {
      ka: "ფუნთუშა, საქონლის ხორცი, ქოსლოუ, ყველი ჩედარი, ხახვის რგოლები, ბეკონი, ბარბექიუ სოუსი",
      en: "Bun, beef, coleslaw, cheddar, onion rings, bacon, BBQ sauce",
    },
    price: 22,
    img: "/menu/texas-bbq.jpg",
  },
  {
    id: "grilled-onion",
    cat: "burgers",
    name: { ka: "გრილზე შემწვარი ხახვის ბურგერი", en: "Grilled Onion Burger" },
    desc: {
      ka: "ფუნთუშა, საქონლის ხორცი, ბეკონის კუბები, გრილზე მოყვანილი ხახვი, ჩედარი, ცხარე სოუსი, ბარბექიუ სოუსი",
      en: "Bun, beef, bacon bits, grilled onion, cheddar, hot sauce, BBQ sauce",
    },
    price: 24,
    img: "/menu/grilled-onion.jpg",
  },
]

/** A combo costs the burger price plus this. */
export const COMBO_UPCHARGE = 8

const combos: Item[] = burgers.map((b) => ({
  id: `${b.id}-combo`,
  cat: "combos",
  name: { ka: `${b.name.ka} — კომბო`, en: `${b.name.en} Combo` },
  price: b.price + COMBO_UPCHARGE,
  img: `/menu/${b.id}-combo.jpg`,
  comboOf: b.id,
}))

const rest: Item[] = [
  // Bowls
  {
    id: "bowl-smash",
    cat: "bowls",
    name: { ka: "სმეშ ბურგერის ბოული", en: "Smash Burger Bowl" },
    price: 31,
    img: "/menu/bowl-smash.jpg",
  },
  {
    id: "bowl-chili-burger",
    cat: "bowls",
    name: { ka: "ჩილი ბურგერ ბოული", en: "Chili Burger Bowl" },
    price: 31,
    img: "/menu/bowl-chili-burger.jpg",
  },
  {
    id: "bowl-texas-bbq",
    cat: "bowls",
    name: { ka: "ტეხას ბარბექიუ ბოული", en: "Texas BBQ Bowl" },
    price: 31,
    img: "/menu/bowl-texas-bbq.jpg",
  },
  {
    id: "bowl-chili",
    cat: "bowls",
    name: { ka: "ჩილი ბოული", en: "Chili Bowl" },
    price: 19,
    img: "/menu/bowl-chili.jpg",
  },
  {
    id: "bowl-fry-bacon",
    cat: "bowls",
    name: { ka: "ფრი-ბეკონ ბოული ყველის სოუსით", en: "Fries & Bacon Bowl" },
    desc: { ka: "ყველის სოუსით", en: "With cheese sauce" },
    price: 17,
    img: "/menu/bowl-fry-bacon.jpg",
  },

  // Sides
  {
    id: "fries",
    cat: "sides",
    name: { ka: "ფრი", en: "Fries" },
    size: { ka: "200 გ", en: "200 g" },
    price: 7,
    img: "/menu/fries.jpg",
    popular: true,
  },
  {
    id: "onion-rings",
    cat: "sides",
    name: { ka: "ხახვის რგოლები", en: "Onion Rings" },
    size: { ka: "8 ცალი", en: "8 pieces" },
    price: 7,
    img: "/menu/onion-rings.jpg",
  },
  {
    id: "jalapeno",
    cat: "sides",
    name: { ka: "ჰალაპენიო", en: "Jalapeños" },
    price: 5,
  },

  // Sauces
  {
    id: "sauce-cheese",
    cat: "sauces",
    name: { ka: "ცხელი ყველის სოუსი", en: "Hot Cheese Sauce" },
    size: { ka: "50 გ", en: "50 g" },
    price: 6,
    img: "/menu/sauce-cheese.jpg",
    popular: true,
  },
  {
    id: "sauce-special",
    cat: "sauces",
    name: { ka: "ბურგერის სპეც სოუსი", en: "Burger Special Sauce" },
    price: 6,
  },
  {
    id: "sauce-bbq",
    cat: "sauces",
    name: { ka: "ბარბექიუ სოუსი", en: "BBQ Sauce" },
    size: { ka: "50 გ", en: "50 g" },
    price: 5,
    img: "/menu/sauce-bbq.jpg",
  },
  {
    id: "sauce-sriracha",
    cat: "sauces",
    name: { ka: "სრირაჩა", en: "Sriracha" },
    size: { ka: "50 გ", en: "50 g" },
    price: 5,
    img: "/menu/sauce-sriracha.jpg",
  },
  {
    id: "sauce-ketchup",
    cat: "sauces",
    name: { ka: "კეტჩუპი", en: "Ketchup" },
    size: { ka: "50 გ", en: "50 g" },
    price: 5,
    img: "/menu/sauce-ketchup.jpg",
  },
  {
    id: "sauce-mayo",
    cat: "sauces",
    name: { ka: "მაიონეზი", en: "Mayo" },
    size: { ka: "50 გ", en: "50 g" },
    price: 5,
    img: "/menu/sauce-mayo.jpg",
  },

  // Drinks
  {
    id: "coke",
    cat: "drinks",
    name: { ka: "კოკა-კოლა კლასიკი", en: "Coca-Cola Classic" },
    size: { ka: "0.33 ლ", en: "0.33 L" },
    price: 4,
    img: "/menu/coke.jpg",
    popular: true,
  },
  {
    id: "coke-zero",
    cat: "drinks",
    name: { ka: "კოკა-კოლა ზერო", en: "Coca-Cola Zero" },
    size: { ka: "0.33 ლ", en: "0.33 L" },
    price: 4,
    img: "/menu/coke-zero.jpg",
  },
  {
    id: "fanta",
    cat: "drinks",
    name: { ka: "ფანტა", en: "Fanta" },
    size: { ka: "0.33 ლ", en: "0.33 L" },
    price: 4,
    img: "/menu/fanta.jpg",
  },
  {
    id: "sprite",
    cat: "drinks",
    name: { ka: "სპრაიტი", en: "Sprite" },
    size: { ka: "0.33 ლ", en: "0.33 L" },
    price: 4,
    img: "/menu/sprite.jpg",
  },
  {
    id: "water",
    cat: "drinks",
    name: { ka: "წყალი „მთის“", en: "Mtis Water" },
    size: { ka: "0.5 ლ", en: "0.5 L" },
    price: 3,
    img: "/menu/water.jpg",
  },

  // Extras
  {
    id: "gloves",
    cat: "extras",
    name: { ka: "ნიტრილის ხელთათმანი", en: "Nitrile Gloves" },
    desc: { ka: "ჯუსი ლუსისთვის.", en: "For the Juicy Lucy." },
    price: 1,
  },
]

export const items: Item[] = [...burgers, ...combos, ...rest]

export const itemById = Object.fromEntries(items.map((i) => [i.id, i])) as Record<string, Item>

export const burgerList = burgers

/** Sodas allowed in a combo (the combo says "carbonated drink"). */
export const comboDrinks = ["coke", "coke-zero", "fanta", "sprite"].map((id) => itemById[id])

export const comboSauces = [
  "sauce-cheese",
  "sauce-special",
  "sauce-bbq",
  "sauce-sriracha",
  "sauce-ketchup",
  "sauce-mayo",
].map((id) => itemById[id])

export const FRIES_ID = "fries"
