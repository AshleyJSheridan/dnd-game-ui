import {Component, input, InputSignal} from '@angular/core';

@Component({
    selector: 'app-map-pattern',
    imports: [],
    templateUrl: './map-pattern.component.html'
})
export class MapPatternComponent {
    readonly patternSymbol: InputSignal<string> = input<string>('');
    readonly patternId: InputSignal<string> = input<string>('');
    readonly patternColour: InputSignal<string> = input<string>('#000000');
}
