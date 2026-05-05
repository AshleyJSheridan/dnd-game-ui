import { Component, input, InputSignal } from '@angular/core';

@Component({
    selector: 'app-condition-icon',
    imports: [],
    templateUrl: './condition-icon.component.html',
})
export class ConditionIconComponent {
    readonly condition: InputSignal<string|undefined> = input<string>();
}
