import {Component, Input, OnInit, Output} from '@angular/core';
import {EventEmitter} from "@angular/core";
import {UserDevice} from "../../../store/device-list/model/UserDevice";
import {Store} from "@ngrx/store";
import {toggleShowVideoCallComponent} from "../../../store/app/reducer/app.reducer";
import {WebRtcCallService} from "../../web-rtc-call/service/web-rtc-call.service";

@Component({
  selector: 'app-device-details-header',
  templateUrl: './device-details-header.component.html',
  styleUrls: ['./device-details-header.component.css']
})
export class DeviceDetailsHeaderComponent implements OnInit {
  @Output() onBackButtonClick$: EventEmitter<void> = new EventEmitter<void>();
  @Input()  selectedDevice: UserDevice | null = null;

  constructor(
    private store: Store,
    private webRtcCallService: WebRtcCallService
  ) {}

  ngOnInit(): void {
  }

  public call(selectedDevice: UserDevice | null): void {
    this.store.dispatch(toggleShowVideoCallComponent({show: true}))
    this.webRtcCallService.call();
  }
}
