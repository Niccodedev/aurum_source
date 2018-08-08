import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
import {FormBuilder} from '@angular/forms';
// Interfaces
import { Schedule } from './schedule';
import {Manager} from '../../home/interfaces/manager';
import {Hotel} from '../../hotels/interfaces/hotel';
// Services
import { DataStorageService } from '../../shared/services/data-storage.service';
import {DataProcessingService} from '../../shared/services/data-processing.service';
import {AuthService} from '../../auth/auth.service';
import {HotelService} from '../../hotels/services/hotel.service';
import {HelperService} from '../../shared/services/helper.service';

@Injectable()
export class CalendarService {

//   inventoriesCol: AngularFirestoreCollection<Schedule>;
  inventoriesCol:any;
  inventories: Array<Schedule>;
  hotelId: string;
  schedules:any;
  constructor(private afs: AngularFirestore,
              private dataStorageService: DataStorageService,
              private db: AngularFireDatabase,
              public dataProcessingService: DataProcessingService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private hotelSevice: HotelService) {}


  getSchedules(year,month) {
    return this.afs.collection('calendar')
    .doc('XbgCR6rCOlc6jr6W3OOe')
    .collection('months')
    .doc('2018-09')
    .valueChanges()
   
    
    
    // return this.inventoriesCol.snapshotChanges()
    //   .map(actions => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data() as Schedule;
    //       const id = a.payload.doc.id;
    //       return {id, data};
    //     })
    //   })    
    
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
