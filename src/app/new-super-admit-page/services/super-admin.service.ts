import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/add/operator/map';
// Interfaces
import {Admin} from '../interfaces/admin';
// Services
import {HelperService} from '../../shared/services/helper.service';
import {DataStorageService} from '../../shared/services/data-storage.service';
import {Hotel} from '../../hotels/interfaces/hotel';
import {Vendor} from '../../property/interfaces/vendor';
import {DataProcessingService} from '../../shared/services/data-processing.service';
import {AuthService} from '../../auth/auth.service';
import {Manager} from '../../managers/interfaces/manager';
import * as firebase from 'firebase';

@Injectable()
export class SuperAdminService {
  adminsCol: AngularFirestoreCollection<Admin>;
  admins: any;

  password: string;
  admin: Array<Admin>;

  city: string;
  name: string;
  phone: any;
  email: string;
  number: any;
  status: any;
  hotelId: string;
  role: any;

  constructor(private afs: AngularFirestore,
              private db: AngularFireDatabase,
              private dataStorageService: DataStorageService,
              public dataProcessingService: DataProcessingService,
              private authService: AuthService) {
  }

  getAdmins() {
    this.adminsCol = this.afs.collection('managers');
    return this.adminsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Admin;
          const id = a.payload.doc.id;
          return {id, data};
        });
      });
  }

  deleteAdminService(adminId) {
    this.afs.doc('managers/' + adminId).delete().then(res => {
      console.log('Success');
    }).catch(err => {
      console.log(err);
    });
  }

  changePassword(email) {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }

  deleteHotelAndManagers(adminId){
    this.afs.collection('hotels', ref => ref.where("adminId",'==', adminId)).ref.get()
    .then(
      hotels => {
          hotels.docs.forEach((hotel)=>{
            this.afs.collection('manaagers', ref => ref.where('hotelId', '==', hotel.id)).ref.get()
            .then(
              managers => {
                managers.docs.forEach(manager =>{
                  manager.ref.delete();
                })
              }
            )

          hotel.ref.delete();
        })
      },
    ) 
  }
}
