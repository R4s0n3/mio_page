"use client";
import React from "react";
import type { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./carousel-dot-button";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./carousel-arrow-button";
import Image from "next/image";
import Link from "next/link";

import useEmblaCarousel from "embla-carousel-react";
import { priceToDisplay } from "@/server/util/functions";
import "@/styles/carousel/style.css";

export type ProductItemType = {
  type: string;
  description: string | null;
  id: string;
  name: string;
  image: string | null;
  price: number | null;
};

type PropType = {
  slides: ProductItemType[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div
              className="embla__slide group relative aspect-video min-w-0 flex-shrink-0 flex-grow-0 basis-full transform-gpu cursor-pointer overflow-hidden rounded border-2 border-secondary-800/20 bg-secondary-800/20 text-headings lg:basis-3/4"
              key={index}
            >
              <div className="absolute z-20 size-full overflow-hidden rounded transition duration-500 group-hover:scale-105">
                <Image
                  width={1920}
                  quality={100}
                  height={1080}
                  src={slide.image ?? ""}
                  alt="shirt"
                />
              </div>
              <div className="embla__slide__number relative z-30 flex h-full flex-col justify-between p-8 pt-4">
                <h2 className="font-headline text-5xl transition duration-300 group-hover:text-accent lg:text-9xl">
                  {slide.type}
                </h2>
                <div className="hidden flex-col gap-5 lg:flex">
                  <h5 className="font-subhead text-xl lg:text-3xl">
                    {slide.name}
                  </h5>
                  <p className="w-full max-w-sm font-text text-sm lg:text-lg">
                    {slide.description}
                  </p>
                </div>
                <div className="flex justify-between">
                  <h5 className="font-subhead text-3xl">
                    {priceToDisplay(slide.price ?? 0).toFixed(2)}€
                  </h5>
                  <Link
                    className="font-subhead text-3xl transition duration-300 group-hover:text-accent"
                    href={`product/${slide.id}`}
                  >
                    Buy now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-between">
        <div className="flex gap-2">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-4">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? "embla__dot--selected" : "",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
