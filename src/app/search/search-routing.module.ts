import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';

const routes: Routes = [
    { path: 'search', component: SearchComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class SearchRoutingModule {}
