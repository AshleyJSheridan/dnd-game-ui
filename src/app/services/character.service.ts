import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INameSuggestionList } from '../interfaces/iNameSuggestionList';
import { CharacterClass } from '../entities/CharacterClass';
import { ICharacter } from '../interfaces/iCharacter';
import { CharacterBackground } from '../entities/CharacterBackground';

@Injectable({providedIn: 'root'})
export class CharacterService {
    private apiUrl = 'http://127.0.0.1:8000/api';
    private charGuid: string = '';

    constructor(private http: HttpClient) {}

    public setCharGuid(charGuid: string): void {
        this.charGuid = charGuid;
    }

    public getCharacter(): Observable<any> {
        return this.http.get(`${this.apiUrl}/characters/${this.charGuid}`);
    }

    public getCharacters(): Observable<Array<ICharacter>> {
        return this.http.get<Array<ICharacter>>(`${this.apiUrl}/characters`);
    }

    public getNameSuggestions(suggestionType: string): Observable<INameSuggestionList> {
        return this.http.get<INameSuggestionList>(`${this.apiUrl}/characters/name/${suggestionType}`);
    }

    // TODO type this
    public createCharacter(data: any) {
        return this.http.post(`${this.apiUrl}/characters`, data);
    }

    public getCharacterClasses(): Observable<Array<CharacterClass>> {
        return this.http.get<Array<CharacterClass>>(`${this.apiUrl}/characters/classes`);
    }

    public setCharacterClass(data: {charClassId: number}): Observable<ICharacter> {
        return this.http.patch<ICharacter>(`${this.apiUrl}/characters/${this.charGuid}`, {...data, updateType: 'class'});
    }

    public getCharacterBackgrounds(): Observable<Array<CharacterBackground>> {
        return this.http.get<Array<CharacterBackground>>(`${this.apiUrl}/characters/backgrounds`);
    }

    public setCharacterBackground(backgroundId: number, characteristics: Array<number>): Observable<ICharacter> {
        return this.http.patch<ICharacter>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {
                updateType: 'background',
                charBackgroundId: backgroundId,
                characteristics: characteristics
            }
        );
    }
}


