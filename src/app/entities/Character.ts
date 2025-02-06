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
        id: string;
        name: string;
        short_name: string;
        description: number;
        value: number;
        modifier: number;
    }> = [];
    created_at: Date = new Date();
}
