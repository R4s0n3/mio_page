"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import FallbackImage from "@/app/_components/fallback-image";

const SWIPE_THRESHOLD_PX = 40;

export function useProductGallery(images: string[]) {
  const [index, setIndex] = useState(0);
  const imageKey = images.join("\u0000");
  const count = images.length;
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setIndex(0);
  }, [imageKey]);

  const safeIndex = count === 0 ? 0 : Math.min(index, count - 1);
  const image = images[safeIndex];

  const select = useCallback(
    (nextIndex: number) => {
      if (count < 1) return;
      setIndex(((nextIndex % count) + count) % count);
    },
    [count],
  );

  const step = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setIndex((current) => {
        const base = Math.min(current, count - 1);
        return (base + delta + count) % count;
      });
    },
    [count],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    },
    [step],
  );

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const start = pointerStart.current;
      pointerStart.current = null;
      if (!start || count < 2) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) {
        return;
      }

      step(dx < 0 ? 1 : -1);
    },
    [count, step],
  );

  const onPointerCancel = useCallback(() => {
    pointerStart.current = null;
  }, []);

  return {
    image,
    index: safeIndex,
    count,
    select,
    onKeyDown,
    swipeHandlers:
      count > 1
        ? {
            onPointerDown,
            onPointerUp,
            onPointerCancel,
          }
        : {},
  };
}

export function ProductGalleryThumbs({
  name,
  images,
  index,
  onSelect,
  className,
  thumbClassName,
}: {
  name: string;
  images: string[];
  index: number;
  onSelect: (index: number) => void;
  className: string;
  thumbClassName: string;
}) {
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    event.stopPropagation();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + delta + images.length) % images.length;
    onSelect(next);
    thumbRefs.current[next]?.focus();
  }

  return (
    <div
      aria-label={`${name} photos`}
      className={className}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
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
            aria-label={`Show ${name} image ${idx + 1} of ${images.length}`}
            aria-pressed={selected}
            className={`${thumbClassName} ${
              selected ? "border-accent" : "border-secondary-800/40"
            }`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSelect(idx);
            }}
            type="button"
          >
            <FallbackImage
              alt=""
              className="object-cover"
              fill
              loading="lazy"
              sizes="96px"
              src={img}
            />
          </button>
        );
      })}
    </div>
  );
}
