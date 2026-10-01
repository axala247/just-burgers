import { useLang, type Lang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const options: { id: Lang; label: string; full: string }[] = [
  { id: "ka", label: "ქარ", full: "ქართული" },
  { id: "en", label: "EN", full: "English" },
]

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang()
  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn("inline-flex h-10 items-center rounded-full bg-black/25 p-1 text-xs font-semibold", className)}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          lang={o.id}
          aria-label={o.full}
          aria-pressed={lang === o.id}
          onClick={() => setLang(o.id)}
          className={cn(
            "h-8 cursor-pointer rounded-full px-3 transition-colors",
            lang === o.id ? "bg-cream text-tray" : "text-cream/75 hover:text-cream",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
