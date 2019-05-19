import { Component, OnInit } from '@angular/core';
import { Server } from 'selenium-webdriver/safari';
import { ServersService } from '../servers/servers.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    server: Server;

    constructor(private serversService: ServersService) {}

    ngOnInit() {
        this.server = this.serversService.getActiveServer();
    }
}
