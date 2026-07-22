"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { WORKING_ON_PROJECTS } from "@/lib/workingOn";
import { cn } from "@/lib/cn";

const chip =
  "inline-flex items-center rounded-full border border-border bg-accent px-2.5 py-1 font-mono text-xs lowercase text-mint";

export default function WorkingOn() {
  if (WORKING_ON_PROJECTS.length === 0) return null;

  return (
    <section
      id="working-on"
      className="section-padding relative"
      aria-labelledby="working-on-heading"
    >
      <div className="container-wide relative">
        <div className="mb-10 flex flex-col gap-6 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label mb-3"><span className="mint">//</span> On the bench</p>
            <h2
              id="working-on-heading"
              className="text-4xl font-semibold lowercase leading-none tracking-tight text-foreground sm:text-5xl"
            >
              Working On
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Projects currently in motion — rough edges, active commits, real
            experiments.
          </p>
        </div>

        <ul className="grid gap-3">
          {WORKING_ON_PROJECTS.map((project, index) => {
            const primaryLink = project.links[0];
            return (
              <motion.li
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(index * 0.08, 0.24),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-mint hover:bg-surface-2"
              >
                <a
                  href={primaryLink?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid cursor-pointer grid-cols-[auto_1fr] items-start gap-x-5 gap-y-4 p-6 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-mint sm:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.1fr)_auto] sm:items-center sm:gap-x-8 sm:p-7"
                >
                  <span className="font-mono text-xs text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-2xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-mint sm:text-3xl">
                      {project.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.categories.map((category) => (
                        <span key={category} className={chip}>
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="col-span-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:col-span-1">
                    {project.description}
                  </p>

                  {primaryLink && (
                    <span
                      className={cn(
                        "col-span-2 inline-flex items-center gap-2 font-mono text-xs lowercase text-muted-foreground transition-colors group-hover:text-mint sm:col-span-1 sm:justify-self-end"
                      )}
                    >
                      <Github size={14} />
                      {primaryLink.label}
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  )}
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
