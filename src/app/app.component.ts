import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommandWebSocket } from "./http/web-socket/command-web-socket";
import { HttpDataAccessService } from "./http/http-data-access.service";
import { CommandWebSocketService } from "./service/command-web-socket.service";
import { take } from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";
import {UserDeviceModel} from "./store/device-list/model/UserDevice";
import {Store} from "@ngrx/store";
import {AppState, selectShowVideoCallComponent} from "./store/app/reducer/app.reducer";
import {AppStore} from "./store/app-store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public showDetails_mobile = false;
  public showVideoCall$ = this.store.select(selectShowVideoCallComponent)

  constructor(
    public commandWebSocket: CommandWebSocket,
    public commandWebSocketService: CommandWebSocketService,
    public httpDataAccessService: HttpDataAccessService,
    private _sanitizer: DomSanitizer,
    private store: Store<AppStore>
  ) {
    this.httpDataAccessService.handshake().pipe(
      take(1)
    ).toPromise().then((handshake) => {
      if (handshake) {
        this.commandWebSocket.connect()
      }
    })
  }

  public onDeviceSelectFn($event: UserDeviceModel): void {
    this.showDetails_mobile = true;
  }

  public onBackFn(): void {
    this.showDetails_mobile = false
  }
}
