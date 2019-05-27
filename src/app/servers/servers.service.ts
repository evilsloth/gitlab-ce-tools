import { Injectable } from '@angular/core';
import { Server } from './server';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServersService {
    private static readonly LIST_STORAGE_KEY = 'sv_list';
    private static readonly SELECTED_STORAGE_KEY = 'sv_sel_name';

    private servers$: BehaviorSubject<Server[]>;
    private activeServer$: BehaviorSubject<Server>;

    constructor() {
        const servers = this.getListFromStorage();
        const activeName = this.getActiveNameFromStorage();
        const activeServer = activeName ? this.findByName(servers, activeName) : undefined;
        this.servers$ = new BehaviorSubject<Server[]>(servers);
        this.activeServer$ = new BehaviorSubject<Server>(activeServer);
    }

    getActiveServer(): Observable<Server> {
        return this.activeServer$;
    }

    getServers(): Observable<Server[]> {
        return this.servers$;
    }

    selectActiveServer(name: string): void {
        const servers = this.getListFromStorage();
        const newActive = this.findByName(servers, name);

        if (!newActive) {
            throw Error('Server does not exist');
        }

        this.saveActiveNameToStorage(name);
        this.activeServer$.next(newActive);
    }

    addServer(server: Server): void {
        const servers = this.getListFromStorage();
        const serverOfName = this.findByName(servers, server.name);
        if (serverOfName) {
            throw new Error('Server with a given name already exist');
        }

        const newServers = [...servers, server];
        this.saveListToStorage(newServers);
        this.servers$.next(newServers);
    }

    editServer(server: Server): void {
        const servers = this.getListFromStorage();
        const serverOfName = this.findByName(servers, server.name);

        if (!serverOfName) {
            throw Error('Server does not exist');
        }

        const editedServer = Object.assign(serverOfName, server);
        this.saveListToStorage(servers);
        this.servers$.next(servers);

        if (this.isActive(server.name)) {
            this.activeServer$.next(editedServer);
        }
    }

    removeServer(serverToRemove: Server): void {
        const servers = this.getListFromStorage();
        const filteredServers = servers.filter(server => server.name !== serverToRemove.name);
        this.saveListToStorage(filteredServers);

        if (this.isActive(serverToRemove.name)) {
            this.saveActiveNameToStorage(undefined);
            this.activeServer$.next(undefined);
        }

        this.servers$.next(filteredServers);
    }

    private isActive(name: string): boolean {
        const currentActive = this.activeServer$.getValue();
        return currentActive && currentActive.name === name;
    }

    private findByName(servers: Server[], name: string): Server {
        return servers.find(server => server.name === name);
    }

    private getListFromStorage(): Server[] {
        const storageData = localStorage.getItem(ServersService.LIST_STORAGE_KEY);
        return storageData ? JSON.parse(storageData) : [];
    }

    private saveListToStorage(servers: Server[]): void {
        localStorage.setItem(ServersService.LIST_STORAGE_KEY, JSON.stringify(servers));
    }

    private getActiveNameFromStorage(): string {
        return localStorage.getItem(ServersService.SELECTED_STORAGE_KEY);
    }

    private saveActiveNameToStorage(name: string): void {
        localStorage.setItem(ServersService.SELECTED_STORAGE_KEY, name);
    }
}
