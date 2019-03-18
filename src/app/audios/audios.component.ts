import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UserPortalService } from "../Services/user-portal.service";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSort, MatTableDataSource } from "@angular/material";
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
  selector: 'app-audios',
  templateUrl: './audios.component.html',
  styleUrls: ['./audios.component.css']
})
export class AudiosComponent implements OnInit {
  //Variables
  data: any;
  assetType: any;
  viewModule: boolean = true;
  sortDescending: boolean = true;
  isDesc: boolean = false;
  column: string;
  direction: number;
  pasteDisable: boolean = true;
  copyDisable: boolean = true;
  cutDisable: boolean = true;
  test: boolean = false;
  //Arrays
  audios: any = [];
  assetsArray: any = [];
  dataSource: any = [];
  dataSourceFolder: any = [];
  displayedColumns = ['select', 'title', 'uploaded_date_string', 'asset_type', 'size', 'actions'];
  displayedColFolder = ['icon', 'folder_name', 'actions'];
  selection = new SelectionModel<AssetsFields>(true, []);
  userDetails: any = [];
  folderDetails: any = [];
  folders: any = [];
  checkArray: any = [];
  audioGroupBy: any = [];
  checkListArray: any = [];
  assetUri: any = [];
  pasteArray: any = [];
  folderNameArray: any = [];
  assetLink: any = [];
  audiosCopy: any = [];
  checkboxAsset: any = [];
  @ViewChild(MatSort) set content(sort: MatSort) {
    console.log("view");
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
    private audiosService: UserPortalService,
    private dialog: MatDialog,
    private notifier: NotificationsService,
    private router: Router,
    private spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.pasteDisable = globalValues.pasteDisable;
    this.spinner.show();
    //query Params
    this.data = this.route
      .queryParams
      .subscribe(params => {
        this.assetType = params['type_of_asset']
      });
    let urlForBuckets = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/' + this.assetType + '/getAssets ';
    //Service for fetching assets in their respective Buckets
    this.audiosService.getData(urlForBuckets)
      .subscribe(bucket_response => {
        this.audios = bucket_response;
        this.audiosCopy = bucket_response;
        for (let i = 0; i < this.audios.length; i++) {
          this.audiosCopy[i].title = this.audios[i].title.substring(0, this.audios[i].title.lastIndexOf('.'));
        }
        this.dataSource = new MatTableDataSource(this.audiosCopy);
        this.dataSource.filterPredicate = function (data: AssetsFields, filter: string): boolean {
          return data.title.toLowerCase().includes(filter);
        };
        for (let i in this.audios) {
          // globalValues.playAudio.push(false);
          this.checkListArray.push({ "uri": bucket_response[i].uri, "isChecked": false });

        }
        this.audios.sort((a, b) => new Date(b.uploaded_date).getTime() - new Date(a.uploaded_date).getTime());


        this.audioGroupBy = new GroupByPipe().transform(bucket_response, 'uploaded_date_string');
        for (var i = 0; i < this.audioGroupBy.length; i++) {
          this.checkArray.push({ "key": this.audioGroupBy[i].key, "value": [] });
          for (let j = 0; j < this.audioGroupBy[i].value.length; j++) {
            this.checkArray[i].value.push({ "uri": this.audioGroupBy[i].value[j].uri, "isChecked": false });
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
            console.log(this.dataSourceFolder);
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

  getAudioDetails(uri: string, status: string, index) {
    for (var i = 0; i < this.audios.length; i++) {
      if (this.audios[i].uri == uri) {
        index = i;
        break;
      }
    }
    if (status == "not-yet") {
      this.audios[index].favourite_status = "yes";
    }
    else {
      this.audios[index].favourite_status = "not-yet";
    }
    globalValues.getUriNFavStatus(uri, this.audios[index].favourite_status, this.audiosService, this.notifier);
  }

  openAudio(audioObject, uri, index) {
    globalValues.setAudioObject(audioObject);
    globalValues.setIndexAudio(index);
    globalValues.setAudioListArray([]);
    let dialogRef = this.dialog.open(AudioPlayer, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    for (let i in this.audios) {
      globalValues.playAudio.push(false);
      if (this.audios[i].uri == uri) {
        globalValues.playAudio[index] = true;
        break;
      }
    }
  }

  openDetails(asset) {
    let dialogRef = this.dialog.open(DetailsDialog, {
      width: '400px',
      // data: { asset_type: assetUri }
      data: {
        asset_type: asset.asset_type,
        size: +((asset.size / (1024 * 1024 * 1024)).toFixed(5)),
        directory: asset.directory,
        owner: asset.owner
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openRenameDialog(asset) {
    var ext = globalValues.stringBeforeChar(asset.asset_link);
    console.log(ext);
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
    });

  }

  changeView() {
    this.viewModule = !this.viewModule;
    if (!this.viewModule) {
      this.checkListArray = [];
      for (let i = 0; i < this.checkArray.length; i++) {
        for (let j = 0; j < this.checkArray[i].value.length; j++) {
          this.checkListArray.push(this.checkArray[i].value[j]);
        }
      }
    }

  }

  removeFromBucket(uri: string, index) {
    console.log("calling remove");
    for (var i = 0; i < this.audios.length; i++) {
      if (this.audios[i].uri == uri) {
        index = i;
        break;
      }
    }
    let value = globalValues.deleteAsset(uri, this.audiosService, this.notifier);
    value.then((val) => {
      this.audios.splice(index, 1);
      this.audios = this.audios.slice();
      this.audiosCopy = this.audios;
      this.dataSource = new MatTableDataSource(this.audios);
    });

  }

  assetCopyCut(operation: string, asset_uri: string, asset_link: string) {
    console.log("copy - cut");
    for (var i = 0; i < this.audios.length; i++) {
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
    this.pasteDisable = globalValues.pasteDisable;                                                                                                                                                                                   // globalValues.setExtension();
  }

  copyCutMultipleAssets(operation: string) {
    console.log(this.assetsArray.length);
    console.log(this.assetsArray);
    this.assetUri = [];
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
    this.pasteDisable = globalValues.pasteDisable;
    console.log(this.assetUri);
  }

  deleteFolder(folder_name, index) {
    let value = globalValues.removeFolder(folder_name, this.audiosService, this.notifier);
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
      for (let j in this.audios) {
        if (this.assetsArray[i].uri == this.audios[j].uri) {
          let uri = this.assetsArray[i].uri;
          let value = globalValues.deleteAsset(uri, this.audiosService, this.notifier);
          console.log(value);
          prom.push(value);
          break;
        }
      }
    }
    Promise.all(prom).then((val) => {
      console.log(val);
      for (let i = 0; i < val.length; i++) {
        for (let j in this.audios) {
          if (this.assetsArray[i].uri == this.audios[j].uri) {
            this.audios.splice(j, 1);
            this.audios = this.audios.slice();
            this.audiosCopy = this.audios;
            this.dataSource = new MatTableDataSource(this.audios);
            break;
          }
        }
      }
      this.checkArray = [];
      this.checkListArray = [];
      for (let k in this.audios) {
        // globalValues.playAudio.push(false);
        this.checkListArray.push({ "uri": this.audios[k].uri, "isChecked": false });
      }
      this.audioGroupBy = new GroupByPipe().transform(this.audios, 'uploaded_date_string');
      console.log(this.audioGroupBy);
      for (let l = 0; l < this.audioGroupBy.length; l++) {
        this.checkArray.push({ "key": this.audioGroupBy[l].key, "value": [] });
        for (let j = 0; j < this.audioGroupBy[l].value.length; j++) {
          this.checkArray[l].value.push({ "uri": this.audioGroupBy[l].value[j].uri, "isChecked": false });
        }
      }
      this.assetsArray = [];
    });

  }


  downloadAudio(fileName: string) {
    let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
    globalValues.downloadAsset(filename, this.audiosService)
  }


  downloadMultipleAssets() {
    for (let i in this.assetsArray) {
      for (let j in this.audios) {
        if (this.assetsArray[i].uri == this.audios[j].uri) {
          let fileName = this.assetsArray[i].asset_link;
          let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
          globalValues.downloadAsset(filename, this.audiosService);
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

  newFolder(folder_name) {
    // let name = new ReplacePipe().transform(folder_name);
    console.log(folder_name);
    this.router.navigate(['home/myAssets/newFolder'], { queryParams: { name_of_folder: folder_name } });
  }

  assetPaste(destination_folder: string) {
    this.spinner.show();
    console.log("calling");
    this.pasteArray = (globalValues.copyCutPaste);
    this.pasteArray.destination_folder = destination_folder;
    console.log(this.pasteArray);
    // var value = globalValues.pasteAsset(this.pasteArray, this.audiosService, this.notifier, this.spinner);
    // value.then((val) => {
    //   this.pasteArray = [];
    //   globalValues.setCopyCutArray([]);
    //   this.assetsArray = [];
    // });
    globalValues.setpasteDisable(true);    
  }

  folderPaste() {
    this.pasteArray = (globalValues.copyCutPaste);
    this.pasteArray.destination_folder = "/" + this.assetType;
    console.log(this.pasteArray);
    var flag = globalValues.pasteFolder(this.pasteArray, this.audiosService, this.notifier);
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
      if (globalValues.extension == 'mp3') {
        this.assetPaste('bucket');
        this.test = true;
      }
      else {
        alert("You can only paste Audios");
      }
    }
    else if (globalValues.type == 'assetArray') {
      for (let i in globalValues.extensionArray) {
        if (globalValues.extensionArray[i] == 'mp3') {
          this.assetPaste('bucket');
          this.test = true;
        }
        else {
          alert('You can paste audios only');
        }
      }
    }
  }
}


@Component({
  selector: 'audio-player',
  templateUrl: 'audio-player.html',
  styleUrls: ['../audios/audios.component.css']
})

export class AudioPlayer implements OnInit {
  ind;
  playAudio = [];
  audioObject;
  constructor(public dialogRef: MatDialogRef<AudioPlayer>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.audioObject = globalValues.audioObject;
    this.ind = globalValues.indexAudio;
    this.playAudio = globalValues.playAudio;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
