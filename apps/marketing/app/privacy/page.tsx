import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { PrivacyPolicy } from "@/components/privacy-policy"

export const metadata = {
  title: "Privacy Policy - Portfolio CMS",
  description: "Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <main>
        <PrivacyPolicy />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
