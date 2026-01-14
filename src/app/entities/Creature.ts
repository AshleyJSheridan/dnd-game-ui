export class Creature {
    id: number = 0;
    name: string = '';
    description: string = '';
    size: string = '';
    type: string = '';
    alignment: string = '';
    armor: {
        wears_armor: boolean;
        armor_class: number;
    } = {
        wears_armor: false,
        armor_class: 0
    };
    hit_points: {
        dice_amount: number;
        dice_sides: string;
        plus_fixed: number;
        hp: number;
        max_hp: number;
    } = {
        dice_amount: 1,
        dice_sides: 'd6',
        plus_fixed: 0,
        hp: 0,
        max_hp: 0,
    };
    speed: {
        walk: number;
        swim?: number;
        fly?: number;
        climb?: number;
        burrow?: number;
    } = {
        walk: 0,
    };
    challenge_rating: number = 0;
    abilities: {
        cha: {base: number; modifier: number};
        con: {base: number; modifier: number};
        dex: {base: number; modifier: number};
        int: {base: number; modifier: number};
        str: {base: number; modifier: number};
        wis: {base: number; modifier: number};
    } = {
        cha: {base: 0, modifier: 0},
        con: {base: 0, modifier: 0},
        dex: {base: 0, modifier: 0},
        int: {base: 0, modifier: 0},
        str: {base: 0, modifier: 0},
        wis: {base: 0, modifier: 0}
    };
    saving_throws: {
        cha?: {base: number; modifier: number};
        con?: {base: number; modifier: number};
        dex?: {base: number; modifier: number};
        int?: {base: number; modifier: number};
        str?: {base: number; modifier: number};
        wis?: {base: number; modifier: number};
    } = {};
    skill_modifiers: {
        Acrobatics?: number;
        Animal_handling?: number;
        Arcana?: number;
        Athletics?: number;
        Deception?: number;
        History?: number;
        Insight?: number;
        Intimidation?: number;
        Investigation?: number;
        Medicine?: number;
        Nature?: number;
        Perception?: number;
        Performance?: number;
        Persuasion?: number;
        Religion?: number;
        Sleight_of_hand?: number;
        Stealth?: number;
        Survival?: number;
    } = {};
    resistances: {
        immunities?: Array<string>;
        resistances?: Array<string>;
        vulnerabilities?: Array<string>;
    } = {
        immunities: [],
        resistances: [],
        vulnerabilities: []
    };
    senses: {
        Blindsight?: number;
        Darkvision?: number;
        Tremorsense?: number;
        Truesight?: number;
    } = {};
    languages: Array<{
        id: number;
        name: string;
        script: string;
    }> = [];

}
