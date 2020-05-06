import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Alert } from './alert';

@Injectable({
    providedIn: 'root'
})
export class AlertsService {
    private subject = new BehaviorSubject<Alert[]>([]);

    constructor() { }

    getAlerts(): Observable<Alert[]> {
        return this.subject;
    }

    addAlert(alert: Alert) {
        const duplicateIndex = this.subject.value.findIndex(currentAlert => currentAlert.text === alert.text);
        let alerts;

        if (duplicateIndex !== -1) {
            const duplicate = this.subject.value[duplicateIndex];
            alert.count = duplicate.count ? duplicate.count + 1 : 2;
            alerts = this.subject.value.filter((el, index) => index !== duplicateIndex);
            alerts.push(alert);
        } else {
            alerts = [...this.subject.value, alert];
        }

        this.subject.next(alerts);
    }

    removeAlert(alertToRemove: Alert): void {
        const alerts = this.subject.value.filter(alert => alert !== alertToRemove);
        this.subject.next(alerts);
    }

    clearAlerts(): void {
        this.subject.next([]);
    }
}
