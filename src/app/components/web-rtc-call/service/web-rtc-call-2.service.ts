import {Injectable} from '@angular/core';
import {HasSubscriptions} from "../../../model/common/has-subscriptions";
import {AppStore} from "../../../store/app-store";
import {Store} from "@ngrx/store";
import {selectSelectedDevice} from "../../../store/device-list/reducer/device-list.reducer";
import {map, switchMap, take, tap} from "rxjs/operators";
import {CommandWebSocketService} from "../../../service/command-web-socket.service";
import {fromPromise} from "rxjs/internal-compatibility";
import {toggleShowVideoCallComponent} from "../../../store/app/reducer/app.reducer";


@Injectable({
  providedIn: 'root'
})
export class WebRtcCall2Service extends HasSubscriptions {
  private iceConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808'},
      { urls: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808'}
    ]
  }

  public rtcPeerConnection: RTCPeerConnection;
  public remoteDeviceUUID: string;
  public localStream: MediaStream;

  public setLocalStream(stream: MediaStream) {
    this.localStream = stream;
  }

  public getNewPeerConnection(): RTCPeerConnection {
    const connection = new RTCPeerConnection(this.iceConfig);

    connection.onicecandidate = (event) => {
      this.getRemoteDeviceUUID().then(uuid => {
        this.commandSocketService.sendReceiveCandidateCommand(uuid, event.candidate);
      })
    }

    connection.ontrack = (event) => {
      let remoteVideoElement = this.getRemoteVideoElement();
      if (remoteVideoElement.srcObject !== event.streams[0]) {
        remoteVideoElement.srcObject = event.streams[0];
      }
    }

    connection.onicecandidateerror = (event) => {
      console.info('onicecandidateerror', event)
    }

    connection.onconnectionstatechange = (event) => {
      console.info('onconnectionstatechange', event)
    }

    connection.onnegotiationneeded = (event) => {
      console.info('onnegotiationneeded', event)
    }

    connection.ondatachannel = (event) => {
      console.info('ondatachannel', event)
    }

    connection.onicegatheringstatechange = (event) => {
      console.info('onicegatheringstatechange', event)
    }

    connection.onstatsended = (event) => {
      console.info('onstatsended', event)
    }

    connection.onsignalingstatechange = (event) => {
      console.info('onsignalingstatechange', event)
    }

    return connection;
  }

  public getRemoteVideoElement(): HTMLVideoElement {
    return document.getElementById('remote-video') as HTMLVideoElement;
  }

  public getLocalVideoElement(): HTMLVideoElement {
    return document.getElementById('local-video') as HTMLVideoElement;
  }

  public getNavigatorUserMediaStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({audio: false, video: true});
  }

  private connectLocalStreamToLocalVideo(stream: MediaStream) {
    let localVideoElement = this.getLocalVideoElement();
    localVideoElement.srcObject = stream;
  }

  private connectLocalStreamToRTCPeerConnection(stream: MediaStream) {
    stream.getTracks()
      .forEach(track => this.rtcPeerConnection.addTrack(track, stream));
  }

  private getRemoteDeviceUUID(): Promise<string> {
    return this.store.select(selectSelectedDevice).pipe(
      take(1),
      map(userDevice => {
        if (userDevice != null) {
          return userDevice.uuid;
        } else {
          return this.remoteDeviceUUID;
        }
      })
    ).toPromise();
  }

  public createOfferAndSetLocalDescription(): Promise<RTCSessionDescriptionInit> {
    return this.rtcPeerConnection.createOffer().then(offer => {
      return this.rtcPeerConnection.setLocalDescription(offer).then(() => {
        return offer;
      })
    })
  }

  public setRemoteDescriptionAndCreateAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    return this.rtcPeerConnection.setRemoteDescription(offer).then(() => {
      return this.rtcPeerConnection.createAnswer().then(answer => {
        return this.rtcPeerConnection.setLocalDescription(answer).then(() => {
          return answer;
        })
      })
    })
  }

  public hangup() {
    this.rtcPeerConnection.close();
    this.rtcPeerConnection = null;
  }

  public call() {
    this.rtcPeerConnection = this.getNewPeerConnection();
    this.getNavigatorUserMediaStream().then(stream => {
      this.setLocalStream(stream);
      this.connectLocalStreamToLocalVideo(stream);
      this.connectLocalStreamToRTCPeerConnection(stream);

      this.getRemoteDeviceUUID().then(uuid => {
        this.createOfferAndSetLocalDescription().then(offer => {
          this.commandSocketService.sendReceivedOfferFromRemoteCommand(uuid, offer)
        })
      })
    })
  }

  public initOnReceiveOfferFromRemoteSubscription() {
    this.commandSocketService
      .onReceiveOfferFromRemote$
      .pipe(
        tap(message => {
          this.remoteDeviceUUID = message.initiator;
        }),
        map(message => {
          return JSON.parse(message.data) as RTCSessionDescriptionInit;
        }),
        switchMap(offer => {
          return fromPromise(
            this.getNavigatorUserMediaStream().then(stream => {
              this.rtcPeerConnection = this.getNewPeerConnection();
              this.setLocalStream(stream);
              this.connectLocalStreamToLocalVideo(stream);
              this.connectLocalStreamToRTCPeerConnection(stream);
              this.store.dispatch(toggleShowVideoCallComponent({show: true}))
            }).then(() => {
              return this.setRemoteDescriptionAndCreateAnswer(offer);
            })
          )
        }),
        switchMap(answer => {
          return fromPromise(
            this.getRemoteDeviceUUID().then(uuid => {
              return this.commandSocketService.sendReceivedTheAnswerFromRemoteCommand(uuid, answer);
            })
          )
        })
      ).subscribe()
  }

  public initOnReceiveAnswerFromRemoteSubscription() {
    this.commandSocketService
      .onReceivedTheAnswerFromRemote$
      .pipe(
        tap(message => {
          this.remoteDeviceUUID = message.initiator;
        }),
        map(message => {
          return JSON.parse(message.data) as RTCSessionDescriptionInit;
        }),
        switchMap(answer => {
          return fromPromise(
            this.rtcPeerConnection.setRemoteDescription(answer)
          )
        })
      ).subscribe()
  }

  public initOnReceiveCandidateFromRemoteSubscription() {
    this.commandSocketService.onReceiveCandidateFromRemote$.pipe(
      map(message => {
        return JSON.parse(message.data) as RTCIceCandidate;
      }),
      switchMap(candidate => {
        return fromPromise(this.rtcPeerConnection.addIceCandidate(candidate))
      })
    ).subscribe()
  }

  constructor(
    private store: Store<AppStore>,
    private commandSocketService: CommandWebSocketService
  ) {
    super();
    this.initOnReceiveOfferFromRemoteSubscription();
    this.initOnReceiveAnswerFromRemoteSubscription();
    this.initOnReceiveCandidateFromRemoteSubscription();
  }
}
