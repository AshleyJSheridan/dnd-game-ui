import {Creature} from './Creature';

export class CampaignMapCreature {
    guid: string = '';
    type: string = 'creature';
    x: number = 0;
    y: number = 0;
    highlight_colour: string = '#000000';
    creature: Creature | undefined;
}
