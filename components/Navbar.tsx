"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Github,
  Linkedin,
  Instagram,
  Mail,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const socialLinks = [
  { href: SITE.github, icon: Github, label: "GitHub" },
  { href: SITE.linkedin, icon: Linkedin, label: "LinkedIn" },
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
      className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Borna Logo"
              className="h-8 w-auto invert dark:invert-0"
            />
            <span className="font-semibold text-lg text-neutral-900 dark:text-white">
              Borna B. Afraz
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeSection === link.href
                    ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith("mailto")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="p-2.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
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
              className="md:hidden overflow-hidden border-t border-neutral-200/60 dark:border-neutral-800/60"
            >
              <div className="py-4 flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800",
                      activeSection === link.href && "font-medium text-neutral-900 dark:text-white"
                    )}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex gap-2 pt-2 mt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
                  {socialLinks.map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      {...(href.startsWith("mailto")
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="p-2.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
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
