import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";

@Injectable()
export class DeviceIdSaverInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const localStorageUserDeviceId = localStorage.getItem("user-device-id");

    let clonedRequest = null;

    if (localStorageUserDeviceId !== null) {
      clonedRequest = request.clone({headers: request.headers.append("user-device-id", localStorageUserDeviceId)})
    } else {
      clonedRequest = request.clone();
    }

    return next.handle(clonedRequest).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const headersUserDeviceId = event.headers.get("user-device-id");
          if (headersUserDeviceId !== null ) localStorage.setItem("user-device-id", headersUserDeviceId)
        }
        return event;
      })
    );
  }
}
