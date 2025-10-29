import Image from "next/image";

import {  HydrateClient } from "@/trpc/server";
import ProjectsGrid from "./_components/projects-grid";
import CreatorSection from "./_components/creator-section";
import MerchCarousel from "./_components/merch-carousel";


export default async function Home() {

  return (
    <HydrateClient>

      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-primary-800 to-primary-900 font-subhead text-headings py-20 gap-16">
     
        <section id="home"  className="container flex flex-col justify-center px-4 pt-16">
        <div className="w-full flex justify-center items-center flex-col gap-4">
          <Image className="logo-animation" alt="mio logo" width={225} height={225} src="/SVG/logo.svg" />
          <h1 className="text-5xl sm:text-[5rem] font-headline">Mio Mideal</h1>
        </div>
      </section>
      <section id="projects" className="container flex flex-col gap-8 px-4 py-8">  
          <h2 className="text-3xl underline underline-offset-8 font-headline font-extrabold text-highlight-cyan sm:text-[3rem]">PROJECTS</h2>
          <p className="font-text w-full max-w-md">
        At Mio Mideal, we champion creativity to master projects embodying excellence and bold innovation. Explore our work! We're happy to showcase expertise and impactful solutions with every piece of it.
          </p>
          <ProjectsGrid />
        </section>
      <section id="about" className="container flex flex-col gap-8 px-4 py-8">  
          <h2 className="text-3xl underline underline-offset-8 font-headline font-extrabold text-highlight-green sm:text-[3rem]">ABOUT</h2>
          <p className="font-text w-full max-w-md">
Innovation is our craft. Through creativity and collaboration, we shape ideas into experiences that inspire, engage, and already make a difference in real-world scenarios. Every project reflects our commitment to bold thinking, meticulous design, and a genuine passion for creating meaningful impact.
          </p>
          <CreatorSection />
        </section>
      <section id="merch" className="container flex flex-col gap-8 px-4 py-8">  
          <h2 className="text-3xl underline underline-offset-8 font-headline font-extrabold text-highlight-magenta sm:text-[3rem]">MERCH</h2>
          <p className="font-text w-full max-w-md">
          Step into the world of Mio Mideal with our exclusive merch! Designed with the same creativity and boldness that fuels our projects, each piece is a statement of innovation and style. Wear your passion for a better world and let our designs spark conversations wherever you go.
          </p>
          <div className="w-full">
          <MerchCarousel />
          </div>
        </section>
      </main>

    </HydrateClient>
  );
}
