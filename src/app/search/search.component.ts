import { Component, OnInit, OnDestroy } from '@angular/core';
import { Server } from 'selenium-webdriver/safari';
import { ServersService } from '../servers/servers.service';
import { GroupsApiService } from '../gitlab-api/groups-api.service';
import { Group } from '../gitlab-api/models/group';
import { SearchService } from './search.service';
import { FormBuilder } from '@angular/forms';
import { ProjectSearchResult } from './project-search-result';
import { Subscription } from 'rxjs';
import { FileViewerInitData } from '../file-viewer/file-viewer-init-data';
import { FileViewerComponent } from '../file-viewer/file-viewer.component';
import { ModalService } from '../common/modal/modal.service';
import { Project } from '../gitlab-api/models/project';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
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

    private activeServerSubscription: Subscription;

    constructor(
        private serversService: ServersService,
        private groupsApiService: GroupsApiService,
        private searchService: SearchService,
        private formBuilder: FormBuilder,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.activeServerSubscription = this.serversService.getActiveServer().subscribe(activeServer => {
            this.server = activeServer;
            if (this.server) {
                this.loadGroups(); // TODO: prevent active server unsubscription on load groups error!!!
                this.resetSearch();
            }
        });
    }

    ngOnDestroy(): void {
        this.activeServerSubscription.unsubscribe();
    }

    openFile(filename: string, project: Project): void {
        const data: FileViewerInitData = { filename, project };
        this.modalService.openModal(FileViewerComponent, data);
    }

    search(): void {
        this.searchInProgress = true;
        this.searchResults = [];

        this.cancelSearch();

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

    private resetSearch(): void {
        this.searchResults = [];
        this.cancelSearch();
        this.searchInProgress = false;
        this.searchForm.setValue({group: -1, projectName: '', searchText: ''});
    }

    private loadGroups(): void {
        this.groups = [];
        this.groupsApiService.getGroups().subscribe(
            groups => this.groups = groups,
            error => error // TODO: handle errors
        );
    }

    private onResultForProjectReceived(result: ProjectSearchResult): void {
        if (result.fileSearchResults && result.fileSearchResults.size > 0) {
            this.searchResults.push(result);
        }
    }

    private cancelSearch(): void {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }
}
