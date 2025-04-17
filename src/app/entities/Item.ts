export class Item {
    id: number = 0;
    parent_id: number = 0;
    name: string = '';
    description: string = '';
    type: string = '';
    rarity: string = 'common';
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
    proficiency: string = '';
    isContainer: boolean = false;
    items: Array<Item> = [];
}
