import { Component, OnInit, ViewChild } from '@angular/core';
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { UserPortalService } from "../Services/user-portal.service";
import { NotificationsService } from "angular2-notifications";
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from "@angular/router";
import { ImageViewer } from "../images/images.component";
// import { AudioPlayer } from "../results/results.component";
import { VideoPlayer } from "../videos/videos.component";
import { DetailsDialog } from "../details-dialog/details-dialog";
import { RenameDialog } from "../details-dialog/rename-dialog";
import { AssetsFields } from "../Interfaces/assets-fields";
import { AudioPlayer } from "../audios/audios.component";
import { GroupByPipe } from "../filters/groupBy.pipe";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-genric-search',
  templateUrl: './genric-search.component.html',
  styleUrls: ['./genric-search.component.css']
})
export class GenricSearchComponent implements OnInit {
  //URLs
  //Variables
  viewModule: boolean = true;
  countResult: number;
  keywordResult: string;
  value: string;
  data: any;

  //Arrays
  results: any = [];
  audioArray: any = [];
  videoArray: any = [];
  assetsArray: any = [];
  dataSource: any = [];
  imageGroupBy: any = [];
  checkArray: any = [];
  resultsCopy: any = [];
  displayedColumns = ['select', 'title', 'asset_type', 'size', 'actions'];
  selection = new SelectionModel<AssetsFields>(true, []);


  @ViewChild(MatSort) set content(sort: MatSort) {
    console.log("view");
    this.dataSource.sort = sort;
  }
  constructor(private genericService: UserPortalService,
    private notifier: NotificationsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) {
    spinner.show();
    globalValues.setImageArray([]);
    route.queryParams.subscribe(val => {
      let urlGenericSearch = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/' + sessionStorage.getItem('generic_search') + '/generalsearch';
      this.genericService.getData(urlGenericSearch)
        .subscribe(generic_response => {
          this.results = generic_response;
          this.resultsCopy = generic_response;
          for (let i = 0; i < this.results.length; i++) {
            this.resultsCopy[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['title'] = this.results[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['title'].substring(0, this.results[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['title'].lastIndexOf('.'));
          }
          this.dataSource = new MatTableDataSource(this.resultsCopy);
          this.countResult = this.results.length;
          this.keywordResult = sessionStorage.getItem('generic_search');
          for (var i = 0; i < generic_response.length; i++) {
            if (generic_response[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['asset_type'] == "image/png" ||
              generic_response[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['asset_type'] == "image/jpeg" ||
              generic_response[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['asset_type'] == "image/jpg") {
              console.log("img");
              globalValues.Images.push(generic_response[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['asset_link']);
            }
            if (generic_response[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['asset_type'] == "audio/mp3") {
              this.audioArray.push(generic_response[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']);
            }
            if (generic_response[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['asset_type'] == "video/mp4") {
              this.videoArray.push(generic_response[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']);
            }
            this.checkArray.push({ "uri": generic_response[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['uri'], "isChecked": false });

          }
          spinner.hide();
        })
    });

  }


  ngOnInit() {
    // this.spinner.hide();
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


  openResult(assetType, assetObject, uri, index) {
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


  getSearchDetails(uri: string, status: string) {
    let index;
    console.log("search");
    for (var i = 0; i < this.results.length; i++) {
      if (this.results[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['uri'] == uri) {
        index = i;
        break;
      }
    }
    if (status == "not-yet") {
      this.results[index]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['favourite_status'] = "yes";
    }
    else {
      this.results[index]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['favourite_status'] = "not-yet";
    }
    globalValues.getUriNFavStatus(uri, this.results[index]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['favourite_status'], this.genericService, this.notifier);
  }

  downloadResult(fileName: string) {
    let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);

    globalValues.downloadAsset(filename, this.genericService)
  }

  removeResult(uri: string) {
    let index;
    for (var i = 0; i < this.results.length; i++) {
      if (this.results[i]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['uri'] == uri) {
        index = i;
        break;
      }
    }
    let value = globalValues.deleteAsset(uri, this.genericService, this.notifier);
    value.then((val) => {
      this.results.splice(index, 1);
      this.results = this.results.slice();
      this.dataSource = new MatTableDataSource(this.results)
    });
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

  deleteMultipleResults() {
    let prom = [];
    console.log("multiple");
    for (let i in this.assetsArray) {
      for (let j in this.results) {
        if (this.assetsArray[i].uri == this.results[j]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['uri']) {
          let uri = this.assetsArray[i].uri;
          let value = globalValues.deleteAsset(uri, this.genericService, this.notifier);
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
          if (this.assetsArray[i].uri == this.results[j]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['uri']) {
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
        if (this.assetsArray[i].uri == this.results[j]['com.techm.PersonalizedMAM.Pojo.AssetPojo']['uri']) {
          let fileName = this.assetsArray[i].asset_link;
          let filename = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
          globalValues.downloadAsset(filename, this.genericService);
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
