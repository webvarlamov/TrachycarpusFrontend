import {Observable, Subject, Subscription} from "rxjs";
import { HttpUtils } from "../http.utils";
import {shareReplay, tap} from "rxjs/operators";

export class WebSocketObservable {
  public webSocket: WebSocket | undefined;
  public path

  public subscriptions: Array<Subscription> = new Array<Subscription>();

  public readonly onmessageSubject: Subject<MessageEvent> = new Subject<MessageEvent>();

  public readonly onclose$: Subject<any> = new Subject<any>();
  public readonly onerror$: Subject<any> = new Subject<any>();
  public readonly onmessage$: Observable<MessageEvent> = this.onmessageSubject.pipe(
    shareReplay({refCount: true, bufferSize: 1})
  )
  public readonly onopen$: Subject<any> = new Subject<any>();

  readonly onclose = (event: CloseEvent) => {
    this.onclose$.next(event)
  };

  readonly onerror = (event: Event) => {
    this.onerror$.next(event)
  };

  readonly onmessage = (event: MessageEvent) => {
    this.onmessageSubject.next(event)
  };
  readonly onopen = (event: Event) => {
    this.onopen$.next(event)
  };

  public connect(): void {
    this.webSocket = new WebSocket((
        HttpUtils.isHttps() ? "wss://" : "ws://")
      + HttpUtils.getHostName()
      + (HttpUtils.isDev() ? ":8081" : "")
      + "/" + this.path + this.withQueryParams())

    this.webSocket.onclose = this.onclose;
    this.webSocket.onerror = this.onerror;
    this.webSocket.onmessage = this.onmessage;
    this.webSocket.onopen = this.onopen;
  }

  public send(message: string) {
    if (this.webSocket !== undefined) {
      this.webSocket?.send(message);
    } else {
      console.error(`WebSocket: ${this.path} is undefined!`)
    }
  }

  public withQueryParams(): string {
    return ""
  }

  constructor(path: string) {
    this.path = path;
  }
}
