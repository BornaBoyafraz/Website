import { Github } from "lucide-react";

import { Card } from "@/components/ui/card";
import { GlowingShadow } from "@/components/ui/glowing-shadow";
import { WORKING_ON_PROJECTS } from "@/lib/workingOn";
import { cn } from "@/lib/cn";
import { getCategoryBadgeClass } from "@/lib/projectCategory";

export default function WorkingOn() {
  if (WORKING_ON_PROJECTS.length === 0) return null;

  return (
    <section
      id="working-on"
      className="section-padding relative bg-transparent"
      aria-labelledby="working-on-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />
      <div className="container-wide relative">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Workshop shelf
            </p>
            <div className="h-1 w-28 timber-rule" />
          </div>
          <h2
            id="working-on-heading"
            className="font-serif text-3xl font-semibold tracking-normal text-foreground sm:text-4xl"
          >
            Working On
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WORKING_ON_PROJECTS.map((project, index) => (
            <article
              key={project.id}
              className={cn("h-full", index % 2 === 1 && "lg:translate-y-8")}
            >
              <GlowingShadow className="h-full">
                <Card className="washi-panel relative flex h-full flex-col overflow-hidden border-border p-6 transition-transform md:hover:-translate-y-1">
                  <span className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-primary" />
                  <span className="pointer-events-none absolute right-5 top-5 h-12 w-12 border-r border-t border-border" />
                  <div className="mb-4 flex flex-col gap-3 pl-2">
                    <h3 className="font-serif text-xl font-semibold leading-tight text-foreground">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.categories.map((category) => (
                        <span
                          key={category}
                          className={cn(
                            "inline-flex max-w-full items-center border px-2.5 py-1 text-xs font-semibold leading-tight",
                            getCategoryBadgeClass(category)
                          )}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mb-5 flex-1 pl-2 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pl-2">
                    {project.links.map((link) => (
                      <a
                        key={`${link.label}-${link.href}`}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-2 border border-primary px-4 py-2 text-sm font-medium",
                          "bg-primary text-primary-foreground transition-colors hover:brightness-95",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                        )}
                      >
                        <Github size={16} />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </Card>
              </GlowingShadow>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
