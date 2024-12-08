import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { FileViewerInitData } from './file-viewer-init-data';
import { Modal } from 'src/app/core/services/modal/modal';
import { FilesApiService } from 'src/app/core/services/gitlab-api/files-api.service';
import { AceComponent, AceConfigInterface } from 'ngx-ace-wrapper';
import { Project } from 'src/app/core/services/gitlab-api/models/project';
import { SettingsService } from 'src/app/settings/settings.service';
import { Range } from 'brace';
import { GitlabWwwService } from 'src/app/core/services/gitlab-web/gitlab-www.service';

import 'brace';
import 'brace/mode/javascript';
import 'brace/mode/typescript';
import 'brace/mode/java';
import 'brace/mode/html';
import 'brace/mode/markdown';
import 'brace/mode/json';
import 'brace/mode/scss';
import 'brace/mode/xml';
import 'brace/mode/css';
import 'brace/mode/yaml';
import 'brace/mode/properties';
import 'brace/mode/text';
import 'brace/theme/chrome';
import 'brace/ext/searchbox';

@Component({
    selector: 'app-file-viewer',
    templateUrl: './file-viewer.component.html',
    styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerComponent extends Modal<FileViewerInitData> implements OnInit, AfterViewInit {
    private static readonly EXTENSION_HIGHLIGHT_MAP = new Map([
        ['js', 'javascript'],
        ['ts', 'typescript'],
        ['java', 'java'],
        ['html', 'html'],
        ['md', 'markdown'],
        ['json', 'json'],
        ['scss', 'scss'],
        ['xml', 'xml'],
        ['css', 'css'],
        ['yml', 'yaml'],
        ['yaml', 'yaml'],
        ['properties', 'properties']
    ]);

    @HostBinding('class.fullscreen')
    fullScreen = false;

    @ViewChild('ace', { static: true })
    ace: AceComponent;
    aceConfig: AceConfigInterface;

    project: Project;
    filename: string;
    fileContent: string;
    highlightLanguage: string;
    textToHighlight: string;
    fileLoaded = false;
    error: any;

    highlightedRanges: Range[] = [];
    jumpedToLineIndex = -1;

    constructor(private filesApiService: FilesApiService, private settingsService: SettingsService,
        private gitlabWwwService: GitlabWwwService) {
        super();
    }

    ngOnInit(): void {
        const settings = this.settingsService.getCurrentSettings();
        const initData = this.getData();
        this.project = initData.project;
        this.filename = initData.filename;
        this.textToHighlight = initData.textToHighlight;
        this.fullScreen = settings.fileViewer.fullScreen;

        this.aceConfig = {
            wrap: settings.fileViewer.wrapLines
        };
    }

    ngAfterViewInit(): void {
        this.filesApiService.getFile(this.project.id, this.project.default_branch, this.filename)
            .subscribe(
                file => {
                    this.fileContent = this.decodeContent(file.content);
                    this.highlightLanguage = this.getHightlightLanguage(file.file_name);
                    this.fileLoaded = true;
                    this.onFileLoaded();
                },
                error => {
                    this.error = error;
                    this.fileLoaded = true;
                }
            );
    }

    goToPreviousHighlight() {
        const maxIndex = this.highlightedRanges.length - 1;
        this.jumpedToLineIndex = this.jumpedToLineIndex > 0 ? this.jumpedToLineIndex - 1 : maxIndex;
        this.goToHighlight(this.jumpedToLineIndex);
    }

    goToNextHighlight() {
        const maxIndex = this.highlightedRanges.length - 1;
        this.jumpedToLineIndex = this.jumpedToLineIndex < maxIndex ? this.jumpedToLineIndex + 1 : 0;
        this.goToHighlight(this.jumpedToLineIndex);
    }

    openInWebBrowser() {
        let line = this.ace.directiveRef.ace().getCursorPosition()?.row;
        if (line !== undefined || line !== null) {
            line += 1;
        }
        this.gitlabWwwService.openFile(this.project, this.filename, line);
    }

    private goToHighlight(index: number): void {
        const range = this.highlightedRanges[index];
        const ace = this.ace.directiveRef.ace();
        ace.scrollToLine(range.start.row + 1, true, true, () => { });
        ace.gotoLine(range.start.row + 1, range.end.column, true);
    }

    private onFileLoaded(): void {
        const ace = this.ace.directiveRef.ace();
        ace.focus();
        // wait for text to be renedered
        setTimeout(() => {
            (ace as any).findAll(this.textToHighlight);
            const selection = ace.session.getSelection();
            this.highlightedRanges = selection.getAllRanges();

            this.highlightedRanges.forEach(range => {
                ace.session.addMarker(range, 'lineMarker', 'fullLine', false);
                ace.session.addMarker(range, 'wordMarker', 'text', false);
            });

            if (this.highlightedRanges.length > 0) {
                this.goToNextHighlight();
            }
        });
    }

    private getHightlightLanguage(filename: string) {
        const extension = filename.split('.').pop();
        return FileViewerComponent.EXTENSION_HIGHLIGHT_MAP.get(extension) || 'text';
    }

    private decodeContent(content: string): string {
        return decodeURIComponent(escape(atob(content)));
    }
}
