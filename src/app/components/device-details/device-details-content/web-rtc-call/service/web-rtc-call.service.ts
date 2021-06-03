import {ElementRef, Injectable, TemplateRef} from '@angular/core';
import {CommandWebSocketService} from "../../../../../service/command-web-socket.service";
import {Store} from "@ngrx/store";
import {selectSelectedDevice} from "../../../../../store/device-list/reducer/device-list.reducer";
import {filter, map, switchMap, take, tap} from "rxjs/operators";
import {AppStore} from "../../../../../store/app-store";
import {HasSubscriptions} from "../../../../../model/common/has-subscriptions";
import {Observable, of, Subscription} from "rxjs";
import {toggleShowVideoCallComponent} from "../../../../../store/app/reducer/app.reducer";
import {fromPromise} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class WebRtcCallService extends HasSubscriptions {
  public remoteVideo: ElementRef<HTMLVideoElement> | null = null;
  public localVideo: ElementRef<HTMLVideoElement> | null = null;

  public connectionConfig = {iceServers: [{urls: "stun:stun.stunprotocol.org"}]};
  public offerConstraints = {audio: false, video: true};
  public rtcPeerConnection: RTCPeerConnection | null = null;

  public stream: MediaStream | null = null;

  constructor(
    private commandWebSocketService: CommandWebSocketService,
    private store: Store<AppStore>
  ) {
    super();
    this.rtcPeerConnection = this.initRtcPeerConnection();

    this.subscriptions.push(
      this.initReceivedTheCallSubscription()
    )
  }

  public addVideoElementsRefs(remoteVideo: ElementRef<HTMLVideoElement> | null, localVideo: ElementRef<HTMLVideoElement> | null) {
    this.remoteVideo = remoteVideo;
    this.localVideo = localVideo;
  }

  public setOfferFromRemote(data: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    return this.rtcPeerConnection.setRemoteDescription(data).then(() => {
      return this.rtcPeerConnection?.createAnswer().then(answer => {
        return this.rtcPeerConnection?.setLocalDescription(answer).then(() => {
          return answer;
        });
      })
    })
  }

  public setAnswerFromRemote(data: RTCSessionDescriptionInit): Promise<void> {
    return this.rtcPeerConnection ?
      this.rtcPeerConnection.setRemoteDescription(data) :
      new Promise(() => {
      })
  }

  public setCandidateFromRemote(data: RTCIceCandidate | RTCIceCandidateInit): Promise<void> | undefined {
    return this.rtcPeerConnection?.addIceCandidate(data);
  }

  public createOffer(): Promise<RTCSessionDescriptionInit | undefined> | undefined {
    return this.rtcPeerConnection?.createOffer().then(description => {
      return this.rtcPeerConnection?.setLocalDescription(description).then(() => {
        return description;
      })
    })
  }

  private initRtcPeerConnection(): RTCPeerConnection {
    let connection = new RTCPeerConnection(this.connectionConfig);
    return connection;
  }

  public navigatorInit(): Promise<void> {
    return navigator.mediaDevices.getUserMedia(this.offerConstraints)
      .then(stream => this.onNavigatorReturnedStream(stream))
      .catch(err => console.error(err));
  }

  public onNavigatorReturnedStream(stream: MediaStream): void {
    this.stream = stream;
    let nativeElement = this.localVideo?.nativeElement;
    if (nativeElement !== undefined) {
      nativeElement.srcObject = this.stream;
    }

    this.stream?.getTracks().forEach(track => {
      this.rtcPeerConnection?.addTrack(track, stream)
    })
  }

  public call() {
    this.store.select(selectSelectedDevice)
      .pipe(
        take(1)
      ).toPromise().then(userDevice => {
      this.navigatorInit().then(() => {
        this.createOffer()?.then(localDescription => {
          if (localDescription != null && userDevice != null) {
            this.commandWebSocketService.sendReceivedTheCallCommand(userDevice, localDescription)
          }
        })
      })
    });
  }

  public rejectCall() {
    this.rtcPeerConnection?.close();
    // this.initRtcPeerConnection();
    this.store.dispatch(toggleShowVideoCallComponent({show: false}))
    this.stream?.getTracks().forEach(t => t.stop())
  }

  private initReceivedTheCallSubscription(): Subscription {
    return this.commandWebSocketService.onReceivedTheCall$
      .pipe(
        map(message => message?.data),
        map(data => JSON.parse(data ? data : "") as RTCSessionDescriptionInit),
        switchMap(remoteDescription => this.setOfferFromRemote(remoteDescription)),
        // switchMap(() => )
      ).subscribe()
  }
}

// const offerConstraints = {audio: false, video: true};
//
// class LogManager {
//   log = document.getElementById("log");
//
//   logPrint(message) {
//     let htmlSpanElement = document.createElement('span');
//     htmlSpanElement.innerText = `${new Date(Date.now())}: ${ message }`
//     this.log.append(htmlSpanElement)
//   }
// }
//
// const logManager = new LogManager();
//
// window.onerror = (error) => {
//   logManager.logPrint(error.toString())
// }
//
// class RTCConnectionManager {
//   connectionConfig = { iceServers: [{ urls: "stun:stun.stunprotocol.org" }]};
//   rtcPeerConnection = new RTCPeerConnection(this.connectionConfig);
//
//   constructor() {}
//
//   setOfferFromRemote(data) {
//     return this.rtcPeerConnection.setRemoteDescription(data).then(() => {
//       return this.rtcPeerConnection.createAnswer().then(answer => {
//         return this.rtcPeerConnection.setLocalDescription(answer).then(() => {
//           return answer;
//         });
//       })
//     })
//   }
//   setAnswerFromRemote(data) {
//     debugger
//     this.rtcPeerConnection.setRemoteDescription(data);
//   }
//
//   setCandidateFromRemote(data) {
//     debugger
//     this.rtcPeerConnection.addIceCandidate(data);
//   }
//
//   createOffer() {
//     return this.rtcPeerConnection.createOffer().then(description => {
//       return this.rtcPeerConnection.setLocalDescription(description).then(() => {
//         return description;
//       })
//     })
//   }
// }
//
// class SocketConnectionManager {
//   commandSocket = new WebSocket("wss://"+ location.host + "/command-socket");
//
//   constructor() {
//     this.commandSocket.onopen = () => { logManager.logPrint("commandSocket: Соединение установлено") };
//     this.commandSocket.onclose = (event) => { logManager.logPrint("commandSocket: " + (event.wasClean ? 'Соединение закрыто чисто' : 'Обрыв соединения') + " " + event.reason) };
//     this.commandSocket.onerror = (error) => { logManager.logPrint("commandSocket: " + "Ошибка соединения " + error.isTrusted)};
//     this.commandSocket.onmessage = (event) => {
//       let message = JSON.parse(event.data);
//       logManager.logPrint("New message: " + message.type)
//       switch (message.type) {
//         case "offer-from-remote": this.onOfferFromRemote(message.data); break;
//         case "answer-from-remote": this.onAnswerFromRemote(message.data); break;
//         case "candidate-from-remote": this.onCandidateFromRemote(message.data); break;
//       }
//     }
//   }
//
//   onOfferFromRemote;
//   onAnswerFromRemote;
//   onCandidateFromRemote;
// }
//
// class VideoManager {
//   remoteVideo = document.getElementById("video-remote");
//   localVideo = document.getElementById("video-local");
//
//   constructor() {}
// }
//
// const socketConnectionManager = new SocketConnectionManager();
// const rtcConnectionManager = new RTCConnectionManager();
// const videoManager = new VideoManager();
//
// socketConnectionManager.onOfferFromRemote = (data) => {
//   logManager.logPrint("onOfferFromRemote")
//   rtcConnectionManager.setOfferFromRemote(data).then(answer => {
//     socketConnectionManager.commandSocket.send(JSON.stringify({
//       type: "answer-from-remote",
//       data: answer
//     }))
//   });
// }
//
// socketConnectionManager.onAnswerFromRemote = (data) => {
//   logManager.logPrint("onAnswerFromRemote")
//   rtcConnectionManager.setAnswerFromRemote(data)
// }
//
// socketConnectionManager.onCandidateFromRemote = (data) => {
//   logManager.logPrint("onCandidateFromRemote")
//   rtcConnectionManager.setCandidateFromRemote(data)
// }
//
// rtcConnectionManager.rtcPeerConnection.onicecandidate = (event) => {
//   logManager.logPrint("onIceCandidate")
//   let candidate = event.candidate;
//   socketConnectionManager.commandSocket.send(JSON.stringify({
//     type: "candidate-from-remote",
//     data: candidate
//   }))
// }
//
// rtcConnectionManager.rtcPeerConnection.ontrack = (event) => {
//   logManager.logPrint("ontrack")
//   videoManager.remoteVideo.srcObject = event.streams[0];
// }
//
// navigator.mediaDevices.getUserMedia(offerConstraints)
//   .then(function (stream) {
//     const videoTracks = stream.getVideoTracks();
//     logManager.logPrint('Получил поток с ограничениями:', offerConstraints);
//     logManager.logPrint('Использую видео-устройство: ' + videoTracks[0].label);
//     stream.onended = function () {
//       logManager.logPrint('Трансляция закончилась');
//     };
//     window.stream = stream;
//     videoManager.localVideo.srcObject = stream;
//
//     stream.getTracks().forEach(track => {
//       rtcConnectionManager.rtcPeerConnection.addTrack(track, stream)
//       logManager.logPrint("Трек добавлен")
//     })
//   })
//   .catch(function (err) {
//     logManager.logPrint("Ошибка:" + err.toString())
//   });
//
//
// function r() {
//   rtcConnectionManager.createOffer().then(description => {
//     socketConnectionManager.commandSocket.send(
//       JSON.stringify({
//         type: "offer-from-remote",
//         data: description
//       })
//     )
//   })
// }
