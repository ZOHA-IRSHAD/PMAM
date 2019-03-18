import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserPortalService } from "../Services/user-portal.service";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { Router } from "@angular/router";
import { NotificationsService } from "angular2-notifications";


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {
  //URLs
  urlReg = 'http://' + globalValues.ipAddress + '/pmam/user/registerUser ';
  //Variables  
  registrationForm: FormGroup;
  status: string;
  isClickedOnce: boolean = false;
  public registrationData;
  startDate = new Date(2006, 0, 1);
  minDate = new Date(1900, 0, 1);
  maxDate = new Date(2006, 0, 1);

  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }

  constructor(private userRegService: UserPortalService,
    private router: Router,
    private notifier: NotificationsService) { }

  ngOnInit() {
    this.registrationForm = new FormGroup({
      'firstname': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z ]*')]),
      'lastname': new FormControl('', [Validators.pattern('[A-Za-z ]*')]),
      'email_id': new FormControl('', [Validators.required]),
      'date_of_birth': new FormControl('', [Validators.required]),
      'phone_number': new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      'password': new FormControl('', Validators.required),
      'Confirmpassword': new FormControl('', [Validators.required]),
      'country': new FormControl('', Validators.required),
      'security_question': new FormControl('', Validators.required),
      'security_answer': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9 ]*')]),
      'select_agrrement': new FormControl('', Validators.required)
    });

  }

  questions = [
    { que: 'What is your favorite radio station' },
    { que: 'What is the name of your manager at your first job' },
    { que: 'In what city was your mother born' },
    { que: 'What is the nickname of your father' },
    { que: 'What is your parents wedding anniversary month' },
    { que: 'Type a significant date in your life' },
    { que: 'Who is your childhood hero' }
  ];

  countries = [
    {
      type: 'A',
      country: [
        { name: 'Afghanistan' },
        { name: 'Albania' },
        { name: 'Algeria' },
        { name: 'Andorra ' },
        { name: 'Angola' },
        { name: 'Algeria' },
        { name: 'Antigua and Barbuda' },
        { name: 'Argentina' },
        { name: 'Armenia' },
        { name: 'Aruba' },
        { name: 'Australia' },
        { name: 'Austria' },
        { name: 'Azerbaijan' }
      ]
    },
    {
      type: 'B',
      country: [
        { name: 'Bahamas, The' },
        { name: 'Bahrain' },
        { name: 'Bangladesh' },
        { name: 'Barbados' },
        { name: 'Belarus' },
        { name: 'Belgium' },
        { name: 'Belize' },
        { name: 'Benin' },
        { name: 'Bhutan' },
        { name: 'Bolivia' },
        { name: 'Bosnia and Herzegovina' },
        { name: 'Botswana' },
        { name: 'Brazil' },
        { name: 'Brunei' },
        { name: 'Bulgaria' },
        { name: 'Burkina Faso' },
        { name: 'Burma' },
        { name: 'Burundi' }
      ]
    },
    {
      type: 'C',
      country: [
        { name: 'Cambodia' },
        { name: 'Cameroon' },
        { name: 'Canada' },
        { name: 'Cabo Verde' },
        { name: 'Central African Republic' },
        { name: 'Chad' },
        { name: 'Chile' },
        { name: 'China' },
        { name: 'Colombia' },
        { name: 'Comoros' },
        { name: 'Congo, Democratic Republic of the' },
        { name: 'Congo, Republic of the' },
        { name: 'Costa Rica' },
        { name: 'Cote d Ivoire' },
        { name: 'Croatia' },
        { name: 'Cuba' },
        { name: 'Curacao' },
        { name: 'Cyprus' },
        { name: 'Czechia' },
      ]
    },
    {
      type: 'D',
      country: [
        { name: 'Denmark' },
        { name: 'Djibouti' },
        { name: 'Dominica' },
        { name: 'Dominican Republic ' }
      ]
    },
    {
      type: 'E',
      country: [
        { name: 'East Timor' },
        { name: 'Ecuador' },
        { name: 'Egypt' },
        { name: 'El Salvador ' },
        { name: 'Equatorial Guinea' },
        { name: 'Eritrea' },
        { name: 'Estonia' },
        { name: 'Ethiopia ' }
      ]
    },
    {
      type: 'F',
      country: [
        { name: 'Fiji' },
        { name: 'Finland' },
        { name: 'France' },
      ]
    },
    {
      type: 'G',
      country: [
        { name: 'Georgia' },
        { name: 'Germany' },
        { name: 'Greece' },
      ]
    },
    {
      type: 'H',
      country: [
        { name: 'Haiti' },
        { name: 'Holy See' },
        { name: 'Honduras' },
        { name: 'Hong Kong' },
        { name: 'Hungary' }
      ]
    },
    {
      type: 'I',
      country: [
        { name: 'Iceland' },
        { name: 'India' },
        { name: 'Indonesia' },
        { name: 'Iran' },
        { name: 'Iraq' },
        { name: 'Ireland' },
        { name: 'Israel' },
        { name: 'Italy' }
      ]
    },
    {
      type: 'J',
      country: [
        { name: 'Jamaica' },
        { name: 'Japan' },
        { name: 'jordon' }]
    },
    {
      type: 'K',
      country: [
        { name: 'kenya' },
        { name: 'kuwait' },
        { name: 'Korea-North' },
        { name: 'Korea-South' }]
    },
    {
      type: 'L',
      country: [
        { name: 'Libya' },
        { name: 'Liberia' },
        { name: 'Lithuana' }]
    },
    {
      type: 'M',
      country: [
        { name: 'Macau' },
        { name: 'Malaysia' },
        { name: 'Maldivces' }]
    },
    {
      type: 'N',
      country: [
        { name: 'Namibia' },
        { name: 'Nepal' },
        { name: 'New Zealand' }]
    },
    {
      type: 'O',
      country: [
        { name: 'Oman' }]
    },
    {
      type: 'P',
      country: [
        { name: 'pakistan' },
        { name: 'Philippines' },
        { name: 'Portugal' }]
    },
    {
      type: 'Q',
      country: [
        { name: 'Qatar' }
      ]
    },
    {
      type: 'R',
      country: [
        { name: 'Romania' },
        { name: 'Russia' },
        { name: 'Rwanda' }]
    },
    {
      type: 'S',
      country: [
        { name: 'Srilanka' },
        { name: 'South Africa' },
        { name: 'Sinagpore' }]
    },
    {
      type: 'T',
      country: [
        { name: 'Taiwan' },
        { name: 'Turkey' },
        { name: 'Thailand' }]
    },
    {
      type: 'U',
      country: [
        { name: 'Uganda' },
        { name: 'Ukraine' },
        { name: 'United Kingdom' }]
    },
    {
      type: 'V',
      country: [
        { name: 'Vietnam' },
      ]
    },
    {
      type: 'Y',
      country: [
        { name: 'yemen' },
      ]
    },
    {
      type: 'Z',
      country: [
        { name: 'Zambia' },
        { name: 'Zimbabwe' }

      ]
    }
  ];


  matchingPasswords = (control: AbstractControl) => {

    const newPassword = control.get('password');
    const confirmPassword = control.get('Confirmpassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return (newPassword.value == confirmPassword.value) ? { mismatchedPasswords: false } : { mismatchedPasswords: true };
  }
  // function for getting current date
  getDate() {
    var dateObj = new Date();
    var month, day, year: any;
    month = dateObj.getUTCMonth() + 1; //months from 1-12
    if (month < 10)
      month = "0" + month;
    day = dateObj.getUTCDate();
    if (day < 10)
      day = "0" + day;
    year = dateObj.getUTCFullYear();
    var today = day + "/" + month + "/" + year;
    return today;
  }
  //function for submit the form      
  onSubmit() {
    this.registrationData = this.registrationForm.value;
    this.registrationData.date_of_registration = this.getDate();
    console.log(this.registrationData);
    //service for registration
    this.userRegService.postData1(this.urlReg, this.registrationData)
      .subscribe(userReg_response => {
        console.log(userReg_response);
        let response = JSON.parse(userReg_response._body).response;
        if (response == 'Registration Successfull') {
          this.notifier.success("Succesfully Registered In PMAM");
          setTimeout((router: Router) => {
            this.router.navigate(['/']);
          }, 2000);
        }
        else if (response == 'Email_id already exists') {
          this.notifier.warn("Email ID already exists");
          this.isClickedOnce = false;
        }
        else if (response == 'Phone number already exists') {
          this.notifier.warn("Contact already exists");
          this.isClickedOnce = false;
        }
        else if (userReg_response.response == 'failed to add') {
          this.notifier.error("Failed to register,Please try again");
          this.isClickedOnce = false;
        }
        else if (response == 'Mailer Exception') {
          console.log("mailer");
          this.notifier.warn("Unable to send notification but user Get Registered");
          setTimeout((router: Router) => {
            this.router.navigate(['/']);
          }, 2000);
        }
      })
  }
}
