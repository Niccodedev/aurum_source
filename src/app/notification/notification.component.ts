import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/map';
// Services
import {AuthService} from '../auth/auth.service';
import {NotificationService} from "./services/notification.service";
import {DataStorageService} from "../shared/services/data-storage.service";
// Classes
import {DataProcessingService} from "../shared/services/data-processing.service";



@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements OnInit {

  closeResult: string;
  notifications:any[];
  constructor(private router: Router,
              private modalService: NgbModal,
              private authService: AuthService,
              private dataStorageService: DataStorageService,
              private dataProcessingService: DataProcessingService,
              private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.notifications = []
    this.notificationService.getNotifications(localStorage.hotelId).subscribe(
      res=> {
        this.notifications = res;
        alert(JSON.stringify(this.notifications))
      })
  
  }

  

  

  
}
