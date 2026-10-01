import { useLang } from "@/lib/i18n"
import type { Status } from "@/lib/hours"

/** The wall sign. Lit only while the restaurant is open (Tbilisi time). */
export function NeonSign({ on }: { on: boolean }) {
  return (
    <div className="relative isolate" data-on={on}>
      <span aria-hidden className="neon-halo" />
      <h1 className="neon" aria-label="Just Burgers">
        <span aria-hidden className="neon-layer neon-tube">
          <span>Just</span>
          <span className="neon-bar" />
          <span>Burgers</span>
        </span>
        <span aria-hidden className="neon-layer neon-lit">
          <span>Just</span>
          <span className="neon-bar" />
          <span>
            Bur<span className="neon-flick">g</span>ers
          </span>
        </span>
      </h1>
    </div>
  )
}

export function OpenStatus({ status }: { status: Status }) {
  const { t } = useLang()
  const label = !status.open
    ? t("closedOpensAt")
    : status.minsToClose !== null
      ? t("closesIn", { n: status.minsToClose })
      : t("openUntil")

  return (
    <div className="flex items-center gap-3" data-on={status.open}>
      <span aria-hidden className="open-sign type-wide">
        <span className="open-tube">{t("signOpen")}</span>
        <span className="open-lit">{t("signOpen")}</span>
      </span>
      <p className="type-wide text-[0.72rem] text-cream/85" role="status">
        {label}
      </p>
    </div>
  )
}
