"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const FALLBACK_SRC = "/SVG/logo.svg";

type FallbackImageProps = Omit<ImageProps, "src" | "alt" | "onError"> & {
  src?: string | null;
  alt: string;
};

export default function FallbackImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  ...props
}: FallbackImageProps) {
  const trimmed = src?.trim() ?? "";
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [trimmed]);

  if (!trimmed || failed) {
    if (fill) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary-800/30">
          <Image
            src={FALLBACK_SRC}
            alt={alt}
            width={120}
            height={120}
            className="size-16 object-contain opacity-80 sm:size-24"
          />
        </div>
      );
    }

    return (
      <div className="flex size-full items-center justify-center bg-secondary-800/30">
        <Image
          src={FALLBACK_SRC}
          alt={alt}
          width={80}
          height={80}
          className="size-12 object-contain opacity-80"
        />
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      fill={fill}
      height={height}
      src={trimmed}
      width={width}
      onError={() => setFailed(true)}
    />
  );
}
