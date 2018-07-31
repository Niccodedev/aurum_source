import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import 'rxjs/add/operator/map';
/*Interfaces */
import {Transaction} from "../interfaces/transaction";
// Services
import {TransactionService} from '../services/transaction.service';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "angularfire2/firestore";
import {DataProcessingService} from "../../shared/services/data-processing.service";
import {DataStorageService} from "../../shared/services/data-storage.service";
import * as firebase from "firebase/app";
import {DatePipe} from "@angular/common";
import {HelperService} from "../../shared/services/helper.service";
/*import Transaction = firebase.firestore.Transaction;*/


@Component({
  selector: 'app-transactions-date',
  templateUrl: './transactions-date.component.html',
  styleUrls: ['./transactions-date.component.scss']
})
export class TransactionsDateComponent implements OnInit {
    public archiveToggle = true;

  closeResult: string;
  form: FormGroup;


  inventoryItems: any;
  inventoryLabels: Array<any>;
  inventoryDates: Array<any>;

  hotelId: string;

  dateOfItem: any;
  dateIndex: any;
  nameOfItem: any;
  dateFrom: any;
  dateTo: any;

  byDate: boolean;
  byType: boolean;

  currentItem: any;
  currentUser: any;

  editingColumnNumber: number;
  addItemModalRef: any;
  
  dateExists:boolean;
  dateExistsErrorMessage: string;
  showArchive:boolean;
  constructor(public modalService: NgbModal,
              public formBuilder: FormBuilder,
              public dataProcessingService: DataProcessingService,
              public dataStorageService: DataStorageService,
              public datePipe: DatePipe,
              public transactionService: TransactionService) {

    this.dateIndex = 0;
    this.byDate = true;
    this.byType = false;
  }

  ngOnInit() {
      this.currentUser = this.dataStorageService.getUser();
      console.log(this.currentUser);
      this.inventoryLabels = [];
      this.inventoryDates = [];
      this.transactionService.getTransactions().subscribe(res => {
      this.inventoryItems = HelperService.getItemsByHotelId(res)
      if(!this.inventoryItems) {
        return;
      }
 
      this.getDates(this.inventoryItems[Object.keys(this.inventoryItems)[0]]);
      this.getLabels(this.inventoryItems);
      this.showArchive = false;
    });

   
  }

 

  addItem(item,hotelId){
    this.transactionService.addTransaction(item, hotelId);
  }

  dateChangeOnAdd(){
    let date = this.form.value.date ? this.datePipe.transform(this.form.value.date, 'yyyy-MM-dd') : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let indexOfItem = this.checkIfDateExist(date);

    
    if(indexOfItem>-1  && this.currentUser.role=='manager'){
      this.dateExists = true;
      this.dateExistsErrorMessage = "The date you selected already exists. Please contact the admin to change it."
      return;
    }
    this.dateExists = false;
  }

  saveFormInput() { 
    if(!this.inventoryItems) {
      this.inventoryItems = {}
      this.inventoryDates = [];
      // this.transactionService.addNewField();
    }

    if(!this.inventoryItems[Object.keys(this.inventoryItems)[0]]) {
      this.inventoryDates = [];
    }

    this.form.value.inventories.forEach(item => {
      console.log(item.item)
      console.log("ehll")
      if (!this.inventoryItems[item.item] && item.item!='') this.addNewItem(item.item);
    });
    this.inventoryLabels = []
    this.getLabels(this.inventoryItems);


    let date = this.form.value.date ? this.datePipe.transform(this.form.value.date, 'yyyy-MM-dd') : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let indexOfItem = this.checkIfDateExist(date);

    
    if(indexOfItem>-1  && this.currentUser.role=='manager'){
      this.dateExists = true;
      this.dateExistsErrorMessage = "The date you selected already exists. Please contact the admin to change it."
      return;
    }
    if (indexOfItem == -1) {
      this.addNewDate(date);
      indexOfItem = this.inventoryDates.length - 1;
    }

    this.form.value.inventories.forEach(item => {
      this.inventoryItems[item.item]['data'][indexOfItem].price = item.price;
      
    });
    
    this.inventoryDates.sort((a, b) => +new Date(b) - +new Date(a));

    this.sortByDate();
    this.addItem(this.inventoryItems, localStorage.hotelId);
    this.addItemModalRef.close();
  }
  addNewItem(name) {
    if (!this.inventoryItems[name]){
      // this.inventoryItems[name]['data'] = []
      this.inventoryItems[name] = {
        archive:false,
        data:[]
      }
    }
    this.inventoryDates.forEach(date => {
        this.inventoryItems[name].data.push({
        date: date,
        price: ""
      })
     
    })
      }

  addNewDate(date) {
     this.inventoryDates.push(date)
    for (let key in this.inventoryItems) {
      this.inventoryItems[key].data.push({
        date: date,
        price: ""
      })
    }
  }
  updateRooms() {
    this.addItem(this.inventoryItems, localStorage.hotelId);
  }
updateItem() {
   this.sortByDate();
    this.addItem(this.inventoryItems, localStorage.hotelId);
}

sortByDate() {
  for (let key in this.inventoryItems) {
    // this.inventoryItems[key].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    this.inventoryItems[key].data.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }
  this.getDates(this.inventoryItems[Object.keys(this.inventoryItems)[0]]);
}

  updateItemsByType() {
    this.currentItem = this.inventoryItems[this.nameOfItem];
  }




  getLabels(items) {
    this.inventoryLabels = []
    for (let key in items) {
      this.inventoryLabels.push(key);
    }
  }

  checkIfDateExist(date) {
    return this.inventoryDates.indexOf(date);
  }

  getDates(_data) {
    if(!_data) return;
    let dates = _data.data
    this.dateFrom = dates[dates.length -1].date;
    this.dateTo = dates[0].date;
    this.inventoryDates = [];
    dates.forEach(item => {
      this.inventoryDates.push(item.date);
    });
  }

// FILTER
  updateItemsByDate() {
    this.dateIndex = this.inventoryDates.indexOf(this.dateOfItem);
  }


  changeTable(type) {
    switch (type) {
      case "date":
        this.byDate = true;
        this.byType = false;
        break;
      case "type":
        this.byDate = false;
        this.byType = true;
    }
  }

  dismissAddItemModal(){
    this.addItemModalRef.close();
  }
  openNewProperty(contentNewProperty) {
    this.dateExists = false;
    console.log(this.inventoryLabels)
    this.createDailyTransactionForm()
    console.log(this.form);
    this.addItemModalRef = this.modalService.open(contentNewProperty)
    this.addItemModalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  archiveRow() {
    if(localStorage.getItem('table')!= null){
        // document.getElementsByTagName('input[type=checkbox]').checked = localStorage.getItem('table');

    }  
    let checkboxes = document.getElementsByTagName('input');

    let arr = [];

console.log('reloaded checkboxes', checkboxes);
//  let checkboxes = document.getElementsByTagName('input');
    for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked === true) {
     let table = <HTMLElement>document.getElementById('table');
      checkboxes[i].closest('tr').classList.add('archive');
      table.appendChild(checkboxes[i].closest('tr'));
arr.push(checkboxes[i].checked=true);
    } else {
arr.push(checkboxes[i].checked=false);
}
    }localStorage.setItem('table', JSON.stringify(arr));
    console.log('saved states of check boxes',arr);
}

setEditingColumn(editingColumnNumber){
  this.editingColumnNumber = editingColumnNumber;
  console.log(editingColumnNumber);
}

createDailyTransactionForm(){
  this.form = this.formBuilder.group({
    date: ['', Validators.required],
    inventories: this.formBuilder.array(this.createFormInput())
  });
}

createFormInput(): FormGroup[] {
  let formgrouparray = [];
  
  this.inventoryLabels.forEach(
    label => {
      if(!this.inventoryItems[label].archive){
        formgrouparray.push(this.formBuilder.group({
          item:label,
          price:''
        }))
    }
    }
  )
  return formgrouparray;
}
reCeateFormInput(): FormGroup[] {
  let formgrouparray = [];
  
  this.form.value.inventories.forEach(
    inventory => {
      console.log(inventory);
      formgrouparray.push(this.formBuilder.group({
        item:inventory.item,
        price:inventory.price
      }))
    }
  )
  formgrouparray.push(this.formBuilder.group({
    item:'',
    price:''
  }))

  return formgrouparray;
}
 addItemInput(){
  console.log("hello, you are adding item")
  this.form = this.formBuilder.group({
    date: [this.form.controls.date.value, Validators.required],
    inventories: this.formBuilder.array(this.reCeateFormInput())
  });
 }
} 
