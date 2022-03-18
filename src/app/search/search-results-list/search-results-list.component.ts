import { Component, EventEmitter, Input, Output } from '@angular/core';
import { asyncScheduler, Observable, of, scheduled } from 'rxjs';
import { Project } from 'src/app/core/services/gitlab-api/models/project';
import { FileInProject } from './file-in-project';
import { FileTreeLeaf } from './tree/file-tree-leaf';

@Component({
    selector: 'app-search-results-list',
    templateUrl: './search-results-list.component.html',
    styleUrls: ['./search-results-list.component.scss']
})
export class SearchResultsListComponent {

    @Input()
    enableResultHiding: boolean;

    @Input()
    showFileHitsCount: boolean;

    @Input()
    showTotalHitsCount: boolean;

    @Output()
    fileSelected = new EventEmitter<FileInProject>();

    isAnyResultHidden = false;

    treeFileHitsCount = 0;
    treeTotalHitsCount = 0;

    private _searchResults: FileTreeLeaf[];

    constructor() { }

    get searchResults(): FileTreeLeaf[] {
        return this._searchResults;
    }

    @Input()
    set searchResults(value: FileTreeLeaf[]) {
        this._searchResults = value;
        this.isAnyResultHidden = false;
        this.treeFileHitsCount = value.reduce((sum, leaf) => sum + leaf.fileHitsCount, 0);
        this.treeTotalHitsCount = value.reduce((sum, leaf) => sum + leaf.totalHitsCount, 0);
    }

    getChildren(leaf: FileTreeLeaf): Observable<FileTreeLeaf[]> {
        return leaf.leafs ? scheduled(of(leaf.leafs), asyncScheduler) : null;
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

    hideResult(leaf: FileTreeLeaf) {
        leaf.hidden = true;
        this.isAnyResultHidden = true;
    }

    clearHidden() {
        this.searchResults.forEach(leaf => this.clearTreeHiddenFlag(leaf));
        this.isAnyResultHidden = false;
    }

    private setTreeExpanded(leaf: FileTreeLeaf, expanded: boolean): void {
        this.setTreeProperties(leaf, { expanded });
    }

    private clearTreeHiddenFlag(leaf: FileTreeLeaf): void {
        this.setTreeProperties(leaf, { hidden: false });
    }

    /**
     * Recursively overrides properties given in propertiesToChange argument in all tree nodes
     *
     * @param leaf leaf of the tree to start with
     * @param propertiesToChange which properties should be overriden (key-value pairs defined in FileTreeLeaf type)
     */
    private setTreeProperties(leaf: FileTreeLeaf, propertiesToChange: Partial<FileTreeLeaf>) {
        Object.assign(leaf, propertiesToChange);

        if (leaf.leafs) {
            leaf.leafs.forEach(childLeaf => this.setTreeProperties(childLeaf, propertiesToChange));
        }
    }

}
