import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import {AngularFireDatabase} from "angularfire2/database";
// Interfaces
import { HK } from '../interface/hk';
// Services
import {HelperService} from "../../shared/services/helper.service";
import {DataStorageService} from "../../shared/services/data-storage.service";
import {Hotel} from '../../hotels/interfaces/hotel';


@Injectable()
export class HKService {
  hksCol: AngularFirestoreCollection<HK>;
  hks: any;

  constructor(private afs: AngularFirestore,
              private dataStorageService: DataStorageService,
              private db: AngularFireDatabase) {
  }

  getHK() {
    this.hksCol = this.afs.collection('hks');
    return this.hksCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as HK;
          const id = a.payload.doc.id;
          return {id, data};
        });
      });
  }
  

  addHK(item, hotelId) {
      console.log(item);
    this.afs.collection('hks').add(item);
    // this.afs.collection('inventories').doc(hotelId).update({
    //   "hk" : item
    // });
  }
addNewField() {
    this.afs.collection('hks').doc(localStorage.hotelId).set({
      "hk" : {}
    });
  }
}


