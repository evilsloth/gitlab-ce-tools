import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-path-text',
    templateUrl: './path-text.component.html',
    styleUrls: ['./path-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathTextComponent {
    breakedPath = '';

    constructor() {}

    @Input()
    set path(value: string) {
        this.breakedPath = this.addBreaksAfterSlashes(value);
    }

    private addBreaksAfterSlashes(value: string): string {
        return value.replace(new RegExp('/', 'g'), '/<wbr>');
    }
}
