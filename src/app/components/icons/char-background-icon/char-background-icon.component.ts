import { Component, input, InputSignal } from '@angular/core';

@Component({
    selector: 'app-char-background-icon',
    imports: [],
    templateUrl: './char-background-icon.component.html'
})
export class CharBackgroundIconComponent {
    readonly charBackgroundName: InputSignal<string|undefined> = input<string>();
}
