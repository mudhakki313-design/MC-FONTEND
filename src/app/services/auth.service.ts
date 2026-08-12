import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  fullName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL =
    'http://localhost:8282/api/auth';

  private readonly TOKEN_KEY = 'imcms_token';
  private readonly USER_KEY = 'imcms_user';

  constructor(
    private http: HttpClient
  ) {}

  // ================================
  // LOGIN
  // ================================

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.API_URL}/login`,
        request
      )
      .pipe(

        tap(response => {

          /*
           * IMPORTANT:
           * sessionStorage is used instead of localStorage.
           *
           * This allows different users to login
           * in different browser tabs without
           * overwriting each other's token.
           */

          sessionStorage.setItem(
            this.TOKEN_KEY,
            response.token
          );

          sessionStorage.setItem(
            this.USER_KEY,
            JSON.stringify({
              username: response.username,
              fullName: response.fullName,
              role: response.role
            })
          );

        })

      );

  }


  // ================================
  // TOKEN
  // ================================

  getToken(): string | null {

    return sessionStorage.getItem(
      this.TOKEN_KEY
    );

  }


  // ================================
  // USER
  // ================================

  getUser(): LoginResponse | null {

    const user = sessionStorage.getItem(
      this.USER_KEY
    );

    if (!user) {
      return null;
    }

    try {

      return JSON.parse(user);

    } catch {

      return null;

    }

  }


  // ================================
  // ROLE
  // ================================

  getRole(): string | null {

    return this.getUser()?.role ?? null;

  }


  // ================================
  // AUTHENTICATED?
  // ================================

  isLoggedIn(): boolean {

    return !!this.getToken();

  }


  // ================================
  // LOGOUT
  // ================================

  logout(): void {

    sessionStorage.removeItem(
      this.TOKEN_KEY
    );

    sessionStorage.removeItem(
      this.USER_KEY
    );

  }

}