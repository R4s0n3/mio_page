import Image from "next/image"
import Link from "next/link"

const socialLinks: SocialListItem[] = [
    {
        id:"discord",
        link:"https://discord.gg/WnmbAu8jfx",
        icon:"discord"
    },
    {
        id:"instagram",
        link:"https://instagram.com/miomideal",
        icon:"instagram"
    },
    {
        id:"tiktok",
        link:"https://tiktok.com/miomideal",
        icon:"tiktok"
    },
    {
        id:"twitter",
        link:"https://x.com/miomideal",
        icon:"twitter"
    },
  ]

export default function Footer(){
    return <footer className="w-full font-sans flex gap-8 justify-center items-center p-8 bg-primary-900 text-headings">
    <div className="container flex flex-col gap-8 justify-center items-center">
        
      <h5 className="font-subhead text-3xl uppercase">Come hang with us!</h5>
      <div className="w-full flex gap-4 justify-center items-center">
        {socialLinks.map(link => <Link key={link.id} href={link.link}><Image className="size-7" src={`/assets/social-media/${link.icon}.svg`} alt={link.id} width={50} height={50} /></Link>)}
      </div>
       
  
    <div className="flex gap-4 flex-col lg:flex-row uppercase text-xs">
        {["legal notice", "privacy policy", "terms and conditions"].map(link => <Link className="text-center hover:text-accent underline underline-offset-4 transition duration-300" key={link} href={`/${link.split(" ").join("-")}`}>{link}</Link>)}
    </div>
    <div>
    <h3 className="text-xs gradient-text">© {year} Mio Mideal</h3>
    </div>
    </div>
  </footer>
}

type SocialListItem = {
    id:string,
    link: string,
    icon: string
  }

const year = new Date().getFullYear()