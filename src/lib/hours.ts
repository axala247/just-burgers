import { useEffect, useState } from "react"

// Every day 14:00–01:00, Tbilisi time (from the Wolt listing).
// CLOSE is past midnight, so it is written as minutes after the opening day's 00:00.
export const OPEN_MIN = 14 * 60
export const CLOSE_MIN = 25 * 60
const CLOSING_SOON_MIN = 45

export type Status = { open: boolean; minsToClose: number | null }

function tbilisiMinutes(d: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tbilisi",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d)
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0)
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0)
  return h * 60 + m
}

export function getStatus(d = new Date()): Status {
  let m = tbilisiMinutes(d)
  // 00:00–01:00 still belongs to the previous day's service
  if (m + 24 * 60 < CLOSE_MIN) m += 24 * 60
  const open = m >= OPEN_MIN && m < CLOSE_MIN
  const left = CLOSE_MIN - m
  return { open, minsToClose: open && left <= CLOSING_SOON_MIN ? left : null }
}

/** `?neon=on` / `?neon=off` forces the sign, for previewing both states. */
function override(): boolean | null {
  const v = new URLSearchParams(window.location.search).get("neon")
  return v === "on" ? true : v === "off" ? false : null
}

export function useStatus() {
  const [status, setStatus] = useState<Status>(() => getStatus())

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getStatus()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const forced = override()
  return forced === null ? status : { open: forced, minsToClose: null }
}
