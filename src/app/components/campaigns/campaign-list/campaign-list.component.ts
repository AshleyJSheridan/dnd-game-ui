import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import {Router, RouterLink} from '@angular/router';
import { CampaignService } from '../../../services/campaign-service';
import { Campaign } from '../../../entities/Campaign';
import { DatePipe } from '@angular/common';
import { CampaignStateIconComponent } from '../../icons/campaign-state-icon/campaign-state-icon.component';

@Component({
    selector: 'app-campaign-list',
    imports: [
        HeaderComponent,
        DatePipe,
        CampaignStateIconComponent,
        RouterLink,
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

    }
}
