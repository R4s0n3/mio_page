'use client'
import Link from "next/link";
import Image from "next/image";
import { api } from "@/trpc/react";
import LoadingSpinner from "./loading-spinner";


export default function CreatorSection(){
    const {data: creators, isLoading} = api.contact.getCreators.useQuery()

    const madeCreators = creators?.map(c => ({
      sig: c.user.sig,
      name: c.user.name,
      title: c.user.title,
      email: c.email,
      youtube: c.youtube,
      instagram: c.instagram,
      twitter: c.twitter,
      twitch: c.twitch,
      tiktok: c.tiktok,
      reddit: c.reddit
    }))
    function renderCreators(item: CreatorItemType, idx: number){
        return <CreatorsItem 
            key={idx}
            item={item}
        />
    }
    if(isLoading) return <LoadingSpinner />
    return <div className="w-full flex flex-col lg:flex-row gap-8">
        {madeCreators?.map(renderCreators)}
    </div>
}

export type CreatorItemType = {
    sig: string | null;
    name: string | null;
    title: string | null;
    email: string | null;
    youtube: string | null;
    instagram: string | null;
    twitter: string | null;
    twitch: string | null;
    tiktok: string | null;
    reddit: string | null;
}

type CreatorsItemProps = {
    item: CreatorItemType
}


function CreatorsItem(props:CreatorsItemProps){
    const {item} = props

    return <div className="p-8 border-2 border-secondary-800/20 flex-1 gap-8 flex-wrap font-subhead text-2xl group flex rounded bg-secondary-800/20 relative">
    <div className="flex-1 flex flex-col gap-8">
        <h2 className="font-headline text-6xl md:text-9xl">{item.name}</h2>
        <h5>{item.title}</h5>
    </div>
    <div className="flex-1 flex justify-end">
        <div className="size-24 md:size-32 relative">
    <Image alt="logo" fill src={item.sig ?? "/SVG/logo.svg"} />
        </div>
    </div>
    <div className="basis-full flex gap-4">
    {Object.entries(item).map(([keyName, keyValue]) => {
  if (!keyValue) return null; // Skip if value is null
if(keyName === "title" || keyName === "name" || keyName === "sig") return null
  return (
    <Link 
      key={keyName} 
      href={keyName === "email" ? `mailto:${keyValue}` :keyValue}
      className="size-6 relative"
      aria-label={`Link to ${keyName}`}
    >
      <Image 
        fill
        src={`assets/social-media/${keyName}.svg`} // or your preferred path/extension
        alt={keyName} // Always good to include alt text
      />
    </Link>
  )})}

    </div>
    </div> 
}