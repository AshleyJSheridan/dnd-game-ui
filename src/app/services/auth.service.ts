import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../entities/Token';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
    private apiUrl = 'http://127.0.0.1:8000/api';

    constructor(private http: HttpClient, private storageService: LocalStorageService, private router: Router) {}

    public getAuthHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer ' + this.storageService.getItem('access_token'));

        return headers;
    }

    public login(email: string, password: string): Observable<Token> {
        return this.http.post<Token>(`${this.apiUrl}/user/login`,
            {email: email, password: password}
        );
    }

    public logout() {
        return this.http.post(`${this.apiUrl}/user/logout`, {}, {headers: this.getAuthHeader()});
    }

    public heartbeat() {
        return this.http.get(`${this.apiUrl}/heartbeat`, {headers: this.getAuthHeader()});
    }

    public refreshToken() {
        return this.http.post(`${this.apiUrl}/user/refresh`, {}, {headers: this.getAuthHeader()}).subscribe({
            next: (tokenResponse) => {
                this.storageService.setItem('access_token', (tokenResponse as Token).access_token);
                this.storageService.setItem('refresh_token', (tokenResponse as Token).refresh_token);
                this.storageService.setItem('expires_in', (tokenResponse as Token).expires_in.toString());
            },
            error: (error) => {
                this.storageService.removeItem('access_token');
                this.storageService.removeItem('refresh_token');
                this.storageService.removeItem('expires_in');

                this.router.navigate(['/login']);
            }
        });
    }
}
