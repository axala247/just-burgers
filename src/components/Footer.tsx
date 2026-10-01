import { LangToggle } from "@/components/LangToggle"
import { FACEBOOK_URL, PHONE_DISPLAY, PHONE_HREF, WOLT_URL } from "@/data/place"
import { useLang } from "@/lib/i18n"

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="dark bg-tray text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-script text-5xl text-neon">Just Burgers</p>
          <p className="mt-3 text-sm text-cream/60">
            {t("address")} ·{" "}
            <a href={PHONE_HREF} className="tabular hover:text-cream">
              {PHONE_DISPLAY}
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm">
          <a href={WOLT_URL} target="_blank" rel="noreferrer" className="text-cream/75 hover:text-cream">
            Wolt
          </a>
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="text-cream/75 hover:text-cream">
            {t("facebook")}
          </a>
          <LangToggle className="bg-white/10" />
        </div>
      </div>
    </footer>
  )
}
