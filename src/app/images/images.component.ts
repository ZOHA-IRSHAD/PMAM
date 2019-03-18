import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UserPortalService } from "../Services/user-portal.service";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatTableDataSource } from '@angular/material';
import { NotificationsService } from "angular2-notifications";
import { SelectionModel } from "@angular/cdk/collections";
import { DetailsDialog } from "../details-dialog/details-dialog";
import { RenameDialog } from "../details-dialog/rename-dialog";
import { AssetsFields } from "../Interfaces/assets-fields";
import { GroupByPipe } from "../filters/groupBy.pipe";
import { RenameFolder } from "../details-dialog/rename-folder";
import { DetailsFolder } from "../details-dialog/details-folder";
import { FolderFields } from "../Interfaces/folder-fields";
import { ReplacePipe } from "../filters/replace.pipe";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  //Variables
  data: any;
  assetType: any;
  openImages: boolean = false;
  ind;
  viewModule: boolean = true;
  pasteDisable: boolean = true;
  copyDisable: boolean = true;
  cutDisable: boolean = true;
  test: boolean = false;
  //Arrays
  image_display: any = [];
  imageGroupBy: any = [];
  assetsArray: any = [];
  dataSource: any = [];
  dataSourceFolder: any = [];
  displayedColumns = ['select', 'title', 'uploaded_date_string', 'asset_type', 'size', 'actions'];
  displayedColFolder = ['icon', 'folder_name', "actions"];
  checkArray: any = [];
  checkListArray: any = [];
  selection = new SelectionModel<AssetsFields>(true, []);
  userDetails: any = [];
  folderDetails: any = [];
  folders: any = [];
  assetUri: any = [];
  pasteArray: any = [];
  folderNameArray: any = [];
  assetLink: any = [];
  image_displayCopy: any = [];
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }
  constructor(private route: ActivatedRoute,
    private imagesService: UserPortalService,
    public dialog: MatDialog,
    private notifier: NotificationsService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.pasteDisable = globalValues.pasteDisable;
    this.spinner.show();
    globalValues.setImageArray([]);
    //query Params
    this.data = this.route
      .queryParams
      .subscribe(params => {
        this.assetType = params['type_of_asset']
      });
    let urlForBuckets = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/' + this.assetType + '/getAssets ';
    //Service for fetching assets in their respective Buckets
    this.imagesService.getData(urlForBuckets)
      .subscribe(bucket_response => {
        this.image_display = bucket_response;
        this.image_displayCopy = bucket_response;
        console.log(bucket_response);
        for (let i = 0; i < this.image_display.length; i++) {
          this.image_displayCopy[i].title = this.image_display[i].title.substring(0, this.image_display[i].title.lastIndexOf('.'));
        }
        this.dataSource = new MatTableDataSource(this.image_displayCopy);
        this.dataSource.filterPredicate = function (data: AssetsFields, filter: string): boolean {
          return data.title.toLowerCase().includes(filter);
        };
        for (var i = 0; i < bucket_response.length; i++) {
          this.checkListArray.push({ "uri": bucket_response[i].uri, "isChecked": false });
        }
        this.image_display.sort((a, b) => new Date(b.uploaded_date).getTime() - new Date(a.uploaded_date).getTime());

        this.imageGroupBy = new GroupByPipe().transform(bucket_response, 'uploaded_date_string');
        console.log(this.imageGroupBy);
        for (var i = 0; i < this.imageGroupBy.length; i++) {
          this.checkArray.push({ "key": this.imageGroupBy[i].key, "value": [] });
          for (let j = 0; j < this.imageGroupBy[i].value.length; j++) {
          globalValues.Images.push(this.imageGroupBy[i].value[j].asset_link);                      
            this.checkArray[i].value.push({ "uri": this.imageGroupBy[i].value[j].uri, "isChecked": false });
          }
        }
        this.spinner.hide();
      })

    this.userDetails = JSON.parse(sessionStorage.getItem('user_details'));
    this.folderDetails = this.userDetails.folders_details;
    if (this.folderDetails != undefined || this.folderDetails != null) {
      for (let i = 0; i < this.folderDetails.length; i++) {
        if (this.folderDetails[i].folder_name.split("/").length > 2) {
          if (this.folderDetails[i].folder_name.split("/")[1] === sessionStorage.getItem('asset_type')) {
            this.folders.push(this.folderDetails[i]);
            this.dataSourceFolder = new MatTableDataSource(this.folders);
            this.dataSourceFolder.filterPredicate = function (data: FolderFields, filter: string): boolean {
              var name = data.folder_name;
              var new_name = new ReplacePipe().transform(name);
              return new_name.toLowerCase().includes(filter);
            };
          }
        }
        else {
          console.log("else");
        }
      }
    }
  }


  applyFilter(filterValue: string) {
    console.log(filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.dataSourceFolder.filter = filterValue;
    if (this.dataSource.filteredData.length == 0) {
      this.displayedColumns = ['results'];
    } else if (this.dataSource.filteredData == "") {
      this.displayedColumns = ['select', 'title', 'uploaded_date_string', 'asset_type', 'size', 'actions'];
    }
    else if (this.dataSource.filteredData.length != 0) {
      this.displayedColumns = ['select', 'title', 'uploaded_date_string', 'asset_type', 'size', 'actions'];
    }

    if (this.dataSourceFolder.filteredData.length == 0) {
      this.displayedColFolder = ['results'];
    } else if (this.dataSource.filteredData == "") {
      this.displayedColFolder = ['icon', 'folder_name', "actions"];
    }
    else if (this.dataSource.filteredData.length != 0) {
      this.displayedColFolder = ['icon', 'folder_name', "actions"];
    }
  }


  openImage(imageObject, index) {
    console.log(index);
    console.log(imageObject);
    let dialogRef = this.dialog.open(ImageViewer, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    for (let i = 0; i < globalValues.Images.length; i++) {
      if (globalValues.Images[i] === imageObject.asset_link) {
        globalValues.setIndexImage(i);
        break;
      }
    }

  }

  openDetails(asset) {
    let dialogRef = this.dialog.open(DetailsDialog, {
      width: '400px',
      // data: { asset_type: assetUri }
      data: { asset_type: asset.asset_type, size: +((asset.size / (1024 * 1024 * 1024)).toFixed(5)), directory: asset.directory, owner: asset.owner }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openRenameDialog(asset) {
    var ext = globalValues.stringBeforeChar(asset.asset_link);
    let dialogRef = this.dialog.open(RenameDialog, {
      width: '300px',
      data: {
        asset_uri: asset.uri,
        asset_title: asset.title,
        user_email_id: sessionStorage.getItem('currentUser'),
        asset_location: asset.directory,
        asset_ext: ext
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result.value);

    });

  }

  getImageDetails(uri: string, status: string, index) {
    for (var i = 0; i < this.image_display.length; i++) {
      if (this.image_display[i].uri == uri) {
        index = i;
        break;
      }
    }
    if (status == "not-yet") {
      this.image_display[index].favourite_status = "yes";
    }
    else {
      this.image_display[index].favourite_status = "not-yet";
    }
    globalValues.getUriNFavStatus(uri, this.image_display[index].favourite_status, this.imagesService, this.notifier);
  }

  changeView() {
    this.viewModule = !this.viewModule;
    if (!this.viewModule) {
      this.checkListArray  =  [];
      for (let  i  =  0; i  <  this.checkArray.length; i++) {
        for (let  j  =  0; j  <  this.checkArray[i].value.length; j++) {
          this.checkListArray.push(this.checkArray[i].value[j]);
        }
      }
    }
  }

  removeFromBucket(uri: string) {
    let index;
    console.log("cllaing remove");
    for (var i = 0; i < this.image_display.length; i++) {
      if (this.image_display[i].uri == uri) {
        index = i;
        break;
      }
    }
    console.log(this.image_display);
    let value = globalValues.deleteAsset(uri, this.imagesService, this.notifier);
    value.then((val) => {
      console.log(val)
      this.image_display.splice(index, 1);
      this.image_display = this.image_display.slice();
      this.image_displayCopy = this.image_display;
      this.dataSource = new MatTableDataSource(this.image_display);
    });
  }

  deleteFolder(folder_name, index) {
    let value = globalValues.removeFolder(folder_name, this.imagesService, this.notifier);
    value.then((val) => {
      console.log(val);
      this.folders.splice(index, 1);
      this.folders = this.folders.slice();
      this.dataSourceFolder = new MatTableDataSource(this.folders);
    })
  }



  pushAsset(item) {
    let flag = 0;
    console.log(this.assetsArray);
    if (this.assetsArray.length > 0) {
      console.log("calling if");
      for (let i = 0; i < this.assetsArray.length; i++) {
        if (this.assetsArray[i].uri == item.uri) {
          console.log("unchecked");
          this.assetsArray.splice(i, 1);
          flag = 1;
          break;
        }
      }
      if(this.assetsArray.length > 0){
        this.copyDisable = false;
        this.cutDisable = false;         
        }
      else{
        this.copyDisable = true;
        this.cutDisable = true;        
      }      
      if (!flag) {
        this.assetsArray.push(item);
        this.copyDisable = false;
        this.cutDisable = false;
      }
    }
    else {
      console.log("else");
      this.assetsArray.push(item);
      this.copyDisable = false;
      this.cutDisable = false;
    }
    console.log(this.assetsArray);
  }

  checkboxArray(asset){
    if(this.test == false){
      this.pushAsset(asset);
    }
    else{
    this.assetsArray = [];
    this.pushAsset(asset);
    }
  }

  // pushAsset(item, index) {
  //   let flag = 0;
  //   if (this.assetsArray.length > 0) {
  //     for (let i = 0; i < this.assetsArray.length; i++) {
  //       if (this.assetsArray[i].uri == item.uri) {
  //         console.log("unchecked");
  //         this.assetsArray.splice(i, 1);
  //         flag = 1;
  //         break;
  //       }
  //     }
  //     if (!flag) {
  //       this.assetsArray.push(item);
  //     }
  //   }
  //   else {
  //     this.assetsArray.push(item);
  //     console.log(this.checkArray);
  //   }
  //   console.log(this.assetsArray);
  // }

  deleteMultipleAssets() {
    let prom = [];
    console.log("multiple");
    for (let i in this.assetsArray) {
      for (let j in this.image_display) {
        if (this.assetsArray[i].uri == this.image_display[j].uri) {
          let uri = this.assetsArray[i].uri;
          let value = globalValues.deleteAsset(uri, this.imagesService, this.notifier);
          console.log(value);
          prom.push(value);
          break;
        }

      }
    }
    Promise.all(prom).then((val) => {
      console.log(val);
      for (let i = 0; i < val.length; i++) {
        for (let j in this.image_display) {
          if (this.assetsArray[i].uri == this.image_display[j].uri) {
            this.image_display.splice(j, 1);
            this.image_display = this.image_display.slice();
            this.image_displayCopy = this.image_display;
            this.dataSource = new MatTableDataSource(this.image_display);
            break;
          }
        }
      }
      this.checkArray = [];
      this.checkListArray = [];
      for (let k in this.image_display) {        
        this.checkListArray.push({ "uri": this.image_display[k].uri, "isChecked": false });
      }
      this.imageGroupBy = new GroupByPipe().transform(this.image_display, 'uploaded_date_string');
      console.log(this.imageGroupBy);
      for (let l = 0; l < this.imageGroupBy.length; l++) {
        this.checkArray.push({ "key": this.imageGroupBy[l].key, "value": [] });
        for (let j = 0; j < this.imageGroupBy[l].value.length; j++) {
          this.checkArray[l].value.push({ "uri": this.imageGroupBy[l].value[j].uri, "isChecked": false });
        }
      }      
      this.assetsArray = [];
    });

  }

  assetCopyCut(operation: string, asset_uri: string, asset_link: string) {
    for (var i = 0; i < this.image_display.length; i++) {
      this.assetUri.push(asset_uri);
      break;
    }
    globalValues.setCopyCutArray({
      'email_id': sessionStorage.getItem('currentUser'),
      'operation': operation,
      'uris': this.assetUri,
      'destination_folder': "",
      'source_folder': 'bucket'

    })
    globalValues.setType('asset');
    var ext = globalValues.stringBeforeChar(asset_link);
    globalValues.setExtension(ext);
    globalValues.setpasteDisable(false);
    this.pasteDisable = globalValues.pasteDisable;     

  }

  newFolder(folder_name) {
    // let name = new ReplacePipe().transform(folder_name);
    console.log(folder_name);
    this.router.navigate(['home/myAssets/newFolder'], { queryParams: { name_of_folder: folder_name } });
  }

  //   folderCopyCut(operation: string, asset_uri: string){
  //    for (var i = 0; i < this.image_display.length; i++) {
  //       this.assetUri.push(asset_uri);
  //       break;
  //   }
  //   globalValues.setCopyCutArray ({
  //     'email_id': sessionStorage.getItem('currentUser'),
  //     'operation': operation,
  //     'uris': this.assetUri,
  //     'destination_folder': "",
  //     'source_folder': 'bucket'

  //   });
  // }

  copyCutMultipleAssets(operation: string) {
    this.assetUri = [];
    console.log(this.assetsArray);
    for (var i = 0; i < this.assetsArray.length; i++) {
      this.assetUri.push(this.assetsArray[i].uri);
      this.assetLink.push(this.assetsArray[i].asset_link);
    }

    globalValues.setCopyCutArray({
      'email_id': sessionStorage.getItem('currentUser'),
      'operation': operation,
      'uris': this.assetUri,
      'destination_folder': "",
      'source_folder': 'bucket'
    })
    globalValues.setType('assetArray');
    var extArr: any = [];
    for (let j in this.assetLink) {
      extArr.push(globalValues.stringBeforeChar(this.assetLink[j]));
    }
    globalValues.setExtensionArray(extArr);
    for (let j = 0; j < this.checkArray.length; j++) {
      for (let k = 0; k < this.checkArray[j].value.length; k++) {
        this.checkArray[j].value[k].isChecked = false;
      }

    }
    for (let m = 0; m < this.checkListArray.length; m++) {
      this.checkListArray[m].isChecked = false;
    }
    this.assetsArray = [];
    globalValues.setpasteDisable(false);
    this.pasteDisable = globalValues.pasteDisable;  }

  downloadImage(fileName: string) {
    let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
    console.log(filename);
    globalValues.downloadAsset(filename, this.imagesService);

  }

  assetPaste(destination_folder: string) {
    this.spinner.show();
    this.pasteArray = (globalValues.copyCutPaste);
    this.pasteArray.destination_folder = destination_folder;
    console.log(this.pasteArray);
    var value = globalValues.pasteAsset(this.pasteArray, this.imagesService, this.notifier, this.spinner);
    value.then((val) => {
      this.pasteArray = [];
      globalValues.setCopyCutArray([]);
      this.assetsArray = [];
    });
   globalValues.setpasteDisable(true);
  }

  downloadMultipleAssets() {
    for (let i in this.assetsArray) {
      for (let j in this.image_display) {
        if (this.assetsArray[i].uri == this.image_display[j].uri) {
          let fileName = this.assetsArray[i].asset_link;
          let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
          globalValues.downloadAsset(filename, this.imagesService);
          for (let j = 0; j < this.checkArray.length; j++) {
            for (let k = 0; k < this.checkArray[j].value.length; k++) {
              this.checkArray[j].value[k].isChecked = false;
            }

          }
          for (let m = 0; m < this.checkListArray.length; m++) {
            this.checkListArray[m].isChecked = false;

          }
          break;
        }
      }
    }
    // console.log(this.checkArray);
    this.assetsArray = [];
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
      data: { created_date: folder_info.created_date, location: folder_info.folder_name, folder_size: +((folder_info.size / (1024 * 1024 * 1024)).toFixed(3)), asset_count: folder_info.count }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  folderPaste() {
    this.pasteArray = (globalValues.copyCutPaste);
    this.pasteArray.destination_folder = "/" + this.assetType;
    console.log(this.pasteArray);
    var flag = globalValues.pasteFolder(this.pasteArray, this.imagesService, this.notifier);
    flag.then((val) => {
      this.pasteArray = [];
      globalValues.setCopyCutArray([]);
    });
  }

  folderCopyCut(operation: string, folder_name: string) {
    for (var i = 0; i < this.folders.length; i++) {
      this.folderNameArray.push(folder_name);
      break;
    }
    globalValues.setCopyCutArray({
      'email_id': sessionStorage.getItem('currentUser'),
      'operation': operation,
      'uris': this.folderNameArray,
      'destination_folder': "",
      'source_folder': "/" + this.assetType
    })
    globalValues.setType('folder');


  }

  checkType() {
    if (globalValues.type == 'folder') {
      this.folderPaste();
    }
    else if (globalValues.type == 'asset') {
      if (globalValues.extension == 'jpg' || globalValues.extension == 'png' || globalValues.extension == 'jpeg') {
        this.assetPaste('bucket');
        this.test = true;
      }
      else {
        alert("You can only paste Images");
      }
    }
    else if (globalValues.type == 'assetArray') {
      for (let i in globalValues.extensionArray) {
        if (globalValues.extensionArray[i] == 'jpg' || globalValues.extensionArray[i] == 'png' || globalValues.extensionArray[i] == 'jpeg') {
          this.assetPaste('bucket');
          this.test = true;
        }
        else {
          alert('You can paste images only');
        }
      }
    }
  }
}


@Component({
  selector: 'image-viewer',
  templateUrl: 'image-viewer.html',
  styleUrls: ['./images.component.css']
})

export class ImageViewer implements OnInit {
  ind: number;
  images: any = [];
  displayedColumns = ['title', 'uploaded_date_string', 'asset_type', 'size', 'actions'];

  constructor(public dialogRef: MatDialogRef<ImageViewer>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.ind = globalValues.indexImage;
    this.images = globalValues.Images;
    console.log(this.images);
    console.log(this.ind);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleEvent(event: CustomEvent) {
    switch (event['name']) {
      case 'cancel':
        this.dialogRef.close();
        break;

      case 'download':
        console.log("download fun");
        break;
    }
  }

}

