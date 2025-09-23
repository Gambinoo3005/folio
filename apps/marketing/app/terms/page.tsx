import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { TermsOfService } from "@/components/terms-of-service"

export const metadata = {
  title: "Terms of Service - Portfolio CMS",
  description: "Read our terms and conditions for using Portfolio CMS services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <main>
        <TermsOfService />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
