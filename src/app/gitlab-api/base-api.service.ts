import { Injectable } from '@angular/core';
import { ServersService } from '../servers/servers.service';
import { Server } from '../servers/server';

@Injectable({
    providedIn: 'root'
})
export class BaseApiService {
    private server: Server;

    constructor(serversService: ServersService) {
        this.server = serversService.getActiveServer();
    }

    getUrl(path: string): URL {
        const baseUrl: URL = new URL('/api/v4/', this.server.url);
        const apiUrl: URL = new URL(path, baseUrl.href);
        apiUrl.searchParams.set('private_token', this.server.token);
        return apiUrl;
    }
}
