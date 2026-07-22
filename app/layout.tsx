import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

const SITE_URL = "https://bornaba.com";
const SITE_TITLE = "Borna B. Afraz — Software Developer";
const SITE_DESCRIPTION =
  "Python Developer specializing in Machine Learning, Game Development, and Algorithms. Building practical software with a VibeCoding approach.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [{ url: "/pictures/icon.png", type: "image/png" }],
    shortcut: [{ url: "/pictures/icon.png", type: "image/png" }],
    apple: [{ url: "/pictures/icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Borna Afraz",
    description:
      "Developer portfolio showcasing AI tools, Python projects, and game development.",
    url: "https://bornaba.com",
    siteName: "Borna Afraz",
    images: [
      {
        url: "https://bornaba.com/og.png",
        width: 1200,
        height: 630,
        alt: "Borna Afraz Portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Borna Afraz",
    description:
      "Developer portfolio showcasing AI tools, Python projects, and game development.",
    images: ["https://bornaba.com/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>
          <div className="grain-overlay" aria-hidden="true" />
          <div className="relative z-10">
            <Navbar />
            <main>{children}</main>
            <Footer />
            <BackToTop />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
