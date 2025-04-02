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
    assignedDiceTotals: Array<{abilityId: number; rollIndex: number; guid: string;}> = [];

    constructor(public characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {}

    getAbilityModifier(ability: {id: number; base: number; racialModifier: number;}): string {
        const modifierValue = Math.floor((this.getAbilityBaseValue(ability.id) + ability.racialModifier - 10) / 2);

        return new Intl.NumberFormat('en-GB', {
            signDisplay: "always"
        }).format(modifierValue);
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

    getDiceRollForStat(): void {
        for (let i = 0; i < 6; i ++) {
            this.characterService.getAbilityRoll().subscribe(rolls => {
                this.abilityDiceRolls[i] = {guid: rolls.guid, rolls: rolls.rolls.d6?.sort().reverse() ?? []};
            })
        }
    }

    setRollsForAbility(event: Event, rollIndex: number): void {
        const abilityId = Number((<HTMLSelectElement>event.target).value)

        // ensure we're not setting the same rolls to more than one ability
        const abilityExists = this.assignedDiceTotals.filter(totals => {
            return totals.abilityId === abilityId
        });

        if (abilityExists.length === 0) {
            this.assignedDiceTotals.push({
                abilityId: abilityId,
                rollIndex: rollIndex,
                guid: this.abilityDiceRolls[rollIndex].guid
            });
        }
    }


    canShowAbilityInSelectList(rollIndex: number, abilityId: number): boolean {
        const abilityExists = this.assignedDiceTotals.filter(totals => {
            return totals.abilityId === abilityId
        });

        return !(abilityExists.length > 0 && abilityExists[0].rollIndex !== rollIndex);
    }

    confirmAbilities(): void {
        this.characterService.setAbilityRolls(this.assignedDiceTotals).subscribe(character => {
            this.router.navigate([`/characters/${character.guid}/edit/languages`]);
        })
    }
}
