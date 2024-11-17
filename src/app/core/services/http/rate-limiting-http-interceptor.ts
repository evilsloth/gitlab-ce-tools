import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import RateLimiter from 'rxjs-ratelimiter';
import { SettingsService } from '../../../../app/settings/settings.service';

@Injectable()
export class RateLimitingHttpInterceptor implements HttpInterceptor {

    private rateLimiter = new RateLimiter(400, 61000);

    constructor(settingsService: SettingsService) {
        settingsService.getSettings().subscribe((settings) => {
            this.rateLimiter = new RateLimiter(settings.search.requestRateLimit, 61000);
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.rateLimiter.limit(next.handle(req));
    }

}
