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
    abilityDiceRolls: Array<{guid:string;rolls:Array<number>;}> = Array(6).fill({guid:'',rolls:[0,0,0,0]});
    assignedDiceTotals: Array<{abilityId: number; rollIndex: number; guid: string; value: number}> = [];

    constructor(public characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {}

    getAbilityModifier(ability: {id: number; base: number; racialModifier: number;}): string {
        const modifierValue = Math.floor((this.getAbilityBaseValue(ability.id) + ability.racialModifier - 10) / 2);

        return new Intl.NumberFormat('en-GB', {
            signDisplay: "always"
        }).format(modifierValue);
    }

    hasSavedValues(): boolean {
        return this.characterService.character?.abilities[1].base !== undefined;
    }

    getAbilityBaseValue(abilityId: number): number {
        if (this.characterService.character?.abilities[abilityId - 1].base)
            return this.characterService.character?.abilities[abilityId - 1].base;

        const matchedAbilities = this.assignedDiceTotals.filter(totals => {
            return totals.abilityId === abilityId
        });

        if(matchedAbilities.length === 0)
            return 0;

        const matchedAbility = matchedAbilities[0];

        return this.abilityDiceRolls[matchedAbility.rollIndex].rolls
            .reduce((acc: number = 0, val: number, index: number) => {return acc += index < 3 ? val : 0});
    }

    rollAbility(abilityId: number): void {
        this.characterService.getAbilityRoll().subscribe({
            next: (roll) => {
                this.abilityDiceRolls[abilityId - 1] = {guid: roll.guid, rolls: roll.rolls.d6?.sort().reverse() ?? []};
                const rollTotal = this.getRollsTotal(abilityId);

                let matchedAbilities = this.assignedDiceTotals.filter(totals => {
                    return totals.abilityId === abilityId
                });
                if(matchedAbilities.length === 0) {
                    this.assignedDiceTotals.push({abilityId: abilityId, rollIndex: abilityId - 1, guid: roll.guid, value: rollTotal});
                } else {
                    matchedAbilities[0] = {abilityId: abilityId, rollIndex: abilityId - 1, guid: roll.guid, value: rollTotal};
                }
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    getRollsTotal(abilityId: number): number {
        return this.abilityDiceRolls[abilityId - 1].rolls[0]
            + this.abilityDiceRolls[abilityId - 1].rolls[1]
            + this.abilityDiceRolls[abilityId - 1].rolls[2];
    }

    confirmAbilities(): void {
        if(this.assignedDiceTotals.length !== 6)
            return;

        this.characterService.setAbilityRolls(this.assignedDiceTotals).subscribe(character => {
            this.router.navigate([`/characters/${character.guid}/edit/languages`]);
        })
    }
}
