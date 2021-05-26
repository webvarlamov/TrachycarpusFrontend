import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import { HttpDataAccessService } from "../http/http-data-access.service";
import { CommandWebSocket } from "../http/web-socket/command-web-socket";
import { HasSubscriptions } from "../model/common/has-subscriptions";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CommandWebSocketService extends HasSubscriptions {
  constructor(
    private store: Store,
    private httpDataAccessService: HttpDataAccessService,
    private commandWebSocket: CommandWebSocket
  ) {
    super();
    this.commandWebSocket.onmessage$.pipe(
      tap(message => {
        console.log(message)
      })
    ).subscribe()
  }
}
