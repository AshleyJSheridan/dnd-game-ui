import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule } from '@angular/forms';
import { DiceRolls } from '../../../entities/DiceRolls';
import { CharacterService } from '../../../services/character.service';

@Component({
    selector: 'app-dice-roller',
    imports: [
        HeaderComponent,
        FormsModule
    ],
    templateUrl: './dice-roller.component.html'
})
export class DiceRollerComponent {
    public sides: number = 20;
    public quantity: number = 1;
    public modifier: number = 0;
    public availableSides: Array<number> = [4, 6, 8, 10, 12, 20];
    public rollResults: Array<DiceRolls> = [];
    public modifiers: Array<number> = [];

    constructor(private characterService: CharacterService) {}

    submitHandler(event: Event): void {
        let dice = {};

        if (this.quantity > 0) {
            const key = `d${this.sides}`;
            // @ts-ignore
            dice[key] = this.quantity;

            this.characterService.getGenericDiceRoll(dice).subscribe({
                next: (rolls) => {
                    this.rollResults.push(rolls);
                    this.modifiers.push(this.modifier);
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
    }

    getRollsByGroupFromResult(result: DiceRolls, rollGroup: string): Array<number> {
        // @ts-ignore
        return result.rolls[rollGroup] || [];
    }

    getRollGroupsFromResult(result: DiceRolls): Array<string> {
        return Object.keys(result.rolls);
    }

    getModifierString(modifier: number): string {
        if (modifier >= 0)
            return '+' + modifier.toString();

        return modifier.toString();
    }

    getTotalFromResult(result: DiceRolls, modifier: number): number {
        let total = 0;

        for (const rollGroup in result.rolls) {
            // @ts-ignore
            const rolls = result.rolls[rollGroup] as Array<number>;

            for (const roll of rolls) {
                total += roll;
            }
        }

        return total + modifier;
    }

    getMaxValueForGroup(rollGroup: string): number {
        return parseInt(rollGroup.substring(1));
    }
}
