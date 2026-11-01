"use client";

import { useRef, type KeyboardEvent } from "react";

import FallbackImage from "@/app/_components/fallback-image";
import { useProductGallery } from "@/app/_components/product-gallery";

export default function ProductImages({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const {
    image: selectedImage,
    index,
    select,
    onKeyDown,
    swipeHandlers,
  } = useProductGallery(images);
  const multi = images.length > 1;
  const displayedImage = multi ? selectedImage : images[0];
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onThumbnailKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!multi) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    event.stopPropagation();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + delta + images.length) % images.length;
    select(next);
    thumbRefs.current[next]?.focus();
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-2">
      <div
        className="group relative aspect-square overflow-hidden rounded-2xl border border-secondary-800/20 bg-surface"
        {...(multi
          ? {
              "aria-label": `${name} photos`,
              "aria-roledescription": "carousel",
              onKeyDown,
              role: "group" as const,
              tabIndex: 0,
              ...swipeHandlers,
            }
          : {})}
      >
        {displayedImage ? (
          <>
            <FallbackImage
              src={displayedImage}
              alt={
                multi ? `${name}, photo ${index + 1} of ${images.length}` : name
              }
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              {...(multi ? { loading: "lazy" as const } : {})}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        ) : (
          <EmptyImage />
        )}
      </div>

      {multi && (
        <div
          aria-label={`${name} photos`}
          className="flex w-full min-w-0 max-w-full gap-2 overflow-x-auto"
          onKeyDown={onThumbnailKeyDown}
          role="group"
        >
          {images.map((img, idx) => {
            const selected = idx === index;
            return (
              <button
                key={`${img}-${idx}`}
                ref={(node) => {
                  thumbRefs.current[idx] = node;
                }}
                type="button"
                aria-pressed={selected}
                className={`size-24 flex-shrink-0 overflow-hidden rounded-2xl border ${
                  selected ? "border-accent" : "border-secondary-800/20"
                }`}
                onClick={() => select(idx)}
                aria-label={`Show ${name} image ${idx + 1}`}
              >
                <ImageWrapper img={img} name={name} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ImageWrapper({ img, name }: { img: string; name: string }) {
  return (
    <div className="group relative aspect-square overflow-hidden bg-surface">
      <FallbackImage
        src={img}
        alt={name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="96px"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

function EmptyImage() {
  return (
    <div className="flex h-full w-full items-center justify-center text-body/30">
      <div className="text-center">
        <div className="mb-2 text-4xl opacity-50">No image</div>
        <span className="text-lg">No image available</span>
      </div>
    </div>
  );
}
