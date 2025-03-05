import { BuildingStorefrontIcon, GlobeAltIcon } from "@heroicons/react/24/solid"
import Link from "next/link"

const navLinks = [ "projects", "about", "merch" ]

export default async function Header () {

  function createNavLinks(item: string){
    return <NavLink key={item} link={item} />
  }


    return <header className="w-full font-headline fixed top-0 text-xl bg-primary-900 text-headings p-1 flex justify-center items-center z-50">
      <div className="container flex justify-between px-4">
        <div className="flex gap-4">
          <Link href="/"><GlobeAltIcon  className="size-6" /></Link>
        </div>
        <div className="flex gap-4">
          {navLinks.map(createNavLinks)}
        </div>
        <div className="flex gap-4">
        <Link href="https://shop.miomideal.com"><BuildingStorefrontIcon  className="size-6" /></Link>
        </div>
      </div>
    </header>
}



function NavLink(props: {link:string}){
  const {link} = props
  return <Link className="uppercase transition duration-300 hover:text-accent" href={`./#${link}`}>
    {link}
  </Link>
}