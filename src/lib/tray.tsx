import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react"
import { itemById } from "@/data/menu"

export type Line = {
  key: string
  itemId: string
  qty: number
  /** Combo choices */
  drinkId?: string
  sauceId?: string
}

type Action =
  | { type: "add"; itemId: string; drinkId?: string; sauceId?: string }
  | { type: "dec"; key: string }
  | { type: "inc"; key: string }
  | { type: "clear" }

const lineKey = (itemId: string, drinkId?: string, sauceId?: string) =>
  [itemId, drinkId, sauceId].filter(Boolean).join("|")

function reducer(lines: Line[], a: Action): Line[] {
  switch (a.type) {
    case "add": {
      const key = lineKey(a.itemId, a.drinkId, a.sauceId)
      const hit = lines.find((l) => l.key === key)
      if (hit) return lines.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l))
      return [...lines, { key, itemId: a.itemId, qty: 1, drinkId: a.drinkId, sauceId: a.sauceId }]
    }
    case "inc":
      return lines.map((l) => (l.key === a.key ? { ...l, qty: l.qty + 1 } : l))
    case "dec":
      return lines.flatMap((l) => (l.key !== a.key ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []))
    case "clear":
      return []
  }
}

const STORAGE_KEY = "jb-tray-v1"

function load(): Line[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Line[]) : []
    return Array.isArray(parsed) ? parsed.filter((l) => itemById[l.itemId] && l.qty > 0) : []
  } catch {
    return []
  }
}

type Ctx = {
  lines: Line[]
  count: number
  total: number
  qtyOf: (itemId: string) => number
  add: (itemId: string, choices?: { drinkId?: string; sauceId?: string }) => void
  inc: (key: string) => void
  dec: (key: string) => void
  clear: () => void
  open: boolean
  setOpen: (open: boolean) => void
  /** Bumps on every add, so the order button can react */
  pulse: number
}

const TrayContext = createContext<Ctx | null>(null)

export function TrayProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, undefined, load)
  const [open, setOpen] = useState(false)
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // storage unavailable
    }
  }, [lines])

  const add = useCallback<Ctx["add"]>((itemId, choices) => {
    dispatch({ type: "add", itemId, ...choices })
    setPulse((p) => p + 1)
  }, [])
  const inc = useCallback((key: string) => dispatch({ type: "inc", key }), [])
  const dec = useCallback((key: string) => dispatch({ type: "dec", key }), [])
  const clear = useCallback(() => dispatch({ type: "clear" }), [])

  const value = useMemo<Ctx>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const total = lines.reduce((n, l) => n + l.qty * itemById[l.itemId].price, 0)
    return {
      lines,
      count,
      total,
      qtyOf: (itemId) => lines.filter((l) => l.itemId === itemId).reduce((n, l) => n + l.qty, 0),
      add,
      inc,
      dec,
      clear,
      open,
      setOpen,
      pulse,
    }
  }, [lines, add, inc, dec, clear, open, pulse])

  return <TrayContext.Provider value={value}>{children}</TrayContext.Provider>
}

export function useTray() {
  const ctx = useContext(TrayContext)
  if (!ctx) throw new Error("useTray must be used inside TrayProvider")
  return ctx
}

export { lineKey }
