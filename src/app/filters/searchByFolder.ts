import { Pipe, PipeTransform } from '@angular/core';
import { ReplacePipe } from "./replace.pipe";
@Pipe({ name: 'searchByFolder' })
export class SearchByFolderPipe implements PipeTransform {

  transform(array: any, searchText: any): any {
    if(searchText == null) return array;
    return array.filter(function(arr){
      var name = arr.folder_name;
      var new_name = new ReplacePipe().transform(name);
             return new_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    })
  }
}