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
import { HK } from "./interface/HK";
import { Hotel } from "../hotels/interfaces/hotel";
// Services
import { DataProcessingService } from "../shared/services/data-processing.service";
import { DataStorageService } from "../shared/services/data-storage.service";
import { AuthService } from "../auth/auth.service";
import { InventoryService } from "../inventory/services/inventory.service";
import { HelperService } from "../shared/services/helper.service";
import { HKManager } from "../shared/classes/HKManager";

@Component({
  selector: "app-hk",
  templateUrl: "./hk.component.html",
  styleUrls: ["./hk.component.scss"]
})
export class HKComponent extends HKManager implements OnInit {
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

  showArchive: boolean;
  ngOnInit() {
    this.showArchive = false;
    this.byDate = true;
    this.inventoryLabels = [];
    this.inventoryService.getInventories().subscribe(res => {
      this.inventoryItems = HelperService.getItemsByHotelId(res);
      if (!this.inventoryItems) {
        return;
      }

      if (!this.inventoryItems) {
        this.inventoryDates = [];
      } else if (this.inventoryItems.hk) {
        this.getDates(
          this.inventoryItems.hk[Object.keys(this.inventoryItems.hk)[0]]
        );
        this.getLabels(this.inventoryItems.hk);
      } else {
        this.inventoryDates = [];
      }
    });

    this.form = this.formBuilder.group({
      date: [""],
      inventories: this.formBuilder.array([this.createFormInput()])
    });
    console.log(this.form);
  }

  addItem(item, hotelId) {
    this.inventoryService.addHK(item, hotelId);
  }

  getMinso(date) {
    let length = Object.keys(this.inventoryItems.hk).length;
    for (let j = 0; j < length; j++) {
      let data = this.inventoryItems.hk[Object.keys(this.inventoryItems.hk)[j]]
        .data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].date == date) {
          if (date[i].minso != "" && data[i].co != "") {
            return {
              minso: data[i].minso,
              minco: data[i].minco
            };
          }
        }
      }
    }
  }

  saveFormInput() {
    let minco = (<HTMLInputElement>document.getElementById("minco")).value;
    alert(minco);
    let minso = (<HTMLInputElement>document.getElementById("minso")).value;

    let _date = (<HTMLInputElement>document.getElementById("date")).value;
    alert(_date);
    if (!minco) return;
    if (!minso) return;
    if (!_date) return;

    if (!this.inventoryItems || !this.inventoryItems.hk) {
      this.inventoryItems = {
        hk: {}
      };
      this.inventoryDates = [];
      this.inventoryService.addNewField();
    }

    this.form.value.inventories.forEach(item => {
      if (!this.inventoryItems.hk[item.item]) this.addNewItem(item.item);
    });

    let date = _date
      ? this.datePipe.transform(_date, "yyyy-MM-dd")
      : this.datePipe.transform(new Date(), "MM-dd-YYYY");
    let indexOfItem = this.checkIfDateExist(date);

    if (indexOfItem == -1) {
      this.addNewDate(date);
      indexOfItem = this.inventoryDates.length - 1;
    }
    // let minco = this.form.value.inventories[0].minco;
    // let minso = this.form.value.inventories[0].minso;

    this.form.value.inventories.forEach(item => {
      this.inventoryItems.hk[item.item].data[indexOfItem].dnd = item.dnd;
      this.inventoryItems.hk[item.item].data[indexOfItem].so = item.so;
      this.inventoryItems.hk[item.item].data[indexOfItem].co = item.co;
      this.inventoryItems.hk[item.item].data[indexOfItem].time = item.time;
      this.inventoryItems.hk[item.item].data[indexOfItem].minso = minso;
      this.inventoryItems.hk[item.item].data[indexOfItem].minco = minco;
    });

    this.inventoryDates.sort((a, b) => +new Date(b) - +new Date(a));

    this.sortByDate();
    this.addItem(this.inventoryItems.hk, localStorage.hotelId);
    this.openAddModalRef.close();
    return false;
  }
  addNewItem(name) {
    this.inventoryItems.hk[name] = {
      archive: false,
      data: []
    };
    this.inventoryDates.forEach(date => {
      this.inventoryItems.hk[name].data.push({
        date: date,
        dnd: "",
        so: "",
        co: "",
        minso: "",
        minco: "",
        time: ""
      });
    });
  }
  updateItem() {
    this.sortByDate();
    this.addItem(this.inventoryItems.hk, localStorage.hotelId);
  }
  addNewDate(date) {
    this.inventoryDates.push(date);
    for (let key in this.inventoryItems.hk) {
      this.inventoryItems.hk[key].data.push({
        date: date,
        dnd: "",
        so: "",
        co: "",
        minso: "",
        minco: ""
      });
    }
  }
  updateRooms() {
    this.addItem(this.inventoryItems.hk, localStorage.hotelId);
  }

  sortByDate() {
    for (let key in this.inventoryItems.hk) {
      this.inventoryItems.hk[key].data.sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
      );
    }
    this.getDates(
      this.inventoryItems.hk[Object.keys(this.inventoryItems.hk)[0]]
    );
  }

  updateItemsByType() {
    this.currentItem = this.inventoryItems.hk[this.nameOfItem];
  }
  archiveRow() {
    if (localStorage.getItem("table") != null) {
      //  document.getElementsByTagName('input').checked = localStorage.getItem('table');
    }
    let checkboxes = document.getElementsByTagName("input");
    let arr = [];
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
