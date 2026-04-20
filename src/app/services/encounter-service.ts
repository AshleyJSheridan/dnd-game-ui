import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Encounter } from '../entities/Encounter';
import { Creature } from '../entities/Creature';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class EncounterService {
    public apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private authService: AuthService) {}

    public createEncounter(environment: string, difficulty: number, campaignGuid: string, charLevels: string): Observable<Encounter> {
        return this.http.post<Encounter>(
            `${this.apiUrl}/encounters`,
            {},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getExistingEncounters(): Observable<Array<Encounter>> {
        return this.http.get<Array<Encounter>>(
            `${this.apiUrl}/encounters`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public updateEncounterCreature(encounterGuid: string, creatureGuid: string, creature: Creature): Observable<Encounter> {
        return this.http.patch<Encounter>(
            `${this.apiUrl}/encounters/${encounterGuid}/creatures/${creatureGuid}`,
            {creature_details: creature},
            {headers: this.authService.getAuthHeader()}
        )
    }

    public deleteEncounter(encounterGuid: string): Observable<Object> {
        return this.http.delete(
            `${this.apiUrl}/encounters/${encounterGuid}`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public deleteCreature(encounterGuid: string, creatureGuid: string): Observable<Object> {
        return this.http.delete(
            `${this.apiUrl}/encounters/${encounterGuid}/creatures/${creatureGuid}`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public addCreatureToEncounter(encounterGuid: string, creatureId: number): Observable<Encounter> {
        return this.http.post<Encounter>(
            `${this.apiUrl}/encounters/${encounterGuid}/creatures`,
            {creature_id: creatureId},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public updateEncounterName(encounterGuid: string, encounterName: string): Observable<Encounter> {
        return this.http.patch<Encounter>(
            `${this.apiUrl}/encounters/${encounterGuid}`,
            {encounter_name: encounterName},
            {headers: this.authService.getAuthHeader()}
        );
    }
}
