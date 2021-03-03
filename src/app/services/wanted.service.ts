import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Base } from '../shared/models/base';
import { SwapShopServices } from '../shared/models/swap-shop-services';

const ROOT_ROUTE = 'api/wanted';

@Injectable({ providedIn: 'root' })
export class WantedService {
  private httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public createWanted(request: SwapShopServices.CreateWanted): Observable<Base.CreateResponse> {
    return this.httpClient.post<Base.CreateResponse>(`${ROOT_ROUTE}`, request);
  }
}
