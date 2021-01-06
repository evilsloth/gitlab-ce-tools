import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-hits-count',
    templateUrl: './hits-count.component.html',
    styleUrls: ['./hits-count.component.scss']
})
export class HitsCountComponent {

    @Input()
    fileHitsCount: number;

    @Input()
    totalHitsCount: number;

    constructor() { }

}
