import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {HttpDataAccessService} from "../http/http-data-access.service";
import {
  CommandSocketMessage,
  CommandWebSocket,
  CommandWebSocketMessageType
} from "../http/web-socket/command-web-socket";
import {HasSubscriptions} from "../model/common/has-subscriptions";
import {delay, filter, map, tap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";
import {loadAccessedUserDevices} from "../store/device-list/reducer/device-list.reducer";
import Swal from 'sweetalert2'
import {UserDevice, UserDeviceModel} from "../store/device-list/model/UserDevice";

@Injectable({
  providedIn: 'root'
})
export class CommandWebSocketService extends HasSubscriptions {
  public onUpdateUserDeviceWebSocketSessionsMessage$: Observable<CommandSocketMessage> = this.commandWebSocket.onmessage$
    .pipe(
      tap(console.log),
      delay(1000),
      map(event => this.parseMessageEventData(event)),
      filter(message => message.commandType === CommandWebSocketMessageType.update_user_device_web_socket_sessions)
    );

  public onAlertMessage$: Observable<CommandSocketMessage> = this.commandWebSocket.onmessage$
    .pipe(
      delay(1000),
      map(event => this.parseMessageEventData(event)),
      filter(message => message.commandType === CommandWebSocketMessageType.alert)
    );

  public onReceivedTheCall$: Observable<CommandSocketMessage> = this.commandWebSocket.onmessage$
    .pipe(
      delay(1000),
      map(event => this.parseMessageEventData(event)),
      filter(message => message.commandType === CommandWebSocketMessageType.received_the_call)
    );

  public onReceivedTheAnswer$: Observable<CommandSocketMessage> = this.commandWebSocket.onmessage$
    .pipe(
      delay(1000),
      map(event => this.parseMessageEventData(event)),
      filter(message => message.commandType === CommandWebSocketMessageType.received_the_answer)
    );

  public onReceiveDataChannelOffer$: Observable<CommandSocketMessage> = this.commandWebSocket.onmessage$
    .pipe(
      delay(1000),
      map(event => this.parseMessageEventData(event)),
      filter(message => message.commandType === CommandWebSocketMessageType.receive_data_channel_offer)
    );

  constructor(
    private store: Store,
    private httpDataAccessService: HttpDataAccessService,
    private commandWebSocket: CommandWebSocket
  ) {
    super();
    this.subscriptions.push(this.initUpdateUserDeviceWebSocketSessionsSubscription());
    this.subscriptions.push(this.initAlertSubscription());
  }

  private initUpdateUserDeviceWebSocketSessionsSubscription(): Subscription {
    return this.onUpdateUserDeviceWebSocketSessionsMessage$
      .pipe(
        tap(() => this.store.dispatch(loadAccessedUserDevices()))
      ).subscribe();
  }

  private parseMessageEventData(messageEvent: MessageEvent): CommandSocketMessage {
    try {
      return JSON.parse(messageEvent.data)
    } catch (e) {
      return {
        commandType: CommandWebSocketMessageType.CLIENT_ERROR,
      }
    }
  }

  private initAlertSubscription(): Subscription {
    return this.onAlertMessage$
      .pipe(
        tap(message => {
          Swal.fire({
            title: 'Hellooo!',
            text: `from ${message.initiator}`,
            icon: 'info',
            confirmButtonText: 'Cool!'
          })
        })
      )
      .subscribe()
  }

  public sendHelloDeviceCommand(userDevice: UserDeviceModel) {
    this.commandWebSocket.sendCommand({
      commandType: CommandWebSocketMessageType.alert,
      destinationDeviceId: userDevice.uuid,
      initiator: localStorage.getItem("user-device-id")
    })
  }

  public sendReceivedTheCallCommand(userDevice: UserDevice, localDescription: RTCSessionDescriptionInit) {
    const message = {
      commandType: CommandWebSocketMessageType.received_the_call,
      destinationDeviceId: userDevice.uuid,
      data: JSON.stringify(localDescription),
      initiator: localStorage.getItem("user-device-id")
    }

    console.info("1 (Initiator). Send received the call command message", message)

    this.commandWebSocket.sendCommand(message)
  }

  public sendReceivedTheAnswerCommand(userDeviceId: string, localDescription: RTCSessionDescriptionInit) {
    const message = {
      commandType: CommandWebSocketMessageType.received_the_answer,
      destinationDeviceId: userDeviceId,
      data: JSON.stringify(localDescription),
      initiator: localStorage.getItem("user-device-id")
    }

    console.info("3 (Receiver). Send the receive answer comand message", message)

    this.commandWebSocket.sendCommand(message)
  }

  public sendReceiveCandidateCommand(userDeviceId: string, candidate: RTCIceCandidate) {
    const message = {
      commandType: CommandWebSocketMessageType.received_candidate_from_remote,
      destinationDeviceId: userDeviceId,
      data: JSON.stringify(candidate),
      initiator: localStorage.getItem("user-device-id")
    }

    console.info("5 (All). Send the receive ICE candidate command ", message)

    this.commandWebSocket.sendCommand(message)
  }

  public sendReceiveDataChannelOfferCommand(userDevice: UserDevice, offer: RTCSessionDescriptionInit) {
    const message = {
      commandType: CommandWebSocketMessageType.receive_data_channel_offer,
      destinationDeviceId: userDevice.uuid,
      data: JSON.stringify(offer),
      initiator: localStorage.getItem("user-device-id")
    }

    this.commandWebSocket.sendCommand(message)
  }
}
