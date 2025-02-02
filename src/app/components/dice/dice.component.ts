import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';

@Component({
    selector: 'app-dice',
    imports: [],
    templateUrl: './dice.component.html'
})
export class DiceComponent {
    sides: InputSignal<any> = input<any>(0);

    @Output() rollEvent = new EventEmitter();

    handleDiceRoll(): void {
        this.rollEvent.emit({value: (Math.floor(Math.random() * this.sides()) + 1)});
    }
}
