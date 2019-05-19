import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { Server } from './servers/server';
import { ServersService } from './servers/servers.service';
import { ModalService } from './common/modal/modal.service';
import { AddServerModalComponent } from './servers/add-server-modal/add-server-modal.component';
import { ServerModalInitData } from './servers/add-server-modal/server-modal-init-data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    servers: Server[];
    showAddServerModal = false;

    constructor(public serversService: ServersService, private modalService: ModalService,
                @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef) {
        this.servers = serversService.getServers();
    }

    ngOnInit(): void {
        this.modalService.setModalContainer(this.viewContainerRef);
    }

    openAddServerModal() {
        this.modalService.openModal(AddServerModalComponent, { mode: 'ADD' });
    }

    openEditServerModal(serverToEdit: Server) {
        const data : ServerModalInitData = { mode: 'EDIT', serverToEdit };
        this.modalService.openModal(AddServerModalComponent, data);
    }

    removeServer(server: Server) {
        this.serversService.removeServer(server);
    }
}
