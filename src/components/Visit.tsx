import { ArrowUpRight, MapPin, Phone, Star } from "lucide-react"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { OpenStatus } from "@/components/NeonSign"
import { DIRECTIONS_URL, FACEBOOK_URL, MAP_EMBED_URL, PHONE_DISPLAY, PHONE_HREF, PLUS_CODE, reviews, WOLT_URL } from "@/data/place"
import { useStatus } from "@/lib/hours"
import { useLang } from "@/lib/i18n"

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <span key={i} className="relative size-5">
            <Star className="absolute inset-0 size-5 text-cream/25" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-5 text-cream" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        )
      })}
    </div>
  )
}

export function Visit() {
  const { t } = useLang()
  const status = useStatus()

  return (
    <section id="visit" className="dark wall grain relative isolate overflow-hidden text-cream">
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        {/* Reviews */}
        <div className="grid gap-12 lg:grid-cols-[0.8fr_2fr] lg:gap-16">
          <div>
            <p className="type-display tabular text-[6rem] sm:text-[8rem]">4.6</p>
            <div className="mt-3">
              <Stars value={4.6} />
            </div>
            <p className="type-wide mt-3 text-xs text-cream/75">
              {t("reviewsCount")} · Google
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            {reviews.map((r) => (
              <figure key={r.author} className="border-t border-cream/25 pt-6">
                <blockquote lang="en" className="text-xl leading-snug text-balance sm:text-2xl">
                  “{r.text}”
                </blockquote>
                <figcaption className="type-wide mt-5 text-xs text-cream/70">
                  {r.author} · {t("reviewSource")}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Visit */}
        <div className="mt-28 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="type-display text-[3.5rem] sm:text-[5rem]">{t("visitTitle")}</h2>

            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="type-wide text-xs text-cream/60">{t("hours")}</dt>
                <dd className="mt-2 text-lg">
                  {t("everyDay")} <span className="tabular">14:00–01:00</span>
                </dd>
                <dd className="mt-3">
                  <OpenStatus status={status} />
                </dd>
              </div>
              <div>
                <dt className="type-wide text-xs text-cream/60">{t("phone")}</dt>
                <dd className="mt-2 text-lg">
                  <a href={PHONE_HREF} className="tabular inline-flex items-center gap-2 hover:underline">
                    <Phone className="size-4" />
                    {PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="sr-only">{t("addressLabel")}</dt>
                <dd className="flex items-start gap-2 text-lg">
                  <MapPin className="mt-1.5 size-4 shrink-0" />
                  <span>
                    {t("address")}
                    <span className="block text-sm text-cream/60">{PLUS_CODE}</span>
                  </span>
                </dd>
              </div>
            </dl>

            <ul className="mt-8 flex flex-wrap gap-2 text-sm">
              {[t("dineIn"), t("delivery"), t("perPerson"), t("lgbt")].map((tag) => (
                <li key={tag} className="rounded-full border border-cream/25 px-3.5 py-1.5">
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <LiquidButton
                size="xl"
                className="rounded-full text-base font-semibold"
                onClick={() => window.open(DIRECTIONS_URL, "_blank", "noopener,noreferrer")}
              >
                {t("directions")}
              </LiquidButton>
              <a
                href={WOLT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
              >
                {t("orderOnWolt")}
                <ArrowUpRight className="size-4" />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
              >
                {t("facebook")}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="relative min-h-80 overflow-hidden rounded-[1.5rem] bg-tray lg:min-h-0">
            <iframe
              title="Map: Just Burgers, 2 Roman Miminoshvili St, Tbilisi"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0 [filter:grayscale(1)_contrast(1.05)_brightness(0.95)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
