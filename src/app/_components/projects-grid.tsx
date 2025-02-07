import ProjectItem,  { type ProjectItemProps } from "./project-item"

type ProjectsGridProps = {
    projects: ProjectItemProps[]
}

export default function ProjectsGrid(props:ProjectsGridProps){
    props.projects.length = 8

    function createProjectItem(project:ProjectItemProps){
        return <ProjectItem key={project.id} {...project} />
    }
    
    return <div className="w-full flex flex-col">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {props.projects.map(createProjectItem)}
    </div>
    </div>
}