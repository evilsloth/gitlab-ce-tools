import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FileViewerComponent } from './components/file-viewer/file-viewer.component';
import { ServerNotSelectedAlertComponent } from './components/server-not-selected-alert/server-not-selected-alert.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
    imports: [CommonModule, ClarityModule],
    declarations: [FileViewerComponent, ServerNotSelectedAlertComponent],
    exports: [
        FileViewerComponent,
        ServerNotSelectedAlertComponent,

        CommonModule,
        ReactiveFormsModule,
        ClarityModule
    ],
    entryComponents: [FileViewerComponent]
})
export class SharedModule {}
