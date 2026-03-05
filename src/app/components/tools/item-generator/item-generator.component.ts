import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../entities/Item';
import { GameItemComponent } from '../../game-item/game-item.component';

@Component({
    selector: 'app-item-generator',
    imports: [
        HeaderComponent,
        FormsModule,
        GameItemComponent
    ],
    templateUrl: './item-generator.component.html'
})
export class ItemGeneratorComponent {
    public itemType: string = 'armor';
    readonly itemTypes: string[] = [
        'armor',
        'art object',
        'book',
        'clothing',
        'food',
        'gemstone',
        'other',
        'potion',
        'projectile',
        'weapon',
    ];
    public rarity: string = 'common';
    // TODO eventually add legendary items to this, once they actually get added to the DB.
    readonly rarities: string[] = [
        'common',
        'uncommon',
        'rare',
        'very rare',
    ];
    public item: Item | undefined = undefined;

    constructor(private itemService: ItemService) {}

    submitHandler(event: Event): void {
        this.itemService.getItemByTypeAndRarity(this.itemType, this.rarity).subscribe({
            next: (item) => {
                this.item = item;
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    saveAndMoveItem(item: Item): void {
        console.log(item);
    }
}
