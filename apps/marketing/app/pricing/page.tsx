import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { PricingSection } from "@/components/pricing-section"

export const metadata = {
  title: "Pricing - Portfolio CMS",
  description: "Transparent pricing for portfolios that grow with your ambitions. Choose your creative path.",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <main>
        <PricingSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
