import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServersModule } from './servers/servers.module';
import { SearchComponent } from './search/search.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [
        AppComponent,
        SearchComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        SharedModule,
        AppRoutingModule,
        ServersModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
