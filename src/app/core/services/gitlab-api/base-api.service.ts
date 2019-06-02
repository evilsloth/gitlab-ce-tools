import { Injectable } from '@angular/core';
import { Server } from 'src/app/servers/server';
import { ServersService } from 'src/app/servers/servers.service';

@Injectable({
    providedIn: 'root'
})
export class BaseApiService {
    private server: Server;

    constructor(serversService: ServersService) {
        serversService.getActiveServer().subscribe(server => this.server = server);
    }

    getUrl(path: string): URL {
        if (!this.server) {
            throw new Error('Active server has not been selected');
        }

        const baseUrl: URL = new URL('/api/v4/', this.server.url);
        const apiUrl: URL = new URL(path, baseUrl.href);
        apiUrl.searchParams.set('private_token', this.server.token);
        return apiUrl;
    }
}
