import { Component, OnInit } from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import { Observable} from "rxjs/Observable";
import { NgForm, FormBuilder, Validators } from '@angular/forms';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
/*Interfaces*/
import { Employee } from '../interfaces/employee';
import {Hotel} from '../../hotels/interfaces/hotel';
/*Services*/
import { EmployeesService } from '../services/employees.service';
import {AuthService} from '../../auth/auth.service';
import {DataStorageService} from "../../shared/services/data-storage.service";
import {HelperService} from "../../shared/services/helper.service";
import {DataProcessingService} from "../../shared/services/data-processing.service";


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  closeResult: string;

  employees: any;
  hotel: Observable<Hotel>;

  name: string;
  phone: any;
  email: string;
  hotelId: any;
  addModalRef: any;
  constructor(private router: Router,
              private modalService: NgbModal,
              private afs: AngularFirestore,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private employeeService: EmployeesService,
              public dataProcessingService: DataProcessingService) { }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(res => {
      this.employees = this.dataProcessingService.createArrayOfItemsbyHotelId2(res);
    });
  }

  addNewEmployee(form: NgForm) {
    console.log(form.value);
    this.hotelId = localStorage.hotelId;
    form.value.htId = this.hotelId;
    console.log(form.value);
    this.employeeService.addEmployee(form.value);
    this.addModalRef.close();
    /*this.hotelId = this.afs.collection('vendors').doc(localStorage.hotelId).ref.id;*/
  }

  setEmployees() {
    let employee: Employee = {
      name: this.name,
      phone: this.phone,
      email: this.email,
      hotelId: localStorage.hotelId
    };
  }


  deleteEmployee(employeeId) {
    this.afs.doc('employees/' + employeeId).delete();
  }

  // popup
  openNewProperty(contentNewProperty) {
    this.addModalRef = this.modalService.open(contentNewProperty);
    this.addModalRef.result.then((result) => {
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
      return  `with: ${reason}`;
    }
  }
}
