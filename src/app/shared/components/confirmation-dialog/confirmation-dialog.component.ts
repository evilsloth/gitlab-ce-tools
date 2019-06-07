import { Component, OnInit } from '@angular/core';
import { Modal } from 'src/app/core/services/modal/modal';
import { ConfirmationDialogInitData } from './confirmation-dialog-init-data';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent extends Modal<ConfirmationDialogInitData> implements OnInit {
    initData: ConfirmationDialogInitData;
    answer: Promise<void>;
    private resolveCallback: () => void;
    private rejectCallback: () => void;

    constructor() {
        super();
        this.answer = new Promise((resolve, reject) => {
            this.resolveCallback = resolve;
            this.rejectCallback = reject;
        });
    }

    ngOnInit(): void {
        this.initData = this.getData();
    }

    ok() {
        this.resolveCallback();
        this.close();
    }

    cancel() {
        this.rejectCallback();
        this.close();
    }
}
