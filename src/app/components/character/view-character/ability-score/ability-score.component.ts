import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-ability-score',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './ability-score.component.html'
})
export class AbilityScoreComponent {
    readonly abilityShortName: InputSignal<string> = input('');
    readonly abilityName: InputSignal<string> = input('');
    readonly abilityDescription: InputSignal<string> = input('');
    readonly abilityBase: InputSignal<number> = input(0);
    readonly abilityModifier: InputSignal<number> = input(0);

    @Output() updateAbility = new EventEmitter();
    @Output() rollAbilityEvent = new EventEmitter();

    public editMode: boolean = false;

    public setEditAbility(event: FocusEvent) {
        this.editMode = true;
    }

    public updateAbilityValue(event: FocusEvent) {
        const inputElement = event.target as HTMLInputElement;
        const updatedAbility = {name: this.abilityShortName(), value: parseInt(inputElement.value, 10)};

        this.updateAbility.emit(updatedAbility);

        this.editMode = false;
    }

    public rollAbility(): void {
        this.rollAbilityEvent.emit({modifier: this.abilityModifier(), ability: this.abilityName()});
    }
}
