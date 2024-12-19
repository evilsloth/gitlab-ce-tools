import { Injectable } from '@angular/core';
import { Project } from './models/project';

@Injectable({
    providedIn: 'root'
})
export class GitlabWwwService {

    public openFileUrl(project: Project, file_with_path: string, line?: number): string {
        let url = `${project.web_url}/-/blob/${project.default_branch}/${file_with_path}`;
        if (line !== undefined) {
            url += `#L${line+1}`;
        }
        return url;
    }
}
