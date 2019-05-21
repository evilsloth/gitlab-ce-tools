import { Component, OnInit } from '@angular/core';
import { Modal } from '../common/modal/modal';
import { FileViewerInitData } from './file-viewer-init-data';
import { FilesApiService } from '../gitlab-api/files-api.service';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerComponent extends Modal<FileViewerInitData> implements OnInit {
    filename: string;
    fileContent: string;
    fileLoaded = false;
    error: any;

    constructor(private filesApiService: FilesApiService) {
        super();
    }

    ngOnInit(): void {
        const initData = this.getData();
        this.filename = initData.filename;
        this.filesApiService.getFile(initData.project.id, initData.project.default_branch, initData.filename)
            .subscribe(
                file => this.fileContent = atob(file.content),
                error => { this.error = error; this.fileLoaded = true; },
                () => this.fileLoaded = true
            );
    }
}
