import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Modal } from '../core/services/modal/modal';
import { SettingsService } from './settings.service';
import { Subscription } from 'rxjs';
import { ElectronSettings } from './settings';
import { IpcRenderer } from 'electron';
import { HistoryStoreService } from '../core/services/history-store/history-store.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends Modal<any> implements OnInit, OnDestroy {

    appRunningInElectron = this.isAppRunningInElectron();

    private settingsSubscription: Subscription;

    settingsForm = this.formBuilder.group({
        fileViewer: this.formBuilder.group({
            fullScreen: [false],
            wrapLines: [false]
        }),
        search: this.formBuilder.group({
            rememberLastSearch: [false],
            enableSearchHistory: [false],
            historyElementCount: [10, [Validators.required, Validators.min(0)]],
            enableResultHiding: [false],
            searchResultsView: ['FLAT'],
            showFileHitsCount: [false],
            showTotalHitsCount: [false]
        }),
        electron: this.formBuilder.group({
            enableUnsafeRequests: [false]
        })
    });

    constructor(
        public historyStoreService: HistoryStoreService,
        private formBuilder: FormBuilder,
        private settingsService: SettingsService) {
        super();
    }

    ngOnInit() {
        this.settingsSubscription = this.settingsService.getSettings()
            .subscribe(settings => this.settingsForm.setValue(settings));
    }

    ngOnDestroy(): void {
        this.settingsSubscription.unsubscribe();
    }

    save() {
        this.settingsService.updateSettings(this.settingsForm.value);
        if (this.appRunningInElectron) {
            this.sendChangedSettingsToElectron(this.settingsForm.value.electron);
        }

        this.close();
    }

    private isAppRunningInElectron(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.indexOf(' electron/') > -1;
    }

    private sendChangedSettingsToElectron(electronSettings: ElectronSettings) {
        if (window.require) {
            try {
                const ipcRenderer: IpcRenderer = window.require('electron').ipcRenderer;
                ipcRenderer.send('SETTINGS_CHANGED', electronSettings);
            } catch (e) {
                throw e;
            }
        } else {
            console.warn('Electron\'s IPC could not be loaded!');
        }
    }

}
