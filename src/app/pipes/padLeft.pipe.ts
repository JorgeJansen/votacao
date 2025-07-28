import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padLeft'
})
export class PadLeftPipe implements PipeTransform {

  transform(value: number | string, length: number): string {
    return value.toString().padStart(length, '0');
  }

}
