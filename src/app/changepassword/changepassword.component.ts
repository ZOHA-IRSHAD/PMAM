import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { UserPasswordChange } from '../Interfaces/user-password-change';
import { UserPortalService } from "../Services/user-portal.service";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { Router } from "@angular/router";
import { NotificationsService } from "angular2-notifications";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  //URLs
  urlChangePassword = 'http://' + globalValues.ipAdrs + '/pmam/user/changepassword';
  //Variables
  public userPswdChng: UserPasswordChange;
  public changePasswordData;
  isClickedOnce: boolean = false;

  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }
  constructor(private changePasswordService: UserPortalService,
    private router: Router,
    private notifier: NotificationsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.spinner.hide();
    this.userPswdChng = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  }

  onSave(changePasswordDetails: UserPasswordChange) {
    console.log("calling onSave");
    console.log(changePasswordDetails);
    console.log(sessionStorage.getItem('currentUser'));
    this.changePasswordData = {
      'old_password': changePasswordDetails.oldPassword,
      'new_password': changePasswordDetails.newPassword
    }
    // this.changePasswordData = this.changePasswordData1;
    this.changePasswordData.email_id = sessionStorage.getItem('currentUser');
    console.log(this.changePasswordData);
    //service for posting data for change pswd
    this.changePasswordService.postData(this.urlChangePassword, this.changePasswordData)
      .subscribe(changePassword_response => {
        console.log(changePassword_response);
        if (changePassword_response.response === 'password Change Successfull') {
          this.notifier.success("Successfully Changed Password");
          this.isClickedOnce = false;
          setTimeout((router: Router) => {
            this.router.navigate(['/']);
          }, 2000);
        }
        else if (changePassword_response.response === 'password Mismatch') {
          this.notifier.error("Old password Mismatch");
          this.isClickedOnce = false;
        }
        else if (changePassword_response.response === 'password Change Un-successfull') {
          this.notifier.error("Unable to change password,Plzz try again");
          this.isClickedOnce = false;
        }
      })
  }


}
