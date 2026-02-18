import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import AlwaysMovingBackground from "@/components/AlwaysMovingBackground";
import ParticleNetworkBackground from "@/components/ParticleNetworkBackground";
import "./globals.css";

const themeInitScript = `
(() => {
  try {
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (savedTheme !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch {}
})();
`;

export const metadata: Metadata = {
  title: "Hi, I am Borna",
  icons: {
    icon: [{ url: "/favicon-ba.svg?v=3", type: "image/svg+xml" }],
    shortcut: "/favicon-ba.svg?v=3",
    apple: "/favicon-ba.svg?v=3",
  },
  description:
    "Python Developer specializing in Machine Learning, Game Development, and Algorithms. Building practical software with a VibeCoding approach.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AlwaysMovingBackground />
          <ParticleNetworkBackground />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
