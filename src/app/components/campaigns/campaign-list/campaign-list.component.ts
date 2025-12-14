import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import {Router, RouterLink} from '@angular/router';
import { CampaignService } from '../../../services/campaign-service';
import {Campaign, CampaignState} from '../../../entities/Campaign';
import { DatePipe } from '@angular/common';
import { CampaignStateIconComponent } from '../../icons/campaign-state-icon/campaign-state-icon.component';
import {CalendarIconComponent} from '../../icons/calendar-icon/calendar-icon.component';
import {MapPreviewComponent} from '../map-preview/map-preview.component';
import {CampaignMap} from '../../../entities/CampaignMap';
import {ViewIconComponent} from '../../icons/view-icon/view-icon.component';

@Component({
    selector: 'app-campaign-list',
    imports: [
        HeaderComponent,
        DatePipe,
        CampaignStateIconComponent,
        RouterLink,
        CalendarIconComponent,
        MapPreviewComponent,
        ViewIconComponent,
    ],
    templateUrl: './campaign-list.component.html'
})
export class CampaignListComponent {
    campaigns: Array<Campaign> = [];

    constructor(private campaignService: CampaignService, private router: Router) {}

    ngOnInit(): void {
        this.campaignService.getCampaigns().subscribe({
            next: (campaigns) => {
                this.campaigns = campaigns;
            },
            error: (error) => {
                this.router.navigate(['/']);
            }
        });
    }

    setCampaignState(campaign: Campaign, state: string): void {
        const data = {state: state};

        this.campaignService.updateCampaign(data, campaign.guid).subscribe({
            next: (updatedCampaign) => {
                // Only need to update the state, not the whole campaign object.
                const modifiedCampaign = this.campaigns.find((c) => c.guid === campaign.guid);
                if (modifiedCampaign) {
                    modifiedCampaign.state = state as CampaignState;
                }
            },
            error: (error) => {
                console.error('Error updating campaign state:', error);
            }
        });
    }

    hasMaps(campaign: Campaign): boolean {
        if (campaign.maps && campaign.maps.length > 0) {
            //console.log(campaign.maps[0]);
        }

        return campaign.maps && campaign.maps.length > 0;
    }

    getCurrentMap(campaign: Campaign): CampaignMap | undefined {
        return campaign.maps.length > 0 ? campaign.maps[0] : undefined;
    }
}
