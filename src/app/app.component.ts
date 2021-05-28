import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommandWebSocket } from "./http/web-socket/command-web-socket";
import { HttpDataAccessService } from "./http/http-data-access.service";
import { CommandWebSocketService } from "./service/command-web-socket.service";
import { take } from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    public commandWebSocket: CommandWebSocket,
    public commandWebSocketService: CommandWebSocketService,
    public httpDataAccessService: HttpDataAccessService,
    private _sanitizer: DomSanitizer
  ) {
    this.httpDataAccessService.handshake().pipe(
      take(1)
    ).toPromise().then((handshake) => {
      if (handshake) {
        this.commandWebSocket.connect()
      }
    })
  }
}
