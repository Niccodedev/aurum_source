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
        this.notifications = res.sort(this.dateCompaere);      
      })  
  }

  isRecent(time){
    return new Date().getTime() < time + 1000 * 60 * 60 *24;
  }
  
  formatDate(time){
    let date = new Date(time);
    let year = date.getFullYear() % 100;
    let month = this.fixTwoDigit(date.getMonth() + 1)
    let day = this.fixTwoDigit(date.getDate());
    let amOrPm = 'AM';
    if(date.getHours() >= 12){
      amOrPm = 'PM'
    }
    let hour = this.fixTwoDigit((date.getHours()-1) % 12 +1);
    let min = this.fixTwoDigit(date.getMinutes());
    let second = this.fixTwoDigit(date.getSeconds());
    return `(${month}/${day}/${year} ${hour}:${min}:${second} ${amOrPm})`
  }

  fixTwoDigit(num){
    if (num>9) return num;
    else return "0" + num;
  }

  dateCompaere(notiA, notiB){
    if(notiA.data.time < notiB.data.time){
      return 1;
    }
    return -1;
  }
}
