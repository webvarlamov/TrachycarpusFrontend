import { Injectable } from '@angular/core';
import { HttpDataAccessService } from "./http-data-access.service";
import { Observable } from "rxjs";
import { UserDevice } from "../store/device-list/model/UserDevice";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HttpDataProviderService {

  constructor(
    private httpDataAccessService: HttpDataAccessService
  ) { }

  public getAccessedUserDevices(): Observable<Array<UserDevice>>  {
    const key = "userDevices";
    return this.httpDataAccessService.loadEntities<UserDevice>(`${key}/accessed`).pipe(
      map(pageable => {
        return pageable._embedded[key]
      })
    );
  }
}
