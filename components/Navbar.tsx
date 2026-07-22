"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Instagram, Mail } from "lucide-react";
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
  { href: SITE.mailto, icon: Mail, label: "Email me" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
      role="banner"
    >
      <nav
        className="container-wide flex h-[72px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-0"
        aria-label="Main navigation"
      >
        <a
          href="#home"
          className="group flex shrink-0 cursor-pointer items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-mint"
          aria-label="Borna B. Afraz — home"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface font-mono text-xs font-semibold text-mint transition-colors group-hover:border-mint">
            BA
          </span>
          <span className="hidden text-sm font-medium tracking-tight text-foreground sm:inline">
            Borna B. Afraz
          </span>
        </a>

        <div className="hidden items-center rounded-full border border-border bg-surface p-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 font-mono text-xs lowercase transition-colors",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-mint",
                activeSection === link.href
                  ? "bg-elevated text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={activeSection === link.href ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center justify-end gap-0.5 lg:flex">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              {...(href.startsWith("mailto")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-mint focus:outline-none focus-visible:ring-1 focus-visible:ring-mint"
              aria-label={label}
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:border-mint hover:text-mint focus:outline-none focus-visible:ring-1 focus-visible:ring-mint md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-background backdrop-blur-xl md:hidden"
          >
            <div className="container-wide flex flex-col px-5 py-5 sm:px-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "cursor-pointer border-b border-border py-3.5 font-mono text-sm lowercase transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-mint",
                    activeSection === link.href
                      ? "text-mint"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-5 flex gap-2">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    {...(href.startsWith("mailto")
                      ? {}
                      : { target: "_blank", rel: "noopener noreferrer" })}
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-mint hover:text-mint focus:outline-none focus-visible:ring-1 focus-visible:ring-mint"
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
    </header>
  );
}
