"use client";
import { api } from "@/trpc/react";
import { isTappenProject, tappenCopy } from "@/content/tappen-update";
import ProjectItem from "./project-item";
import LoadingSpinner from "./loading-spinner";

export default function ProjectsGrid() {
  const { data: projects, isLoading } = api.project.getFeatured.useQuery();

  function createProjectItem(project: {
    id: number;
    name: string;
    url: string | null;
    image: string | null;
  }) {
    const actualImage = project.image ?? "/SVG/logo.svg";

    const projectItem = {
      ...project,
      image: actualImage === "" ? "/SVG/logo.svg" : actualImage,
      badge: isTappenProject(project) ? tappenCopy.de.badge : undefined,
    };

    return <ProjectItem key={project.id} {...projectItem} />;
  }
  if (isLoading) return <LoadingSpinner />;

  const featured = [...(projects ?? [])].sort(byTappenFirst);

  return (
    <div className="flex w-full flex-col">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featured.map(createProjectItem)}
      </div>
    </div>
  );
}

function byTappenFirst(
  a: { name: string; url: string | null },
  b: { name: string; url: string | null },
) {
  return Number(isTappenProject(b)) - Number(isTappenProject(a));
}
