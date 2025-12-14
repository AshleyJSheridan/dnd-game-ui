import {Component, EventEmitter, input, InputSignal, Output} from '@angular/core';
import { CampaignLore, CampaignLoreType } from '../../../entities/CampaignLore';
import { ReadIconComponent } from '../../icons/read-icon/read-icon.component';
import {LinkIconComponent} from '../../icons/link-icon/link-icon.component';
import {CampaignService} from '../../../services/campaign-service';
import {PdfIconComponent} from '../../icons/pdf-icon/pdf-icon.component';
import {DeleteIconComponent} from '../../icons/delete-icon/delete-icon.component';

@Component({
    selector: 'app-lore',
    imports: [
        ReadIconComponent,
        LinkIconComponent,
        PdfIconComponent,
        DeleteIconComponent
    ],
    templateUrl: './lore.component.html'
})
export class LoreComponent {
    constructor(private campaignService: CampaignService){};

    readonly loreItem: InputSignal<CampaignLore|undefined> = input();
    readonly campaignGuid: InputSignal<string|undefined> = input();

    @Output() loreReadEvent = new EventEmitter();
    @Output() loreDeleteEvent = new EventEmitter();

    protected readonly CampaignLoreType = CampaignLoreType;

    public readLore(event: MouseEvent): void {
        this.loreReadEvent.emit(event);
    }

    public deleteLore(event: MouseEvent): void {
        this.loreDeleteEvent.emit(event);
    }

    getThumbUrl(): string {
        return `${this.campaignService.apiUrl}/campaigns/${this.campaignGuid()}/lore/${this.loreItem()?.guid}/thumb`;
    }

    getFileUrl(): string {
        return `${this.campaignService.apiUrl}/campaigns/${this.campaignGuid()}/lore/${this.loreItem()?.guid}`;
    }
}
