import { Component, input, InputSignal } from '@angular/core';

@Component({
    selector: 'app-spell-component-icon',
    imports: [],
    templateUrl: './spell-component-icon.component.html'
})
export class SpellComponentIconComponent {
    readonly spellComponentName: InputSignal<string|undefined> = input<string>();
}
