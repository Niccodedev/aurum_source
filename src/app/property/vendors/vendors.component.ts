import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import 'rxjs/add/operator/map';
import { Observable} from "rxjs/Observable";
import { NgForm, FormBuilder, Validators } from '@angular/forms';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
/*Interfaces*/
import { Vendor } from '../interfaces/vendor';
import {Hotel} from '../../hotels/interfaces/hotel';
/*Services*/
import { VendorsService } from '../services/vendors.service';
import {AuthService} from '../../auth/auth.service';
import {DataStorageService} from "../../shared/services/data-storage.service";
import {HelperService} from "../../shared/services/helper.service";
import {DataProcessingService} from "../../shared/services/data-processing.service";

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  closeResult: string;

 /* vendorsCol: any;
  */
  vendorDoc: AngularFirestoreDocument<Vendor>;
  vendor: Observable<Vendor>;
  vendors: any;
  hotelDoc: AngularFirestoreDocument<Hotel>;
  hotel: Observable<Hotel>;
  vendorsCol: AngularFirestoreCollection<Vendor>;

  name: string;
  person: string;
  phone: any;
  email: string;
  hotelId: any;
  addModalRef: any;
  constructor(private router: Router,
              private modalService: NgbModal,
              private afs: AngularFirestore,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private vendorService: VendorsService,
              public dataProcessingService: DataProcessingService) { }

  ngOnInit() {
    this.vendorService.getVendors().subscribe(res => {
      this.vendors = this.dataProcessingService.createArrayOfItemsbyHotelId2(res);
    });
    /*this.vendorsCol = this.afs.collection('vendors');
    return this.vendorsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Vendor;
          const id = a.payload.doc.id;
          return {id, data};
        })
      });*/
  }

  /*addNewVendor(form: NgForm) {
    console.log(form.value);
  }*/

  addNewVendor(form: NgForm) {  /*Save*/
    console.log(form.value);
    this.hotelId = localStorage.hotelId;
    form.value.htId = this.hotelId;
    console.log(form.value);
    this.vendorService.addVendor(form.value);
    this.addModalRef.close()
    /*this.hotelId = this.afs.collection('vendors').doc(localStorage.hotelId).ref.id;*/
  }

  setVendors() {
    let vendor: Vendor = {
      name: this.name,
      person: this.person,
      phone: this.phone,
      email: this.email,
      hotelId: localStorage.hotelId
    };
  }


  deleteVendor(vendorId) {
    this.afs.doc('vendors/'+vendorId).delete();
  }

/*popup*/
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
