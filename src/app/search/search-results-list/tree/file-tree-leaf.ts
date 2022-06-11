import { Project } from 'src/app/core/services/gitlab-api/models/project';
import { FileSearchResult } from 'src/app/core/services/gitlab-api/models/file-search-result';

export interface FileTreeLeaf {
    type: 'PROJECT' | 'DIRECTORY' | 'FILE';
    name: string;
    project?: Project;
    filePath?: string;
    fileSearchResults?: FileSearchResult[];
    leafs?: FileTreeLeaf[];
    expanded?: boolean;
    hidden?: boolean;
    getFileHitsCount: () => number;
    getTotalHitsCount: () => number;
}
