import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import {AngularFireDatabase} from "angularfire2/database";
import * as firebase from "firebase";
// Interfaces
import {Bill} from "../interfaces/bill";
import {Hotel} from "../../hotels/interfaces/hotel";
// Service
import {DataProcessingService} from "../../shared/services/data-processing.service";
import {DataStorageService} from "../../shared/services/data-storage.service";
import {UploadFileService} from "../../shared/services/upload-file.service";

/*import {default as storage} from "firebase/app";
import {getFileNameFromResponseContentDisposition, saveFile} from "../bills-misc/file-download-helper";
import {RequestOptions, ResponseContentType} from "@angular/http";
import { InterceptorService } from 'ng2-interceptors';*/
// import { ConfigService } from 'app/common/services/config.service';
import { saveAs } from "file-saver";
import * as FileSaver from "file-saver";
import {Http, Response, RequestOptions, Headers, ResponseContentType} from "@angular/http";
import * as url from "url";
import { NotificationService } from '../../notification/services/notification.service';

// import {  } from "file-saver";


@Injectable()
export class BillService {
  billsCol: AngularFirestoreCollection<Bill>;
  bills: any;
  downloadedItem: any;
  hotelsCol: any;
  id: any;


  constructor(private afs: AngularFirestore,
              private dataStorageService: DataStorageService,
              private db: AngularFireDatabase,
              private uploadFileService: UploadFileService,
              private DataProcessingService: DataProcessingService,
              private http: Http,
              private notificationService:NotificationService
              /*private fileSaver: MSFileSaver*/) {
  }

  getBills() {
    this.billsCol = this.afs.collection('bills', ref => ref.orderBy('date'));
    return this.billsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Bill;
          const id = a.payload.doc.id;
          return {id, data};
        });
      });
  }

  downloadImage(applicationId) {
    const _self = this;
    return this.http.get( applicationId);
  }

  addBill(bill) {
    this.afs.collection('bills').add(bill);
    this.notificationService.createNewAction("uploaded a bill")
  }

  deleteBillService(billId) {
    this.afs.doc('bills/' + billId).delete();
    this.notificationService.createNewAction("deleted a bill")
  }

  downloadResource(id: string): Promise<Blob> {
    console.log(id);
    // const file =  await this.http.get<Blob>('/' + id,
    //   {responseType: 'blob' as 'json'}).toPromise();
    return undefined;
  }

}
  // getImage(imageUrl: any) {
  //   return this.http.get(imageUrl)
  //     // .map((res) => {
  //     //   return new Blob([res.body], {type: res.headers.get('Content-Type')});
  //     // });
  // }


/* doGET() {
  console.log("GET");
  let url = `${this.apiRoot}/get`;
  this.http.get(url).subscribe(res => console.log(res.text()));
}
*/

     /* const mainSection = document.getElementById('main');
      const urlOfFile = bill.data.image;


      const img = document.createElement('img');
      img.setAttribute('src', urlOfFile);
      // img.setAttribute('id', 'img');

      // console.log(img.src);
    // const canvas = this.convertImageToCanvas(img);

      const blob = new Blob([img],  {type: "image/png"});
      FileSaver.saveAs(blob, bill.data.name + '.png');*/
    // FileSaver.saveAs(blob, "myPDF_" + bill.data.name + ".jpg");

    // canvas.setAttribute('class', 'fileCanvas');

    // console.log(canvas);
    // this.http.get(img.src)
    //   .map((res) => {
    //     console.log('Blob',res);
    //
    //     let obj: any = res[urlOfFile];
    //     return new Blob([obj], {type: 'image/jpeg'});
    //   })
    //   .subscribe(blob => {
    //     console.log('Blob',blob);
    //     FileSaver.saveAs(blob,bill.data.name)
    //   }, error => {
    //     console.log(error);
    //   })
    // });
    // const dataURL = canvas.toDataURL('image/png');
    // dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    // // console.log(canvas);
    // canvas.toBlob(function(blob) {
    //   console.log(blob);
    //   saveAs(blob, bill.data.name);
  // convertImageToCanvas(image) {
  //   var canvas = document.createElement("canvas");
  //   canvas.width = image.width;
  //   canvas.height = image.height;
  //   canvas.getContext("2d").drawImage(image, 0, 0);
  //
  //   return canvas;
  // }
