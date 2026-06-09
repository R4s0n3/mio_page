import Image from "next/image";
import Link from "next/link";

const socialLinks: SocialListItem[] = [
  {
    id: "discord",
    link: "https://discord.gg/S7c48jzmnY",
    icon: "discord",
  },
  {
    id: "instagram",
    link: "https://instagram.com/miomideal",
    icon: "instagram",
  },
  {
    id: "tiktok",
    link: "https://tiktok.com/@mio.mideal",
    icon: "tiktok",
  },
  {
    id: "twitter",
    link: "https://x.com/miomideal",
    icon: "twitter",
  },
];

export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-center gap-8 bg-primary-900 p-8 font-sans text-headings">
      <div className="container flex flex-col items-center justify-center gap-8">
        <h5 className="font-subhead text-3xl uppercase">Come hang with us!</h5>
        <div className="flex w-full items-center justify-center gap-4">
          {socialLinks.map((link) => (
            <Link key={link.id} href={link.link}>
              <Image
                className="size-7"
                src={`/assets/social-media/${link.icon}.svg`}
                alt={link.id}
                width={50}
                height={50}
              />
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4 text-xs uppercase lg:flex-row">
          {["legal notice", "privacy policy", "terms and conditions"].map(
            (link) => (
              <Link
                className="text-center underline underline-offset-4 transition duration-300 hover:text-accent"
                key={link}
                href={`/${link.split(" ").join("-")}`}
              >
                {link}
              </Link>
            ),
          )}
        </div>
        <div>
          <h3 className="gradient-text text-xs">© {year} Mio Mideal</h3>
        </div>
      </div>
    </footer>
  );
}

type SocialListItem = {
  id: string;
  link: string;
  icon: string;
};

const year = new Date().getFullYear();
