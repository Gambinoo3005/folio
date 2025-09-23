import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { WorkShowcase } from "@/components/work-showcase"

export const metadata = {
  title: "Work - Portfolio CMS",
  description: "Explore our portfolio of bespoke websites crafted for creative professionals.",
}

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <main>
        <WorkShowcase />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
