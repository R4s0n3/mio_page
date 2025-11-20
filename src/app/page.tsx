import Image from "next/image";

import { HydrateClient } from "@/trpc/server";
import ProjectsGrid from "./_components/projects-grid";
import CreatorSection from "./_components/creator-section";
import MerchCarousel from "./_components/merch-carousel";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center gap-16 bg-gradient-to-b from-primary-800 to-primary-900 py-20 font-subhead text-headings">
        <section
          id="home"
          className="container flex flex-col justify-center px-4 pt-16"
        >
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Image
              className="logo-animation"
              alt="mio logo"
              width={225}
              height={225}
              src="/SVG/logo.svg"
            />
            <h1 className="font-headline text-5xl sm:text-[5rem]">
              Mio Mideal
            </h1>
          </div>
        </section>
        <section
          id="projects"
          className="container flex flex-col gap-8 px-4 py-8"
        >
          <h2 className="font-headline text-3xl font-extrabold text-highlight-cyan underline underline-offset-8 sm:text-[3rem]">
            PROJECTS
          </h2>
          <p className="w-full max-w-md font-text">
            At Mio Mideal, we champion creativity to master projects embodying
            excellence and bold innovation. Explore our work! We&apos;re happy
            to showcase expertise and impactful solutions with every piece of
            it.
          </p>
          <ProjectsGrid />
        </section>
        <section id="about" className="container flex flex-col gap-8 px-4 py-8">
          <h2 className="font-headline text-3xl font-extrabold text-highlight-green underline underline-offset-8 sm:text-[3rem]">
            ABOUT
          </h2>
          <p className="w-full max-w-md font-text">
            Innovation is our craft. Through creativity and collaboration, we
            shape ideas into experiences that inspire, engage, and already make
            a difference in real-world scenarios. Every project reflects our
            commitment to bold thinking, meticulous design, and a genuine
            passion for creating meaningful impact.
          </p>
          <CreatorSection />
        </section>
        <section id="merch" className="container flex flex-col gap-8 px-4 py-8">
          <h2 className="font-headline text-3xl font-extrabold text-highlight-magenta underline underline-offset-8 sm:text-[3rem]">
            MERCH
          </h2>
          <p className="w-full max-w-md font-text">
            This isn&#39;t really about merch. It&#39;s about that thin layer
            between creating for love and creating to stay afloat. We put our
            ideas on fabric and paper, not because that&#39;s truly what we
            believe in, but to keep our mission alive.
          </p>
          <div className="w-full">
            <MerchCarousel />
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
