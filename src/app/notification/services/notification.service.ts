import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import {AngularFireDatabase} from "angularfire2/database";
// Interfaces
import {Notification} from '../interfaces/notification';
// Service
import {HelperService} from "../../shared/services/helper.service";
import {DataStorageService} from "../../shared/services/data-storage.service";
import { FirebaseAuth } from '@firebase/auth-types';
import * as firebase from 'firebase';
@Injectable()
export class NotificationService {

  notificationsCol: AngularFirestoreCollection<Notification>;
  notifications: any;

  constructor(private afs: AngularFirestore,
              private dataStorageService: DataStorageService,
              private db: AngularFireDatabase) {
  }

  getNotifications(hotelId) {  
    this.notificationsCol = this.afs.collection('notifications', ref=>ref.where('hotelId', '==', hotelId));
    return this.notificationsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Notification;
          const id = a.payload.doc.id;
          return {id, data};
        })
      })
  }

  createNewAction(action){    
    let notification = {
      hotelId: localStorage.hotelId,
      manager: this.dataStorageService.getUser().name,
      action:action,
      time: new Date().getTime()
    };

    this.addNotification(notification);
  }

  // changeDateTimeFormat(date){
  //   return date.toISOString().substring(0,19)
  // }

  addNotification(notification) {
    this.afs.collection('notifications').add(notification).then(()=>
      console.log("new action was made")
    ).catch(
      error => console.log(error)    
    );
  }
}
