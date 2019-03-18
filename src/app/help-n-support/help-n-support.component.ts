import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { NotificationsService } from "angular2-notifications";
import { UserPortalService } from "../Services/user-portal.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-help-n-support',
  templateUrl: './help-n-support.component.html',
  styleUrls: ['./help-n-support.component.css']
})
export class HelpNSupportComponent implements OnInit {
  //Variables
  public helpNSupportData;
  helpNsupportForm: FormGroup;
  selectedValue: string;


  issues = [
    { issueOption: 'Issue Related to Payment' },
    { issueOption: 'Issue Related to Subscription' },
    { issueOption: 'Issue Related to Storage' },
    { issueOption: 'Issue Related to Features' },
    { issueOption: 'Others' }
  ];

  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }


  constructor(private supportService: UserPortalService,
              private notifier: NotificationsService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.hide();
    this.helpNsupportForm = new FormGroup({
      'issue_name': new FormControl('', [Validators.required]),
      'issue_description': new FormControl('', [Validators.required]),

    });
  }

  onSend() {
    let urlHelpnSupport = 'http://' + globalValues.ipAddress + '/pmam/user/helpandsupport';
    this.helpNSupportData = this.helpNsupportForm.value;
    this.helpNSupportData.email_id = sessionStorage.getItem('currentUser');
    console.log(this.helpNSupportData);
    this.supportService.postData(urlHelpnSupport, this.helpNSupportData)
      .subscribe(support_response => {
        if (support_response.response == "Submitted Successfully") {
          this.notifier.success("Issue Submitted Successfully");
          this.helpNsupportForm.reset();
        }
        else {
          this.notifier.error("Submission failed");
        }
      })
  }

}
