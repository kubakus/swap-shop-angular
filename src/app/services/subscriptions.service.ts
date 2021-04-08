import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createQueryParameters } from '../shared/http-utils';
import { Subscriptions } from '../shared/models/subscriptions';

const ROOT_ROUTE = 'api/subscriptions';

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
  private httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public createSubscription(request: Subscriptions.CreateRequest): Observable<void> {
    return this.httpClient.post<void>(`${ROOT_ROUTE}`, request);
  }

  public getSubscriptions(
    request?: Subscriptions.Request,
  ): Observable<Subscriptions.Subscription[]> {
    return this.httpClient.get<Subscriptions.Subscription[]>(
      `${ROOT_ROUTE}`,
      createQueryParameters(request),
    );
  }
}
