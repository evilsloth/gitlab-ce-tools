import { HttpResponse } from '@angular/common/http';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

export function mergePages(dataProvider: (url: URL) => Observable<HttpResponse<any[]>>, url: URL): Observable<any[]> {
    return dataProvider(url).pipe(mergeMap((response: HttpResponse<any>) => {
        const pagesCount = parseInt(response.headers.get('x-total-pages'), 10);
        const pagesObservables = [];

        if (pagesCount > 1) {
            for (let i = 2; i <= pagesCount; i++) {
                const pagedUrl = new URL('', url);
                pagedUrl.searchParams.set('page', i.toString());
                pagesObservables.push(dataProvider(pagedUrl).pipe(map(httpResponse => httpResponse.body)));
            }
        }

        return zip(of(response.body), ...pagesObservables).pipe(map(data => (data as any).flat()));
    }));
}
