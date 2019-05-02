import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CountPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'count',
})
export class CountPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any[], ...args) {
    return Object.keys(value).length;
  }
}
