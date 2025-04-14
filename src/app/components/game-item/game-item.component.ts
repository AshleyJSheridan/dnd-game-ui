import { Component, input, InputSignal } from '@angular/core';
import { Item } from '../../entities/Item';

@Component({
    selector: 'app-game-item',
    imports: [],
    templateUrl: './game-item.component.html'
})
export class GameItemComponent {
    readonly item: InputSignal<Item|undefined> = input();

    getRarityString(): string {
        return this.item()?.rarity ? (this.item()?.rarity as string).replace(' ', '-') : 'Common';
    }

    getItemRangeString(): string {
        if ((this.item()?.weapon_properties?.range ?? []).length > 1)
            return this.item()?.weapon_properties?.range[0] + '/' + this.item()?.weapon_properties?.range[1];

        return '';
    }
}
