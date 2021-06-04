import { Injectable } from '@angular/core';
import {CommandWebSocketService} from "../../../service/command-web-socket.service";
import {Store} from "@ngrx/store";
import {selectSelectedDevice} from "../../../store/device-list/reducer/device-list.reducer";
import {AppStore} from "../../../store/app-store";
import {map, take} from "rxjs/operators";
import {UserDevice} from "../../../store/device-list/model/UserDevice";
import {HasSubscriptions} from "../../../model/common/has-subscriptions";

@Injectable({
  providedIn: 'root'
})
export class WebRtcDataService extends HasSubscriptions {
  public remotePeerUserDeviceUUID: string;

  public readonly connectionConfig = {iceServers: [{urls: "stun:stun.stunprotocol.org"}]};
  public readonly dataChanelLabel = 'dataChanelLabel';
  private rtcPeerConnection: RTCPeerConnection;
  private dataChannel: RTCDataChannel;

  constructor(
    private commandWebSocketService: CommandWebSocketService,
    private store: Store<AppStore>
  ) {
    super();
    this.createConnection();

    this.subscriptions.push(
      this.initOnReceiveDataChannelOfferSubscription()
    )
  }

  private createConnection(): void {
    console.info('1. Created local peer connection');

    this.rtcPeerConnection = new RTCPeerConnection(this.connectionConfig);
    this.rtcPeerConnection.onicecandidate = this.onIceCandidate;

    console.info('2. Created local data channel');

    this.dataChannel = this.rtcPeerConnection.createDataChannel(this.dataChanelLabel);
    this.dataChannel.onopen = this.onDataChannelOpen;
    this.dataChannel.onclose = this.onDataChannelClose;
    this.dataChannel.onerror = this.onDataChannelError;
    this.dataChannel.onbufferedamountlow = this.onDataChannelBufferedAmountLow;
    this.dataChannel.onmessage = this.onDataChannelMessage;
  }

  private onDataChannelOpen = (event: Event) => {
    console.info("On Data Chanel Open", event)
  };

  private onDataChannelClose = (event: Event) => {
    console.info("On Data Chanel Close", event)
  };

  private onDataChannelError = (event: RTCErrorEvent) => {
    console.info("On Data Chanel Error", event)
  };

  private onDataChannelBufferedAmountLow = (event: Event) => {
    console.info("On Data Chanel Buffered Amount Low", event)
  };

  private onDataChannelMessage = (event: MessageEvent) => {
    console.info("On Data Chanel Message", event)
  };

  private onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    console.info("On Data Chanel Message", event)
  };

  private startConnection() {
    this.rtcPeerConnection.createOffer().then(
      this.onCreateOfferSuccess,
      this.onCreateOfferError
    )
  }

  private onCreateOfferSuccess(offer: RTCSessionDescriptionInit) {
    return this.rtcPeerConnection.setLocalDescription(offer).then(() => {
        this.sendOfferToRemote(offer);
      }
    )
  }

  private sendOfferToRemote(offer: RTCSessionDescriptionInit) {
    this.getTargetUserDevice().then(userDevice => {
      this.commandWebSocketService.sendReceiveDataChannelOfferCommand(userDevice, offer)
    })
  }

  private getTargetUserDevice(): Promise<UserDevice> {
    return this.store.select(selectSelectedDevice).pipe(take(1)).toPromise()
  }

  private onCreateOfferError(event: Event): void {
    console.info("On Create Offer Error", event);
  }

  private initOnReceiveDataChannelOfferSubscription() {
    return this.commandWebSocketService.onReceiveDataChannelOffer$
      .pipe(
        map(message => {

        })
      )
      .subscribe()
  }
}
