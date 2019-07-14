import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileViewerComponent } from './components/file-viewer/file-viewer.component';
import { ServerNotSelectedAlertComponent } from './components/server-not-selected-alert/server-not-selected-alert.component';
import { ClarityModule } from '@clr/angular';
import { AlertsComponent } from './components/alerts/alerts.component';
import { PathTextComponent } from './components/path-text/path-text.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AceModule } from 'ngx-ace-wrapper';
import { ACE_CONFIG } from 'ngx-ace-wrapper';
import { AceConfigInterface } from 'ngx-ace-wrapper';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {
    showPrintMargin: false,
    fontSize: 14
};

@NgModule({
    imports: [CommonModule, ClarityModule, AceModule],
    declarations: [
        FileViewerComponent,
        ServerNotSelectedAlertComponent,
        AlertsComponent,
        PathTextComponent,
        ConfirmationDialogComponent
    ],
    exports: [
        FileViewerComponent,
        ServerNotSelectedAlertComponent,
        AlertsComponent,
        PathTextComponent,

        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ClarityModule,
        NgSelectModule
    ],
    providers: [
        {
            provide: ACE_CONFIG,
            useValue: DEFAULT_ACE_CONFIG
        }
    ],
    entryComponents: [FileViewerComponent, ConfirmationDialogComponent]
})
export class SharedModule { }
