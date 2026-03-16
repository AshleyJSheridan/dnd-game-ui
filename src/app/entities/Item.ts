import {DamageType} from './DamageType';
import {Spell} from './Spell';

export class Item {
    guid: string = '';
    id: number = 0;
    parent_id: number = 0;
    name: string = '';
    base_name: string = '';
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
    equipped?: boolean = false;
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
        ac: number,
        has_dex_modifier?: boolean,
        dex_modifier_limit?: number,
        stealth_disadvantage?: boolean,
        required_strength?: number,
        ignore_crits?: boolean,
        advantage_skills?: Array<number>,
        initiative_advantage: boolean,
        resistances?: Array<number>,
        bonus?: {
            against: number,
            amount: number,
        }
    };
    special_properties?: {
        classes?: Array<{
            id: string,
            name: string,
        }>
        resistances?: Array<DamageType>,
        immunities?: Array<DamageType>,
        charges?: number,
        recharges?: string,
        recharge_rate?: string,
        spells?: Array<Spell>,
        spell?: Spell,
        extra_damage?: string,
        damage_type?: DamageType,
        slaying?: number,
        creature?: string,
        ability?: {
            id: number,
            type: string,
            damage_type: {
                id: number,
                name: string,
            },
            amount: string,
            name: string,
            short_name: string,
        },
        effects?: string,
        amount?: string,
        duration?: string,
    };
    proficiency: string = '';
    isContainer: boolean = false;
    items: Array<Item> = [];
}
