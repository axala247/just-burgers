# Just Burgers

Website for Just Burgers, 2 Roman Miminoshvili St, Tbilisi.

## Run it

```bash
npm install
npm run dev
```

Build for hosting with `npm run build` (output in `dist/`).

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, and the shadcn project layout:

- `components.json`: shadcn config, so `npx shadcn@latest add <component>` drops components in the right place
- `src/components/ui/`: shadcn-style primitives. `liquid-glass-button.tsx` (`LiquidButton`, `MetalButton`, `Button`) lives here. shadcn's CLI and its copy-paste components import from `@/components/ui/...`, so keeping primitives in this folder means new ones work without editing import paths.
- `src/lib/utils.ts`: the `cn()` helper every shadcn component expects
- `@/*` path alias maps to `src/*` (see `tsconfig.json` and `vite.config.ts`)

## What's where

| File | What it holds |
| --- | --- |
| `src/data/menu.ts` | Every menu item, price, and photo, in Georgian and English |
| `src/data/place.ts` | Phone, Wolt link, map coordinates, reviews |
| `src/lib/hours.ts` | Opening hours (14:00–01:00, Tbilisi time) that drive the neon sign |
| `src/lib/i18n.tsx` | All interface text in Georgian and English |
| `public/menu/` | Product photos |

## Features

- **Live neon sign**: the "Just Burgers" sign lights up (with a flicker) only while the restaurant is open, based on Tbilisi time. Add `?neon=on` or `?neon=off` to the URL to preview either state.
- **Counter carousel**: all burger photos share the same wall, counter and tray, so the hero cross-fades between them and only the burger appears to change. Swipe on mobile.
- **Combo builder**: pick a burger, soda, and sauce; a receipt shows the price bought separately vs. as a combo.
- **Order tray**: build an order, then open Wolt, call, or copy the order as text. Saved in the browser between visits.
- **Georgian / English**: auto-detected from the browser, switchable in the header and footer.
