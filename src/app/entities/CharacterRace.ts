export class CharacterRace {
    id: number = 0;
    name: string = '';
    description: string = '';
    max_age: number = 0;
    max_height: number = 0;
    speed: number = 0;
    race_traits: Array<{
        name: string;
        description: string;
        type: string;
        ability_details: {}; // todo shape this out, as it's a JSON field in the API
    }> = [];
    sub_races: Array<CharacterRace> = [];
    randomDisplayGender: string = 'female';
}
