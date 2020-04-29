import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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

    constructor(private changeDetectionRef: ChangeDetectorRef) { }

    getChildren(leaf: FileTreeLeaf): FileTreeLeaf[] {
        return leaf.leafs;
    }

    onFileSelected(filename: string, project: Project): void {
        this.fileSelected.emit({ filename, project });
    }

    expandAll(): void {
        for (let i = 0; i < this.searchResults.length; i++) {
            setTimeout(() => {
                this.searchResults[i] = this.createExpandedTree(this.searchResults[i], true);
                this.changeDetectionRef.detectChanges();
            });
        }
    }

    collapseAll(): void {
        for (let i = 0; i < this.searchResults.length; i++) {
            setTimeout(() => {
                this.searchResults[i] = this.createExpandedTree(this.searchResults[i], false);
                this.changeDetectionRef.detectChanges();
            });
        }
    }

    private createExpandedTree(leaf: FileTreeLeaf, expanded: boolean): FileTreeLeaf {
        return {
            ...leaf,
            leafs: leaf.leafs && leaf.leafs.map(leaf => this.createExpandedTree(leaf, expanded)),
            expanded
        };
    }
}
