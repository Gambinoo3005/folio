import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ContactSection } from "@/components/contact-section"

export const metadata = {
  title: "Contact - Portfolio CMS",
  description:
    "Ready to bring your creative vision to life? Get in touch and let's start building your dream portfolio.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <main>
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
