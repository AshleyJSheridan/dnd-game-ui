import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../entities/Token';

@Injectable({providedIn: 'root'})
export class AuthService {
    private apiUrl = 'http://127.0.0.1:8000/api';

    constructor(private http: HttpClient) {}

    public login(email: string, password: string): Observable<Token> {
        return this.http.post<Token>(`${this.apiUrl}/user/login`,
            {email: email, password: password}
        );
    }
}
