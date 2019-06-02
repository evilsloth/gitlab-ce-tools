import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AlertsService } from '../alerts/alerts.service';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private alertsService: AlertsService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error: any) => {
            if (error instanceof HttpErrorResponse) {
                this.alertsService.addAlert({type: 'danger', text: 'Service call error: ' + (error.error.message || error.error.error)});
            } else {
                this.alertsService.addAlert({type: 'danger', text: 'Service call error: ' + error});
            }

            return of(error);
        }));
    }

}
