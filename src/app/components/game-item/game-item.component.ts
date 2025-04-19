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
        if ((this.item()?.weapon_props?.range ?? []).length > 1)
            return this.item()?.weapon_props?.range[0] + '/' + this.item()?.weapon_props?.range[1];

        return '';
    }

    getItemCost(): string {
        if (this.item()?.cost.value) {
            const value = (this.item()?.cost?.value ?? 0) * (this.item()?.quantity ?? 1);

            return `${value} ${this.item()?.cost.unit}`;
        }

        return '';
    }

    getItemWeight(): string {
        if (this.item()?.weight)
            return ((this.item()?.weight ?? 0) * (this.item()?.quantity ?? 1)).toString();

        return '';
    }
}
