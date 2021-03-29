import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createQueryParameters } from '../shared/http-utils';
import { Base } from '../shared/models/base';
import { Items } from '../shared/models/items';

const ROOT_ROUTE = 'api/offers';

@Injectable({ providedIn: 'root' })
export class OffersService {
  private httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public createOffer(request: Items.CreateOffer): Observable<Base.CreateResponse> {
    return this.httpClient.post<Base.CreateResponse>(`${ROOT_ROUTE}`, request);
  }

  public getOffers(options?: Items.OfferRequest): Observable<Items.Offer[]> {
    return this.httpClient.get<Items.Offer[]>(`${ROOT_ROUTE}`, createQueryParameters(options));
  }

  public changeOffersState(
    request: Items.ChangeOffersState,
  ): Observable<Base.MatchedCountResponse> {
    return this.httpClient.patch<Base.MatchedCountResponse>(`${ROOT_ROUTE}`, request);
  }
}
