import { Component, OnInit, Inject, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTableDataSource } from '@angular/material';
import { FormControl, Validators, FormGroup, FormArray } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { FileUploader, FileItem, ParsedResponseHeaders } from "ng2-file-upload";
import { Router, RouterLinkActive, ActivatedRoute } from "@angular/router";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { MediaMatcher } from '@angular/cdk/layout';
import { UserPortalService } from "../Services/user-portal.service";
import { DatePipe } from "@angular/common";
import { UploadedItemAttribute } from "../Interfaces/uploaded-item-attribute";
import { CustomFileUploader } from "../custom-file-uploader/custom-file-uploader";
import { NotificationsService } from "angular2-notifications";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //URLs
  urlUserName = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/getusername ';
  urlUserDetails = 'http://' + globalValues.ipAdrs + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/getuserdetails';
  //Variables
  value: string;
  selectedValue: string;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  userName: any;
  value1: any;
  //Arrays
  user_details: any = [];
  // searchForm:FormGroup;
  constructor(public dialog: MatDialog,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private userNameService: UserPortalService,
    private spinner: NgxSpinnerService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    console.log("1");
    this.spinner.show();
    this.userNameService.getData(this.urlUserDetails)
      .subscribe(userDetails_response => {
        console.log("home");
        console.log(userDetails_response);
        sessionStorage.setItem('user_details', JSON.stringify(userDetails_response));
        this.user_details = JSON.parse(sessionStorage.getItem('user_details'));
        this.userName = ((this.user_details.firstname) + " " + (this.user_details.lastname));
      });
  }

  searchForm = new FormGroup({
    genricSearch: new FormControl()
  })

  onSubmitGeneric(searchFormDetails: FormGroup) {
    console.log(searchFormDetails.getRawValue().genricSearch);
    sessionStorage.setItem('generic_search', searchFormDetails.getRawValue().genricSearch);
    this.router.navigate(['home/genricSearch'], { queryParams: { value: sessionStorage.getItem('generic_search') } });
  }


  advancedSearchOptions = [
    { icon: 'assets/ic_image_black_24px.svg', value: 'Images' },
    { icon: 'assets/ic_ondemand_video_black_24px.svg', value: 'Videos' },
    { icon: 'assets/ic_audiotrack_black_24px.svg', value: 'Audios' },
    { icon: 'assets/ic_description_black_24px.svg', value: 'Docs' }
  ];

  openDialogAdvanceSearch(value: string) {
    this.value = value;
    let dialogRef = this.dialog.open(AdvanceSearch, {
      height: '600px',
      width: '500px',
      data: { option: this.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.selectedSearch = null;
    });
  }




  openDialogImage(): void {
    let dialogRef = this.dialog.open(SearchByImage, {
      width: '500px',
      height: '400px'
      //data: { file:this.file }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  createFolder() {
    let dialogRef = this.dialog.open(CreateNewFolder, {
      data: { bucket: sessionStorage.getItem('asset_type') }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogFileUpload(): void {
    let dialogRef = this.dialog.open(FileUpload, {
      width: '500px',
      height: '450px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.selectedSearch = null;
      console.log("file-upload closed");
      dialogRef.close();
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  SignOut() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('user_details');
    sessionStorage.clear();
    sessionStorage.removeItem('asset_type');
    sessionStorage.removeItem('generic_search');
    sessionStorage.removeItem('auth');
    this.router.navigate(['/']);

  }
}

@Component({
  selector: 'advance-search',
  templateUrl: 'advance-search.html',
  styleUrls: ['advance-search.css']

})
export class AdvanceSearch implements OnInit {
  //URLs
  urlLocation = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/getlocations';
  urlArtist = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/getartists';
  urlLanguage = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/getlanguages';
  //Variables
  locationCtrl: FormControl;
  advancedForm: FormGroup;
  randomNum: any;
  startDate = new Date("1990-01-01");
  endDate = new Date();
  //Arrays  
  Location: any = [];
  Artist: any = [];
  Language: any = [];
  Year: any = [];
  Type = ['jpeg', 'jpg', 'png'];
  Gender = ['All', 'Male', 'Female'];
  Orientation = ['All', 'Horizontal', 'Vertical'];
  Size = ['0-0.5', '0.5-1', '1-2', '2-5'];
  Mood = ['Aggressive', 'Angry', 'Arousing', 'Atmospheric', 'Bittersweet', 'Bleak', 'Bright', 'Calm', 'Carefree', 'Cheerful', 'Confident',
    'Dark', 'Dramatic', 'Dreamy', 'Epic', 'Ethereal', 'Fear', 'Fiery', 'Fragile', 'Fun', 'Happy', 'Heartbroken', 'Hopeful',
    'Inspiring', 'Intense', 'Love', 'Melancholic', 'Mellow', 'Merry', 'Optimistic', 'Playful', 'Quirky', 'Reflective', 'Remorseful', 'Romantic',
    'Sad', 'Sensual', 'Serene', 'Sexy', 'Silly', 'Sophisticated', 'Spiritual', 'Tender', 'Terror', 'Uplifting', 'Wistful', 'Worry'];
  Genre = ['Audio Logos', 'Blues', 'Children', 'Chill Out', 'Classical', 'Corporate', 'Country', 'Dance/Electronic', 'Dubstep',
    'Easy Listening', 'Electro Pop', 'Folk', 'Games', 'Hip-Hop/Rap', 'Holiday', 'Indie Pop', 'Jazz', 'Latin', 'New Age',
    'Pop/Rock', 'Production', 'R&B/Soul', 'Reggae/Ska', 'Rock', 'Trailer', 'World/International'];

  Tempo = ['Very Slow (0-60 bpm)', 'Slow (60-100 bpm)', 'Moderate (100-120 bpm)', 'Lively (120-140 bpm)', 'Fast (140-160 bpm)', 'Very Fast (160-400 bpm)'];
  Duration = ['any duration', 'short(0-4 min.)', 'medium(4-20 min.)', 'long(20+ min.)'];
  Quality = ['any quality', 'high quality only'];
  Date = ['anytime', 'last 24 hours', 'upto a week ago', 'upto a month ago', 'upto a year ago'];

  constructor(public dialogRef: MatDialogRef<AdvanceSearch>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceService: UserPortalService,
    private router: Router) { }

  ngOnInit() {
    globalValues.setAdvancedSearch([]);
    //service for fetching location
    this.advanceService.getData(this.urlLocation)
      .subscribe(location_response => {
        this.Location = location_response;
      })

    //service for fetching artist
    this.advanceService.getData(this.urlArtist)
      .subscribe(artist_response => {
        this.Artist = artist_response;
      })
    //service for fetching language 
    this.advanceService.getData(this.urlLanguage)
      .subscribe(language_response => {
        this.Language = language_response;
      })

    this.getYearArray(this.startDate, this.endDate);

    this.advancedForm = new FormGroup({
      'keywords': new FormArray([new FormControl('')]),
      'location': new FormControl(),
      'image_type': new FormControl(),
      'gender': new FormControl(),
      'daterange': new FormControl(),
      'orientation': new FormControl(),
      'sizerange': new FormControl(),
      'artist': new FormControl(),
      'mood': new FormControl(),
      'genre': new FormControl(),
      'tempo': new FormControl(),
      'year': new FormControl(),
      'includes': new FormArray([new FormControl('')]),
      'excludes': new FormArray([new FormControl('')]),
      'language': new FormControl(),
      'duration': new FormControl(),
      'video_quality': new FormControl(),
      'subtitles': new FormControl()
    })
  }

  generateRandom() {
    this.randomNum = Math.floor(Math.random() * 100 + 1);
  }

  // function for year array
  getYearArray = function (start, end) {
    var
      arr = new Array(),
      dt = new Date(start);

    while (dt <= end) {
      arr.push(new Date(dt).getFullYear());
      dt.setFullYear(dt.getFullYear() + 1);
    }
    this.Year = arr;
    return arr;
  }


  get keywords(): FormArray {
    return this.advancedForm.get('keywords') as FormArray;
  }
  get includes(): FormArray {
    return this.advancedForm.get('includes') as FormArray;
  }
  get excludes(): FormArray {
    return this.advancedForm.get('excludes') as FormArray;
  }

  addField(value: string) {
    console.log(value);
    if (value == 'keywords') {
      this.keywords.push(new FormControl());
    }
    else if (value == 'includes') {
      this.includes.push(new FormControl());
    }
    else if (value == 'excludes') {
      this.excludes.push(new FormControl());
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmitAdvanced() {
    this.generateRandom();
    this.dialogRef.close();
    let urlAdvanceSearch = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/' + this.data.option + '/advancedsearch';
    console.log(this.advancedForm.value);
    this.advanceService.postData(urlAdvanceSearch, this.advancedForm.value)
      .subscribe(advance_response => {
        for (var i in advance_response) {
          globalValues.advancedSearch.push(advance_response[i]);
        }
        console.log(this.data.option.concat(this.randomNum));
        this.router.navigate(['home/advancedSearch'], { queryParams: { value: this.data.option.concat(this.randomNum) } });
      })
  }



}
@Component({
  selector: 'search-by-image',
  templateUrl: 'search-by-image.html',
  styleUrls: ['./search-by-image.css']
})
export class SearchByImage {
  //URLs
  urlImageSearch = '';
  public hasBaseDropZoneOver: boolean = false;
  public hasFileSelected: boolean = false;

  constructor(public dialogRef: MatDialogRef<SearchByImage>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router) {
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }

  }

  public uploader: FileUploader = new FileUploader({
    url: this.urlImageSearch,
    isHTML5: true,
    authToken: sessionStorage.getItem('auth')

});

  getResult() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;

    };

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
}

    this.uploader.onSuccessItem = ((item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any => {
    });

    this.uploader.onCompleteItem = ((item: any, response: any, status: any, headers: any) => {
    });

    this.uploader.onErrorItem = ((item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any => {
    });
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = true;
    this.getResult();
  }

  public onFileSelected(e1: any): void {
    this.hasFileSelected = true;
    this.getResult();
  }
  uploadAllFiles() {
    this.uploader.uploadAll();
  }


  onClickCancel(): void {
    this.uploader.clearQueue();
    this.uploader.cancelAll();
    this.dialogRef.close();
  }



  // public fileOverBase(e: any): void {
  //   this.hasBaseDropZoneOver = e;

  //   if (this.uploader.getNotUploadedItems().length >= 1) {
  //     this.dialogRef.close();
  //     this.router.navigate(["/imageSearchResult"]);
  //   }
  // }
  // public onFileSelected(e1: any): void {
  //   this.hasFileSelected = e1;
  //   if ( this.uploader.getNotUploadedItems().length >= 1) {
  //     this.dialogRef.close();
  //     this.router.navigate(["/imageSearchResult"]);
  //   }

  // }

}
@Component({
  selector: 'create-new-folder',
  templateUrl: 'create-new-folder.html',
  styles: [`.newFolder { text-align: center !important} `]
})

export class CreateNewFolder implements OnInit {
  //Variables
  folderForm: FormGroup;
  public folderData: any = {};
  //Arrays
  assetsInFolder: any = [];
  newFolder: any = [];
  constructor(public dialogRef: MatDialogRef<CreateNewFolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private folderService: UserPortalService,
    private notifier: NotificationsService,
    private zone: NgZone) {

  }

  ngOnInit() {
    console.log(this.data.bucket);
    this.folderForm = new FormGroup({
      'folder_name': new FormControl('')
    });

    this.folderForm.patchValue({
      'folder_name': "Untitled folder"
    });
  }

  onCreate() {
    console.log("on Create");
    if (this.folderForm.value.folder_name == "") {
      this.folderForm = new FormGroup({
        'folder_name': new FormControl("Untitled folder")
      })
    }
    var value = ({
      'folder_name': this.folderForm.value.folder_name
    })

    if (this.data.bucket != undefined || this.data.bucket != null) {
      this.folderData.folders_details = {
        "folder_name": "/" + this.data.bucket + "/" + this.folderForm.value.folder_name,
        "asset_in_folder": this.assetsInFolder,
        "trash_status": "no"
      },
        this.folderData.email_id = sessionStorage.getItem('currentUser')
    } else if (this.data.bucket == null) {
      this.folderData.folders_details = {
        "folder_name": "/" + this.folderForm.value.folder_name,
        "asset_in_folder": this.assetsInFolder,
        "trash_status": "no"
      },
        console.log(this.folderForm.value.folder_name);
      this.folderData.email_id = sessionStorage.getItem('currentUser')
    }
    this.newFolder.push(this.folderData.folders_details);
    this.folderData.folders_details = this.newFolder;
    console.log(this.folderData);

    let urlNewFolder = 'http://' + globalValues.ipAdrs + '/pmam/user/createnewfolder';
    this.folderService.postData(urlNewFolder, this.folderData)
      .subscribe(folder_response => {
        console.log(folder_response);
        if (folder_response.response == "successfully created folder") {
          this.notifier.success("Successfully Created");
          this.dialogRef.close();
          let urlUserDetails = 'http://' + globalValues.ipAdrs + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/getuserdetails';
          this.folderService.getData(urlUserDetails)
            .subscribe(info_response => {
              sessionStorage.setItem('user_details', JSON.stringify(info_response));
            })
        }
        else {
          this.notifier.error("Failed in creating folder");
        }
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}

@Component({
  selector: 'file-upload',
  templateUrl: 'file-upload.html',
  styleUrls: ['search-by-image.css']

})

export class FileUpload implements OnInit {
  //Variables
  isClickedOnce: boolean = false;
  dataSource: any = [];
  enableTry: boolean = false;
  folderName: string;
  //Columns
  displayedColumnsFile = ['Name', 'Size', 'Action', 'Status'];

  //URLs
  urlFileUpload = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/uploadassets';


  //Notifications
  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }


  public hasBaseDropZoneOver: boolean = false;
  public hasFileSelected: boolean = false;

  constructor(public dialogRef: MatDialogRef<FileUpload>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datepipe: DatePipe,
    private fileuploadService: UserPortalService,
    private notifier: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService) {
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }
  }

  ngOnInit() {
    //query Params
    this.data = this.route
      .queryParams
      .subscribe(params => {
        this.folderName = params['name_of_folder']
      });
    console.log(this.folderName);
    this.dataSource = new MatTableDataSource(this.uploader.queue);
  }

  remove(item) {
    console.log("remove");
    item.remove();
    this.dataSource = new MatTableDataSource(this.uploader.queue);
    console.log(this.uploader.queue.length);
    if (this.uploader.queue.length == 0) {
      this.hasBaseDropZoneOver = false;
      this.hasFileSelected = false;
    }
  }

  public uploader: FileUploader = new FileUploader({
    url: this.urlFileUpload,
    isHTML5: true,
    authToken: sessionStorage.getItem('auth')

  });

  public arraytry: FileUploader = new FileUploader({
    url: this.urlFileUpload,
    isHTML5: true,
    authToken: sessionStorage.getItem('auth')
  });

  getFile() {
    this.dataSource = new MatTableDataSource(this.uploader.queue);
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;

    };
    this.gettingMetadata();

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      console.log("4");
      if (globalValues.uploadedItemsAttribute) {
        form.append('metadata', JSON.stringify(globalValues.uploadedItemsAttribute));
      }

      if (this.folderName != undefined) {
        form.append('type_of_folder', this.folderName)
      }
      else {
        form.append('type_of_folder', "bucket")
      }
    }

    this.uploader.onSuccessItem = ((item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any => {
      console.log("Success", item, response, status);
      console.log("2");
      this.confirmation();
    })

    this.uploader.onCompleteItem = ((item: any, response: any, status: any, headers: any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
      console.log("3");

    });


    this.uploader.onErrorItem = ((item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any => {
      console.log("Error:", item, response, status);
      this.enableTry = true;
      this.isClickedOnce = false;
      this.confirmation();
    });
  }


  gettingMetadata() {
    for (var i = 0; i < this.uploader.queue.length; i++) {
      var date_test =
        globalValues.uploadedItemsAttribute.push({
          // "lastModifiedDate": this.datepipe.transform((this.uploader.queue[i].file.rawFile.lastModifiedDate).toString(),'dd/MM/yyyy'),
          "name": this.uploader.queue[i].file.name,
          "size": this.uploader.queue[i].file.size,
          "type": this.uploader.queue[i].file.type,
        })
      console.log("250" + JSON.stringify(globalValues.uploadedItemsAttribute[i]));

    };
  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = true;
    // console.log(this.hasBaseDropZoneOver);
    this.getFile();
  }

  public onFileSelected(e1: any): void {
    console.log("1");
    this.hasFileSelected = true;
    // console.log(this.hasFileSelected);
    this.getFile();
  }

  extensionValue;
  uploadAllFiles() {
    this.isClickedOnce = true;
    for (let i = 0; i < this.uploader.queue.length; i++) {
      this.extensionValue = this.uploader.queue[i].file.name.slice((this.uploader.queue[i].file.name.lastIndexOf(".") - 1 >>> 0) + 2);
      if (!(this.extensionValue == 'mp4' || this.extensionValue == 'mp3' || (this.extensionValue == 'docx' || this.extensionValue == 'pdf' || this.extensionValue == 'txt') || (this.extensionValue == 'png' || this.extensionValue == 'jpg' || this.extensionValue == 'jpeg'))) {
        this.uploader.queue[i].remove();
        this.dataSource = new MatTableDataSource(this.uploader.queue);
        this.notifier.warn("A file has been removed from upload as it is considered Malicious.");
        this.isClickedOnce = false;
        this.hasBaseDropZoneOver = false;
        this.hasFileSelected = false;
      }
    }
    console.log(this.uploader.queue);
    this.uploader.uploadAll();
  }
  confirmation() {
    let items = this.uploader.queue.filter((item: FileItem) => item.isError);
    // console.log("Inside confirmation");
    //  if(items.length == 0){
    //      console.log("Inside confirmation if");
    //   console.log(items.length);
    //   return;
    // console.log(this.uploader.queue.length);
    //  }
    // else{
    //     console.log("Inside confirmation else");
    //   alert("Error");
    // }
    // this.openSnackBarUploadConfirmation();
    if (this.uploader.getNotUploadedItems().length == 0 && items.length == 0) {
      this.openSnackBarUploadConfirmation();
      console.log(this.uploader.queue.length);
    }
    else {
      return;
    }
  }


  tryAgain() {
    let items = this.uploader.queue.filter((item: FileItem) => item.isError);
    if (!items.length) {
      return;
    }
    items.map((item: any) => item._prepareToUploading());
    items[0].upload();
    this.dataSource = new MatTableDataSource(this.uploader.queue);

  }

  onClickCancel(): void {
    this.uploader.clearQueue();
    this.uploader.cancelAll();
    this.dialogRef.close();
  }

  openSnackBarUploadConfirmation() {
    // globalValues.updateAssetCount();
    this.dialogRef.close();
    let snackBarRef = this.snackBar.openFromComponent(UploadConfirmationComponent, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
    snackBarRef.afterDismissed().subscribe(() => { });

    snackBarRef.onAction().subscribe(() => { });

  }


}


@Component({
  selector: 'upload-confirmaton',
  templateUrl: 'upload-confirmaton.html',
})
export class UploadConfirmationComponent {


  constructor(public snackBarRef: MatSnackBarRef<UploadConfirmationComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }


  openSnackBarSkipConfirmation() {
    let snackBarRef = this.snackBar.openFromComponent(SkipConfirmationComponent, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
    snackBarRef.afterDismissed().subscribe(() => {
    });


    snackBarRef.onAction().subscribe(() => {
    });

  }

  openUploadFile() {
    this.snackBarRef.dismiss();
    this.router.navigate(["/home/uploadedData"])
  }
  NoClick() {
    this.snackBarRef.dismiss();
  }

}

@Component({
  selector: 'skip-confirmation',
  templateUrl: 'skip-confirmation.html',
  styles: [`a{ text-decoration:underline !important; }; `],
})

export class SkipConfirmationComponent {


  constructor(public snackBarRef: MatSnackBarRef<SkipConfirmationComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  NoClick() {
    this.snackBarRef.dismiss();
  }
}
