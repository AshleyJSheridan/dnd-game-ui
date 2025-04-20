export class Item {
    guid: string = '';
    id: number = 0;
    parent_id: number = 0;
    name: string = '';
    description: string = '';
    type: string = '';
    quantity: number = 1;
    rarity: string = 'common';
    cost: {
        value: number;
        unit: string;
    } = {
        value: 1,
        unit: 'gp',
    };
    weight?: number;
    weapon_props?: {
        damage: {
            amount: string,
            type: string,
        },
        ammo_type: string,
        range: Array<number>,
        weapon_versatility?: string;
    };
    armor_props?: {

    };
    proficiency: string = '';
    isContainer: boolean = false;
    items: Array<Item> = [];
}
