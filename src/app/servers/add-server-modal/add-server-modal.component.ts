import { Component, OnInit } from '@angular/core';
import { ServersService } from '../servers.service';
import { FormBuilder } from '@angular/forms';
import { ServerModalInitData } from './server-modal-init-data';
import { Modal } from 'src/app/core/services/modal/modal';

@Component({
    selector: 'app-add-server-modal',
    templateUrl: './add-server-modal.component.html',
    styleUrls: ['./add-server-modal.component.scss']
})
export class AddServerModalComponent extends Modal<ServerModalInitData> implements OnInit {
    editMode = false;
    serverForm = this.formBuilder.group({
        name: [''],
        url: [''],
        token: ['']
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
        if (this.editMode) {
            // disabled field are not included in form.value!
            this.serversService.editServer(this.serverForm.getRawValue());
        } else {
            this.serversService.addServer(this.serverForm.value);
        }
        this.close();
    }
}
