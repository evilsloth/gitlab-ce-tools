import { ProjectSearchResult } from '../../project-search-result';
import { FileTreeLeaf } from './file-tree-leaf';
import { Project } from 'src/app/core/services/gitlab-api/models/project';
import { FileSearchResult } from 'src/app/core/services/gitlab-api/models/file-search-result';

export function buildFileTreeForProject(searchResult: ProjectSearchResult): FileTreeLeaf {
    return {
        project: searchResult.project,
        type: 'PROJECT',
        name: searchResult.project.name_with_namespace,
        leafs: buildLeafs(searchResult, false)
    };
}

export function buildFlatFileTreeForProject(searchResult: ProjectSearchResult): FileTreeLeaf {
    return {
        project: searchResult.project,
        type: 'PROJECT',
        name: searchResult.project.name_with_namespace,
        leafs: buildLeafs(searchResult, true)
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
            fileSearchResults: searchResults
        });
        return;
    }

    let directoryLeaf = tree.find(leaf => leaf.name === pathPart);
    if (!directoryLeaf) {
        directoryLeaf = {
            type: 'DIRECTORY',
            name: pathPart,
            leafs: []
        };
        tree.push(directoryLeaf);
    }

    buildPathTree(remainingPathParts, directoryLeaf.leafs, project, filePath, searchResults);
}