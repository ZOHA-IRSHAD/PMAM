import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from "@angular/material";
import { UserPortalService } from "../Services/user-portal.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'details-folder',
  templateUrl: 'details-folder.html',
  //   styleUrls: ['../audios/audios.component.css']
})


export class DetailsFolder implements OnInit {
  displayedColumns = ['key', 'value'];
  details: any = [];
  dataSource;
  constructor(public dialogRef: MatDialogRef<DetailsFolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private detailsService: UserPortalService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.spinner.hide();
    this.details.push(
      { key: 'Created Date', value: this.data.created_date },
      { key: 'Location', value: this.data.location },
      { key: 'Owner', value: sessionStorage.getItem('currentUser')},
      { key: 'Size (in MB)', value: this.data.folder_size},
      { key: 'No of Assets', value: this.data.asset_count}

    );
    this.dataSource = new MatTableDataSource(this.details);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
