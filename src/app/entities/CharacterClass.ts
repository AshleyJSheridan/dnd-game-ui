export class CharacterClass {
    id: number = 0;
    name: string = '';
    description: string = '';
    hit_die: number = 6;
    hit_points_at_first_level: number = 6;
    primary_abilities: Array<{name: string, short_name: string}> = [{name: '', short_name: ''}];
    saving_throws: Array<{name: string, short_name: string}> = [];
    armour_proficiencies: Array<{name: string, type: string}> = [];
    weapon_proficiencies: Array<{name: string, type: string}> = [];
    tool_proficiencies: {
        max: number;
        tools: Array<{
            id: number;
            name: string;
            type: string;
        }>;
    } = {max: 0, tools: []}
    class_features: Array<{
        id: number;
        name: string;
        type: string;
        level: number;
        description: string;
    }> = [];
    path: {
        name: string;
        description: string;
        level: number;
        paths: Array<{
            id: number,
            name: string;
            features: Array<{
                id: number;
                name: string;
                type: string;
                level: number;
                description: string;
            }>;
        }>
    } = {
        name: '',
        description: '',
        level: 0,
        paths: [],
    };
    starting_equipment: Array<{
        id: number;
        pack_name: string;
        gold: number;
        items: Array<{
            name: string;
            type: string;
            cost: number;
            cost_unit: string;
            weight?: number;
            weapon_properties?: {
                damage: string;
                damage_type: string;
                range: Array<number>
            }
        }>;
    }> = [];
}
