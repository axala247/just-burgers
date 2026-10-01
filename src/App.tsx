import { Hero } from "@/components/Hero"
import { Menu } from "@/components/Menu"
import { Visit } from "@/components/Visit"
import { Footer } from "@/components/Footer"
import { OrderBar, TrayDrawer } from "@/components/TrayDrawer"
import { LangProvider } from "@/lib/i18n"
import { TrayProvider } from "@/lib/tray"

export default function App() {
  return (
    <LangProvider>
      <TrayProvider>
        <main>
          <Hero />
          <Menu />
          <Visit />
        </main>
        <Footer />
        <OrderBar />
        <TrayDrawer />
      </TrayProvider>
    </LangProvider>
  )
}
