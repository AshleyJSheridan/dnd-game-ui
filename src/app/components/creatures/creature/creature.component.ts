import { Component, input, InputSignal } from '@angular/core';
import { Creature } from '../../../entities/Creature';

@Component({
    selector: 'app-creature',
    imports: [],
    templateUrl: './creature.component.html'
})
export class CreatureComponent {
    readonly creature: InputSignal<Creature|undefined> = input();
}
