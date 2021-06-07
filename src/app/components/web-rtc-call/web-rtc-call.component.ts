import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WebRtcCall2Service} from "./service/web-rtc-call-2.service";

@Component({
  selector: 'app-web-rtc-call',
  templateUrl: './web-rtc-call.component.html',
  styleUrls: ['./web-rtc-call.component.css']
})
export class WebRtcCallComponent implements OnInit, AfterViewInit {
  @ViewChild('remoteVideo', {static: true}) remoteVideo: ElementRef<HTMLVideoElement> | null = null;
  @ViewChild('localVideo', {static: true}) localVideo: ElementRef<HTMLVideoElement> | null = null;

  constructor(
    public webRtcCallService: WebRtcCall2Service
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  rejectCall() {
    this.webRtcCallService.hangup();
  }
}
