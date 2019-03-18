import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { SelectionModel } from "@angular/cdk/collections";
import { AssetsFields } from "../Interfaces/assets-fields";
import { ImageViewer } from "../images/images.component";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { DetailsDialog } from "../details-dialog/details-dialog";
import { UserPortalService } from "../Services/user-portal.service";
import { RenameDialog } from "../details-dialog/rename-dialog";
import { NotificationsService } from "angular2-notifications";
import { VideoPlayer } from "../videos/videos.component";
import { AudioPlayer } from "../audios/audios.component";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.css']
})
export class NewFolderComponent implements OnInit {
  //Variables
  data: any;
  folderName: string;
  viewModule: boolean = true;
  selection = new SelectionModel<AssetsFields>(true, []);
  pasteDisable: boolean = true;
  copyDisable: boolean = true;
  cutDisable: boolean = true;
  test: boolean = false;
  //Arrays
  assets: any = [];
  assetsCopy: any = [];
  audioArray: any = [];
  videoArray: any = [];
  assetsArray: any = [];
  assetUri: any = [];
  dataSource: any = [];
  checkArray: any = [];
  pasteArray: any = [];
  assetLink: any = [];
  displayedColumns = ['select', 'title', 'asset_type', 'size', 'actions'];

  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private folderService: UserPortalService,
    private notifier: NotificationsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.pasteDisable = globalValues.pasteDisable;
    this.spinner.show();    
    //query Params
    this.data = this.route
      .queryParams
      .subscribe(params => {
        this.folderName = params['name_of_folder']
      });

    globalValues.setImageArray([]);
    let urlFetchAsset = 'http://' + globalValues.ipAdrs + '/pmam/' + sessionStorage.getItem('currentUser') + '/getassetsinfolder?folder_name=' + this.folderName + '';
    console.log(urlFetchAsset);
    this.folderService.getData(urlFetchAsset)
      .subscribe(asset_response => {
        this.assets = asset_response;
        this.assetsCopy = asset_response;
        for (let i = 0; i < this.assets.length; i++) {
          this.assetsCopy[i].title = this.assets[i].title.substring(0, this.assets[i].title.lastIndexOf('.'));
        }        
        console.log(asset_response);
        this.dataSource = new MatTableDataSource(this.assets); 
        this.dataSource.filterPredicate = function(data: AssetsFields, filter: string): boolean {
          return data.title.toLowerCase().includes(filter);
        };
        for (var i = 0; i < this.assets.length; i++) {
          if (this.assets[i].asset_type == "image/png" ||
            this.assets[i].asset_type == "image/jpeg" ||
            this.assets[i].asset_type == "image/jpg") {
            globalValues.Images.push(this.assets[i].asset_link);
          }
          if (this.assets[i].asset_type == "audio/mp3") {
            this.audioArray.push(this.assets[i]);
          }
          if (this.assets[i].asset_type == "video/mp4") {
            this.videoArray.push(this.assets[i]);
          }
          this.checkArray.push({ "uri": asset_response[i].uri, "isChecked": false });

        }
        this.spinner.hide();
      })

  }

  applyFilter(filterValue: string) {
    console.log(filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length == 0) {
      this.displayedColumns = ['results'];
    }else if(this.dataSource.filteredData == ""){
      this.displayedColumns = ['select', 'title', 'asset_type', 'size', 'actions'];
    } 
    else if(this.dataSource.filteredData.length != 0) {
      this.displayedColumns = ['select', 'title', 'asset_type', 'size', 'actions'];
    }
  }

  openAsset(assetType, assetObject, uri, index) {
    console.log(index + "" + "chk");
    console.log(JSON.stringify(assetObject));
    if (assetType === "image/png" || assetType === "image/jpeg" || assetType === "image/jpg") {
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
      for (let i in this.videoArray) {
        globalValues.playVideo.push(false);
        if (this.videoArray[i].uri == uri) {
          globalValues.playVideo[index] = true;
          break;
        }
      }


    }
  }

    getAssetDetails(uri: string, status: string) {
      let index;
    console.log("search");
    for (var i = 0; i < this.assets.length; i++) {
      if (this.assets[i].uri == uri) {
        index = i;
        break;
      }
    }
    if (status == "not-yet") {
      this.assets[index].favourite_status = "yes";
    }
    else {
      this.assets[index].favourite_status = "not-yet";
    }
    globalValues.getUriNFavStatus(uri, this.assets[index].favourite_status, this.folderService, this.notifier);
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
      data: { asset_type: asset.asset_type, size: asset.size, directory: asset.directory, owner: asset.owner }
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

  assetPaste(){
    this.test = true;
    this.spinner.show();
    console.log("paste");
    this.pasteArray = (globalValues.copyCutPaste);
    this.pasteArray.destination_folder = this.folderName;
    console.log(this.pasteArray);
    var value = globalValues.pasteAsset(this.pasteArray,this.folderService,this.notifier,this.spinner);
    value.then((val) => {
     this.pasteArray = [];
     globalValues.setCopyCutArray([]);
    });    
    globalValues.setpasteDisable(true);
}

  downloadResult(fileName: string) {
    console.log(fileName);
    let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
    globalValues.downloadAsset(filename, this.folderService)
  }

  removeResult(uri: string) {
    console.log("new");
    let index;
    for (var i = 0; i < this.assets.length; i++) {
      if (this.assets[i].uri == uri) {
        index = i;
        break;
      }
    }
    let value = globalValues.deleteAssetFolder(uri, this.folderService,this.folderName, this.notifier);
    value.then((val) => {
      this.assets.splice(index, 1);
      this.assets = this.assets.slice();
      this.assetsCopy = this.assets;
      this.dataSource = new MatTableDataSource(this.assets)
    });
  }


    assetCopyCut(operation: string, asset_uri: string,asset_link: string){
     for (var i = 0; i < this.assets.length; i++) {
        this.assetUri.push(asset_uri);
        break;
    }
    globalValues.setCopyCutArray({
      'email_id': sessionStorage.getItem('currentUser'),
      'operation': operation,
      'uris': this.assetUri,
      'destination_folder': "",
      'source_folder': this.folderName

    })
    globalValues.setType('asset');
    var ext = globalValues.stringBeforeChar(asset_link);
    globalValues.setExtension(ext);  
    globalValues.setpasteDisable(false);
    this.pasteDisable = globalValues.pasteDisable;
     }

    copyCutMultipleAssets(operation: string){
    console.log(this.assetsArray);
    this.assetUri = [];      
     for (let i = 0; i < this.assetsArray.length; i++) {
        this.assetUri.push(this.assetsArray[i].uri);
        this.assetLink.push(this.assetsArray[i].asset_link);

      }
    
    globalValues.setCopyCutArray({
      'email_id': sessionStorage.getItem('currentUser'),
      'operation': operation,
      'uris': this.assetUri,
      'destination_folder': "",
      'source_folder': this.folderName
    })
    globalValues.setType('assetArray');
    var extArr: any = [];
    for(let j in this.assetLink){
      extArr.push(globalValues.stringBeforeChar(this.assetLink[j])); 
    }
    globalValues.setExtensionArray(extArr);  
    for (let m = 0; m < this.checkArray.length; m++) {
      this.checkArray[m].isChecked = false;
    }
    this.assetsArray = []; 
    globalValues.setpasteDisable(false);
    this.pasteDisable = globalValues.pasteDisable; 
  }

  changeView() {
    this.viewModule = !this.viewModule;

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
      console.log("if chk");
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
      for (let j in this.assets) {
        if (this.assetsArray[i].uri == this.assets[j].uri) {
          let uri = this.assetsArray[i].uri;
          let value = globalValues.deleteAsset(uri, this.folderService, this.notifier);
          console.log(value);
          prom.push(value);
          break;
        }

      }
    }
    Promise.all(prom).then((val) => {
      console.log(val);
      for (let i = 0; i < val.length; i++) {
        for (let j in this.assets) {
          if (this.assetsArray[i].uri == this.assets[j].uri) {
            this.assets.splice(j, 1);
            this.assets = this.assets.slice();
            this.assetsCopy = this.assets;
            this.dataSource = new MatTableDataSource(this.assets);
            break;
          }
        }
      }
      this.assetsArray = [];
    });

  }



  downloadMultipleAssets() {
    for (let i in this.assetsArray) {
      for (let j in this.assets) {
        if (this.assetsArray[i].uri == this.assets[j].uri) {
          let fileName = this.assetsArray[i].asset_link;
          let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
          globalValues.downloadAsset(filename, this.folderService);
          for (let j = 0; j < this.checkArray.length; j++) {
            this.checkArray[j].isChecked = false;

          }
          break;
        }
      }
    }
    this.assetsArray = [];
  }

}
