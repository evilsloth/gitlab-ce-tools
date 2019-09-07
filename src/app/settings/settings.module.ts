import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings.component';

@NgModule({
    declarations: [SettingsComponent],
    imports: [
        SharedModule
    ],
    entryComponents: [SettingsComponent]
})
export class SettingsModule { }
