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
    classes: Array<string> = [];
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
    component_materials: Array<{
        component: string;
        consume_on_use: boolean;
        'cost': {
            'at_least': number,
            'unit': string,
            'cost_per_target': boolean,
        },
    }> = [];
    concentration: number = 0;
    ritual: number = 0;
    range: string = '';
}
