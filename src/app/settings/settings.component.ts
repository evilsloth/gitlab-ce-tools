import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Modal } from '../core/services/modal/modal';
import { SettingsService } from './settings.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends Modal<any> implements OnInit, OnDestroy {
    private settingsSubscription: Subscription;

    settingsForm = this.formBuilder.group({
        fileViewer: this.formBuilder.group({
            fullScreen: [false],
            wrapLines: [false]
        }),
        search: this.formBuilder.group({
            rememberLastSearch: [false],
            searchResultsView: ['FLAT']
        })
    });

    constructor(private formBuilder: FormBuilder, private settingsService: SettingsService) {
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
        this.close();
    }
}
