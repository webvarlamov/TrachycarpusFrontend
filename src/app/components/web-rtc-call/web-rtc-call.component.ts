import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { WebRtcCallService } from "./service/web-rtc-call.service";

@Component({
  selector: 'app-web-rtc-call',
  templateUrl: './web-rtc-call.component.html',
  styleUrls: ['./web-rtc-call.component.css']
})
export class WebRtcCallComponent implements OnInit, AfterViewInit {
  @ViewChild('remoteVideo', {static: true}) remoteVideo: ElementRef<HTMLVideoElement> | null = null;
  @ViewChild('localVideo', {static: true}) localVideo: ElementRef<HTMLVideoElement> | null = null;

  constructor(
    public webRtcCallService: WebRtcCallService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.webRtcCallService.addVideoElementsRefs(this.remoteVideo, this.localVideo)
  }

  rejectCall() {
    this.webRtcCallService.rejectCall();
  }
}
