import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'searchByAsset' })
export class SearchByAssetPipe implements PipeTransform {

  transform(array: any, searchText: any): any {
    if(searchText == null) return array;

    return array.filter(function(arr){
             return arr.title.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    });
  }
}