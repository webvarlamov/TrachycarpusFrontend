import {ChangeDetectionStrategy, Component, OnInit, Output} from '@angular/core';
import {Store} from "@ngrx/store";
import {
  selectDeviceList,
  selectSelectedDevice,
  setSelectedUserDevice
} from "../../store/device-list/reducer/device-list.reducer";
import {AppStore} from "../../store/app-store";
import {UserDevice, UserDeviceModel} from "../../store/device-list/model/UserDevice";
import {combineLatest} from "rxjs";
import {map} from "rxjs/operators";
import {UAParser} from "ua-parser-js"
import {CommandWebSocketService} from "../../service/command-web-socket.service";
import {EventEmitter} from "@angular/core"

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceListComponent implements OnInit {
  @Output() onDeviceSelect$: EventEmitter<UserDeviceModel> = new EventEmitter()

  public parser = new UAParser();
  public deviceList$ = this.store.select(selectDeviceList);
  public selectedDevice$ = this.store.select(selectSelectedDevice);

  public deviceListData$ = combineLatest([
    this.deviceList$, this.selectedDevice$
  ]).pipe(
    map(([deviceList, selectedDevice]) => {
      return deviceList.map(device => {
        const parser = new UAParser(device.userAgent);

        return {
          ...device,
          selected: device?.uuid === selectedDevice?.uuid,
          device: parser.getDevice(),
          os: parser.getOS(),
          browser: parser.getBrowser()
        }
      })
    })
  )
  public trackByUuid(index: number, item: any) {
    return item.uuid;
  };

  constructor(
    public store: Store<AppStore>,
    public commandWebSocketService: CommandWebSocketService
  ) {
  }

  ngOnInit(): void {
  }

  public selectDevice(userDevice: UserDeviceModel) {
    this.store.dispatch(setSelectedUserDevice({userDevice}))
    this.onDeviceSelect$.emit(userDevice)
  }

  public helloDevice(device: UserDeviceModel) {
    this.commandWebSocketService.sendHelloDeviceCommand(device)
  }
}
