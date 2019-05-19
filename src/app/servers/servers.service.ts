import { Injectable } from '@angular/core';
import { Server } from './server';

@Injectable({
    providedIn: 'root'
})
export class ServersService {
    private static readonly LIST_STORAGE_KEY = 'sv_list';
    private static readonly SELECTED_STORAGE_KEY = 'sv_sel_name';

    private servers: Server[];
    private activeServer: Server;

    constructor() {
        this.servers = this.getListFromStorage();
        const activeName = this.getActiveNameFromStorage();
        if (activeName) {
            this.activeServer = this.findByName(activeName);
        }
    }

    selectActiveServer(name: string): void {
        this.activeServer = this.findByName(name);
        this.saveActiveNameToStorage();
    }

    getActiveServer(name: string): Server {
        return this.activeServer;
    }

    isActive(name: string): boolean {
        return this.activeServer && this.activeServer.name === name;
    }

    addServer(server: Server): void {
        const serverOfName = this.findByName(server.name);
        if (serverOfName) {
            throw new Error('SERVER_ALREADY_EXIST');
        }

        this.servers.push(server);
        this.saveListToStorage();
    }

    editServer(server: Server): void {
        const serverOfName = this.findByName(server.name);
        Object.assign(serverOfName, server);
        this.saveListToStorage();
    }

    removeServer(serverToRemove: Server) {
        if (this.isActive(serverToRemove.name)) {
            this.activeServer = undefined;
        }

        const index = this.servers.indexOf(serverToRemove);
        this.servers = this.servers.splice(index, 1);
        this.saveListToStorage();
    }

    getServers(): Server[] {
        return this.servers;
    }

    private findByName(name: string): Server {
        return this.servers.find(server => server.name === name);
    }

    private getListFromStorage(): Server[] {
        const storageData = localStorage.getItem(ServersService.LIST_STORAGE_KEY);

        if (!storageData) {
            return [];
        }

        return JSON.parse(storageData);
    }

    private saveListToStorage(): void {
        localStorage.setItem(ServersService.LIST_STORAGE_KEY, JSON.stringify([...this.servers]));
    }

    private getActiveNameFromStorage(): string {
        return localStorage.getItem(ServersService.SELECTED_STORAGE_KEY);
    }

    private saveActiveNameToStorage(): void {
        localStorage.setItem(ServersService.SELECTED_STORAGE_KEY, this.activeServer.name);
    }
}
