import { NgModule } from '@angular/core';
import { AddServerModalComponent } from './add-server-modal/add-server-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [AddServerModalComponent],
    imports: [
        SharedModule
    ],
    entryComponents: [AddServerModalComponent]
})
export class ServersModule { }
