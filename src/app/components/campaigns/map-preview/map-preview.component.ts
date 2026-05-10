import {Component, EventEmitter, input, InputSignal, Output, ViewChild} from '@angular/core';
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
    public editName: boolean = false;
    public editDescription: boolean = false;

    readonly campaignMap: InputSignal<CampaignMap|undefined> = input();
    readonly campaignGuid: InputSignal<string> = input('');
    readonly showFullDetails: InputSignal<boolean> = input(false);

    @Output() updateMapEvent = new EventEmitter();
    @Output() deleteMapEvent = new EventEmitter();

    @ViewChild('campaignMapName') campaignMapName: any | undefined;
    @ViewChild('campaignMapDescription') campaignMapDescription: any | undefined;

    constructor(private campaignService: CampaignService){};

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

    setEditName(): void {
        this.editName = true;
    }

    updateName(): void {
        this.editName = false;

        this.updateCampaignMap({name: this.campaignMapName.nativeElement.value})
    }

    setEditDescription(): void {
        this.editDescription = true;
    }

    updateDescription(): void {
        this.editDescription = false;

        this.updateCampaignMap({description: this.campaignMapDescription.nativeElement.value})
    }

    updateCampaignMap(data: any): void {
        console.log('wtf', data);
        if (!this.campaignMap)
            return;

        this.campaignService.updateCampaignMap(data, this.campaignGuid(), this.campaignMap()!.guid).subscribe({
            next: (campaignMap) => {
                this.campaignMap()!.name = campaignMap.name;
                this.campaignMap()!.description = campaignMap.description;
            },
            error: (error) => {

            }
        })
    }
}
