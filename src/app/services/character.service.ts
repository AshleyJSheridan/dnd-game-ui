import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ICharacterList} from '../interfaces/iCharacterList';
import {Observable} from 'rxjs';
import {INameSuggestionList} from '../interfaces/iNameSuggestionList';
import {ICharacterClassList} from '../interfaces/iCharacterClassList';
import {ICharacterClass} from '../interfaces/iCharacterClass';

@Injectable({providedIn: 'root'})

export class CharacterService {
    private apiUrl = 'http://127.0.0.1:8000/api';

    constructor(private http: HttpClient) {}

    public getCharacters(): Observable<ICharacterList> {
        return this.http.get<ICharacterList>(`${this.apiUrl}/characters`);
    }

    public getNameSuggestions(suggestionType: string): Observable<INameSuggestionList> {
        return this.http.get<INameSuggestionList>(`${this.apiUrl}/characters/name/${suggestionType}`);
    }

    // TODO type this
    public createCharacter(data: any) {
        return this.http.post(`${this.apiUrl}/characters`, data);
    }

    public getCharacterClasses(): Observable<Array<ICharacterClass>> {
        return this.http.get<Array<ICharacterClass>>(`${this.apiUrl}/characters/classes`);
    }
}


