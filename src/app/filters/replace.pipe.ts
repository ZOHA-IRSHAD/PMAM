import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'replace' })
export class ReplacePipe implements PipeTransform {
  transform(value: string): string {
    var len = ((value.match(new RegExp("/", "g")) || []).length);
    if(len > 1){
     var val = value.substring(0, value.lastIndexOf('/') + 1);
     return value.replace(val,'');
    }
      else
        return value.replace('/', '');   
  }


}
