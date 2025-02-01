import {Component, input, InputSignal} from '@angular/core';

@Component({
  selector: 'app-char-class-icon',
  imports: [],
  templateUrl: './char-class-icon.component.html'
})
export class CharClassIconComponent {
    readonly charClassName: InputSignal<string|undefined> = input<string>();
}
