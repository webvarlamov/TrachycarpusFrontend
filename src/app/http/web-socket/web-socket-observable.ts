import { Subject, Subscription } from "rxjs";
import { HttpUtils } from "../http.utils";

export class WebSocketObservable extends WebSocket {
  public subscriptions: Array<Subscription> = new Array<Subscription>();

  public readonly onclose$: Subject<any> = new Subject<any>();
  public readonly onerror$: Subject<any> = new Subject<any>();
  public readonly onmessage$: Subject<any> = new Subject<any>();
  public readonly onopen$: Subject<any> = new Subject<any>();

  readonly onclose = (event: CloseEvent) => { this.onclose$.next(event) };
  readonly onerror = (event: Event) => { this.onerror$.next(event) };
  readonly onmessage = (event: MessageEvent) => { this.onmessage$.next(event) };
  readonly onopen = (event: Event) => { this.onopen$.next(event) };

  constructor(path: string) {
    super(
      (
        HttpUtils.isHttps() ? "wss://" : "ws://")
      + HttpUtils.getHostName()
      + (HttpUtils.isDev() ? ":8081" : "")
      + "/" + path
    );
  }
}
