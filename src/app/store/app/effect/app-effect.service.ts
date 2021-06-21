import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpDataProviderService} from "../../../http/http-data-provider.service";

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
