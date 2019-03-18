import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from "@angular/material";
import { UserPortalService } from "../Services/user-portal.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'details-dialog',
  templateUrl: 'details-dialog.html',
  //   styleUrls: ['../audios/audios.component.css']
})


export class DetailsDialog implements OnInit {
  displayedColumns = ['key', 'value'];
  details: any = [];
  dataSource;
  constructor(public dialogRef: MatDialogRef<DetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private detailsService: UserPortalService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.spinner.hide();
    this.details.push({ key: 'Type', value: this.data.asset_type },
      { key: 'Size (in MB)', value: this.data.size },
      { key: 'Location', value: this.data.directory },
      { key: 'Owner', value: this.data.owner });
    this.dataSource = new MatTableDataSource(this.details);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
