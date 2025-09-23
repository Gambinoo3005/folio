import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Folio CMS - Portfolio Content Management",
  description: "Manage your portfolio content with ease",
  generator: "Folio CMS",
  openGraph: {
    title: "Folio CMS - Portfolio Content Management",
    description: "Manage your portfolio content with ease",
    type: "website",
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const theme = localStorage.getItem('theme');
                    
                    // Default to dark theme for auth pages unless explicitly set to light
                    if (theme === 'light') {
                      document.documentElement.classList.remove('dark');
                    } else {
                      // Default to dark theme for all other cases
                      document.documentElement.classList.add('dark');
                    }
                  } catch (e) {
                    // Fallback to dark theme if there's any error
                    document.documentElement.classList.add('dark');
                  }
                })();
              `,
            }}
          />
        </head>
        <body className={`font-sans ${geistSans.variable} ${geistMono.variable} ${inter.variable} ${manrope.variable} antialiased dark`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={true}
          >
            <Suspense fallback={null}>{children}</Suspense>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
