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
  body: "Tappen is a fun social party game for rounds with your people. Cards now flip in 3D with a real card back. New cards are dealt face down and the host taps to reveal them. Card backs come in full color skins with a glossy Tappen symbol. Legendary skins get a stronger shine. The room invite code stays visible during the round. Guests can drag cards. Room codes are always entered in capitals, so joining is easier. The Tappen Home card set unlocks permanent premium and a premium card skin with its QR code.",
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
