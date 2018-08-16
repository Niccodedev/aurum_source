import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DataProcessingService} from "../services/data-processing.service";
import {DataStorageService} from "../services/data-storage.service";
import {DatePipe} from "@angular/common";
/**
 * Created by User1 on 04.05.2018.
 */


export class InspectionManager {
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
  showArchive:boolean;
  addPropertyModalRef:any;
  constructor(public modalService: NgbModal,
              public formBuilder: FormBuilder,
              public dataProcessingService: DataProcessingService,
              public dataStorageService: DataStorageService,  
              public datePipe: DatePipe) {
    this.selectedDate = -1;
    this.dateIndex = 0;
    this.byDate = true;
    this.byType = false;
    this.currentUser = this.dataStorageService.getUser();
    this.showArchive = false;
    
  }


  addFormInput() {
    const inventory = this.createFormInput();
    this.inventories.push(inventory);
  }

  get inventories(): FormArray {
    return this.form.get('inventories') as FormArray;
  }

  openNewProperty(contentNewProperty) {
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      inventories:this.formBuilder.array([])
    })
    this.recreateForm()
    this.addPropertyModalRef = this.modalService.open(contentNewProperty);
    this.addPropertyModalRef.result.then((result) => {
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

  recreateForm(){
    this.inventoryLabels.forEach(
      label=>{
        if(!this.inventoryItems.inspection[label].archive){
          this.inventories.push(
            this.formBuilder.group({
              item: label,
              cleaning:'',
              inspector:'',
              comments:'',              
            })
          )
      }
      }
    )
  }

  createFormInput(): FormGroup {
    return this.formBuilder.group({
      item: '',
      cleaning:'',
      inspector:'',
      comments:'', 
    });
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
