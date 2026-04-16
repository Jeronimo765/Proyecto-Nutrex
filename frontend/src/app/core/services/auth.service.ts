import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  uuid?: string;
  message?: string;
}

const TOKEN_STORAGE_KEY = 'nutrex_auth_token';
const USER_STORAGE_KEY = 'nutrex_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.authApiUrl;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): Partial<AuthResponse> | null {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as Partial<AuthResponse>;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  }

  private persistSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        uuid: response.uuid,
        refreshToken: response.refreshToken
      })
    );
  }
}
