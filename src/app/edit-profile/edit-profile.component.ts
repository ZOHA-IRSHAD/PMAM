import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileUploader, ParsedResponseHeaders, FileItem } from "ng2-file-upload";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { NotificationsService } from "angular2-notifications";
import { UserPortalService } from "../Services/user-portal.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  //Variables
  profileForm: FormGroup;
  isClickedOnce: boolean = false;
  public profileData;
  startDate = new Date(2006, 0, 1);
  minDate = new Date(1990, 0, 1);
  maxDate = new Date(2006, 0, 1);
  profilePic;
  //Arrays
  details: any = [];

  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }
  constructor(public dialog: MatDialog,
    private profileService: UserPortalService,
    private notifier: NotificationsService,
    private sanitization: DomSanitizer,
    private router: Router) { }


  ngOnInit() {
    this.profileForm = new FormGroup({
      'firstname': new FormControl('', [Validators.pattern('[A-Za-z]*')]),
      'lastname': new FormControl('', [Validators.pattern('[A-Za-z]*')]),
      'email_id': new FormControl('', [Validators.required]),
      'date_of_birth': new FormControl(''),
      'phone_number': new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      // 'country': new FormControl('', Validators.required),
    });

    let urlUserDetails = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/getuserdetails';
    this.profileService.getData(urlUserDetails)
      .subscribe(details_response => {
        sessionStorage.setItem('user_details', JSON.stringify(details_response));

        // No need to hit urlUserDetails if websocket got implemented
        this.details = JSON.parse(sessionStorage.getItem('user_details'));
        if (this.details.profile_picture !== null) {
          this.profilePic = this.sanitization.bypassSecurityTrustStyle(`url(${this.details.profile_picture})`);
        }
        else {
          this.profilePic = this.sanitization.bypassSecurityTrustStyle(`url('assets/ic_account_circle_white_24px.svg')`);
        }
        console.log(this.details);
        this.profileForm.patchValue({
          'firstname': this.details.firstname,
          'lastname': this.details.lastname,
          'date_of_birth': this.details.date_of_birth,
          'phone_number': this.details.phone_number,
          'email_id': (this.details.email_id).toLowerCase()
        });
      })
  }

  openDialogProfile(): void {
    let dialogRef = this.dialog.open(ChangeProfilePic, {
      width: '500px',
      height: '450px',
      disableClose: true
      // data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  editContactEmail(value: string) {
    let dialogRef = this.dialog.open(EditContactEmail, {
      width: '400px',
      data: { option: value }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  onEdit() {
    this.profileData = this.profileForm.value;
    this.profileData.email_id = sessionStorage.getItem('currentUser');
    let urlEdit = 'http://' + globalValues.ipAddress + '/pmam/user/updateprofile';
    this.profileService.postData(urlEdit, this.profileData)
      .subscribe(edit_response => {
        if (edit_response.response == "profile updated successfully") {
          this.notifier.success("Changed Succesfully");
          this.isClickedOnce = false;
        }
        else if (edit_response.response == "updation unsuccessfull") {
          this.isClickedOnce = false;
          this.notifier.error("Error");
        }
      })
  }

  editContact(value: string) {
    if (confirm("Are you sure to change your contact number?")) {
      let urlContactOtp = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/changephonenumber';
      this.profileService.getData(urlContactOtp)
        .subscribe(edit_response => {
          alert(edit_response.response);
          if (edit_response.response == "Otp sent successfully")
            this.editContactEmail(value);
        })
    }
    else {
      alert("cancel");
    }
  }

  editEmail(value: string) {
    if (confirm("Are you sure to change your Email ID?")) {
      let urlEmailOtp = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/changeemail';
      this.profileService.getData(urlEmailOtp)
        .subscribe(edit_response => {
          alert(edit_response.response);
          if (edit_response.response == "Otp sent successfully")
            this.editContactEmail(value);
        })
    }
    else {
      alert("cancel");
    }
  }

}


@Component({
  selector: 'change-profile-pic',
  templateUrl: 'change-profile-pic.html',
  styleUrls: ['./edit-profile.component.css']
})
export class ChangeProfilePic implements OnInit {
  urlChangeDp = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/changeprofilepicture';
  allowedMimeType: any[] = ['image/png', 'image/jpeg', 'image/jpg'];
  public hasBaseDropZoneOver: boolean = false;
  public hasFileSelected: boolean = false;

  constructor(public dialogRef: MatDialogRef<ChangeProfilePic>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private picService: UserPortalService,
    private notifier: NotificationsService) {
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }
  }

  ngOnInit() {
    this.uploader.onWhenAddingFileFailed = (fileItem) => {
      console.log("fail", fileItem);
      alert("Inavlid Format");
      this.uploader.queue[0].remove();
    }
  }
  public uploader = new FileUploader({
    url: this.urlChangeDp,
    allowedMimeType: this.allowedMimeType,
    authToken: sessionStorage.getItem('auth')
  });

  getFile() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;

    };
    this.uploader.onSuccessItem = ((item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any => {
      console.log("Success", item, response, status);
      console.log("3 success");
      this.uploader.clearQueue();
      this.notifier.success("Successfully Changed");
      this.dialogRef.close();
    })

    this.uploader.onCompleteItem = ((item: any, response: any, status: any, headers: any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
      console.log("4");
      // this.dialogRef.close();
    });


    this.uploader.onErrorItem = ((item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any => {
      console.log("Error:", item, response, status);
      console.log("3 error");
      this.uploader.clearQueue();
      this.notifier.error("Failed to change Dp");
    });
  }

  public fileOverBase(e: any): void {
    console.log("1 drop");
    this.hasBaseDropZoneOver = e;
    if (this.uploader.getNotUploadedItems().length > 1) {
      this.uploader.queue[0].remove();
    }
    else {
      this.getFile();
    }
  }

  public onFileSelected(e1: any): void {
    console.log("1 select");
    this.hasFileSelected = e1;
    if (this.uploader.getNotUploadedItems().length > 1) {
      console.log("if");
      this.uploader.queue[0].remove();
    }
    else {
      console.log("else");
      this.getFile();
    }
  }

  changePic() {
    console.log("2");
    this.uploader.uploadAll();
  }

  onRemove() {
    console.log("remove");
    let urlDelete = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/removeprofilepicture';
    this.picService.getData(urlDelete)
      .subscribe(remove_response => {
        console.log(remove_response);
        if (remove_response.response == "Profile Picture Removed") {
          this.notifier.success("Removed Successfully");
        }
        else {
          this.notifier.error("Error");
        }
      })
    this.uploader.clearQueue();
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.uploader.clearQueue();
    this.dialogRef.close();
  }

}

@Component({
  selector: 'edit-contact-email',
  templateUrl: 'edit-contact-email.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditContactEmail implements OnInit {
  //Variables  
  isClickedOnce: boolean = false;
  editForm: FormGroup;
  contactData;
  emailData;

  constructor(
    public dialogRef: MatDialogRef<EditContactEmail>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private editService: UserPortalService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      'old_value': new FormControl('', [Validators.required]),
      'new_value': new FormControl('', [Validators.required]),
      'otp': new FormControl('', Validators.required),
    });
  }

  onEditContact() {
    this.contactData = this.editForm.value;
    let urlEditContact = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/changephnnumber';
    this.editService.postData(urlEditContact, this.contactData)
      .subscribe(edit_response => {
        alert(edit_response.response);
      })
  }


  onEditEmail() {
    this.emailData = this.editForm.value;
    let urlEditEmail = 'http://' + globalValues.ipAddress + '/pmam/user/changeemailid';
    this.editService.postData(urlEditEmail, this.emailData)
      .subscribe(edit_response => {
        alert(edit_response.response);
        console.log(edit_response);
      })
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}