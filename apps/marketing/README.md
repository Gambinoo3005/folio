# Marketing Site - Standalone

This is a standalone version of the marketing site extracted from the portfolio-building-service monorepo.

## Features

- Modern Next.js 14 with App Router
- Tailwind CSS v4 with custom theme
- Dark/Light mode support
- Responsive design
- Contact form
- Pricing page
- Work showcase
- Privacy policy and Terms of service

## Getting Started

1. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server on port 3000
- `npm run lint` - Run ESLint

## Project Structure

```
marketing-site-standalone/
├── app/                    # Next.js app directory
│   ├── contact/           # Contact page
│   ├── pricing/           # Pricing page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   ├── work/              # Work showcase
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── ...                   # Configuration files
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icon library

## Deployment

This site can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **DigitalOcean App Platform**

For Vercel deployment:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## Customization

The site uses a green color palette with dark/light theme support. You can customize:

- Colors in `app/globals.css`
- Content in the component files
- Styling with Tailwind classes
- Images in the `public/` directory

## License

This project is part of the portfolio-building-service and follows the same license terms.
