import {CampaignMapPlayer} from './CampaignMapPlayer';
import {CampaignMapCreature} from './CampaignMapCreature';
import {CampaignMapDrawing} from './CampaignMapDrawing';

export class CampaignMap {
    guid: string = '';
    name: string = '';
    description: string = '';
    image: string = '';
    created_at: Date = new Date();
    width: number = 0;
    height: number = 0;
    show_grid: boolean = false;
    grid_size: number = 0;
    grid_colour: string = '#ffffff';
    players: Array<CampaignMapPlayer> = [];
    creatures: Array<CampaignMapCreature> = [];
    drawings: Array<CampaignMapDrawing> = [];
}
