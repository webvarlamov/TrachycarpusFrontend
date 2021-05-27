import { Injectable } from '@angular/core';
import { WebSocketObservable } from "./web-socket-observable";

@Injectable({
  providedIn: 'root'
})
export class CommandWebSocket extends WebSocketObservable {

  constructor() {
    super('command-socket')
  }

  public sendCommand(data: string, destination: WebSocketSessionIdOrServer, commandType: CommandType): void {
    super.send(JSON.stringify({
      data,
      destination,
      commandType
    }));
  }
}

export enum CommandType {
  OfferFromRemote = "offer-from-remote",
  AnswerFromRemote = "answer-from-remote",
  CandidateFromRemote = "candidate-from-remote"
}

class WebSocketSessionIdOrServer extends String {
  public static SERVER = "server"
}
