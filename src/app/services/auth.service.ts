import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Users } from '../shared/models/users';
import { map, shareReplay, take, tap } from 'rxjs/operators';
import { Roles } from '../shared/models/roles';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

const ROOT_ROUTE = 'api/auth';

export interface TokenPayload {
  iat: number;
  sub: string;
  roles: Roles.Type[];
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient: HttpClient;
  private router: Router;
  // those types are global, couldn't find how to import them
  // eslint-disable-next-line no-undef
  private refreshTokenTimeout?: NodeJS.Timeout;

  private tokenSubject: BehaviorSubject<string | undefined>;
  // private userSubject?: BehaviorSubject<Users.User>;
  private rolesSubject: BehaviorSubject<Roles.Type[] | undefined>;
  private usersLookupSubject?: BehaviorSubject<Users.User[]>;

  private constructor(httpClient: HttpClient, router: Router) {
    this.httpClient = httpClient;
    this.router = router;

    this.tokenSubject = new BehaviorSubject<string | undefined>(undefined);
    // Swap it all to userSubject using /me endpoint
    this.rolesSubject = new BehaviorSubject<Roles.Type[] | undefined>(undefined);
    // this.usersLookupSubject?: BehaviorSubject<Users.User[]>;
  }

  public get token(): string | undefined {
    return this.tokenSubject.getValue();
  }

  public get users(): Observable<Users.User[]> {
    if (!this.hasRole(Roles.Type.ADMIN)) {
      return of([]);
    }
    if (!this.usersLookupSubject) {
      return this.httpClient.get<Users.User[]>(`${ROOT_ROUTE}`);
    }
    return this.usersLookupSubject.asObservable();
  }

  public hasRole(role: Roles.Type): boolean {
    if (!this.rolesSubject) {
      return false;
    }
    return Boolean(this.rolesSubject.getValue()?.includes(role));
  }

  public get isLoggedIn(): Observable<boolean> {
    if (!this.tokenSubject) {
      return of(false);
    }
    return this.tokenSubject.asObservable().pipe(
      map((res) => {
        if (!res) {
          return false;
        }
        const decoded = jwtDecode<TokenPayload>(res);
        const expires = this.getExpireTime(decoded.exp);
        return expires.getTime() >= new Date().getTime();
      }),
    );
  }

  public logout(): void {
    this.httpClient.post<void>(`${ROOT_ROUTE}/revoke-token`, {}).pipe(take(1)).subscribe();
    this.tokenSubject.next(undefined);
    this.rolesSubject.next(undefined);
    this.router.navigate(['/login']);
    this.stopRefreshTokenTimer();
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
        this.tokenSubject.next(res.token);
        this.rolesSubject.next(this.getRoles(res.token));
        this.startRefreshTokenTimer();
      }),
      shareReplay(),
    );
  }

  public refreshToken(): Observable<Users.TokenResponse> {
    return this.httpClient.post<Users.TokenResponse>(`${ROOT_ROUTE}/refresh-token`, {}).pipe(
      tap((token) => {
        this.tokenSubject.next(token.token);
        this.rolesSubject.next(this.getRoles(token.token));
        this.startRefreshTokenTimer();
      }),
    );
  }

  // Sets a timer to refresh-token 1 min before expiration
  private startRefreshTokenTimer() {
    const token = this.tokenSubject.getValue();
    if (!token) {
      throw new Error('Cannot start refresh timeout without a token');
    }
    const decoded = jwtDecode<TokenPayload>(token);
    const expires = this.getExpireTime(decoded.exp);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().pipe(take(1)).subscribe(),
      timeout,
    );
  }

  private stopRefreshTokenTimer() {
    if (!this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  private getExpireTime(exp: number): Date {
    return new Date(exp * 1000);
  }

  private getRoles(token: string): Roles.Type[] {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.roles;
  }
}
