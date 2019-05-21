import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from './models/file';

@Injectable({
    providedIn: 'root'
})
export class FilesApiService {
    constructor(
        private baseApiService: BaseApiService,
        private http: HttpClient
    ) {}

    getFile(projectId: string|number, branch: string, filename: string): Observable<File> {
        const url = this.baseApiService.getUrl(`projects/${projectId}/repository/files/${encodeURIComponent(filename)}`);
        url.searchParams.set('ref', branch);
        return this.http.get<any>(url.href);
    }
}
