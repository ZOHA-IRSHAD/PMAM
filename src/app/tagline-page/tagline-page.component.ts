import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from "@angular/router";
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserPortalService } from "../Services/user-portal.service";
import * as globalValues from "../Global-Var-Fun/global-var-fun";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-tagline-page',
  templateUrl: './tagline-page.component.html',
  styleUrls: ['./tagline-page.component.css']
})
export class TaglinePageComponent implements OnInit {

  constructor(public router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
  }
  openSignInDialog(): void {
    let dialogRef = this.dialog.open(SignInDialog, {
      width: '500px',
      data: {

      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openSignUpDialog() {
    let dialogRef = this.dialog.open(SignUpDialog, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openSignUpPage() {
    this.router.navigate(["/userRegistration"]);
  }
  openDialogStandard(): void {
    let dialogRef = this.dialog.open(ViewFeaturesDialogStandard, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogPremium(): void {
    let dialogRef = this.dialog.open(ViewFeaturesDialogPremium, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogGold(): void {
    let dialogRef = this.dialog.open(ViewFeaturesDialogGold, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'view-features-dialog-standard',
  templateUrl: './view-features-dialog-standard.html',
  styleUrls: ['./tagline-page.component.css']
})
export class ViewFeaturesDialogStandard {

  constructor(
    public dialogRef: MatDialogRef<ViewFeaturesDialogStandard>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'view-features-dialog-premium',
  templateUrl: './view-features-dialog-premium.html',
  styleUrls: ['./tagline-page.component.css']
})
export class ViewFeaturesDialogPremium {

  constructor(
    public dialogRef: MatDialogRef<ViewFeaturesDialogPremium>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'view-features-dialog-gold',
  templateUrl: './view-features-dialog-gold.html',
  styleUrls: ['./tagline-page.component.css']
})
export class ViewFeaturesDialogGold {

  constructor(
    public dialogRef: MatDialogRef<ViewFeaturesDialogGold>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  onNoClick(): void {
    this.dialogRef.close();
  }
}



@Component({
  selector: 'sign-in-dialog',
  templateUrl: './sign-in-dialog.html',
  styleUrls: ['../topbar/topbar.component.css']
})
export class SignInDialog implements OnInit {
  //URLs
  urlLogin = 'http://' + globalValues.ipAddress + '/pmam/user/login';
  //Variables  
  loginForm: FormGroup;
  errorMsg = '';
  isClickedOnce: boolean = false;

  constructor(private router: Router,
    public dialogRef: MatDialogRef<SignInDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loginservice: UserPortalService) { }


  ngOnInit() {
    this.loginForm = new FormGroup({
      'email_id': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]),
    });
  }


  openSignUpPage() {
    this.dialogRef.close();
    this.router.navigate(["/userRegistration"]);
  }

  openforgotPswdPage() {
    this.dialogRef.close();
    this.router.navigate(["/forgotPassword"]);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  //Function for LogIn
  onSubmit(loginFormDetails: FormGroup) {
    //service for login details
    this.loginservice.postData1(this.urlLogin, loginFormDetails.getRawValue())
      .subscribe(login_response => {
        console.log(login_response);
        console.log(login_response.headers.get('authorization'))
        sessionStorage.setItem('auth', login_response.headers.get('authorization'));
        sessionStorage.setItem('currentUser', loginFormDetails.getRawValue().email_id);
        this.dialogRef.close();
        this.router.navigate(["/home/myAssets"]);

        /*else if (login_response.response === "Invalid Crendintials") {
          console.log("Inavlid");
          this.loginForm.setErrors({
            invalidLogin: true
          })
          this.errorMsg = 'Invalid Credentials';
          this.isClickedOnce = false;
        }
        else if (login_response.response === "Not registered User") {
          console.log("Not register");
          this.loginForm.setErrors({
            notRegister: true
          })
          this.errorMsg = 'Not a Registered User';
          this.isClickedOnce = false;
        }
        else if (login_response.response === "some other error") {
          this.loginForm.setErrors({
            otherIssue: true
          })
          this.errorMsg = "LogIn failed..Plzz try again";
          this.isClickedOnce = false;
        }*/
      }, (error: any) => {
        this.loginForm.setErrors({
          invalidLogin: true
        })
        this.errorMsg = 'Invalid LogIn';
        this.isClickedOnce = false;
      }
      )
  }

}

@Component({
  selector: 'sign-up-dialog',
  templateUrl: './sign-up-dialog.html',
  styleUrls: ['../topbar/topbar.component.css']
})
export class SignUpDialog {
  constructor(
    public dialogRef: MatDialogRef<SignUpDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}