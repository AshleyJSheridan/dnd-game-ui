import { Item } from './Item';

export class ItemMoveEvent {
    item: Item;
    destination: ItemMoveDestination;

    constructor(item: Item, destination: ItemMoveDestination = ItemMoveDestination.CHARACTER) {
        this.item = item;
        this.destination = destination;
    }
}

export enum ItemMoveDestination {
    CHARACTER = 'character',
    GENERATED_LIST = 'generatedList',
}
