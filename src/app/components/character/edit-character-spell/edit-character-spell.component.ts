import { Component, input, InputSignal } from '@angular/core';
import { Spell } from '../../../entities/Spell';
import {SpellSchoolIconComponent} from '../../icons/spell-school-icon/spell-school-icon.component';
import {SpellComponentIconComponent} from '../../icons/spell-component-icon/spell-component-icon.component';

@Component({
    selector: 'app-edit-character-spell',
    imports: [
        SpellSchoolIconComponent,
        SpellComponentIconComponent
    ],
    templateUrl: './edit-character-spell.component.html'
})
export class EditCharacterSpellComponent {
    readonly spell: InputSignal<Spell|undefined> = input<Spell>();

    public getFormattedRange(range: string|undefined): string {
        if (range === undefined)
            return '';

        if (parseInt(range).toString() === range)
            return `${range} ft`;

        return range;
    }
}
