//Import statements of packages
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule, DEFAULT_BREAKPOINTS, BreakPoint } from "@angular/flex-layout";
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import chart from 'chart.js';
import { Http, HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule, HttpResponse, HttpEventType, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs';
import { NgxSpinnerModule } from 'ngx-spinner';
//video & audio player
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
//image viewer
import { ImageViewerModule } from "ngx-image-viewer";
//docs reader
import { DocumentViewModule } from 'ngx-document-view';
import { RatingModule } from "ngx-rating";

//Import statements of components
import { HomePageComponent } from './home-page/home-page.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SignInDialog, SignUpDialog, TaglinePageComponent, ViewFeaturesDialogStandard, ViewFeaturesDialogPremium, ViewFeaturesDialogGold } from './tagline-page/tagline-page.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { HomeComponent, AdvanceSearch, SearchByImage, CreateNewFolder, FileUpload, UploadConfirmationComponent, SkipConfirmationComponent } from './home/home.component';
import { AppRoutingModule, routingComponents } from "./app-routing/routing.module";
import { AppMaterialModule } from "./app-material/app-material.module";
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { EditProfileComponent, ChangeProfilePic, EditContactEmail } from './edit-profile/edit-profile.component';
import { UpgradePlansComponent, DetailsPlans } from './upgrade-plans/upgrade-plans.component';
import { MyAssetsComponent } from './my-assets/my-assets.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { HelpNSupportComponent } from './help-n-support/help-n-support.component';
import { UploadedDataComponent } from './uploaded-data/uploaded-data.component';
import { DatePipe } from '@angular/common';
import { AssetPageComponent } from './asset-page/asset-page.component';
import { VideosComponent, VideoPlayer } from './videos/videos.component';
import { ImagesComponent, ImageViewer } from './images/images.component';
import { DocumentsComponent } from './documents/documents.component';
import { AudiosComponent, AudioPlayer } from './audios/audios.component';
import { DetailsDialog } from "./details-dialog/details-dialog";
import { FavoritesComponent } from './favorites/favorites.component';
import { TrashComponent } from './trash/trash.component';
import { GenricSearchComponent } from './genric-search/genric-search.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { RenameDialog } from "./details-dialog/rename-dialog";
import { RenameFolder } from "./details-dialog/rename-folder";
import { NewFolderComponent } from './new-folder/new-folder.component';
//import statement of services,directives
import { PasswordvalidatorDirective } from './Directives/passwordvalidator.directive';
import { UserPortalService } from "./Services/user-portal.service";
import { GroupByPipe } from "./filters/groupBy.pipe";
import { OrderByPipe } from "./filters/orderBy.pipe";
import { RoundPipe } from "./filters/roundPipe";
import { ReplacePipe } from "./filters/replace.pipe";
import { DetailsFolder } from "./details-dialog/details-folder";
import { SearchByAssetPipe } from "./filters/searchByAsset";
import { SearchByFolderPipe } from "./filters/searchByFolder";



@NgModule({
  declarations: [
    AppComponent,
    //Components
    HomePageComponent,
    TopbarComponent,
    TaglinePageComponent,
    UserRegistrationComponent,
    routingComponents,
    HomeComponent,
    AdvanceSearch,
    routingComponents,
    UserRegistrationComponent,
    ChangepasswordComponent,
    PasswordvalidatorDirective,
    EditProfileComponent,
    ChangeProfilePic,
    UpgradePlansComponent,
    MyAssetsComponent,
    SearchByImage,
    CreateNewFolder,
    DetailsPlans,
    FeedbackComponent,
    HelpNSupportComponent,
    FileUpload,
    UploadConfirmationComponent,
    SkipConfirmationComponent,
    UploadedDataComponent,
    AssetPageComponent,
    VideosComponent,
    ImagesComponent,
    DocumentsComponent,
    AudiosComponent,
    ImageViewer,
    VideoPlayer,
    AudioPlayer,
    FavoritesComponent,
    EditContactEmail,
    TrashComponent,
    GenricSearchComponent,
    AdvancedSearchComponent,
    NewFolderComponent,
    //Pipes
    GroupByPipe,
    OrderByPipe,
    RoundPipe,
    ReplacePipe,
    SearchByAssetPipe,
    SearchByFolderPipe,
    //Dialogs
    DetailsDialog,
    RenameDialog,
    RenameFolder,
    DetailsFolder,
    ViewFeaturesDialogStandard,
    ViewFeaturesDialogGold,
    ViewFeaturesDialogPremium,
    SignInDialog,
    SignUpDialog,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    ChartsModule,
    AppMaterialModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    SimpleNotificationsModule.forRoot(),
    McBreadcrumbsModule.forRoot(),
    BrowserModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    ImageViewerModule.forRoot(),
    DocumentViewModule,
    RatingModule,
    NgxSpinnerModule
  ],

  entryComponents: [
    SignUpDialog,
    SignInDialog,
    TaglinePageComponent,
    ViewFeaturesDialogStandard,
    ViewFeaturesDialogPremium,
    ViewFeaturesDialogGold,
    HomeComponent,
    AdvanceSearch,
    EditProfileComponent,
    ChangeProfilePic,
    SearchByImage,
    CreateNewFolder,
    UpgradePlansComponent,
    DetailsPlans,
    FileUpload,
    UploadConfirmationComponent,
    SkipConfirmationComponent,
    ImageViewer,
    VideoPlayer,
    AudioPlayer,
    DetailsDialog,
    RenameDialog,
    EditContactEmail,
    RenameFolder,
    DetailsFolder
    // MetadataFieldComponent

  ],

  providers: [
    UserPortalService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
