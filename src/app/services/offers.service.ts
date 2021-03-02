import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Base } from "../shared/models/base";
import { SwapShopServices } from "../shared/models/swap-shop-services";

const ROOT_ROUTE = 'api/offers';

@Injectable({ providedIn: 'root' })
export class OffersService {
    private httpClient: HttpClient;

    private constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    public createOffer(request: SwapShopServices.CreateOffer): Observable<Base.CreateResponse> {
        return this.httpClient.post<Base.CreateResponse>(`${ROOT_ROUTE}`, request);
    }
}