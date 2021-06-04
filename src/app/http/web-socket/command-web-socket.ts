import { Injectable } from '@angular/core';
import { WebSocketObservable } from "./web-socket-observable";

@Injectable({
  providedIn: 'root'
})
export class CommandWebSocket extends WebSocketObservable {

  constructor() {
    super('command-socket')
  }

  public sendCommand(commandSocketMessage: CommandSocketMessage): void {
    super.send(JSON.stringify(commandSocketMessage));
  }

  public withQueryParams(): string {
    return "?" + "user-device-id=" + localStorage.getItem("user-device-id")
  }
}

export enum CommandWebSocketMessageType {
  set_offer_from_remote = "set_offer_from_remote",
  set_answer_from_remote = "set_answer_from_remote",
  set_candidate_from_remote = "set_candidate_from_remote",

  received_the_call = "received_the_call",
  received_the_answer = "received_the_answer",
  received_candidate_from_remote = "received_candidate_from_remote",

  receive_data_channel_offer = "receive_data_channel_offer",
  receive_data_channel_answer = "receive_data_channel_answer",
  receive_data_channel_candidate = "receive_data_channel_candidate",

  update_user_device_web_socket_sessions = "update_user_device_web_socket_sessions",
  alert = "alert",

  CLIENT_ERROR = "CLIENT_ERROR"
}

export interface CommandSocketMessage {
  data?: string,
  destinationDeviceId?: 'server' | string | null,
  initiator?: string | null,
  commandType?: CommandWebSocketMessageType
}
