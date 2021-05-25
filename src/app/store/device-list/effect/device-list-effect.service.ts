import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {loadAccessedUserDevices, loadAccessedUserDevicesSuccess} from "../reducer/device-list.reducer";
import {switchMap} from "rxjs/operators";
import {HttpDataProviderService} from "../../../http/http-data-provider.service";

@Injectable()
export class DeviceListEffect {
  loadAccessedUserDevicesEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAccessedUserDevices),
      switchMap(action => {
        return  this.httpDataProviderService.getAccessedUserDevices();
      }),
      switchMap(devices => {
        return [loadAccessedUserDevicesSuccess({ userDevices: devices })];
      })
    );
  });

  constructor(
    private httpDataProviderService: HttpDataProviderService,
    private actions$: Actions
  ) { }
}
