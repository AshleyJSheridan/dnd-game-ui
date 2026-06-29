import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../entities/Item';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class ItemService {
    public apiUrl = environment.apiUrl;

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

    public getItemByTypeAndRarity(itemType: string, rarity: string): Observable<Item> {
        return this.http.get<Item>(
            `${this.apiUrl}/game/items/${itemType}/random/${rarity}`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public addItemToCharInventory(charGuid: string, item: Item): Observable<any> {
        // reset the item id, as we have to assume the user has modified it, and we'll add it as a custom item.
        item.id = 0;

        return this.http.post(
            `${this.apiUrl}/characters/${charGuid}/inventory/customItem`,
            {item: item},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getGeneratedItems(): Observable<Array<Item>> {
        return this.http.get<Array<Item>>(
            `${this.apiUrl}/game/items/generated`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public addGeneratedItem(item: Item): Observable<Array<Item>> {
        return this.http.post<Array<Item>>(
            `${this.apiUrl}/game/items/generated`,
            {item: item},
            {headers: this.authService.getAuthHeader()}
        );
    }
}
