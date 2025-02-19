'use client'
import { api } from "@/trpc/react"
import ProjectItem,  { type ProjectItemProps } from "./project-item"


export default function ProjectsGrid(){
    
    const [projects] = api.project.getLatest.useSuspenseQuery()

    function createProjectItem(project:ProjectItemProps){
        return <ProjectItem key={project.id} {...project} />
    }
  
    return <div className="w-full flex flex-col">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {projects.map(createProjectItem)}
    </div>
    </div>
}