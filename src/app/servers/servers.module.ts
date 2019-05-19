import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddServerModalComponent } from './add-server-modal/add-server-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [AddServerModalComponent],
    imports: [
        BrowserModule,
        ClarityModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
    ],
    entryComponents: [AddServerModalComponent]
})
export class ServersModule { }
