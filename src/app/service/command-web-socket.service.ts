import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import { HttpDataAccessService } from "../http/http-data-access.service";
import { CommandWebSocket } from "../http/web-socket/command-web-socket";
import { HasSubscriptions } from "../model/common/has-subscriptions";
import { delay, tap } from "rxjs/operators";
import { loadAccessedUserDevices } from "../store/device-list/reducer/device-list.reducer";

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
      delay(1000),
      tap(event$ => {
        let data = JSON.parse(event$.data);
        if (data.commandType === 'UPDATE_USER_DEVICE_WEB_SOCKET_SESSIONS') {
          this.store.dispatch(loadAccessedUserDevices())
        }
      })
    ).subscribe()
  }
}
