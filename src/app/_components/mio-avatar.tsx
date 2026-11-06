"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { validateAvatar } from "open-bot-avatar";
import { mountAvatar } from "open-bot-avatar/dom";

import definition from "../../../public/mio-avatar/mio.json";

export function MioAvatar() {
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const result = validateAvatar(definition);
    if (!host.current || !result.ok) return;

    const avatar = mountAvatar(host.current, {
      definition: result.value,
      color: "#f5f5f5",
      followPointer: true,
      depth: 8,
      reducedMotion: "system",
      label: "",
    });
    setMounted(true);

    return () => avatar.destroy();
  }, []);

  return (
    <div
      className="relative size-32 sm:size-40"
      role="img"
      aria-label="Mio avatar"
    >
      {!mounted && <Image src="/mio-avatar/mio.svg" alt="" fill priority />}
      <div ref={host} className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
