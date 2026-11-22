export const tappenLinks = {
  play: "https://play.tappen.app",
  info: "https://tappen.app",
} as const;

export const tappenProjectName = "Tappen App";
export const tappenProjectImage = "/assets/apps/tappen.png";
export const tappenProjectUrl = tappenLinks.info;

export const tappenCopy = {
  badge: "New",
  title: "Tappen Update",
  play: "Play now",
  info: "More info / Home Edition",
  body: "Tappen is a fun social party game. Cards now flip in 3D with glossy skins, and a Home Edition QR code unlocks permanent premium.",
} as const;

export const tappenProjectContent = tappenCopy.body;

const tappenProjectNames = new Set(["tappen", "tappen app"]);

export function isTappenProject(project: {
  name: string;
  url?: string | null;
}) {
  const name = project.name.trim().toLocaleLowerCase("de").replace(/\s+/g, " ");
  return tappenProjectNames.has(name) || hasTappenHost(project.url);
}

function hasTappenHost(url: string | null | undefined) {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLocaleLowerCase("en");
    return host === "tappen.app" || host.endsWith(".tappen.app");
  } catch {
    return false;
  }
}
