import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {
  loadAccessedUserDevices,
  selectDeviceList, setSelectedUserDevice
} from "../../store/device-list/reducer/device-list.reducer";
import {AppStore} from "../../store/app-store";
import {UserDevice} from "../../store/device-list/model/UserDevice";

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {
  public deviceList$ = this.store.select(selectDeviceList)

  constructor(
    public store: Store<AppStore>
  ) {
    this.store.dispatch(loadAccessedUserDevices());
  }

  ngOnInit(): void {}

  public selectDevice(userDevice: UserDevice) {
    console.log(userDevice)
    this.store.dispatch(setSelectedUserDevice({ userDevice }))
  }
}
