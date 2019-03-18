import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/do';
import { HttpResponse, HttpHeaders } from "@angular/common/http";
import { Config } from "protractor/built";


@Injectable()
export class UserPortalService {
  //Variables  
  headers: Headers;
  options: RequestOptions;
  options1: RequestOptions;
  optionspswd: RequestOptions;
  headers1: Headers;
  headerspswd: Headers;
  options2: RequestOptions;
  constructor(private http: Http) {
   

    this.headers1 = new Headers({ 'Content-Type': 'application/json' });
    this.headerspswd = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': true
    });
    this.options1 = new RequestOptions({ headers: this.headers, responseType: ResponseContentType.Blob });
    this.options2 = new RequestOptions({ headers: this.headers1 });
    this.optionspswd = new RequestOptions({headers: this.headerspswd});
  }
  private dataSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  //Fetching the Data 
  getData(url: string): Observable<any> {
     this.headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': true,
      'Authorization': sessionStorage.getItem('auth')
    });
      this.options = new RequestOptions({ headers: this.headers });
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError)

  }

  //Fetching the Data 
  getDataAsset(url: string): Observable<any> {
     this.headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': true,
      'Authorization': sessionStorage.getItem('auth')
    });
     this.options1 = new RequestOptions({ headers: this.headers, responseType: ResponseContentType.Blob });
    return this.http
      .get(url, this.options1)
      .map(this.extractData)
      .catch(this.handleError)

  }

  postData(url: string, param: any): Observable<any> {
  this.headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': true,
      'Authorization': sessionStorage.getItem('auth')
    });
      this.options = new RequestOptions({ headers: this.headers });
    return this.http
      .post(url, param, this.options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  postData1(url: string, param: any): Observable<any> {
    return this.http
      .post(url, param, this.options2)
      .catch(this.handleError)
  }

//start of methods for forgot password

  postDatapswd(url: string,param: any): Observable<any>{
    return this.http
                .post(url,param)
                .map(this.extractData)
                .catch(this.handleError)
  }
    getDatapswd(url: string): Observable<any> {
    return this.http
      .get(url, this.optionspswd)
      .map(this.extractData)
      .catch(this.handleError)

  }
    //end of methods for forgot password
  updateData(url) {
    return this.getData(url).do((data) => {
      this.dataSubject.next(data);
    });
  }

  private extractData(response: Response) {
    let body = response.json();
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    // console.error(errMsg);
    console.log(error.status);
    return Observable.throw(errMsg);
  }
}
