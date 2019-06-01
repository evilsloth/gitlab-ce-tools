import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Alert } from 'src/app/core/services/alerts/alert';

@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
    @Input()
    alerts: Alert[];

    @Output()
    closeAlert = new EventEmitter<Alert>();

    constructor() { }

    onCloseAlert(alert: Alert): void {
        this.closeAlert.emit(alert);
    }
}
