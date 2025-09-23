import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

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

export default function RootLayout({
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
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    
                    // Only apply dark theme if explicitly set to 'dark' or 'system' with dark preference
                    if (theme === 'dark' || (theme === 'system' && prefersDark)) {
                      document.documentElement.classList.add('dark');
                    } else {
                      // Default to light theme for all other cases
                      document.documentElement.classList.remove('dark');
                    }
                  } catch (e) {
                    // Fallback to light theme if there's any error
                    document.documentElement.classList.remove('dark');
                  }
                })();
              `,
            }}
          />
        </head>
        <body className={`font-sans ${geistSans.variable} ${geistMono.variable} ${inter.variable} ${manrope.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            disableTransitionOnChange={false}
          >
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
