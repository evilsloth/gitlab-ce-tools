import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Modal } from '../core/services/modal/modal';
import { SettingsService } from './settings.service';
import { Subscription } from 'rxjs';
import { HistoryStoreService } from '../core/services/history-store/history-store.service';
import { ElectronIpcService } from '../core/services/ipc/electron-ipc.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends Modal<any> implements OnInit, OnDestroy {

    appRunningInElectron: boolean;

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
            showTotalHitsCount: [false],
            includeArchived: [false],
            requestRateLimit: [400, [Validators.required, Validators.min(0)]],
            concurrentSearchRequests: [5, [Validators.required, Validators.min(0)]],
            requestRetryCount: [10, [Validators.required, Validators.min(0)]],
            requestRetryDelay: [10, [Validators.required, Validators.min(0)]],
            disableRateLimitOnFile: [false]
        }),
        electron: this.formBuilder.group({
            enableUnsafeRequests: [false]
        })
    });

    private settingsSubscription: Subscription;

    constructor(
        public historyStoreService: HistoryStoreService,
        private formBuilder: FormBuilder,
        private settingsService: SettingsService,
        private electronIpcService: ElectronIpcService
    ) {
        super();
        this.appRunningInElectron = electronIpcService.isElectron();
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
        this.electronIpcService.send('SETTINGS_CHANGED', this.settingsForm.value.electron);

        this.close();
    }

}
