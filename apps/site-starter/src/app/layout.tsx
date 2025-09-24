import type { Metadata } from "next";
import "./globals.css";
import { PreviewBadge } from "@/components/preview-badge";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Portfolio Site Starter",
  description: "A starter template for portfolio sites powered by the Folio CMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        {children}
        <PreviewBadge />
      </body>
    </html>
  );
}
