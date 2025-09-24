import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-muted-foreground">
            <p>Or try one of these:</p>
            <div className="mt-2 space-x-4">
              <Link href="/projects" className="hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
