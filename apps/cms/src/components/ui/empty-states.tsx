import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  FolderOpen, 
  Image, 
  Plus, 
  Upload, 
  Settings, 
  BarChart3,
  Globe,
  Send,
  HelpCircle,
  ArrowRight,
  Sparkles
} from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  icon: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  action, 
  secondaryAction 
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
        <CardDescription className="text-muted-foreground mb-6 max-w-sm">
          {description}
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button onClick={action.onClick} variant={action.variant || "default"}>
              {action.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="outline">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Specific empty states for different sections
export function EmptyDashboard() {
  return (
    <EmptyState
      title="Welcome to your CMS"
      description="Get started by creating your first page or adding some content to showcase your work."
      icon={<Sparkles className="h-8 w-8 text-muted-foreground" />}
      action={{
        label: "Create your first page",
        onClick: () => console.log("Navigate to create page"),
        variant: "default"
      }}
      secondaryAction={{
        label: "View documentation",
        onClick: () => console.log("Open docs")
      }}
    />
  )
}

export function EmptyPages() {
  return (
    <EmptyState
      title="No pages yet"
      description="Create your first page to get started. Pages are the main sections of your portfolio like Home, About, and Contact."
      icon={<FileText className="h-8 w-8 text-muted-foreground" />}
      action={{
        label: "Create a page",
        onClick: () => console.log("Navigate to create page"),
        variant: "default"
      }}
      secondaryAction={{
        label: "Learn about pages",
        onClick: () => console.log("Open docs")
      }}
    />
  )
}

export function EmptyCollections({ collectionType }: { collectionType: string }) {
  const getCollectionInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case 'projects':
        return {
          title: "No projects yet",
          description: "Showcase your work by adding projects. Include details about your role, the problem you solved, and the results achieved.",
          icon: <FolderOpen className="h-8 w-8 text-muted-foreground" />,
          actionLabel: "Add your first project"
        }
      case 'posts':
        return {
          title: "No blog posts yet",
          description: "Share your thoughts and expertise by writing blog posts. This helps establish your authority in your field.",
          icon: <FileText className="h-8 w-8 text-muted-foreground" />,
          actionLabel: "Write your first post"
        }
      case 'galleries':
        return {
          title: "No galleries yet",
          description: "Create photo galleries to showcase your visual work. Perfect for photographers, artists, and designers.",
          icon: <Image className="h-8 w-8 text-muted-foreground" />,
          actionLabel: "Create your first gallery"
        }
      default:
        return {
          title: `No ${collectionType} yet`,
          description: `Start building your ${collectionType.toLowerCase()} collection to showcase your work.`,
          icon: <FolderOpen className="h-8 w-8 text-muted-foreground" />,
          actionLabel: `Add your first ${collectionType.toLowerCase().slice(0, -1)}`
        }
    }
  }

  const info = getCollectionInfo(collectionType)

  return (
    <EmptyState
      title={info.title}
      description={info.description}
      icon={info.icon}
      action={{
        label: info.actionLabel,
        onClick: () => console.log(`Navigate to create ${collectionType.toLowerCase()}`),
        variant: "default"
      }}
      secondaryAction={{
        label: "View examples",
        onClick: () => console.log("Open examples")
      }}
    />
  )
}

export function EmptyMediaLibrary() {
  return (
    <EmptyState
      title="No media files yet"
      description="Upload images, documents, and other files to use in your portfolio. All files are automatically optimized for web."
      icon={<Image className="h-8 w-8 text-muted-foreground" />}
      action={{
        label: "Upload files",
        onClick: () => console.log("Open upload dialog"),
        variant: "default"
      }}
      secondaryAction={{
        label: "Learn about file types",
        onClick: () => console.log("Open docs")
      }}
    />
  )
}

export function EmptyAnalytics() {
  return (
    <EmptyState
      title="No analytics data yet"
      description="Once your site is live and receiving traffic, you'll see detailed analytics about your visitors and popular content."
      icon={<BarChart3 className="h-8 w-8 text-muted-foreground" />}
      action={{
        label: "View site settings",
        onClick: () => console.log("Navigate to settings"),
        variant: "outline"
      }}
      secondaryAction={{
        label: "Learn about analytics",
        onClick: () => console.log("Open docs")
      }}
    />
  )
}

export function EmptySubmissions() {
  return (
    <EmptyState
      title="No submissions yet"
      description="When visitors use your contact forms or submission features, their messages will appear here for you to review and respond to."
      icon={<Send className="h-8 w-8 text-muted-foreground" />}
      action={{
        label: "Set up contact forms",
        onClick: () => console.log("Navigate to forms"),
        variant: "outline"
      }}
      secondaryAction={{
        label: "View form settings",
        onClick: () => console.log("Navigate to settings")
      }}
    />
  )
}

export function EmptyDomains() {
  return (
    <EmptyState
      title="No custom domains yet"
      description="Connect your own domain to make your portfolio truly yours. You can use domains you already own or purchase new ones."
      icon={<Globe className="h-8 w-8 text-muted-foreground" />}
      action={{
        label: "Add a domain",
        onClick: () => console.log("Navigate to add domain"),
        variant: "default"
      }}
      secondaryAction={{
        label: "Learn about domains",
        onClick: () => console.log("Open docs")
      }}
    />
  )
}

export function EmptyGlobals() {
  return (
    <EmptyState
      title="Global settings not configured"
      description="Set up your site-wide settings like navigation, footer content, social links, and SEO defaults."
      icon={<Settings className="h-8 w-8 text-muted-foreground" />}
      action={{
        label: "Configure settings",
        onClick: () => console.log("Navigate to settings"),
        variant: "default"
      }}
      secondaryAction={{
        label: "View all settings",
        onClick: () => console.log("Navigate to all settings")
      }}
    />
  )
}

export function EmptyHelp() {
  return (
    <EmptyState
      title="Need help getting started?"
      description="Browse our documentation, watch video tutorials, or get in touch with our support team for personalized assistance."
      icon={<HelpCircle className="h-8 w-8 text-muted-foreground" />}
      action={{
        label: "Browse documentation",
        onClick: () => console.log("Open docs"),
        variant: "default"
      }}
      secondaryAction={{
        label: "Contact support",
        onClick: () => console.log("Open support")
      }}
    />
  )
}

// Loading state component
export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        </div>
        <CardTitle className="text-xl font-semibold mb-2">{message}</CardTitle>
        <CardDescription className="text-muted-foreground">
          Please wait while we load your content...
        </CardDescription>
      </CardContent>
    </Card>
  )
}

// Error state component
export function ErrorState({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading your content. Please try again.",
  onRetry
}: { 
  title?: string
  description?: string
  onRetry?: () => void 
}) {
  return (
    <Card className="border-destructive/20">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <div className="h-8 w-8 text-destructive">⚠️</div>
        </div>
        <CardTitle className="text-xl font-semibold mb-2 text-destructive">{title}</CardTitle>
        <CardDescription className="text-muted-foreground mb-6 max-w-sm">
          {description}
        </CardDescription>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
