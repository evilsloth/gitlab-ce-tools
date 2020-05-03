import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FileInProject } from './file-in-project';
import { Project } from 'src/app/core/services/gitlab-api/models/project';
import { FileTreeLeaf } from './tree/file-tree-leaf';
import { Observable, of } from 'rxjs';
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
        return leaf.leafs ? of(leaf.leafs, async) : null;
    }

    onFileSelected(filename: string, project: Project): void {
        this.fileSelected.emit({ filename, project });
    }

    expandAll(): void {
        this.searchResults.forEach(leaf => this.setTreeExpanded(leaf, true));
    }

    collapseAll(): void {
        this.searchResults = this.searchResults.map(leaf => this.createExpandedTree(leaf, false));
    }

    toggleExpandLeaf(leaf: FileTreeLeaf) {
        leaf.expanded = !leaf.expanded;
    }

    toggleExpandTree(leaf: FileTreeLeaf): void {
        this.setTreeExpanded(leaf, !leaf.expanded);
    }

    private createExpandedTree(leaf: FileTreeLeaf, expanded: boolean): FileTreeLeaf {
        return {
            ...leaf,
            leafs: leaf.leafs && leaf.leafs.map(leaf => this.createExpandedTree(leaf, expanded)),
            expanded
        };
    }

    private setTreeExpanded(leaf: FileTreeLeaf, expanded: boolean): void {
        leaf.expanded = expanded;

        if (leaf.leafs) {
            leaf.leafs.forEach(leaf => this.setTreeExpanded(leaf, expanded));
        }
    }
}
