import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import {AngularFireDatabase} from "angularfire2/database";
import * as firebase from "firebase";
import {Http, Response, RequestOptions, Headers, ResponseContentType} from "@angular/http";
// Interfaces
import { Form } from '../interfaces/form';
import {Hotel} from "../../hotels/interfaces/hotel";
// Service
import {DataProcessingService} from "../../shared/services/data-processing.service";
import {DataStorageService} from "../../shared/services/data-storage.service";
import {UploadFileService} from "../../shared/services/upload-file.service";
import { saveAs } from "file-saver";
import * as FileSaver from "file-saver";
import * as url from "url";
import { NotificationService } from '../../notification/services/notification.service';

@Injectable()
export class FormService {
  formsCol: AngularFirestoreCollection<Form>;
  forms: any;
  id: any;

  constructor(private afs: AngularFirestore,
              private dataStorageService: DataStorageService,
              private db: AngularFireDatabase,
              private uploadFileService: UploadFileService,
              private DataProcessingService: DataProcessingService,
              private http: Http,
              private notificationService: NotificationService
            ) {
  }

  getForms() {
    this.formsCol = this.afs.collection('forms', ref => ref.orderBy('date'));
    return this.formsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Form;
          const id = a.payload.doc.id;
          return {id, data};
        });
      });
  }

  addForm(form) {
    this.afs.collection('forms').add(form).then(()=>{
      this.notificationService.createNewAction("uploaded a form")
    });

  }

  deleteFormService(formId) {
    this.afs.doc('forms/' + formId).delete().then(() => {
      this.notificationService.createNewAction("deleted a form")
    });
  }

}
