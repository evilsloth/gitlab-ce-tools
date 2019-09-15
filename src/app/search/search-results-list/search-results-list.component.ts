import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FileInProject } from './file-in-project';
import { Project } from 'src/app/core/services/gitlab-api/models/project';
import { FileTreeLeaf } from './tree/file-tree-leaf';

@Component({
    selector: 'app-search-results-list',
    templateUrl: './search-results-list.component.html',
    styleUrls: ['./search-results-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsListComponent {
    @Input()
    searchResults: FileTreeLeaf[];

    @Output()
    fileSelected = new EventEmitter<FileInProject>();

    constructor() { }

    getChildren(leaf: FileTreeLeaf): FileTreeLeaf[] {
        return leaf.leafs;
    }

    onFileSelected(filename: string, project: Project): void {
        this.fileSelected.emit({ filename, project });
    }
}
