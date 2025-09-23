# Portfolio Building Service

A comprehensive platform for creating and managing bespoke portfolio websites with a content-only CMS. Built with Next.js, TypeScript, and modern web technologies.

## Overview

**Folio** is a bespoke portfolio website service that provides:
- **Custom portfolio websites** built by professionals
- **Content-only CMS** for safe, non-technical content editing
- **Invite-only access** with subscription tiers
- **Fast publishing** with live site updates within seconds

### Key Features

- **Bespoke Design**: Custom-built portfolios tailored to each client
- **Content-Only Editing**: Clients edit text and media without breaking design
- **Fast Publishing**: Changes appear on live sites within seconds
- **Secure Access**: Role-based permissions and invite-only system
- **Responsive**: Modern, mobile-first design
- **SEO Optimized**: Built-in SEO tools and best practices

## Architecture

This is a **monorepo** built with **Turborepo** and **pnpm**, containing:

### Applications
- **Marketing Site** (`apps/marketing`) - Public website at `folio.com`
- **CMS/API** (`apps/cms`) - Admin interface and content API at `app.folio.com`

### Packages (Planned)
- `@folio/site-core` - Shared design tokens and utilities
- `@folio/sections` - Reusable portfolio components
- `@folio/content` - Content management SDK
- `@folio/seo` - SEO utilities and helpers

## Technology Stack

### Frontend
- **Next.js 14/15** with App Router
- **React 18/19** with TypeScript 5
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend & Services
- **Clerk** for authentication and organizations
- **Prisma** with PostgreSQL (Neon)
- **Inngest** for background jobs and scheduling
- **Resend** for transactional emails
- **Cloudflare R2** for media storage
- **Cloudflare Images** for image optimization

### Development & Deployment
- **Turborepo** for monorepo management
- **pnpm** for package management
- **Vercel** for hosting and deployment
- **Doppler** for secrets management
- **Playwright** for E2E testing
- **ESLint** and **TypeScript** for code quality

## Getting Started

### Prerequisites

- **Node.js 20 LTS**
- **pnpm** (via Corepack)
- **Git**
- **Doppler CLI** (for secrets)
- **Vercel CLI** (optional, for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-building-service
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   From the repository root:
   ```bash
   # Marketing app
   doppler secrets download --project folio-platform --config dev --no-file --format=env > apps/marketing/.env.local
   
   # CMS app
   doppler secrets download --project folio-platform --config dev --no-file --format=env > apps/cms/.env.local
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Marketing site (port 3000)
   cd apps/marketing
   pnpm dev
   
   # Terminal 2 - CMS (port 3001)
   cd apps/cms
   pnpm dev
   ```

5. **Access the applications**
   - Marketing: http://localhost:3000
   - CMS: http://localhost:3001

## Project Structure

```
portfolio-building-service/
├── apps/
│   ├── marketing/          # Public marketing website
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── cms/               # Content management system
│       ├── src/
│       │   ├── app/       # Next.js app directory
│       │   ├── components/ # CMS components
│       │   ├── hooks/     # Custom hooks
│       │   └── lib/       # Utilities and adapters
│       ├── prisma/        # Database schema
│       └── tests/         # Playwright tests
├── packages/              # Shared packages (planned)
│   ├── content/          # Content SDK
│   ├── sections/         # Portfolio components
│   ├── seo/              # SEO utilities
│   └── site-core/        # Design tokens
├── docs/                 # Documentation
└── config files          # Turborepo, pnpm, etc.
```

## CMS Features

### Dashboard
- Quick actions for common tasks
- Recent edits and activity feed
- Usage statistics and health metrics
- Publishing status overview

### Content Management
- **Pages**: Singleton pages (Home, About, Contact)
- **Collections**: Repeatable content (Projects, Posts, Galleries)
- **Globals**: Site-wide settings (Navigation, Footer, SEO defaults)

### Editor Experience
- **Rich Text Editor**: Constrained, semantic content editing
- **Live Preview**: Real-time preview of changes
- **Media Library**: Drag-and-drop uploads with alt text requirements
- **SEO Panel**: Meta tags, social media, and search optimization
- **Version History**: Track and restore previous versions
- **Scheduling**: Publish content at specific times

### Publishing
- **Draft → Publish**: Simple publishing workflow
- **Cache Invalidation**: Automatic cache refresh on publish
- **Redirects**: Manage URL changes and redirects
- **Export**: Download content and media

## Authentication & Roles

### User Roles
- **Owner**: Billing, plan management, full access
- **Admin**: User management, content types, full content access
- **Editor**: Content creation, editing, and publishing
- **Contributor**: Draft creation and editing only
- **Viewer**: Read-only access to admin

### Security Features
- **Clerk Authentication**: Secure, cross-subdomain sessions
- **Role-based Access**: Granular permissions per role
- **Content Sanitization**: Strict HTML whitelist for rich text
- **Rate Limiting**: API and upload protection
- **Audit Logging**: Track all user actions

## Subscription Tiers

### Care (Base)
- 1 seat, 5 GB media storage
- 5 versions retained per entry
- 2 scheduled publishes per month
- 1 webhook, 100 submissions per month
- Email support (48-72h)

### Care+
- 2 seats, 15 GB media storage
- 20 versions retained
- 10 scheduled publishes per month
- 3 webhooks, 500 submissions per month
- Faster support response

### Studio
- 4 seats, 50 GB media storage
- 100 versions retained
- 40 scheduled publishes per month
- 10 webhooks, 2000 submissions per month
- Monthly strategy call included

## Testing

### Available Scripts

```bash
# Run all tests
pnpm test

# Run tests for specific app
cd apps/cms && pnpm test

# Run tests with UI
cd apps/cms && pnpm test:ui

# Run accessibility tests
cd apps/cms && pnpm test:accessibility
```

### Test Coverage
- **Smoke Tests**: Basic functionality verification
- **Accessibility Tests**: WCAG 2.2 AA compliance
- **E2E Tests**: Complete user workflows
- **Unit Tests**: Component and utility testing

## Deployment

### Environments
- **Development**: Local development with hot reload
- **Staging**: `staging.folio.com` and `staging.app.folio.com`
- **Production**: `folio.com` and `app.folio.com`

### Deployment Process
1. **Code Push**: Changes trigger automatic builds
2. **Environment Sync**: Doppler secrets sync to Vercel
3. **Database Migrations**: Prisma migrations run automatically
4. **Health Checks**: Automated testing and monitoring

### Domains
- **Marketing**: `folio.com`
- **CMS**: `app.folio.com`
- **API**: `api.folio.com` (alias to CMS)
- **CDN**: `cdn.folio.com`
- **Help**: `help.folio.com`

## Performance & Monitoring

### Performance Targets
- **Publish to Live**: < 30 seconds (p95)
- **API Response**: < 300ms (p95)
- **Lighthouse Score**: ≥ 90 (Performance), ≥ 95 (Accessibility)

### Monitoring Stack
- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Web vitals and user analytics
- **Axiom**: Structured logging and metrics
- **Instatus**: Public status page and uptime monitoring

## Development

### Code Quality
- **ESLint**: Code linting with Next.js rules
- **TypeScript**: Type safety and IntelliSense
- **Prettier**: Code formatting (configured)
- **Husky**: Git hooks for quality gates

### Development Workflow
1. **Feature Branch**: Create feature branch from main
2. **Development**: Make changes with hot reload
3. **Testing**: Run tests and quality checks
4. **Review**: Create pull request for review
5. **Deploy**: Merge to main triggers deployment

### Environment Management
- **Doppler**: Centralized secrets management
- **Vercel**: Environment variable sync
- **Local Development**: `.env.local` files for development

## Documentation

- [Local Development Guide](local_dev.md)
- [Product Requirements Document](folio_v_1_product_requirements_document_prd.md)
- [Tech Stack Overview](folio_full_tech_stack_master.md)
- [Client Provisioning Spec](CLIENT_PROVISIONING_SPEC.md)
- [CMS Setup Guide](apps/cms/README_CMS_SETUP.md)

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure accessibility compliance
- Update documentation as needed
- Follow the existing code style

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Email**: Contact support at support@folio.com
- **Status**: Check our [status page](https://status.folio.com)

## Roadmap

### V1 (Current)
- Core CMS functionality
- Authentication and roles
- Content editing and publishing
- Media management
- SEO tools

### V2 (Planned)
- Internationalization
- Approval workflows
- Theme customization
- Advanced analytics
- Plugin marketplace

---

**Built for creators who want beautiful portfolios without the complexity.**
