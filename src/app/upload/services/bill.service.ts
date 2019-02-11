import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase";
// Interfaces
import { Bill } from "../interfaces/bill";
import { Hotel } from "../../hotels/interfaces/hotel";
// Service
import { DataProcessingService } from "../../shared/services/data-processing.service";
import { DataStorageService } from "../../shared/services/data-storage.service";
import { UploadFileService } from "../../shared/services/upload-file.service";

/*import {default as storage} from "firebase/app";
import {getFileNameFromResponseContentDisposition, saveFile} from "../bills-misc/file-download-helper";
import {RequestOptions, ResponseContentType} from "@angular/http";
import { InterceptorService } from 'ng2-interceptors';*/
// import { ConfigService } from 'app/common/services/config.service';
import { saveAs } from "file-saver";
import * as FileSaver from "file-saver";
import {
  Http,
  Response,
  RequestOptions,
  Headers,
  ResponseContentType
} from "@angular/http";
import * as url from "url";
import { NotificationService } from "../../notification/services/notification.service";

import { FileUpload } from "../../shared/classes/file-upload";

// import {  } from "file-saver";

@Injectable()
export class BillService {
  billsCol: AngularFirestoreCollection<Bill>;
  bills: any;
  downloadedItem: any;
  hotelsCol: any;
  id: any;

  constructor(
    private afs: AngularFirestore,
    private dataStorageService: DataStorageService,
    private db: AngularFireDatabase,
    private uploadFileService: UploadFileService,
    private DataProcessingService: DataProcessingService,
    private http: Http,
    private notificationService: NotificationService
  ) /*private fileSaver: MSFileSaver*/ {}

  getBills() {
    this.billsCol = this.afs.collection("bills", ref => ref.orderBy("date"));
    return this.billsCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Bill;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
  }

  downloadImage(applicationId) {
    const _self = this;
    return this.http.get(applicationId);
  }

  addBill(bill) {
    this.afs.collection("bills").add(bill);
    this.notificationService.createNewAction("uploaded a bill");
  }

  getFileName(url: String) {
    let index = url.lastIndexOf("?");
    return url.substring(url.indexOf("%2F") + 3, url.indexOf("?"));
  }
  deleteBillService(billId) {
    let billRef = this.afs.doc(`bills/${billId}`).ref;
    billRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data();
          let fileName = this.getFileName(data.image);
          this.uploadFileService
            .deleteFileUpload(fileName)
            .then(() => billRef.delete());
        } else {
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }

  deleteAllBillsByHotelId(hotelId) {
    this.afs
      .collection("bills", ref => ref.where("htId", "==", hotelId))
      .snapshotChanges()
      .forEach(docs => {
        docs.forEach(_doc => {
          this.deleteBillService(_doc.payload.doc.id);
        });
      });
  }

  downloadResource(id: string): Promise<Blob> {
    console.log(id);
    // const file =  await this.http.get<Blob>('/' + id,
    //   {responseType: 'blob' as 'json'}).toPromise();
    return undefined;
  }
}
