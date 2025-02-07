export class DiceRolls {
    guid: string = '';
    rolls: {
        d4?: Array<number>;
        d6?: Array<number>;
        d8?: Array<number>;
        d10?: Array<number>;
        d12?: Array<number>;
        d20?: Array<number>;
    } = {};
}
