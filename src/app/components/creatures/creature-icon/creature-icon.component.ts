import { Component, input, InputSignal } from '@angular/core';
import { Creature } from '../../../entities/Creature';

@Component({
    selector: 'app-creature-icon',
    imports: [],
    templateUrl: './creature-icon.component.html',
})
export class CreatureIconComponent {
    readonly creature: InputSignal<Creature|undefined> = input();
}
