import { Project } from '../core/services/gitlab-api/models/project';
import { FileSearchResult } from '../core/services/gitlab-api/models/file-search-result';

export interface ProjectSearchResult {
    project: Project;
    fileSearchResults: Map<string, FileSearchResult[]>;
}
