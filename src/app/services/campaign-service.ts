import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Campaign } from '../entities/Campaign';
import { Observable } from 'rxjs';
import { CampaignMap } from '../entities/CampaignMap';

@Injectable({providedIn: 'root'})
export class CampaignService {
    readonly apiUrl = 'http://127.0.0.1:8000/api';
    private headers: HttpHeaders = new HttpHeaders();
    private campaignGuid: string = '';

    constructor(private http: HttpClient, private storageService: LocalStorageService) {
        this.headers = this.headers.set('Authorization', 'Bearer ' + this.storageService.getItem('token'));
    }

    public getCampaigns(): Observable<Array<Campaign>> {
        return this.http.get<Array<Campaign>>(`${this.apiUrl}/campaigns`, {headers: this.headers});
    }

    public createCampaign(data: any): Observable<Campaign> {
        return this.http.post<Campaign>(`${this.apiUrl}/campaigns`, data, {headers: this.headers});
    }

    public getCampaign(guid: string): Observable<Campaign> {
        return this.http.get<Campaign>(`${this.apiUrl}/campaigns/${guid}`, {headers: this.headers});
    }

    public setCampaignGuid(guid: string): void {
        this.campaignGuid = guid;
    }

    public createMap(name: string, description: string, image: File): Observable<CampaignMap> {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', image);

        return this.http.post<CampaignMap>(`${this.apiUrl}/campaigns/${this.campaignGuid}/maps`, formData, {headers: this.headers});
    }

    public getMap(guid: string): Observable<CampaignMap> {
        return this.http.get<CampaignMap>(`${this.apiUrl}/campaigns/maps/${guid}`, {headers: this.headers});
    }

    public updateMap(guid: string, data: object ): Observable<CampaignMap> {
        return this.http.patch<CampaignMap>(`${this.apiUrl}/campaigns/maps/${guid}`, data, {headers: this.headers});
    }

    public addCharacterToCampaign(characterGuid: string): Observable<Campaign> {
        return this.http.post<Campaign>(
            `${this.apiUrl}/campaigns/${this.campaignGuid}/characters`,
            {character_guid: characterGuid},
            {headers: this.headers}
        );
    }
}
