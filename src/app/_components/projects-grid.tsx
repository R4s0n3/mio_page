'use client'
import { api } from "@/trpc/react"
import ProjectItem from "./project-item"
import LoadingSpinner from "./loading-spinner";


export default function ProjectsGrid(){
    
    const {data: projects, isLoading } = api.project.getLatest.useQuery()

    function createProjectItem(project:{
        id: number;
        name: string;
        url: string | null;
        image: string | null;
    }){
        const actualImage = project.image ?? "/SVG/logo.svg"
        
        const projectItem = {
            ...project,
            image: actualImage === "" ? "/SVG/logo.svg" : actualImage
        }

        return <ProjectItem key={project.id} {...projectItem} />
    }
    if(isLoading) return <LoadingSpinner />
    
    return <div className="w-full flex flex-col">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {projects?.map(createProjectItem)}
    </div>
    </div>
}