import {Component, input, InputSignal} from '@angular/core';

@Component({
    selector: 'app-ability-score',
    imports: [],
    templateUrl: './ability-score.component.html'
})
export class AbilityScoreComponent {
    readonly abilityName: InputSignal<string> = input('');
    readonly abilityBase: InputSignal<number> = input(0);
    readonly abilityModifier: InputSignal<number> = input(0);
}
