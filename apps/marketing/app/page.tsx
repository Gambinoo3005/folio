import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { HeroSection } from "@/components/hero-section"
import { SocialProofSection } from "@/components/social-proof-section"
import { ValuePropsSection } from "@/components/value-props-section"
import { ExplainerSection } from "@/components/explainer-section"
import { FeaturesSection } from "@/components/features-section"
import { FAQSection } from "@/components/faq-section"
import { FinalCTASection } from "@/components/final-cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <main>
        <HeroSection />
        <SocialProofSection />
        <ValuePropsSection />
        <ExplainerSection />
        <FeaturesSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
