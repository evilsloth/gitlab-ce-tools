import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from './models/group';
import { Project } from './models/project';

@Injectable({
    providedIn: 'root'
})
export class GroupsApiService {
    constructor(
        private baseApiService: BaseApiService,
        private http: HttpClient
    ) {}

    getGroups(): Observable<Group[]> {
        const url = this.baseApiService.getUrl('groups');
        return this.http.get<Group[]>(url.href);
    }

    getProjectsOfGroup(groupId: string|number, projectNameFilterTerm?: string): Observable<Project[]> {
        const url = this.baseApiService.getUrl(`groups/${groupId}/projects`);
        url.searchParams.set('per_page', '100'); // TODO: paging

        if (projectNameFilterTerm) {
            url.searchParams.set('search', encodeURIComponent(projectNameFilterTerm));
        }

        return this.http.get<Project[]>(url.href);
    }
}
