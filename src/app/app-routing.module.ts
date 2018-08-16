///<reference path="../../node_modules/@angular/core/src/metadata/ng_module.d.ts"/>
import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';

import {LoginComponent} from './auth/login/login.component';
import {HomeComponent} from './home/home.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {HotelsComponent} from './hotels/hotels.component';
import {CanActivate} from "@angular/router";
import {AdminGuard} from "./shared/classes/admin.guard";
import {AutGuard} from "./shared/classes/auth.guard";
import {TransactionsDateComponent} from "./transactions/transactions-date/transactions-date.component";
import {TransactionsTypeComponent} from "./transactions/transactions-type/transactions-type.component";
import {RoomComponent} from "./inventory/room/room.component";
import {MaintenanceComponent} from "./inventory/maintenance/maintenance.component";
import {FbComponent} from "./inventory/fb/fb.component";
import {FdMiscComponent} from "./inventory/fd-misc/fd-misc.component";
import {PayrollComponent} from "./payroll/payroll.component";
import {InspectionComponent} from "./inspections/inspection.component";
import {VendorsComponent} from "./property/vendors/vendors.component";
import {EmployeeComponent} from "./property/employee/employee.component";
import {CredentialsComponent} from "./property/credentials/credentials.component";
import {ActivityComponent} from "./activity/activity.component";
import {ActivityChatComponent} from "./activity/activity-chat/activity-chat.component";
import {BillsMiscComponent} from "./upload/bills-misc/bills-misc.component";
import {FormsComponent} from "./upload/forms/forms.component";
import {NewSuperAdmitPageComponent} from './new-super-admit-page/new-super-admit-page.component';
import {RatePageComponent} from './rate-page/rate-page.component';
import { HKComponent } from './hk-goals/hk.component';
import { CalendarComponent } from './calendar/calendar.component';

const appRoutes: Routes = [
  { path: '',  redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component:  LoginComponent },
  { path: 'home', component:  HomeComponent , canActivate: [AutGuard, AdminGuard] },
  { path: 'transactions', component: TransactionsComponent , canActivate: [AutGuard] },
  { path: 'hotels', component:  HotelsComponent , canActivate: [AutGuard, AdminGuard] },
  { path: 'transactions-date', component: TransactionsDateComponent, canActivate: [AutGuard] },
  { path: 'transactions-type', component: TransactionsTypeComponent, canActivate: [AutGuard] },
  { path: 'room', component: RoomComponent, canActivate: [AutGuard] },
  { path: 'maintenance', component: MaintenanceComponent, canActivate: [AutGuard] },
  { path: 'fb', component: FbComponent, canActivate: [AutGuard] },
  { path: 'fd-misc', component: FdMiscComponent, canActivate: [AutGuard] },
  { path: 'payroll', component: PayrollComponent, canActivate: [AutGuard] },
  { path: 'inspection', component: InspectionComponent, canActivate: [AutGuard] },
  { path: 'hk', component: HKComponent, canActivate: [AutGuard] },
  { path: 'vendors', component: VendorsComponent, canActivate: [AutGuard] },
  { path: 'employee', component: EmployeeComponent, canActivate: [AutGuard] },
  { path: 'credentials', component: CredentialsComponent, canActivate: [AutGuard] },
  { path: 'activity', component: ActivityComponent, canActivate: [AutGuard] },
  { path: 'activity-chat', component: ActivityChatComponent, canActivate: [AutGuard] },
  { path: 'bills-misc', component: BillsMiscComponent, canActivate: [AutGuard]},
  { path: 'forms', component: FormsComponent, canActivate: [AutGuard]},
  { path: 'super-admin', component: NewSuperAdmitPageComponent, canActivate: [AutGuard] },
  { path: 'rate-page', component: RatePageComponent, canActivate: [AutGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AutGuard] },
  ];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
