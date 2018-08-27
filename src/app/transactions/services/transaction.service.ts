import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import {AngularFireDatabase} from "angularfire2/database";
import 'rxjs/add/operator/map';
// Interfaces
import {Transaction} from '../interfaces/transaction';
import { NotificationService } from '../../notification/services/notification.service';

@Injectable()
export class TransactionService {

  transactionsCol: AngularFirestoreCollection<Transaction>;


  constructor(private afs: AngularFirestore,
              private db: AngularFireDatabase,
              private notificationService: NotificationService
            ) {}

  getTransactions() {
    this.transactionsCol = this.afs.collection('transactions');
    return this.transactionsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, data};
        });
      });
  }

  addTransaction(item, hotelId) {
    
    this.afs.collection('transactions').doc(hotelId).set(item).then(
      ()=>{
        let action =" added new Transaction data"
        this.notificationService.createNewAction(action)
      }
    );
  }

  // addNewField(){
  //   this.afs.collection('inventories').doc(localStorage.hotelId).set({
  //     "room" : {} ,
  //     "maintenance" : {},
  //     "fb" : {},
  //     "misc" : {},
  //   });
  // }

}
