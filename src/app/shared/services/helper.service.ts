import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {


  constructor() { }

  public static getItemsByHotelId(arr){
    let hotel =  arr.find(e => e.id == localStorage.hotelId);
    if(hotel) return hotel.data;
    return {};
  }

}
