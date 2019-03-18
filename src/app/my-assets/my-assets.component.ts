import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, ElementRef, Renderer } from '@angular/core';
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { UserPortalService } from "../Services/user-portal.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ReplacePipe } from "../filters/replace.pipe";
import { RenameFolder } from "../details-dialog/rename-folder";
import { DetailsFolder } from "../details-dialog/details-folder";
import { MatDialog } from "@angular/material";
import { NotificationsService } from "angular2-notifications";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.css']
})
export class MyAssetsComponent implements OnInit {
  //URLs
  urlAssetsCount = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/getassetscount';
  urlUserDetails = 'http://' + globalValues.ipAdrs + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/getuserdetails';

  //Variables
  assetType: any;
  assetCount: any;
  assetDetails: any;
  data: any;
  regularDestribution = 100 / 3;
  interval: any;
  pasteDisable: boolean;
  //Arrays
  userDetails: any = [];
  folderDetails: any = [];
  folders: any = [];
  user_details: any = [];
  pasteArray: any = [];
  folderNameArray: any = [];
  constructor(private countService: UserPortalService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private renderer: Renderer,
    private dialog: MatDialog,
    private notifier: NotificationsService,
    private spinner: NgxSpinnerService) { }

  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }

  ngOnInit() {
    this.pasteDisable = globalValues.pasteDisable;
    sessionStorage.removeItem('asset_type');
    console.log("3");
    //service for fetching count of assets
    this.countService.getData(this.urlAssetsCount)
      .subscribe(asset_response => {
        this.assetDetails = asset_response;
      });

    this.countService.getData(this.urlUserDetails)
      .subscribe(userDetails_response => {
        console.log("assets");
        console.log(userDetails_response);
        sessionStorage.setItem('user_details', JSON.stringify(userDetails_response));
        this.userDetails = JSON.parse(sessionStorage.getItem('user_details'));
        this.folderDetails = this.userDetails.folders_details;
        if (this.folderDetails != undefined || this.folderDetails != null) {
          for (let i = 0; i < this.folderDetails.length; i++) {
            if (this.folderDetails[i].folder_name.split("/").length > 2) {
            }
            else {
              this.folders.push(this.folderDetails[i]);
            }
          }
        }
        this.spinner.hide();
      });
  }

  assetPage(asset_type) {
    sessionStorage.setItem('asset_type', asset_type);
    this.router.navigate(['home/myAssets/' + asset_type + ''], { queryParams: { type_of_asset: asset_type } });
  }

  openRenameFolder(folder_name: string) {
    console.log(folder_name);
    let dialogRef = this.dialog.open(RenameFolder, {
      width: '300px',
      data: { folder_name: folder_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  openDetailsFolder(folder_info) {
    console.log(folder_info);
    let dialogRef = this.dialog.open(DetailsFolder, {
      width: '400px',
      data: { created_date: folder_info.created_date, location: folder_info.folder_name,folder_size: +((folder_info.size/(1024*1024*1024)).toFixed(3)), asset_count: folder_info.count }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  } 

  deleteFolder(folder_name,index){
    let value = globalValues.removeFolder(folder_name,this.countService,this.notifier);
    value.then((val) =>{
      console.log(val);
      this.folders.splice(index,1);
      this.folders = this.folders.slice();
    })
   }

  newFolder(folder_name) {
    this.router.navigate(['home/myAssets/newFolder'], { queryParams: { name_of_folder: folder_name } });
  }

  folderCopyCut(operation: string, folder_name: string){
      for (var i = 0; i < this.folders.length; i++) {
        this.folderNameArray.push(folder_name);
        break;
    }
    globalValues.setCopyCutArray({
      'email_id': sessionStorage.getItem('currentUser'),
      'operation': operation,
      'uris': this.folderNameArray,
      'destination_folder': "",
      'source_folder': 'outside_bucket'
    })
    globalValues.setType('folder');
  }

  assetPaste(destination_folder: string){
    this.spinner.show();
    this.pasteArray = (globalValues.copyCutPaste);
    this.pasteArray.destination_folder = destination_folder;
    console.log(this.pasteArray);
    var value = globalValues.pasteAsset(this.pasteArray,this.countService,this.notifier,this.spinner);
    value.then((val) => {
     this.pasteArray = [];
     globalValues.setCopyCutArray([]);
    });     
}

}