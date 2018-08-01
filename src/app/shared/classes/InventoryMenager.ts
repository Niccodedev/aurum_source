import {FormArray, FormBuilder, FormGroup, Form, Validators} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DataProcessingService} from "../services/data-processing.service";
import {DataStorageService} from "../services/data-storage.service";
import {DatePipe} from "@angular/common";
/**
 * Created by User1 on 04.05.2018.
 */


export class InventoryManeger {
  closeResult: string;
  form: FormGroup ;


  inventoryItems: any;
  inventoryLabels: Array<any>;
  inventoryDates: Array<any>;
  selectedDate: number;

  hotelId: string;

  dateOfItem: any;
  dateIndex: any;
  nameOfItem: any;
  dateFrom: any;
  dateTo: any;

  byDate: boolean;
  byType: boolean;

  currentItem: any;
  addNewInventoryModalRef: any;
  currentEditingColNumber: number;
  showArchive:boolean;
  currentUser:any;
  dateExists: boolean;
  dateExistsErrorMessage:string;
  constructor(public modalService: NgbModal,
              public formBuilder: FormBuilder,
              public dataProcessingService: DataProcessingService,
              public dataStorageService: DataStorageService,
              public datePipe: DatePipe) {
    this.selectedDate = -1;
    this.dateIndex = 0;
    this.byDate = true;
    this.byType = false;
    this.currentEditingColNumber = -1;
    this.showArchive = false;
    this.currentUser = this.dataStorageService.getUser();
  }


  createFormInput(): FormGroup {
    return this.formBuilder.group({
      item: '',
      have: '',
      need: ''  
    });
  }

  setCurrentEditingColNumber(i){
    this.currentEditingColNumber = i;
  }
  addFormInput() {
    let inventory = this.createFormInput();
    this.inventories.push(inventory);
  }

  get inventories(): FormArray {
    return this.form.get('inventories') as FormArray;
  }

  createFormArray(key){
    let formArray = [];   
        this.inventoryLabels.forEach(label =>{
           if(!this.inventoryItems[key][label].archive){           
            formArray.push(       
              this.formBuilder.group({
                item:label,
                need:'',
                have:''
              })
            )
          }
        })
    
    return formArray;
  }
  recreateForm(key){   
        this.form = this.formBuilder.group({
          date:['', Validators.required],
          inventories:this.formBuilder.array(this.createFormArray(key))
        })      
      
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

  openNewProperty(contentNewProperty, key) {
    this.dateExists = false;
    this.dateExistsErrorMessage="";
    this.recreateForm(key)
    this.addNewInventoryModalRef = this.modalService.open(contentNewProperty);
    this.addNewInventoryModalRef.result.then((result) => {
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

  getDates(_dates) {
    if(!_dates) return;
    let dates = _dates.data
    this.dateFrom = dates[dates.length -1].date;
    this.dateTo = dates[0].date;
    this.inventoryDates = [];
    dates.forEach(item => {
      this.inventoryDates.push(item.date);
    });
  }


  getLabels(items) {
    for (let key in items) {
      this.inventoryLabels.push(key);
    }
  }

  checkIfDateExist(date) {
    return this.inventoryDates.indexOf(date);
  }


  addItem(item,hotelId){

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
}
