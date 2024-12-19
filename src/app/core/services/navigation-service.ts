import { Injectable } from '@angular/core';



@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    public openInNewWindow(url: URL): void {
        window.open(url, '_blank');
    }

    public openInSameWindow(url: URL): void {
        window.open(url, '_self');
    }

}
