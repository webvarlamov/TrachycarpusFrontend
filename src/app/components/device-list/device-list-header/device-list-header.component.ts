import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-device-list-header',
  templateUrl: './device-list-header.component.html',
  styleUrls: ['./device-list-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceListHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
