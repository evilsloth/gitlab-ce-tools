import { Project } from '../gitlab-api/models/project';

export interface FileViewerInitData {
    filename: string;
    project: Project;
}
