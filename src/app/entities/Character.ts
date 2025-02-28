export class Character {
    name: string = '';
    guid: string = '';
    level: number = 1;
    charClass: string = '';
    charBackground: {
        name: string;
        characteristics: Array<{
            id: number;
            characteristic_type: string;
            details: string;
        }>
    } = {
        name: '',
        characteristics: []
    };
    charRace: string = '';
    abilities: Array<{
        id: number;
        name: string;
        short_name: string;
        description: number;
        base: number;
        modifier: number;
        racialModifier: number;
    }> = [];
    languages : {
        available: number;
        known: Array<{
            id: number;
            name: string;
            script: string;
        }>
    } = {
        available: 0,
        known: []
    };
    magic: {
        hasMagic: boolean;
        learned_spells: Array<{
            id: number;
            name: string;
            description: string;
            level: number;
            school: {
                name: string;
                description: string;
            };
            cast_time: {
                value: number;
                unit: string;
            };
            duration: {
                value: number;
                unit: string;
            };
            range: string;
            components: Array<string>;
            concentration: number;
            ritual: number;
        }>;
        other_known_spells: Array<{
            id: number;
            name: string;
            description: string;
            level: number;
            school: {
                name: string;
                description: string;
            };
            cast_time: {
                value: number;
                unit: string;
            };
            duration: {
                value: number;
                unit: string;
            };
            range: string;
            components: Array<string>;
            concentration: number;
            ritual: number;
        }>;
    } = {
        hasMagic: false,
        learned_spells: [],
        other_known_spells: [],
    };
    created_at: Date = new Date();
}
