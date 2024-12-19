import { Injectable } from '@angular/core';
import { ProjectSearchResult } from 'src/app/search/project-search-result';
import { saveAs } from 'file-saver';
import { stringify } from '@vanillaes/csv';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    private readonly headers = ['project', 'file'];
    private readonly fileName = `search.txt`;

    export(projectSearchResult: ProjectSearchResult[]): void {
        const rows =  this.extractRows(projectSearchResult);
        const rowsWithHeader = [this.headers , ...rows];
        const csvTxt = stringify(rowsWithHeader);
        const csvBlob = new Blob([csvTxt], {type: 'text/plain;charset=utf-8'});
        saveAs(csvBlob, this.fileName);
    }

    private extractRows(projectSearchResults: ProjectSearchResult[]): string[][] {
        const exportRows: string[][] = [];
        projectSearchResults.forEach((projectSearchResult) => {
            projectSearchResult.fileSearchResults.forEach((_, filename) => {
                exportRows.push([
                    projectSearchResult.project.path_with_namespace,
                    filename
                ]);
            });
        });
        return exportRows;
    }
}
