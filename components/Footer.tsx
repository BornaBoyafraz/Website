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
      className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
                "p-2.5 rounded-lg text-muted-foreground",
                "hover:text-accent-foreground hover:bg-accent transition-transform duration-200 hover:scale-110",
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
