import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { UserPortalService } from "../Services/user-portal.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-upgrade-plans',
  templateUrl: './upgrade-plans.component.html',
  styleUrls: ['./upgrade-plans.component.css']
})
export class UpgradePlansComponent implements OnInit {
  //URLs
  urlStorageDetails = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/getstoragedetails';
  urlPlansDetails = 'http://' + globalValues.ipAddress + '/pmam/getplans';
  //Variables  
  value: any;
  used_space = 0;
  subscription_plan: any;
  subs: any;
  //Arrays
  plans: any = [];
  constructor(public dialog: MatDialog,
    private plansService: UserPortalService,
    private spinner: NgxSpinnerService) { }

  //  Pie
  public pieChartLabels: string[] = ['Total Storage', 'Used'];
  public pieChartData: number[] = [];
  public pieChartType: string = 'pie';



  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public chartColors: any[] = [
    {
      backgroundColor: ["#0277BD", "#FB6542"]
    }];

  ngOnInit() {
    this.spinner.show();
    this.subscription_plan = JSON.parse(sessionStorage.getItem('user_details'));
    this.subs = (this.subscription_plan.subscription_type).toUpperCase();
    console.log(this.subs);
    //service for fetching storage details
    this.plansService.getData(this.urlStorageDetails)
      .subscribe(storage_response => {
        console.log(storage_response);
        globalValues.setStorageDetails(storage_response);
        for (let i in globalValues.storageDetails) {
          this.used_space = this.used_space + globalValues.storageDetails[i].storage_space;
        }
        console.log(this.used_space);
        this.pieChartData.push(JSON.parse(sessionStorage.getItem('user_details')).total_storage, +(this.used_space / (1024 * 1024 * 1024)).toFixed(3));
        console.log(JSON.parse(sessionStorage.getItem('user_details')).total_storage);
      })

    //service for fetching plans
    this.plansService.getData(this.urlPlansDetails)
      .subscribe(plans_response => {
        this.plans = plans_response;
        this.spinner.hide();
      });
  }

  openDialogDetails(value: string) {
    for (let i in this.plans) {
      if (value == this.plans[i].id) {
        this.value = this.plans[i].features;
        break;
      }
    }
    if (value == 'storage_details') {
      let dialogRef = this.dialog.open(DetailsPlans, {
        width: '500px',
        data: { option: value }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    else {
      let dialogRef = this.dialog.open(DetailsPlans, {
        width: '500px',
        height: '320px',
        data: this.value
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }
}


@Component({
  selector: 'details-plans',
  templateUrl: 'details-plans.html',
})
export class DetailsPlans implements OnInit {
  panelOpenState: boolean = false;
  displayedColumnsAsset = ['asset_type', 'storage_space'];
  displayedColumnsPlans = ['features'];
  dataSourceAsset: any = [];
  dataSource: any = [];


  constructor(
    public dialogRef: MatDialogRef<DetailsPlans>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.dataSourceAsset = new MatTableDataSource(globalValues.storageDetails);
    this.dataSource = new MatTableDataSource(this.data);
    console.log(this.dataSourceAsset);
  }

  onNoClick(): void {
    this.dataSource = [];
    this.dialogRef.close();
  }

}


