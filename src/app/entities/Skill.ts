export class Skill {
    id: number = 0;
    name: string = '';
    description: string = '';
    primary_ability: {
        name: string;
        short_name: string;
        description: string;
    } = {
        name: '',
        short_name: '',
        description: ''
    }
}
