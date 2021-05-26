import { Subject, Subscription } from "rxjs";
import { HttpUtils } from "../http.utils";

export class WebSocketObservable {
  public webSocket: WebSocket | undefined;
  public path

  public subscriptions: Array<Subscription> = new Array<Subscription>();

  public readonly onclose$: Subject<any> = new Subject<any>();
  public readonly onerror$: Subject<any> = new Subject<any>();
  public readonly onmessage$: Subject<any> = new Subject<any>();
  public readonly onopen$: Subject<any> = new Subject<any>();

  readonly onclose = (event: CloseEvent) => { this.onclose$.next(event) };
  readonly onerror = (event: Event) => { this.onerror$.next(event) };
  readonly onmessage = (event: MessageEvent) => { this.onmessage$.next(event) };
  readonly onopen = (event: Event) => { this.onopen$.next(event) };

  public connect(): void {
    this.webSocket = new WebSocket((
        HttpUtils.isHttps() ? "wss://" : "ws://")
      + HttpUtils.getHostName()
      + (HttpUtils.isDev() ? ":8081" : "")
      + "/" + this.path)

    this.webSocket.onclose = this.onclose;
    this.webSocket.onerror = this.onerror;
    this.webSocket.onmessage = this.onmessage;
    this.webSocket.onopen = this.onopen;
  }

  send(message: string) {
    if (this.webSocket !== undefined) {
      this.webSocket?.send(message);
    } else {
      console.error(`WebSocket: ${this.path} is undefined!`)
    }
  }

  constructor(path: string) {
    this.path = path;
  }
}
