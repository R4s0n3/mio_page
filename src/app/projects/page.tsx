import { type Metadata } from "next";

import { HydrateClient } from "@/trpc/server";
import ProjectsPageView from "./projects-page-view";

export const metadata: Metadata = {
  title: "Projects | Mio Mideal",
  description: "Public projects by Mio Mideal.",
};

export default async function ProjectsPage() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-primary-800 to-primary-900 py-20 font-subhead text-headings">
        <section className="container flex flex-col gap-8 px-4 pt-16">
          <div className="flex flex-col gap-4">
            <h1 className="font-headline text-5xl font-extrabold text-highlight-cyan underline underline-offset-8 sm:text-[5rem]">
              PROJECTS
            </h1>
            <p className="w-full max-w-2xl font-text">
              Explore the public projects from Mio Mideal, from recent releases
              to earlier work shaped by design, technology, and creative
              collaboration.
            </p>
          </div>
          <ProjectsPageView />
        </section>
      </main>
    </HydrateClient>
  );
}
