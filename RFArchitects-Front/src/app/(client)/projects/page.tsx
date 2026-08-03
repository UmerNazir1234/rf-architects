import { fetchProjects } from "@/lib/api";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Projects - RF Architects",
  description: "A showcase of our passion for design, innovation, and craftsmanship.",
};

export default async function ProjectsPage() {
  const projects = await fetchProjects();

  return <ProjectsClient initialProjects={projects || []} />;
}
