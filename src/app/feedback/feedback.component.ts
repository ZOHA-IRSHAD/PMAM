import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { UserPortalService } from "../Services/user-portal.service";
import { NotificationsService } from "angular2-notifications";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  //Variables 
  feedbackForm: FormGroup;
  selectedVale: string;
  public feedbackData;
  constructor(private feedbackService: UserPortalService,
              private notifier: NotificationsService,
              private spinner: NgxSpinnerService) { }

  feedbacks = [
    { issue: 'Feedback Related to Payment' },
    { issue: 'Feedback Related to Subscription' },
    { issue: 'Feedback Related to Storage' },
    { issue: 'Feedback Related to Features' },
    { issue: 'Others' }
  ];

  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }

  ngOnInit() {
    this.spinner.hide();
    this.feedbackForm = new FormGroup({
      'feedback_issue': new FormControl('', [Validators.required]),
      'feedback_description': new FormControl('', [Validators.required]),
      'rating': new FormControl('', [Validators.required]),
    });
  }

  onSend() {
    this.feedbackData = this.feedbackForm.value;
    this.feedbackData.email_id = sessionStorage.getItem('currentUser');
    console.log(this.feedbackForm.value);
    let urlFeedback = 'http://' + globalValues.ipAddress + '/pmam/user/feedbackdetails';
    this.feedbackService.postData(urlFeedback, this.feedbackData)
      .subscribe(feedback_response => {
        console.log(feedback_response);
        if (feedback_response.response == "Feedback Submitted Successfully") {
          this.notifier.success("Feedback Submitted Successfully");
          this.feedbackForm.reset();
        }
        else {
          this.notifier.error("Feedback Submission failed");
        }
      })
  }


}
