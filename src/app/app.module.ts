import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DeviceListComponent } from './components/device-list/device-list.component';
import { DeviceDetailsComponent } from './components/device-details/device-details.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppStoreModule } from "./store/app-store.module";
import { CommonModule } from "@angular/common";
import { DeviceListHeaderComponent } from './components/device-list/device-list-header/device-list-header.component';
import { DeviceListFooterComponent } from './components/device-list/device-list-footer/device-list-footer.component';
import { DeviceIdSaverInterceptor } from "./http/interceptor/device-id-saver.interceptor";
import { DeviceDetailsHeaderComponent } from './components/device-details/device-details-header/device-details-header.component';
import { DeviceDetailsFooterComponent } from './components/device-details/device-details-footer/device-details-footer.component';
import { DeviceDetailsContentComponent } from './components/device-details/device-details-content/device-details-content.component';
import { WebRtcCallComponent } from './components/device-details/device-details-content/web-rtc-call/web-rtc-call.component';

@NgModule({
  declarations: [
    AppComponent,
    DeviceListComponent,
    DeviceDetailsComponent,
    DeviceListHeaderComponent,
    DeviceListFooterComponent,
    DeviceDetailsHeaderComponent,
    DeviceDetailsFooterComponent,
    DeviceDetailsContentComponent,
    WebRtcCallComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    AppStoreModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DeviceIdSaverInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    RouterModule
  ]
})
export class AppModule { }
