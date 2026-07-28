import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../entities/User';
import { AuthService } from './auth.service';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
    public apiUrl = environment.apiUrl;
    private user: any = null;

    constructor(private http: HttpClient, private authService: AuthService) {}

    public setUser(user: any): void {
        this.user = user;
    }

    public getUser(): Observable<User> {
        if (!this.user) {
            return this.http.get<User>(
                `${this.apiUrl}/user`,
                {headers: this.authService.getAuthHeader()}
            );
        }

        return this.user;
    }

    public updateUser(user: User, newPassword: string | null = null, passwordConfirm: string | null = null): Observable<User> {
        const data: any = {
            name: user.name,
            email: user.email,
        };

        if (newPassword) {
            data.password = newPassword;
            data.password_confirmation = passwordConfirm;
        }

        return this.http.patch<User>(
            `${this.apiUrl}/user`,
            data,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public deleteUser(): Observable<any> {
        return this.http.delete<any>(
            `${this.apiUrl}/user`,
            {headers: this.authService.getAuthHeader()}
        );
    }
}
