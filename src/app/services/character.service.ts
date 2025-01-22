import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ICharacterList} from '../interfaces/iCharacterList';
import {Observable} from 'rxjs';
import {INameSuggestionList} from '../interfaces/iNameSuggestionList';

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
}


