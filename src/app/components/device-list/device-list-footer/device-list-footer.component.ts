import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-device-list-footer',
  templateUrl: './device-list-footer.component.html',
  styleUrls: ['./device-list-footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceListFooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
