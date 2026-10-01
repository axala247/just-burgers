import { useEffect, useRef, useState } from "react"
import { ArrowDown, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { NeonSign, OpenStatus } from "@/components/NeonSign"
import { LangToggle } from "@/components/LangToggle"
import { AddButton } from "@/components/AddButton"
import { burgerList } from "@/data/menu"
import { useStatus } from "@/lib/hours"
import { useLang } from "@/lib/i18n"
import { useTray } from "@/lib/tray"
import { cn } from "@/lib/utils"

const AUTOPLAY_MS = 5200
const START = burgerList.findIndex((b) => b.id === "juicy-lucy")

export function Hero() {
  const { t, pick } = useLang()
  const status = useStatus()
  const { count, setOpen, pulse } = useTray()

  const [index, setIndex] = useState(START)
  const [auto, setAuto] = useState(true)
  const stageRef = useRef<HTMLDivElement>(null)
  const swipeX = useRef<number | null>(null)

  const burger = burgerList[index]
  const go = (dir: 1 | -1) => {
    setAuto(false)
    setIndex((i) => (i + dir + burgerList.length) % burgerList.length)
  }

  // Swap burgers on their own until someone touches the controls
  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    if (stageRef.current) io.observe(stageRef.current)
    const id = window.setInterval(() => {
      if (visible && !document.hidden) setIndex((i) => (i + 1) % burgerList.length)
    }, AUTOPLAY_MS)
    return () => {
      window.clearInterval(id)
      io.disconnect()
    }
  }, [auto])

  return (
    <section className="relative">
      <div className="dark wall grain relative isolate overflow-hidden text-cream">
        <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <a
            href="#visit"
            className="type-wide truncate text-[0.68rem] text-cream/80 transition-colors hover:text-cream"
          >
            {t("addressShort")}
          </a>
          <div className="flex shrink-0 items-center gap-2">
            <LangToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("orderCount", { n: count })}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-tray px-4 text-sm font-semibold text-cream transition-colors hover:bg-black"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">{t("order")}</span>
              <span
                key={pulse}
                className={cn(
                  "tabular grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs",
                  count ? "pop bg-neon text-tray" : "bg-white/10",
                )}
              >
                {count}
              </span>
            </button>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pt-8 text-center sm:pt-14">
          <NeonSign on={status.open} />
          <div className="mt-2 sm:mt-4">
            <OpenStatus status={status} />
          </div>
          <p className="mt-6 max-w-[26ch] text-balance text-lg leading-snug text-cream/90 sm:text-xl">
            {t("tagline")}
          </p>
          <LiquidButton
            size="xl"
            className="mt-7 rounded-full text-base font-semibold"
            onClick={() => document.getElementById("menu")?.scrollIntoView()}
          >
            <span className="flex items-center gap-2">
              {t("seeMenu")}
              <ArrowDown className="size-4" />
            </span>
          </LiquidButton>
        </div>

        {/* Live wall above, the real photo of the counter below */}
        <div
          ref={stageRef}
          className="stage z-0 -mt-10 sm:-mt-20 lg:-mt-32"
          role="group"
          aria-roledescription="carousel"
          aria-label={t("menu")}
          onPointerDown={(e) => (swipeX.current = e.clientX)}
          onPointerUp={(e) => {
            if (swipeX.current === null) return
            const dx = e.clientX - swipeX.current
            swipeX.current = null
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
          }}
        >
          <div aria-hidden className="stage-band" />
          <div className="stage-photo">
            {burgerList.map((b, i) => (
              <img
                key={b.id}
                src={b.img}
                alt={i === index ? pick(b.name) : ""}
                aria-hidden={i !== index}
                data-active={i === index}
                width={1200}
                height={675}
                draggable={false}
                loading={i === START ? "eager" : "lazy"}
                fetchPriority={i === START ? "high" : "low"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* What's on the counter right now */}
      <div className="counter-edge relative text-tray">
        <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 px-4 pb-12 pt-5 sm:grid-cols-[auto_1fr_auto] sm:px-6">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t("prevBurger")}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-tray/20 transition-colors hover:border-tray hover:bg-tray hover:text-cream"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t("nextBurger")}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-tray/20 transition-colors hover:border-tray hover:bg-tray hover:text-cream"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="min-w-0" aria-live="polite">
            <div className="flex items-baseline gap-3">
              <h2 className="type-display truncate text-[2rem] sm:text-[2.6rem]">{pick(burger.name)}</h2>
              <span className="type-wide tabular shrink-0 text-sm text-tray/60">
                {index + 1}/{burgerList.length}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-muted-foreground">
              {burger.desc && pick(burger.desc)}
            </p>
          </div>

          <div className="col-span-2 flex items-center justify-between gap-5 sm:col-span-1 sm:justify-end">
            <span className="type-wide tabular text-lg">{burger.price} ₾</span>
            <AddButton itemId={burger.id} label={t("addToOrder")} />
          </div>
        </div>
      </div>
    </section>
  )
}
