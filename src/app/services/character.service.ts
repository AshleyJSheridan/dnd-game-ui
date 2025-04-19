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
import { StartingEquipment } from '../entities/StartingEquipment';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class CharacterService {
    public apiUrl = 'http://127.0.0.1:8000/api';
    private charGuid: string = '';
    public character: Character | undefined;

    constructor(private http: HttpClient, private authService: AuthService) {}

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
        return this.http.get<Character>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getCharacters(): Observable<Array<Character>> {
        return this.http.get<Array<Character>>(`${this.apiUrl}/characters`, {headers: this.authService.getAuthHeader()});
    }

    public getNameSuggestions(suggestionType: string): Observable<INameSuggestionList> {
        return this.http.get<INameSuggestionList>(
            `${this.apiUrl}/names/${suggestionType}`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    // TODO type this
    public createCharacter(data: any) {
        return this.http.post(`${this.apiUrl}/characters`, data, {headers: this.authService.getAuthHeader()});
    }

    public getCharacterClasses(): Observable<Array<CharacterClass>> {
        return this.http.get<Array<CharacterClass>>(
            `${this.apiUrl}/characters/classes`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public setCharacterClass(data: {charClassId: number, classPathId: number}): Observable<Character> {
        return this.http.patch<Character>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {...data, updateType: 'class'},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getCharacterBackgrounds(): Observable<Array<CharacterBackground>> {
        return this.http.get<Array<CharacterBackground>>(
            `${this.apiUrl}/characters/backgrounds`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public setCharacterBackground(backgroundId: number, characteristics: Array<number>): Observable<Character> {
        return this.http.patch<Character>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {
                updateType: 'background',
                charBackgroundId: backgroundId,
                characteristics: characteristics
            },
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getCharacterRaces(): Observable<Array<CharacterRace>> {
        return this.http.get<Array<CharacterRace>>(
            `${this.apiUrl}/characters/races`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public setCharacterRace(charRaceId: number): Observable<ICharacter> {
        return this.http.patch<ICharacter>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'race', charRaceId: charRaceId},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getAbilityRoll(): Observable<DiceRolls> {
        return this.http.post<DiceRolls>(
            `${this.apiUrl}/game/dice`,
            {dice: {d6: 4}}, {headers: this.authService.getAuthHeader()}
        );
    }

    public setAbilityRolls(abilityRolls: {}): Observable<ICharacter> {
        return this.http.patch<ICharacter>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'abilities', abilityRolls: abilityRolls},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getLanguages(): Observable<Array<Language>> {
        return this.http.get<Array<Language>>(`${this.apiUrl}/game/languages`, {headers: this.authService.getAuthHeader()});
    }

    public setLanguages(languages: Array<number>): Observable<Character> {
        return this.http.patch<Character>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'languages', languages: languages},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getAvailableSpells(): Observable<AvailableSpells> {
        return this.http.get<AvailableSpells>(
            `${this.apiUrl}/characters/${this.charGuid}/spells/available`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public setSpells(spells: Array<number>): Observable<Character> {
        return this.http.patch<Character>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'spells', spells: spells},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public setSkills(skills: Array<number>): Observable<Character> {
        return this.http.patch<Character>(
            `${this.apiUrl}/characters/${this.charGuid}`,
            {updateType: 'skills', skills: skills},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public setCharacterPortrait(portrait: File): Observable<Character> {
        const formData = new FormData();
        formData.append('image', portrait);

        return this.http.post<Character>(
            `${this.apiUrl}/characters/${this.charGuid}/portrait`, formData, {headers: this.authService.getAuthHeader()}
        );
    }

    public getCharClassStartingEquipment(): Observable<Array<StartingEquipment>> {
        return this.http.get<Array<StartingEquipment>>(
            `${this.apiUrl}/characters/${this.charGuid}/startingEquipment`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public setCharStartingEquipment(data: any): Observable<Character> {
        return this.http.post<Character>(
            `${this.apiUrl}/characters/${this.charGuid}/startingEquipment`,
            data,
            {headers: this.authService.getAuthHeader()}
        );
    }
}
