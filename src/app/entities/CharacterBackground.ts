export class CharacterBackground {
    id: number = 0;
    name: string = '';
    description: string = '';
    extra_languages: number = 0;
    gold: number = 0;
    proficiencies: Array<{
        name: string;
        description: string;
        primary_ability: {
            name: string;
            short_name: string;
            description: string;
        }
    }> = [];
    characteristics: Record<string, Array<{
        id: string;
        characteristic: string;
    }>> = {};
}
