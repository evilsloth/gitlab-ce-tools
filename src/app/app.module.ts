import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServersModule } from './servers/servers.module';
import { SearchComponent } from './search/search.component';
import { AppRoutingModule } from './app-routing.module';
import { ServerNotSelectedAlertComponent } from './common/server-not-selected-alert/server-not-selected-alert.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FileViewerComponent } from './file-viewer/file-viewer.component';

@NgModule({
    declarations: [
        AppComponent,
        SearchComponent,
        ServerNotSelectedAlertComponent,
        FileViewerComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        ClarityModule,
        HttpClientModule,
        ReactiveFormsModule,

        AppRoutingModule,
        ServersModule
    ],
    providers: [],
    entryComponents: [FileViewerComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
