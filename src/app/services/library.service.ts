import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Spell } from '../entities/Spell';
import { Creature } from '../entities/Creature';
import { CharacterRace } from '../entities/CharacterRace';
import { CharacterClass } from '../entities/CharacterClass';
import { CharacterBackground } from '../entities/CharacterBackground';

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

    public getCharacterRaces(): Observable<Array<CharacterRace>> {
        return this.http.get<Array<CharacterRace>>(
            `${this.apiUrl}/characters/races`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getCharacterClasses(): Observable<Array<CharacterClass>> {
        return this.http.get<Array<CharacterClass>>(
            `${this.apiUrl}/characters/classes`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getCharacterBackgrounds(): Observable<Array<CharacterBackground>> {
        return this.http.get<Array<CharacterBackground>>(
            `${this.apiUrl}/characters/backgrounds`,
            {headers: this.authService.getAuthHeader()}
        );
    }
}
