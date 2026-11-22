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
const englishMigration = join(
  root,
  "prisma/migrations/20261122220000_tappen_update_english/migration.sql",
);
const appliedMigration = join(
  root,
  "prisma/migrations/20261122120000_tappen_project_update/migration.sql",
);

const userFacing = [
  tappenCopy.badge,
  tappenCopy.title,
  tappenCopy.play,
  tappenCopy.info,
  tappenCopy.body,
  tappenProjectName,
  tappenProjectContent,
];

describe("tappen update copy", () => {
  it("uses English party game wording", () => {
    expect(tappenCopy.body.toLowerCase()).toMatch(/social party game/);
    expect(tappenCopy.badge).toBe("New");
    expect(tappenCopy.play).toBe("Play now");
    expect(tappenCopy.info).toBe("More info / Home Edition");
    expect(tappenProjectContent).toBe(tappenCopy.body);
  });

  it("avoids dashes and wording the studio does not use", () => {
    const blob = userFacing.join("\n");
    expect(blob).not.toMatch(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212-]/);
    expect(blob.toLowerCase()).not.toMatch(
      /\bnot\b|\bkein(?:e|en|er)?\b|\bnicht\b|therap|trink|drinking|newsletter|deutsch|partyspiel|jetzt spielen|mehr infos|\bneu\b/,
    );
  });

  it("points play and info at the public Tappen sites", () => {
    expect(tappenLinks.play).toBe("https://play.tappen.app");
    expect(tappenLinks.info).toBe("https://tappen.app");
    expect(tappenProjectUrl).toBe(tappenLinks.info);
    expect(tappenProjectImage).toBe("/assets/apps/tappen.png");
  });

  it("recognizes the Tappen project by exact name or official host", () => {
    expect(isTappenProject({ name: "Tappen App" })).toBe(true);
    expect(isTappenProject({ name: "tappen" })).toBe(true);
    expect(
      isTappenProject({
        name: "Party Cards",
        url: "https://play.tappen.app",
      }),
    ).toBe(true);
    expect(
      isTappenProject({
        name: "Party Cards",
        url: "https://www.tappen.app",
      }),
    ).toBe(true);
    expect(isTappenProject({ name: "Toastyy" })).toBe(false);
    expect(isTappenProject({ name: "Etappenplaner" })).toBe(false);
    expect(
      isTappenProject({
        name: "Etappenplaner",
        url: "https://example.com/etappen",
      }),
    ).toBe(false);
  });

  it("keeps the applied migration and ships English copy in a new one", () => {
    const applied = readFileSync(appliedMigration, "utf8");
    const migration = readFileSync(englishMigration, "utf8");
    const seed = readFileSync(join(root, "prisma/seed.mjs"), "utf8");

    expect(applied).toContain("Partyspiel");
    expect(migration).toContain(tappenProjectContent);
    expect(migration).not.toContain("Partyspiel");
    expect(migration).not.toContain("Deutsch");
    expect(seed).toContain(tappenProjectContent);
    expect(seed).not.toContain("Partyspiel");
    expect(seed).toContain(tappenProjectName);
  });
});
