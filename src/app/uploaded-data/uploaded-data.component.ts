import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSidenav } from "@angular/material";
import { MediaMatcher } from '@angular/cdk/layout';
import { UserPortalService } from "../Services/user-portal.service";
import { DatePipe } from "@angular/common";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { NotificationsService } from "angular2-notifications";


@Component({
  selector: 'app-uploaded-data',
  templateUrl: './uploaded-data.component.html',
  styleUrls: ['./uploaded-data.component.css']
})
export class UploadedDataComponent implements OnInit {
  //Variables  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  extensionValue: any;
  video: boolean = false;
  image: boolean = false;
  audio: boolean = false;
  docs: boolean = false;
  uploadedFiles_date;
  public assetsMetadata;
  assetsForm: FormGroup;
  metaData: any;
  uri: string;
  //Arrays
  uploadedFiles: any[];
  finalDate: any = [];
  Location: any = [];
  Artist: any = [];
  Language: any = [];
  Year: any = [];
  Gender = ['Male', 'Female'];
  Orientation = ['Horizontal', 'Vertical'];
  Size = ['0-0.5', '0.5-1', '1-2', '2-5'];
  Mood = ['Aggressive', 'Angry', 'Arousing', 'Atmospheric', 'Bittersweet', 'Bleak', 'Bright', 'Calm', 'Carefree', 'Cheerful', 'Confident',
    'Dark', 'Dramatic', 'Dreamy', 'Epic', 'Ethereal', 'Fear', 'Fiery', 'Fragile', 'Fun', 'Happy', 'Heartbroken', 'Hopeful',
    'Inspiring', 'Intense', 'Love', 'Melancholic', 'Mellow', 'Merry', 'Optimistic', 'Playful', 'Quirky', 'Reflective', 'Remorseful', 'Romantic',
    'Sad', 'Sensual', 'Serene', 'Sexy', 'Silly', 'Sophisticated', 'Spiritual', 'Tender', 'Terror', 'Uplifting', 'Wistful', 'Worry'];
  Genre = ['Audio Logos', 'Blues', 'Children', 'Chill Out', 'Classical', 'Corporate', 'Country', 'Dance/Electronic', 'Dubstep',
    'Easy Listening', 'Electro Pop', 'Folk', 'Games', 'Hip-Hop/Rap', 'Holiday', 'Indie Pop', 'Jazz', 'Latin', 'New Age',
    'Pop/Rock', 'Production', 'R&B/Soul', 'Reggae/Ska', 'Rock', 'Trailer', 'World/International'];

  Tempo = ['Very Slow (0-60 bpm)', 'Slow (60-100 bpm)', 'Moderate (100-120 bpm)', 'Lively (120-140 bpm)', 'Fast (140-160 bpm)', 'Very Fast (160-400 bpm)'];
  Quality = ['any quality', 'high quality only'];
  Date = ['anytime', 'last 24 hours', 'upto a week ago', 'upto a month ago', 'upto a year ago'];

  //URLs
  urlForUploadedAssets = 'http://' + globalValues.ipAddress + '/pmam/user/not-updated/' + sessionStorage.getItem('currentUser') + '/getassets';
  urlForMetadata = 'http://' + globalValues.ipAddress + '/pmam/user/updatemetadata';

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  public options = {
    position: ["top", "right"],
    timeOut: 5000,
    showProgressBar: false,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true
  }
  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private uploadedItemsService: UserPortalService,
    private datePipe: DatePipe,
    private notifier: NotificationsService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.assetsForm = new FormGroup({
      'title': new FormControl(''),
      'keywords': new FormArray([new FormControl()]),
      'document_name': new FormControl(),
      'asset_type': new FormControl(),
      // 'uploaded_date': new FormControl(),
      'size': new FormControl(),
      'language': new FormControl(),
      'duration': new FormControl(),
      'location': new FormControl(),
      'image_type': new FormControl(),
      'gender': new FormControl(),
      'orientation': new FormControl(),
      'artist': new FormControl(),
      'mood': new FormControl(),
      'genre': new FormControl(),
      'tempo': new FormControl(),
      'release_year': new FormControl(),
    });
    //service for fetching uploaded assets
    this.uploadedItemsService.getData(this.urlForUploadedAssets)
      .subscribe(uploadedData_response => {
        this.uploadedFiles = uploadedData_response;
        console.log(this.uploadedFiles);
        this.uploadedFiles.sort((a, b) => new Date(b.uploaded_date).getTime() - new Date(a.uploaded_date).getTime());

        // this.formatDate(this.uploadedFiles);

      })

  }

  get keywords(): FormArray {
    return this.assetsForm.get('keywords') as FormArray;
  }

  addField(value) {
    console.log(value);
    this.keywords.push(new FormControl());
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  //function for getting file extension
  getFileExtension(filename) {
    this.extensionValue = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    console.log(this.extensionValue);

    if (this.extensionValue == 'mp4') {
      this.audio = false;
      this.docs = false;
      this.image = false;
      this.video = true;
    }
    else if (this.extensionValue == 'mp3') {
      this.docs = false;
      this.image = false;
      this.video = false;
      this.audio = true;
    }
    else if (this.extensionValue == 'docx' || this.extensionValue == 'pdf' || this.extensionValue == 'txt') {
      this.image = false;
      this.video = false;
      this.audio = false;
      this.docs = true;
    }
    else if (this.extensionValue == 'png' || this.extensionValue == 'jpg' || this.extensionValue == 'jpeg') {
      this.video = false;
      this.audio = false;
      this.docs = false;
      this.image = true;
    }

  }

@ViewChild('snav') sideNav:MatSidenav;
temp;count = 0;
  toggleSideNav(item,index){
    console.log(this.count);
    if(this.count > 0){
      if(this.temp === index){
        this.assetsMetadata = this.assetsForm.value;
        this.sideNav.toggle();
      }else{
       // this.keywords.patchValue(this.assetsMetadata.keywords);
        this.keywords.reset();
        this.getUri(item.uri);
        this.getMetadata(item);
        this.getFileExtension(item.title);
        this.temp = index;
      }
      this.count++;
    }else{
         this.sideNav.toggle();
    //console.log(index+"-"+JSON.stringify(item));
    this.getUri(item.uri);
    this.getMetadata(item);
    this.getFileExtension(item.title);
    this.temp = index;
    this.count++;
    }
  }

  getUri(value: string) {
    this.uri = value;
    console.log(this.uri);
  }

  getMetadata(value) {
    console.log(value);
    this.assetsForm.patchValue({
      'title': value.title,
      'asset_type': value.asset_type,
      'size': +((value.size) / 1024 / 1024).toFixed(3)
    });

  }
  //function for format the uploaded date
  formatDate(array: any[]) {

    for (var i = 0; i < this.uploadedFiles.length; i++) {
      this.uploadedFiles_date = this.uploadedFiles[i].uploaded_date;
      var date = new Date(this.uploadedFiles_date);
      console.log(date);
      this.finalDate.push(this.datePipe.transform(date.toString(), 'dd/MM/yyyy'));
      console.log(this.finalDate);
    }
  }

  onSubmit(index: number) {
    console.log("onSubmit");
    console.log(this.keywords.value);
    this.assetsMetadata = this.assetsForm.value;
    this.assetsMetadata.uri = this.uri;
    console.log(this.assetsMetadata);
    //service to post data
    this.uploadedItemsService.postData(this.urlForMetadata, this.assetsMetadata)
      .subscribe(metadata_response => {
        console.log(metadata_response);
        if (metadata_response.response == "Updated Successfully") {
          this.notifier.success("Successfully Updated Changes");
          this.assetsForm.reset();
        }
        else if (metadata_response.response == "Not Updated") {
          this.notifier.error("Error Occurred while Updating");
        }
      })
  }

}
