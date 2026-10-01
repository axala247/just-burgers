import { Minus, Plus } from "lucide-react"
import { itemById } from "@/data/menu"
import { useLang } from "@/lib/i18n"
import { useTray } from "@/lib/tray"
import { cn } from "@/lib/utils"

type Props = {
  itemId: string
  /** Show a text label next to the plus when nothing is in the order yet */
  label?: string
  className?: string
}

/** "+" that turns into a stepper once the item is in the order. */
export function AddButton({ itemId, label, className }: Props) {
  const { t, pick } = useLang()
  const { qtyOf, add, dec } = useTray()
  const qty = qtyOf(itemId)
  const name = pick(itemById[itemId].name)

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => add(itemId)}
        aria-label={t("add", { name })}
        className={cn(
          "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-tray text-cream transition-[transform,background-color] duration-200 hover:bg-ketchup active:scale-95",
          label ? "px-5 text-sm font-semibold" : "w-10",
          className,
        )}
      >
        <Plus className="size-4" strokeWidth={2.5} />
        {label && <span>{label}</span>}
      </button>
    )
  }

  return (
    <div
      className={cn(
        "inline-flex h-10 shrink-0 items-center rounded-full bg-tray text-cream",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => dec(itemId)}
        aria-label={t("remove", { name })}
        className="grid size-10 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/10"
      >
        <Minus className="size-4" strokeWidth={2.5} />
      </button>
      <span className="tabular min-w-5 text-center text-sm font-semibold" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => add(itemId)}
        aria-label={t("add", { name })}
        className="grid size-10 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/10"
      >
        <Plus className="size-4" strokeWidth={2.5} />
      </button>
    </div>
  )
}
