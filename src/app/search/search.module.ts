import { NgModule } from '@angular/core';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SharedModule } from '../shared/shared.module';
import { SearchResultsListComponent } from './search-results-list/search-results-list.component';
import { HitsCountComponent } from './search-results-list/hits-count/hits-count.component';

@NgModule({
  declarations: [SearchComponent, SearchResultsListComponent, HitsCountComponent],
  imports: [
    SharedModule,
    SearchRoutingModule
  ]
})
export class SearchModule { }
