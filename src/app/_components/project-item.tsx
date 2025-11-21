'use client'
import {ArrowTopRightOnSquareIcon} from '@heroicons/react/24/solid'
import Image from 'next/image'

export type ProjectItemProps = {
    id: number;
    name: string;
    url: string | null;
    image: string;
}

export default function ProjectItem(project:ProjectItemProps ){
    return <div onClick={() => window.open(project.url ?? "https://www.miomideal.com", '_blank')} className="w-full font-subhead transition-all duration-500 hover:scale-105 cursor-pointer text-2xl group hover:text-accent flex flex-row-reverse justify-between items-center aspect-video rounded border-2 border-secondary-800/20 bg-secondary-800/20 relative p-4">
        <h3>{project.name}</h3>
        <ArrowTopRightOnSquareIcon className='size-6 z-30 absolute bottom-4 right-4'  />
        <div className='size-14 relative'>
         <Image className='size-full object-contain' sizes="14rem" fill alt={project.name} src={project.image} />
        </div>
    </div>
}
