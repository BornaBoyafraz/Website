"use client";

import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/cn";

const socialLinks = [
  { href: SITE.github, icon: Github, label: "GitHub" },
  { href: SITE.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: SITE.instagram, icon: Instagram, label: "Instagram" },
  {
    href: SITE.mailto,
    icon: Mail,
    label: "Send email to Borna via Gmail",
    display: "Gmail",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-8 px-4 sm:px-6 lg:px-8 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/50"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          © {year} Borna B. Afraz
        </p>
        <div className="flex gap-2">
          {socialLinks.map(({ href, icon: Icon, label, display }) => (
            <a
              key={label}
              href={href}
              {...(href.startsWith("mailto")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className={cn(
                "p-2.5 rounded-lg text-neutral-500 dark:text-neutral-400",
                "hover:text-neutral-900 dark:hover:text-white hover:underline hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
              )}
              aria-label={label}
            >
              {display ?? <Icon size={18} />}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
