import { Component, input, InputSignal } from '@angular/core';
import {Item} from '../../entities/Item';

@Component({
    selector: 'app-game-item',
    imports: [],
    templateUrl: './game-item.component.html'
})
export class GameItemComponent {
    readonly itemName: InputSignal<string> = input<string>('');
    readonly itemDescription: InputSignal<string> = input<string>('');
    readonly itemType: InputSignal<string> = input<string>('');
    readonly subItems: InputSignal<Array<Item>> = input<Array<Item>>([]);
}
