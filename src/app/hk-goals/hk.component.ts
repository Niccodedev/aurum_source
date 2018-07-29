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
  @ViewChild("checkMe") checkMe: ElementRef;
  @ViewChild("fname") fname: ElementRef;
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
      
      if(!this.inventoryItems){
        this.inventoryDates = []
      
      }
      else if(this.inventoryItems.hk){
      this.getDates(
        this.inventoryItems.hk[Object.keys(this.inventoryItems.hk)[0]]);      
        this.getLabels(this.inventoryItems.hk);
      }else{
        this.inventoryDates=[]
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
 
  getMinso(date){
    let data = this.inventoryItems.hk[Object.keys(this.inventoryItems.hk)[0]].data;
    for(let i = 0; i< data.length; i++){      
        if(data[i].date == date ){
          return {
            minso: data[i].minso,
            minco: data[i].minco
        }
     }
    }
  }
  saveFormInput() {
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
 
    let date = this.form.value.date
      ? this.datePipe.transform(this.form.value.date, "yyyy-MM-dd")
      : this.datePipe.transform(new Date(), "MM-dd-YYYY");
    let indexOfItem = this.checkIfDateExist(date);
   
    if (indexOfItem == -1) {
      this.addNewDate(date);
      indexOfItem = this.inventoryDates.length - 1;
    }
    let minco = this.form.value.inventories[0].minco/60;
    let minso = this.form.value.inventories[0].minso/60;
 
    this.form.value.inventories.forEach(item => {           
      this.inventoryItems.hk[item.item].data[indexOfItem].dnd = item.dnd;
      this.inventoryItems.hk[item.item].data[indexOfItem].so = item.so;
      this.inventoryItems.hk[item.item].data[indexOfItem].co = item.co;
      this.inventoryItems.hk[item.item].data[indexOfItem].time = item.time;
      this.inventoryItems.hk[item.item].data[indexOfItem].minso = minso;
      this.inventoryItems.hk[item.item].data[indexOfItem].minco = minco;
      this.inventoryItems.hk[item.item].data[indexOfItem].threshold =
        // item.minso * item.so + item.minco * item.co - item.minso * item.dnd;
       minso*item.so + minco*item.minco - minso*item.dnd;
      this.inventoryItems.hk[item.item].data[indexOfItem].variance =
        // item.threshold - item.time;
        this.inventoryItems.hk[item.item].data[indexOfItem].threshold - item.time;
    });

    this.inventoryDates.sort((a, b) => +new Date(b) - +new Date(a));

    this.sortByDate();  

    //to reset all add this code
    // this.addItem({
    //        'carolina': [{'date': '2018-06-01', dnd: '1', so: '8',co: '1', time: '8',minso: '2', minco: '3'},
    //         {'date': '2018-05-01',dnd: '1', so: '8',co: '1', time: '8',minso: '2', minco: '3'}]}, localStorage.hotelId);
    this.addItem(this.inventoryItems.hk, localStorage.hotelId);
    this.openAddModalRef.close()
  }
  addNewItem(name) {
    this.inventoryItems.hk[name] = {
      archive:false,
      data:[]
    };
    this.inventoryDates.forEach(date => {
      this.inventoryItems.hk[name].data.push({
        date: date,
        dnd: "",
        so: "",
        co: "",
        minso: "",
        minco: "",
        time: "",
        threshold: "",
        variance: ""
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
        minco: "",
        threshold: "",
        variance: ""
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


//To be removed in production 


// import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
// import { Router } from "@angular/router";
// import { DatePipe } from "@angular/common";

// import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
// import "rxjs/add/operator/map";
// import {
//   FormArray,
//   FormBuilder,
//   FormGroup,
//   Validators,
//   NgForm
// } from "@angular/forms";
// import {
//   AngularFirestore,
//   AngularFirestoreDocument
// } from "angularfire2/firestore";
// import * as firebase from "firebase/app";
// import { Observable } from "rxjs/Observable";
// /*Interfaces */
// import { HK } from "./interface/HK";
// import { Hotel } from "../hotels/interfaces/hotel";
// // Services
// import { DataProcessingService } from "../shared/services/data-processing.service";
// import { DataStorageService } from "../shared/services/data-storage.service";
// import { AuthService } from "../auth/auth.service";
// import { HelperService } from "../shared/services/helper.service";
// import { HKManager } from "../shared/classes/HKManager";
// import {HKService} from './services/hk.service';
// @Component({
//   selector: "app-hk",
//   templateUrl: "./hk.component.html",
//   styleUrls: ["./hk.component.scss"]
// })
// export class HKComponent extends HKManager implements OnInit {
//   /*closeResult: string;
//   form: FormGroup;
//   name: string;
//   dnd: any;
//   so: any;
//   min: any;*/

//   constructor(private router: Router,
//               public modalService: NgbModal,
//               public formBuilder: FormBuilder,
//               private afs: AngularFirestore,
//               public dataProcessingService: DataProcessingService,
//               public dataStorageService: DataStorageService,
//               private hkService: HKService,
//               public datePipe: DatePipe) {
//     super(modalService, formBuilder, dataProcessingService, dataStorageService, datePipe);
//   }

//   ngOnInit() {
//     this.hkService.getHousekeepings().subscribe(res => {
//       this.housekeepingItems = res[0].data;
//       this.housekeepingLabels = [];
//       this.getDates(this.housekeepingItems.housekeeping[Object.keys(this.housekeepingItems.housekeeping)[0]]);
//       this.getLabels(this.housekeepingItems.housekeeping);
//     });

//     this.form = this.formBuilder.group({
//       date: [''],
//       housekeepings: this.formBuilder.array([this.createFormInput()])
//     });
//     console.log(this.form);
//   }

//   /*createFormInput(): FormGroup {
//     return this.formBuilder.group({
//       name: '',
//       dnd: '',
//       so: '',
//       min: ''
//     });
//   }*/

//   /* addFormInput() {
//      const goal = this.createFormInput();
//      this.goals.push(goal);
//    }
//    get goals(): FormArray {
//      return this.form.get('goals') as FormArray;
//    }
//    saveFormInput() {
//      console.log(this.form.value);
//    }*/

//   addItem(item, hotelId) {
//     this.hkService.addHousekeeping(item, hotelId);
//   }

//   saveFormInput() {

//     this.form.value.housekeepings.forEach(item => {
//       if (!this.housekeepingItems.housekeeping[item.item]) this.addNewItem(item.item);
//     });


//     let date = this.form.value.date ? this.datePipe.transform(this.form.value.date, 'yyyy-MM-dd') : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
//     let indexOfItem = this.checkIfDateExist(date);


//     if (indexOfItem == -1) {
//       this.addNewDate(date);
//       indexOfItem = this.housekeepingDates.length - 1;
//     }

//     this.form.value.housekeepings.forEach(item => {
//       this.housekeepingItems.housekeeping[item.item][indexOfItem].dnd = item.dnd;
//       this.housekeepingItems.housekeeping[item.item][indexOfItem].so = item.so;
//       this.housekeepingItems.housekeeping[item.item][indexOfItem].min = item.min;
//     });

//     this.housekeepingDates.sort((a, b) => +new Date(b) - +new Date(a));

//     this.sortByDate();
//     this.addItem(this.housekeepingItems.housekeeping, localStorage.hotelId);
//   }

//   addNewItem(name) {
//     console.log(name);
//     this.housekeepingItems.housekeeping[name] = [];
//     this.housekeepingDates.forEach(date => {
//       this.housekeepingItems.housekeeping[name].push({
//         date: date,
//         dnd: "",
//         so: "",
//         min: ""
//       })
//     })
//   }

//   addNewDate(date) {
//     this.housekeepingDates.push(date);
//     for (let key in this.housekeepingItems.housekeeping) {
//       this.housekeepingItems.housekeeping[key].push({
//         date: date,
//         dnd: "",
//         so: "",
//         min: ""
//       })
//     }
//   }

//   updateHousekeepings() {
//     this.addItem(this.housekeepingItems.housekeeping, localStorage.hotelId);
//   }

//   sortByDate() {
//     for (let key in this.housekeepingItems.housekeeping) {
//       this.housekeepingItems.housekeeping[key].sort((a, b) => +new Date(b.date) - +new Date(a.date));
//     }
//     this.getDates(this.housekeepingItems.housekeeping[Object.keys(this.housekeepingItems.housekeeping)[0]]);
//   }

//   updateItemsByType() {
//     this.currentItem = this.housekeepingItems.housekeeping[this.nameOfItem];
//   }


//   /*addNewGoal() {
//     let goal: Goal = {
//       name: this.name,
//       dnd: this.dnd,
//       so: this.so,
//       min: this.min,
//       hotelId: localStorage.hotelId
//     };*/
//   /*console.log(transaction);
//   this.afs.collection('transactions').add(transaction);
//   }*/

//   /*popup*/
//   /* openNewProperty(contentNewProperty) {
//      this.modalService.open(contentNewProperty).result.then((result) => {
//        this.closeResult = `Closed with: ${result}`;
//      }, (reason) => {
//        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
//      });
//    }
//    private getDismissReason(reason: any): string {
//      if (reason === ModalDismissReasons.ESC) {
//        return 'by pressing ESC';
//      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
//        return 'by clicking on a backdrop';
//      } else {
//        return  `with: ${reason}`;
//      }
//    }*/


// }
