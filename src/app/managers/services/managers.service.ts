import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
import { auth } from "firebase/app";

@Injectable()
export class ManagerService {
  constructor(private afs: AngularFirestore, private db: AngularFireDatabase) {}

  deleteAllManagersById(hotelId) {
    this.afs
      .collection("managers", ref => ref.where("hotelId", "==", hotelId))
      .snapshotChanges()
      .forEach(docs => {
        docs.forEach(_doc => {
          this.afs.doc(`managers/${_doc.payload.doc.id}`).delete();
          //need to do auth delete
        });
      });
  }
}
