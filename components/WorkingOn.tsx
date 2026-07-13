import { Github } from "lucide-react";

import { Card } from "@/components/ui/card";
import { GlowingShadow } from "@/components/ui/glowing-shadow";
import { WORKING_ON_PROJECTS } from "@/lib/workingOn";
import { cn } from "@/lib/cn";
import { getCategoryBadgeClass } from "@/lib/projectCategory";

export default function WorkingOn() {
  return (
    <section
      id="working-on"
      className="section-padding bg-transparent"
      aria-labelledby="working-on-heading"
    >
      <div className="container-wide">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="working-on-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Working On
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WORKING_ON_PROJECTS.map((project) => (
            <article key={project.id} className="h-full">
              <GlowingShadow className="h-full rounded-lg">
                <Card className="flex h-full flex-col p-6 transition-shadow md:hover:shadow-lg dark:md:hover:shadow-neutral-900/50">
                  <div className="mb-3 flex flex-col gap-3">
                    <h3 className="text-lg font-semibold leading-tight text-foreground">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.categories.map((category) => (
                        <span
                          key={category}
                          className={cn(
                            "inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-tight",
                            getCategoryBadgeClass(category)
                          )}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.links.map((link) => (
                      <a
                        key={`${link.label}-${link.href}`}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
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
