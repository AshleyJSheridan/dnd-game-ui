import {Component, EventEmitter, input, InputSignal, Output} from '@angular/core';
import { CampaignMap } from '../../../entities/CampaignMap';
import {CampaignService} from '../../../services/campaign-service';
import {RouterLink} from '@angular/router';
import {DeleteIconComponent} from '../../icons/delete-icon/delete-icon.component';
import {EyeOffIconComponent} from '../../icons/eye-off-icon/eye-off-icon.component';
import {EyeOnIconComponent} from '../../icons/eye-on-icon/eye-on-icon.component';
import {CrownIconComponent} from '../../icons/crown-icon/crown-icon.component';

@Component({
    selector: 'app-map-preview',
    imports: [
        RouterLink,
        DeleteIconComponent,
        EyeOffIconComponent,
        EyeOnIconComponent,
        CrownIconComponent
    ],
    templateUrl: './map-preview.component.html'
})
export class MapPreviewComponent {
    constructor(private campaignService: CampaignService){};

    readonly campaignMap: InputSignal<CampaignMap|undefined> = input();
    readonly campaignGuid: InputSignal<string> = input('');

    @Output() updateMapEvent = new EventEmitter();
    @Output() deleteMapEvent = new EventEmitter();

    getThumbUrl(): string {
        return `${this.campaignService.apiUrl}/campaigns/maps/${this.campaignMap()?.guid}/thumb`;
    }

    deleteMap(event: MouseEvent): void {
        this.deleteMapEvent.emit(event);
    }

    toggleMapVisibility(): void {
        const newVisibility = this.campaignMap()!.hidden ? 0 : 1;

        this.campaignService.updateMap(this.campaignMap()!.guid, {hidden: newVisibility}).subscribe({
            next: (campaignMap) => {
                this.updateMapEvent.emit(campaignMap);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    makeActive(): void {
        this.campaignService.updateMap(this.campaignMap()!.guid, {active: 1}).subscribe({
            next: (campaignMap) => {
                this.updateMapEvent.emit(campaignMap);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}
