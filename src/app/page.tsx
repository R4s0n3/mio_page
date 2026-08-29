import Image from "next/image";
import Link from "next/link";

import { HydrateClient } from "@/trpc/server";
import ProjectsGrid from "./_components/projects-grid";
import CreatorSection from "./_components/creator-section";
import MerchCarousel from "./_components/merch-carousel";
import SponsorSpot from "./_components/sponsor-spot";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center gap-16 bg-gradient-to-b from-primary-800 to-primary-900 py-20 font-subhead text-headings">
        <section
          id="home"
          className="container flex flex-col justify-center gap-12 px-4 pt-16"
        >
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Image
              className="logo-animation size-56"
              alt="mio logo"
              width={225}
              height={225}
              src="/SVG/logo.svg"
            />
            <h1 className="font-headline text-5xl sm:text-[5rem]">
              Mio Mideal
            </h1>
          </div>
          <div id="sponsors" className="w-full scroll-mt-24">
            <SponsorSpot placement="HERO_BILLBOARD" variant="billboard" />
            <p className="mx-auto mt-2 max-w-xl text-center font-text text-[10px] uppercase tracking-[0.12em] text-body/35">
              Sponsor perk · Every sponsor gets a little Mio mystery care
              package. We&apos;ll email you after checkout to arrange the
              surprise.
            </p>
          </div>
        </section>
        <section
          id="projects"
          className="container flex flex-col gap-8 px-4 py-8"
        >
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_21rem]">
            <div className="flex flex-col gap-8">
              <h2 className="font-headline text-3xl font-extrabold text-highlight-cyan underline underline-offset-8 sm:text-[3rem]">
                FEATURED PROJECTS
              </h2>
              <p className="w-full max-w-md font-text">
                At Mio Mideal, we champion creativity to master projects
                embodying excellence and bold innovation. Explore our work!
                We&apos;re happy to showcase expertise and impactful solutions
                with every piece of it.
              </p>
            </div>
            <SponsorSpot placement="PROJECTS_CORNER" variant="corner" />
          </div>
          <ProjectsGrid />
          <SponsorSpot placement="PROJECTS_STRIP" variant="strip" />
          <Link
            className="w-fit font-subhead text-xl uppercase text-highlight-cyan underline underline-offset-4 transition duration-300 hover:text-accent"
            href="/projects"
          >
            View all projects
          </Link>
        </section>
        <section id="about" className="container flex flex-col gap-8 px-4 py-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
            <div className="flex flex-col gap-8">
              <h2 className="font-headline text-3xl font-extrabold text-highlight-green underline underline-offset-8 sm:text-[3rem]">
                ABOUT
              </h2>
              <p className="w-full max-w-md font-text">
                Innovation is our craft. Through creativity and collaboration,
                we shape ideas into experiences that inspire, engage, and
                already make a difference in real-world scenarios. Every project
                reflects our commitment to bold thinking, meticulous design, and
                a genuine passion for creating meaningful impact.
              </p>
            </div>
            <SponsorSpot placement="ABOUT_SIDECAR" variant="sidecar" />
          </div>
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
          <SponsorSpot placement="MERCH_BANNER" variant="banner" />
          <div className="w-full">
            <MerchCarousel />
          </div>
        </section>
        <section className="container flex justify-end px-4 pb-4 pt-8">
          <div className="w-full sm:max-w-sm">
            <SponsorSpot placement="FOOTER_STAMP" variant="stamp" />
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
