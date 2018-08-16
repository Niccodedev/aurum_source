import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import {AngularFireDatabase} from "angularfire2/database";
// Interfaces
import { Inspection } from '../interface/inspection';
// Services
import {HelperService} from "../../shared/services/helper.service";
import {DataStorageService} from "../../shared/services/data-storage.service";
import {Hotel} from '../../hotels/interfaces/hotel';


@Injectable()
export class inspectionService {
  inspectionsCol: AngularFirestoreCollection<Inspection>;
  inspections: any;

  constructor(private afs: AngularFirestore,
              private dataStorageService: DataStorageService,
              private db: AngularFireDatabase) {
  }

  getInspections() {
    this.inspectionsCol = this.afs.collection('inspections');
    return this.inspectionsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Inspection;
          const id = a.payload.doc.id;
          return {id, data};
        });
      });
  }
  

  addInspection(item, hotelId) {
      console.log(item);
      alert("hey")
    // this.afs.collection('inspections').add(item);
    this.afs.collection('inventories').doc(hotelId).update({
      "inspection" : item
    });
  }
addNewField() {
    this.afs.collection('inspections').doc(localStorage.hotelId).set({
      "inspection" : {}
    });
  }
}
//  {date: "",
//        inspections:
//        [{date: "2018-06-01", name: "Vitaliy Ploshchinskiy", regular: 3, over: 12}],
//         htId: "PHIFzkoZSXttVM6ENSsu"} );
//     console.log(form.value, this.hotelId);
//   }
