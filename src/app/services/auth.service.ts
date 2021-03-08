import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../shared/models/users';
import moment from 'moment';
import { map, shareReplay } from 'rxjs/operators';
import { Roles } from '../shared/models/roles';

const ROOT_ROUTE = 'api/auth';

export const TOKEN = 'token';
export const STORAGE = sessionStorage;

export interface TokenPayload {
  iat: number;
  id: string;
  role: Roles.Type;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public logout(): void {
    STORAGE.removeItem(TOKEN);
    STORAGE.removeItem('expiresAt');
  }

  public isLoggedIn(): boolean {
    const expiration = STORAGE.getItem('expiresAt');
    if (!expiration) {
      return false;
    }
    const expiresAt = JSON.parse(expiration);
    return moment().isBefore(moment(expiresAt));
  }

  public getUserInfo(): Observable<Users.User> {
    return this.httpClient.get<Users.User>(`${ROOT_ROUTE}/me`);
  }

  public register(request: Users.CreateRequest): Observable<void> {
    return this.httpClient.post<void>(`${ROOT_ROUTE}/register`, request);
  }

  public login(details: Users.LoginDetails): Observable<void> {
    return this.httpClient.post<Users.TokenResponse>(`${ROOT_ROUTE}/authenticate`, details).pipe(
      map((res) => {
        const expiresAt = moment().add(res.expiresIn, 'second');
        STORAGE.setItem(TOKEN, res.token);
        STORAGE.setItem('expiresAt', JSON.stringify(expiresAt.valueOf()));
      }),
      shareReplay(),
    );
  }
}
