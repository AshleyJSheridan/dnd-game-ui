import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../entities/Item';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class ItemService {
    public apiUrl = 'http://127.0.0.1:8000/api';

    constructor(private http: HttpClient, private authService: AuthService) {}

    public getItemsByType(itemType: string): Observable<Array<Item>> {
        return this.http.get<Array<Item>>(`${this.apiUrl}/game/items/${itemType}`, {headers: this.authService.getAuthHeader()});
    }
}
