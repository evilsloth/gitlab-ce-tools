import { Injectable } from '@angular/core';
import { Project } from '../gitlab-api/models/project';
import { NavigationService } from '../navigation-service';
import { SettingsService } from 'src/app/settings/settings.service';


// Base on TBX-3965
@Injectable({
    providedIn: 'root'
})
export class JbToolboxService {

    private encodedToolTag = encodeURIComponent('idea');

    constructor(private navigationService: NavigationService, settingService: SettingsService) {
        settingService.getSettings().subscribe((settings) => {
            this.encodedToolTag = encodeURIComponent(settings.integration.jbIdeName);
        });
    }

    cloneOrOpenProjectInIde(project: Project): void {
        const url = this.buildCloneUrl(new URL(project.ssh_url_to_repo));
        this.navigationService.openInSameWindow(url);
    }

    openFileInIde(project: Project, filePath: string, lineIndex?: number, columnIndex?: number): void {
        const url = this.buildNavigateUrl(project.name, filePath, lineIndex, columnIndex);
        this.navigationService.openInSameWindow(url);
    }

    private buildCloneUrl(cloneUrl: URL): URL {
        const encodedcloneUrl = encodeURIComponent(cloneUrl.toString());
        return new URL(
            `jetbrains://${this.encodedToolTag}/checkout/git?checkout.repo=${encodedcloneUrl}&idea.required.plugins.id=Git4Idea`
        );
    }

    private buildNavigateUrl(project: string, filePath: string, lineIndex?: number, columnIndex?: number) {
        const encodedProject = encodeURIComponent(project);
        const encodedFilePath = encodeURIComponent(filePath);
        const finalLineIndex = lineIndex ?? 0;
        const finalColumnIndex = columnIndex ?? 0;
        return new URL(
            // eslint-disable-next-line max-len
            `jetbrains://${this.encodedToolTag}/navigate/reference?project=${encodedProject}&path=${encodedFilePath}:${finalLineIndex}:${finalColumnIndex}`
        );
    }

}
