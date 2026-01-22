import { Creature } from './Creature';

export class CampaignMapCreature {
    guid: string = '';
    type: string = 'creature';
    entity_name: string = '';
    x: number = 0;
    y: number = 0;
    highlight_colour: string = '#000000';
    visible: boolean = true;
    entity: Creature | undefined;
}
