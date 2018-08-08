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
  NgForm,
 
} from "@angular/forms";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import * as firebase from "firebase/app";
import { Observable } from "rxjs/Observable";
/*Interfaces */
// import { HK } from "./interface/HK";
import { Hotel } from "../hotels/interfaces/hotel";
// Services
import { DataProcessingService } from "../shared/services/data-processing.service";
import { DataStorageService } from "../shared/services/data-storage.service";
import { AuthService } from "../auth/auth.service";
import { CalendarService } from "./services/calendar.service";
import { HelperService } from "../shared/services/helper.service";
import { HKManager } from "../shared/classes/HKManager";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: [ './calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  public archiveToggle = true;
  @ViewChild("checkMe") checkMe: ElementRef;
  @ViewChild("fname") fname: ElementRef;
  constructor(
    public modalService: NgbModal,
    public formBuilder: FormBuilder,
    public dataProcessingService: DataProcessingService,
    public dataStorageService: DataStorageService,
    public calendarService: CalendarService,
    public datePipe: DatePipe

  ) {
    // super(
    //   modalService,
    //   formBuilder,
    //   dataProcessingService,
    //   dataStorageService,
    //   datePipe
    // );
  }

  day:number;
  month:number;
  year:number;
  startDate:number;
  monthes=["", "January", "February", "March", "April", "May", "June", "July", "August","September","Octover", "November", "December"]
  scheduleModalRef:any;
  schedules:any;
  ngOnInit() {
      let today = new Date();
      this.day = today.getDate();
      this.month = today.getMonth()+1;
      this.year = today.getFullYear();
      this.getStartDate();
      this.calendarService.getSchedules(1,1)
      .subscribe( res =>{
          this.schedules = res;
          alert(JSON.stringify(this.schedules))
      });
      alert(JSON.stringify(this.schedules)) 
      console.log(this.schedules)
  }
  getDaysInMonth = (year, month) => {   
   return new Date(year, month, 0).getDate();  
  };
   getExcatDate = (day)=>{
       let days = new Date(this.year, this.month, 0).getDate();
       if(day<1) return new Date(this.year, this.month-1, day).getDate();
       if(day>days) return day-days;
       return day
   }
   onPrev = ()=>{       
       this.month = this.month-1
       if(this.month==0) {
            this.month=12;
            this.year = this.year-1;
        }
      this.getStartDate();

   }

   onNext = ()=>{       
    this.month = this.month+1
    if(this.month==13) {
         this.month=1;
         this.year = this.year+1;
     }
     this.getStartDate();
    }
    
    getStartDate  = ()=> {
        this.startDate =  new Date(this.year, this.month-1, 0).getDay();
        this.startDate = this.startDate*(-1)
        if(this.startDate==-6) this.startDate=1;            
    } 

    createRange(number){
        var items: number[] = [];
        for(var i = 1; i <= number; i++){
           items.push(i);
        }
        return items;
      }
      thisMonthDay = (day)=>{
        if(day<7){
            if (this.getExcatDate(this.startDate+ day) >10) return false;
            return true;
        }
        if(day>28){
            if (this.getExcatDate(this.startDate+ day) <15) return false;
        }
        return true
      }
      createNewSchedule = (day) =>{
          alert(day)
      }
      openSchedulModal = (modal) =>{
        this.scheduleModalRef = this.modalService.open(modal);
        // this.scheduleModalRef.result.then((result) => {
        //     this.closeResult = `Closed with: ${result}`;
        //   }, (reason) => {
        //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        //   });
      }
}
