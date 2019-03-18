import { FileUploader } from "ng2-file-upload";
import { UploadedItemAttribute } from "../Interfaces/uploaded-item-attribute";
import { UserPortalService } from "../Services/user-portal.service";
import { NotificationsService } from "angular2-notifications";
import { saveAs } from 'file-saver/FileSaver';
import { ActivatedRoute, Router } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { MatDialog, MatDialogRef } from "@angular/material";
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from "@angular/core";
import { MyAssetsComponent } from "../my-assets/my-assets.component";
import { RenameDialog } from "../details-dialog/rename-dialog";
import { RenameFolder } from "../details-dialog/rename-folder";
import { CopyCutPaste } from "../Interfaces/copy-cut-paste";
import { NgxSpinnerService } from "ngx-spinner";

'use strict';
//Global Variables
export let ipAddress = "10.53.168.60:8080";
export let ipAdrs = "10.53.195.226:8080";

export let indexImage;
export let indexVideo;
export let videoObject;
export let indexAudio;
export let audioObject;
export let uriAsset;
export let isDeletedAsset;
export let isDeletedFolder;
export let isFavorite;
export let isPastedAsset;
export let type;
export let extension;
export let pasteDisable : boolean = true;
// Global Arrays
export let Images: Array<string> = [];
export let advancedSearch: Array<any> = [];
export let uploadedItemsAttribute: Array<UploadedItemAttribute> = [];
export let copyCutPaste: Array<CopyCutPaste> = [];
export let playVideo: any = [];
export let playAudio: any = [];
export let storageDetails: any = [];
export let extensionArray: any = [];
// Global Functions

export function setIndexImage(newValue: number) {
    indexImage = newValue;
}

export function setImageArray(newValue: any[]) {
    Images = newValue;
}

export function setIndexVideo(newValue: number) {
    indexVideo = newValue;
}

export function setVideoListArray(newValue: any[]) {
    playVideo = newValue;
}

export function setVideoObject(newValue) {
    videoObject = newValue;
}

export function setIndexAudio(newValue: number) {
    indexAudio = newValue;
}

export function setAudioListArray(newValue: any[]) {
    playAudio = newValue;
}

export function setAudioObject(newValue) {
    audioObject = newValue;
}

export function setAdvancedSearch(newValue: any[]) {
    advancedSearch = newValue;
}

export function setStorageDetails(newValue: any[]) {
    storageDetails = newValue;
}

export function setCopyCutArray(newValue) {
    copyCutPaste = newValue;
}

export function setType(newValue) {
    type = newValue;
}

export function setExtension(newValue) {
    extension = newValue;
}

export function setExtensionArray(newValue: any[]) {
    extensionArray = newValue;
}

export function setpasteDisable(newValue: any) {
    pasteDisable = newValue;
}


//function for making asset favorite/unfavorite
export function getUriNFavStatus(valueUri: string, valueFavStatus: string, favoritesService: UserPortalService, notifier: NotificationsService) {
    //service for making asset as favorites
    let urlFavorites = 'http://' + this.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/' + valueUri + '/' + valueFavStatus + '/setasfavourite';
    var promise = new Promise((resolve, reject) => {
        favoritesService.getData(urlFavorites)
            .subscribe(favorites_response => {
                console.log(favorites_response);
                if (favorites_response.response == 'operation successful') {
                    notifier.success("Successfull");
                    isFavorite = true;
                    resolve(isFavorite);
                }
                else if (favorites_response.response == 'not able to find the asset-server exception') {
                    notifier.error("Error Occurred while operation");
                    isFavorite = false;
                    reject(isFavorite);
                }
                else if (favorites_response.response == 'Asset doesnt belong to the user') {
                    notifier.error("Asset does not belong to User");
                    isFavorite = false;
                    reject(isFavorite);
                }
                else {
                    notifier.error("Unexpected Error");
                    isFavorite = false;
                    reject(isFavorite);
                }
            });
    });

    return promise;
}

//function for deleting multiple assets from pre-defined buckets
export function deleteAsset(valueUri: string, deleteService: UserPortalService, notifier: NotificationsService): Promise<any> {
    //service for post new array for buckets
    let urlDeleteAsset = 'http://' + this.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/' + valueUri + '/deleteasset';
    var promise = new Promise((resolve, reject) => {
        deleteService.getData(urlDeleteAsset)
            .subscribe(array_response => {
                console.log(array_response);
                if (array_response.response == 'deleted successfully') {
                    notifier.success("Deleted Successfully");
                    isDeletedAsset = true;
                    resolve(isDeletedAsset);
                    //  return true;
                }
                else if (array_response.response == 'delete operation failed due to server exception') {
                    notifier.error("Error Occurred while deleting");
                    isDeletedAsset = false;
                    reject(isDeletedAsset);
                }
                else if (array_response.response == 'Asset doesnt belong to user') {
                    notifier.error("Asset does not belong to User");
                    isDeletedAsset = false;
                    reject(isDeletedAsset);
                    //   return false;
                }
                else {
                    notifier.error("Unexpected Error");
                    isDeletedAsset = false;
                    reject(isDeletedAsset);
                    //  return false;
                }
            });
    });

    return promise;
}

//function for deleting multiple assets from custom folder
export function deleteAssetFolder(valueUri: string, deleteService: UserPortalService, folderName: string,notifier: NotificationsService): Promise<any> {
    //service for post new array for buckets
    let urlDeleteAssetFolder = 'http://' + this.ipAdrs + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/deleteassetfromfolder?uri='+valueUri+'&folder_name='+folderName+'';
    // /pmam/user/{email_id}/deleteassetfromfolder ?uri=""&folder_name=""
    var promise = new Promise((resolve, reject) => {
        deleteService.getData(urlDeleteAssetFolder)
            .subscribe(array_response => {
                console.log(array_response);
                if (array_response.response == 'operation successfull') {
                    notifier.success("Deleted Successfully");
                    isDeletedAsset = true;
                    resolve(isDeletedAsset);
                    //  return true;
                }
                else if (array_response.response == 'Invalid destination') {
                    notifier.error("Error Occurred while deleting");
                    isDeletedAsset = false;
                    reject(isDeletedAsset);
                }
                else if (array_response.response == 'operation un-successfull') {
                    notifier.error("Unsuccessful");
                    isDeletedAsset = false;
                    reject(isDeletedAsset);
                    //   return false;
                }
                else {
                    notifier.error("Unexpected Error");
                    isDeletedAsset = false;
                    reject(isDeletedAsset);
                    //  return false;
                }
            });
    });

    return promise;
}

//function for downloading assets
export function downloadAsset(fileName: string, downloadService: UserPortalService) {
    console.log("calling download" + " " + fileName);
    let urlDownload = 'http://' + this.ipAddress + '/pmam/user/download?asset_url=' + fileName + '';
    downloadService.getDataAsset(urlDownload)
        .subscribe(download_response => {
            saveAs(download_response, fileName);
        })
}

export function renameAsset(data, renameService: UserPortalService, dialogRef: MatDialogRef<RenameDialog>, notifier: NotificationsService): Promise<any> {
    let urlRename = 'http://' + this.ipAddress + '/pmam/user/renameasset';
    var promise = new Promise((resolve, reject) => {
        renameService.postData(urlRename, data)
            .subscribe(rename_response => {
                if (rename_response.response == "Rename Successfull") {
                    notifier.success("Successfully Rename");
                    dialogRef.close();
                    resolve(rename_response.new_title);
                }
                else if (rename_response.response == "Rename Failed") {
                    notifier.error("Failed to Rename");
                }
                else {
                    alert("server Error");
                }
                console.log(rename_response);
            });
    });
    return promise;

}

export function renameFolder(data, renameService: UserPortalService, dialogRef: MatDialogRef<RenameFolder>, notifier: NotificationsService) {
    console.log(data.old_folder_name + " " + data.new_folder_name);
    let urlRenameFolder = 'http://' + this.ipAdrs + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/renamefolder?old_folder_name=' + data.old_folder_name + '&new_folder_name=' + data.new_folder_name + '';
    renameService.getData(urlRenameFolder)
        .subscribe(rename_response => {
            if (rename_response.response == "successfully renamed folder") {
                notifier.success("Successfully Rename");
                dialogRef.close();
            }
            else if (rename_response.response == "folder rename unsuccessfull") {
                notifier.error("Failed to Rename");
            }
            console.log(rename_response);
        })

}


export function removeFolder(folder_name,removeService: UserPortalService,notifier: NotificationsService) : Promise<any>{
    let urlDeleteFolder = 'http://'+this.ipAdrs+'/pmam/user/'+sessionStorage.getItem('currentUser')+'/deleteFolder?folder_name='+folder_name+'';
        var promise = new Promise((resolve, reject) => {
    removeService.getData(urlDeleteFolder)
                      .subscribe(delete_response =>{
                if (delete_response.response == 'soft delete sucessfull') {
                    notifier.success("Deleted Successfully");
                    isDeletedFolder = true;
                    resolve(isDeletedFolder);
                    //  return true;
                }
                else if (delete_response.response == 'soft delete un-sucessfull') {
                    notifier.error("Error Occurred while deleting");
                    isDeletedFolder = false;
                    reject(isDeletedFolder);
                }

                else {
                    notifier.error("Unexpected Error");
                    isDeletedFolder = false;
                    reject(isDeletedFolder);
                    //  return false;
                }                      
            });
   
});
        return promise;
}

export function pasteAsset(data,pasteService: UserPortalService, notifier: NotificationsService, spinner: NgxSpinnerService): Promise<any>{
    let urlAssetPaste = 'http://'+ipAdrs+'/pmam/user/copycutoperation';
    var promise = new Promise((resolve, reject) => {
      pasteService.postData(urlAssetPaste,data)
                 .subscribe(paste_response =>{
                console.log(paste_response);
                if (paste_response.response == 'operation successfull') {
                    console.log(paste_response);
                    notifier.success("Pasted Successfully");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                    //  return true;
                }
                else if (paste_response.response == 'Cut Operation failed due to server Exception') {
                    notifier.error("Error Occurred while deleting");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                }

                else if (paste_response.response == 'Invalid Operation') {   
                    notifier.error("Error Occurred while deleting");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                }

                else if (paste_response.response == 'Invalid Destination') {
                    notifier.error("Error Occurred while deleting");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                }
                else if (paste_response.response == 'operation un-successfull') {
                    notifier.error("Error Occurred while deleting");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                }                
                else {
                    notifier.error("Unexpected Error");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                }   
             spinner.hide();                      
            });
    });
                    return promise;
  }

export function pasteFolder(data,pasteService: UserPortalService, notifier: NotificationsService){
     let urlFolderPaste = 'http://'+ipAdrs+'/pmam/user/copycutfolders';
    var promise = new Promise((resolve, reject) => {
      pasteService.postData(urlFolderPaste,data)
                       .subscribe(paste_response =>{
                if (paste_response.response == 'operation successfull') {
                    console.log(paste_response);
                    notifier.success("Pasted Successfully");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                    //  return true;
                }
                else if (paste_response.response == 'Cut Operation failed due to server Exception') {
                    notifier.error("Error Occurred while deleting");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                }

                else if (paste_response.response == 'Invalid Operation') {   
                    notifier.error("Error Occurred while deleting");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                }

                else if (paste_response.response == 'Invalid Destination') {
                    notifier.error("Error Occurred while deleting");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                }
                else if (paste_response.response == 'operation un-successfull') {
                    notifier.error("Error Occurred while deleting");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                }                
                else {
                    notifier.error("Unexpected Error");
                    isPastedAsset = true;
                    resolve(isPastedAsset);
                }  
            });
    });
        return promise;
  }

export function stringBeforeChar(asset_link: string){
    var name  = asset_link.slice((asset_link.lastIndexOf("/")  -  1  >>>  0)  +  2);
    var ext  = name.substr(name.indexOf('.')  +  1);
    return ext;
}  