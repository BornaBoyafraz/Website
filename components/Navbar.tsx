"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Menu,
  X,
  Github,
  Linkedin,
  Instagram,
  Mail,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/cn";
import XTwitterIcon from "./icons/XTwitterIcon";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const socialLinks = [
  { href: SITE.github, icon: Github, label: "GitHub" },
  { href: SITE.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: SITE.x, icon: XTwitterIcon, label: "X" },
  { href: SITE.instagram, icon: Instagram, label: "Instagram" },
  {
    href: SITE.mailto,
    icon: Mail,
    label: "Email me",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    const sections = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="fixed left-0 right-0 top-3 z-50 px-3"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-6xl overflow-hidden border border-border bg-card shadow-[0_10px_30px_rgba(32,28,23,0.08)] backdrop-blur-xl dark:shadow-black/30">
        <div className="h-1 timber-rule" />
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Borna Logo"
              width={32}
              height={32}
              className="h-8 w-auto invert dark:invert-0"
            />
            <span className="truncate font-serif text-lg font-semibold text-foreground">
              Borna B. Afraz
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                  activeSection === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith("mailto")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2.5 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border md:hidden"
            >
              <div className="flex flex-col gap-0.5 px-4 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground",
                      activeSection === link.href &&
                        "font-medium bg-accent text-accent-foreground"
                    )}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-2 flex gap-2 border-t border-border pt-2">
                  {socialLinks.map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      {...(href.startsWith("mailto")
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label={label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
