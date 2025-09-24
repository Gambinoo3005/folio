import { getClient } from '@portfolio-building-service/site-core'

export async function Navigation() {
  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE!,
    siteId: process.env.SITE_ID!,
  })

  try {
    const navigation = await client.globals.get('navigation')
    
    if (!navigation?.data) {
      return <DefaultNavigation />
    }

    const navData = navigation.data

    return (
      <nav className="bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <a href="/" className="text-xl font-bold text-foreground">
                {navData.siteName || 'Portfolio'}
              </a>
              
              {navData.links && Array.isArray(navData.links) && (
                <div className="hidden md:flex space-x-6">
                  {navData.links.map((link: any, index: number) => (
                    <a
                      key={index}
                      href={link.url}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  } catch (error) {
    console.error('Navigation error:', error)
    return <DefaultNavigation />
  }
}

function DefaultNavigation() {
  return (
    <nav className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold text-foreground">
              Portfolio
            </a>
            
            <div className="hidden md:flex space-x-6">
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </a>
              <a href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </a>
              <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
