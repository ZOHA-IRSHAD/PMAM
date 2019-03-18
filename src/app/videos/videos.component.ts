import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { ActivatedRoute, Router } from "@angular/router";
import { UserPortalService } from "../Services/user-portal.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
//Observable Operators
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { NotificationsService } from "angular2-notifications";
import { SelectionModel } from "@angular/cdk/collections";
import { DetailsDialog } from "../details-dialog/details-dialog";
import { RenameDialog } from "../details-dialog/rename-dialog";
import { AssetsFields } from "../Interfaces/assets-fields";
import { ReplacePipe } from "../filters/replace.pipe";
import { RenameFolder } from "../details-dialog/rename-folder";
import { GroupByPipe } from "../filters/groupBy.pipe";
import { DetailsFolder } from "../details-dialog/details-folder";
import { FolderFields } from "../Interfaces/folder-fields";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
  // @ViewChild(MatSort) sort: MatSort;
  //  private contentPlaceholder: ElementRef;


  //Variables
  data: any;
  assetType: any;
  viewModule: boolean = true;
  isDesc: boolean = false;
  column: string;
  direction: number;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  folderName: string;
  pasteDisable: boolean = true;
  copyDisable: boolean = true;
  cutDisable: boolean = true;
  test: boolean = false;
  //Arrays
  dataSource: any = [];
  dataSourceFolder: any = [];
  checkArray: any = [];
  videoGroupBy: any = [];
  videos: any = [];
  assetsArray: any = [];
  displayedColumns = ['select', 'title', 'uploaded_date_string', 'asset_type', 'size', 'actions'];
  displayedColFolder = ['icon', 'folder_name', "actions"];
  checkListArray: any = [];
  selection = new SelectionModel<AssetsFields>(true, []);
  userDetails: any = [];
  folderDetails: any = [];
  folders: any = [];
  assetUri: any = [];
  pasteArray: any = [];
  folderNameArray: any = [];
  assetLink: any = [];
  videosCopy: any = [];
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }

  constructor(private route: ActivatedRoute,
    private videosService: UserPortalService,
    public dialog: MatDialog,
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
    this.videosService.getData(urlForBuckets)
      .subscribe(bucket_response => {
        this.videos = bucket_response;
        this.videosCopy = bucket_response;
        for (let i = 0; i < this.videos.length; i++) {
          this.videosCopy[i].title = this.videos[i].title.substring(0, this.videos[i].title.lastIndexOf('.'));
        }
        this.dataSource = new MatTableDataSource(this.videosCopy);
        this.dataSource.filterPredicate = function (data: AssetsFields, filter: string): boolean {
          return data.title.toLowerCase().includes(filter);
        };
        for (let i = 0; i < this.videos.length; i++) {
          globalValues.playVideo.push(false);
          this.checkListArray.push({ "uri": bucket_response[i].uri, "isChecked": false });

        }
        this.videos.sort((a, b) => new Date(b.uploaded_date).getTime() - new Date(a.uploaded_date).getTime());

        this.videoGroupBy = new GroupByPipe().transform(bucket_response, 'uploaded_date_string');
        console.log(this.videoGroupBy);
        for (var i = 0; i < this.videoGroupBy.length; i++) {
          this.checkArray.push({ "key": this.videoGroupBy[i].key, "value": [] });
          for (let j = 0; j < this.videoGroupBy[i].value.length; j++) {
            this.checkArray[i].value.push({ "uri": this.videoGroupBy[i].value[j].uri, "isChecked": false });
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
            console.log(this.folderDetails[i]);
            this.folders.push(this.folderDetails[i]);
            this.dataSourceFolder = new MatTableDataSource(this.folders);
            console.log(this.folders);
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
    console.log(this.folders.length + "len");


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

  getVideoDetails(uri: string, status: string, index) {
    for (var i = 0; i < this.videos.length; i++) {
      if (this.videos[i].uri == uri) {
        index = i;
        break;
      }
    }
    if (status == "not-yet") {
      this.videos[index].favourite_status = "yes";
    }
    else {
      this.videos[index].favourite_status = "not-yet";
    }
    globalValues.getUriNFavStatus(uri, this.videos[index].favourite_status, this.videosService, this.notifier);
  }

  openVideo(videoObject, uri, index) {
    globalValues.setVideoObject(videoObject);
    globalValues.setIndexVideo(index);
    globalValues.setVideoListArray([]);
    let dialogRef = this.dialog.open(VideoPlayer, {});

    dialogRef.afterClosed().subscribe(result => {
    });
    for (let i in this.videos) {
      globalValues.playVideo.push(false);
      if (this.videos[i].uri == uri) {
        globalValues.playVideo[index] = true;
        break;
      }
    }

  }

  openDetails(asset) {
    let dialogRef = this.dialog.open(DetailsDialog, {
      width: '400px',
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
    });

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


  removeFromBucket(uri: string, index) {
    console.log("cllaing remove");
    for (var i = 0; i < this.videos.length; i++) {
      if (this.videos[i].uri == uri) {
        index = i;
        break;
      }
    }
    let value = globalValues.deleteAsset(uri, this.videosService, this.notifier);
    value.then((val) => {
      this.videos.splice(index, 1);
      this.videos = this.videos.slice();
      this.videosCopy = this.videos;
      this.dataSource = new MatTableDataSource(this.videos);
    });

  }

  deleteFolder(folder_name, index) {
    let value = globalValues.removeFolder(folder_name, this.videosService, this.notifier);
    value.then((val) => {
      console.log(val);
      this.folders.splice(index, 1);
      this.folders = this.folders.slice();
      this.dataSourceFolder = new MatTableDataSource(this.folders);
    })
  }


  pushAsset(item) {
    console.log(this.assetsArray);
    let flag = 0;
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

      console.log(this.checkArray);
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
      for (let j in this.videos) {
        if (this.assetsArray[i].uri == this.videos[j].uri) {
          let uri = this.assetsArray[i].uri;
          let value = globalValues.deleteAsset(uri, this.videosService, this.notifier);
          console.log(value);
          prom.push(value);
          break;
        }

      }
    }
    Promise.all(prom).then((val) => {
      console.log(val);
      for (let i = 0; i < val.length; i++) {
        for (let j in this.videos) {
          if (this.assetsArray[i].uri == this.videos[j].uri) {
            this.videos.splice(j, 1);
            this.videos = this.videos.slice();
            this.videosCopy = this.videos
            this.dataSource = new MatTableDataSource(this.videos);
            break;
          }
        }
      }
      this.checkArray = [];
      this.checkListArray = [];
      for (let k in this.videos) {
        globalValues.playAudio.push(false);
        this.checkListArray.push({ "uri": this.videos[k].uri, "isChecked": false });
      }
      this.videoGroupBy = new GroupByPipe().transform(this.videos, 'uploaded_date_string');
      console.log(this.videoGroupBy);
      for (let l = 0; l < this.videoGroupBy.length; l++) {
        this.checkArray.push({ "key": this.videoGroupBy[l].key, "value": [] });
        for (let j = 0; j < this.videoGroupBy[l].value.length; j++) {
          this.checkArray[l].value.push({ "uri": this.videoGroupBy[l].value[j].uri, "isChecked": false });
        }
      }      
      this.assetsArray = [];
    });

  }

  downloadVideo(fileName: string) {
    let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
    globalValues.downloadAsset(filename, this.videosService)
  }

  downloadMultipleAssets() {
    for (let i in this.assetsArray) {
      for (let j in this.videos) {
        if (this.assetsArray[i].uri == this.videos[j].uri) {
          let fileName = this.assetsArray[i].asset_link;
          let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
          globalValues.downloadAsset(filename, this.videosService);
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

  assetCopyCut(operation: string, asset_uri: string, asset_link: string) {
    for (var i = 0; i < this.videos.length; i++) {
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

  copyCutMultipleAssets(operation: string) {
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
    this.pasteDisable = globalValues.pasteDisable;  }

  newFolder(folder_name) {
    // let name = new ReplacePipe().transform(folder_name);
    console.log(folder_name);
    this.router.navigate(['home/myAssets/newFolder'], { queryParams: { name_of_folder: folder_name } });
  }

  assetPaste(destination_folder: string) {
    this.spinner.show();
    this.pasteArray = (globalValues.copyCutPaste);
    this.pasteArray.destination_folder = destination_folder;
    console.log(this.pasteArray);
    var value = globalValues.pasteAsset(this.pasteArray, this.videosService, this.notifier, this.spinner);
    value.then((val) => {
      this.pasteArray = [];
      globalValues.setCopyCutArray([]);
      this.assetsArray = [];
    });
    globalValues.setpasteDisable(true);
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

  folderPaste() {
    this.pasteArray = (globalValues.copyCutPaste);
    this.pasteArray.destination_folder = "/" + this.assetType;
    console.log(this.pasteArray);
    var flag = globalValues.pasteFolder(this.pasteArray, this.videosService, this.notifier);
    flag.then((val) => {
      this.pasteArray = [];
      globalValues.setCopyCutArray([]);
    });
  }

  checkType() {
    if (globalValues.type == 'folder') {
      this.folderPaste();
    }
    else if (globalValues.type == 'asset') {
      if (globalValues.extension == 'mp4') {
        this.assetPaste('bucket');
        this.test = true;
      }
      else {
        alert("You can only paste Videos");
      }
    }
    else if (globalValues.type == 'assetArray') {
      for (let i in globalValues.extensionArray) {
        if (globalValues.extensionArray[i] == 'mp4') {
          this.assetPaste('bucket');
          this.test = true;
        }
        else {
          alert('You can paste videos only');
        }
      }
    }
  }
}



@Component({
  selector: 'video-player',
  templateUrl: 'video-player.html',
  // styleUrls: ['./images.component.css']
})

export class VideoPlayer implements OnInit {
  ind;
  playVideo = [];
  videoObject;
  constructor(public dialogRef: MatDialogRef<VideoPlayer>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.videoObject = globalValues.videoObject;
    this.ind = globalValues.indexVideo;
    this.playVideo = globalValues.playVideo;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}