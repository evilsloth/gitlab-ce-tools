import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FileInProject } from './file-in-project';
import { Project } from 'src/app/core/services/gitlab-api/models/project';
import { FileTreeLeaf } from './tree/file-tree-leaf';
import { Observable, of, scheduled } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
    selector: 'app-search-results-list',
    templateUrl: './search-results-list.component.html',
    styleUrls: ['./search-results-list.component.scss']
})
export class SearchResultsListComponent {
    @Input()
    searchResults: FileTreeLeaf[];

    @Output()
    fileSelected = new EventEmitter<FileInProject>();

    constructor() { }

    getChildren(leaf: FileTreeLeaf): Observable<FileTreeLeaf[]> {
        return leaf.leafs ? scheduled(of(leaf.leafs), async) : null;
    }

    onFileSelected(filename: string, project: Project): void {
        this.fileSelected.emit({ filename, project });
    }

    expandAll(): void {
        this.searchResults.forEach(leaf => this.setTreeExpanded(leaf, true));
    }

    collapseAll(): void {
        this.searchResults.forEach(leaf => this.setTreeExpanded(leaf, false));
    }

    toggleExpandLeaf(leaf: FileTreeLeaf): void {
        leaf.expanded = !leaf.expanded;
    }

    expandTree(leaf: FileTreeLeaf): void {
        this.setTreeExpanded(leaf, true);
    }

    onExpandChange(leaf: FileTreeLeaf): void {
        if (!leaf.expanded) {
            this.setTreeExpanded(leaf, false);
        }
    }

    private setTreeExpanded(leaf: FileTreeLeaf, expanded: boolean): void {
        leaf.expanded = expanded;

        if (leaf.leafs) {
            leaf.leafs.forEach(childLeaf => this.setTreeExpanded(childLeaf, expanded));
        }
    }
}
