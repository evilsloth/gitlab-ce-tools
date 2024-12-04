import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from './models/file';
import { AriaBooleanAttributeValues } from '@cds/core/internal';
import { SettingsService } from 'src/app/settings/settings.service';
import { DISABLE_RATE_LIMIT } from '../http/rate-limiting-http-interceptor';

@Injectable({
    providedIn: 'root'
})
export class FilesApiService {

    private disableRateLimit: boolean;

    constructor(
        private baseApiService: BaseApiService,
        private http: HttpClient,
        private settingsService: SettingsService
    ) {
        settingsService.getSettings().subscribe((settings) =>
            this.disableRateLimit = settings.search.disableRateLimitOnFile);
    }

    getFile(projectId: string|number, branch: string, filename: string): Observable<File> {
        const url = this.baseApiService.getUrl(`projects/${projectId}/repository/files/${encodeURIComponent(filename)}`);
        url.searchParams.set('ref', branch);
        return this.http.get<any>(url.href, {context: new HttpContext().set(DISABLE_RATE_LIMIT, this.disableRateLimit)});
    }
}
