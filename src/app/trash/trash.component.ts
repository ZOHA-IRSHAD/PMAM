import { Component, OnInit } from '@angular/core';
import * as globalValues from "../Global-Var-Fun/global-var-fun";
import { UserPortalService } from "../Services/user-portal.service";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { DetailsDialog } from "../details-dialog/details-dialog";
import { NotificationsService } from "angular2-notifications";
import { DetailsFolder } from "../details-dialog/details-folder";
import { AssetsFields } from "../Interfaces/assets-fields";
import { FolderFields } from "../Interfaces/folder-fields";
import { ReplacePipe } from "../filters/replace.pipe";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {
  //URLs
  urlTrashAsset = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/fetchtrash';
  urlTrashFolder = 'http://' + globalValues.ipAdrs + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/fetchtrashfolders';
  //Variables
  viewModule: boolean = true;
  //Arrays
  trashs: any = [];
  bins: any = [];
  dataSource: any = [];
  dataSourceFolder: any = [];
  displayedColumns = ['title', 'actions'];
  displayedColFolder = ['folder_name', 'actions'];

  public options = {
    position: ["top", "right"],
    showProgressBar: false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true,
  }

  constructor(private trashService: UserPortalService,
    public dialog: MatDialog,
    private notifier: NotificationsService,
    private spinner: NgxSpinnerService) { }


  ngOnInit() {
    this.spinner.show();
    this.trashService.getData(this.urlTrashAsset)
      .subscribe(trash_response => {
        console.log(trash_response);
        this.trashs = trash_response;
        this.dataSource = new MatTableDataSource(this.trashs);
        this.trashs.sort((a, b) => new Date(b.uploaded_date).getTime() - new Date(a.uploaded_date).getTime());

        this.dataSource.filterPredicate = function (data: AssetsFields, filter: string): boolean {
          return data.title.toLowerCase().includes(filter);
        };
      })

    this.trashService.getData(this.urlTrashFolder)
      .subscribe(bin_response => {
        console.log(bin_response);
        this.bins = bin_response;
        this.dataSourceFolder = new MatTableDataSource(this.bins);
        this.bins.sort((a, b) => new Date(b.uploaded_date).getTime() - new Date(a.uploaded_date).getTime());
        this.dataSourceFolder.filterPredicate = function (data: FolderFields, filter: string): boolean {
          var name = data.folder_name;
          var new_name = new ReplacePipe().transform(name);
          return new_name.toLowerCase().includes(filter);
        };
        this.spinner.hide();
      })
  }

  applyFilter(filterValue: string) {
    console.log(filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.dataSourceFolder.filter = filterValue;
    if (this.dataSource.filteredData.length == 0) {
      this.displayedColumns = ['results'];
    }else if(this.dataSource.filteredData == ""){
      this.displayedColumns = ['title', 'actions'];
    } 
    else if(this.dataSource.filteredData.length != 0) {
      this.displayedColumns = ['title', 'actions'];
    }

    if (this.dataSourceFolder.filteredData.length == 0) {
      this.displayedColFolder = ['results'];
    }else if(this.dataSource.filteredData == ""){
      this.displayedColFolder = ['folder_name', "actions"];
    } 
    else if(this.dataSource.filteredData.length != 0) {
      this.displayedColFolder = ['folder_name', "actions"];
    }
  }

  changeView() {
    this.viewModule = !this.viewModule;

  }

  openDetailsAsset(asset) {
    let dialogRef = this.dialog.open(DetailsDialog, {
      width: '400px',
      data: { asset_type: asset.asset_type, size: +((asset.size / (1024 * 1024 * 1024)).toFixed(5)), directory: asset.directory, owner: asset.owner }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDetailsFolder(folder_info) {
    console.log(folder_info);
    let dialogRef = this.dialog.open(DetailsFolder, {
      width: '400px',
      data: { created_date: folder_info.created_date, location: folder_info.folder_name, folder_size: +((folder_info.size / (1024 * 1024 * 1024)).toFixed(3)), asset_count: folder_info.count }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  permanentRemoveAsset(asset_uri: string, index) {
    console.log(index);
    if (confirm("Are you sure you want to permanently delete this file?")) {
      console.log("cllaing remove");
      for (var i = 0; i < this.trashs.length; i++) {
        if (this.trashs[i].uri == asset_uri) {
          index = i;
          break;
        }
      }
      let urlRemoveAsset = 'http://' + globalValues.ipAddress + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/' + asset_uri + '/premanentdelete';
      this.trashService.getData(urlRemoveAsset)
        .subscribe(remove_response => {
          console.log("Hitting server");
          console.log(remove_response);
          if (remove_response.response == "Deleted Successfully") {
            console.log(remove_response);
            this.notifier.success("Remove from Trash");
            this.trashs.splice(index, 1);
            this.trashs = this.trashs.slice();
            this.dataSource = new MatTableDataSource(this.trashs);
          }
          else {
            this.notifier.error("Unexpected Error");
          }
        })
    }
    else {
      alert("Cancel");
    }

  }

  permanentRemoveFolder(folder_name: string, index) {
    if (confirm("Are you sure you want to permanently delete this folder?")) {
      let urlRemoveFolder = 'http://' + globalValues.ipAdrs + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/permanentdeleteFolder?folder_name=' + folder_name + '';
      this.trashService.getData(urlRemoveFolder)
        .subscribe(remove_response => {
          console.log("Hitting server");
          console.log(remove_response);
          if (remove_response.response == "Permanent Delete sucessfull") {
            console.log(remove_response);
            this.notifier.success("Remove from Trash");
            this.bins.splice(index, 1);
            this.bins = this.bins.slice();
            this.dataSourceFolder = new MatTableDataSource(this.bins);
          }
          else {
            this.notifier.error("Unexpected Error");
          }
        })
    }
    else {
      alert("Cancel");
    }

  }

  restoreAsset(asset_uri: string, index) {
    console.log(index);
    for (var i = 0; i < this.trashs.length; i++) {
      if (this.trashs[i].uri == asset_uri) {
        index = i;
        break;
      }
    }

    let urlRestoreAsset = 'http://' + globalValues.ipAdrs + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/' + asset_uri + '/restoreasset';
    this.trashService.getData(urlRestoreAsset)
      .subscribe(restore_response => {
        if (restore_response.response == "restored successfully") {
          this.notifier.success("Restored Successfully");
          this.trashs.splice(index, 1);
          this.trashs = this.trashs.slice();
          this.dataSource = new MatTableDataSource(this.trashs);

        }
        else {
          this.notifier.error("Error");
        }
        console.log(restore_response);
      })
  }

  restoreFolder(folder_name: string, index) {
    let urlRestoreFolder = 'http://' + globalValues.ipAdrs + '/pmam/user/' + sessionStorage.getItem('currentUser') + '/restorefolder?folder_name=' + folder_name + '';
    this.trashService.getData(urlRestoreFolder)
      .subscribe(restore_response => {
        if (restore_response.response == "restore operation successfull") {
          this.notifier.success("Restored Successfully");
          this.bins.splice(index, 1);
          this.bins = this.bins.slice();
          this.dataSourceFolder = new MatTableDataSource(this.bins);

        }
        else {
          this.notifier.error("Error");
        }
        console.log(restore_response);
      })
  }

}
