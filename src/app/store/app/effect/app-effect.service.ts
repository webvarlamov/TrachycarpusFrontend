import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {loadAccessedUserDevices, loadAccessedUserDevicesSuccess} from "../reducer/app.reducer";
import {switchMap} from "rxjs/operators";
import {HttpDataProviderService} from "../../../http/http-data-provider.service";
import {of} from "rxjs";

@Injectable()
export class AppEffect {
  loadAccessedUserDevicesEffect$ = createEffect(() => {
    return this.actions$.pipe(
    );
  });

  constructor(
    private httpDataProviderService: HttpDataProviderService,
    private actions$: Actions
  ) { }
}
