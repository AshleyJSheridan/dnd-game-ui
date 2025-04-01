import { CampaignMap } from './CampaignMap';
import { Character } from './Character';

export class Campaign {
    guid: string = '';
    name: string = '';
    description: string = '';
    state: 'active' | 'ended' | 'paused' = 'paused';
    created_at: Date = new Date();
    maps: Array<CampaignMap> = [];
    owner: boolean = false;
    players: Array<Character> = [];
}
