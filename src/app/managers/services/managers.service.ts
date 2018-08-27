import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class ManagerService {

  constructor(private afs: AngularFirestore,
              private db: AngularFireDatabase) {
  }
}
