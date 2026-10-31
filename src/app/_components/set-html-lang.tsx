"use client";

import { useEffect } from "react";

export default function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.lang;
    root.lang = lang;

    return () => {
      root.lang = previous;
    };
  }, [lang]);

  return null;
}
