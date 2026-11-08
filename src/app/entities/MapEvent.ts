export class MapEvent {
    action: string = '';
    byUserId: string = '';
    entityGuid: string = '';
    mapGuid: string = '';
    updateAt: Date = new Date();
    entity: {
        entity_name: string;
        highlight_colour: string;
        orientation: number;
        type: string;
        x: number;
        y: number;
        stats: {
            hp: number;
            max_hp: number;
            pattern: string;
            angle: number;
            r: number;
            type: string;
            height: number;
            length: number;
            width: number;
        }
    } = {
        entity_name: '',
        highlight_colour: '#000000',
        orientation: 0,
        type: '',
        x: 0,
        y: 0,
        stats: {
            hp: 0,
            max_hp: 0,
            pattern: '',
            angle: 0,
            r: 0,
            type: '',
            height: 0,
            length: 0,
            width: 0,
        }
    };
}
