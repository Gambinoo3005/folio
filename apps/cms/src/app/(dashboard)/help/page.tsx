import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, Book, MessageCircle, Mail, Video, FileText } from "lucide-react"

export default function Help() {
  return (
    <CmsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Get help with your portfolio CMS and find resources to make the most of your site.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Documentation
              </CardTitle>
              <CardDescription>
                Comprehensive guides and tutorials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">
                View Docs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Tutorials
              </CardTitle>
              <CardDescription>
                Step-by-step video guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">
                Watch Videos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Live Chat
              </CardTitle>
              <CardDescription>
                Get instant help from our team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Support
              </CardTitle>
              <CardDescription>
                Send us a detailed message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                FAQ
              </CardTitle>
              <CardDescription>
                Frequently asked questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">
                Browse FAQ
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Feature Requests
              </CardTitle>
              <CardDescription>
                Suggest new features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">
                Submit Request
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>
              Get up and running with your portfolio CMS in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent text-brand-accent-foreground text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Set up your profile</p>
                  <p className="text-sm text-muted-foreground">Add your personal information and bio</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent text-brand-accent-foreground text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Upload your work</p>
                  <p className="text-sm text-muted-foreground">Add projects, images, and media to showcase your skills</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent text-brand-accent-foreground text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Customize your pages</p>
                  <p className="text-sm text-muted-foreground">Edit your home, about, and contact pages</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent text-brand-accent-foreground text-sm font-medium">
                  4
                </div>
                <div>
                  <p className="font-medium">Go live</p>
                  <p className="text-sm text-muted-foreground">Publish your portfolio and share it with the world</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CmsLayout>
  )
}
