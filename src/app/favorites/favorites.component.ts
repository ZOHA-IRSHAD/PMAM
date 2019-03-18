import { Component, OnInit, ViewChild } from '@angular/core';
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { UserPortalService } from "../Services/user-portal.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ImagesComponent, ImageViewer } from "../images/images.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatTableDataSource } from '@angular/material';
import { AudioPlayer } from "../audios/audios.component";
import { VideoPlayer } from "../videos/videos.component";
import { NotificationsService } from "angular2-notifications";
import { SelectionModel } from "@angular/cdk/collections";
import { DetailsDialog } from "../details-dialog/details-dialog";
import { RenameDialog } from "../details-dialog/rename-dialog";
import { AssetsFields } from "../Interfaces/assets-fields";
import { GroupByPipe } from "../filters/groupBy.pipe";
import { DetailsFolder } from "../details-dialog/details-folder";
import { RenameFolder } from "../details-dialog/rename-folder";
import { FolderFields } from "../Interfaces/folder-fields";
import { ReplacePipe } from "../filters/replace.pipe";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  //URLs
  urlFavorites = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/fetchfavourites';
  //Variables
  viewModule: boolean = true;
  data: any;
  assetType: any;
  //Arrays
  favorites: any = [];
  audioArray: any = [];
  videoArray: any = [];
  assetsArray: any = [];
  dataSource: any = [];
  dataSourceFolder: any = [];
  displayedColumns = ['select', 'title', 'uploaded_date_string', 'asset_type', 'size', 'actions'];
  // displayedColFolder = ['icon', 'folder_name', "actions"];
  selection = new SelectionModel<AssetsFields>(true, []);
  checkArray: any = [];
  imageGroupBy: any = [];
  userDetails: any = [];
  folderDetails: any = [];
  folders: any = [];
  checkListArray: any = [];
  assetUri: any = [];
  pasteArray: any = [];
  folderNameArray: any = [];
  favoritesCopy: any = [];
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
  constructor(private favService: UserPortalService,
    private dialog: MatDialog,
    private notifier: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    //query Params
    this.data = this.route
      .queryParams
      .subscribe(params => {
        this.assetType = params['type_of_asset']
      });

    globalValues.setImageArray([]);
    //service for fetching favorite assets
    this.favService.getData(this.urlFavorites)
      .subscribe(fav_response => {
        this.favorites = fav_response;
        this.favoritesCopy = fav_response;
        for (let  i  =  0; i  <  this.favorites.length; i++) {
          this.favoritesCopy[i].title  =  this.favorites[i].title.substring(0, this.favorites[i].title.lastIndexOf('.'));
        }          
        this.dataSource = new MatTableDataSource(this.favoritesCopy);
        this.dataSource.filterPredicate = function (data: AssetsFields, filter: string): boolean {
          return data.title.toLowerCase().includes(filter);
        };
        for (var i = 0; i < fav_response.length; i++) {
          if (fav_response[i].asset_type == "image/png" || fav_response[i].asset_type == "image/jpg" || fav_response[i].asset_type == "image/jpeg") {
            globalValues.Images.push(fav_response[i].asset_link);
          }
          if (fav_response[i].asset_type == "audio/mp3") {
            this.audioArray.push(fav_response[i]);
          }
          if (fav_response[i].asset_type == "video/mp4") {
            this.videoArray.push(fav_response[i]);
          }
          this.checkListArray.push({ "uri": fav_response[i].uri, "isChecked": false });
        }
        console.log(this.favorites);
        this.imageGroupBy = new GroupByPipe().transform(fav_response, 'asset_type');
        console.log(this.imageGroupBy);
        for (var i = 0; i < this.imageGroupBy.length; i++) {
          this.checkArray.push({ "key": this.imageGroupBy[i].key, "value": [] });
          for (let j = 0; j < this.imageGroupBy[i].value.length; j++) {
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
    }else if(this.dataSource.filteredData == ""){
      this.displayedColumns = ['select', 'title', 'uploaded_date_string', 'asset_type', 'size', 'actions'];
    } 
    else if(this.dataSource.filteredData.length != 0) {
      this.displayedColumns = ['select', 'title', 'uploaded_date_string', 'asset_type', 'size', 'actions'];
    }
  }

  openViewer(assetObject, index) {
    let dialogRef = this.dialog.open(ImageViewer, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    for (let i = 0; i < globalValues.Images.length; i++) {
      if (globalValues.Images[i] === assetObject.asset_link) {
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
    });

  }

  openListAsset(assetType, assetObject, uri, index) {
    console.log(index + "" + "chk");
    console.log(JSON.stringify(assetObject));
    if (assetType === "image/png") {
      console.log("if");
      let dialogRef = this.dialog.open(ImageViewer, {
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
      for (let i = 0; i < globalValues.Images.length; i++) {
        if (globalValues.Images[i] === assetObject.asset_link) {
          globalValues.setIndexImage(i);
          break;
        }
      }

    }
    if (assetType == "audio/mp3") {
      globalValues.setAudioObject(assetObject);
      globalValues.setIndexAudio(index);
      globalValues.setAudioListArray([]);
      let dialogRef = this.dialog.open(AudioPlayer, {
        width: '500px'
      });

      dialogRef.afterClosed().subscribe(result => {
      });
      for (let i in this.audioArray) {
        globalValues.playAudio.push(false);
        if (this.audioArray[i].uri == uri) {
          globalValues.playAudio[index] = true;
          break;
        }
      }
    }
    if (assetType == "video/mp4") {
      globalValues.setVideoObject(assetObject);
      globalValues.setIndexVideo(index);
      globalValues.setVideoListArray([]);
      let dialogRef = this.dialog.open(VideoPlayer, {});

      dialogRef.afterClosed().subscribe(result => {
      });
      for (let i in this.favorites) {
        globalValues.playVideo.push(false);
        if (this.favorites[i].uri == uri) {
          globalValues.playVideo[index] = true;
          break;
        }
      }


    }
  }

  removeAsset(uri: string) {
    let index;
    for (var i = 0; i < this.favorites.length; i++) {
      if (this.favorites[i].uri == uri) {
        index = i;
        break;
      }
    }
    let value = globalValues.getUriNFavStatus(uri, 'not-yet', this.favService, this.notifier);
    value.then((val) => {
      console.log("remove" + val);
      this.favorites.splice(index, 1);
      this.favorites = this.favorites.slice();
      this.favoritesCopy = this.favorites;
      this.dataSource = new MatTableDataSource(this.favorites);
    });

  }

  deleteFolder(folder_name, index) {
    let value = globalValues.removeFolder(folder_name, this.favService, this.notifier);
    value.then((val) => {
      console.log(val);
      this.folders.splice(index, 1);
      this.folders = this.folders.slice();
      this.dataSourceFolder = new MatTableDataSource(this.folders);
    })
  }

  // assetCopyCut(operation: string, asset_uri: string) {
  //   for (var i = 0; i < this.favorites.length; i++) {
  //     i;
  //     this.assetUri.push(asset_uri);
  //     break;
  //   }
  //   globalValues.setCopyCutArray(({
  //     'email_id': sessionStorage.getItem('currentUser'),
  //     'operation': operation,
  //     'uris': this.assetUri,
  //     'destination_folder': "",
  //     'source_folder': 'bucket'
  //   }))
  // }

  // copyCutMultipleAssets(operation: string) {
  //   for (var i = 0; i < this.assetsArray.length; i++) {
  //     this.assetUri.push(this.assetsArray[i].uri);
  //   }

  //   globalValues.setCopyCutArray({
  //     'email_id': sessionStorage.getItem('currentUser'),
  //     'operation': operation,
  //     'uris': this.assetUri,
  //     'destination_folder': "",
  //     'source_folder': 'bucket'
  //   });
  // }

  // assetPaste(destination_folder: string) {
  //   this.pasteArray = (globalValues.copyCutPaste);
  //   this.pasteArray.destination_folder = destination_folder;
  //   console.log(this.pasteArray);
  //   var value = globalValues.pasteAsset(this.pasteArray, this.favService, this.notifier);
  //   value.then((val) => {
  //     this.pasteArray = [];
  //     globalValues.setCopyCutArray([]);
  //   });
  // }

  changeView() {
    this.viewModule = !this.viewModule;
   if(!this.viewModule){
this.checkListArray = [];
for(let i = 0;i < this.checkArray.length;i++){
for(let j = 0;j < this.checkArray[i].value.length;j++){
this.checkListArray.push(this.checkArray[i].value[j]);
}
}
} 
  }

  pushAsset(item, index) {
    let flag = 0;
    if (this.assetsArray.length > 0) {
      for (let i = 0; i < this.assetsArray.length; i++) {
        if (this.assetsArray[i].uri == item.uri) {
          console.log("unchecked");
          this.assetsArray.splice(i, 1);
          flag = 1;
          break;
        }
      }
      if (!flag) {
        this.assetsArray.push(item);
      }
    }
    else {
      this.assetsArray.push(item);
      console.log(this.checkArray);
    }
    console.log(this.assetsArray);
  }


  downloadFav(fileName: string) {
    let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
    globalValues.downloadAsset(filename, this.favService)
  }

  downloadMultipleAssets() {
    for (let i in this.assetsArray) {
      for (let j in this.favorites) {
        if (this.assetsArray[i].uri == this.favorites[j].uri) {
          let fileName = this.assetsArray[i].asset_link;
          let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
          globalValues.downloadAsset(filename, this.favService);
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


  // openRenameFolder(folder_name: string) {
  //   console.log(folder_name);
  //   let dialogRef = this.dialog.open(RenameFolder, {
  //     width: '300px',
  //     data: { folder_name: folder_name }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });

  // }

  // openDetailsFolder(folder_info) {
  //   console.log(folder_info);
  //   let dialogRef = this.dialog.open(DetailsFolder, {
  //     width: '400px',
  //     data: { created_date: folder_info.created_date, location: folder_info.folder_name, folder_size: +((folder_info.size / (1024 * 1024 * 1024)).toFixed(3)), asset_count: folder_info.count }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

  // folderPaste() {
  //   this.pasteArray = (globalValues.copyCutPaste);
  //   this.pasteArray.destination_folder = "/" + this.assetType;
  //   console.log(this.pasteArray);
  //   var flag = globalValues.pasteFolder(this.pasteArray, this.favService, this.notifier);
  //   flag.then((val) => {
  //     this.pasteArray = [];
  //     globalValues.setCopyCutArray([]);
  //   });
  // }

  // newFolder(folder_name) {
  //   console.log(folder_name);
  //   this.router.navigate(['home/myAssets/newFolder'], { queryParams: { name_of_folder: folder_name } });
  // }

  // folderCopyCut(operation: string, folder_name: string) {
  //   for (var i = 0; i < this.folders.length; i++) {
  //     this.folderNameArray.push(folder_name);
  //     break;
  //   }
  //   globalValues.setCopyCutArray({
  //     'email_id': sessionStorage.getItem('currentUser'),
  //     'operation': operation,
  //     'uris': this.folderNameArray,
  //     'destination_folder': "",
  //     'source_folder': "/" + this.assetType
  //   })

  // }

}