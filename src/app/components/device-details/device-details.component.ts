import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Store } from "@ngrx/store";
import { selectSelectedDevice } from "../../store/device-list/reducer/device-list.reducer";
import { AppStore } from "../../store/app-store";

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {
  @Output() public onBack$: EventEmitter<void> = new EventEmitter<void>();
  public selectedUserDevice$ = this.store.select(selectSelectedDevice)

  constructor(
    public store: Store<AppStore>
  ) { }

  ngOnInit(): void {
  }

}
