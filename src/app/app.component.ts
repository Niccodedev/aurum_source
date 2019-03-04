import { Component, OnInit } from "@angular/core";
import * as firebase from "firebase";
import environment from "../../environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "app";

  ngOnInit() {
    firebase.initializeApp(environment);
  }
}
