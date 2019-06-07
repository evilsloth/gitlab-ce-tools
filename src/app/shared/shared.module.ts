import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileViewerComponent } from './components/file-viewer/file-viewer.component';
import { ServerNotSelectedAlertComponent } from './components/server-not-selected-alert/server-not-selected-alert.component';
import { ClarityModule } from '@clr/angular';
import { AlertsComponent } from './components/alerts/alerts.component';
import { PathTextComponent } from './components/path-text/path-text.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
    imports: [CommonModule, ClarityModule],
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
        ClarityModule
    ],
    entryComponents: [FileViewerComponent, ConfirmationDialogComponent]
})
export class SharedModule {}
