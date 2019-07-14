import { Component, OnInit, OnDestroy } from '@angular/core';
import { Server } from 'selenium-webdriver/safari';
import { ServersService } from '../servers/servers.service';
import { SearchService } from './search.service';
import { FormBuilder } from '@angular/forms';
import { ProjectSearchResult } from './project-search-result';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { ModalService } from '../core/services/modal/modal.service';
import { FileViewerInitData } from '../shared/components/file-viewer/file-viewer-init-data';
import { FileViewerComponent } from '../shared/components/file-viewer/file-viewer.component';
import { Group } from '../core/services/gitlab-api/models/group';
import { GroupsApiService } from '../core/services/gitlab-api/groups-api.service';
import { map, filter, switchMap, finalize } from 'rxjs/operators';
import { ProjectsApiService } from '../core/services/gitlab-api/projects-api.service';
import { FileInProject } from './search-results-list/file-in-project';
import { Project } from '../core/services/gitlab-api/models/project';

enum ProjectsSearchType {
    ALL = 'ALL',
    BY_NAME = 'BY_NAME',
    SELECTED = 'SELECTED'
}

interface SearchTerms {
    group: string;
    projectsSearchType: ProjectsSearchType;
    projectName: string;
    projects: Project[];
    searchFilename: string;
    searchText: string;
}

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
    private static readonly ALL_GROUPS_ID = '-1';
    ProjectsSearchType = ProjectsSearchType;

    server: Server;
    groups: Group[] = [];
    projectsInSelectedGroup = [];
    groupsLoading = false;
    projectsLoading = false;
    searchTerms: SearchTerms;
    searchResults: ProjectSearchResult[] = [];
    searchSubscription: Subscription;
    searchInProgress = false;
    searchForm = this.formBuilder.group({
        group: [SearchComponent.ALL_GROUPS_ID],
        projectsSearchType: [ProjectsSearchType.ALL],
        projectName: [''],
        projects: [[]],
        searchFilename: [''],
        searchText: ['']
    });

    private activeServerSubscription: Subscription;
    private projectsSearchTypeSubscription: Subscription;

    constructor(
        private serversService: ServersService,
        private groupsApiService: GroupsApiService,
        private projectsApiService: ProjectsApiService,
        private searchService: SearchService,
        private formBuilder: FormBuilder,
        private modalService: ModalService
    ) {
        this.projectsSearchTypeSubscription = this.subscribeToProjectsToSearch();
    }

    ngOnInit(): void {
        this.activeServerSubscription = this.serversService.getActiveServer().subscribe(activeServer => {
            this.server = activeServer;
            if (this.server) {
                this.loadGroups();
                this.resetSearch();
            }
        });
    }

    ngOnDestroy(): void {
        this.activeServerSubscription.unsubscribe();
        this.projectsSearchTypeSubscription.unsubscribe();
    }

    openFile(fileInProject: FileInProject): void {
        const data: FileViewerInitData = { ...fileInProject, textToHighlight: this.searchTerms.searchText };
        this.modalService.openModal(FileViewerComponent, data);
    }

    search(): void {
        this.searchInProgress = true;
        this.searchResults = [];

        this.cancelSearch();

        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }

        this.searchTerms = this.searchForm.value;
        this.searchSubscription = this.makeSearch(this.searchTerms).subscribe(
            searchResult => this.onResultForProjectReceived(searchResult),
            error => error,
            () => this.searchInProgress = false
        );
    }

    private subscribeToProjectsToSearch() {
        return combineLatest([
            this.searchForm.controls.projectsSearchType.valueChanges,
            this.searchForm.controls.group.valueChanges
        ]).pipe(
            filter(([type]) => type === ProjectsSearchType.SELECTED),
            switchMap(([type, group]) => {
                this.searchForm.patchValue({projects: []});
                this.projectsInSelectedGroup = [];
                this.projectsLoading = true;
                return this.getProjectsOfGroup(group).pipe(finalize(() => this.projectsLoading = false));
            })
        ).subscribe(
            (projects) => this.projectsInSelectedGroup = this.projectsInSelectedGroup.concat(projects),
            (error) => this.projectsLoading = false
        );
    }

    private makeSearch(terms: SearchTerms): Observable<ProjectSearchResult> {
        if (terms.projectsSearchType === ProjectsSearchType.ALL) {
            return this.searchService.searchInGroup(terms.group, undefined, terms.searchText, terms.searchFilename);
        } else if (terms.projectsSearchType === ProjectsSearchType.SELECTED) {
            return this.searchService.searchInProjects(terms.projects, terms.searchText, terms.searchFilename);
        } else {
            return this.searchService.searchInGroup(terms.group, terms.projectName, terms.searchText, terms.searchFilename);
        }
    }

    private getProjectsOfGroup(groupId: string) {
        if (groupId === SearchComponent.ALL_GROUPS_ID) {
            return this.projectsApiService.getProjects();
        } else {
            return this.groupsApiService.getProjectsOfGroupDeep(groupId);
        }
    }

    private resetSearch(): void {
        this.searchResults = [];
        this.cancelSearch();
        this.searchInProgress = false;
        this.searchForm.setValue({
            group: SearchComponent.ALL_GROUPS_ID,
            projectsSearchType: ProjectsSearchType.ALL,
            projectName: '',
            projects: [],
            searchFilename: '',
            searchText: ''
        });
    }

    private loadGroups(): void {
        this.groupsLoading = true;
        this.groups = [];
        this.groupsApiService.getGroups()
            .pipe(map(groups => groups.sort((group1, group2) => group1.full_name.localeCompare(group2.full_name))))
            .subscribe(
                groups => this.groups = groups,
                error => this.groupsLoading = false,
                () => this.groupsLoading = false
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
