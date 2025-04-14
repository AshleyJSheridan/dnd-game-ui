export class Item {
    name: string = '';
    description: string = '';
    type: string = '';
    total: number = 1;
    cost: number = 1;
    cost_unit: string = 'gp';
    weight?: number;
    weapon_properties?: {
        damage: string;
        damage_type: string;
        range: Array<number>,
        weapon_versatility?: string;
    };
    isContainer: boolean = false;
    items: Array<Item> = [];
}
