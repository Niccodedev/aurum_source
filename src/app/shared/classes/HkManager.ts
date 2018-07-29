import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DataProcessingService} from "../services/data-processing.service";
import {DataStorageService} from "../services/data-storage.service";
import {DatePipe} from "@angular/common";
/**
 * Created by User1 on 04.05.2018.
 */


export class HKManager {
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
  currentUser:any;
  currentItem: any;
  openAddModalRef: any;
  dateExists: boolean;
  dateExistsErrorMessage:string;
  constructor(public modalService: NgbModal,
              public formBuilder: FormBuilder,
              public dataProcessingService: DataProcessingService,
              public dataStorageService: DataStorageService,
              public datePipe: DatePipe) {
    this.selectedDate = -1;
    this.dateIndex = 0;
    this.byDate = false;
    this.byType = false;
    this.currentUser = this.dataStorageService.getUser();
    // this.inventoryLabels = [];
    // this.inventoryDates = []
  }


  createFormInput(): FormGroup {
    return this.formBuilder.group({
      item: '',
      dnd: '',
      so: '',
      co: '',
      time: '',
      minso: '',
      minco: '',
      threshold: '',
      variance: ''
    });
  }

  addFormInput() {
    
    const inventory = this.createFormInput();
    this.inventories.push(inventory);
  }

  get inventories(): FormArray {
    return this.form.get('inventories') as FormArray;
  }

  createFormArray(): FormGroup[]{
    
    let formArray = [];   
    if(this.inventoryItems){
      this.inventoryLabels.forEach(label =>{
          if(!this.inventoryItems.hk[label].archive){           
          formArray.push(       
            this.formBuilder.group({
              item:label,
              dnd: '',
              so: '',
              co: '',
              time: '',
              minso: '',
              minco: '',
              threshold: '',
              variance: ''
            })
          )
        }
      })
    }
    if (formArray.length>1) return formArray;
   
    formArray.push(       
      this.formBuilder.group({
        item:'',
        dnd: '',
        so: '',
        co: '',
        time: '',
        minso: '',
        minco: '',
        threshold: '',
        variance: ''
      })
    )
 
    
    return formArray;
  }
 
  recreateForm(){   
    this.form = this.formBuilder.group({
      date:['', Validators.required],
      inventories:this.formBuilder.array(this.createFormArray())
    })    
  }


  openNewProperty(contentNewProperty) {
    this.dateExists = false;
    this.dateExistsErrorMessage="";
    this.recreateForm();
    this.openAddModalRef = this.modalService.open(contentNewProperty);
    this.openAddModalRef.result.then((result) => {
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
    let dates = _dates.data;
    this.dateFrom = dates[dates.length -1].date;
    this.dateTo = dates[0].date;
    this.inventoryDates = [];
    dates.forEach(item => {
      this.inventoryDates.push(item.date);
    });
  }


  dateChangeOnAdd(){  

    let date = this.form.value.date ? this.datePipe.transform(this.form.value.date, 'yyyy-MM-dd'): this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let indexOfItem = this.checkIfDateExist(date);      
    if(indexOfItem>-1  && this.currentUser.role=='manager'){  
      this.dateExists = true;
      this.dateExistsErrorMessage = "The date you selected already exists. Please contact the admin to change it."
      return;
    }
    this.dateExists = false;
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


  addItem(item, hotelId){

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
