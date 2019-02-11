import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
// Interfaces
import { Credential } from "../interfaces/credential";
import { Hotel } from "../../hotels/interfaces/hotel";
// Services
import { HelperService } from "../../shared/services/helper.service";
import { DataStorageService } from "../../shared/services/data-storage.service";

@Injectable()
export class CredentialsService {
  credentialsCol: AngularFirestoreCollection<Credential>;
  credentials: any;
  constructor(
    private afs: AngularFirestore,
    private dataStorageService: DataStorageService,
    private db: AngularFireDatabase
  ) {}

  getCredentials() {
    this.credentialsCol = this.afs.collection("credentials");
    return this.credentialsCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Credential;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
  }

  addCredential(credential) {
    /*this.afs.collection('vendors').doc(hotelId).set(vendor);*/
    this.afs.collection("credentials").add(credential);
  }

  deleteAllCredentialsByHotelId(hotelId) {
    this.afs
      .collection("credentials", ref => ref.where("htId", "==", hotelId))
      .snapshotChanges()
      .forEach(docs => {
        docs.forEach(_doc => {
          this.afs.doc(`credentials/${_doc.payload.doc.id}`).delete();
        });
      });
  }
}
