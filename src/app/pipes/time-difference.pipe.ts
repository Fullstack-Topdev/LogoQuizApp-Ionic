import { Pipe, PipeTransform } from '@angular/core';

// When fixed, uncomment this
// import * as dayjs from 'dayjs';
import * as _dayjs from 'dayjs';

// TODO:  dayjs is throiwing this ERROR:
//        error TS2339: Property 'to' does not exist on type 'Dayjs'.
// Luckily there is a PR which solves it (https://github.com/iamkun/dayjs/issues/297#issuecomment-442748858)
// When fixed, remove this line:
const dayjs: any = _dayjs;

@Pipe({ name: 'appTimeDifference' })
export class TimeDifferencePipe implements PipeTransform {
  transform(value: any): number {
    return dayjs(value).diff(dayjs(), 'day');
  }
}
