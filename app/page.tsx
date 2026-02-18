import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { getProjects } from "@/lib/projects";

export default async function Home() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let error: string | undefined;

  try {
    projects = await getProjects();
  } catch {
    error = "Failed to load projects from GitHub.";
  }

  return (
    <>
      <Hero />
      <About />
      <Projects initialProjects={projects} error={error} />
      <Contact />
    </>
  );
}
