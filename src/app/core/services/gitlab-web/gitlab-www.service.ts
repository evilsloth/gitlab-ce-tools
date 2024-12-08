import { Injectable } from '@angular/core';
import { Project } from '../gitlab-api/models/project';

@Injectable({
    providedIn: 'root'
})
export class GitlabWwwService {

    public openFile(project: Project, file_with_path: string, line?: number): void {
        let url = `${project.web_url}/-/blob/${project.default_branch}/${file_with_path}`;
        if (line !== undefined && line !== null) {
            url += `#L${line}`;
        }
        this.openNewWindow(new URL(url));
    }


    private openNewWindow(url: URL): void {
        window.open(url, '_blank');
    }

}
