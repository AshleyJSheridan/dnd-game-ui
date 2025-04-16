import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs';
import { Item } from '../entities/Item';

@Injectable({providedIn: 'root'})
export class ItemService {
    public apiUrl = 'http://127.0.0.1:8000/api';
    private headers: HttpHeaders = new HttpHeaders();

    constructor(private http: HttpClient, private storageService: LocalStorageService) {
        this.headers = this.headers.set('Authorization', 'Bearer ' + this.storageService.getItem('access_token'));
    }

    public getItemsByType(itemType: string): Observable<Array<Item>> {
        return this.http.get<Array<Item>>(`${this.apiUrl}/game/items/${itemType}`, {headers: this.headers});
    }
}
