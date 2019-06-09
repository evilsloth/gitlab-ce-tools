import { Project } from 'src/app/core/services/gitlab-api/models/project';

export interface FileInProject {
    filename: string;
    project: Project;
}
