import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";

import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import "rxjs/add/operator/map";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  NgForm
} from "@angular/forms";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import * as firebase from "firebase/app";
import { Observable } from "rxjs/Observable";
/*Interfaces */
import { Inspection } from "./interface/inspection";
import { Hotel } from "../hotels/interfaces/hotel";
// Services
import { DataProcessingService } from "../shared/services/data-processing.service";
import { DataStorageService } from "../shared/services/data-storage.service";
import { AuthService } from "../auth/auth.service";
import { InventoryService } from "../inventory/services/inventory.service";
import { InspectionManager } from "../shared/classes/InspectionManager";
import { HelperService } from "../shared/services/helper.service";

@Component({
  selector: "app-inspection",
  templateUrl: "./inspection.component.html",
  styleUrls: ["./inspection.component.scss"]
})
export class InspectionComponent extends InspectionManager implements OnInit {
  public archiveToggle = true;
  @ViewChild("checkMe")
  checkMe: ElementRef;
  @ViewChild("fname")
  fname: ElementRef;
  constructor(
    public modalService: NgbModal,
    public formBuilder: FormBuilder,
    public dataProcessingService: DataProcessingService,
    public dataStorageService: DataStorageService,
    public inventoryService: InventoryService,
    public datePipe: DatePipe
  ) {
    super(
      modalService,
      formBuilder,
      dataProcessingService,
      dataStorageService,
      datePipe
    );
  }

  dateExists: boolean;
  dateExistsErrorMessage: string;
  ngOnInit() {
    this.inventoryService.getInventories().subscribe(res => {
      this.inventoryItems = HelperService.getItemsByHotelId(res);
      if (!this.inventoryItems) {
        return;
      }
      console.log(this.inventoryItems);
      this.inventoryLabels = [];
      this.inventoryDates = [];
      if (this.inventoryItems.inspection) {
        this.getDates(
          this.inventoryItems.inspection[
            Object.keys(this.inventoryItems.inspection)[0]
          ]
        );
        this.getLabels(this.inventoryItems.inspection);
      }
    });

    this.form = this.formBuilder.group({
      date: [""],
      inventories: this.formBuilder.array([this.createFormInput()])
    });
    console.log(this.form);
  }

  dateChangeOnAdd() {
    let date = this.form.value.date
      ? this.datePipe.transform(this.form.value.date, "yyyy-MM-dd")
      : this.datePipe.transform(new Date(), "yyyy-MM-dd");
    let indexOfItem = this.checkIfDateExist(date);

    if (indexOfItem > -1 && this.currentUser.role == "manager") {
      this.dateExists = true;
      this.dateExistsErrorMessage =
        "The date you selected already exists. Please contact the admin to change it.";
      return;
    }
    this.dateExists = false;
  }
  addItem(item, hotelId) {
    this.inventoryService.addInspection(item, hotelId);
  }

  saveFormInput() {
    if (!this.inventoryItems) {
      this.inventoryItems = {
        inspection: {}
      };
      this.inventoryDates = [];
      this.inventoryService.addNewField();
    }

    if (!this.inventoryItems.inspection) {
      this.inventoryItems.inspection = {};
      this.inventoryDates = [];
    }
    this.form.value.inventories.forEach(item => {
      if (!this.inventoryItems.inspection[item.item])
        this.addNewItem(item.item);
    });

    let date = this.form.value.date
      ? this.datePipe.transform(this.form.value.date, "yyyy-MM-dd")
      : this.datePipe.transform(new Date(), "MM-dd-YYYY");
    let indexOfItem = this.checkIfDateExist(date);

    if (indexOfItem > -1 && this.currentUser.role == "manager") {
      this.dateExists = true;
      this.dateExistsErrorMessage =
        "The date you selected already exists. Please contact the admin to change it.";
      return;
    }

    if (indexOfItem == -1) {
      this.addNewDate(date);
      indexOfItem = this.inventoryDates.length - 1;
    }

    this.form.value.inventories.forEach(item => {
      if (!this.inventoryItems.inspection[item.item]) {
        this.inventoryItems.inspection[item.item] = {
          archive: false,
          data: []
        };
      }
      this.inventoryItems.inspection[item.item].data[indexOfItem].cleaning =
        item.cleaning;
      this.inventoryItems.inspection[item.item].data[indexOfItem].inspector =
        item.inspector;
      this.inventoryItems.inspection[item.item].data[indexOfItem].comments =
        item.comments;
    });

    this.inventoryDates.sort((a, b) => +new Date(b) - +new Date(a));

    this.sortByDate();

    //to reset all add this code
    // this.addItem({
    //        'carolina': [{'date': '2018-06-01', rt: '1', ot: '8',dt: '1', mt: '8'},
    //         {'date': '2018-05-01', rt: '1', ot: '8',dt: '1', mt: '8'}]}, localStorage.hotelId);
    this.addItem(this.inventoryItems.inspection, localStorage.hotelId);
    this.addPropertyModalRef.close();
  }
  addNewItem(name) {
    this.inventoryItems.inspection[name] = {
      archive: false,
      data: []
    };
    this.inventoryDates.forEach(date => {
      this.inventoryItems.inspection[name].data.push({
        date: date,
        cleaning: "",
        inspector: "",
        comments: ""
      });
    });
  }

  updateItem() {
    this.sortByDate();
    this.addItem(this.inventoryItems.inspection, localStorage.hotelId);
  }
  addNewDate(date) {
    this.inventoryDates.push(date);
    for (let key in this.inventoryItems.inspection) {
      this.inventoryItems.inspection[key].data.push({
        date: date,
        cleaning: "",
        comments: "",
        inspector: ""
      });
    }
  }
  updateRooms() {
    this.addItem(this.inventoryItems.inspection, localStorage.hotelId);
  }

  sortByDate() {
    for (let key in this.inventoryItems.inspection) {
      this.inventoryItems.inspection[key].data.sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
      );
    }
    this.getDates(
      this.inventoryItems.inspection[
        Object.keys(this.inventoryItems.inspection)[0]
      ]
    );
  }

  updateItemsByType() {
    this.currentItem = this.inventoryItems.inspection[this.nameOfItem];
  }
  archiveRow() {
    if (localStorage.getItem("table") != null) {
      //  document.getElementsByTagName('input').checked = localStorage.getItem('table');
    }
    let checkboxes = document.getElementsByTagName("input");

    let arr = [];

    console.log("reloaded checkboxes", checkboxes);
    //  let checkboxes = document.getElementsByTagName('input');
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked === true) {
        let table = <HTMLElement>document.getElementById("table");
        checkboxes[i].closest("tr").classList.add("archive");
        table.appendChild(checkboxes[i].closest("tr"));
        arr.push((checkboxes[i].checked = true));
      } else {
        arr.push((checkboxes[i].checked = false));
      }
    }
    localStorage.setItem("table", JSON.stringify(arr));
    console.log("saved states of check boxes", arr);
  }
}
