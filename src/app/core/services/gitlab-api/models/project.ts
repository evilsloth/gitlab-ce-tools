export interface Project {
    id: number;
    description: string;
    default_branch: string;
    archived: boolean; // TODO: Add filter?
    name: string;
    name_with_namespace: string;
    path_with_namespace: string;
}
