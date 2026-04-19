import { Creature } from './Creature';

export class Encounter {
    guid: string = '';
    type: string = '';
    description: string = '';
    environment: string = '';
    difficulty: number = 1;
    party_difficulty: number = 0;
    creatures: Array<{
        guid: string;
        creature_details: Creature;
    }> = [];
    created_at: Date = new Date();
}
