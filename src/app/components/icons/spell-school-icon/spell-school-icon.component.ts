import {Component, input, InputSignal} from '@angular/core';

@Component({
    selector: 'app-spell-school-icon',
    imports: [],
    templateUrl: './spell-school-icon.component.html'
})
export class SpellSchoolIconComponent {
    readonly spellSchoolName: InputSignal<string|undefined> = input<string>();
}
