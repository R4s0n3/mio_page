"use client";
import {
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

export type ProjectItemProps = {
  id: number;
  name: string;
  url: string | null;
  image: string;
  isSelected?: boolean;
  onSelect?: () => void;
};

export default function ProjectItem(project: ProjectItemProps) {
  const Icon = project.onSelect
    ? InformationCircleIcon
    : ArrowTopRightOnSquareIcon;

  const handleClick = () => {
    if (project.onSelect) {
      project.onSelect();
      return;
    }

    window.open(project.url ?? "https://www.miomideal.com", "_blank");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={project.onSelect ? project.isSelected : undefined}
      className={`group relative flex aspect-video w-full cursor-pointer flex-row-reverse items-center justify-between rounded border-2 bg-secondary-800/20 p-4 text-left font-subhead text-2xl transition-all duration-500 hover:scale-105 hover:text-accent ${
        project.isSelected
          ? "border-highlight-cyan text-highlight-cyan"
          : "border-secondary-800/20"
      }`}
    >
      <h3 className="min-w-0 break-words pr-8 text-right leading-none">
        {project.name}
      </h3>
      <Icon className="absolute bottom-4 right-4 z-30 size-6" />
      <div className="relative size-14">
        <Image
          className="size-full object-contain"
          sizes="14rem"
          fill
          alt={project.name}
          src={project.image}
        />
      </div>
    </button>
  );
}
