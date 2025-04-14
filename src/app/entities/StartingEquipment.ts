import { Item } from './Item';

export class StartingEquipment {
    id: number = 0;
    choice_name: string = '';
    type: string = '';
    gold: number = 0;
    items: Array<Item> = [];
}
