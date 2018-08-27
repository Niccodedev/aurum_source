import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/map';
// Services
import {AuthService} from '../auth/auth.service';
import {UploadFileService} from '../shared/services/upload-file.service';
import {HotelService} from "./services/hotel.service";
import {DataStorageService} from "../shared/services/data-storage.service";
// Classes
import {FileUpload} from '../shared/classes/file-upload';
import {DataProcessingService} from "../shared/services/data-processing.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})

export class HotelsComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  progress: { percentage: number } = {percentage: 0};

  closeResult: string;

  hotels: any;

  // name: string;
  // address: any;
  // city: string;
  name: FormControl;
  address: FormControl;
  city: FormControl;
  form: FormGroup;
  imageSaved: boolean;
  canAddMoreProperty: boolean;
  addNewHotelModal: any;
  constructor(private router: Router,
              private modalService: NgbModal,
              private authService: AuthService,
              private dataStorageService: DataStorageService,
              private dataProcessingService: DataProcessingService,
              private uploadService: UploadFileService,
              private hotelService: HotelService
  ) { }

  ngOnInit() {
    
    let adminId = this.dataStorageService.getUser().id;
    console.log(adminId)
    console.log(adminId);
      this.hotelService.getHotels().subscribe(res => {
      console.log(res)
      this.hotels = this.dataProcessingService.createArrayOfHotelsByAdminId(res);
      console.log(this.hotels)
      this.canAddMoreProperty = this.dataStorageService.getUser().number > this.hotels.length;
      console.log(this.hotels.length)
      console.log(this.dataStorageService.getUser().number)
      });
      this.createAddPropertyForm();

  }

  createAddPropertyForm(){
    this.name = new FormControl('', Validators.required);
    this.address = new FormControl('', Validators.required);
    this.city = new FormControl('', Validators.required);

    this.form = new FormGroup({
      name:this.name,
      city: this.city,
      address: this.address
    });

  }

  openNewHotel(contentNewHotel) {
    this.addNewHotelModal = this.modalService.open(contentNewHotel);
    this.addNewHotelModal.result.then((result) => {
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

  addNewHotel() {    
    console.log(this.currentFileUpload.url);
    console.log(this.dataStorageService.getUser().id);
    this.hotelService.addHotel({
      'name': this.name.value,
      'address': this.address.value,
      'city': this.city.value,
      'image': this.currentFileUpload.url,
      'adminId': this.dataStorageService.getUser().id
    })
    this.addNewHotelModal.close()
  }

  upload() {
    this.progress.percentage = 0;
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload, this.progress);
  }

  selectFile(event) {
    const file = event.target.files.item(0);

    if (file.type.match('image.*')) {
      this.selectedFiles = event.target.files;
    } else {
      alert('invalid format!');
    }
    this.upload();
  }

  goToNotifications(hotelId) {
    this.dataStorageService.setHotelId(hotelId);
    this.router.navigate(['notifications']);
  }
}
