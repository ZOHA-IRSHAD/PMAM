import { Component, OnInit, ViewChild } from '@angular/core';
import { UserPortalService } from "../Services/user-portal.service";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { NotificationsService } from "angular2-notifications";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ImageViewer } from "../images/images.component";
import { SelectionModel } from "@angular/cdk/collections";
import { AudioPlayer } from "../audios/audios.component";
// import { VideoPlayer } from "../results/results.component";
import { MatSort, MatTableDataSource } from "@angular/material";
import { DetailsDialog } from "../details-dialog/details-dialog";
import { RenameDialog } from "../details-dialog/rename-dialog";
import { VideoPlayer } from "../videos/videos.component";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {
  //Variables
  countResult: number;
  viewModule: boolean = true;
  //Arrays
  results: any = [];
  audioArray: any = [];
  videoArray: any = [];
  assetsArray: any = [];
  dataSource: any = [];
  checkArray: any = [];
  resultsCopy: any = [];
  displayedColumns = ['select', 'title', 'asset_type', 'size', 'actions'];
  selection = new SelectionModel<Element>(true, []);

  // @ViewChild(MatSort) set content(sort: MatSort) {
  //   console.log("view");
  //     this.dataSource.sort = sort;
  // }

  constructor(private advanceService: UserPortalService,
    private notifier: NotificationsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) {
      spinner.show();
    globalValues.setImageArray([]);
    route.queryParams.subscribe(advance_response => {
      this.results = globalValues.advancedSearch;
      this.resultsCopy = globalValues.advancedSearch;
      for (let i = 0; i < this.results.length; i++) {
        this.resultsCopy[i].title = this.results[i].title.substring(0, this.results[i].title.lastIndexOf('.'));
      }
      this.dataSource = new MatTableDataSource(this.results);
      this.countResult = this.results.length;
      for (var i = 0; i < this.results.length; i++) {
        if (this.results[i].asset_type == "image/png" || this.results[i].asset_type == "image/jpg" || this.results[i].asset_type == "image/jpeg") {
          console.log("img");
          globalValues.Images.push(this.results[i].asset_link);
        }
        if (this.results[i].asset_type == "audio/mp3") {
          this.audioArray.push(this.results[i]);
        }
        if (this.results[i].asset_type == "video/mp4") {
          this.videoArray.push(this.results[i]);
        }
        this.checkArray.push({ "uri": this.results[i].uri, "isChecked": false });

      }
      spinner.hide();
    })
  }

  ngOnInit() {    
     this.spinner.hide();
}

  changeView() {
    this.viewModule = !this.viewModule;   
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
      data: { asset_type: asset.asset_type, size: +((asset.size / (1024 * 1024 * 1024)).toFixed(3)), directory: asset.directory, owner: asset.owner }
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


  openResult(assetType, assetObject, uri, index) {
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
      for (let i in this.videoArray) {
        globalValues.playVideo.push(false);
        if (this.videoArray[i].uri == uri) {
          globalValues.playVideo[index] = true;
          break;
        }
      }


    }
  }

  getSearchDetails(uri: string, status: string, index) {
    console.log("search");
    for (var i = 0; i < this.results.length; i++) {
      if (this.results[i].uri == uri) {
        index = i;
        break;
      }
    }
    if (status == "not-yet") {
      this.results[index].favourite_status = "yes";
    }
    else {
      this.results[index].favourite_status = "not-yet";
    }
    globalValues.getUriNFavStatus(uri, this.results[index].favourite_status, this.advanceService, this.notifier);
  }


  downloadResult(fileName: string) {
    let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
    globalValues.downloadAsset(filename, this.advanceService)
  }

  removeResult(uri: string, index) {
    for (var i = 0; i < this.results.length; i++) {
      if (this.results[i].uri == uri) {
        index = i;
        break;
      }
    }
    let value = globalValues.deleteAsset(uri, this.advanceService, this.notifier);
    value.then((val) => {
      this.results.splice(index, 1);
      this.results = this.results.slice();
      this.dataSource = this.results;
    })
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

  deleteMultipleAssets() {
    let prom = [];
    console.log("multiple");
    for (let i in this.assetsArray) {
      for (let j in this.results) {
        if (this.assetsArray[i].uri == this.results[j].uri) {
          let uri = this.assetsArray[i].uri;
          let value = globalValues.deleteAsset(uri, this.advanceService, this.notifier);
          console.log(value);
          prom.push(value);
          break;
        }

      }
    }
    Promise.all(prom).then((val) => {
      console.log(val);
      for (let i = 0; i < val.length; i++) {
        for (let j in this.results) {
          if (this.assetsArray[i].uri == this.results[j].uri) {
            this.results.splice(j, 1);
            this.results = this.results.slice();
            this.dataSource = new MatTableDataSource(this.results);
            break;
          }
        }
      }
      this.assetsArray = [];
    });

  }


  downloadMultipleResults() {
    for (let i in this.assetsArray) {
      for (let j in this.results) {
        if (this.assetsArray[i].uri == this.results[j].uri) {
          let fileName = this.assetsArray[i].asset_link;
          let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
          globalValues.downloadAsset(filename, this.advanceService);
          for (let j = 0; j < this.checkArray.length; j++) {
            this.checkArray[j].isChecked = false;

          }
          break;
        }
      }
    }
    // console.log(this.checkArray);
    this.assetsArray = [];
  }
}
