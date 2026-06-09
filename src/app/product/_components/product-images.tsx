import Image from "next/image";
import { useState } from "react";

export default function ProductImages({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const [currentImage, setCurrentImage] = useState<string | undefined>(
    images[0],
  );
  const displayedImage = currentImage ?? images[0];

  function createImageThumbnail(img: string, idx: number) {
    const wrapperProps = { img, name };

    return (
      <button
        key={`${img}-${idx}`}
        type="button"
        className={`size-24 overflow-hidden rounded-2xl border ${
          img === displayedImage ? "border-accent" : "border-secondary-800/20"
        }`}
        onClick={() => setCurrentImage(img)}
        aria-label={`Show ${name} image ${idx + 1}`}
      >
        <ImageWrapper {...wrapperProps} />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="group relative aspect-square overflow-hidden rounded-2xl border border-secondary-800/20 bg-surface">
        {displayedImage ? (
          <>
            <Image
              src={displayedImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        ) : (
          <EmptyImage />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">{images.map(createImageThumbnail)}</div>
      )}
    </div>
  );
}

function ImageWrapper({ img, name }: { img: string; name: string }) {
  return (
    <div className="group relative aspect-square overflow-hidden bg-surface">
      <Image
        src={img}
        alt={name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="96px"
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
