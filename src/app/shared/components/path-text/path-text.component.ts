import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-path-text',
    templateUrl: './path-text.component.html',
    styleUrls: ['./path-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathTextComponent {
    breakedPath = '';

    @Input()
    set path(value: string) {
        this.breakedPath = this.addBreaksAfterSlashes(value);
    }

    constructor() {}

    private addBreaksAfterSlashes(value: string): string {
        return value.replace(new RegExp('/', 'g'), '/<wbr>');
    }
}
