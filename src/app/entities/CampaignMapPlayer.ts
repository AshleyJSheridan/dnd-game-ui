export class CampaignMapPlayer {
    guid: string = '';
    type: 'character' | 'creature' | 'object' = 'character';
    x: number = 0;
    y: number = 0;
    highlight_colour: string = '#000000';
    player: {
        name: string;
        guid: string;
        custom_portrait: string;
    } = {
        name: '',
        guid: '',
        custom_portrait: ''
    };
}
