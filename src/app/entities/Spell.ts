export class Spell {
    id: number = 0;
    name: string = '';
    description: string = '';
    level: number = 0;
    school: {
        name: string;
        description: string;
    } = {
        name: '',
        description: '',
    };
    cast_time: {
        value: number;
        unit: string;
    } = {
        value: 0,
        unit: '',
    };
    duration: {
        value: number;
        unit: string;
    } = {
        value: 0,
        unit: '',
    };
    components: Array<string> = [];
    concentration: number = 0;
    ritual: number = 0;
    range: string = '';
}
