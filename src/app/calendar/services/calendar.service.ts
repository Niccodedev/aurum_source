import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase";
import { FormBuilder } from "@angular/forms";
// Interfaces
import { Schedule } from "./schedule";
import { Manager } from "../../managers/interfaces/manager";
import { Hotel } from "../../hotels/interfaces/hotel";
// Services
import { DataStorageService } from "../../shared/services/data-storage.service";
import { DataProcessingService } from "../../shared/services/data-processing.service";
import { AuthService } from "../../auth/auth.service";
import { HelperService } from "../../shared/services/helper.service";

@Injectable()
export class CalendarService {
  //   inventoriesCol: AngularFirestoreCollection<Schedule>;
  inventoriesCol: any;
  inventories: Array<Schedule>;
  hotelId: string;
  schedules: any;
  constructor(
    private afs: AngularFirestore,
    private dataStorageService: DataStorageService,
    private db: AngularFireDatabase,
    public dataProcessingService: DataProcessingService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  getSchedules(hotelId, year, month) {
    return this.afs
      .collection("calendar")
      .doc(hotelId)
      .collection("months")
      .doc(this.getMonthFormat(year, month))
      .valueChanges();
  }

  saveSchedules(hotelId, year, month, schedules) {
    return this.afs
      .collection("calendar")
      .doc(hotelId)
      .collection("months")
      .doc(this.getMonthFormat(year, month))
      .set(schedules);
  }

  getMonthFormat(year, month) {
    if (month > 9) return "" + year + "-" + month;
    return "" + year + "-0" + month;
  }

  changeDateTimeFormat(date) {
    return date.toISOString().substring(0, 19);
  }

  deleteAllScheduleByHotelId(hotelId) {
    this.afs
      .collection("calendar")
      .doc(hotelId)
      .delete();
  }
  //   addInventory(inventory, hotelId, key){

  //     this.afs.collection('inventories').doc(hotelId).update({
  //       [key] : inventory
  //     }).then(()=>{

  //     })
  //     .catch(error=>{
  //       this.afs.collection('inventories').doc(hotelId).set({
  //         [key] : inventory
  //       })
  //     });

  //   }

  //    addPayroll(item, hotelId) {

  //     this.afs.collection('inventories').doc(hotelId).update({
  //       'payroll' : item
  //     });
  //   }

  //   addHK(item, hotelId) {

  //     this.afs.collection('inventories').doc(hotelId).update({
  //       'hk' : item
  //     });
  //   }

  //   addNewField() {
  //     this.afs.collection('inventories').doc(localStorage.hotelId).set({
  //       'room' : {} ,
  //       'payroll': {},
  //       'hk': {},
  //       'maintenance' : {},
  //       'fb' : {},
  //       'misc' : {},
  //     });
  //   }
}
