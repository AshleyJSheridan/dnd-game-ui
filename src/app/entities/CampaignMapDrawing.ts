export class CampaignMapDrawing {
    guid: string = '';
    type: string = 'drawing';
    entity_name: string = '';
    x: number = 0;
    y: number = 0;
    highlight_colour: string = '#000000';
    stats: {
        width?: number;
        height?: number;
        r?: number;
        pattern?: string;
        type?: string;
        length?: number;
        angle?: number;
    } = {};
}
