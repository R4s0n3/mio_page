import Image from "next/image";

import { api, HydrateClient } from "@/trpc/server";
import ProjectsGrid from "./_components/projects-grid";
import CreatorSection, { type CreatorItemType } from "./_components/creator-section";
import MerchCarousel from "./_components/merch-carousel";


export default async function Home() {
  const projects = await api.project.getLatest()
  const creators = await api.contact.getCreators()
  const products = await api.product.getMerch()


  const creatorsItems:CreatorItemType[] = creators.map(p => ({
    sig: p.user.sig,
    name: p.user.name,
    title: p.user.title,
    email: p.email,
    youtube: p.youtube,
    instagram: p.instagram,
    twitter: p.twitter,
    tiktok: p.tiktok,
    reddit: p.reddit,
    twitch: p.twitch,
  }))
  
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
        At Mio Mideal, we champion creativity through curated projects that embody excellence and bold innovation. Explore our work, showcasing expertise and impactful solutions.
          </p>
          <ProjectsGrid projects={projects.map(p => ({id:p.id, name:p.name, url: p.url ?? "", image:p.image ?? "" }))} />
        </section>
      <section id="about" className="container flex flex-col gap-8 px-4 py-8">  
          <h2 className="text-3xl underline underline-offset-8 font-headline font-extrabold text-highlight-green sm:text-[3rem]">ABOUT</h2>
          <p className="font-text w-full max-w-md">
          At Mio Mideal, we’re a dynamic team on a mission to make the world better through bold, innovative projects. With a passion for creativity and a touch of entertainment, we blend problem-solving with joy to craft impactful solutions. Join us in redefining innovation—one exciting idea at a time!
          </p>
          <CreatorSection creators={creatorsItems} />
        </section>
      <section id="merch" className="container flex flex-col gap-8 px-4 py-8">  
          <h2 className="text-3xl underline underline-offset-8 font-headline font-extrabold text-highlight-magenta sm:text-[3rem]">MERCH</h2>
          <p className="font-text w-full max-w-md">
          Step into the world of Mio Mideal with our exclusive merch! Designed with the same creativity and boldness that fuels our projects, each piece is a statement of innovation and style. Wear your passion for a better world and let our designs spark conversations wherever you go.
          </p>
          <div className="w-full">
          <MerchCarousel items={products} />
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
