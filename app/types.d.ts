export interface ReactProps {
    children: React.ReactNode
} 

export interface Work {
    title: string,
    description: string,
    github: string,
    deploy?: string,
    reference?: string
}