import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Project } from './models/project';
import { HttpClient } from '@angular/common/http';
import { FileSearchResult } from './models/file-search-result';
import { mergePages } from '../shared/utils/merge-pages';

@Injectable({
    providedIn: 'root'
})
export class ProjectsApiService {
    constructor(private baseApiService: BaseApiService, private http: HttpClient) {}

    getProjects(projectNameFilterTerm?: string): Observable<Project[]> {
        const url = this.baseApiService.getUrl('projects');
        url.searchParams.set('membership', 'true');
        url.searchParams.set('per_page', '100');
        url.searchParams.set('simple', 'true');

        if (projectNameFilterTerm) {
            url.searchParams.set('search', encodeURIComponent(projectNameFilterTerm));
        }

        return mergePages(projectsUrl => this.http.get<Project[]>(projectsUrl.href, { observe: 'response' }), url);
    }

    searchInProject(projectId: string|number, searchText: string): Observable<FileSearchResult[]> {
        const url = this.baseApiService.getUrl(`projects/${projectId}/search`);
        url.searchParams.set('scope', 'blobs');
        url.searchParams.set('per_page', '100');
        url.searchParams.set('search', encodeURIComponent(searchText));

        return mergePages(searchUrl => this.http.get<FileSearchResult[]>(searchUrl.href, { observe: 'response' }), url);
    }
}
