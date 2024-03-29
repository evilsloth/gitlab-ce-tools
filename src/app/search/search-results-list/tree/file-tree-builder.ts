import { ProjectSearchResult } from '../../project-search-result';
import { FileTreeLeaf } from './file-tree-leaf';
import { Project } from 'src/app/core/services/gitlab-api/models/project';
import { FileSearchResult } from 'src/app/core/services/gitlab-api/models/file-search-result';

export function buildCompactFileTreeForProject(searchResult: ProjectSearchResult): FileTreeLeaf {
    const tree = buildFileTree(searchResult, false);
    compactTree(tree);
    return tree;
}

export function buildFlatFileTreeForProject(searchResult: ProjectSearchResult): FileTreeLeaf {
    return buildFileTree(searchResult, true);
}

export function buildFileTreeForProject(searchResult: ProjectSearchResult): FileTreeLeaf {
    return buildFileTree(searchResult, false);
}

function buildFileTree(searchResult: ProjectSearchResult, flat: boolean): FileTreeLeaf {
    const leafs = buildLeafs(searchResult, flat);
    return {
        project: searchResult.project,
        type: 'PROJECT',
        name: searchResult.project.name_with_namespace,
        leafs,
        getFileHitsCount() {
            return this.leafs
                .filter(leaf => !leaf.hidden)
                .map(leaf => leaf.getFileHitsCount())
                .reduce((prevCount, currentCount) => prevCount + currentCount, 0);
        },
        getTotalHitsCount() {
            return this.leafs
                .filter(leaf => !leaf.hidden)
                .map(leaf => leaf.getTotalHitsCount())
                .reduce((prevCount, currentCount) => prevCount + currentCount, 0);
        }
    };
}

function buildLeafs(searchResult: ProjectSearchResult, flat: boolean): FileTreeLeaf[] {
    const tree: FileTreeLeaf[] = [];

    searchResult.fileSearchResults.forEach((fileSearchResults, filePath) => {
        const pathParts = flat ? [filePath] : filePath.split('/');
        buildPathTree(pathParts, tree, searchResult.project, filePath, fileSearchResults);
    });

    return tree;
}

function buildPathTree(remainingPathParts: string[],
                       tree: FileTreeLeaf[],
                       project: Project,
                       filePath: string,
                       searchResults: FileSearchResult[]): void {
    const pathPart = remainingPathParts.shift();

    if (remainingPathParts.length === 0) {
        tree.push({
            project,
            type: 'FILE',
            name: pathPart,
            filePath,
            fileSearchResults: searchResults,
            getFileHitsCount: () =>  1,
            getTotalHitsCount: () => searchResults.length
        });
        return;
    }

    let directoryLeaf = tree.find(leaf => leaf.name === pathPart);
    if (!directoryLeaf) {
        directoryLeaf = {
            type: 'DIRECTORY',
            name: pathPart,
            leafs: [],
            getFileHitsCount() {
                return this.leafs
                    .filter(leaf => !leaf.hidden)
                    .map(leaf => leaf.getFileHitsCount())
                    .reduce((prevCount, currentCount) => prevCount + currentCount, 0);
            },
            getTotalHitsCount() {
                return this.leafs
                    .filter(leaf => !leaf.hidden)
                    .map(leaf => leaf.getTotalHitsCount())
                    .reduce((prevCount, currentCount) => prevCount + currentCount, 0);
            }
        };
        tree.push(directoryLeaf);
    }

    buildPathTree(remainingPathParts, directoryLeaf.leafs, project, filePath, searchResults);
}

function compactTree(leaf: FileTreeLeaf) {
    if (leaf.leafs) {
        leaf.leafs.forEach(childLeaf => compactTree(childLeaf));
    }

    if (leaf.type === 'DIRECTORY' && containsSingleDirectory(leaf)) {
        const child = leaf.leafs[0];
        leaf.name = leaf.name + '/' + child.name;
        leaf.leafs = child.leafs;
    }
}

function containsSingleDirectory(leaf: FileTreeLeaf): boolean {
    return leaf.leafs && leaf.leafs.length === 1 && leaf.leafs[0].type === 'DIRECTORY';
}
