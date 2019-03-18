import { Component, OnInit, Inject, ViewChild, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from "@angular/material";
import { UserPortalService } from "../Services/user-portal.service";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationsService } from "angular2-notifications";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'rename-dialog',
    templateUrl: 'rename-dialog.html',
    styles: ['.rename-field { width : 100% }']
})

export class RenameDialog implements OnInit {
    //Variables
    renameForm: FormGroup;
    onAdd = new EventEmitter();

    constructor(public dialogRef: MatDialogRef<RenameDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private renameService: UserPortalService,
        private notifier: NotificationsService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        // this.spinner.hide();
        this.renameForm = new FormGroup({
            'title': new FormControl(this.data.asset_title, Validators.required)
        })
    }

    onRename() {
        var formValue = ({
            'uri': this.data.asset_uri,
            'title': this.renameForm.value.title+'.'+this.data.asset_ext,
            'email_id': this.data.user_email_id,
            'directory': this.data.asset_location
        })
        console.log(formValue.uri);
        let value = globalValues.renameAsset(formValue, this.renameService, this.dialogRef, this.notifier);
        value.then((val) => {
            console.log(val);
            this.dialogRef.close({ value: val });
        });

    }

    onClickCancel() {
        this.dialogRef.close();
    }
}

