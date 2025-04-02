import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { LocalStorageService } from './local-storage.service';

@Injectable({providedIn: 'root'})
export class CharacterService {
    public apiUrl = 'http://127.0.0.1:8000/api';
    private charGuid: string = '';
    public character: Character | undefined;
    private headers: HttpHeaders = new HttpHeaders();

    constructor(private http: HttpClient, private storageService: LocalStorageService) {
        this.headers = this.headers.set('Authorization', 'Bearer ' + this.storageService.getItem('token'));
    }

    public setCharGuid(charGuid: string): void {
        this.charGuid = charGuid;
    }

    public setCharacter(character: Character): void {
        this.character = character;
    }

    public getCharGuid(): string {
        return this.charGuid;
    }

    public getCharacter(): Observable<Character> {
        return this.http.get<Character>(`${this.apiUrl}/characters/${this.charGuid}`, {headers: this.headers});
    }

    public getCharacters(): Observable<Array<Character>> {
        return this.http.get<Array<Character>>(`${this.apiUrl}/characters`, {headers: this.headers});
    }

    public getNameSuggestions(suggestionType: string): Observable<INameSuggestionList> {
        return this.http.get<INameSuggestionList>(
            `${this.apiUrl}/names/${suggestionType}`,
            {headers: this.headers}
        );
    }

    // TODO type this
    public createCharacter(data: any) {
        return this.http.post(`${this.apiUrl}/characters`, data, {headers: this.headers});
    }

    public getCharacterClasses(): Observable<Array<CharacterClass>> {
        return this.http.get<Array<CharacterClass>>(`${this.apiUrl}/characters/classes`, {headers: this.headers});
    }

    public setCharacterClass(data: {charClassId: number, classPathId: number}): Observable<ICharacter> {
        return this.http.patch<ICharacter>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {...data, updateType: 'class'},
            {headers: this.headers}
        );
    }

    public getCharacterBackgrounds(): Observable<Array<CharacterBackground>> {
        return this.http.get<Array<CharacterBackground>>(`${this.apiUrl}/characters/backgrounds`, {headers: this.headers});
    }

    public setCharacterBackground(backgroundId: number, characteristics: Array<number>): Observable<ICharacter> {
        return this.http.patch<ICharacter>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {
                updateType: 'background',
                charBackgroundId: backgroundId,
                characteristics: characteristics
            },
            {headers: this.headers}
        );
    }

    public getCharacterRaces(): Observable<Array<CharacterRace>> {
        return this.http.get<Array<CharacterRace>>(`${this.apiUrl}/characters/races`, {headers: this.headers});
    }

    public setCharacterRace(charRaceId: number): Observable<ICharacter> {
        return this.http.patch<ICharacter>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'race', charRaceId: charRaceId},
            {headers: this.headers}
        );
    }

    public getAbilityRoll(): Observable<DiceRolls> {
        return this.http.post<DiceRolls>(`${this.apiUrl}/game/dice`, {dice: {d6: 4}}, {headers: this.headers});
    }

    public setAbilityRolls(abilityRolls: {}): Observable<ICharacter> {
        return this.http.patch<ICharacter>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'abilities', abilityRolls: abilityRolls},
            {headers: this.headers}
        );
    }

    public getLanguages(): Observable<Array<Language>> {
        return this.http.get<Array<Language>>(`${this.apiUrl}/game/languages`, {headers: this.headers});
    }

    public setLanguages(languages: Array<number>): Observable<Character> {
        return this.http.patch<Character>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'languages', languages: languages},
            {headers: this.headers}
        );
    }

    public getAvailableSpells(): Observable<AvailableSpells> {
        return this.http.get<AvailableSpells>(
            `${this.apiUrl}/characters/${this.charGuid}/spells/available`,
            {headers: this.headers}
        );
    }

    public setSpells(spells: Array<number>): Observable<Character> {
        return this.http.patch<Character>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'spells', spells: spells},
            {headers: this.headers}
        );
    }

    public setSkills(skills: Array<number>): Observable<Character> {
        return this.http.patch<Character>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'skills', skills: skills},
            {headers: this.headers}
        );
    }

    public setCharacterPortrait(portrait: File): Observable<Character> {
        const formData = new FormData();
        formData.append('image', portrait);

        return this.http.post<Character>(
            `${this.apiUrl}/characters/${this.charGuid}/portrait`, formData, {headers: this.headers}
        );
    }
}


