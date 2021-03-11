import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Users } from '../shared/models/users';
import { map, shareReplay } from 'rxjs/operators';
import { Roles } from '../shared/models/roles';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

const ROOT_ROUTE = 'api/auth';

export const TOKEN = 'token';
export const STORAGE = sessionStorage;

export interface TokenPayload {
  iat: number;
  sub: string;
  role: Roles.Type;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient: HttpClient;
  private router: Router;
  private tokenSubject: BehaviorSubject<string | null>;
  private userSubject?: BehaviorSubject<Users.User>;

  private constructor(httpClient: HttpClient, router: Router) {
    this.httpClient = httpClient;
    this.router = router;

    this.tokenSubject = new BehaviorSubject<string | null>(STORAGE.getItem(TOKEN));
  }

  public get token(): string | null {
    return this.tokenSubject.getValue();
  }

  public get isLoggedInn(): Observable<boolean> {
    if (!this.tokenSubject) {
      return of(false);
    }
    return this.tokenSubject.asObservable().pipe(
      map((res) => {
        if (!res) {
          return false;
        }
        const decoded = jwtDecode<TokenPayload>(res);
        const expires = new Date(decoded.exp * 1000);
        return expires.getTime() >= new Date().getTime();
      }),
    );
  }

  public logout(): void {
    STORAGE.removeItem(TOKEN);
    this.router.navigate(['/account/login']);
    this.tokenSubject.next(null);
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
        STORAGE.setItem(TOKEN, res.token);
        this.tokenSubject.next(res.token);
      }),
      shareReplay(),
    );
  }
}
