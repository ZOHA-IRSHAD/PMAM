import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { ChangepasswordComponent } from "../changepassword/changepassword.component";
import { EditProfileComponent } from "../edit-profile/edit-profile.component";
import { HomePageComponent } from "../home-page/home-page.component";
import { UserRegistrationComponent } from "../user-registration/user-registration.component";
import { UpgradePlansComponent } from "../upgrade-plans/upgrade-plans.component";
import { MyAssetsComponent } from "../my-assets/my-assets.component";
import { ImagesearchresultComponent } from "../imagesearchresult/imagesearchresult.component";
import { ForgotPasswordComponent } from "../forgot-password/forgot-password.component";
import { FeedbackComponent } from "../feedback/feedback.component";
import { HelpNSupportComponent } from "../help-n-support/help-n-support.component";
import { UploadedDataComponent } from "../uploaded-data/uploaded-data.component";
import { AssetPageComponent } from "../asset-page/asset-page.component";
import { AudiosComponent } from "../audios/audios.component";
import { DocumentsComponent } from "../documents/documents.component";
import { ImagesComponent } from "../images/images.component";
import { VideosComponent } from "../videos/videos.component";
import { FavoritesComponent } from "../favorites/favorites.component";
import { TrashComponent } from "../trash/trash.component";
import { GenricSearchComponent } from "../genric-search/genric-search.component";
import { AdvancedSearchComponent } from "../advanced-search/advanced-search.component";
import { NewFolderComponent } from "../new-folder/new-folder.component";



const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'myAssets',
        component: MyAssetsComponent,
        //     children:[   

        //  ]
      },
      {
        path: 'genricSearch',
        component: GenricSearchComponent
      },
      {
        path: 'advancedSearch',
        component: AdvancedSearchComponent
      },
      {
        path: 'trash',
        component: TrashComponent
      },
      {
        path: 'upgradePlans',
        component: UpgradePlansComponent
      },
      {
        path: 'feedback',
        component: FeedbackComponent
      },
      {
        path: 'helpNsupport',
        component: HelpNSupportComponent
      },
      {
        path: 'uploadedData',
        component: UploadedDataComponent
      },
      {
        path: 'myAssets/assetPage',
        component: AssetPageComponent,
      },

      {
        path: 'myAssets/Videos',
        component: VideosComponent,
      },
      {
        path: 'myAssets/Images',
        component: ImagesComponent,
      },
      {
        path: 'myAssets/Documents',
        component: DocumentsComponent,
      },
      {
        path: 'myAssets/Audios',
        component: AudiosComponent,
      },
      {
        path: 'myAssets/Favorites',
        component: FavoritesComponent,
      },
      {
        path: 'myAssets/newFolder',
        component: NewFolderComponent,
      },      
    ],
    // runGuardsAndResolvers: 'always'
  },
  {
    path: 'changePassword',
    component: ChangepasswordComponent
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'editProfile',
    component: EditProfileComponent
  },
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'userRegistration',
    component: UserRegistrationComponent
  },
  {
    path: 'imageSearchResult',
    component: ImagesearchresultComponent
  },
  {
    path: 'genricSearch',
    component: GenricSearchComponent
  },

]


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  // onSameUrlNavigation:'reload', 
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }

export const routingComponents = [
  HomeComponent,
  ChangepasswordComponent,
  UserRegistrationComponent,
  EditProfileComponent,
  HomePageComponent,
  UserRegistrationComponent,
  UpgradePlansComponent,
  MyAssetsComponent,
  ImagesearchresultComponent,
  ForgotPasswordComponent,
  FeedbackComponent,
  HelpNSupportComponent,
  UploadedDataComponent,
  AssetPageComponent,
  VideosComponent,
  AudiosComponent,
  ImagesComponent,
  DocumentsComponent,
  FavoritesComponent,
  TrashComponent,
  GenricSearchComponent,
  AdvancedSearchComponent,
  NewFolderComponent
];
