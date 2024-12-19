import { Injectable } from '@angular/core';
import { Project } from '../gitlab-api/models/project';
import { NavigationService } from '../navigation-service';

@Injectable({
    providedIn: 'root'
})
export class GitlabWwwService {

    constructor(private navigationService: NavigationService) {
    }

    public openFile(project: Project, file_with_path: string, lineIndex?: number): void {
        let url = `${project.web_url}/-/blob/${project.default_branch}/${file_with_path}`;
        if (lineIndex !== undefined && lineIndex !== null) {
            url += `#L${lineIndex + 1}`;
        }
        this.navigationService.openInNewWindow(new URL(url));
    }

}
