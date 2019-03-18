import { Component, OnInit, ViewChild } from '@angular/core';
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { ActivatedRoute } from "@angular/router";
import { UserPortalService } from "../Services/user-portal.service";


@Component({
  selector: 'app-asset-page',
  templateUrl: './asset-page.component.html',
  styleUrls: ['./asset-page.component.css']
})
export class AssetPageComponent implements OnInit {
//Variables
data: any;
assetType: any;
//Arrays
bucketDetails : any = [];
@ViewChild('videoPlayer') videoplayer: any;

  constructor(private route: ActivatedRoute,
              private bucketService: UserPortalService) { }

  ngOnInit() {
    //query Params
          this.data=this.route
                        .queryParams
                        .subscribe(params => {
                 this.assetType = params['type_of_asset']
      });
   let urlForBuckets = 'http://'+globalValues.ipAddress+'/pmam/'+localStorage.getItem('currentUser')+'/'+this.assetType+'/getAssets ';             
   //Service for fetching assets in their respective Buckets
   this.bucketService.getData(urlForBuckets)
                     .subscribe(bucket_response =>{
                       console.log(bucket_response);
                       this.bucketDetails = bucket_response;
                     })
  }


  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
}
}
