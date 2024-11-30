import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { AlertsService } from '../alerts/alerts.service';
import { catchError, mergeMap, retryWhen } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { SettingsService } from '../../../settings/settings.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    private retryParams: RetryParams = { count: 10, delayMs: 10_000 };

    constructor(private alertsService: AlertsService, settingsService: SettingsService) {
        settingsService.getSettings().subscribe((settings) => {
            this.retryParams = {
                count: settings.search.requestRetryCount,
                delayMs: settings.search.requestRetryDelay * 1000
            };
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            retryWhen(retryWithDelay(this.retryParams)),
            catchError((error: any) => {
                if (error instanceof HttpErrorResponse) {
                    this.alertsService.addAlert({
                        type: 'danger',
                        text: 'Service call error: ' + (error.error.message || error.error.error || error.statusText)
                    });
                } else {
                    this.alertsService.addAlert({ type: 'danger', text: 'Service call error: ' + error });
                }

                return of(error);
            })
        );
    }

}

interface RetryParams {
    count: number;
    delayMs: number;
}

const retryWithDelay = (retryParams: RetryParams) => (attempts: Observable<any>) => attempts.pipe(
    mergeMap((error, retryAttempt) => {
        if (retryAttempt >= retryParams.count) {
            return throwError(error);
        }

        return timer(retryParams.delayMs);
    })
);
