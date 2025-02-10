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
    }
    created_at: Date = new Date();
}
