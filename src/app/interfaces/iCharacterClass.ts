export interface ICharacterClass {
    id: number;
    name: string;
    hit_die: number;
    hit_points_at_first_level: number;
    primary_abilities: Array<{name: string, short_name: string}>;
    saving_throws: Array<{name: string, short_name: string}>;
    armor_proficiencies: Array<{name: string, type: string}>;
    weapon_proficiencies: Array<{name: string, type: string}>;
    tool_proficiencies: {
        max: number;
        tools: Array<{
            id: number;
            name: string;
            type: string;
        }>;
    }
    class_features: Array<{
        id: number;
        name: string;
        type: string;
        level: number;
        description: string;
    }>;
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
    }>;
}
