import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { Server } from './servers/server';
import { ServersService } from './servers/servers.service';
import { AddServerModalComponent } from './servers/add-server-modal/add-server-modal.component';
import { ServerModalInitData } from './servers/add-server-modal/server-modal-init-data';
import { Observable } from 'rxjs';
import { ModalService } from './core/services/modal/modal.service';
import { AlertsService } from './core/services/alerts/alerts.service';
import { Alert } from './core/services/alerts/alert';
import { SettingsComponent } from './settings/settings.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    servers$: Observable<Server[]>;
    activeServer$: Observable<Server>;
    alerts$: Observable<Alert[]>;

    constructor(
        public serversService: ServersService,
        public alertsService: AlertsService,
        private modalService: ModalService,
        @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef) { }

    ngOnInit(): void {
        this.modalService.setModalContainer(this.viewContainerRef);
        this.servers$ = this.serversService.getServers();
        this.activeServer$ = this.serversService.getActiveServer();
        this.alerts$ = this.alertsService.getAlerts();
    }

    openAddServerModal() {
        this.modalService.openModal(AddServerModalComponent, { mode: 'ADD' });
    }

    openEditServerModal(event: Event, serverToEdit: Server) {
        this.stopEventPropagation(event);
        const data: ServerModalInitData = { mode: 'EDIT', serverToEdit };
        this.modalService.openModal(AddServerModalComponent, data);
    }

    removeServer(event: Event, server: Server) {
        this.stopEventPropagation(event);
        this.modalService.openConfirmationDialog({
            title: 'Delete server',
            message: `Are you sure you want to delete server configuration "${server.name}"?`,
            confirmText: 'DELETE'
        }).then(() => this.serversService.removeServer(server), () => {});
    }

    selectActiveServer(server: Server) {
        this.serversService.selectActiveServer(server.name);
    }

    openSettingsModal() {
        this.modalService.openModal(SettingsComponent);
    }

    /**
     * Prevents event propagation so click is only received by the button and not its container.
     *
     * @param event event to stop propagation of
     */
    private stopEventPropagation(event: Event) {
        event.stopPropagation();
    }
}
