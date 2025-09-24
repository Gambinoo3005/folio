import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Navigation, Square, Share2 } from "lucide-react"
import Link from "next/link"

export default function Globals() {
  return (
    <CmsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Globals</h1>
          <p className="text-muted-foreground">
            Manage site-wide settings and content that appears across your entire site.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Navigation
              </CardTitle>
              <CardDescription>
                Main site navigation menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/globals/navigation/edit">
                  Edit Navigation
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Square className="h-5 w-5" />
                Footer
              </CardTitle>
              <CardDescription>
                Footer content and links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/globals/footer/edit">
                  Edit Footer
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Social Links
              </CardTitle>
              <CardDescription>
                Social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/globals/social/edit">
                  Edit Social Links
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO Defaults
              </CardTitle>
              <CardDescription>
                Default SEO settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/globals/seo_defaults/edit">
                  Edit SEO Defaults
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </CmsLayout>
  )
}
