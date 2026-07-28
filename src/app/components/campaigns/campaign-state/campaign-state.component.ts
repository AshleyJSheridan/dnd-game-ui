import {Component, EventEmitter, input, InputSignal, Output} from '@angular/core';
import { Campaign, CampaignState } from '../../../entities/Campaign';
import { CampaignStateIconComponent } from '../../icons/campaign-state-icon/campaign-state-icon.component';
import { RouterLink } from '@angular/router';
import { CalendarIconComponent} from '../../icons/calendar-icon/calendar-icon.component';
import { DatePipe} from '@angular/common';
import { MapPreviewComponent } from '../map-preview/map-preview.component';
import { CampaignMap } from '../../../entities/CampaignMap';
import { ViewIconComponent } from '../../icons/view-icon/view-icon.component';
import { CampaignService } from '../../../services/campaign-service';
import {DeleteIconComponent} from '../../icons/delete-icon/delete-icon.component';

@Component({
    selector: 'app-campaign-state',
    imports: [
        CampaignStateIconComponent,
        RouterLink,
        CalendarIconComponent,
        DatePipe,
        MapPreviewComponent,
        ViewIconComponent,
        DeleteIconComponent
    ],
    templateUrl: './campaign-state.component.html'
})
export class CampaignStateComponent {
    readonly campaign: InputSignal<Campaign|undefined> = input();
    readonly showFullDetails: InputSignal<boolean> = input(false);

    @Output() deleteCampaignEvent = new EventEmitter();

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

    deleteCampaign(): void {
        if (!this.campaign()) {
            console.error('No campaign selected for deletion.');
            return;
        }

        this.campaignService.deleteCampaign(this.campaign()!.guid).subscribe({
            next: () => {
                this.deleteCampaignEvent.emit(this.campaign()!.guid);
            },
            error: (error) => {
                console.error('Error deleting campaign:', error);
            }
        });
    }
}
