import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-item-type-icon',
  imports: [],
  templateUrl: './item-type-icon.component.html'
})
export class ItemTypeIconComponent {
    readonly itemType: InputSignal<string> = input('');
    readonly itemBaseName: InputSignal<string> = input('');

    getNormalisedItemBaseName(): string {
        return this.itemBaseName().toLowerCase().replace(/ /g, '-');
    }
}
