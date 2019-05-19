import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServersModule } from './servers/servers.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ClarityModule,
        BrowserAnimationsModule,

        ServersModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
