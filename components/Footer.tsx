"use client";

import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/cn";
import XTwitterIcon from "./icons/XTwitterIcon";

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

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border bg-muted px-4 py-8 sm:px-6 lg:px-8"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-muted-foreground text-sm">
          © {year} Borna B. Afraz
        </p>
        <div className="flex gap-2">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              {...(href.startsWith("mailto")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className={cn(
                "p-2.5 text-muted-foreground",
                "transition-colors hover:bg-accent hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              )}
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
