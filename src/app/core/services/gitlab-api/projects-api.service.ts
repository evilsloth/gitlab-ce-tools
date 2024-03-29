import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Project } from './models/project';
import { HttpClient } from '@angular/common/http';
import { FileSearchResult } from './models/file-search-result';
import { mergePages } from 'src/app/shared/utils/merge-pages';

@Injectable({
    providedIn: 'root'
})
export class ProjectsApiService {
    constructor(private baseApiService: BaseApiService, private http: HttpClient) {}

    getProjects(includeArchived: boolean, projectNameFilterTerm?: string): Observable<Project[]> {
        const url = this.baseApiService.getUrl('projects');
        url.searchParams.set('membership', 'true');
        url.searchParams.set('per_page', '100');

        if (projectNameFilterTerm) {
            url.searchParams.set('search', projectNameFilterTerm);
        }

        if (!includeArchived) {
            url.searchParams.set('archived', 'false');
        }

        return mergePages(projectsUrl => this.http.get<Project[]>(projectsUrl.href, { observe: 'response' }), url);
    }

    searchInProject(projectId: string|number, searchText: string, filename?: string): Observable<FileSearchResult[]> {
        const url = this.baseApiService.getUrl(`projects/${projectId}/search`);
        url.searchParams.set('scope', 'blobs');
        url.searchParams.set('per_page', '100');

        const searchTerm = searchText + ' filename:' + (filename || '*');
        url.searchParams.set('search', searchTerm);

        return mergePages(searchUrl => this.http.get<FileSearchResult[]>(searchUrl.href, { observe: 'response' }), url);
    }
}
