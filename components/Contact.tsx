import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function Contact() {
  const contactLinks = [
    { href: SITE.github, label: "GitHub" },
    { href: SITE.linkedin, label: "LinkedIn" },
    { href: SITE.x, label: "X" },
    { href: SITE.instagram, label: "Instagram" },
    { href: SITE.mailto, label: "Gmail" },
  ];

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden border-t border-border bg-surface"
      aria-labelledby="contact-heading"
    >
      <span className="pointer-events-none absolute inset-x-0 top-8 select-none text-center font-mono text-[20vw] font-semibold leading-none tracking-[-0.08em] text-mint opacity-[0.025]">
        HELLO
      </span>

      <div className="container-wide relative">
        <div className="mb-12 flex items-center gap-5">
          <span className="mono-label"><span className="mint">//</span> 03 — Contact</span>
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-xs lowercase text-faint">
            Let&rsquo;s talk
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <div>
            <h2
              id="contact-heading"
              className="max-w-2xl text-[3rem] font-semibold leading-[0.96] tracking-tight text-foreground sm:text-7xl lg:text-[5rem]"
            >
              Stay in touch with <span className="text-mint">me.</span>
            </h2>

            <a
              href={SITE.mailto}
              className="link-underline mt-10 inline-flex cursor-pointer items-center gap-3 font-mono text-base text-foreground transition-colors hover:text-mint focus:outline-none focus-visible:ring-1 focus-visible:ring-mint sm:text-lg"
            >
              {SITE.email}
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>

          <div className="flex flex-col justify-between gap-10 rounded-xl border border-border bg-background p-6 sm:p-8">
            <p className="max-w-md text-base leading-8 text-muted-foreground">
              I am always excited to connect, collaborate, and explore new
              opportunities. Whether you have a project in mind, an idea to
              build, or just want to talk about technology, I would be happy to
              hear from you.
              <br />
              <br />
              I may not be a coffee person, but I am always ready to stay focused
              and work alongside you as long as it takes to get the job done.
              <br />
              <br />
              Feel free to reach out through any of the platforms below.
            </p>

            <div className="flex flex-col border-t border-border">
              {contactLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="group flex cursor-pointer items-center justify-between border-b border-border py-4 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-mint"
                >
                  <span className="text-base font-medium text-foreground transition-colors group-hover:text-mint">
                    {label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-mint" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
