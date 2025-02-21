import { Component, input, InputSignal } from '@angular/core';

@Component({
    selector: 'app-char-class-feature-icon',
    imports: [],
    templateUrl: './char-class-feature-icon.component.html'
})
export class CharClassFeatureIconComponent {
    readonly charClassFeatureName: InputSignal<string|undefined> = input<string>();
}
