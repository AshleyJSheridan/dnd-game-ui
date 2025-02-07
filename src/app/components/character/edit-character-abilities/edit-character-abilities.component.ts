import { Component } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import {Character} from '../../../entities/Character';

@Component({
    selector: 'app-edit-character-abilities',
    imports: [],
    templateUrl: './edit-character-abilities.component.html'
})
export class EditCharacterAbilitiesComponent {
    character: Character | undefined;
    abilityDiceRolls: Array<{guid:string;rolls:Array<number>;}> = Array(6).fill({guid:'',rolls:[0,0,0,0]});
    assignedDiceTotals: Array<number> = Array(6).fill(0);

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getCharacter().subscribe((character) => {
            this.character = character;
        });
    }

    getAbilityModifier(ability: {base: number; racialModifier: number;}): string {
        const modifierValue = Math.floor((ability.base + ability.racialModifier - 10) / 2);

        return new Intl.NumberFormat('en-GB', {
            signDisplay: "always"
        }).format(modifierValue);
    }

    getAbilityBaseValue(abilityId: number): number {
        if (this.assignedDiceTotals[abilityId - 1] === 0)
            return 0;

        return this.abilityDiceRolls[this.assignedDiceTotals[abilityId - 1] - 1]?.rolls
            .reduce((acc: number = 0, val: number, index: number) => {return acc += index < 3 ? val : 0}) ?? 0;
    }

    getDiceRollForStat(): void {
        for (let i = 0; i < 6; i ++) {
            this.characterService.getAbilityRoll().subscribe(rolls => {
                this.abilityDiceRolls[i] = {guid: rolls.guid, rolls: rolls.rolls.d6?.sort().reverse() ?? []};
            })
        }
    }

    setRollsForAbility(abilityId: number, event: Event): void {
        this.assignedDiceTotals[abilityId] = Number((<HTMLSelectElement>event.target).value);
    }
}
