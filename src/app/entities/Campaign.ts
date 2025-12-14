import { CampaignMap } from './CampaignMap';
import { Character } from './Character';
import { CampaignLore } from './CampaignLore';

export class Campaign {
    guid: string = '';
    name: string = '';
    description: string = '';
    state: CampaignState = CampaignState.PAUSED;
    created_at: Date = new Date();
    lore: Array<CampaignLore> = [];
    maps: Array<CampaignMap> = [];
    owner: boolean = false;
    players: Array<Character> = [];
}

export enum CampaignState {
    ACTIVE = 'active',
    ENDED = 'ended',
    PAUSED = 'paused'
}
