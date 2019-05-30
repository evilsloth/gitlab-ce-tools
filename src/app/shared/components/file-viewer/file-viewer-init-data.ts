import { Project } from 'src/app/gitlab-api/models/project';

export interface FileViewerInitData {
    filename: string;
    project: Project;
}
