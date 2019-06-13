import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable, merge } from 'rxjs';
import { Group } from './models/group';
import { Project } from './models/project';
import { map, switchMap } from 'rxjs/operators';
import { mergePages } from 'src/app/shared/utils/merge-pages';

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
        url.searchParams.set('per_page', '100');
        return mergePages(groupsUrl => this.http.get<Group[]>(groupsUrl.href, { observe: 'response' }), url);
    }

    getSubgroups(groupId: string|number): Observable<Group[]> {
        const url = this.baseApiService.getUrl(`groups/${groupId}/subgroups`);
        url.searchParams.set('per_page', '100');
        url.searchParams.set('order_by', 'path');
        return mergePages(groupsUrl => this.http.get<Group[]>(groupsUrl.href, { observe: 'response' }), url);
    }

    getProjectsOfGroupDeep(groupId: string|number, projectNameFilterTerm?: string): Observable<Project[]> {
        const projectsOfGroup$ = this.getProjectsOfGroup(groupId, projectNameFilterTerm);
        const projectsOfSubgroups$ = this.getSubgroups(groupId).pipe(
            map(subgroups => subgroups.map(sg => this.getProjectsOfGroupDeep(sg.id, projectNameFilterTerm))),
            switchMap(projects$ => merge(...projects$))
        );

        return merge(projectsOfGroup$, projectsOfSubgroups$);
    }

    getProjectsOfGroup(groupId: string|number, projectNameFilterTerm?: string): Observable<Project[]> {
        const url = this.baseApiService.getUrl(`groups/${groupId}/projects`);
        url.searchParams.set('per_page', '100');
        url.searchParams.set('simple', 'true');

        if (projectNameFilterTerm) {
            url.searchParams.set('search', projectNameFilterTerm);
        }

        return mergePages(projectsUrl => this.http.get<Project[]>(projectsUrl.href, { observe: 'response' }), url);
    }
}
