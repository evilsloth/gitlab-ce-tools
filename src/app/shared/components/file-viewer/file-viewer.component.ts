import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileViewerInitData } from './file-viewer-init-data';
import { Modal } from 'src/app/core/services/modal/modal';
import { FilesApiService } from 'src/app/core/services/gitlab-api/files-api.service';

import * as Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-scss';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-numbers/prism-line-numbers';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerComponent extends Modal<FileViewerInitData> implements OnInit {
    private static readonly SUPPORTED_LANGS = ['js', 'ts', 'java', 'html', 'md', 'json', 'scss', 'xml', 'css'];

    filename: string;
    fileContent: string;
    highlightLanguage: string;
    linesToHighlight: string;
    textToHighlight: string;
    fileLoaded = false;
    error: any;

    @ViewChild('codeContainer')
    codeContainer: ElementRef;

    constructor(private filesApiService: FilesApiService) {
        super();
    }

    ngOnInit(): void {
        const initData = this.getData();
        this.filename = initData.filename;
        this.textToHighlight = initData.textToHighlight;
        this.filesApiService.getFile(initData.project.id, initData.project.default_branch, initData.filename)
            .subscribe(
                file => {
                    this.fileContent = atob(file.content);
                    this.highlightLanguage = this.getHightlightLanguage(file.file_name);
                    this.linesToHighlight = this.getLinesToHighlight();
                    this.highlightCode();
                },
                error => { this.error = error; this.fileLoaded = true; }
            );
    }

    private highlightCode(): void {
        // wait for code text to be rendered
        setTimeout(() => {
            Prism.highlightElement(this.codeContainer.nativeElement);
            this.fileLoaded = true;
        });
    }

    private getHightlightLanguage(filename: string) {
        const extension =  filename.split('.').pop();

        if (FileViewerComponent.SUPPORTED_LANGS.indexOf(extension) >= 0) {
            return extension;
        }

        return 'clike';
    }

    private getLinesToHighlight(): string {
        if (!this.textToHighlight) {
            return '';
        }

        const foundInLines: number[] = [];
        const searchRegex = new RegExp(this.regexEscape(this.textToHighlight), 'gi');
        const lines = this.fileContent.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (searchRegex.test(line)) {
                foundInLines.push(i + 1);
            }
        }

        return foundInLines.toString();
    }

    private regexEscape(str: string) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
}
