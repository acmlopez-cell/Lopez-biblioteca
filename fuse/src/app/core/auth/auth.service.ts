import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LocalStorage } from '../local-storage/local-storage';

interface SignInResponse {
  data: {
    accessToken: string;
  };
  message: string;
  title: string;
  version: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private localStorage = inject(LocalStorage);

  private readonly apiUrl = 'http://localhost:3000/api/v1';

  signIn(username: string, password: string): Observable<SignInResponse> {
    return this.http
      .post<SignInResponse>(`${this.apiUrl}/auth/sign-in`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          this.localStorage.setItem(
            'accessToken',
            response.data.accessToken
          );
        })
      );
  }

  signOut(): void {
    this.localStorage.removeItem('accessToken');
  }

  getAccessToken(): string | null {
    return this.localStorage.getItem('accessToken');
  }
}
