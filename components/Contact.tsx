import { SITE } from "@/lib/constants";

export default function Contact() {
  const contactLinks = [
    { href: SITE.github, label: "GitHub" },
    { href: SITE.linkedin, label: "LinkedIn" },
    { href: SITE.x, label: "X" },
    { href: SITE.instagram, label: "Instagram" },
    {
      href: SITE.mailto,
      label: "Gmail",
    },
  ];

  return (
    <section
      id="contact"
      className="section-padding relative bg-transparent"
      aria-labelledby="contact-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />
      <div className="mx-auto max-w-3xl px-4 text-center">
        <div className="mx-auto mb-6 h-1 w-32 timber-rule" />
        <h2
          id="contact-heading"
          className="font-serif text-3xl font-semibold tracking-normal text-foreground sm:text-4xl"
        >
          Stay in touch with me
        </h2>

        <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
          I am always excited to connect, collaborate, and explore new opportunities.
          Whether you have a project in mind, an idea to build, or just want to talk
          about technology, I would be happy to hear from you.
          <br />
          <br />
          I may not be a coffee person, but I am always ready to stay focused and
          work alongside you as long as it takes to get the job done.
          <br />
          <br />
          Feel free to reach out through any of the platforms below.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {contactLinks.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background sm:text-base"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
