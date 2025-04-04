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
    players: Array<{
        guid: string;
        type: 'character' | 'creature' | 'object';
        x: number;
        y: number;
        highlight_colour: string;
        player: {
            name: string;
            guid: string;
            custom_portrait: string;
        };
    }> = [];
}
