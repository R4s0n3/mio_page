import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

import { tappenCopy, tappenLinks } from "@/content/tappen-update";

const solidLink =
  "inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-3 text-center font-subhead uppercase transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto";

export default function TappenUpdate() {
  return (
    <section
      id="tappen"
      aria-labelledby="tappen-update-heading"
      className="container scroll-mt-24 px-4 py-8"
    >
      <div className="relative overflow-hidden rounded-2xl border-2 border-highlight-cyan/40 bg-secondary-900/70 p-5 sm:p-8 lg:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-highlight-magenta/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-16 size-72 rounded-full bg-highlight-cyan/15 blur-3xl"
        />
        <div className="relative grid items-center gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
          <TappenCardFan />
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                lang="de"
                className="rounded-full bg-highlight-magenta px-3 py-1 font-subhead text-sm uppercase text-primary-900"
              >
                {tappenCopy.de.badge}
              </span>
              <span
                lang="en"
                className="rounded-full border border-headings/30 px-3 py-1 font-subhead text-sm uppercase text-headings/80"
              >
                {tappenCopy.en.badge}
              </span>
            </div>
            <h2
              id="tappen-update-heading"
              className="font-headline text-4xl font-extrabold uppercase leading-none text-highlight-cyan underline underline-offset-8 sm:text-6xl"
            >
              {tappenCopy.de.title}
            </h2>
            <div className="flex flex-col gap-4">
              <p
                lang="de"
                className="font-subhead text-xs uppercase tracking-[0.14em] text-highlight-cyan"
              >
                {tappenCopy.de.language}
              </p>
              <p
                lang="de"
                className="font-text text-base leading-7 text-headings sm:text-lg"
              >
                {tappenCopy.de.body}
              </p>
              <p
                lang="en"
                className="font-subhead text-xs uppercase tracking-[0.14em] text-body/50"
              >
                {tappenCopy.en.language}
              </p>
              <p
                lang="en"
                className="font-text text-sm leading-6 text-body/80 sm:text-base"
              >
                {tappenCopy.en.body}
              </p>
            </div>
            <TappenActionLinks variant="solid" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TappenCardFan() {
  return (
    <div className="mx-auto h-64 w-60 sm:h-72">
      <div className="relative h-full w-full">
        <div
          aria-hidden
          className="absolute right-2 top-8 h-52 w-36 rotate-6 rounded-xl border-2 border-highlight-magenta/70 bg-gradient-to-br from-zinc-700 via-black to-zinc-900 shadow-xl sm:h-60 sm:w-40"
        >
          <div className="absolute inset-2.5 rounded-lg border border-white/15" />
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-white/20 to-transparent" />
        </div>
        <div className="absolute left-1 top-3 flex h-52 w-36 -rotate-6 items-center justify-center rounded-xl border-2 border-highlight-cyan/80 bg-black shadow-2xl sm:h-60 sm:w-40">
          <div
            aria-hidden
            className="absolute inset-2.5 rounded-lg border border-white/20"
          />
          <Image
            src="/assets/apps/tappen.svg"
            alt="Tappen"
            width={96}
            height={148}
            className="relative z-10 h-28 w-auto sm:h-32"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-l-xl bg-gradient-to-r from-white/30 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}

export function TappenActionLinks({ variant }: { variant: "solid" | "text" }) {
  const playClass =
    variant === "solid"
      ? `${solidLink} bg-highlight-cyan text-primary-900 hover:bg-accent hover:text-headings focus-visible:outline-highlight-cyan`
      : "inline-flex w-fit items-center gap-2 font-subhead text-lg uppercase text-highlight-cyan underline underline-offset-4 transition duration-300 hover:text-accent";
  const infoClass =
    variant === "solid"
      ? `${solidLink} border-2 border-highlight-cyan text-highlight-cyan hover:border-accent hover:text-accent focus-visible:outline-accent`
      : "inline-flex w-fit items-center gap-2 font-subhead text-lg uppercase text-highlight-cyan underline underline-offset-4 transition duration-300 hover:text-accent";

  return (
    <div
      className={
        variant === "solid"
          ? "flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          : "mt-2 flex flex-col gap-3"
      }
    >
      <Link
        className={playClass}
        href={tappenLinks.play}
        target="_blank"
        rel="noreferrer"
      >
        <ActionLabel
          primary={tappenCopy.de.play}
          secondary={tappenCopy.en.play}
        />
        <ArrowTopRightOnSquareIcon className="size-5 shrink-0" />
      </Link>
      <Link
        className={infoClass}
        href={tappenLinks.info}
        target="_blank"
        rel="noreferrer"
      >
        <ActionLabel
          primary={tappenCopy.de.info}
          secondary={tappenCopy.en.info}
        />
        <ArrowTopRightOnSquareIcon className="size-5 shrink-0" />
      </Link>
    </div>
  );
}

function ActionLabel({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <span className="flex flex-col items-start text-left">
      <span lang="de">{primary}</span>
      <span
        lang="en"
        className="font-text text-xs font-normal normal-case tracking-normal opacity-80"
      >
        {secondary}
      </span>
    </span>
  );
}
