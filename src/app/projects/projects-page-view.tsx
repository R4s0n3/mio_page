"use client";

import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useMemo, useState } from "react";

import LoadingSpinner from "../_components/loading-spinner";
import ProjectItem from "../_components/project-item";
import { api, type RouterOutputs } from "@/trpc/react";

type Project = RouterOutputs["project"]["getAllPublic"][number];

const fallbackImage = "/SVG/logo.svg";

export default function ProjectsPageView() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const { data: projects, isLoading } = api.project.getAllPublic.useQuery();

  const selectedProject = useMemo(
    () => projects?.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const handleSelectProject = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const handleCloseProject = () => {
    setSelectedProjectId(null);
  };

  if (isLoading) return <LoadingSpinner />;

  if (!projects?.length) {
    return (
      <div className="rounded border-2 border-secondary-800/30 bg-secondary-800/20 p-6 font-text text-body">
        No public projects are available right now.
      </div>
    );
  }

  return (
    <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            id={project.id}
            name={project.name}
            url={project.url}
            image={normalizeImage(project)}
            isSelected={selectedProjectId === project.id}
            onSelect={() => handleSelectProject(project.id)}
          />
        ))}
      </div>

      {selectedProject ? (
        <aside className="fixed inset-x-4 top-10 z-40 flex max-h-[45vh] flex-col gap-4 overflow-y-auto rounded-b border-2 border-secondary-800/30 bg-primary-900/95 p-5 shadow-2xl lg:sticky lg:inset-x-auto lg:top-20 lg:z-auto lg:h-fit lg:max-h-none lg:min-h-64 lg:gap-5 lg:overflow-visible lg:rounded lg:bg-secondary-800/20 lg:p-6 lg:shadow-none">
          <div className="flex items-center justify-between gap-4">
            <p className="font-subhead text-sm uppercase text-highlight-cyan">
              Project info
            </p>
            <button
              type="button"
              aria-label="Close project info"
              onClick={handleCloseProject}
              className="rounded p-1 text-headings transition duration-300 hover:bg-secondary-800/60 hover:text-accent"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>
          <>
            <h2 className="font-headline text-4xl text-headings">
              {selectedProject.name}
            </h2>
            <p className="whitespace-pre-line font-text text-base leading-7 text-body">
              {getProjectDescription(selectedProject)}
            </p>
            {selectedProject.url ? (
              <Link
                className="mt-2 inline-flex w-fit items-center gap-2 font-subhead text-lg uppercase text-highlight-cyan underline underline-offset-4 transition duration-300 hover:text-accent"
                href={selectedProject.url}
                target="_blank"
                rel="noreferrer"
              >
                Open project
                <ArrowTopRightOnSquareIcon className="size-5" />
              </Link>
            ) : null}
          </>
        </aside>
      ) : null}
    </div>
  );
}

function normalizeImage(project: Project) {
  const image = project.image?.trim() ?? "";

  if (image.length > 0) return image;

  return fallbackImage;
}

function getProjectDescription(project: Project) {
  const description = project.content?.trim() ?? "";

  if (description.length > 0) return description;

  return "No project description is available yet.";
}
