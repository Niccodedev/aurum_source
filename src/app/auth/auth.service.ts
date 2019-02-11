import { Router } from "@angular/router";
import * as firebase from "firebase";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { DataStorageService } from "../shared/services/data-storage.service";
import { AngularFireAuth } from "angularfire2/auth";
import { hostViewClassName } from "@angular/compiler";

@Injectable()
export class AuthService {
  private authState: any;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private dataStoreService: DataStorageService,
    private afAuth: AngularFireAuth
  ) {}

  signUpNewUser(user, password, successCallback, failCallback) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, password)
      .then(response => {
        user.id = response.uid;
        user.password = password;
        this.afs
          .collection("managers")
          .doc(response.uid)
          .set(Object.assign({}, user))
          .then(successCallback);
      })
      .catch(
        //error => console.log(error)
        failCallback
      );
  }

  signUpUser(user, password) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, password)
      .then(response => {
        user.id = response.uid;
        user.password = password;
        this.afs
          .collection("managers")
          .doc(response.uid)
          .set(Object.assign({}, user));
      })
      .catch(error => console.log(error));
  }

  checkAdminStatus(manager) {
    this.afs
      .doc(`hotels/${manager.hotelId}`)
      .ref.get()
      .then(hotel => {
        console.log(hotel.data().adminId);
        this.afs
          .doc(`managers/${hotel.data().adminId}`)
          .ref.get()
          .then(admin => {
            if (admin.data().status == "active") {
              this.router.navigate(["transactions-date"]);
              this.dataStoreService.setHotelId(manager.hotelId);
            }
          });
      })
      .catch(error => {
        console.log(error);
        status = "inactive";
      });
  }

  signInUser(email: string, password: string) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        console.log(JSON.stringify(response.uid));

        this.afs
          .doc("managers/" + response.uid)
          .valueChanges()
          .subscribe(res => {
            this.dataStoreService.setUser(res);
            let currentUser = this.dataStoreService.getUser();
            switch (currentUser.role) {
              case "manager":
                this.checkAdminStatus(currentUser);
                break;
              case "admin":
                if (currentUser.status == "inactive")
                  return "Account is inactive";
                this.router.navigate(["hotels"]);
                break;
              case "superadmin":
                this.router.navigate(["super-admin"]);
                break;
              default:
                this.router.navigate(["login"]);
            }
          });
      })
      .catch(error => console.log(error));
  }

  logout() {
    firebase.auth().signOut();
    this.router.navigate(["/login"]);
  }
}
