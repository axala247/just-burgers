import { useEffect, useState, type ReactNode } from "react"
import { Check } from "lucide-react"
import { MetalButton } from "@/components/ui/liquid-glass-button"
import { burgerList, comboDrinks, comboSauces, FRIES_ID, itemById } from "@/data/menu"
import { useLang } from "@/lib/i18n"
import { useTray } from "@/lib/tray"
import { cn } from "@/lib/utils"

function Choice({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string
  value: string
  checked: boolean
  onChange: (v: string) => void
  children: ReactNode
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex h-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ketchup",
          checked
            ? "border-tray bg-tray text-cream"
            : "border-tray/15 bg-white/40 text-tray hover:border-tray/50",
        )}
      >
        {children}
      </span>
    </label>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-center gap-2.5 text-sm font-semibold">
        <span className="tabular grid size-6 place-items-center rounded-full bg-ketchup text-xs text-cream">{n}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

export function ComboBuilder() {
  const { t, pick } = useLang()
  const { add } = useTray()

  const [burgerId, setBurgerId] = useState("juicy-lucy")
  const [drinkId, setDrinkId] = useState(comboDrinks[0].id)
  const [sauceId, setSauceId] = useState(comboSauces[0].id)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const id = window.setTimeout(() => setAdded(false), 1800)
    return () => window.clearTimeout(id)
  }, [added])

  const burger = itemById[burgerId]
  const combo = itemById[`${burgerId}-combo`]
  const parts = [burger, itemById[FRIES_ID], itemById[drinkId], itemById[sauceId]]
  const separately = parts.reduce((n, p) => n + p.price, 0)
  const saving = separately - combo.price

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      {/* same wall and tray in every combo photo, so they cross-fade in place */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-wall lg:sticky lg:top-24">
        {burgerList.map((b) => (
          <img
            key={b.id}
            src={`/menu/${b.id}-combo.jpg`}
            alt={b.id === burgerId ? pick(itemById[`${b.id}-combo`].name) : ""}
            aria-hidden={b.id !== burgerId}
            loading="lazy"
            width={1200}
            height={675}
            className={cn(
              "absolute inset-0 size-full object-cover object-[50%_70%] transition-opacity duration-500",
              b.id === burgerId ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>

      <div className="space-y-8">
        <Step n={1} title={t("stepBurger")}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {burgerList.map((b) => (
              <Choice key={b.id} name="combo-burger" value={b.id} checked={burgerId === b.id} onChange={setBurgerId}>
                <span className="font-medium">{pick(b.name)}</span>
                <span className="type-wide tabular shrink-0 text-xs">{itemById[`${b.id}-combo`].price} ₾</span>
              </Choice>
            ))}
          </div>
        </Step>

        <Step n={2} title={t("stepSoda")}>
          <div className="grid grid-cols-2 gap-2">
            {comboDrinks.map((d) => (
              <Choice key={d.id} name="combo-drink" value={d.id} checked={drinkId === d.id} onChange={setDrinkId}>
                <span className="font-medium">{pick(d.name)}</span>
              </Choice>
            ))}
          </div>
        </Step>

        <Step n={3} title={t("stepSauce")}>
          <div className="grid grid-cols-2 gap-2">
            {comboSauces.map((s) => (
              <Choice key={s.id} name="combo-sauce" value={s.id} checked={sauceId === s.id} onChange={setSauceId}>
                <span className="font-medium">{pick(s.name)}</span>
              </Choice>
            ))}
          </div>
        </Step>

        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="size-4 text-ketchup" strokeWidth={2.5} />
          {t("friesIncluded")}
        </p>

        {/* the receipt: why a combo is worth it */}
        <div className="rounded-2xl border border-dashed border-tray/25 bg-white/35 p-5 text-sm" aria-live="polite">
          <dl className="space-y-1.5">
            {parts.map((p) => (
              <div key={p.id} className="flex items-baseline gap-2 text-muted-foreground">
                <dt className="shrink-0">{pick(p.name)}</dt>
                <span aria-hidden className="flex-1 border-b border-dotted border-tray/25" />
                <dd className="tabular">{p.price} ₾</dd>
              </div>
            ))}
            <div className="flex items-baseline gap-2 pt-2">
              <dt className="shrink-0">{t("separately")}</dt>
              <span aria-hidden className="flex-1 border-b border-dotted border-tray/25" />
              <dd className="tabular text-muted-foreground line-through decoration-ketchup decoration-2">{separately} ₾</dd>
            </div>
            <div className="flex items-baseline gap-2 font-semibold">
              <dt className="shrink-0">{t("comboPrice")}</dt>
              <span aria-hidden className="flex-1 border-b border-dotted border-tray/25" />
              <dd className="tabular">{combo.price} ₾</dd>
            </div>
          </dl>
          <p className="type-wide mt-4 text-xs text-ketchup">{t("youSave", { n: saving })}</p>
        </div>

        <MetalButton
          type="button"
          className="min-w-56 text-[0.95rem]"
          onClick={() => {
            add(combo.id, { drinkId, sauceId })
            setAdded(true)
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            {added && <Check className="size-4" strokeWidth={3} />}
            {added ? t("comboAdded") : t("addCombo", { n: combo.price })}
          </span>
        </MetalButton>
      </div>
    </div>
  )
}
