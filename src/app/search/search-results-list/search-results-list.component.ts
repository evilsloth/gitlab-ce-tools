import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProjectSearchResult } from '../project-search-result';
import { FileInProject } from './file-in-project';
import { Project } from 'src/app/core/services/gitlab-api/models/project';

@Component({
    selector: 'app-search-results-list',
    templateUrl: './search-results-list.component.html',
    styleUrls: ['./search-results-list.component.scss']
})
export class SearchResultsListComponent {
    @Input()
    searchResults: ProjectSearchResult[];

    @Output()
    fileSelected = new EventEmitter<FileInProject>();

    constructor() {}

    onFileSelected(filename: string, project: Project): void {
        this.fileSelected.emit({filename, project});
    }
}
