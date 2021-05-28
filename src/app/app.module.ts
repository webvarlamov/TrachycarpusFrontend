import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DeviceListComponent } from './components/device-list/device-list.component';
import { DeviceDetailsComponent } from './components/device-details/device-details.component';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import {AppStoreModule} from "./store/app-store.module";
import {CommonModule} from "@angular/common";
import { DeviceListHeaderComponent } from './components/device-list/device-list-header/device-list-header.component';
import { DeviceListFooterComponent } from './components/device-list/device-list-footer/device-list-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    DeviceListComponent,
    DeviceDetailsComponent,
    DeviceListHeaderComponent,
    DeviceListFooterComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    AppStoreModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    RouterModule
  ]
})
export class AppModule { }
