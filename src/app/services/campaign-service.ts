import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Campaign } from '../entities/Campaign';
import { Observable } from 'rxjs';
import { CampaignMap } from '../entities/CampaignMap';
import { Creature } from '../entities/Creature';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class CampaignService {
    readonly apiUrl = 'http://127.0.0.1:8000/api';
    private campaignGuid: string = '';

    constructor(private http: HttpClient, private authService: AuthService) {}

    public getCampaigns(): Observable<Array<Campaign>> {
        return this.http.get<Array<Campaign>>(`${this.apiUrl}/campaigns`, {headers: this.authService.getAuthHeader()});
    }

    public createCampaign(data: any): Observable<Campaign> {
        return this.http.post<Campaign>(`${this.apiUrl}/campaigns`, data, {headers: this.authService.getAuthHeader()});
    }

    public getCampaign(guid: string): Observable<Campaign> {
        return this.http.get<Campaign>(`${this.apiUrl}/campaigns/${guid}`, {headers: this.authService.getAuthHeader()});
    }

    public setCampaignGuid(guid: string): void {
        this.campaignGuid = guid;
    }

    public createMap(name: string, description: string, image: File): Observable<CampaignMap> {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', image);

        return this.http.post<CampaignMap>(
            `${this.apiUrl}/campaigns/${this.campaignGuid}/maps`,
            formData,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getMap(mapGuid: string): Observable<CampaignMap> {
        return this.http.get<CampaignMap>(
            `${this.apiUrl}/campaigns/${this.campaignGuid}/maps/${mapGuid}`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public updateMap(mapGuid: string, data: object ): Observable<CampaignMap> {
        return this.http.patch<CampaignMap>(
            `${this.apiUrl}/campaigns/${this.campaignGuid}/maps/${mapGuid}`,
            data,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public addCharacterToCampaign(characterGuid: string): Observable<Campaign> {
        return this.http.post<Campaign>(
            `${this.apiUrl}/campaigns/${this.campaignGuid}/characters`,
            {character_guid: characterGuid},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public removeCharacterFromCampaign(characterGuid: string): Observable<Campaign> {
        return this.http.delete<Campaign>(
            `${this.apiUrl}/campaigns/${this.campaignGuid}/characters/${characterGuid}`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public addCreatureToMap(type: string, mapGuid: string, x: number, y: number, creatureId: string|number): Observable<CampaignMap> {
        return this.http.post<CampaignMap>(
            `${this.apiUrl}/campaigns/${this.campaignGuid}/maps/${mapGuid}/entities`,
            {
                type: type,
                linked_id: creatureId,
                x: x,
                y: y,
            },
            {headers: this.authService.getAuthHeader()}
        );
    }

    public addDrawingToMap(mapGuid: string, data: object): Observable<CampaignMap> {
        return this.http.post<CampaignMap>(
            `${this.apiUrl}/campaigns/${this.campaignGuid}/maps/${mapGuid}/entities`,
            {type: 'drawing', ...data},
            {headers: this.authService.getAuthHeader()}
        );
    }

    public updateMapEntity(mapGuid: string, entityGuid: string, data: object): Observable<CampaignMap> {
        return this.http.patch<CampaignMap>(
            `${this.apiUrl}/campaigns/${this.campaignGuid}/maps/${mapGuid}/entities/${entityGuid}`,
            data,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public removeMapEntity(mapGuid: string, entityGuid: string): Observable<CampaignMap> {
        return this.http.delete<CampaignMap>(
            `${this.apiUrl}/campaigns/${this.campaignGuid}/maps/${mapGuid}/entities/${entityGuid}`,
            {headers: this.authService.getAuthHeader()}
        );
    }

    public getCreatures(): Observable<Array<Creature>> {
        return this.http.get<Array<Creature>>(`${this.apiUrl}/creatures`, {headers: this.authService.getAuthHeader()});
    }
}
