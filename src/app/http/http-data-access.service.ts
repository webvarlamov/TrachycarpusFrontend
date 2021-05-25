import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpDataAccessService {
  private root = '/api'

  constructor(
    private httpClient: HttpClient
  ) {}

  public loadEntities<T>(domainType: string, options?: any): Observable<Pageable<T>> {
    return this.httpClient.get(`${this.root}/${domainType}`) as Observable<Pageable<T>>
  }
}

export interface Pageable<T> {
  _embedded: {
    [key: string]: Array<T>
  }
}
