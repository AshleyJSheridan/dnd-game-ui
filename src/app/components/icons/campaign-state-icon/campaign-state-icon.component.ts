import {Component, input, InputSignal} from '@angular/core';

@Component({
    selector: 'app-campaign-state-icon',
    imports: [],
    templateUrl: './campaign-state-icon.component.html'
})
export class CampaignStateIconComponent {
    readonly campaignState: InputSignal<string|undefined> = input<string>();
}
