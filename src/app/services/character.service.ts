import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INameSuggestionList } from '../interfaces/iNameSuggestionList';
import { CharacterClass } from '../entities/CharacterClass';
import { ICharacter } from '../interfaces/iCharacter';
import { CharacterBackground } from '../entities/CharacterBackground';
import { CharacterRace } from '../entities/CharacterRace';
import { Character } from '../entities/Character';
import { DiceRolls } from '../entities/DiceRolls';
import { Language } from '../entities/Language';
import { AvailableSpells } from '../entities/AvailableSpells';

@Injectable({providedIn: 'root'})
export class CharacterService {
    private apiUrl = 'http://127.0.0.1:8000/api';
    private charGuid: string = '';

    constructor(private http: HttpClient) {}

    public setCharGuid(charGuid: string): void {
        this.charGuid = charGuid;
    }

    public getCharGuid(): string {
        return this.charGuid;
    }

    public getCharacter(): Observable<Character> {
        return this.http.get<Character>(`${this.apiUrl}/characters/${this.charGuid}`);
    }

    public getCharacters(): Observable<Array<Character>> {
        return this.http.get<Array<Character>>(`${this.apiUrl}/characters`);
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

    public setCharacterClass(data: {charClassId: number, classPathId: number}): Observable<ICharacter> {
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

    public getCharacterRaces(): Observable<Array<CharacterRace>> {
        return this.http.get<Array<CharacterRace>>(`${this.apiUrl}/characters/races`);
    }

    public setCharacterRace(charRaceId: number): Observable<ICharacter> {
        return this.http.patch<ICharacter>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'race', charRaceId: charRaceId}
        );
    }

    public getAbilityRoll(): Observable<DiceRolls> {
        return this.http.post<DiceRolls>(`${this.apiUrl}/game/dice`, {dice: {d6: 4}});
    }

    public setAbilityRolls(abilityRolls: {}): Observable<ICharacter> {
        return this.http.patch<ICharacter>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'abilities', abilityRolls: abilityRolls}
        );
    }

    public getLanguages(): Observable<Array<Language>> {
        return this.http.get<Array<Language>>(`${this.apiUrl}/game/languages`);
    }

    public setLanguages(languages: Array<number>): Observable<Character> {
        return this.http.patch<Character>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'languages', languages: languages}
        );
    }

    public getAvailableSpells(): Observable<AvailableSpells> {
        return this.http.get<AvailableSpells>(`${this.apiUrl}/characters/${this.charGuid}/spells/available`);
    }
}


