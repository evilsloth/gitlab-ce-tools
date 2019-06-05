import { Component, OnInit, ViewChild } from '@angular/core';
import { ServersService } from '../servers.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ServerModalInitData } from './server-modal-init-data';
import { Modal } from 'src/app/core/services/modal/modal';
import { ClrForm } from '@clr/angular';

@Component({
    selector: 'app-add-server-modal',
    templateUrl: './add-server-modal.component.html',
    styleUrls: ['./add-server-modal.component.scss']
})
export class AddServerModalComponent extends Modal<ServerModalInitData> implements OnInit {
    private static readonly URL_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    @ViewChild(ClrForm) clrForm;
    setActive = true;

    editMode = false;
    serverForm = this.formBuilder.group({
        name: ['', Validators.required],
        url: ['', [Validators.required, Validators.pattern(AddServerModalComponent.URL_PATTERN)]],
        token: ['', Validators.required]
    });

    constructor(private serversService: ServersService, private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        const initData = this.getData();
        if (initData.mode === 'EDIT') {
            this.editMode = true;
            this.serverForm.setValue(initData.serverToEdit);
            this.serverForm.get('name').disable();
        }
    }

    save() {
        if (this.serverForm.invalid) {
            this.clrForm.markAsDirty();
            return;
        }

        if (this.editMode) {
            // disabled field are not included in form.value!
            this.serversService.editServer(this.serverForm.getRawValue());
        } else {
            this.serversService.addServer(this.serverForm.value);

            if (this.setActive) {
                this.serversService.selectActiveServer(this.serverForm.value.name);
            }
        }
        this.close();
    }
}
