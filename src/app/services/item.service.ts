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

    public updateItem(charGuid: string, item: Item, data: any): Observable<Array<Item>> {
        return this.http.patch<Array<Item>>(
            `${this.apiUrl}/characters/${charGuid}/inventory/${item.guid}`,
            data,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public removeItem(charGuid: string, item: Item): Observable<Array<Item>> {
        return this.http.delete<Array<Item>>(
            `${this.apiUrl}/characters/${charGuid}/inventory/${item.guid}`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public addItem(charGuid: string, item: Item, quantity: number): Observable<Array<Item>> {
        const data = {
            itemId: item.id,
            quantity: quantity,
        }

        return this.http.post<Array<Item>>(
            `${this.apiUrl}/characters/${charGuid}/inventory`,
            data,
            {headers: this.authService.getAuthHeader()}
        );
    }
}
