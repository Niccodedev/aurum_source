import { Pipe, PipeTransform } from '@angular/core';
function transformDate(date:any):any{
  if(date[2]=='-'){
    date = date.substr(-4)+'-'+date.substr(0,2)+date.substr(2,3)
  }
  return date;
}

@Pipe({
  name: 'filterByDate'
})
export class FilterByDatePipe implements PipeTransform {

  transform(array: Array<any>, from: any, to:any): any {
    from = transformDate(from);
    to = transformDate(to);
    console.log(from);
    console.log(to)
    return array.filter(el => (new Date(from) <= new Date(transformDate(el.date)) && new Date(to) >= new Date(transformDate(el.date))))
  }

}
