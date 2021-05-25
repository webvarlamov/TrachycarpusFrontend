import { Component } from '@angular/core';
import { CommandWebSocket } from "./http/web-socket/command-web-socket";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public commandWebSocket: CommandWebSocket
  ) {}
}
