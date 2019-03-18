import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { UserPortalService } from "../Services/user-portal.service";
import { Router } from "@angular/router";
import { NotificationsService } from "angular2-notifications";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  //URLs
  urlForgotPassword = 'http://' + globalValues.ipAdrs + '/pmam/user/forgotpassword ';
  //Variables
  forgotPasswordForm: FormGroup;
  securityQuestionForm: FormGroup;
  errorMsg = '';
  noClicked: boolean = true;
  isClickedOnce: boolean = false;
  security_question: any;
  userEmail: any;
  public forgotPasswordDetails;
  isClicked: boolean = false;
  isClicked1: boolean = false;
  clearField = '';
  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }

  constructor(private forgotPasswordService: UserPortalService,
    private router: Router,
    private notifier: NotificationsService,
    private spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.spinner.hide();
    this.forgotPasswordForm = new FormGroup({
      'email_id': new FormControl('', [Validators.required, Validators.email]
      )
    });

    this.securityQuestionForm = new FormGroup({
      'security_question': new FormControl(''),
      'security_answer': new FormControl('', [Validators.required])
    })
  }


  onSubmit(forgotPasswordDetails: FormGroup) {
    this.isClickedOnce = !this.isClickedOnce;
    this.userEmail = forgotPasswordDetails.getRawValue().email_id;

    //URLs
    var urlSecurityQuestion = 'http://' + globalValues.ipAdrs + '/pmam/user/' + this.userEmail + '/getsecurityquestion';

    // service for fetching security question
    this.forgotPasswordService.getDatapswd(urlSecurityQuestion)
      .subscribe(question_response => {

        if (question_response.question === 'Not a Registered User') {
          this.forgotPasswordForm.setErrors({
            notRegister: true
          })
          this.errorMsg = 'This Email ID is not registered with PMAM';
          this.isClickedOnce = !this.isClickedOnce;
          this.isClicked = false;
          console.log(this.errorMsg);
        }
        else {
          console.log(question_response);
          this.security_question = question_response.question;
          this.securityQuestionForm.patchValue({ 'security_question': this.security_question });
          this.noClicked = !this.noClicked;
        }
      })

  }
  onSend(securityQuestionFormDetails: FormGroup) {
    this.forgotPasswordDetails = this.securityQuestionForm.value;
    this.forgotPasswordDetails.email_id = this.userEmail;
    //service for posting forgot password data
    this.forgotPasswordService.postDatapswd(this.urlForgotPassword, this.forgotPasswordDetails)
      .subscribe(security_response => {
        console.log(security_response);
        if (security_response.response === 'Mail with automatic password is sent') {
          this.notifier.success("Successfully sent auto-generated password to your mail");
          this.isClicked1 = false;
          setTimeout((router: Router) => {
            this.router.navigate(['/']);
          }, 2000);
        }
        else if (security_response.response === 'Wrong answer for security question') {
          this.notifier.error("Wrong answer of security quetsion");
          this.securityQuestionForm.patchValue({ 'secuirty_question': this.security_question, 'security_answer': this.clearField });
          this.isClicked1 = false;
        }
        else if (security_response.response === 'Mailer exception') {
          this.notifier.error("Unable to complete the procedure;Try after some time");
          this.securityQuestionForm.patchValue({ 'secuirty_question': this.security_question, 'security_answer': this.clearField });
          this.isClicked1 = false;
        }
        else if (security_response.response === 'some other error') {
          this.notifier.error("Unexpected Issue");
          this.securityQuestionForm.patchValue({ 'secuirty_question': this.security_question, 'security_answer': this.clearField });
          this.isClicked1 = false;
        }
      })

  }
}
