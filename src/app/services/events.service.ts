import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createQueryParameters } from '../shared/http-utils';
import { Base } from '../shared/models/base';
import { Items } from '../shared/models/items';

const ROOT_ROUTE = 'api/events';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public createEvent(request: Items.EventCreateRequest): Observable<Base.CreateResponse> {
    return this.httpClient.post<Base.CreateResponse>(`${ROOT_ROUTE}`, request);
  }

  public getEvents(options?: Items.EventRequest): Observable<Items.Event[]> {
    return this.httpClient.get<Items.Event[]>(`${ROOT_ROUTE}`, createQueryParameters(options));
  }

  public changeEventsState(
    request: Items.ChangeEventsState,
  ): Observable<Base.MatchedCountResponse> {
    return this.httpClient.patch<Base.MatchedCountResponse>(`${ROOT_ROUTE}`, request);
  }
}
