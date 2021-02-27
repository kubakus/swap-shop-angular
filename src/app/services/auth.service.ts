import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Users } from "../shared/models/users";
import moment from 'moment'
import { map, shareReplay } from 'rxjs/operators';

const ROOT_ROUTE = 'api/users'

@Injectable({ providedIn: 'root' })
export class AuthService {
    private httpClient: HttpClient;

    private constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    public register(request: Users.CreateUserRequest): Observable<void> {
        return this.httpClient.post<void>(`${ROOT_ROUTE}/register`, request)
    }

    public login(details: Users.LoginDetails) {
        return this.httpClient.post<Users.TokenResponse>(`${ROOT_ROUTE}/authenticate`, details).pipe(
            map(res => {
                const expiresAt = moment().add(res.expiresIn, 'second')
                localStorage.setItem('token', res.token);
                localStorage.setItem('expiresAt', JSON.stringify(expiresAt.valueOf()))
            }),
            shareReplay()
        )
    }

    public isLoggedIn(): boolean {
        const expiration = localStorage.getItem('expiresAt');
        if (!expiration) {
            return false;
        }
        const expiresAt = JSON.parse(expiration);
        return moment().isBefore(moment(expiresAt))
    }
}