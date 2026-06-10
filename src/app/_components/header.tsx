import {
  BuildingStorefrontIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import CartIcon from "./cart-icon";

const navLinks = [
  { label: "projects", href: "/projects" },
  { label: "about", href: "/#about" },
  { label: "merch", href: "/#merch" },
];

export default async function Header() {
  function createNavLinks(item: { label: string; href: string }) {
    return <NavLink key={item.label} {...item} />;
  }

  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-center bg-primary-900 p-1 font-headline text-xl text-headings">
      <div className="container flex justify-between px-4">
        <div className="flex gap-4">
          <Link href="/">
            <GlobeAltIcon className="size-6" />
          </Link>
        </div>
        <div className="flex gap-4">{navLinks.map(createNavLinks)}</div>
        <div className="flex gap-4">
          <CartIcon />
          <Link href="https://shop.miomideal.com">
            <BuildingStorefrontIcon className="size-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink(props: { label: string; href: string }) {
  const { label, href } = props;
  return (
    <Link
      className="uppercase transition duration-300 hover:text-accent"
      href={href}
    >
      {label}
    </Link>
  );
}
