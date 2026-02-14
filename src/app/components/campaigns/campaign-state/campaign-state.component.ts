import { Component, input, InputSignal } from '@angular/core';
import { Campaign, CampaignState } from '../../../entities/Campaign';
import { CampaignStateIconComponent } from '../../icons/campaign-state-icon/campaign-state-icon.component';
import { RouterLink } from '@angular/router';
import { CalendarIconComponent} from '../../icons/calendar-icon/calendar-icon.component';
import { DatePipe} from '@angular/common';
import { MapPreviewComponent } from '../map-preview/map-preview.component';
import { CampaignMap } from '../../../entities/CampaignMap';
import { ViewIconComponent } from '../../icons/view-icon/view-icon.component';
import { CampaignService } from '../../../services/campaign-service';

@Component({
    selector: 'app-campaign-state',
    imports: [
        CampaignStateIconComponent,
        RouterLink,
        CalendarIconComponent,
        DatePipe,
        MapPreviewComponent,
        ViewIconComponent
    ],
    templateUrl: './campaign-state.component.html'
})
export class CampaignStateComponent {
    readonly campaign: InputSignal<Campaign|undefined> = input();

    constructor(private campaignService: CampaignService) {}

    hasMaps(): boolean {
        if (!this.campaign())
            return false;

        return this.campaign()!.maps && this.campaign()!.maps.length > 0;
    }

    getCurrentMap(): CampaignMap | undefined {
        return this.campaign() && this.campaign()!.maps.length > 0 ? this.campaign()!.maps[0] : undefined;
    }

    setCampaignState(state: string): void {
        const data = {state: state};

        this.campaignService.updateCampaign(data, this.campaign()!.guid).subscribe({
            next: (updatedCampaign) => {
                this.campaign()!.state = state as CampaignState;
            },
            error: (error) => {
                console.error('Error updating campaign state:', error);
            }
        });
    }
}
