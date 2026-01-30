import { Component, input, InputSignal } from '@angular/core';
import { Item } from '../../../entities/Item';

@Component({
    selector: 'app-inventory-list',
    imports: [],
    templateUrl: './inventory-list.component.html'
})
export class InventoryListComponent {
    readonly items: InputSignal<Array<Item>> = input<Array<Item>>([]);
    readonly itemTypes: string[] = [
        'armor',
        'artisan',
        'art object',
        'bag',
        'book',
        'clothing',
        'food',
        'gaming',
        'gemstone',
        'instrument',
        'other',
        'pack',
        'potion',
        'projectile',
        'weapon',
    ];
    selectedItemFilter: string = '';

    getAllItems(containerItems: Array<Item>): Array<Item> {
        let items: Array<Item> = [];

        containerItems.forEach(item => {
            items.push(item);

            if (item.isContainer && item.items.length > 0) {
                items = items.concat(this.getAllItems(item.items));
            }
        });

        return items;
    }

    getTotalWeight(): number {
        const allItems = this.getAllItems(this.items());
        let weight = 0;

        allItems.forEach(item => {
            if (item.weight) {
                weight += item.weight * item.quantity;
            }
        });

        return weight;
    }

    setItemFilter(event: Event): void {
        this.selectedItemFilter = (<HTMLInputElement>event.target).value;
    }
}
