import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from "@angular/material";
import { UserPortalService } from "../Services/user-portal.service";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ReplacePipe } from "../filters/replace.pipe";
import { NotificationsService } from "angular2-notifications";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'rename-folder',
    templateUrl: 'rename-folder.html',
    styles: ['.rename-field { width : 100% }']
})

export class RenameFolder implements OnInit {
    //Variables
    renameFolder: FormGroup;
    constructor(public dialogRef: MatDialogRef<RenameFolder>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private renameService: UserPortalService,
        private notifier: NotificationsService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        // this.spinner.hide();
        this.renameFolder = new FormGroup({
            'folder_name': new FormControl(new ReplacePipe().transform(this.data.folder_name), Validators.required)
        })
    }

    onRename() {
        if(sessionStorage.getItem('asset_type') != null){
        var value = ({
            'old_folder_name': this.data.folder_name,
            'new_folder_name': "/" + sessionStorage.getItem('asset_type') + "/" + this.renameFolder.value.folder_name,
        })
        }
    else{
        var value = ({
            'old_folder_name': this.data.folder_name,
            'new_folder_name': "/" + this.renameFolder.value.folder_name,
        })        
    }
        globalValues.renameFolder(value, this.renameService, this.dialogRef, this.notifier);
    }

    onClickCancel() {
        this.dialogRef.close();
    }
}

