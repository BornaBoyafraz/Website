"use client";

import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";
import XTwitterIcon from "./icons/XTwitterIcon";

const socialLinks = [
  { href: SITE.github, icon: Github, label: "GitHub" },
  { href: SITE.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: SITE.x, icon: XTwitterIcon, label: "X" },
  { href: SITE.instagram, icon: Instagram, label: "Instagram" },
  { href: SITE.mailto, icon: Mail, label: "Email me" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-border bg-background px-5 pb-10 pt-14 sm:px-8 lg:px-12"
      role="contentinfo"
    >
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-8 pb-12 sm:flex-row sm:items-end">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Borna B. Afraz
            </p>
            <p className="mt-3 font-mono text-xs text-mint">
              Software Developer — Python · ML · Games
            </p>
          </div>
          <a
            href={SITE.mailto}
            className="link-underline cursor-pointer font-mono text-sm text-muted-foreground transition-colors hover:text-mint focus:outline-none focus-visible:ring-1 focus-visible:ring-mint"
          >
            {SITE.email}
          </a>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-faint">
            © {year} Borna B. Afraz — All rights reserved
          </p>
          <div className="flex gap-1">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith("mailto")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-surface hover:text-mint focus:outline-none focus-visible:ring-1 focus-visible:ring-mint"
                aria-label={label}
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
