import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
// Interfaces
import { Hotel } from "../interfaces/hotel";
// Service
import { HelperService } from "../../shared/services/helper.service";
import { DataStorageService } from "../../shared/services/data-storage.service";
import { NotificationService } from "../../../app/notification/services/notification.service";
import { ActivityChatService } from "../../activity/activity-chat/service/activity-chat.service";
import { InventoryService } from "../../inventory/services/inventory.service";
import { BillService } from "../../upload/services/bill.service";
import { FormService } from "../../upload/services/form.service";
import { CredentialsService } from "../../property/services/credentials.service";
import { EmployeesService } from "../../property/services/employees.service";
import { VendorsService } from "../../property/services/vendors.service";
import { CalendarService } from "../../calendar/services/calendar.service";
import { TransactionService } from "../../transactions/services/transaction.service";
import { ManagerService } from "../../managers/services/managers.service";
import { UploadFileService } from "../../shared/services/upload-file.service";
@Injectable()
export class HotelService {
  hotelsCol: AngularFirestoreCollection<Hotel>;
  hotels: any;

  constructor(
    private afs: AngularFirestore,
    private notification: NotificationService,
    private activityChatService: ActivityChatService,
    private inventoryService: InventoryService,
    private billService: BillService,
    private formService: FormService,
    private vendorService: VendorsService,
    private employeesService: EmployeesService,
    private credentialsService: CredentialsService,
    private calendarService: CalendarService,
    private transactionService: TransactionService,
    private managerService: ManagerService,
    private uploadFileSevice: UploadFileService
  ) {}

  getHotels() {
    this.hotelsCol = this.afs.collection("hotels");
    return this.hotelsCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Hotel;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
  }
  getAdminHotels(adminId) {
    // afs.collection('items', ref => ref.where('size', '==', 'large'))
    this.hotelsCol = this.afs.collection("hotels");
    return this.hotelsCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Hotel;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
  }

  addHotel(hotel) {
    console.log(hotel);
    //hotel.adminId = "Qll6jGpR77N27Ln55PCYEcIWXvr2"
    //hotel.image = "https://firebasestorage.googleapis.com/v0/b/aurumbackend.appspot.com/o/uploads%2FStockUP_Video_Background-min.jpeg?alt=media&token=46f7b892-e35e-421b-9a49-b812db4b7ba8"
    this.afs.collection("hotels").add(hotel);
  }

  getFileName(url: String) {
    let index = url.lastIndexOf("?");
    return url.substring(url.indexOf("%2F") + 3, url.indexOf("?"));
  }
  // deleteBillService(billId) {
  //   let billRef = this.afs.doc(`bills/${billId}`).ref;
  //   billRef
  //     .get()
  //     .then(doc => {
  //       if (doc.exists) {
  //         let data = doc.data();
  //         let fileName = this.getFileName(data.image);
  //         this.uploadFileService
  //           .deleteFileUpload(fileName)
  //           .then(() => billRef.delete());
  //       } else {
  //         console.log("No such document!");
  //       }
  //     })
  //     .catch(function(error) {
  //       console.log("Error getting document:", error);
  //     });
  // }

  deleteHotel(hotelId) {
    let hotelRef = this.afs.doc(`hotels/${localStorage.hotelId}`).ref;
    hotelRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data();
          let fileName = this.getFileName(data.image);
          this.uploadFileSevice
            .deleteFileUpload(fileName)
            .then(() => hotelRef.delete());
        } else {
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
    this.notification.deleteNotifationByHotelId(hotelId);
    this.activityChatService.deleteAllMessageByHotelId(hotelId);
    this.inventoryService.deleteInventoryByHotelId(hotelId);
    this.billService.deleteAllBillsByHotelId(hotelId);
    this.formService.deleteFormByHotelId(hotelId);
    this.vendorService.deleteAllVendorsByHotelId(hotelId);
    this.credentialsService.deleteAllCredentialsByHotelId(hotelId);
    this.employeesService.deleteAllEmployeesByHotelId(hotelId);
    this.calendarService.deleteAllScheduleByHotelId(hotelId);
    this.transactionService.deleteAllTransacationsByHotelId(hotelId);
    this.managerService.deleteAllManagersById(hotelId);
  }
}
