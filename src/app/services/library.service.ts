import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Spell } from '../entities/Spell';
import { Creature } from '../entities/Creature';

@Injectable({providedIn: 'root'})
export class LibraryService {
    public apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private authService: AuthService) {}

    public getAllSpells(): Observable<Array<Spell>> {
        return this.http.get<Array<Spell>>(
            `${this.apiUrl}/game/spells`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getAllMonsters(): Observable<Array<Creature>> {
        return this.http.get<Array<Creature>>(
            `${this.apiUrl}/creatures`,
            {headers: this.authService.getAuthHeader()}
        );
    }
}
