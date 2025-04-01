import { CampaignMap } from './CampaignMap';

export class Campaign {
    guid: string = '';
    name: string = '';
    description: string = '';
    state: 'active' | 'ended' | 'paused' = 'paused';
    created_at: Date = new Date();
    maps: Array<CampaignMap> = [];
    owner: boolean = false;
}
