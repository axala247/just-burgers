import { useEffect, useRef, useState } from "react"
import { Check, Copy, Minus, Phone, Plus, ShoppingBag, X } from "lucide-react"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { itemById } from "@/data/menu"
import { PHONE_HREF, WOLT_URL } from "@/data/place"
import { useLang } from "@/lib/i18n"
import { useTray, type Line } from "@/lib/tray"
import { cn } from "@/lib/utils"

function useLineText() {
  const { pick } = useLang()
  return (l: Line) => {
    const item = itemById[l.itemId]
    const choices = [l.drinkId, l.sauceId].filter(Boolean).map((id) => pick(itemById[id!].name))
    return { name: pick(item.name), choices: choices.join(", "), total: item.price * l.qty }
  }
}

export function TrayDrawer() {
  const { t } = useLang()
  const { lines, total, count, open, setOpen, inc, dec, clear } = useTray()
  const lineText = useLineText()
  const [copied, setCopied] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // focus, Escape, scroll lock, and give focus back on close
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("button, a[href]")
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [open, setOpen])

  const copyOrder = async () => {
    const text = [
      "Just Burgers",
      ...lines.map((l) => {
        const x = lineText(l)
        return `${l.qty}× ${x.name}${x.choices ? ` (${x.choices})` : ""} — ${x.total} ₾`
      }),
      `${t("total")}: ${total} ₾`,
    ].join("\n")
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard blocked; nothing to do
    }
  }

  return (
    <>
      <div
        className="scrim fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
        data-open={open}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tray-title"
        data-open={open}
        className="drawer dark fixed inset-y-0 right-0 z-50 flex w-full max-w-[26rem] flex-col bg-tray text-cream shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
          <div>
            <h2 id="tray-title" className="type-display text-[2.4rem]">
              {t("trayTitle")}
            </h2>
            <p className="mt-2 text-sm text-cream/70">{t("trayHelp")}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("close")}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {count === 0 ? (
            <div className="grid h-full place-items-center pb-16 text-center">
              <div>
                <ShoppingBag className="mx-auto size-8 text-cream/40" strokeWidth={1.5} />
                <p className="mt-4 max-w-[22ch] text-cream/75">{t("trayEmpty")}</p>
                <a
                  href="#menu"
                  onClick={() => setOpen(false)}
                  className="mt-5 inline-block text-sm font-semibold underline decoration-neon decoration-2 underline-offset-4"
                >
                  {t("seeMenu")}
                </a>
              </div>
            </div>
          ) : (
            <ul>
              {lines.map((l) => {
                const x = lineText(l)
                return (
                  <li key={l.key} className="flex items-center gap-3 border-b border-white/10 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-tight">{x.name}</p>
                      {x.choices && <p className="mt-1 text-xs text-cream/60">{x.choices}</p>}
                    </div>
                    <div className="inline-flex h-9 items-center rounded-full bg-white/10">
                      <button
                        type="button"
                        onClick={() => dec(l.key)}
                        aria-label={t("remove", { name: x.name })}
                        className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-white/10"
                      >
                        <Minus className="size-3.5" strokeWidth={2.5} />
                      </button>
                      <span className="tabular min-w-4 text-center text-sm">{l.qty}</span>
                      <button
                        type="button"
                        onClick={() => inc(l.key)}
                        aria-label={t("add", { name: x.name })}
                        className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-white/10"
                      >
                        <Plus className="size-3.5" strokeWidth={2.5} />
                      </button>
                    </div>
                    <span className="type-wide tabular w-14 text-right text-sm">{x.total} ₾</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {count > 0 && (
          <div className="space-y-4 border-t border-white/10 px-6 pb-6 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="type-wide text-sm text-cream/70">{t("total")}</span>
              <span className="type-display tabular text-[2.4rem]">{total} ₾</span>
            </div>

            <LiquidButton
              size="xl"
              className="w-full rounded-full text-base font-semibold"
              onClick={() => window.open(WOLT_URL, "_blank", "noopener,noreferrer")}
            >
              {t("orderOnWolt")}
            </LiquidButton>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={PHONE_HREF}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-3 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                <Phone className="size-4" />
                <span className="truncate">{t("call")}</span>
              </a>
              <button
                type="button"
                onClick={copyOrder}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/20 px-3 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span aria-live="polite">{copied ? t("copied") : t("copyOrder")}</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 text-xs text-cream/55">
              <p>{t("trayNote")}</p>
              <button
                type="button"
                onClick={clear}
                className={cn("shrink-0 cursor-pointer underline underline-offset-2 hover:text-cream")}
              >
                {t("clear")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/** Sticky reminder at the bottom once something is in the order. */
export function OrderBar() {
  const { t } = useLang()
  const { count, total, open, setOpen, pulse } = useTray()
  const show = count > 0 && !open

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 transition-[transform,opacity] duration-300",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <button
        key={pulse}
        type="button"
        onClick={() => setOpen(true)}
        tabIndex={show ? 0 : -1}
        className="pop inline-flex h-14 cursor-pointer items-center gap-4 rounded-full bg-tray pl-5 pr-2 text-cream shadow-[0_12px_40px_-8px_rgb(0_0_0/0.55)]"
      >
        <span className="text-sm font-semibold">{t("viewOrder")}</span>
        <span className="text-sm text-cream/60">{count === 1 ? t("itemsOne") : t("itemsN", { n: count })}</span>
        <span className="type-wide tabular grid h-10 place-items-center rounded-full bg-neon px-4 text-sm text-tray">
          {total} ₾
        </span>
      </button>
    </div>
  )
}
