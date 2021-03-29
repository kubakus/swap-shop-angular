import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createQueryParameters } from '../shared/http-utils';
import { Base } from '../shared/models/base';
import { Items } from '../shared/models/items';

const ROOT_ROUTE = 'api/wanted';

@Injectable({ providedIn: 'root' })
export class WantedService {
  private httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public createWanted(request: Items.CreateWanted): Observable<Base.CreateResponse> {
    return this.httpClient.post<Base.CreateResponse>(`${ROOT_ROUTE}`, request);
  }

  public getWanted(options?: Items.WantedRequest): Observable<Items.Wanted[]> {
    return this.httpClient.get<Items.Wanted[]>(`${ROOT_ROUTE}`, createQueryParameters(options));
  }

  public changeWantedState(
    request: Items.ChangeOffersState,
  ): Observable<Base.MatchedCountResponse> {
    return this.httpClient.patch<Base.MatchedCountResponse>(`${ROOT_ROUTE}`, request);
  }
}
