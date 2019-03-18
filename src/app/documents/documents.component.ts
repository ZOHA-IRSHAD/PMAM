import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UserPortalService } from "../Services/user-portal.service";
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
//Variables
data: any;
assetType: any;
//Arrays
docs : any = [];

  constructor(private route: ActivatedRoute,
              private docsService: UserPortalService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
        //query Params
          // this.data=this.route
          //               .queryParams
          //               .subscribe(params => {
          //        this.assetType = params['type_of_asset']
          // });
   let urlForBuckets = 'http://'+globalValues.ipAddress+'/pmam/'+localStorage.getItem('currentUser')+'/'+this.assetType+'/getAssets ';             
   //Service for fetching assets in their respective Buckets
  //  this.docsService.getData(urlForBuckets)
  //                    .subscribe(bucket_response =>{
  //                      console.log(bucket_response);
  //                      this.docs = bucket_response;
  //                    })
  }
}
