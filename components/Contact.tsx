import { SITE } from "@/lib/constants";

export default function Contact() {
  const contactLinks = [
    { href: SITE.github, label: "GitHub" },
    { href: SITE.linkedin, label: "LinkedIn" },
    { href: SITE.instagram, label: "Instagram" },
    { href: SITE.x, label: "X" },
    {
      href: "mailto:bornaboyafraz@gmail.com?subject=Contact%20from%20Portfolio",
      label: "Gmail",
    },
  ];

  return (
    <section
      id="contact"
      className="section-padding bg-white dark:bg-neutral-900/50"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2
          id="contact-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          Stay in touch with me
        </h2>

        <p className="mt-6 text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
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
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm sm:text-base font-medium text-neutral-900 dark:text-white transition-colors hover:border-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
