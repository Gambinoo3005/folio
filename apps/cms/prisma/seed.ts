import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Your actual Clerk Organization and User IDs
  const DEV_ORG_ID = 'org_334PmoIzvWOkyJAnp5tiPU0R6gs'
  const DEV_USER_ID = 'user_334PmfkESpGCeUsSPVgqRBHmHOb' // dev@example.com

  // Create Tenant (Clerk Organization)
  const tenant = await prisma.tenant.upsert({
    where: { id: DEV_ORG_ID },
    update: {},
    create: {
      id: DEV_ORG_ID,
      name: 'Dev Org (Folio)',
    },
  })
  console.log('✅ Created tenant:', tenant.name)

  // Create User (Clerk User)
  const user = await prisma.user.upsert({
    where: { id: DEV_USER_ID },
    update: {},
    create: {
      id: DEV_USER_ID,
      email: 'dev@example.com',
    },
  })
  console.log('✅ Created user:', user.email)

  // Create Membership (User belongs to Tenant)
  const membership = await prisma.membership.upsert({
    where: {
      userId_tenantId: {
        userId: DEV_USER_ID,
        tenantId: DEV_ORG_ID,
      },
    },
    update: {},
    create: {
      userId: DEV_USER_ID,
      tenantId: DEV_ORG_ID,
      role: 'OWNER',
    },
  })
  console.log('✅ Created membership with role:', membership.role)

  // Create Home Page
  const homePage = await prisma.page.upsert({
    where: {
      tenantId_slug: {
        tenantId: DEV_ORG_ID,
        slug: 'home',
      },
    },
    update: {},
    create: {
      tenantId: DEV_ORG_ID,
      title: 'Home',
      slug: 'home',
      status: 'DRAFT',
      body: {
        blocks: [
          {
            type: 'hero',
            content: {
              title: 'Welcome to Your Portfolio',
              subtitle: 'Showcase your work and tell your story',
              cta: 'View My Work',
            },
          },
          {
            type: 'text',
            content: {
              text: 'This is your homepage content. Edit this to tell your story and showcase your work.',
            },
          },
        ],
      },
      seoTitle: 'Home - Your Portfolio',
      seoDescription: 'Welcome to my portfolio. Discover my work and learn about my journey.',
      updatedBy: DEV_USER_ID,
    },
  })
  console.log('✅ Created page:', homePage.title)

  // Create Projects Collection
  const projectsCollection = await prisma.collection.upsert({
    where: {
      tenantId_slug: {
        tenantId: DEV_ORG_ID,
        slug: 'projects',
      },
    },
    update: {},
    create: {
      tenantId: DEV_ORG_ID,
      name: 'Projects',
      slug: 'projects',
      config: {
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
          {
            name: 'description',
            type: 'textarea',
            required: true,
          },
          {
            name: 'technologies',
            type: 'array',
            items: { type: 'text' },
          },
          {
            name: 'featuredImage',
            type: 'media',
            required: false,
          },
          {
            name: 'liveUrl',
            type: 'url',
            required: false,
          },
          {
            name: 'githubUrl',
            type: 'url',
            required: false,
          },
        ],
      },
    },
  })
  console.log('✅ Created collection:', projectsCollection.name)

  // Create a sample Project Item
  const sampleProject = await prisma.item.upsert({
    where: {
      tenantId_collectionId_slug: {
        tenantId: DEV_ORG_ID,
        collectionId: projectsCollection.id,
        slug: 'sample-portfolio-website',
      },
    },
    update: {},
    create: {
      tenantId: DEV_ORG_ID,
      collectionId: projectsCollection.id,
      title: 'Sample Portfolio Website',
      slug: 'sample-portfolio-website',
      status: 'DRAFT',
      content: {
        title: 'Sample Portfolio Website',
        description: 'A modern, responsive portfolio website built with Next.js and Tailwind CSS. Features include dark mode, smooth animations, and a clean, professional design.',
        technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        featuredImage: null,
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/example/portfolio',
      },
      seo: {
        title: 'Sample Portfolio Website - My Projects',
        description: 'A modern portfolio website showcasing my development skills and design aesthetic.',
      },
    },
  })
  console.log('✅ Created project item:', sampleProject.title)

  // Create Navigation Global
  const navigationGlobal = await prisma.global.upsert({
    where: {
      tenantId_key: {
        tenantId: DEV_ORG_ID,
        key: 'navigation',
      },
    },
    update: {},
    create: {
      tenantId: DEV_ORG_ID,
      key: 'navigation',
      data: {
        main: [
          {
            label: 'Home',
            href: '/',
            type: 'page',
            pageSlug: 'home',
          },
          {
            label: 'About',
            href: '/about',
            type: 'page',
            pageSlug: 'about',
          },
          {
            label: 'Projects',
            href: '/projects',
            type: 'collection',
            collectionSlug: 'projects',
          },
          {
            label: 'Contact',
            href: '/contact',
            type: 'page',
            pageSlug: 'contact',
          },
        ],
        footer: [
          {
            label: 'Privacy Policy',
            href: '/privacy',
            type: 'page',
            pageSlug: 'privacy',
          },
          {
            label: 'Terms of Service',
            href: '/terms',
            type: 'page',
            pageSlug: 'terms',
          },
        ],
      },
    },
  })
  console.log('✅ Created global:', navigationGlobal.key)

  console.log('🎉 Database seed completed successfully!')
  console.log('\n📝 Next steps:')
  console.log('1. Replace the placeholder Clerk Org ID and User ID in this seed file with your actual IDs')
  console.log('2. Run "pnpm db:seed" to apply the seed data')
  console.log('3. Run "pnpm db:studio" to view the seeded data')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
