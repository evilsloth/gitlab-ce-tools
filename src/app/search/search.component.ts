import { Component, OnInit } from '@angular/core';
import { Server } from 'selenium-webdriver/safari';
import { ServersService } from '../servers/servers.service';
import { GroupsApiService } from '../gitlab-api/groups-api.service';
import { Group } from '../gitlab-api/models/group';
import { SearchService } from './search.service';
import { FormBuilder } from '@angular/forms';
import { ProjectSearchResult } from './project-search-result';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    server: Server;
    groups: Group[] = [];
    searchResults: ProjectSearchResult[] = [];
    searchSubscription: Subscription;
    searchInProgress = false;
    searchForm = this.formBuilder.group({
        group: [-1],
        projectName: [''],
        searchText: ['']
    });

    constructor(
        private serversService: ServersService,
        private groupsApiService: GroupsApiService,
        private searchService: SearchService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.server = this.serversService.getActiveServer();
        if (this.server) {
            this.groupsApiService.getGroups().subscribe(groups => {
                this.groups = groups;
            });
        }
    }

    search() {
        this.searchInProgress = true;
        this.searchResults = [];

        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }

        const terms = this.searchForm.value;
        this.searchSubscription = this.searchService.search(terms.group, terms.projectName, terms.searchText)
            .subscribe(
                searchResult => this.onResultForProjectReceived(searchResult),
                error => error, // TODO: handle errors
                () => this.searchInProgress = false
            );
    }

    private onResultForProjectReceived(result: ProjectSearchResult) {
        if (result.fileSearchResults && result.fileSearchResults.length > 0) {
            // TODO: filter file duplicates
            this.searchResults.push(result);
        }
    }
}
