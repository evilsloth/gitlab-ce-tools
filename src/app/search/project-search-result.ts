import { Project } from '../gitlab-api/models/project';
import { FileSearchResult } from '../gitlab-api/models/file-search-result';

export interface ProjectSearchResult {
    project: Project;
    fileSearchResults: FileSearchResult[];
}
