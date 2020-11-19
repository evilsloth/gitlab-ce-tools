import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
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
import { Server } from '../servers/server';
import { SettingsService } from '../settings/settings.service';
import { FileTreeLeaf } from './search-results-list/tree/file-tree-leaf';
import {
    buildFileTreeForProject,
    buildFlatFileTreeForProject,
    buildCompactFileTreeForProject
} from './search-results-list/tree/file-tree-builder';
import { SearchResultsView } from '../settings/settings';
import { HistoryStoreService } from '../core/services/history-store/history-store.service';

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
    private static readonly SEARCH_SAVE_STORAGE_KEY = 'saved_search';
    private static readonly ALL_GROUPS_ID = '-1';
    ProjectsSearchType = ProjectsSearchType;

    server: Server;
    groups: Group[] = [];
    projectsInSelectedGroup = [];
    groupsLoading = false;
    projectsLoading = false;
    enableResultHiding = false;
    showFileHitsCount = false;
    showTotalHitsCount = false;
    searchTerms: SearchTerms;
    searchResults: ProjectSearchResult[] = [];
    searchResultsTree: FileTreeLeaf[] = [];
    searchResultsView: SearchResultsView;
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

    @ViewChild('searchTextInput')
    searchTextInput: ElementRef;

    private activeServerSubscription: Subscription;
    private projectsSearchTypeSubscription: Subscription;
    private settingsSubscription: Subscription;

    constructor(
        public historyStoreService: HistoryStoreService,
        private serversService: ServersService,
        private groupsApiService: GroupsApiService,
        private projectsApiService: ProjectsApiService,
        private searchService: SearchService,
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private settingsService: SettingsService
    ) {
        this.projectsSearchTypeSubscription = this.subscribeToProjectsToSearch();
    }

    ngOnInit(): void {
        this.activeServerSubscription = this.serversService.getActiveServer().subscribe(activeServer => {
            this.server = activeServer;
            if (this.server) {
                this.loadGroups();
                this.resetSearch();

                if (this.settingsService.getCurrentSettings().search.rememberLastSearch) {
                    this.patchSavedSearch();
                }
            }
        });

        this.settingsSubscription = this.settingsService.getSettings().subscribe(settings => {
            this.searchResultsView = settings.search.searchResultsView;
            this.enableResultHiding = settings.search.enableResultHiding;
            this.showFileHitsCount = settings.search.showFileHitsCount;
            this.showTotalHitsCount = settings.search.showTotalHitsCount;
            this.rebuildSearchResultsTree();
        });
    }

    ngOnDestroy(): void {
        this.activeServerSubscription.unsubscribe();
        this.projectsSearchTypeSubscription.unsubscribe();
        this.settingsSubscription.unsubscribe();
    }

    openFile(fileInProject: FileInProject): void {
        const data: FileViewerInitData = { ...fileInProject, textToHighlight: this.searchTerms.searchText };
        this.modalService.openModal(FileViewerComponent, data);
    }

    search(): void {
        this.searchInProgress = true;
        this.searchResults = [];
        this.searchResultsTree = [];

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

        this.addToSearchHistory(this.searchTerms.searchText);
    }

    private addToSearchHistory(text: string) {
        if (!this.searchForm.value.searchText) {
            return;
        }
        const searchTextHasFocus = document.activeElement === this.searchTextInput.nativeElement;
        if (searchTextHasFocus) {
            // prevents displaying recently added text to history just after enter press
            this.searchTextInput.nativeElement.blur();
        }
        this.historyStoreService.add(this.searchForm.value.searchText);
        if (searchTextHasFocus) {
            setTimeout(() =>  this.searchTextInput.nativeElement.focus());
        }
    }

    private subscribeToProjectsToSearch() {
        return combineLatest([
            this.searchForm.controls.projectsSearchType.valueChanges,
            this.searchForm.controls.group.valueChanges
        ]).pipe(
            filter(([type]) => type === ProjectsSearchType.SELECTED),
            switchMap(([type, group]) => {
                this.searchForm.patchValue({ projects: [] });
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
        this.saveSearch(this.server.name, terms);

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
        this.searchResultsTree = [];
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

    private rebuildSearchResultsTree(): void {
        this.searchResultsTree = this.searchResults.map(result => this.buildSearchResultsTree(result));
    }

    private buildSearchResultsTree(searchResult: ProjectSearchResult): FileTreeLeaf {
        if (this.searchResultsView === 'FLAT') {
            return buildFlatFileTreeForProject(searchResult);
        } else if (this.searchResultsView === 'TREE') {
            return buildFileTreeForProject(searchResult);
        } else if (this.searchResultsView === 'COMPACT_TREE') {
            return buildCompactFileTreeForProject(searchResult);
        }

        throw new Error('Unhandled search results view: ' + this.searchResultsView);
    }

    private patchSavedSearch(): void {
        const savedSearch: any = this.getSavedSearch(this.server.name) || {};
        // TODO: add validation (do group and projects still exist?)
        this.searchForm.patchValue(savedSearch);
    }

    private onResultForProjectReceived(result: ProjectSearchResult): void {
        if (result.fileSearchResults && result.fileSearchResults.size > 0) {
            this.searchResults.push(result);
            this.searchResultsTree = [...this.searchResultsTree, this.buildSearchResultsTree(result)];
        }
    }

    private cancelSearch(): void {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }

    private saveSearch(serverName: string, searchTerms: SearchTerms): void {
        const savedSearches = this.getSavedSearches();
        savedSearches[serverName] = searchTerms;
        localStorage.setItem(SearchComponent.SEARCH_SAVE_STORAGE_KEY, JSON.stringify(savedSearches));
    }

    private getSavedSearch(serverName: string): SearchTerms {
        const savedSearches = this.getSavedSearches();
        return savedSearches[serverName];
    }

    private getSavedSearches(): { [key: string]: SearchTerms } {
        const savedSearches = localStorage.getItem(SearchComponent.SEARCH_SAVE_STORAGE_KEY);
        return savedSearches ? JSON.parse(savedSearches) : {};
    }
}
