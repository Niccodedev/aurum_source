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
  FormControl 
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
  monthSchedules:object;
  selectedDaySchedules:object[];
  selectedDay:number;
  form:FormGroup;
  manager:any;
  content:string;
  ngOnInit() {
      this.manager = this.dataStorageService.getUser();
      let today = new Date();
      this.day = today.getDate();
      this.month = today.getMonth()+1;
      this.year = today.getFullYear();
      this.getStartDate();      
      this.calendarService.getSchedules(localStorage.hotelId,this.year,this.month)
      .subscribe( res =>{
          this.monthSchedules = res;
          this.selectedDay = this.day;
          if(this.monthSchedules==null){
              this.monthSchedules = {}
          }
          if(this.monthSchedules.hasOwnProperty(this.selectedDay))
            this.selectedDaySchedules = this.monthSchedules[this.selectedDay]   
          else
            this.selectedDaySchedules = [];

                 
      });    
     
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

      openSchedulModal = (modal) =>{
        this.form = new FormGroup({
            // time: new FormControl('',[Validators.required]),
            content: new FormControl('',[ Validators.required])
        });
        this.scheduleModalRef = this.modalService.open(modal);
        // this.scheduleModalRef.result.then((result) => {
        //     this.closeResult = `Closed with: ${result}`;
        //   }, (reason) => {
        //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        //   });
      }

    showSchedule(day){      
        this.selectedDay = day;
        if (this.monthSchedules.hasOwnProperty(day))
            this.selectedDaySchedules = this.monthSchedules[day]
        else
            this.selectedDaySchedules = []
    }

    saveNewSchedule(){
        this.selectedDaySchedules.push({
            name:this.manager.name,
            content:this.form.value.content
        })
        
        this.monthSchedules[this.selectedDay] = this.selectedDaySchedules;
        this.calendarService.saveSchedules(localStorage.hotelId, this.year, this.month, this.monthSchedules )
        .then(response =>{
            this.scheduleModalRef.close()
            alert("New schedule was created succefully.")
        }).catch( error=>{
            this.selectedDaySchedules = this.selectedDaySchedules.slice(0,-1);
            alert(error)
            this.scheduleModalRef.close()
            
        })

        
    }

    deleteSchedule(index){      
        this.selectedDaySchedules.splice(index,1);  
        this.monthSchedules[this.selectedDay] = this.selectedDaySchedules;
        this.calendarService.saveSchedules(localStorage.hotelId, this.year, this.month, this.monthSchedules )
        .then(response =>{
            this.scheduleModalRef.close()
            alert("The schedule was deleted succefully.")

        }).catch( error=>{
            this.selectedDaySchedules = this.selectedDaySchedules.slice(0,-1);
            alert(error)
            this.scheduleModalRef.close()
            
        })
    }

    canDelete = (time) =>{
        let today = new Date();
       
        if(this.year*400+this.month*32+this.selectedDay < today.getFullYear()*400 + (today.getMonth()+1)*32 + today.getDate()){
           return false;
        }
        return true;
    }

    canCreate = () => {
        let today = new Date();
        if(this.year*400+this.month*32+this.selectedDay < today.getFullYear()*400 + (today.getMonth()+1)*32 + today.getDate()){
            return false;
        }
        return true;
    }

    getScheduleList(_day1, _day2, _day3){
        let day = this.getExcatDate(_day1+ _day2+_day3);
        if(this.monthSchedules==null) {
            this.monthSchedules = {};
        }
        if(!this.monthSchedules.hasOwnProperty(day)){
            return [];
        }
        let returnSchedules = [];
        let daySchedules = this.monthSchedules[day]
        for(let i =0; i < daySchedules.length; i++){
            returnSchedules.push({name:daySchedules[i].name, content: daySchedules[i].content.substring(0,15)});
        }
        if (returnSchedules.length >4) {
            return returnSchedules.slice(0,3)
        }          
        
        return returnSchedules;
        
        

    }

    showMore = (_day) => {
        let day = this.getExcatDate(_day)       
        if(this.monthSchedules==null) {
            this.monthSchedules = {};
        }
        if(!this.monthSchedules.hasOwnProperty(day)){
            return false;
        }
        let daySchedules = this.monthSchedules[day]
        return daySchedules.length > 4;
    }

}
