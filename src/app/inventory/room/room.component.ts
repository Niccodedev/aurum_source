import {Component, ViewChild, ElementRef , OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import 'rxjs/add/operator/map';
import {FormArray, FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {AngularFirestore} from "angularfire2/firestore";
import {DataProcessingService} from "../../shared/services/data-processing.service";
import {DataStorageService} from "../../shared/services/data-storage.service";
import {InventoryService} from "../services/inventory.service";
import {DatePipe} from "@angular/common";
import {InventoryManeger} from "../../shared/classes/InventoryMenager"
import {HelperService} from "../../shared/services/helper.service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})

export class RoomComponent extends InventoryManeger implements OnInit {
  public archiveToggle = true;
   @ViewChild('checkMe') checkMe: ElementRef;
     @ViewChild('fname') fname: ElementRef;
  constructor(public modalService: NgbModal,
              public formBuilder: FormBuilder,
              public dataProcessingService: DataProcessingService,
              public dataStorageService: DataStorageService,
              public inventoryService: InventoryService,
              public datePipe: DatePipe) {
    super(modalService, formBuilder, dataProcessingService, dataStorageService, datePipe);
  }

  key:string;
  keyTitle:string;
  ngOnInit() {

    this.inventoryService.getInventories().subscribe(res => {
      this.inventoryItems = HelperService.getItemsByHotelId(res);
      if (!this.inventoryItems) {
        return;
      }
              //   this.inventoryItems.data.room = {
        // 'brush': [{'date': '2018-06-01', have: '1', need: '8'}, {
        //   'date': '2018-03-01', have: '1', need: '8'
        // }]};
        // JSON.stringify(this.inventoryItems.room);
      this.key = 'room';
      this.keyTitle= 'Room';
      this.inventoryLabels = [];
      this.inventoryDates = [];
      this.inventoryLabels = [];
      if(this.inventoryItems[this.key]) {
        this.getDates(this.inventoryItems[this.key][Object.keys(this.inventoryItems[this.key])[0]]);
        this.getLabels(this.inventoryItems[this.key]);
      }
    });
    this.form = this.formBuilder.group({
      date: [''],
      inventories: this.formBuilder.array([this.createFormInput()])
    });
    console.log(this.form);
  }

  addItem(item, hotelId) {
    this.inventoryService.addInventory(item, hotelId, this.key);
  }

  saveFormInput() {
    if (!this.inventoryItems) {
      this.inventoryItems = {
        [this.key]: {}
      };
      this.inventoryDates = [];
      this.inventoryService.addNewField();
    }

    if (!this.inventoryItems[this.key]) {
      this.inventoryDates = [];
      this.inventoryItems[this.key] = {}
    }

    this.form.value.inventories.forEach(item => {

      if (!this.inventoryItems[this.key][item.item] && item.item!='') 
        this.addNewItem(item.item);
    });

    
    
    let date = this.form.value.date ? this.datePipe.transform(this.form.value.date, 'yyyy-MM-dd') : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let indexOfItem = this.checkIfDateExist(date);

    if (indexOfItem == -1) {
      this.addNewDate(date);
      indexOfItem = this.inventoryDates.length - 1;
    }

    this.form.value.inventories.forEach(item => {
      if(item.item!=''){
        this.inventoryItems[this.key][item.item].data[indexOfItem].need = item.need;
        this.inventoryItems[this.key][item.item].data[indexOfItem].have = item.have;
      }
    });

    this.inventoryDates.sort((a, b) => +new Date(b) - +new Date(a));

    this.sortByDate();
     // this.addItem({
    //      'toner': [{'date': '2018-06-01', have: '1', need: '8'}, {
    //        'date': '2018-03-01', have: '1', need: '8'
    //      }]}, localStorage.hotelId);
    this.addItem(this.inventoryItems[this.key], localStorage.hotelId);
    this.addNewInventoryModalRef.close()
  }

  addNewItem(name) {
    this.inventoryItems[this.key][name] = {
      archive: false,
      data:[]
    };
    this.inventoryDates.forEach(date => {
      this.inventoryItems[this.key][name].data.push({
        date: date,
        have: "",
        need: ""
      })
    }) 
  }

updateItem() {
   this.sortByDate();
    this.addItem(this.inventoryItems[this.key], localStorage.hotelId);
}

  addNewDate(date) {
    this.inventoryDates.push(date);
    for (let key in this.inventoryItems[this.key] ){
      this.inventoryItems[this.key][key].data.push({
        date: date,
        have: "",
        need: ""
      })
    }
  }
  updateRooms() {
      console.log("find a way to update the dom with archived rows");

    this.addItem(this.inventoryItems[this.key], localStorage.hotelId);
  }

  sortByDate() {
   
    console.log("sortByDate")
    console.log(this.inventoryItems[this.key])
    for (let key in this.inventoryItems[this.key]) {
      this.inventoryItems[this.key][key].data.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }
    console.log(this.inventoryItems[this.key])
    this.getDates(this.inventoryItems[this.key][Object.keys(this.inventoryItems[this.key])[0]]);
  }

  updateItemsByType() {
    this.currentItem = this.inventoryItems[this.key][this.nameOfItem];
    console.log(this.inventoryItems[this.key])
  }

//   archiveRow() {
//     if(localStorage.getItem('table')!= null){
//         // document.getElementsByTagName('input').checked = localStorage.getItem('table');

//     }  
//     let checkboxes = document.getElementsByTagName('input');

//     let arr = [];

// console.log('reloaded checkboxes', checkboxes);
// //  let checkboxes = document.getElementsByTagName('input');
//     for (let i = 0; i < checkboxes.length; i++) {
//     if (checkboxes[i].checked === true) {
//      let table = <HTMLElement>document.getElementById('table');
//       checkboxes[i].closest('tr').classList.add('archive');
//       table.appendChild(checkboxes[i].closest('tr'));
// arr.push(checkboxes[i].checked = true);
//     } else {
// arr.push(checkboxes[i].checked = false);
// }
//     }localStorage.setItem('table', JSON.stringify(arr));
//     console.log('saved states of check boxes', arr);
// }


}
