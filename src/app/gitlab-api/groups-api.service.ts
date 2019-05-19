import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from './models/group';

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
        return this.http.get<Group[]>(url);
    }
}
