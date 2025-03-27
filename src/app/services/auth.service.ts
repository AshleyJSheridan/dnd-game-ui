import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../entities/Token';
import { LocalStorageService } from './local-storage.service';

@Injectable({providedIn: 'root'})
export class AuthService {
    private apiUrl = 'http://127.0.0.1:8000/api';
    private headers: HttpHeaders = new HttpHeaders();

    constructor(private http: HttpClient, private storageService: LocalStorageService) {
        this.headers = this.headers.set('Authorization', 'Bearer ' + this.storageService.getItem('token'));
    }

    public login(email: string, password: string): Observable<Token> {
        return this.http.post<Token>(`${this.apiUrl}/user/login`,
            {email: email, password: password}
        );
    }

    public logout() {
        return this.http.post(`${this.apiUrl}/user/logout`, {}, {headers: this.headers});
    }
}
