import { Character } from './Character';

export class CampaignMapPlayer {
    guid: string = '';
    type: string = 'character';
    entity_name: string = '';
    x: number = 0;
    y: number = 0;
    highlight_colour: string = '#000000';
    entity: Character | undefined;
}
