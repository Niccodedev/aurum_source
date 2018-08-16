import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, Http, Response, RequestOptions, Headers} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireModule} from "angularfire2";
import firestore = firebase.firestore;
import * as firebase from "firebase/app";
import {AngularFirestoreModule} from "angularfire2/firestore";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule } from '@angular/material';
import 'hammerjs';


import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RoomComponent } from './inventory/room/room.component';
import { MaintenanceComponent } from './inventory/maintenance/maintenance.component';
import { FbComponent } from './inventory/fb/fb.component';
import { FdMiscComponent } from './inventory/fd-misc/fd-misc.component';
import { ActivityComponent } from './activity/activity.component';
import { PayrollComponent } from './payroll/payroll.component';
import { InspectionComponent } from './inspections/inspection.component';
import { VendorsComponent } from './property/vendors/vendors.component';
import { CredentialsComponent } from './property/credentials/credentials.component';
import { EmployeeComponent } from './property/employee/employee.component';
import { BillsMiscComponent } from './upload/bills-misc/bills-misc.component';
import { FormsComponent } from './upload/forms/forms.component';
import {AuthService} from './auth/auth.service';
import {AppRoutingModule} from './app-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import {DataStorageService} from './shared/services/data-storage.service';
import {UploadFileService} from './shared/services/upload-file.service';
import { HotelsComponent } from './hotels/hotels.component';
import { HotelService } from './hotels/services/hotel.service';
import {HelperService} from "./shared/services/helper.service";
import {AutGuard} from "./shared/classes/auth.guard";
import {AdminGuard} from "./shared/classes/admin.guard";
import {DataProcessingService} from "./shared/services/data-processing.service";
import {HomeService} from './home/services/home.service';
import { TransactionsHeaderComponent } from './transactions/transactions-header/transactions-header.component';
import { TransactionsDateComponent } from './transactions/transactions-date/transactions-date.component';
import { TransactionsTypeComponent } from './transactions/transactions-type/transactions-type.component';
import {TransactionService} from './transactions/services/transaction.service';
import { InventoryHeaderComponent } from './inventory/inventory-header/inventory-header.component';
import {ChangePropertyComponent} from './change-property/change-property.component';
import { ActivityChatComponent } from './activity/activity-chat/activity-chat.component';
import {InventoryService} from "./inventory/services/inventory.service";
import { CalendarService } from './calendar/services/calendar.service';
import {ActivityChatService} from "./activity/activity-chat/service/activity-chat.service";
import {CredentialsService} from "./property/services/credentials.service";
import {EmployeesService} from "./property/services/employees.service";
import {VendorsService} from "./property/services/vendors.service";
import {PayrollService} from "./payroll/services/payroll.service";
import {BillService} from "./upload/services/bill.service";
import {FormService} from './upload/services/form.service';
import {AngularFireAuth} from 'angularfire2/auth';
import { NewSuperAdmitPageComponent } from './new-super-admit-page/new-super-admit-page.component';
import {SuperAdminService} from './new-super-admit-page/services/super-admin.service';
import { RatePageComponent } from './rate-page/rate-page.component';
import { DatePipe } from '@angular/common';
import { FilterByDatePipe } from './shared/pipes/filter-by-date.pipe';
import {NgxAutoScroll} from 'ngx-auto-scroll';
import { ItemsManagerComponent } from './shared/classes/items-manager/items-manager.component';
import { HKComponent } from './hk-goals/hk.component';

import { HKService } from './hk-goals/services/hk.service';
import { SafePipe } from './shared/pipes/SafePipe';

  var firebaseConfig = {
    apiKey: "AIzaSyAoaxNAMyoOh5JHUAVfzx8ua4m_fau7GVk",
    authDomain: "aurum-249ae.firebaseapp.com",
    databaseURL: "https://aurum-249ae.firebaseio.com",
    projectId: "aurum-249ae",
    storageBucket: "aurum-249ae.appspot.com",
    messagingSenderId: "1041935493149"
  };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    TransactionsComponent,
    RoomComponent,
    MaintenanceComponent,
    FbComponent,
    FdMiscComponent,
    ActivityComponent,
    PayrollComponent,
    HKComponent,
    CalendarComponent,
    VendorsComponent,
    CredentialsComponent,
    EmployeeComponent,
    BillsMiscComponent,
    FormsComponent,
    HotelsComponent,
    TransactionsHeaderComponent,
    TransactionsDateComponent,
    TransactionsTypeComponent,
    InventoryHeaderComponent,
    ChangePropertyComponent,
    ActivityChatComponent,
    CredentialsComponent,
    EmployeeComponent,
    VendorsComponent,
    NewSuperAdmitPageComponent,
    RatePageComponent,
    FilterByDatePipe,
    ItemsManagerComponent,
    SafePipe,
    InspectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    /*MaterialModule.forRoot()*/
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  providers: [
    DataStorageService,
    DataProcessingService,
    AuthService,
    HelperService,
    UploadFileService,
    HotelService,
    AutGuard,
    AdminGuard,
    TransactionService,
    HomeService,
    InventoryService,
    CalendarService,
    ActivityChatService,
    CredentialsService,
    EmployeesService,
    VendorsService,
    PayrollService,
    BillService,
    HKService,
    FormService,
    AngularFireAuth,
    SuperAdminService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
