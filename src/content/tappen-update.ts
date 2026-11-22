export const tappenLinks = {
  play: "https://play.tappen.app",
  info: "https://tappen.app",
} as const;

export const tappenProjectName = "Tappen App";
export const tappenProjectImage = "/assets/apps/tappen.png";
export const tappenProjectUrl = tappenLinks.info;

export const tappenCopy = {
  de: {
    badge: "Neu",
    title: "Tappen Update",
    language: "Deutsch",
    play: "Jetzt spielen",
    info: "Mehr Infos",
    body: "Tappen ist ein lockeres soziales Partyspiel für Runden mit deinen Leuten. Karten drehen sich jetzt in 3D und zeigen eine echte Rückseite. Neue Karten kommen verdeckt an und der Host tippt sie auf. Die Rückseiten gibt es in farbigen Skins mit einem glänzenden Tappen Symbol. Legendäre Skins leuchten noch stärker. Der Einladungscode bleibt während der Runde sichtbar. Gäste können Karten ziehen. Raumcodes tippst du immer in Großbuchstaben, so wird das Beitreten leichter. Das Kartenset Tappen Home schaltet mit dem QR Code dauerhaft Premium und einen Premium Skin frei.",
  },
  en: {
    badge: "New",
    title: "Tappen Update",
    language: "English",
    play: "Play now",
    info: "More info, Home Edition",
    body: "Tappen is a fun social party game for rounds with your people. Cards now flip in 3D with a real card back. New cards are dealt face down and the host taps to reveal them. Card backs come in full color skins with a glossy Tappen symbol. Legendary skins get a stronger shine. The room invite code stays visible during the round. Guests can drag cards. Room codes are always entered in capitals, so joining is easier. The Tappen Home card set unlocks permanent premium and a premium card skin with its QR code.",
  },
} as const;

export const tappenProjectContent = [
  tappenCopy.de.language,
  "",
  tappenCopy.de.body,
  "",
  tappenCopy.en.language,
  "",
  tappenCopy.en.body,
].join("\n");

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
