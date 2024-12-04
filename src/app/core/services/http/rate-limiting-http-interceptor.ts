import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpContextToken } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import RateLimiter from 'rxjs-ratelimiter';
import { SettingsService } from '../../../../app/settings/settings.service';

export const DISABLE_RATE_LIMIT: HttpContextToken<boolean> = new HttpContextToken(() => false);

@Injectable()
export class RateLimitingHttpInterceptor implements HttpInterceptor {

    private rateLimiter = new RateLimiter(400, 60000);

    constructor(settingsService: SettingsService) {
        settingsService.getSettings().subscribe((settings) => {
            this.rateLimiter = new RateLimiter(settings.search.requestRateLimit, 60000);
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return req.context.get(DISABLE_RATE_LIMIT)
            ? next.handle(req)
            : this.rateLimiter.limit(next.handle(req));
    }

}
