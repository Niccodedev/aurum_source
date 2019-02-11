import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
// Interfaces
import { Employee } from "../interfaces/employee";
import { Hotel } from "../../hotels/interfaces/hotel";
// Services
import { HelperService } from "../../shared/services/helper.service";
import { DataStorageService } from "../../shared/services/data-storage.service";

@Injectable()
export class EmployeesService {
  employeesCol: AngularFirestoreCollection<Employee>;
  employees: any;
  constructor(
    private afs: AngularFirestore,
    private dataStorageService: DataStorageService,
    private db: AngularFireDatabase
  ) {}

  getEmployees() {
    this.employeesCol = this.afs.collection("employees");
    return this.employeesCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Employee;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
  }

  addEmployee(employee) {
    /*this.afs.collection('vendors').doc(hotelId).set(vendor);*/
    this.afs.collection("employees").add(employee);
  }

  deleteAllEmployeesByHotelId(hotelId) {
    this.afs
      .collection("employees", ref => ref.where("htId", "==", hotelId))
      .snapshotChanges()
      .forEach(docs => {
        docs.forEach(_doc => {
          this.afs.doc(`employees/${_doc.payload.doc.id}`).delete();
        });
      });
  }
}
