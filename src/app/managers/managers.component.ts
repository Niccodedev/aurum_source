import { Component, EventEmitter, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as firebase from "firebase";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import {
  NgForm,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from "@angular/forms";
// services
import { AuthService } from "../auth/auth.service";
import { HotelService } from "../hotels/services/hotel.service";
import { DataStorageService } from "../shared/services/data-storage.service";
import { HelperService } from "../shared/services/helper.service";
// models
import { Manager } from "./interfaces/manager";
import { DataProcessingService } from "../shared/services/data-processing.service";
import { forEach } from "@angular/router/src/utils/collection";

@Component({
  selector: "app-managers",
  templateUrl: "./managers.component.html",
  styleUrls: ["./managers.component.scss"]
})
export class ManagerComponent implements OnInit {
  closeResult: string;

  managersCol: any;
  managers: Array<any>;

  name: string;
  email: string;
  password: string;

  AdminName: string;
  AdminPassword: string;
  propertyName: string;
  canAddMoreManager: boolean;
  addNewManagerModalRef: any;
  addNewManagerForm: FormGroup;
  addManagerError: string;
  deletePropertyMessage: string;
  deletePropertyNotAuthorized: boolean;
  deletePropertyModalRef: any;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private afs: AngularFirestore,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private hotelSevice: HotelService,
    public dataProcessingService: DataProcessingService,
    public dataStorageService: DataStorageService
  ) {}

  ngOnInit() {
    this.managersCol = this.afs.collection("managers");
    this.afs
      .collection("hotels")
      .doc(localStorage.hotelId)
      .ref.get()
      .then(doc => {
        if (doc.exists) {
          this.dataStorageService.setHotelName(doc.data().name);
          this.dataStorageService.setIsHotel(true);
        } else {
          this.propertyName = "";
        }
      });

    console.log(localStorage.hotelId);
    this.managersCol
      .snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Manager;
          const id = a.payload.doc.id;
          return { id, data };
        });
      })
      .subscribe(res => {
        this.managers = this.dataProcessingService.createArrayOfItemsbyHotelId(
          res
        );
        this.canAddMoreManager = this.managers.length < 3;
        console.log("Managers");
        console.log(this.managers.length);
      });
  }

  addNewManager() {
    let manager: Manager = {
      name: this.addNewManagerForm.controls.name.value,
      email: this.addNewManagerForm.controls.email.value,
      role: "manager",
      hotelId: localStorage.hotelId
    };

    console.log(manager);
    this.authService.signUpNewUser(
      manager,
      this.addNewManagerForm.controls.password.value,
      response => this.addNewManagerModalRef.close(),
      error => (this.addManagerError = error.message)
    );
  }

  open(content) {
    this.deletePropertyNotAuthorized = false;
    this.deletePropertyMessage = "";
    this.deletePropertyModalRef = this.modalService.open(content);
    this.deletePropertyModalRef.result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  openNewUser(canAddMoreManagerModal) {
    this.createAddNewManagerForm();
    this.addNewManagerModalRef = this.modalService.open(canAddMoreManagerModal);
    this.addNewManagerModalRef.result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  createAddNewManagerForm() {
    this.addManagerError = "";
    this.addNewManagerForm = new FormGroup({
      name: new FormControl("", Validators.required),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6)
      ]),
      email: new FormControl("", Validators.required)
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  deleteManager(managerId) {
    this.afs.doc("managers/" + managerId).delete();
  }

  checkAdmin() {
    firebase
      .auth()
      .currentUser.reauthenticateWithCredential(
        firebase.auth.EmailAuthProvider.credential(
          this.AdminName,
          this.AdminPassword
        )
      )
      .then(response => {
        this.deletePropertyNotAuthorized = false;

        this.hotelSevice.deleteHotel(localStorage.hotelId);
      })
      .catch(error => {
        this.deletePropertyMessage = error.message;
        this.deletePropertyNotAuthorized = true;
      });
  }
}
