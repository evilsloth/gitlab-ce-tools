import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class ElectronIpcService {

    private _isElectron: boolean;

    private ipcRenderer: IpcRenderer | null;

    constructor() {
        this._isElectron = this.isAppRunningInElectron();
        if (this.isElectron) {
            this.ipcRenderer = this.getIpcRenderer();
        }
    }

    send(channel: string, message: any) {
        if (this._isElectron) {
            this.ipcRenderer?.send(channel, message);
            console.log(this.ipcRenderer);
        }
    }

    sendToHost(channel: string, message: any) {
        if (this._isElectron) {
            this.ipcRenderer?.sendToHost(channel, message);
            console.log(this.ipcRenderer);
        }
    }

    isElectron(): boolean {
        return this._isElectron;
    }

    private isAppRunningInElectron(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.indexOf(' electron/') > -1;
    }

    private getIpcRenderer(): IpcRenderer | null {
        if (window.require) {
            try {
                return window.require('electron').ipcRenderer;
            } catch (e) {
                console.warn('Electron\'s IPC could not be loaded: ' + e);
                return null;
            }
        } else {
            console.warn('Electron\'s IPC could not be loaded: no require defined');
            return null;
        }
    }

}
