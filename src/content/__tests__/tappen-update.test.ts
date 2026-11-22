import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  isTappenProject,
  tappenCopy,
  tappenLinks,
  tappenProjectContent,
  tappenProjectImage,
  tappenProjectName,
  tappenProjectUrl,
} from "@/content/tappen-update";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");

const userFacing = [
  tappenCopy.de.badge,
  tappenCopy.de.title,
  tappenCopy.de.language,
  tappenCopy.de.play,
  tappenCopy.de.info,
  tappenCopy.de.body,
  tappenCopy.en.badge,
  tappenCopy.en.title,
  tappenCopy.en.language,
  tappenCopy.en.play,
  tappenCopy.en.info,
  tappenCopy.en.body,
  tappenProjectName,
];

describe("tappen update copy", () => {
  it("uses casual party game wording in German and English", () => {
    expect(tappenCopy.de.body).toMatch(/Partyspiel/);
    expect(tappenCopy.en.body.toLowerCase()).toMatch(/social party game/);
    expect(tappenProjectContent.startsWith("Deutsch\n")).toBe(true);
    expect(tappenProjectContent).toContain("\n\nEnglish\n\n");
  });

  it("avoids dashes and wording the studio does not use", () => {
    const blob = userFacing.join("\n");
    expect(blob).not.toMatch(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212-]/);
    expect(blob.toLowerCase()).not.toMatch(
      /\bnot\b|\bkein(?:e|en|er)?\b|\bnicht\b|therap|trink|drinking|newsletter/,
    );
  });

  it("points play and info at the public Tappen sites", () => {
    expect(tappenLinks.play).toBe("https://play.tappen.app");
    expect(tappenLinks.info).toBe("https://tappen.app");
    expect(tappenProjectUrl).toBe(tappenLinks.info);
    expect(tappenProjectImage).toBe("/assets/apps/tappen.png");
  });

  it("recognizes the existing Tappen project name", () => {
    expect(isTappenProject("Tappen App")).toBe(true);
    expect(isTappenProject("tappen")).toBe(true);
    expect(isTappenProject("Toastyy")).toBe(false);
  });

  it("ships the same description in the migration and the local seed", () => {
    const migration = readFileSync(
      join(
        root,
        "prisma/migrations/20261122120000_tappen_project_update/migration.sql",
      ),
      "utf8",
    );
    const seed = readFileSync(join(root, "prisma/seed.mjs"), "utf8");

    expect(migration).toContain(tappenProjectContent);
    expect(migration).toContain(tappenProjectUrl);
    expect(seed).toContain(tappenProjectContent);
    expect(seed).toContain(tappenProjectName);
  });
});
