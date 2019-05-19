import { Component, OnInit } from '@angular/core';
import { Server } from 'selenium-webdriver/safari';
import { ServersService } from '../servers/servers.service';
import { GroupsApiService } from '../gitlab-api/groups-api.service';
import { Group } from '../gitlab-api/models/group';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    server: Server;
    groups: Group[] = [];

    constructor(private serversService: ServersService, private groupsApiService: GroupsApiService) {}

    ngOnInit() {
        this.server = this.serversService.getActiveServer();
        this.groupsApiService.getGroups().subscribe(groups => {
            this.groups = groups;
        });
    }
}
