import { Component, input, InputSignal } from '@angular/core';
import { CampaignMap } from '../../../entities/CampaignMap';
import {CampaignService} from '../../../services/campaign-service';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-map-preview',
    imports: [
        RouterLink
    ],
    templateUrl: './map-preview.component.html'
})
export class MapPreviewComponent {
    constructor(private campaignService: CampaignService){};

    readonly campaignMap: InputSignal<CampaignMap|undefined> = input();
    readonly campaignGuid: InputSignal<string> = input('');

    getThumbUrl(): string {
        return `${this.campaignService.apiUrl}/campaigns/maps/${this.campaignMap()?.guid}/thumb`;
    }
}
