import { Project } from 'src/app/core/services/gitlab-api/models/project';

export interface FileViewerInitData {
    filename: string;
    project: Project;
}
