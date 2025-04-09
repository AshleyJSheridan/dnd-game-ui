import {Component, input, InputSignal} from '@angular/core';

@Component({
    selector: 'app-damage-icon',
    imports: [],
    templateUrl: './damage-icon.component.html'
})
export class DamageIconComponent {
    readonly patternSymbol: InputSignal<string> = input<string>('');
}
