import { useEffect, useState } from "react"
import { Droplet, Flame, Hand } from "lucide-react"
import { AddButton } from "@/components/AddButton"
import { ComboBuilder } from "@/components/ComboBuilder"
import { categories, items, type CategoryId, type Item } from "@/data/menu"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const placeholderIcon: Record<string, typeof Flame> = {
  jalapeno: Flame,
  "sauce-special": Droplet,
  gloves: Hand,
}

function useActiveCategory() {
  const [active, setActive] = useState<CategoryId>("burgers")
  useEffect(() => {
    const els = categories.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as CategoryId)
      },
      { rootMargin: "-30% 0px -65% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

function PopularTag({ className }: { className?: string }) {
  const { t } = useLang()
  return (
    <span
      className={cn(
        "type-wide inline-flex h-5 items-center rounded-full bg-ketchup px-2 text-[0.6rem] leading-none text-cream",
        className,
      )}
    >
      {t("popular")}
    </span>
  )
}

function BurgerCard({ item }: { item: Item }) {
  const { pick } = useLang()
  return (
    <article className="flex flex-col">
      <div className="burger-crop relative aspect-[5/4] overflow-hidden rounded-[1.25rem] bg-wall">
        <img src={item.img} alt={pick(item.name)} width={1200} height={675} loading="lazy" />
        {item.popular && <PopularTag className="absolute left-3 top-3" />}
      </div>
      <h3 className="type-display mt-4 text-[1.9rem]">{pick(item.name)}</h3>
      {item.desc && <p className="mt-2 text-sm text-muted-foreground">{pick(item.desc)}</p>}
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="type-wide tabular">{item.price} ₾</span>
        <AddButton itemId={item.id} />
      </div>
    </article>
  )
}

function Row({ item }: { item: Item }) {
  const { pick } = useLang()
  const Icon = placeholderIcon[item.id]
  const meta = [item.size && pick(item.size), item.desc && pick(item.desc)].filter(Boolean).join(" · ")

  return (
    <li className="flex items-center gap-4 border-b border-tray/10 py-4">
      <div className="grid size-[4.5rem] shrink-0 place-items-center overflow-hidden rounded-2xl bg-white">
        {item.img ? (
          <img src={item.img} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          Icon && <Icon aria-hidden className="size-6 text-ketchup" strokeWidth={1.75} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold leading-tight">
          {pick(item.name)}
          {item.popular && <PopularTag className="ml-2 align-[0.1em]" />}
        </h3>
        {meta && <p className="mt-1 text-sm text-muted-foreground">{meta}</p>}
      </div>
      <span className="type-wide tabular shrink-0 text-sm">{item.price} ₾</span>
      <AddButton itemId={item.id} />
    </li>
  )
}

function SectionHead({ id }: { id: CategoryId }) {
  const { pick } = useLang()
  const cat = categories.find((c) => c.id === id)!
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 border-b-2 border-tray pb-3">
      <h2 className="type-display text-[3rem] sm:text-[4.5rem]">{pick(cat.name)}</h2>
      {cat.note && <p className="max-w-sm pb-1 text-sm text-muted-foreground sm:text-right">{pick(cat.note)}</p>}
    </div>
  )
}

export function Menu() {
  const { t, pick } = useLang()
  const active = useActiveCategory()
  const byCat = (id: CategoryId) => items.filter((i) => i.cat === id)

  return (
    <section id="menu" aria-label={t("menu")} className="bg-counter text-tray">
      <nav className="sticky top-0 z-30 border-b border-tray/10 bg-counter/85 backdrop-blur-md">
        <ul className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 sm:px-4">
          {categories.map((c) => (
            <li key={c.id} className="shrink-0">
              <a
                href={`#${c.id}`}
                aria-current={active === c.id ? "true" : undefined}
                className={cn(
                  "relative block px-3 py-4 text-sm font-semibold transition-colors",
                  active === c.id ? "text-tray" : "text-tray/55 hover:text-tray",
                )}
              >
                {pick(c.name)}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-ketchup transition-transform duration-300",
                    active === c.id ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-6xl space-y-24 px-4 pb-28 pt-16 sm:px-6">
        <div id="burgers" className="scroll-mt-16">
          <SectionHead id="burgers" />
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {byCat("burgers").map((i) => (
              <BurgerCard key={i.id} item={i} />
            ))}
          </div>
        </div>

        <div id="combos" className="scroll-mt-16">
          <SectionHead id="combos" />
          <ComboBuilder />
        </div>

        <div className="grid gap-x-16 gap-y-24 lg:grid-cols-2">
          {(["bowls", "sides", "sauces", "drinks", "extras"] as const).map((id) => (
            <div key={id} id={id} className="scroll-mt-16">
              <SectionHead id={id} />
              <ul className="-mt-4">
                {byCat(id).map((i) => (
                  <Row key={i.id} item={i} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
