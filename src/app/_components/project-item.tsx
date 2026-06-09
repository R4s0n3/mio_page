"use client";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export type ProjectItemProps = {
  id: number;
  name: string;
  url: string | null;
  image: string;
};

export default function ProjectItem(project: ProjectItemProps) {
  return (
    <div
      onClick={() =>
        window.open(project.url ?? "https://www.miomideal.com", "_blank")
      }
      className="group relative flex aspect-video w-full cursor-pointer flex-row-reverse items-center justify-between rounded border-2 border-secondary-800/20 bg-secondary-800/20 p-4 font-subhead text-2xl transition-all duration-500 hover:scale-105 hover:text-accent"
    >
      <h3>{project.name}</h3>
      <ArrowTopRightOnSquareIcon className="absolute bottom-4 right-4 z-30 size-6" />
      <div className="relative size-14">
        <Image
          className="size-full object-contain"
          sizes="14rem"
          fill
          alt={project.name}
          src={project.image}
        />
      </div>
    </div>
  );
}
